/* eslint-disable no-console */
import { ExecutionContext } from '@/calculators/executionContext';
import { AllConstants } from '@/constants/types';
import { testContext } from '@/test/Grains/context';
import { collectInputs } from '@/tools/collect';
import { Container } from '@/tools/containers';
import { formatNamedValues } from '@/tools/format';
import { ModuleNames } from '@/tools/modules';
import { NumberUnit } from '@/tools/units';
import XLSX from 'xlsx-populate';
import { expectInputsTaggedForModule } from './module-tagging';

type ExtractedDetails<
  Input,
  Output = number,
  Extraction = { input: NonNullable<Input>; output: Output; outputRow: number },
> = {
  results: Extraction[];
  firstRow: number;
  method: '1' | '2';
};

const defaultOutputGetter =
  (columnName: string) => (sheet: XLSX.Sheet, row: number) =>
    Number(sheet.cell(`${columnName}${row}`).value());

type CreateSheetExtractorOptions = { rowInterval?: number };
export const createSheetExtractor =
  <
    Input,
    Output = number,
    Extraction = {
      input: NonNullable<Input>;
      output: Output;
      outputRow: number;
    },
  >(
    getCalculatorInput: (
      sheet: XLSX.Sheet,
      row: number,
      method: '1' | '2',
      runtimeOptions: { isLeapYear: boolean },
    ) => Input | undefined,
    getExpectedOutput: ((sheet: XLSX.Sheet, row: number) => Output) | string,
    extractOptions?: CreateSheetExtractorOptions,
  ) =>
  (
    sheet: XLSX.Sheet,
    firstRow: number,
    method: '1' | '2',
    runtimeOptions: { expectedTests?: number; isLeapYear?: boolean } = {},
  ): { results: Extraction[]; firstRow: number; method: '1' | '2' } => {
    const rowInterval = extractOptions?.rowInterval ?? 1;
    const expectedTests = runtimeOptions?.expectedTests;
    const isLeapYear = runtimeOptions?.isLeapYear ?? false;

    const outputGetter =
      typeof getExpectedOutput === 'string'
        ? defaultOutputGetter(getExpectedOutput)
        : getExpectedOutput;
    let currentRow = firstRow;
    let finished = false;
    const results: Extraction[] = [];
    while (!finished) {
      const input = getCalculatorInput(sheet, currentRow, method, {
        isLeapYear,
      });
      if (input) {
        const output = outputGetter(sheet, currentRow);
        const extraction: Extraction = {
          input,
          output,
          outputRow: currentRow,
        } as Extraction;
        results.push(extraction);
      } else {
        finished = true;
      }
      currentRow += rowInterval;
    }
    if (expectedTests && results.length !== expectedTests) {
      throw new Error(
        `Expected to discover ${expectedTests} test cases, but got ${results.length}`,
      );
    }
    return { results, firstRow, method };
  };

export const compareInputsAndOutputs = <
  Input,
  Output extends number = number,
  Actual extends Container<NumberUnit> = Container<NumberUnit>,
>(
  extracted: ExtractedDetails<Input, Output>,
  calcModule: (input: Input, context: ExecutionContext<AllConstants>) => Actual,
  /**
   * Every input touched by `calcModule` (per `collectInputs`) must be tagged with
   * this module id in its `modules` metadata. See `module-tagging.ts`.
   */
  moduleId: ModuleNames,
) => {
  const context = testContext();
  const { results, method } = extracted;

  if (results.length === 0) {
    throw new Error('No results found in sheet');
  }

  for (let i = 0; i < results.length; i++) {
    // const rowIndex = firstRow + i;
    const { input, output, outputRow } = results[i];
    let actual: Actual | undefined = undefined;
    try {
      actual = calcModule(input, context);
      // NOTE: divide by 1000 is because mass units are stored in kg, but module results are always in tonnes
      expect(actual.unit.store.value.div(1000).toNumber()).toBeCloseTo(
        output,
        8,
      );
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error(`Row ${outputRow} (0-based sheet row): ${message}`);
      if (actual) {
        console.log(
          formatNamedValues(actual, {
            maxDepth: 7,
          }),
        );
      }
      throw e;
    }

    try {
      expectInputsTaggedForModule(actual, moduleId);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error(`Row ${outputRow} (0-based sheet row): ${message}`);
      throw e;
    }

    /**
     * For cases where no input (i.e. undefined, empty array) was passed. In such cases,
     * the result is neither method 1 nor method 2.
     *
     * NOTE: This scenario first came up with the solid waste scope 1 tests, only certain
     * inputs result in certain gas emissions, e.g. No biologically treated solid waste
     * means no N2O emissions. The zero doesn't result from the method 2 calculation,
     * the category of output just doesn't apply.
     */
    const isEscapeHatchValue =
      collectInputs(actual).length === 0 && actual.unit.store.value.equals(0);

    if (!isEscapeHatchValue) {
      const isTestCaseForMethod2 = method === '2';
      try {
        expect(actual.unit.store.hasMethod2()).toBe(isTestCaseForMethod2);
      } catch (e) {
        if (isTestCaseForMethod2) {
          console.error(
            `Row ${outputRow} (0-based sheet row): Calculation result '${actual.core?.name}' did not include a method 2 value, when it should have`,
          );
        } else {
          console.error(
            `Row ${outputRow} (0-based sheet row): Calculation result '${actual.core?.name}' included a method 2 value, when it should not have`,
          );
        }
        throw e;
      }
    }
  }
};
