import {
  SheepInput,
  SheepInputSchema,
  SheepInputTransformed,
} from '@/calculators/Sheep/types/input';
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

// const columnScenario = 'A';
const columnState = 'B';
const columnLambingRate = 'E';
const columnMarkingRate = 'F';
const columnCustomLiveweight = 'N';
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

  const readSheepClass = (offset: number): SheepClassInput | undefined => {
    const offsetRows = offset * 4;
    const springHeadRaw = cell(columnHead, offsetRows);
    if (springHeadRaw === undefined) {
      return undefined;
    }
    const springHead = Number(springHeadRaw);
    const summerHead = Number(cell(columnHead, offsetRows + 1));
    const autumnHead = Number(cell(columnHead, offsetRows + 2));
    const winterHead = Number(cell(columnHead, offsetRows + 3));
    const springLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweight, offsetRows));
    const summerLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweight, offsetRows + 1));
    const autumnLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweight, offsetRows + 2));
    const winterLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweight, offsetRows + 3));

    return {
      spring: {
        head: springHead,
        method2Liveweight: springLiveweight,
      },
      summer: {
        head: summerHead,
        method2Liveweight: summerLiveweight,
      },
      autumn: {
        head: autumnHead,
        method2Liveweight: autumnLiveweight,
      },
      winter: {
        head: winterHead,
        method2Liveweight: winterLiveweight,
      },
    };
  };

  const readSheepClassWithLambing = (
    offset: number,
  ): SheepClassWithLambingInput | undefined => {
    const offsetRows = offset * 4;
    const springHeadRaw = cell(columnHead, offsetRows);
    if (springHeadRaw === undefined) {
      return undefined;
    }
    const springHead = Number(springHeadRaw);
    const summerHead = Number(cell(columnHead, offsetRows + 1));
    const autumnHead = Number(cell(columnHead, offsetRows + 2));
    const winterHead = Number(cell(columnHead, offsetRows + 3));
    const springPercentLambing = Number(cell(columnLambingRate, offsetRows));
    const summerPercentLambing = Number(
      cell(columnLambingRate, offsetRows + 1),
    );
    const autumnPercentLambing = Number(
      cell(columnLambingRate, offsetRows + 2),
    );
    const winterPercentLambing = Number(
      cell(columnLambingRate, offsetRows + 3),
    );
    const springPercentLambMarking = Number(
      cell(columnMarkingRate, offsetRows),
    );
    const summerPercentLambMarking = Number(
      cell(columnMarkingRate, offsetRows + 1),
    );
    const autumnPercentLambMarking = Number(
      cell(columnMarkingRate, offsetRows + 2),
    );
    const winterPercentLambMarking = Number(
      cell(columnMarkingRate, offsetRows + 3),
    );
    const springLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweight, offsetRows));
    const summerLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweight, offsetRows + 1));
    const autumnLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweight, offsetRows + 2));
    const winterLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweight, offsetRows + 3));

    return {
      spring: {
        head: springHead,
        method2Liveweight: springLiveweight,
        percentLambing: springPercentLambing,
        percentLambMarking: springPercentLambMarking,
      },
      summer: {
        head: summerHead,
        method2Liveweight: summerLiveweight,
        percentLambing: summerPercentLambing,
        percentLambMarking: summerPercentLambMarking,
      },
      autumn: {
        head: autumnHead,
        method2Liveweight: autumnLiveweight,
        percentLambing: autumnPercentLambing,
        percentLambMarking: autumnPercentLambMarking,
      },
      winter: {
        head: winterHead,
        method2Liveweight: winterLiveweight,
        percentLambing: winterPercentLambing,
        percentLambMarking: winterPercentLambMarking,
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

  // console.dir(dairyInput, { depth: null });

  return SheepInputSchema.parse(sheepInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${columnOutput}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 40 },
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

  it.skip('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.4-sheep-enteric.xlsx',
      '3.4.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 61, '2');

    compareInputsAndOutputs(inputsAndOutputs, calculate34SheepEntericMethane);
  });
});
