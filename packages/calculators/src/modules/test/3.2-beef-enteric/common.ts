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
import XLSX from 'xlsx-populate';
import { checkStateOrRegion } from '../livestock-domain';

const columnBreed = 'B';
const columnStateOrRegion = 'C';
const columnHeadN = 'G';
const columnCustomLiveweightW = 'K';
const columnCustomLiveweightGainLWG = 'M';
const columnProportionCowsGt2InCalfLC = 'I';

// const columnDmd = 'AM';
// const columnCrudeProteinContent = 'AN';

type CellFn = (column: string, offset?: number) => string | undefined;

export const readBeefClassFn =
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

export const readBeefClassWithCalvesFn =
  (cell: CellFn, method: '1' | '2') =>
  (offset: number): BeefClassWithCalvesInput | undefined => {
    const offsetRows = offset * 4;
    const springHeadRaw = cell(columnHeadN, offsetRows);
    if (springHeadRaw === undefined) {
      return undefined;
    }
    const springHead = Number(springHeadRaw);
    const springProportionCowsGt2InCalf = Number(
      cell(columnProportionCowsGt2InCalfLC, offsetRows),
    );
    const summerHead = Number(cell(columnHeadN, offsetRows + 1));
    const summerProportionCowsGt2InCalf = Number(
      cell(columnProportionCowsGt2InCalfLC, offsetRows + 1),
    );
    const autumnHead = Number(cell(columnHeadN, offsetRows + 2));
    const autumnProportionCowsGt2InCalf = Number(
      cell(columnProportionCowsGt2InCalfLC, offsetRows + 2),
    );
    const winterHead = Number(cell(columnHeadN, offsetRows + 3));
    const winterProportionCowsGt2InCalf = Number(
      cell(columnProportionCowsGt2InCalfLC, offsetRows + 3),
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

export const getCalculatorInput = (
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
      cowsLt1: readBeefClass(2),
      cows1To2Years: readBeefClass(3),
      cows2To3Years: readBeefClassWithCalves(4),
      cowsGt3Years: readBeefClassWithCalves(5),
      steersLt1: readBeefClass(6),
      steers1To2Years: readBeefClass(7),
      steers2To3Years: readBeefClass(8),
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
