import {
  SheepInput,
  SheepInputSchema,
  SheepInputTransformed,
} from '@/calculators/Sheep/types/input';
import type { SheepClassPeriodInput } from '@/calculators/Sheep/types/sheep-class-period.input';
import {
  SheepClassInput,
  SheepClassWithLambingInput,
  SheepClassWithProportionLambsBornInput,
} from '@/calculators/Sheep/types/sheep-class.input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculate34SheepEntericMethane } from '../../scope1/3-enteric-methane/3.4-sheep-enteric';
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
      greasyWoolProduction: 0,
      cleanWoolYieldProportion: 0,
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
      greasyWoolProduction: 0,
      cleanWoolYieldProportion: 0,
      spring: {
        ...readSheepClassPeriod(offsetRows),
        percentLambing: Number(cell(col.columnLambingRate, offsetRows)),
        percentLambMarking: Number(cell(col.columnMarkingRate, offsetRows)),
      },
      summer: {
        ...readSheepClassPeriod(offsetRows + 1),
        percentLambing: Number(cell(col.columnLambingRate, offsetRows + 1)),
        percentLambMarking: Number(cell(col.columnMarkingRate, offsetRows + 1)),
      },
      autumn: {
        ...readSheepClassPeriod(offsetRows + 2),
        percentLambing: Number(cell(col.columnLambingRate, offsetRows + 2)),
        percentLambMarking: Number(cell(col.columnMarkingRate, offsetRows + 2)),
      },
      winter: {
        ...readSheepClassPeriod(offsetRows + 3),
        percentLambing: Number(cell(col.columnLambingRate, offsetRows + 3)),
        percentLambMarking: Number(cell(col.columnMarkingRate, offsetRows + 3)),
      },
    };
  };

  const readSheepClassWithProportionLambsBorn = (
    offset: number,
  ): SheepClassWithProportionLambsBornInput | undefined => {
    const offsetRows = offset * 4;
    if (cell(col.columnHead, offsetRows) === undefined) {
      return undefined;
    }
    return {
      greasyWoolProduction: 0,
      cleanWoolYieldProportion: 0,
      spring: {
        ...readSheepClassPeriod(offsetRows),
        proportionOfLambsBorn: 0,
      },
      summer: {
        ...readSheepClassPeriod(offsetRows + 1),
        proportionOfLambsBorn: 0,
      },
      autumn: {
        ...readSheepClassPeriod(offsetRows + 2),
        proportionOfLambsBorn: 0,
      },
      winter: {
        ...readSheepClassPeriod(offsetRows + 3),
        proportionOfLambsBorn: 0,
      },
    };
  };

  const sheepInput: SheepInput = {
    state: checkPureStateWithoutNT(cell(col.columnState)),
    climateZone: 'Boreal dry',
    isInLeachingZone: false,
    rainfallAbove600: false,
    electricity: {
      method: 'location',
      electricityPurchasedKWh: 0,
    },
    flocks: [
      {
        noUnfencedNaturalWater: false,
        classes: {
          rams: readSheepClass(0),
          wethers: readSheepClass(1),
          maidenEwes: readSheepClassWithLambing(2),
          breedingEwes: readSheepClassWithLambing(3),
          otherEwes: readSheepClass(4),
          lambsHoggets: readSheepClassWithProportionLambsBorn(5),
        },
      },
    ],
  };

  // console.dir(sheepInput, { depth: null });

  return SheepInputSchema.parse(sheepInput);
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${col.columnOutput}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 30 },
);

describe('3.4.1.1 Sheep enteric methane seasonal', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.4-sheep-enteric/3.4-sheep-enteric.xlsx',
      '3.4.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculate34SheepEntericMethane);
  });

  it('method 2 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.4-sheep-enteric/3.4-sheep-enteric.xlsx',
      '3.4.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 201, '2');

    compareInputsAndOutputs(inputsAndOutputs, calculate34SheepEntericMethane);
  });
});
