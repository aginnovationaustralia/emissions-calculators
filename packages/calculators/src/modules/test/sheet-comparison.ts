/* eslint-disable no-console */
import { ExecutionContext } from '@/calculators/executionContext';
import { AllConstants } from '@/constants/types';
import { testContext } from '@/test/Grains/context';
import { Container } from '@/tools/containers';
import { formatNamedValues } from '@/tools/format';
import { NumberUnit } from '@/tools/units';
import XLSX from 'xlsx-populate';

type ExtractedDetails<
  Input,
  Output = number,
  Extraction = { input: NonNullable<Input>; output: Output; outputRow: number },
> = {
  results: Extraction[];
  firstRow: number;
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
    ) => Input | undefined,
    getExpectedOutput: ((sheet: XLSX.Sheet, row: number) => Output) | string,
    options?: CreateSheetExtractorOptions,
  ) =>
  (
    sheet: XLSX.Sheet,
    firstRow: number,
    method: '1' | '2',
  ): { results: Extraction[]; firstRow: number } => {
    const rowInterval = options?.rowInterval ?? 1;
    const outputGetter =
      typeof getExpectedOutput === 'string'
        ? defaultOutputGetter(getExpectedOutput)
        : getExpectedOutput;
    let currentRow = firstRow;
    let finished = false;
    const results: Extraction[] = [];
    while (!finished) {
      const input = getCalculatorInput(sheet, currentRow, method);
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
    return { results, firstRow };
  };

export const compareInputsAndOutputs = <
  Input,
  Output extends number = number,
  Actual extends Container<NumberUnit> = Container<NumberUnit>,
>(
  extracted: ExtractedDetails<Input, Output>,
  calcModule: (input: Input, context: ExecutionContext<AllConstants>) => Actual,
) => {
  const context = testContext();
  const { results } = extracted;

  if (results.length === 0) {
    throw new Error('No results found in sheet');
  }

  for (let i = 0; i < results.length; i++) {
    // const rowIndex = firstRow + i;
    const { input, output, outputRow } = results[i];
    let actual: Actual | undefined = undefined;
    try {
      actual = calcModule(input, context);
      expect(actual.unit.value.div(1000).toNumber()).toBeCloseTo(output, 8);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error(`Row ${outputRow} (0-based sheet row): ${message}`);
      if (actual) {
        // console.log(formatExpression(actual));
        // console.log(formatIntermediates(actual));
        console.log(
          // formatNamedValues(actual, { maxDepth: 5, focusOn: 'MNSoilm=3a' }),
          // formatNamedValues(actual, { maxDepth: 6, focusOn: 'AUmms=3a' }),
          // formatNamedValues(actual, { maxDepth: 8, focusOn: 'CPIj=' }),
          // formatNamedValues(actual, { maxDepth: 7, focusOn: 'AUmms,m=3a' }),
          formatNamedValues(actual, {
            maxDepth: 5,
            // focusOn: 'NIj=1',
          }),
        );
      }
      throw e;
    }
  }
};
