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
// The herd's calving table: "Calving season?" (seasonal) or "Calving start month?" (monthly),
// Yes/No for each season or month, from 2 rows below the scenario's first row
const columnCalvingPeriod = 'D';
const calvingTableFirstRowOffset = 2;
// Calving inputs. The columns after them (LC for the season of calving and the season after
// it, and the calves' shares) are the sheet's own calculation from these.
export const columnProportionCowsCalving = 'S';
export const columnCalvesBorn = 'V';
export const columnCrudeProteinContent = 'AD';
export const columnCustomDmd = 'AF';
const columnCustomMeanAnnualTemperature = 'AL';
export const columnRowECH4 = 'AS';
const columnClimateZone = 'AZ';
export const columnIsInLeachingZone = 'BE';
const columnGrazingSystem = 'BI';
export const beefPastureRowsPerClass = 4;
export const beefPastureMonthlyRowsPerClass = 12;
export const beefPastureClassCount = 10;

export const columnTotalECH4 = 'AT';
export const columnExpectedEN2ODir = 'BL';
export const columnExpectedEN2OAd = 'BM';
export const columnExpectedEN2OLeach = 'BN';

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

const SEASONAL_PERIOD_KEYS = ['spring', 'summer', 'autumn', 'winter'] as const;

/** The seasons marked "Yes" in the herd's "Calving season?" table */
export const readCalvingSeasons = (cell: CellFn) =>
  SEASONAL_PERIOD_KEYS.filter(
    (_, index) =>
      cell(columnCalvingPeriod, calvingTableFirstRowOffset + index) === 'Yes',
  );

/** The months marked "Yes" in the herd's "Calving start month?" table */
export const readCalvingSeasonStartMonths = (cell: CellFn) =>
  MONTHLY_PERIOD_KEYS.filter(
    (_, index) =>
      cell(columnCalvingPeriod, calvingTableFirstRowOffset + index) === 'Yes',
  );

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
        method2LiveweightKilograms: nvo(springLiveweight),
        method2DailyLiveweightGainKilograms: nvo(springLiveweightGain),
      },
      summer: {
        head: nv(summerHead),
        method2LiveweightKilograms: nvo(summerLiveweight),
        method2DailyLiveweightGainKilograms: nvo(summerLiveweightGain),
      },
      autumn: {
        head: nv(autumnHead),
        method2LiveweightKilograms: nvo(autumnLiveweight),
        method2DailyLiveweightGainKilograms: nvo(autumnLiveweightGain),
      },
      winter: {
        head: nv(winterHead),
        method2LiveweightKilograms: nvo(winterLiveweight),
        method2DailyLiveweightGainKilograms: nvo(winterLiveweightGain),
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
    const springProportionCowsCalving = Number(
      cell(columnProportionCowsCalving, offsetRows),
    );
    const summerHead = Number(cell(columnHeadN, offsetRows + 1));
    const summerProportionCowsCalving = Number(
      cell(columnProportionCowsCalving, offsetRows + 1),
    );
    const autumnHead = Number(cell(columnHeadN, offsetRows + 2));
    const autumnProportionCowsCalving = Number(
      cell(columnProportionCowsCalving, offsetRows + 2),
    );
    const winterHead = Number(cell(columnHeadN, offsetRows + 3));
    const winterProportionCowsCalving = Number(
      cell(columnProportionCowsCalving, offsetRows + 3),
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
        fractionCowsCalving: nv(springProportionCowsCalving),
        method2LiveweightKilograms: nvo(springLiveweight),
        method2DailyLiveweightGainKilograms: nvo(springLiveweightGain),
      },
      summer: {
        head: nv(summerHead),
        fractionCowsCalving: nv(summerProportionCowsCalving),
        method2LiveweightKilograms: nvo(summerLiveweight),
        method2DailyLiveweightGainKilograms: nvo(summerLiveweightGain),
      },
      autumn: {
        head: nv(autumnHead),
        fractionCowsCalving: nv(autumnProportionCowsCalving),
        method2LiveweightKilograms: nvo(autumnLiveweight),
        method2DailyLiveweightGainKilograms: nvo(autumnLiveweightGain),
      },
      winter: {
        head: nv(winterHead),
        fractionCowsCalving: nv(winterProportionCowsCalving),
        method2LiveweightKilograms: nvo(winterLiveweight),
        method2DailyLiveweightGainKilograms: nvo(winterLiveweightGain),
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
    const springCalvesBorn = Number(cell(columnCalvesBorn, offsetRows));
    const summerHead = Number(cell(columnHeadN, offsetRows + 1));
    const summerCalvesBorn = Number(cell(columnCalvesBorn, offsetRows + 1));
    const autumnHead = Number(cell(columnHeadN, offsetRows + 2));
    const autumnCalvesBorn = Number(cell(columnCalvesBorn, offsetRows + 2));
    const winterHead = Number(cell(columnHeadN, offsetRows + 3));
    const winterCalvesBorn = Number(cell(columnCalvesBorn, offsetRows + 3));

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
        calvesBorn: nv(springCalvesBorn),
        method2LiveweightKilograms: nvo(springLiveweight),
        method2DailyLiveweightGainKilograms: nvo(springLiveweightGain),
      },
      summer: {
        head: nv(summerHead),
        calvesBorn: nv(summerCalvesBorn),
        method2LiveweightKilograms: nvo(summerLiveweight),
        method2DailyLiveweightGainKilograms: nvo(summerLiveweightGain),
      },
      autumn: {
        head: nv(autumnHead),
        calvesBorn: nv(autumnCalvesBorn),
        method2LiveweightKilograms: nvo(autumnLiveweight),
        method2DailyLiveweightGainKilograms: nvo(autumnLiveweightGain),
      },
      winter: {
        head: nv(winterHead),
        calvesBorn: nv(winterCalvesBorn),
        method2LiveweightKilograms: nvo(winterLiveweight),
        method2DailyLiveweightGainKilograms: nvo(winterLiveweightGain),
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
        method2LiveweightKilograms: nvo(liveweight),
        method2DailyLiveweightGainKilograms: nvo(liveweightGain),
        method2DurationDays: nvo(
          method === '2' && customDurationDays
            ? Number(customDurationDays)
            : method === '2' && durationDays
              ? Number(durationDays)
              : undefined,
        ),
        method2FractionDryMatterDigestibility: nvo(method2Dmd),
        method2FractionCrudeProteinContent: nvo(method2CrudeProteinContent),
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
        fractionCowsCalving: nv(
          Number(cell(columnProportionCowsCalving, rowOffset)),
        ),
        method2LiveweightKilograms: nvo(liveweight),
        method2DailyLiveweightGainKilograms: nvo(liveweightGain),
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

      const calvesBorn = Number(cell(columnCalvesBorn, rowOffset));
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
        method2LiveweightKilograms: nvo(liveweight),
        method2DailyLiveweightGainKilograms: nvo(liveweightGain),
        method2DurationDays: nvo(
          method === '2' && customDurationDays
            ? Number(customDurationDays)
            : method === '2' && durationDays
              ? Number(durationDays)
              : undefined,
        ),
        method2FractionDryMatterDigestibility: nvo(method2Dmd),
        method2FractionCrudeProteinContent: nvo(method2CrudeProteinContent),
        calvesBorn: nv(calvesBorn),
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
      calvingSeasons: readCalvingSeasons(cell),
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
        calvingSeasonStartMonths: readCalvingSeasonStartMonths(cell),
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
