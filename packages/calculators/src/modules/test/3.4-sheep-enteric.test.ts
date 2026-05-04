import {
  SheepInput,
  SheepInputSchema,
  SheepInputTransformed,
} from '@/calculators/Sheep/types/input';
import type { SheepClassSeasonInput } from '@/calculators/Sheep/types/sheep-class-season.input';
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
const columnLambingRate = 'E';
const columnMarkingRate = 'F';
const columnCustomLiveweight = 'N';
const columnCustomDryMatterAvailability = 'I';
const columnCustomDryMatterDigestibility = 'K';
const columnHead = 'T';
const columnOutput = 'X';

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

  const readSheepClassSeason = (offsetRows: number): SheepClassSeasonInput => {
    const customLiveweight = cell(columnCustomLiveweight, offsetRows);
    const customDryMatterAvailability = cell(
      columnCustomDryMatterAvailability,
      offsetRows,
    );
    const customDryMatterDigestibility = cell(
      columnCustomDryMatterDigestibility,
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
    };
  };

  const readSheepClass = (offset: number): SheepClassInput | undefined => {
    const offsetRows = offset * 4;
    if (cell(columnHead, offsetRows) === undefined) {
      return undefined;
    }
    return {
      spring: readSheepClassSeason(offsetRows),
      summer: readSheepClassSeason(offsetRows + 1),
      autumn: readSheepClassSeason(offsetRows + 2),
      winter: readSheepClassSeason(offsetRows + 3),
    };
  };

  const readSheepClassWithLambing = (
    offset: number,
  ): SheepClassWithLambingInput | undefined => {
    const offsetRows = offset * 4;
    if (cell(columnHead, offsetRows) === undefined) {
      return undefined;
    }
    return {
      spring: {
        ...readSheepClassSeason(offsetRows),
        percentLambing: Number(cell(columnLambingRate, offsetRows)),
        percentLambMarking: Number(cell(columnMarkingRate, offsetRows)),
      },
      summer: {
        ...readSheepClassSeason(offsetRows + 1),
        percentLambing: Number(cell(columnLambingRate, offsetRows + 1)),
        percentLambMarking: Number(cell(columnMarkingRate, offsetRows + 1)),
      },
      autumn: {
        ...readSheepClassSeason(offsetRows + 2),
        percentLambing: Number(cell(columnLambingRate, offsetRows + 2)),
        percentLambMarking: Number(cell(columnMarkingRate, offsetRows + 2)),
      },
      winter: {
        ...readSheepClassSeason(offsetRows + 3),
        percentLambing: Number(cell(columnLambingRate, offsetRows + 3)),
        percentLambMarking: Number(cell(columnMarkingRate, offsetRows + 3)),
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
          maidenEwes: readSheepClassWithLambing(2),
          breedingEwes: readSheepClassWithLambing(3),
          otherEwes: readSheepClass(4),
          lambsHoggets: readSheepClass(5),
        },
      },
    ],
  };

  // console.dir(sheepInput, { depth: null });

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

describe('3.4.1.1 Sheep enteric methane', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.4-sheep-enteric.xlsx',
      '3.4.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculate34SheepEntericMethane);
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.4-sheep-enteric.xlsx',
      '3.4.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 201, '2');

    compareInputsAndOutputs(inputsAndOutputs, calculate34SheepEntericMethane);
  });
});
