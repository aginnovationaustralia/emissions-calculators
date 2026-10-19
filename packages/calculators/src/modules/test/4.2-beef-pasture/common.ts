import { BeefCalfClassPeriodInput } from '@/calculators/Beef/types/beef-class-period.input';
import {
  BeefCalfClassMonthlyInput,
  BeefCalfClassSeasonalInput,
  BeefClassMonthlyInput,
  BeefClassSeasonalInput,
  BeefClassWithCalvesMonthlyInput,
  BeefClassWithCalvesSeasonalInput,
} from '@/calculators/Beef/types/beef-class.input';
import { BeefHerdInputTransformed } from '@/calculators/Beef/types/beef-herd.input';
import { HasIsFebruaryInLeapYearInputTransformed } from '@/calculators/types/has-is-february-in-leap-year.input';
import { nv, nvo } from '@/tools/inputs';
import XLSX from 'xlsx-populate';
import { createBeefHerdInputTransformed } from '../factory';
import {
  checkBeefBreed,
  checkClimateZone,
  checkGrazingProductionSystemsWithRainfall,
  checkMeanAnnualTemperature,
  checkStateOrRegion,
} from '../livestock-domain';

const columnBreed = 'B';
export const columnStateOrRegion = 'C';
export const columnExcludedFromNaturalWater = 'F';
export const columnMonthlyCustomDurationDays = 'I';
const columnMonthlyDurationDays = 'J';
export const columnHeadN = 'K';
export const columnCustomLiveweightW = 'L';
const columnEffectiveLiveweightW = 'M';
export const columnCustomLiveweightGainLWG = 'N';
const columnEffectiveLiveweightGainLWG = 'O';
export const columnProportionCowsInCalfLC = 'S';
export const columnProportionCowsPreviousSeasonInCalfLC = 'T';
export const columnProportionCalvesBorn = 'U';
export const columnProportionCalvesBornPrevious = 'V';
export const columnCrudeProteinContent = 'AB';
export const columnCustomDmd = 'AD';
const columnCustomMeanAnnualTemperature = 'AJ';
export const columnRowECH4 = 'AQ';
const columnClimateZone = 'AX';
export const columnIsInLeachingZone = 'BC';
const columnGrazingSystem = 'BG';
export const beefPastureRowsPerClass = 4;
export const beefPastureMonthlyRowsPerClass = 12;
export const beefPastureClassCount = 10;

export const columnTotalECH4 = 'AR';
export const columnExpectedEN2ODir = 'BJ';
export const columnExpectedEN2OAd = 'BK';
export const columnExpectedEN2OLeach = 'BL';

export type CellFn = (column: string, offset?: number) => string | undefined;

const MONTHLY_PERIOD_KEYS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;

export const readBeefClassFn =
  (cell: CellFn, method: '1' | '2') =>
  (offset: number): BeefClassSeasonalInput | undefined => {
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
        head: nv(springHead),
        method2Liveweight: nvo(springLiveweight),
        method2LiveweightGain: nvo(springLiveweightGain),
      },
      summer: {
        head: nv(summerHead),
        method2Liveweight: nvo(summerLiveweight),
        method2LiveweightGain: nvo(summerLiveweightGain),
      },
      autumn: {
        head: nv(autumnHead),
        method2Liveweight: nvo(autumnLiveweight),
        method2LiveweightGain: nvo(autumnLiveweightGain),
      },
      winter: {
        head: nv(winterHead),
        method2Liveweight: nvo(winterLiveweight),
        method2LiveweightGain: nvo(winterLiveweightGain),
      },
    };
  };

export const readBeefClassWithCalvesFn =
  (cell: CellFn, method: '1' | '2') =>
  (offset: number): BeefClassWithCalvesSeasonalInput | undefined => {
    const offsetRows = offset * 4;
    const springHeadRaw = cell(columnHeadN, offsetRows);
    if (springHeadRaw === undefined) {
      return undefined;
    }
    const springHead = Number(springHeadRaw);
    const springProportionCowsInCalf = Number(
      cell(columnProportionCowsInCalfLC, offsetRows),
    );
    const springproportionCowsPreviousSeasonInCalf = Number(
      cell(columnProportionCowsPreviousSeasonInCalfLC, offsetRows),
    );
    const summerHead = Number(cell(columnHeadN, offsetRows + 1));
    const summerProportionCowsInCalf = Number(
      cell(columnProportionCowsInCalfLC, offsetRows + 1),
    );
    const summerProportionCowsPreviousSeasonInCalf = Number(
      cell(columnProportionCowsPreviousSeasonInCalfLC, offsetRows + 1),
    );
    const autumnHead = Number(cell(columnHeadN, offsetRows + 2));
    const autumnProportionCowsInCalf = Number(
      cell(columnProportionCowsInCalfLC, offsetRows + 2),
    );
    const autumnproportionCowsPreviousSeasonInCalf = Number(
      cell(columnProportionCowsPreviousSeasonInCalfLC, offsetRows + 2),
    );
    const winterHead = Number(cell(columnHeadN, offsetRows + 3));
    const winterProportionCowsInCalf = Number(
      cell(columnProportionCowsInCalfLC, offsetRows + 3),
    );
    const winterproportionCowsPreviousSeasonInCalf = Number(
      cell(columnProportionCowsPreviousSeasonInCalfLC, offsetRows + 3),
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
        head: nv(springHead),
        proportionCowsThisSeasonInCalf: nv(springProportionCowsInCalf),
        proportionCowsPreviousSeasonInCalf: nv(
          springproportionCowsPreviousSeasonInCalf,
        ),
        method2Liveweight: nvo(springLiveweight),
        method2LiveweightGain: nvo(springLiveweightGain),
      },
      summer: {
        head: nv(summerHead),
        proportionCowsThisSeasonInCalf: nv(summerProportionCowsInCalf),
        proportionCowsPreviousSeasonInCalf: nv(
          summerProportionCowsPreviousSeasonInCalf,
        ),
        method2Liveweight: nvo(summerLiveweight),
        method2LiveweightGain: nvo(summerLiveweightGain),
      },
      autumn: {
        head: nv(autumnHead),
        proportionCowsThisSeasonInCalf: nv(autumnProportionCowsInCalf),
        proportionCowsPreviousSeasonInCalf: nv(
          autumnproportionCowsPreviousSeasonInCalf,
        ),
        method2Liveweight: nvo(autumnLiveweight),
        method2LiveweightGain: nvo(autumnLiveweightGain),
      },
      winter: {
        head: nv(winterHead),
        proportionCowsThisSeasonInCalf: nv(winterProportionCowsInCalf),
        proportionCowsPreviousSeasonInCalf: nv(
          winterproportionCowsPreviousSeasonInCalf,
        ),
        method2Liveweight: nvo(winterLiveweight),
        method2LiveweightGain: nvo(winterLiveweightGain),
      },
    };
  };

export const readBeefCalfClassFn =
  (cell: CellFn, method: '1' | '2') =>
  (offset: number): BeefCalfClassSeasonalInput | undefined => {
    const offsetRows = offset * 4;
    const springHeadRaw = cell(columnHeadN, offsetRows);
    if (springHeadRaw === undefined) {
      return undefined;
    }
    const springHead = Number(springHeadRaw);
    const springProportionBorn = Number(
      cell(columnProportionCalvesBorn, offsetRows),
    );
    const springProportionBornPrevious = Number(
      cell(columnProportionCalvesBornPrevious, offsetRows),
    );
    const summerHead = Number(cell(columnHeadN, offsetRows + 1));
    const summerProportionBorn = Number(
      cell(columnProportionCalvesBorn, offsetRows + 1),
    );
    const summerProportionBornPrevious = Number(
      cell(columnProportionCalvesBornPrevious, offsetRows + 1),
    );
    const autumnHead = Number(cell(columnHeadN, offsetRows + 2));
    const autumnProportionBorn = Number(
      cell(columnProportionCalvesBorn, offsetRows + 2),
    );
    const autumnProportionBornPrevious = Number(
      cell(columnProportionCalvesBornPrevious, offsetRows + 2),
    );
    const winterHead = Number(cell(columnHeadN, offsetRows + 3));
    const winterProportionBorn = Number(
      cell(columnProportionCalvesBorn, offsetRows + 3),
    );
    const winterProportionBornPrevious = Number(
      cell(columnProportionCalvesBornPrevious, offsetRows + 3),
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
        head: nv(springHead),
        proportionCalvesBornThisSeason: nv(springProportionBorn),
        proportionCalvesBornPreviousSeason: nv(springProportionBornPrevious),
        method2Liveweight: nvo(springLiveweight),
        method2LiveweightGain: nvo(springLiveweightGain),
      },
      summer: {
        head: nv(summerHead),
        proportionCalvesBornThisSeason: nv(summerProportionBorn),
        proportionCalvesBornPreviousSeason: nv(summerProportionBornPrevious),
        method2Liveweight: nvo(summerLiveweight),
        method2LiveweightGain: nvo(summerLiveweightGain),
      },
      autumn: {
        head: nv(autumnHead),
        proportionCalvesBornThisSeason: nv(autumnProportionBorn),
        proportionCalvesBornPreviousSeason: nv(autumnProportionBornPrevious),
        method2Liveweight: nvo(autumnLiveweight),
        method2LiveweightGain: nvo(autumnLiveweightGain),
      },
      winter: {
        head: nv(winterHead),
        proportionCalvesBornThisSeason: nv(winterProportionBorn),
        proportionCalvesBornPreviousSeason: nv(winterProportionBornPrevious),
        method2Liveweight: nvo(winterLiveweight),
        method2LiveweightGain: nvo(winterLiveweightGain),
      },
    };
  };

export const readMonthlyBeefClassFn =
  (cell: CellFn, method: '1' | '2') =>
  (offset: number): BeefClassMonthlyInput | undefined => {
    const offsetRows = offset * beefPastureMonthlyRowsPerClass;
    if (cell(columnHeadN, offsetRows) === undefined) {
      return undefined;
    }

    const readBeefClassPeriod = (rowOffset: number) => {
      const customDurationDays = cell(
        columnMonthlyCustomDurationDays,
        rowOffset,
      );
      const durationDays = cell(columnMonthlyDurationDays, rowOffset);
      const customLiveweight = cell(columnCustomLiveweightW, rowOffset);
      const effectiveLiveweight = cell(columnEffectiveLiveweightW, rowOffset);
      const customLiveweightGain = cell(
        columnCustomLiveweightGainLWG,
        rowOffset,
      );
      const effectiveLiveweightGain = cell(
        columnEffectiveLiveweightGainLWG,
        rowOffset,
      );
      const customDmd = cell(columnCustomDmd, rowOffset);
      const method2Dmd =
        method === '2' && customDmd ? Number(customDmd) : undefined;
      const customCrudeProteinContent = cell(
        columnCrudeProteinContent,
        rowOffset,
      );
      const method2CrudeProteinContent =
        method === '2' && customCrudeProteinContent
          ? Number(customCrudeProteinContent)
          : undefined;
      const liveweight =
        method === '2' && customLiveweight
          ? Number(customLiveweight)
          : method === '2' && effectiveLiveweight
            ? Number(effectiveLiveweight)
            : undefined;
      const liveweightGain =
        method === '2' && customLiveweightGain
          ? Number(customLiveweightGain)
          : method === '2' && effectiveLiveweightGain
            ? Number(effectiveLiveweightGain)
            : undefined;
      return {
        head: nv(Number(cell(columnHeadN, rowOffset))),
        method2Liveweight: nvo(liveweight),
        method2LiveweightGain: nvo(liveweightGain),
        method2DurationDays: nvo(
          method === '2' && customDurationDays
            ? Number(customDurationDays)
            : method === '2' && durationDays
              ? Number(durationDays)
              : undefined,
        ),
        method2DryMatterDigestibility: nvo(method2Dmd),
        method2CrudeProteinContent: nvo(method2CrudeProteinContent),
      };
    };

    return Object.fromEntries(
      MONTHLY_PERIOD_KEYS.map((key, index) => [
        key,
        readBeefClassPeriod(offsetRows + index),
      ]),
    ) as BeefClassMonthlyInput;
  };

export const readMonthlyBeefClassWithCalvesFn =
  (cell: CellFn, method: '1' | '2') =>
  (offset: number): BeefClassWithCalvesMonthlyInput | undefined => {
    const offsetRows = offset * beefPastureMonthlyRowsPerClass;
    if (cell(columnHeadN, offsetRows) === undefined) {
      return undefined;
    }

    const readBeefClassWithCalvesPeriod = (rowOffset: number) => {
      const customDurationDays = cell(
        columnMonthlyCustomDurationDays,
        rowOffset,
      );
      const durationDays = cell(columnMonthlyDurationDays, rowOffset);
      const customLiveweight = cell(columnCustomLiveweightW, rowOffset);
      const effectiveLiveweight = cell(columnEffectiveLiveweightW, rowOffset);
      const customLiveweightGain = cell(
        columnCustomLiveweightGainLWG,
        rowOffset,
      );
      const effectiveLiveweightGain = cell(
        columnEffectiveLiveweightGainLWG,
        rowOffset,
      );
      const liveweight =
        method === '2' && customLiveweight
          ? Number(customLiveweight)
          : method === '2' && effectiveLiveweight
            ? Number(effectiveLiveweight)
            : undefined;
      const liveweightGain =
        method === '2' && customLiveweightGain
          ? Number(customLiveweightGain)
          : method === '2' && effectiveLiveweightGain
            ? Number(effectiveLiveweightGain)
            : undefined;
      return {
        head: nv(Number(cell(columnHeadN, rowOffset))),
        proportionCowsThisSeasonInCalf: nv(
          Number(cell(columnProportionCowsInCalfLC, rowOffset)),
        ),
        proportionCowsPreviousSeasonInCalf: nv(
          Number(cell(columnProportionCowsPreviousSeasonInCalfLC, rowOffset)),
        ),
        method2Liveweight: nvo(liveweight),
        method2LiveweightGain: nvo(liveweightGain),
        method2DurationDays: nvo(
          method === '2' && customDurationDays
            ? Number(customDurationDays)
            : method === '2' && durationDays
              ? Number(durationDays)
              : undefined,
        ),
      };
    };

    return Object.fromEntries(
      MONTHLY_PERIOD_KEYS.map((key, index) => [
        key,
        readBeefClassWithCalvesPeriod(offsetRows + index),
      ]),
    ) as BeefClassWithCalvesMonthlyInput;
  };

export const readMonthlyBeefCalfClassFn =
  (cell: CellFn, method: '1' | '2') =>
  (offset: number): BeefCalfClassMonthlyInput | undefined => {
    const offsetRows = offset * beefPastureMonthlyRowsPerClass;
    if (cell(columnHeadN, offsetRows) === undefined) {
      return undefined;
    }

    const readBeefClassPeriod = (
      rowOffset: number,
    ): BeefCalfClassPeriodInput => {
      const customDurationDays = cell(
        columnMonthlyCustomDurationDays,
        rowOffset,
      );
      const durationDays = cell(columnMonthlyDurationDays, rowOffset);
      const customLiveweight = cell(columnCustomLiveweightW, rowOffset);
      const effectiveLiveweight = cell(columnEffectiveLiveweightW, rowOffset);
      const customLiveweightGain = cell(
        columnCustomLiveweightGainLWG,
        rowOffset,
      );
      const effectiveLiveweightGain = cell(
        columnEffectiveLiveweightGainLWG,
        rowOffset,
      );
      const customDmd = cell(columnCustomDmd, rowOffset);
      const method2Dmd =
        method === '2' && customDmd ? Number(customDmd) : undefined;
      const customCrudeProteinContent = cell(
        columnCrudeProteinContent,
        rowOffset,
      );

      const proportionBorn = Number(
        cell(columnProportionCalvesBorn, rowOffset),
      );
      const proportionBornPrevious = Number(
        cell(columnProportionCalvesBornPrevious, rowOffset),
      );
      const method2CrudeProteinContent =
        method === '2' && customCrudeProteinContent
          ? Number(customCrudeProteinContent)
          : undefined;
      const liveweight =
        method === '2' && customLiveweight
          ? Number(customLiveweight)
          : method === '2' && effectiveLiveweight
            ? Number(effectiveLiveweight)
            : undefined;
      const liveweightGain =
        method === '2' && customLiveweightGain
          ? Number(customLiveweightGain)
          : method === '2' && effectiveLiveweightGain
            ? Number(effectiveLiveweightGain)
            : undefined;

      return {
        head: nv(Number(cell(columnHeadN, rowOffset))),
        method2Liveweight: nvo(liveweight),
        method2LiveweightGain: nvo(liveweightGain),
        method2DurationDays: nvo(
          method === '2' && customDurationDays
            ? Number(customDurationDays)
            : method === '2' && durationDays
              ? Number(durationDays)
              : undefined,
        ),
        method2DryMatterDigestibility: nvo(method2Dmd),
        method2CrudeProteinContent: nvo(method2CrudeProteinContent),
        proportionCalvesBornThisSeason: nv(proportionBorn),
        proportionCalvesBornPreviousSeason: nv(proportionBornPrevious),
      };
    };

    return Object.fromEntries(
      MONTHLY_PERIOD_KEYS.map((key, index) => [
        key,
        readBeefClassPeriod(offsetRows + index),
      ]),
    ) as BeefCalfClassMonthlyInput;
  };

export const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
):
  | (BeefHerdInputTransformed & HasIsFebruaryInLeapYearInputTransformed)
  | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  const readBeefClass = readBeefClassFn(cell, method);
  const readBeefClassWithCalves = readBeefClassWithCalvesFn(cell, method);
  const readBeefCalfClass = readBeefCalfClassFn(cell, method);

  if (cell('A') === undefined) {
    return undefined;
  }

  const region = checkStateOrRegion(cell(columnStateOrRegion));
  const isInLeachingZone = cell(columnIsInLeachingZone) === 'yes';
  const grazingSystem = checkGrazingProductionSystemsWithRainfall(
    cell(columnGrazingSystem),
  );
  const excludedFromNaturalWater =
    cell(columnExcludedFromNaturalWater) === 'yes';
  const climateZone = checkClimateZone(cell(columnClimateZone));
  const breed = checkBeefBreed(cell(columnBreed));

  return createBeefHerdInputTransformed({
    breed,
    region,
    isInLeachingZone,
    climateZone,
    excludedFromNaturalWater,
    classes: {
      period: 'seasonal',
      bullsLt1: readBeefCalfClass(0),
      bullsGt1: readBeefClass(1),
      cows1To2Years: readBeefClassWithCalves(2),
      cows2To3Years: readBeefClassWithCalves(3),
      cowsLt1: readBeefCalfClass(4),
      cowsGt3Years: readBeefClassWithCalves(5),
      steers1To2Years: readBeefClass(6),
      steers2To3Years: readBeefClass(7),
      steersLt1: readBeefCalfClass(8),
      steersGt3Years: readBeefClass(9),
    },
    grazingSystem,
  });
};

export const getMonthlyCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
  options: { isLeapYear: boolean },
):
  | (BeefHerdInputTransformed & HasIsFebruaryInLeapYearInputTransformed)
  | undefined => {
  const cell = (column: string, offset: number = 0) =>
    sheet
      .cell(`${column}${row + offset}`)
      .value()
      ?.toString();

  const readBeefClass = readMonthlyBeefClassFn(cell, method);
  const readBeefClassWithCalves = readMonthlyBeefClassWithCalvesFn(
    cell,
    method,
  );
  const readBeefCalfClass = readMonthlyBeefCalfClassFn(cell, method);

  if (cell('A') === undefined) {
    return undefined;
  }

  const region = checkStateOrRegion(cell(columnStateOrRegion));
  const isInLeachingZone = cell(columnIsInLeachingZone) === 'yes';
  const grazingSystemValue = cell(columnGrazingSystem);
  const grazingSystem = grazingSystemValue
    ? checkGrazingProductionSystemsWithRainfall(grazingSystemValue)
    : 'Non-irrigated pasture';
  const excludedFromNaturalWater =
    cell(columnExcludedFromNaturalWater) === 'yes';
  const climateZoneValue = cell(columnClimateZone);
  const climateZone = climateZoneValue
    ? checkClimateZone(climateZoneValue)
    : 'Boreal dry';
  const breed = checkBeefBreed(cell(columnBreed));

  const method2MeanAnnualTemperature =
    method === '1'
      ? undefined
      : checkMeanAnnualTemperature(cell(columnCustomMeanAnnualTemperature));

  return createBeefHerdInputTransformed(
    {
      region,
      isInLeachingZone,
      excludedFromNaturalWater,
      climateZone,
      method2MeanAnnualTemperature,
      breed,
      grazingSystem,
      classes: {
        period: 'monthly',
        bullsLt1: readBeefCalfClass(0),
        bullsGt1: readBeefClass(1),
        cows1To2Years: readBeefClassWithCalves(2),
        cows2To3Years: readBeefClassWithCalves(3),
        cowsLt1: readBeefCalfClass(4),
        cowsGt3Years: readBeefClassWithCalves(5),
        steers1To2Years: readBeefClass(6),
        steers2To3Years: readBeefClass(7),
        steersLt1: readBeefCalfClass(8),
        steersGt3Years: readBeefClass(9),
      },
    },
    {
      isFebruaryInLeapYear: options.isLeapYear,
    },
  );
};
