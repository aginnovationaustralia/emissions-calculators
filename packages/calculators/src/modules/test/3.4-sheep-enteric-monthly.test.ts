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
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculate34SheepEntericMethane } from '../scope1/3-enteric-methane/3.4-sheep-enteric';
import { checkLimitedState } from './livestock-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const columnState = 'B';
const columnLambingRate = 'F';
const columnMarkingRate = 'G';
const columnCustomLiveweight = 'O';
const columnCustomDryMatterAvailability = 'J';
const columnCustomDryMatterDigestibility = 'L';
const columnHead = 'U';
const columnCustomAverageDurationDays = 'W';
const columnOutput = 'Z';

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
    const customLiveweight = cell(columnCustomLiveweight, offsetRows);
    const customDryMatterAvailability = cell(
      columnCustomDryMatterAvailability,
      offsetRows,
    );
    const customDryMatterDigestibility = cell(
      columnCustomDryMatterDigestibility,
      offsetRows,
    );
    const customAverageDurationDays = cell(
      columnCustomAverageDurationDays,
      offsetRows,
    );
    return {
      head: Number(cell(columnHead, offsetRows)),
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
    if (cell(columnHead, offsetRows) === undefined) {
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
    if (cell(columnHead, offsetRows) === undefined) {
      return undefined;
    }
    return {
      january: {
        ...readSheepClassPeriod(offsetRows),
        percentLambing: Number(cell(columnLambingRate, offsetRows)),
        percentLambMarking: Number(cell(columnMarkingRate, offsetRows)),
      },
      february: {
        ...readSheepClassPeriod(offsetRows + 1),
        percentLambing: Number(cell(columnLambingRate, offsetRows + 1)),
        percentLambMarking: Number(cell(columnMarkingRate, offsetRows + 1)),
      },
      march: {
        ...readSheepClassPeriod(offsetRows + 2),
        percentLambing: Number(cell(columnLambingRate, offsetRows + 2)),
        percentLambMarking: Number(cell(columnMarkingRate, offsetRows + 2)),
      },
      april: {
        ...readSheepClassPeriod(offsetRows + 3),
        percentLambing: Number(cell(columnLambingRate, offsetRows + 3)),
        percentLambMarking: Number(cell(columnMarkingRate, offsetRows + 3)),
      },
      may: {
        ...readSheepClassPeriod(offsetRows + 4),
        percentLambing: Number(cell(columnLambingRate, offsetRows + 4)),
        percentLambMarking: Number(cell(columnMarkingRate, offsetRows + 4)),
      },
      june: {
        ...readSheepClassPeriod(offsetRows + 5),
        percentLambing: Number(cell(columnLambingRate, offsetRows + 5)),
        percentLambMarking: Number(cell(columnMarkingRate, offsetRows + 5)),
      },
      july: {
        ...readSheepClassPeriod(offsetRows + 6),
        percentLambing: Number(cell(columnLambingRate, offsetRows + 6)),
        percentLambMarking: Number(cell(columnMarkingRate, offsetRows + 6)),
      },
      august: {
        ...readSheepClassPeriod(offsetRows + 7),
        percentLambing: Number(cell(columnLambingRate, offsetRows + 7)),
        percentLambMarking: Number(cell(columnMarkingRate, offsetRows + 7)),
      },
      september: {
        ...readSheepClassPeriod(offsetRows + 8),
        percentLambing: Number(cell(columnLambingRate, offsetRows + 8)),
        percentLambMarking: Number(cell(columnMarkingRate, offsetRows + 8)),
      },
      october: {
        ...readSheepClassPeriod(offsetRows + 9),
        percentLambing: Number(cell(columnLambingRate, offsetRows + 9)),
        percentLambMarking: Number(cell(columnMarkingRate, offsetRows + 9)),
      },
      november: {
        ...readSheepClassPeriod(offsetRows + 10),
        percentLambing: Number(cell(columnLambingRate, offsetRows + 10)),
        percentLambMarking: Number(cell(columnMarkingRate, offsetRows + 10)),
      },
      december: {
        ...readSheepClassPeriod(offsetRows + 11),
        percentLambing: Number(cell(columnLambingRate, offsetRows + 11)),
        percentLambMarking: Number(cell(columnMarkingRate, offsetRows + 11)),
      },
    };
  };

  const sheepInput: SheepInput = {
    state: checkLimitedState(cell(columnState)),
    electricity: {
      method: 'location',
      electricityPurchasedKWh: 0,
    },
    flocks: [
      {
        classes: {
          rams: readSheepClass(0),
          wethers: readSheepClass(1),
          breedingEwes: readSheepClassWithLambing(2),
          lambsHoggets: readSheepClass(3),
        },
      },
    ],
  };

  // console.dir(sheepInput.flocks[0].classes.rams, { depth: null });

  return SheepInputSchema.parse(sheepInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${columnOutput}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 30 },
);

describe('3.4.1.1 Sheep enteric methane monthly', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.4-sheep-enteric.xlsx',
      '3.4.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 331, '2');

    compareInputsAndOutputs(inputsAndOutputs, calculate34SheepEntericMethane);
  });

  // it('method 2 matches spreadsheet results', async () => {
  //   const sheet = await getSheet(
  //     './src/modules/test/3.4-sheep-enteric.xlsx',
  //     '3.4.1.1',
  //   );

  //   const inputsAndOutputs = extractInputsAndOutput(sheet, 201, '2');

  //   compareInputsAndOutputs(inputsAndOutputs, calculate34SheepEntericMethane);
  // });
});
