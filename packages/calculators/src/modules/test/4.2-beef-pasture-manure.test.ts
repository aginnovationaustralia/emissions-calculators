import {
  BeefClassInput,
  BeefClassWithCalvesInput,
} from '@/calculators/Beef/types/beef-class.input';
import { BeefHerdInput } from '@/calculators/Beef/types/beef-herd.input';
import {
  BeefInput,
  BeefInputSchema,
  BeefInputTransformed,
} from '@/calculators/Beef/types/input';
import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculateManureManagementCH4 } from '../scope1/4-manure-management/4.1-beef-pasture-manure';
import { checkClimateZone, checkExtendedRegion } from './livestock-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

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

  const readBeefClass = (offset: number): BeefClassInput | undefined => {
    const offsetRows = offset * 4;
    const springHeadRaw = cell('J', offsetRows);
    if (springHeadRaw === undefined) {
      return undefined;
    }
    const springHead = Number(springHeadRaw);
    const summerHead = Number(cell('J', offsetRows + 1));
    const autumnHead = Number(cell('J', offsetRows + 2));
    const winterHead = Number(cell('J', offsetRows + 3));
    const springLiveweight =
      method === '1' ? undefined : Number(cell('K', offsetRows));
    const summerLiveweight =
      method === '1' ? undefined : Number(cell('K', offsetRows + 1));
    const autumnLiveweight =
      method === '1' ? undefined : Number(cell('K', offsetRows + 2));
    const winterLiveweight =
      method === '1' ? undefined : Number(cell('K', offsetRows + 3));

    const springLiveweightGain =
      method === '1' ? undefined : Number(cell('L', offsetRows));
    const summerLiveweightGain =
      method === '1' ? undefined : Number(cell('L', offsetRows + 1));
    const autumnLiveweightGain =
      method === '1' ? undefined : Number(cell('L', offsetRows + 2));
    const winterLiveweightGain =
      method === '1' ? undefined : Number(cell('L', offsetRows + 3));

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

  const readBeefClassWithCalves = (
    offset: number,
  ): BeefClassWithCalvesInput | undefined => {
    const offsetRows = offset * 4;
    const springHeadRaw = cell('J', offsetRows);
    if (springHeadRaw === undefined) {
      return undefined;
    }
    const springHead = Number(springHeadRaw);
    const springProportionCowsGt2InCalf = Number(cell('O', offsetRows));
    const summerHead = Number(cell('J', offsetRows + 1));
    const summerProportionCowsGt2InCalf = Number(cell('O', offsetRows + 1));
    const autumnHead = Number(cell('J', offsetRows + 2));
    const autumnProportionCowsGt2InCalf = Number(cell('O', offsetRows + 2));
    const winterHead = Number(cell('J', offsetRows + 3));
    const winterProportionCowsGt2InCalf = Number(cell('O', offsetRows + 3));

    const springLiveweight =
      method === '1' ? undefined : Number(cell('K', offsetRows));
    const summerLiveweight =
      method === '1' ? undefined : Number(cell('K', offsetRows + 1));
    const autumnLiveweight =
      method === '1' ? undefined : Number(cell('K', offsetRows + 2));
    const winterLiveweight =
      method === '1' ? undefined : Number(cell('K', offsetRows + 3));

    const springLiveweightGain =
      method === '1' ? undefined : Number(cell('L', offsetRows));
    const summerLiveweightGain =
      method === '1' ? undefined : Number(cell('L', offsetRows + 1));
    const autumnLiveweightGain =
      method === '1' ? undefined : Number(cell('L', offsetRows + 2));
    const winterLiveweightGain =
      method === '1' ? undefined : Number(cell('L', offsetRows + 3));

    return {
      spring: {
        head: springHead,
        proportionCowsGt2ThisSeasonInCalf: springProportionCowsGt2InCalf,
        method2Liveweight: springLiveweight,
        method2LiveweightGain: springLiveweightGain,
      },
      summer: {
        head: summerHead,
        proportionCowsGt2ThisSeasonInCalf: summerProportionCowsGt2InCalf,
        method2Liveweight: summerLiveweight,
        method2LiveweightGain: summerLiveweightGain,
      },
      autumn: {
        head: autumnHead,
        proportionCowsGt2ThisSeasonInCalf: autumnProportionCowsGt2InCalf,
        method2Liveweight: autumnLiveweight,
        method2LiveweightGain: autumnLiveweightGain,
      },
      winter: {
        head: winterHead,
        proportionCowsGt2ThisSeasonInCalf: winterProportionCowsGt2InCalf,
        method2Liveweight: winterLiveweight,
        method2LiveweightGain: winterLiveweightGain,
      },
    };
  };

  if (cell('A') === undefined) {
    return undefined;
  }

  const climateZone = checkClimateZone(cell('B'));
  // const state = checkState(cell('C'));
  const region = checkExtendedRegion(cell('F'));

  const unfencedWater = cell('Y') === 'yes';

  const herd: BeefHerdInput = {
    method2NoUnfencedNaturalWater: method === '1' ? undefined : !unfencedWater,
    classes: {
      bullsLt1: readBeefClass(0),
      bullsGt1: readBeefClass(1),
      cowsLt1: readBeefClass(2),
      cows1To2Years: readBeefClass(3),
      cows2To3Years: readBeefClassWithCalves(4),
      cowsGt3Years: readBeefClassWithCalves(5),
      steersLt1: readBeefClass(6),
      steers1To2Years: readBeefClass(7),
      steers2To3Years: readBeefClass(8),
      steersGt3Years: readBeefClass(9),
    },
    method2Dmd:
      method === '1'
        ? undefined
        : {
            spring: Number(cell('AJ')),
            summer: Number(cell('AK')),
            autumn: Number(cell('AL')),
            winter: Number(cell('AM')),
          },
  };

  const beefInput: BeefInput = {
    region,
    climateZone,
    herds: [herd],
    electricity: {
      method: 'location',
      electricityPurchasedKWh: 0,
    },
  };

  // console.dir(beefInput, { depth: null });

  return {
    ...BeefInputSchema.parse(beefInput),
  };
};

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`BR${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 40 },
);

describe('4.2. Beef Pasture Manure methane', () => {
  it('method 1 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.1-beef.xlsx',
      '4.2.1 methane',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateManureManagementCH4);
  });

  it('method 2 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.1-beef.xlsx',
      '4.2.1 methane',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 141, '2');

    compareInputsAndOutputs(inputsAndOutputs, calculateManureManagementCH4);
  });
});
