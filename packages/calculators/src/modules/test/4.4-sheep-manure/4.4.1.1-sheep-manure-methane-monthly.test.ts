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
    const customAverageDurationDays = cell(
      col.columnCustomAverageDurationDays,
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
      method2AverageDurationDays:
        method === '2' && customAverageDurationDays
          ? Number(customAverageDurationDays)
          : undefined,
    };
  };

  const readSheepClass = (offset: number): SheepClassInput | undefined => {
    const offsetRows = offset * 12;
    if (cell(col.columnHead, offsetRows) === undefined) {
      return undefined;
    }
    return {
      january: readSheepClassPeriod(offsetRows),
      february: readSheepClassPeriod(offsetRows + 1),
      march: readSheepClassPeriod(offsetRows + 2),
      april: readSheepClassPeriod(offsetRows + 3),
      may: readSheepClassPeriod(offsetRows + 4),
      june: readSheepClassPeriod(offsetRows + 5),
      july: readSheepClassPeriod(offsetRows + 6),
      august: readSheepClassPeriod(offsetRows + 7),
      september: readSheepClassPeriod(offsetRows + 8),
      october: readSheepClassPeriod(offsetRows + 9),
      november: readSheepClassPeriod(offsetRows + 10),
      december: readSheepClassPeriod(offsetRows + 11),
    };
  };

  const readSheepClassWithLambing = (
    offset: number,
  ): SheepClassWithLambingInput | undefined => {
    const offsetRows = offset * 12;
    if (cell(col.columnHead, offsetRows) === undefined) {
      return undefined;
    }
    return {
      january: {
        ...readSheepClassPeriod(offsetRows),
        percentLambing: Number(cell(col.columnLambingRateLR, offsetRows)),
        percentLambMarking: Number(cell(col.columnMarkingRateLMR, offsetRows)),
      },
      february: {
        ...readSheepClassPeriod(offsetRows + 1),
        percentLambing: Number(cell(col.columnLambingRateLR, offsetRows + 1)),
        percentLambMarking: Number(
          cell(col.columnMarkingRateLMR, offsetRows + 1),
        ),
      },
      march: {
        ...readSheepClassPeriod(offsetRows + 2),
        percentLambing: Number(cell(col.columnLambingRateLR, offsetRows + 2)),
        percentLambMarking: Number(
          cell(col.columnMarkingRateLMR, offsetRows + 2),
        ),
      },
      april: {
        ...readSheepClassPeriod(offsetRows + 3),
        percentLambing: Number(cell(col.columnLambingRateLR, offsetRows + 3)),
        percentLambMarking: Number(
          cell(col.columnMarkingRateLMR, offsetRows + 3),
        ),
      },
      may: {
        ...readSheepClassPeriod(offsetRows + 4),
        percentLambing: Number(cell(col.columnLambingRateLR, offsetRows + 4)),
        percentLambMarking: Number(
          cell(col.columnMarkingRateLMR, offsetRows + 4),
        ),
      },
      june: {
        ...readSheepClassPeriod(offsetRows + 5),
        percentLambing: Number(cell(col.columnLambingRateLR, offsetRows + 5)),
        percentLambMarking: Number(
          cell(col.columnMarkingRateLMR, offsetRows + 5),
        ),
      },
      july: {
        ...readSheepClassPeriod(offsetRows + 6),
        percentLambing: Number(cell(col.columnLambingRateLR, offsetRows + 6)),
        percentLambMarking: Number(
          cell(col.columnMarkingRateLMR, offsetRows + 6),
        ),
      },
      august: {
        ...readSheepClassPeriod(offsetRows + 7),
        percentLambing: Number(cell(col.columnLambingRateLR, offsetRows + 7)),
        percentLambMarking: Number(
          cell(col.columnMarkingRateLMR, offsetRows + 7),
        ),
      },
      september: {
        ...readSheepClassPeriod(offsetRows + 8),
        percentLambing: Number(cell(col.columnLambingRateLR, offsetRows + 8)),
        percentLambMarking: Number(
          cell(col.columnMarkingRateLMR, offsetRows + 8),
        ),
      },
      october: {
        ...readSheepClassPeriod(offsetRows + 9),
        percentLambing: Number(cell(col.columnLambingRateLR, offsetRows + 9)),
        percentLambMarking: Number(
          cell(col.columnMarkingRateLMR, offsetRows + 9),
        ),
      },
      november: {
        ...readSheepClassPeriod(offsetRows + 10),
        percentLambing: Number(cell(col.columnLambingRateLR, offsetRows + 10)),
        percentLambMarking: Number(
          cell(col.columnMarkingRateLMR, offsetRows + 10),
        ),
      },
      december: {
        ...readSheepClassPeriod(offsetRows + 11),
        percentLambing: Number(cell(col.columnLambingRateLR, offsetRows + 11)),
        percentLambMarking: Number(
          cell(col.columnMarkingRateLMR, offsetRows + 11),
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
          rams: readSheepClass(2),
          wethers: readSheepClass(3),
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

    const inputsAndOutputs = extractInputsAndOutput(sheet, 231, '2');

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
