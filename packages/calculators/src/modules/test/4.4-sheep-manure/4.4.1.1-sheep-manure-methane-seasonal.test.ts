import {
  SheepInput,
  SheepInputSchema,
  SheepInputTransformed,
} from '@/calculators/Sheep/types/input';
import type { SheepClassPeriodInput } from '@/calculators/Sheep/types/sheep-class-period.input';
import {
  SheepClassInput,
  SheepClassWithLambingInput,
} from '@/calculators/Sheep/types/sheep-class.input';
import { calculate_4_4_1_1_SheepManureMethane } from '@/modules/scope1/4-manure-management/4.4-sheep-manure';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { checkPureStateWithoutNT } from '../livestock-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import * as col from './columns';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): SheepInputTransformed | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const readSheepClassPeriod = (offsetRows: number): SheepClassPeriodInput => {
    const customLiveweight = cell(col.columnCustomLiveweight, offsetRows);
    const customDryMatterAvailability = cell(
      col.columnCustomDryMatterAvailability,
      offsetRows,
    );
    const customDryMatterDigestibility = cell(
      col.columnCustomDryMatterDigestibility,
      offsetRows,
    );
    return {
      head: Number(cell(col.columnHead, offsetRows)),
      method2Liveweight:
        method === '2' && customLiveweight
          ? Number(customLiveweight)
          : undefined,
      method2DryMatterAvailability:
        method === '2' && customDryMatterAvailability
          ? Number(customDryMatterAvailability)
          : undefined,
      method2DryMatterDigestibility:
        method === '2' && customDryMatterDigestibility
          ? Number(customDryMatterDigestibility)
          : undefined,
    };
  };

  const readSheepClass = (offset: number): SheepClassInput | undefined => {
    const offsetRows = offset * 4;
    if (cell(col.columnHead, offsetRows) === undefined) {
      return undefined;
    }
    return {
      spring: readSheepClassPeriod(offsetRows),
      summer: readSheepClassPeriod(offsetRows + 1),
      autumn: readSheepClassPeriod(offsetRows + 2),
      winter: readSheepClassPeriod(offsetRows + 3),
    };
  };

  const readSheepClassWithLambing = (
    offset: number,
  ): SheepClassWithLambingInput | undefined => {
    const offsetRows = offset * 4;
    if (cell(col.columnHead, offsetRows) === undefined) {
      return undefined;
    }
    return {
      spring: {
        ...readSheepClassPeriod(offsetRows),
        percentLambing: Number(cell(col.columnLambingRateLR, offsetRows)),
        percentLambMarking: Number(cell(col.columnMarkingRateLMR, offsetRows)),
      },
      summer: {
        ...readSheepClassPeriod(offsetRows + 1),
        percentLambing: Number(cell(col.columnLambingRateLR, offsetRows + 1)),
        percentLambMarking: Number(
          cell(col.columnMarkingRateLMR, offsetRows + 1),
        ),
      },
      autumn: {
        ...readSheepClassPeriod(offsetRows + 2),
        percentLambing: Number(cell(col.columnLambingRateLR, offsetRows + 2)),
        percentLambMarking: Number(
          cell(col.columnMarkingRateLMR, offsetRows + 2),
        ),
      },
      winter: {
        ...readSheepClassPeriod(offsetRows + 3),
        percentLambing: Number(cell(col.columnLambingRateLR, offsetRows + 3)),
        percentLambMarking: Number(
          cell(col.columnMarkingRateLMR, offsetRows + 3),
        ),
      },
    };
  };

  const sheepInput: SheepInput = {
    state: checkPureStateWithoutNT(cell(col.columnState)),
    electricity: {
      method: 'location',
      electricityPurchasedKWh: 0,
    },
    flocks: [
      {
        noUnfencedNaturalWater:
          cell(col.columnNoUnfencedNaturalWater) === 'yes',
        classes: {
          breedingEwes: readSheepClassWithLambing(0),
          lambsHoggets: readSheepClass(1),
          maidenEwes: readSheepClassWithLambing(2),
          otherEwes: readSheepClass(3),
          rams: readSheepClass(4),
          wethers: readSheepClass(5),
        },
      },
    ],
  };

  // console.dir(sheepInput, { depth: null });

  return SheepInputSchema.parse(sheepInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${col.columnOutputECH4}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 30 },
);

describe('4.4.1.1 Sheep manure methane seasonal', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.4-sheep-manure/4.4-sheep-manure.xlsx',
      '4.4.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_4_4_1_1_SheepManureMethane,
    );
  });

  it.skip('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.4-sheep-enteric.xlsx',
      '3.4.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 201, '2');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate_4_4_1_1_SheepManureMethane,
    );
  });
});
