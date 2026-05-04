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
    const springCustomLiveweight = cell(columnCustomLiveweight, offsetRows);
    const summerCustomLiveweight = cell(columnCustomLiveweight, offsetRows + 1);
    const autumnCustomLiveweight = cell(columnCustomLiveweight, offsetRows + 2);
    const winterCustomLiveweight = cell(columnCustomLiveweight, offsetRows + 3);
    const springCustomDryMatterAvailability = cell(
      columnCustomDryMatterAvailability,
      offsetRows,
    );
    const summerCustomDryMatterAvailability = cell(
      columnCustomDryMatterAvailability,
      offsetRows + 1,
    );
    const autumnCustomDryMatterAvailability = cell(
      columnCustomDryMatterAvailability,
      offsetRows + 2,
    );
    const winterCustomDryMatterAvailability = cell(
      columnCustomDryMatterAvailability,
      offsetRows + 3,
    );
    const springCustomDryMatterDigestibility = cell(
      columnCustomDryMatterDigestibility,
      offsetRows,
    );
    const summerCustomDryMatterDigestibility = cell(
      columnCustomDryMatterDigestibility,
      offsetRows + 1,
    );
    const autumnCustomDryMatterDigestibility = cell(
      columnCustomDryMatterDigestibility,
      offsetRows + 2,
    );
    const winterCustomDryMatterDigestibility = cell(
      columnCustomDryMatterDigestibility,
      offsetRows + 3,
    );
    const springLiveweight =
      method === '2' && springCustomLiveweight
        ? Number(springCustomLiveweight)
        : undefined;
    const summerLiveweight =
      method === '2' && summerCustomLiveweight
        ? Number(summerCustomLiveweight)
        : undefined;
    const autumnLiveweight =
      method === '2' && autumnCustomLiveweight
        ? Number(autumnCustomLiveweight)
        : undefined;
    const winterLiveweight =
      method === '2' && winterCustomLiveweight
        ? Number(winterCustomLiveweight)
        : undefined;
    const springDryMatterAvailability =
      method === '2' && springCustomDryMatterAvailability
        ? Number(springCustomDryMatterAvailability)
        : undefined;
    const summerDryMatterAvailability =
      method === '2' && summerCustomDryMatterAvailability
        ? Number(summerCustomDryMatterAvailability)
        : undefined;
    const autumnDryMatterAvailability =
      method === '2' && autumnCustomDryMatterAvailability
        ? Number(autumnCustomDryMatterAvailability)
        : undefined;
    const winterDryMatterAvailability =
      method === '2' && winterCustomDryMatterAvailability
        ? Number(winterCustomDryMatterAvailability)
        : undefined;
    const springDryMatterDigestibility =
      method === '2' && springCustomDryMatterDigestibility
        ? Number(springCustomDryMatterDigestibility)
        : undefined;
    const summerDryMatterDigestibility =
      method === '2' && summerCustomDryMatterDigestibility
        ? Number(summerCustomDryMatterDigestibility)
        : undefined;
    const autumnDryMatterDigestibility =
      method === '2' && autumnCustomDryMatterDigestibility
        ? Number(autumnCustomDryMatterDigestibility)
        : undefined;
    const winterDryMatterDigestibility =
      method === '2' && winterCustomDryMatterDigestibility
        ? Number(winterCustomDryMatterDigestibility)
        : undefined;
    return {
      spring: {
        head: springHead,
        method2Liveweight: springLiveweight,
        method2DryMatterAvailability: springDryMatterAvailability,
        method2DryMatterDigestibility: springDryMatterDigestibility,
      },
      summer: {
        head: summerHead,
        method2Liveweight: summerLiveweight,
        method2DryMatterAvailability: summerDryMatterAvailability,
        method2DryMatterDigestibility: summerDryMatterDigestibility,
      },
      autumn: {
        head: autumnHead,
        method2Liveweight: autumnLiveweight,
        method2DryMatterAvailability: autumnDryMatterAvailability,
        method2DryMatterDigestibility: autumnDryMatterDigestibility,
      },
      winter: {
        head: winterHead,
        method2Liveweight: winterLiveweight,
        method2DryMatterAvailability: winterDryMatterAvailability,
        method2DryMatterDigestibility: winterDryMatterDigestibility,
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
    const springCustomLiveweight = cell(columnCustomLiveweight, offsetRows);
    const summerCustomLiveweight = cell(columnCustomLiveweight, offsetRows + 1);
    const autumnCustomLiveweight = cell(columnCustomLiveweight, offsetRows + 2);
    const winterCustomLiveweight = cell(columnCustomLiveweight, offsetRows + 3);
    const springCustomDryMatterAvailability = cell(
      columnCustomDryMatterAvailability,
      offsetRows,
    );
    const summerCustomDryMatterAvailability = cell(
      columnCustomDryMatterAvailability,
      offsetRows + 1,
    );
    const autumnCustomDryMatterAvailability = cell(
      columnCustomDryMatterAvailability,
      offsetRows + 2,
    );
    const winterCustomDryMatterAvailability = cell(
      columnCustomDryMatterAvailability,
      offsetRows + 3,
    );
    const springCustomDryMatterDigestibility = cell(
      columnCustomDryMatterDigestibility,
      offsetRows,
    );
    const summerCustomDryMatterDigestibility = cell(
      columnCustomDryMatterDigestibility,
      offsetRows + 1,
    );
    const autumnCustomDryMatterDigestibility = cell(
      columnCustomDryMatterDigestibility,
      offsetRows + 2,
    );
    const winterCustomDryMatterDigestibility = cell(
      columnCustomDryMatterDigestibility,
      offsetRows + 3,
    );
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
      method === '2' && springCustomLiveweight
        ? Number(springCustomLiveweight)
        : undefined;
    const summerLiveweight =
      method === '2' && summerCustomLiveweight
        ? Number(summerCustomLiveweight)
        : undefined;
    const autumnLiveweight =
      method === '2' && autumnCustomLiveweight
        ? Number(autumnCustomLiveweight)
        : undefined;
    const winterLiveweight =
      method === '2' && winterCustomLiveweight
        ? Number(winterCustomLiveweight)
        : undefined;
    const springDryMatterAvailability =
      method === '2' && springCustomDryMatterAvailability
        ? Number(springCustomDryMatterAvailability)
        : undefined;
    const summerDryMatterAvailability =
      method === '2' && summerCustomDryMatterAvailability
        ? Number(summerCustomDryMatterAvailability)
        : undefined;
    const autumnDryMatterAvailability =
      method === '2' && autumnCustomDryMatterAvailability
        ? Number(autumnCustomDryMatterAvailability)
        : undefined;
    const winterDryMatterAvailability =
      method === '2' && winterCustomDryMatterAvailability
        ? Number(winterCustomDryMatterAvailability)
        : undefined;
    const springDryMatterDigestibility =
      method === '2' && springCustomDryMatterDigestibility
        ? Number(springCustomDryMatterDigestibility)
        : undefined;
    const summerDryMatterDigestibility =
      method === '2' && summerCustomDryMatterDigestibility
        ? Number(summerCustomDryMatterDigestibility)
        : undefined;
    const autumnDryMatterDigestibility =
      method === '2' && autumnCustomDryMatterDigestibility
        ? Number(autumnCustomDryMatterDigestibility)
        : undefined;
    const winterDryMatterDigestibility =
      method === '2' && winterCustomDryMatterDigestibility
        ? Number(winterCustomDryMatterDigestibility)
        : undefined;
    return {
      spring: {
        head: springHead,
        method2Liveweight: springLiveweight,
        method2DryMatterAvailability: springDryMatterAvailability,
        method2DryMatterDigestibility: springDryMatterDigestibility,
        percentLambing: springPercentLambing,
        percentLambMarking: springPercentLambMarking,
      },
      summer: {
        head: summerHead,
        method2Liveweight: summerLiveweight,
        method2DryMatterAvailability: summerDryMatterAvailability,
        method2DryMatterDigestibility: summerDryMatterDigestibility,
        percentLambing: summerPercentLambing,
        percentLambMarking: summerPercentLambMarking,
      },
      autumn: {
        head: autumnHead,
        method2Liveweight: autumnLiveweight,
        method2DryMatterAvailability: autumnDryMatterAvailability,
        method2DryMatterDigestibility: autumnDryMatterDigestibility,
        percentLambing: autumnPercentLambing,
        percentLambMarking: autumnPercentLambMarking,
      },
      winter: {
        head: winterHead,
        method2Liveweight: winterLiveweight,
        method2DryMatterAvailability: winterDryMatterAvailability,
        method2DryMatterDigestibility: winterDryMatterDigestibility,
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
  it.skip('method 1 matches spreadsheet results', async () => {
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
