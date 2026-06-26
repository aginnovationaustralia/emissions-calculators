import {
  BeefInput,
  BeefInputSchema,
  BeefInputTransformed,
} from '@/calculators/Beef/types';
import {
  BeefClassInput,
  BeefClassWithCalvesInput,
} from '@/calculators/Beef/types/beef-class.input';
import { BeefHerdInput } from '@/calculators/Beef/types/beef-herd.input';
import { calculate32BeefPastureEntericMethane } from '@/modules/scope1/3-enteric-methane/3.2-beef-pasture';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { columnStateOrRegion } from '../4.2-beef-pasture/common';
import { checkStateOrRegion } from '../livestock-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import {
  CellFn,
  columnCustomLiveweightGainLWG,
  columnCustomLiveweightW,
  columnExpectedOutput,
  columnHeadN,
  columnProportionCowsGt2PreviousSeasonInCalf,
  columnProportionCowsGt2ThisSeasonInCalf,
} from './common';

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${columnExpectedOutput}${row}`).value());
};

const readBeefClassFn =
  (cell: CellFn, method: '1' | '2') =>
  (offset: number): BeefClassInput | undefined => {
    const offsetRows = offset * 4;
    const springHeadRaw = cell(columnHeadN, offsetRows);
    if (springHeadRaw === undefined) {
      return undefined;
    }
    const springHead = Number(springHeadRaw);
    const summerHead = Number(cell(columnHeadN, offsetRows + 1));
    const autumnHead = Number(cell(columnHeadN, offsetRows + 2));
    const winterHead = Number(cell(columnHeadN, offsetRows + 3));
    const springLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightW, offsetRows));
    const summerLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightW, offsetRows + 1));
    const autumnLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightW, offsetRows + 2));
    const winterLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightW, offsetRows + 3));

    const springLiveweightGain =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightGainLWG, offsetRows));
    const summerLiveweightGain =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightGainLWG, offsetRows + 1));
    const autumnLiveweightGain =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightGainLWG, offsetRows + 2));
    const winterLiveweightGain =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightGainLWG, offsetRows + 3));

    return {
      spring: {
        head: springHead,
        method2Liveweight: springLiveweight,
        method2LiveweightGain: springLiveweightGain,
      },
      summer: {
        head: summerHead,
        method2Liveweight: summerLiveweight,
        method2LiveweightGain: summerLiveweightGain,
      },
      autumn: {
        head: autumnHead,
        method2Liveweight: autumnLiveweight,
        method2LiveweightGain: autumnLiveweightGain,
      },
      winter: {
        head: winterHead,
        method2Liveweight: winterLiveweight,
        method2LiveweightGain: winterLiveweightGain,
      },
    };
  };

const readBeefClassWithCalvesFn =
  (cell: CellFn, method: '1' | '2') =>
  (offset: number): BeefClassWithCalvesInput | undefined => {
    const offsetRows = offset * 4;
    const springHeadRaw = cell(columnHeadN, offsetRows);
    if (springHeadRaw === undefined) {
      return undefined;
    }
    const springHead = Number(springHeadRaw);
    const springProportionCowsGt2InCalf = Number(
      cell(columnProportionCowsGt2ThisSeasonInCalf, offsetRows),
    );
    const springProportionCowsGt2PreviousSeasonInCalf = Number(
      cell(columnProportionCowsGt2PreviousSeasonInCalf, offsetRows),
    );
    const summerHead = Number(cell(columnHeadN, offsetRows + 1));
    const summerProportionCowsGt2InCalf = Number(
      cell(columnProportionCowsGt2ThisSeasonInCalf, offsetRows + 1),
    );
    const summerProportionCowsGt2PreviousSeasonInCalf = Number(
      cell(columnProportionCowsGt2PreviousSeasonInCalf, offsetRows + 1),
    );
    const autumnHead = Number(cell(columnHeadN, offsetRows + 2));
    const autumnProportionCowsGt2InCalf = Number(
      cell(columnProportionCowsGt2ThisSeasonInCalf, offsetRows + 2),
    );
    const autumnProportionCowsGt2PreviousSeasonInCalf = Number(
      cell(columnProportionCowsGt2PreviousSeasonInCalf, offsetRows + 2),
    );
    const winterHead = Number(cell(columnHeadN, offsetRows + 3));
    const winterProportionCowsGt2InCalf = Number(
      cell(columnProportionCowsGt2ThisSeasonInCalf, offsetRows + 3),
    );
    const winterProportionCowsGt2PreviousSeasonInCalf = Number(
      cell(columnProportionCowsGt2PreviousSeasonInCalf, offsetRows + 3),
    );

    const springLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightW, offsetRows));
    const summerLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightW, offsetRows + 1));
    const autumnLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightW, offsetRows + 2));
    const winterLiveweight =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightW, offsetRows + 3));

    const springLiveweightGain =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightGainLWG, offsetRows));
    const summerLiveweightGain =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightGainLWG, offsetRows + 1));
    const autumnLiveweightGain =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightGainLWG, offsetRows + 2));
    const winterLiveweightGain =
      method === '1'
        ? undefined
        : Number(cell(columnCustomLiveweightGainLWG, offsetRows + 3));

    return {
      spring: {
        head: springHead,
        proportionCowsGt2ThisSeasonInCalf: springProportionCowsGt2InCalf,
        proportionCowsGt2PreviousSeasonInCalf:
          springProportionCowsGt2PreviousSeasonInCalf,
        method2Liveweight: springLiveweight,
        method2LiveweightGain: springLiveweightGain,
      },
      summer: {
        head: summerHead,
        proportionCowsGt2ThisSeasonInCalf: summerProportionCowsGt2InCalf,
        proportionCowsGt2PreviousSeasonInCalf:
          summerProportionCowsGt2PreviousSeasonInCalf,
        method2Liveweight: summerLiveweight,
        method2LiveweightGain: summerLiveweightGain,
      },
      autumn: {
        head: autumnHead,
        proportionCowsGt2ThisSeasonInCalf: autumnProportionCowsGt2InCalf,
        proportionCowsGt2PreviousSeasonInCalf:
          autumnProportionCowsGt2PreviousSeasonInCalf,
        method2Liveweight: autumnLiveweight,
        method2LiveweightGain: autumnLiveweightGain,
      },
      winter: {
        head: winterHead,
        proportionCowsGt2ThisSeasonInCalf: winterProportionCowsGt2InCalf,
        proportionCowsGt2PreviousSeasonInCalf:
          winterProportionCowsGt2PreviousSeasonInCalf,
        method2Liveweight: winterLiveweight,
        method2LiveweightGain: winterLiveweightGain,
      },
    };
  };

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): BeefInputTransformed | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  const readBeefClass = readBeefClassFn(cell, method);
  const readBeefClassWithCalves = readBeefClassWithCalvesFn(cell, method);

  if (cell('A') === undefined) {
    return undefined;
  }

  const region = checkStateOrRegion(cell(columnStateOrRegion));

  const herd: BeefHerdInput = {
    method2NoUnfencedNaturalWater: undefined,
    classes: {
      bullsLt1: readBeefClass(0),
      bullsGt1: readBeefClass(1),
      cows1To2Years: readBeefClassWithCalves(2),
      cows2To3Years: readBeefClassWithCalves(3),
      cowsLt1: readBeefClass(4),
      cowsGt3Years: readBeefClassWithCalves(5),
      steers1To2Years: readBeefClass(6),
      steers2To3Years: readBeefClass(7),
      steersLt1: readBeefClass(8),
      steersGt3Years: readBeefClass(9),
    },
    method2Dmd: undefined,

    method2CrudeProteinContent: undefined,
  };

  const beefInput: BeefInput = {
    region,
    climateZone: 'Boreal dry',
    grazingSystem: 'Irrigated crop',
    rainfallAbove600: false,
    herds: [herd],
    electricity: {
      method: 'location',
      electricityPurchasedKWh: 0,
    },
  };

  //   console.dir(beefInput, { depth: null });

  return {
    ...BeefInputSchema.parse(beefInput),
  };
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 50 },
);

describe('3.2. Beef enteric methane', () => {
  it('method 1 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/3.2-beef-enteric/3.2-beef-enteric.xlsx',
      '3.2.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculate32BeefPastureEntericMethane,
    );
  });
});
