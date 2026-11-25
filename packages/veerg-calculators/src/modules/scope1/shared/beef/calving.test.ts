import { BeefClassesMonthlyInputSchema } from '@/calculators/Beef/types/beef-classes-monthly.input';
import { HasIsFebruaryInLeapYearInputSchemaForBeef } from '@/calculators/types/has-is-february-in-leap-year.input';
import { Month } from '@/constants/enums';
import { calculate32BeefPastureEntericMethaneForHerd } from '@/modules/scope1/3-enteric-methane/3.2-beef-pasture';
import { calculate42BeefPastureManureCH4ForHerd } from '@/modules/scope1/4-manure-management/4.2-beef-pasture/4.2-beef-pasture-manure-methane';
import { calculateManureManagementSoilDirectN2OForHerd } from '@/modules/scope1/4-manure-management/4.2-beef-pasture/4.2-beef-pasture-manure-n2o';
import { daysInMonth, monthSeasonMap } from '@/modules/shared';
import { testContext } from '@/test/Grains/context';
import { calculateAdditionalIntakeForMilkProduction } from './calculate';
import { getCalfBirthShares, getCowCalvingShares } from './calving';
import { BeefPeriodProps } from './helpers';
import {
  BeefManureAndEntericHerdInput,
  BeefManureAndEntericHerdInputSchema,
} from './input';

/**
 * Method 2 (monthly) calving for pasture beef.
 *
 * Methodological Guidance Chapter 3 v1.1, 3.2.2.1 (LCjk=4,5): "the calving season should
 * be considered 3 months from the calving month and the season after calving the 3
 * months after this period if Method 2 herd flow data is used ... and that for all other
 * time periods Ljk=4,5 = 0."
 *
 * The scenario: a herd with two calving seasons, starting in June and in September.
 *
 * Cows > 3 years, proportion of the class calving in each month:
 *   March 0.05 (outside any calving season, so not counted)
 *   June 0.10, July 0.05, August 0.05     -> June season total 0.20
 *   September 0.30, October 0.10          -> September season total 0.40
 *
 * Bull calves < 1 year, proportion of the class born in each month:
 *   June 0.20, July 0.10, August 0.10     -> June season total 0.40
 *   September 0.30, October 0.10, November 0.10 -> September season total 0.50
 *
 * Every month of a calving season gets the season's total (LC for the season of
 * calving). Every month of the 3 months after a calving season gets that same total (LC
 * for the season after calving). Every other month gets 0.
 */

const HerdSchema = BeefManureAndEntericHerdInputSchema.extend(
  HasIsFebruaryInLeapYearInputSchemaForBeef.shape,
);
const parseHerd = (herd: BeefManureAndEntericHerdInput) =>
  HerdSchema.parse({ ...herd, isFebruaryInLeapYear: false });

const herdDetails = {
  region: 'QLD - Moderate/High',
  breed: 'Hereford or Shorthorn',
  grazingSystem: 'Non-irrigated pasture',
  climateZone: 'Warm temperate moist',
  isInLeachingZone: false,
  excludedFromNaturalWater: false,
} as const;

/** The scenario, given as the calving season start months and the calving in each month */
const herdWithCalvingSeasonStartMonths: BeefManureAndEntericHerdInput = {
  ...herdDetails,
  classes: {
    period: 'monthly',
    calvingSeasonStartMonths: ['june', 'september'],
    cowsGt3Years: {
      january: {
        head: { value: 100 },
        fractionCowsCalvingThisMonth: { value: 0 },
      },
      february: {
        head: { value: 100 },
        fractionCowsCalvingThisMonth: { value: 0 },
      },
      march: {
        head: { value: 100 },
        fractionCowsCalvingThisMonth: { value: 0.05 },
      },
      april: {
        head: { value: 100 },
        fractionCowsCalvingThisMonth: { value: 0 },
      },
      may: { head: { value: 100 }, fractionCowsCalvingThisMonth: { value: 0 } },
      june: {
        head: { value: 100 },
        fractionCowsCalvingThisMonth: { value: 0.1 },
      },
      july: {
        head: { value: 100 },
        fractionCowsCalvingThisMonth: { value: 0.05 },
      },
      august: {
        head: { value: 100 },
        fractionCowsCalvingThisMonth: { value: 0.05 },
      },
      september: {
        head: { value: 100 },
        fractionCowsCalvingThisMonth: { value: 0.3 },
      },
      october: {
        head: { value: 100 },
        fractionCowsCalvingThisMonth: { value: 0.1 },
      },
      november: {
        head: { value: 100 },
        fractionCowsCalvingThisMonth: { value: 0 },
      },
      december: {
        head: { value: 100 },
        fractionCowsCalvingThisMonth: { value: 0 },
      },
    },
    bullsLt1: {
      january: {
        head: { value: 60 },
        fractionCalvesBornThisMonth: { value: 0 },
      },
      february: {
        head: { value: 60 },
        fractionCalvesBornThisMonth: { value: 0 },
      },
      march: { head: { value: 60 }, fractionCalvesBornThisMonth: { value: 0 } },
      april: { head: { value: 60 }, fractionCalvesBornThisMonth: { value: 0 } },
      may: { head: { value: 60 }, fractionCalvesBornThisMonth: { value: 0 } },
      june: {
        head: { value: 60 },
        fractionCalvesBornThisMonth: { value: 0.2 },
      },
      july: {
        head: { value: 60 },
        fractionCalvesBornThisMonth: { value: 0.1 },
      },
      august: {
        head: { value: 60 },
        fractionCalvesBornThisMonth: { value: 0.1 },
      },
      september: {
        head: { value: 60 },
        fractionCalvesBornThisMonth: { value: 0.3 },
      },
      october: {
        head: { value: 60 },
        fractionCalvesBornThisMonth: { value: 0.1 },
      },
      november: {
        head: { value: 60 },
        fractionCalvesBornThisMonth: { value: 0.1 },
      },
      december: {
        head: { value: 60 },
        fractionCalvesBornThisMonth: { value: 0 },
      },
    },
  },
};

/** The same scenario, with the season shares for each month worked out by hand */
const herdWithSeasonShares: BeefManureAndEntericHerdInput = {
  ...herdDetails,
  classes: {
    period: 'monthly',
    cowsGt3Years: {
      january: {
        head: { value: 100 },
        fractionCowsThisSeasonInCalf: { value: 0 },
        fractionCowsPreviousSeasonInCalf: { value: 0.4 },
      },
      february: {
        head: { value: 100 },
        fractionCowsThisSeasonInCalf: { value: 0 },
        fractionCowsPreviousSeasonInCalf: { value: 0.4 },
      },
      march: {
        head: { value: 100 },
        fractionCowsThisSeasonInCalf: { value: 0 },
        fractionCowsPreviousSeasonInCalf: { value: 0 },
      },
      april: {
        head: { value: 100 },
        fractionCowsThisSeasonInCalf: { value: 0 },
        fractionCowsPreviousSeasonInCalf: { value: 0 },
      },
      may: {
        head: { value: 100 },
        fractionCowsThisSeasonInCalf: { value: 0 },
        fractionCowsPreviousSeasonInCalf: { value: 0 },
      },
      june: {
        head: { value: 100 },
        fractionCowsThisSeasonInCalf: { value: 0.2 },
        fractionCowsPreviousSeasonInCalf: { value: 0 },
      },
      july: {
        head: { value: 100 },
        fractionCowsThisSeasonInCalf: { value: 0.2 },
        fractionCowsPreviousSeasonInCalf: { value: 0 },
      },
      august: {
        head: { value: 100 },
        fractionCowsThisSeasonInCalf: { value: 0.2 },
        fractionCowsPreviousSeasonInCalf: { value: 0 },
      },
      september: {
        head: { value: 100 },
        fractionCowsThisSeasonInCalf: { value: 0.4 },
        fractionCowsPreviousSeasonInCalf: { value: 0.2 },
      },
      october: {
        head: { value: 100 },
        fractionCowsThisSeasonInCalf: { value: 0.4 },
        fractionCowsPreviousSeasonInCalf: { value: 0.2 },
      },
      november: {
        head: { value: 100 },
        fractionCowsThisSeasonInCalf: { value: 0.4 },
        fractionCowsPreviousSeasonInCalf: { value: 0.2 },
      },
      december: {
        head: { value: 100 },
        fractionCowsThisSeasonInCalf: { value: 0 },
        fractionCowsPreviousSeasonInCalf: { value: 0.4 },
      },
    },
    bullsLt1: {
      january: {
        head: { value: 60 },
        fractionCalvesBornThisSeason: { value: 0 },
        fractionCalvesBornPreviousSeason: { value: 0.5 },
      },
      february: {
        head: { value: 60 },
        fractionCalvesBornThisSeason: { value: 0 },
        fractionCalvesBornPreviousSeason: { value: 0.5 },
      },
      march: {
        head: { value: 60 },
        fractionCalvesBornThisSeason: { value: 0 },
        fractionCalvesBornPreviousSeason: { value: 0 },
      },
      april: {
        head: { value: 60 },
        fractionCalvesBornThisSeason: { value: 0 },
        fractionCalvesBornPreviousSeason: { value: 0 },
      },
      may: {
        head: { value: 60 },
        fractionCalvesBornThisSeason: { value: 0 },
        fractionCalvesBornPreviousSeason: { value: 0 },
      },
      june: {
        head: { value: 60 },
        fractionCalvesBornThisSeason: { value: 0.4 },
        fractionCalvesBornPreviousSeason: { value: 0 },
      },
      july: {
        head: { value: 60 },
        fractionCalvesBornThisSeason: { value: 0.4 },
        fractionCalvesBornPreviousSeason: { value: 0 },
      },
      august: {
        head: { value: 60 },
        fractionCalvesBornThisSeason: { value: 0.4 },
        fractionCalvesBornPreviousSeason: { value: 0 },
      },
      september: {
        head: { value: 60 },
        fractionCalvesBornThisSeason: { value: 0.5 },
        fractionCalvesBornPreviousSeason: { value: 0.4 },
      },
      october: {
        head: { value: 60 },
        fractionCalvesBornThisSeason: { value: 0.5 },
        fractionCalvesBornPreviousSeason: { value: 0.4 },
      },
      november: {
        head: { value: 60 },
        fractionCalvesBornThisSeason: { value: 0.5 },
        fractionCalvesBornPreviousSeason: { value: 0.4 },
      },
      december: {
        head: { value: 60 },
        fractionCalvesBornThisSeason: { value: 0 },
        fractionCalvesBornPreviousSeason: { value: 0.5 },
      },
    },
  },
};

const context = testContext('beef');

/** The props the calculation passes for one class in one month */
const periodProps = (
  herdInput: BeefManureAndEntericHerdInput,
  className: 'cowsGt3Years' | 'bullsLt1',
  month: Month,
): BeefPeriodProps => {
  const herd = parseHerd(herdInput);
  const classInput = (herd.classes as Record<string, unknown>)[
    className
  ] as BeefPeriodProps['classInput'];
  return {
    herd,
    context,
    className,
    classInput,
    currentPeriod: (
      classInput as unknown as Record<Month, BeefPeriodProps['currentPeriod']>
    )[month],
    periodName: month,
    periodDuration: daysInMonth(month, herd.isFebruaryInLeapYear),
    seasonName: monthSeasonMap[month],
  };
};

const value = (container: {
  unit: { store: { value: { toNumber(): number } } };
}) => container.unit.store.value.toNumber();

describe('Beef Method 2 calving seasons from calvingSeasonStartMonths', () => {
  describe('cows > 3 years: LCjk=4,5 for the season of calving and the season after calving', () => {
    test.each([
      // month, LC (season of calving), LC (season after calving)
      ['january', 0, 0.4],
      ['february', 0, 0.4],
      ['march', 0, 0], // 0.05 calved in March, outside any calving season
      ['april', 0, 0],
      ['may', 0, 0],
      ['june', 0.2, 0],
      ['july', 0.2, 0],
      ['august', 0.2, 0],
      ['september', 0.4, 0.2],
      ['october', 0.4, 0.2],
      ['november', 0.4, 0.2],
      ['december', 0, 0.4],
    ] as const)('%s', (month, calvingSeason, seasonAfterCalving) => {
      const shares = getCowCalvingShares(
        periodProps(herdWithCalvingSeasonStartMonths, 'cowsGt3Years', month),
      );
      expect(value(shares!.calvingSeason)).toBeCloseTo(calvingSeason, 12);
      expect(value(shares!.seasonAfterCalving)).toBeCloseTo(
        seasonAfterCalving,
        12,
      );
    });
  });

  describe('cows > 3 years: MAjk=4,5 = LC(calving) x 1.3 + LC(after) x 1.1 + (1 - LC(calving) - LC(after)), 3.2.1.1 (4)', () => {
    test.each([
      // month, MA
      ['january', 1.04], // 0.4 x 1.1 + 0.6
      ['february', 1.04],
      ['march', 1],
      ['april', 1],
      ['may', 1],
      ['june', 1.06], // 0.2 x 1.3 + 0.8
      ['july', 1.06],
      ['august', 1.06],
      ['september', 1.14], // 0.4 x 1.3 + 0.2 x 1.1 + 0.4
      ['october', 1.14],
      ['november', 1.14],
      ['december', 1.04],
    ] as const)('%s', (month, expectedMA) => {
      const MA = calculateAdditionalIntakeForMilkProduction(
        periodProps(herdWithCalvingSeasonStartMonths, 'cowsGt3Years', month),
      );
      expect(value(MA)).toBeCloseTo(expectedMA, 12);
    });
  });

  describe('bull calves < 1 year: share born in the season of calving and in the previous season (milk intake, 4.2.1.3 (3))', () => {
    test.each([
      // month, born in the season of calving, born in the previous season
      ['january', 0, 0.5],
      ['february', 0, 0.5],
      ['march', 0, 0],
      ['april', 0, 0],
      ['may', 0, 0],
      ['june', 0.4, 0],
      ['july', 0.4, 0],
      ['august', 0.4, 0],
      ['september', 0.5, 0.4],
      ['october', 0.5, 0.4],
      ['november', 0.5, 0.4],
      ['december', 0, 0.5],
    ] as const)('%s', (month, calvingSeason, seasonAfterCalving) => {
      const shares = getCalfBirthShares(
        periodProps(herdWithCalvingSeasonStartMonths, 'bullsLt1', month),
      );
      expect(value(shares!.calvingSeason)).toBeCloseTo(calvingSeason, 12);
      expect(value(shares!.seasonAfterCalving)).toBeCloseTo(
        seasonAfterCalving,
        12,
      );
    });
  });

  test('the herd given with start months gives the same emissions as the herd given with the season shares worked out by hand', () => {
    const derived = parseHerd(herdWithCalvingSeasonStartMonths);
    const direct = parseHerd(herdWithSeasonShares);

    const entericDerived = calculate32BeefPastureEntericMethaneForHerd(
      derived,
      context,
    );
    const entericDirect = calculate32BeefPastureEntericMethaneForHerd(
      direct,
      context,
    );
    expect(value(entericDerived)).toBeGreaterThan(0);
    expect(value(entericDerived)).toBeCloseTo(value(entericDirect), 12);

    const manureCH4Derived = calculate42BeefPastureManureCH4ForHerd(
      derived,
      context,
    );
    const manureCH4Direct = calculate42BeefPastureManureCH4ForHerd(
      direct,
      context,
    );
    expect(value(manureCH4Derived)).toBeGreaterThan(0);
    expect(value(manureCH4Derived)).toBeCloseTo(value(manureCH4Direct), 12);

    const directN2ODerived = calculateManureManagementSoilDirectN2OForHerd(
      derived,
      context,
    );
    const directN2ODirect = calculateManureManagementSoilDirectN2OForHerd(
      direct,
      context,
    );
    expect(value(directN2ODerived)).toBeGreaterThan(0);
    expect(value(directN2ODerived)).toBeCloseTo(value(directN2ODirect), 12);
  });

  test('an empty list of start months is a herd that does not calve: every share is 0', () => {
    const herd: BeefManureAndEntericHerdInput = {
      ...herdWithCalvingSeasonStartMonths,
      classes: {
        ...herdWithCalvingSeasonStartMonths.classes,
        calvingSeasonStartMonths: [],
      } as BeefManureAndEntericHerdInput['classes'],
    };
    const cows = getCowCalvingShares(
      periodProps(herd, 'cowsGt3Years', 'september'),
    );
    const calves = getCalfBirthShares(
      periodProps(herd, 'bullsLt1', 'september'),
    );
    expect(value(cows!.calvingSeason)).toBe(0);
    expect(value(cows!.seasonAfterCalving)).toBe(0);
    expect(value(calves!.calvingSeason)).toBe(0);
    expect(value(calves!.seasonAfterCalving)).toBe(0);
  });
});

describe('Beef Method 2 calving input validation', () => {
  // Checked against the monthly classes schema itself: the herd's `classes` field is a
  // union (empty, seasonal or monthly), which reports a failure as "Invalid input".
  const issuesFor = (herd: { classes: unknown }) => {
    const result = BeefClassesMonthlyInputSchema.safeParse(herd.classes);
    return result.success ? [] : result.error.issues.map((i) => i.message);
  };

  /** A copy of an example herd whose months can be changed for one test */
  type EditableHerd = {
    classes: {
      calvingSeasonStartMonths?: string[];
      cowsGt3Years: Record<Month, Record<string, unknown>>;
      bullsLt1: Record<Month, Record<string, unknown>>;
    };
  };
  const editableCopy = (herd: BeefManureAndEntericHerdInput) =>
    structuredClone(herd) as unknown as EditableHerd;

  test('an invalid herd is rejected by the herd schema too', () => {
    const herd = editableCopy(herdWithCalvingSeasonStartMonths);
    delete herd.classes.cowsGt3Years.july.fractionCowsCalvingThisMonth;
    expect(
      HerdSchema.safeParse({ ...herd, isFebruaryInLeapYear: false }).success,
    ).toBe(false);
  });

  test('both example herds are valid', () => {
    expect(issuesFor(herdWithCalvingSeasonStartMonths)).toEqual([]);
    expect(issuesFor(herdWithSeasonShares)).toEqual([]);
  });

  test('with start months, every month needs fractionCowsCalvingThisMonth', () => {
    const herd = editableCopy(herdWithCalvingSeasonStartMonths);
    delete herd.classes.cowsGt3Years.july.fractionCowsCalvingThisMonth;
    expect(issuesFor(herd)).toEqual([
      'cowsGt3Years.july.fractionCowsCalvingThisMonth is required when calvingSeasonStartMonths is given.',
    ]);
  });

  test('with start months, the season shares cannot also be given', () => {
    const herd = editableCopy(herdWithCalvingSeasonStartMonths);
    herd.classes.cowsGt3Years.july.fractionCowsThisSeasonInCalf = {
      value: 0.2,
    };
    expect(issuesFor(herd)).toEqual([
      "cowsGt3Years.july.fractionCowsThisSeasonInCalf can't be given with calvingSeasonStartMonths: it is derived from fractionCowsCalvingThisMonth and the calving season start months.",
    ]);
  });

  test('without start months, every month needs the season shares', () => {
    const herd = editableCopy(herdWithSeasonShares);
    delete herd.classes.bullsLt1.october.fractionCalvesBornPreviousSeason;
    expect(issuesFor(herd)).toEqual([
      'bullsLt1.october.fractionCalvesBornPreviousSeason is required when calvingSeasonStartMonths is not given.',
    ]);
  });

  test('without start months, the calving in each month is not accepted', () => {
    const herd = editableCopy(herdWithSeasonShares);
    herd.classes.cowsGt3Years.june.fractionCowsCalvingThisMonth = {
      value: 0.1,
    };
    expect(issuesFor(herd)).toEqual([
      'cowsGt3Years.june.fractionCowsCalvingThisMonth is only used with calvingSeasonStartMonths. Give calvingSeasonStartMonths, or fractionCowsThisSeasonInCalf and fractionCowsPreviousSeasonInCalf instead.',
    ]);
  });

  test('a start month listed twice is rejected', () => {
    const herd = editableCopy(herdWithCalvingSeasonStartMonths);
    herd.classes.calvingSeasonStartMonths = ['june', 'september', 'june'];
    expect(issuesFor(herd)).toEqual([
      'calvingSeasonStartMonths lists june more than once.',
    ]);
  });

  test('calving in the season of calving and the season after it cannot add up to more than 1', () => {
    // September to November are the September calving season (0.3 + 0.1 + 0 = 0.4) and
    // also the season after the June calving season (0.2): 0.6 of the cows, allowed.
    // Raising November to 0.5 makes the September season 0.9, and 0.9 + 0.2 = 1.1.
    const herd = editableCopy(herdWithCalvingSeasonStartMonths);
    herd.classes.cowsGt3Years.november.fractionCowsCalvingThisMonth = {
      value: 0.5,
    };
    expect(issuesFor(herd)).toEqual([
      'cowsGt3Years.september: the calving in its season of calving (0.9) and in its season after calving (0.2) add up to more than 1. Check fractionCowsCalvingThisMonth and calvingSeasonStartMonths.',
      'cowsGt3Years.october: the calving in its season of calving (0.9) and in its season after calving (0.2) add up to more than 1. Check fractionCowsCalvingThisMonth and calvingSeasonStartMonths.',
      'cowsGt3Years.november: the calving in its season of calving (0.9) and in its season after calving (0.2) add up to more than 1. Check fractionCowsCalvingThisMonth and calvingSeasonStartMonths.',
    ]);
  });
});
