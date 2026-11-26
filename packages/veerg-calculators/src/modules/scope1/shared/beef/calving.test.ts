import {
  BeefClassesMonthlyInput,
  BeefClassesMonthlyInputSchema,
} from '@/calculators/Beef/types/beef-classes-monthly.input';
import { BeefClassesSeasonalInputSchema } from '@/calculators/Beef/types/beef-classes-seasonal.input';
import { HasIsFebruaryInLeapYearInputSchemaForBeef } from '@/calculators/types/has-is-february-in-leap-year.input';
import { Month, Season } from '@/constants/enums';
import { daysInMonth, monthSeasonMap } from '@/modules/shared';
import { testContext } from '@/test/Grains/context';
import { root } from '@/tools/containers';
import { days } from '@/tools/units';
import { calculateAdditionalIntakeForMilkProduction } from './calculate';
import { getCalfBirthShares, getCowCalvingShares } from './calving';
import { BeefPeriodProps } from './helpers';
import {
  BeefManureAndEntericHerdInput,
  BeefManureAndEntericHerdInputSchema,
} from './input';

/**
 * Calving for pasture beef: the herd says when its calving seasons are,
 * and each period gives the calving in it.
 *
 * Methodological Guidance Chapter 3 v1.1:
 * - 3.2.1.1 (4): LCjk=4,5 is "applied to calving season and the season immediately after
 *   calving ... for all other seasons LCjk=4,5 = 0"
 * - 3.2.2.1: "the calving season should be considered 3 months from the calving month and
 *   the season after calving the 3 months after this period if Method 2 herd flow data is
 *   used ... and that for all other time periods Ljk=4,5 = 0."
 *
 * The calves' shares for milk intake (4.2.1.3 (3)) follow the same seasons: the calves born
 * in the calving season divided by the number of calves in the class in the period
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

/**
 * A monthly (Method 2) herd with two calving seasons, starting in June and in September.
 *
 * Cows > 3 years (100 head), proportion of the class calving in each month:
 *   June 0.10, July 0.05, August 0.05            -> June season total 0.20
 *   September 0.30, October 0.10                 -> September season total 0.40
 *
 * Bull calves < 1 year (60 head, 50 in December), calves born in each month:
 *   June 12, July 6, August 6                    -> June season total 24
 *   September 18, October 6, November 6          -> September season total 30
 */
const monthlyClasses: BeefClassesMonthlyInput = {
  period: 'monthly',
  calvingSeasonStartMonths: ['june', 'september'],
  cowsGt3Years: {
    january: { head: { value: 100 }, fractionCowsCalving: { value: 0 } },
    february: { head: { value: 100 }, fractionCowsCalving: { value: 0 } },
    march: { head: { value: 100 }, fractionCowsCalving: { value: 0 } },
    april: { head: { value: 100 }, fractionCowsCalving: { value: 0 } },
    may: { head: { value: 100 }, fractionCowsCalving: { value: 0 } },
    june: { head: { value: 100 }, fractionCowsCalving: { value: 0.1 } },
    july: { head: { value: 100 }, fractionCowsCalving: { value: 0.05 } },
    august: { head: { value: 100 }, fractionCowsCalving: { value: 0.05 } },
    september: { head: { value: 100 }, fractionCowsCalving: { value: 0.3 } },
    october: { head: { value: 100 }, fractionCowsCalving: { value: 0.1 } },
    november: { head: { value: 100 }, fractionCowsCalving: { value: 0 } },
    december: { head: { value: 100 }, fractionCowsCalving: { value: 0 } },
  },
  bullsLt1: {
    january: { head: { value: 60 }, calvesBorn: { value: 0 } },
    february: { head: { value: 60 }, calvesBorn: { value: 0 } },
    march: { head: { value: 60 }, calvesBorn: { value: 0 } },
    april: { head: { value: 60 }, calvesBorn: { value: 0 } },
    may: { head: { value: 60 }, calvesBorn: { value: 0 } },
    june: { head: { value: 60 }, calvesBorn: { value: 12 } },
    july: { head: { value: 60 }, calvesBorn: { value: 6 } },
    august: { head: { value: 60 }, calvesBorn: { value: 6 } },
    september: { head: { value: 60 }, calvesBorn: { value: 18 } },
    october: { head: { value: 60 }, calvesBorn: { value: 6 } },
    november: { head: { value: 60 }, calvesBorn: { value: 6 } },
    december: { head: { value: 50 }, calvesBorn: { value: 0 } },
  },
};

const monthlyHerd: BeefManureAndEntericHerdInput = {
  ...herdDetails,
  classes: monthlyClasses,
};

/**
 * A seasonal (Method 1) herd that calves in winter and spring.
 *
 * Cows > 3 years (100 head), proportion of the class calving in each season:
 *   spring 0.6, winter 0.2
 *
 * Bull calves < 1 year, head and calves born in each season:
 *   spring 50 head, 40 born; summer 80 head; autumn 80 head;
 *   winter 40 head, 10 born
 */
const seasonalHerd: BeefManureAndEntericHerdInput = {
  ...herdDetails,
  classes: {
    period: 'seasonal',
    calvingSeasons: ['winter', 'spring'],
    cowsGt3Years: {
      spring: { head: { value: 100 }, fractionCowsCalving: { value: 0.6 } },
      summer: { head: { value: 100 }, fractionCowsCalving: { value: 0 } },
      autumn: { head: { value: 100 }, fractionCowsCalving: { value: 0 } },
      winter: { head: { value: 100 }, fractionCowsCalving: { value: 0.2 } },
    },
    bullsLt1: {
      spring: { head: { value: 50 }, calvesBorn: { value: 40 } },
      summer: { head: { value: 80 }, calvesBorn: { value: 0 } },
      autumn: { head: { value: 80 }, calvesBorn: { value: 0 } },
      winter: { head: { value: 40 }, calvesBorn: { value: 10 } },
    },
  },
};

const context = testContext('beef');

/** The props the calculation passes for one class in one period */
const periodProps = (
  herdInput: BeefManureAndEntericHerdInput,
  className: 'cowsGt3Years' | 'bullsLt1',
  period: Month | Season,
): BeefPeriodProps => {
  const herd = parseHerd(herdInput);
  const classInput = (herd.classes as Record<string, unknown>)[
    className
  ] as BeefPeriodProps['classInput'];
  const isMonth = period in monthSeasonMap;
  return {
    herd,
    context,
    className,
    classInput,
    currentPeriod: (
      classInput as unknown as Record<string, BeefPeriodProps['currentPeriod']>
    )[period],
    periodName: period,
    periodDuration: isMonth
      ? daysInMonth(period as Month, herd.isFebruaryInLeapYear)
      : root(days(91.25)),
    seasonName: isMonth ? monthSeasonMap[period as Month] : (period as Season),
  };
};

const value = (container: {
  unit: { store: { value: { toNumber(): number } } };
}) => container.unit.store.value.toNumber();

describe('Beef monthly (Method 2) calving seasons from calvingSeasonStartMonths', () => {
  describe('cows > 3 years: LCjk=4,5 for the season of calving and the season after calving', () => {
    test.each([
      // month, LC (season of calving), LC (season after calving)
      ['january', 0, 0.4],
      ['february', 0, 0.4],
      ['march', 0, 0],
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
        periodProps(monthlyHerd, 'cowsGt3Years', month),
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
        periodProps(monthlyHerd, 'cowsGt3Years', month),
      );
      expect(value(MA)).toBeCloseTo(expectedMA, 12);
    });
  });

  describe('bull calves < 1 year: calves born in the season of calving and in the season before, over the head in the month (milk intake, 4.2.1.3 (3))', () => {
    test.each([
      // month, born in the season of calving / head, born in the season before / head
      ['january', 0, 0.5], // 30 / 60
      ['february', 0, 0.5],
      ['march', 0, 0],
      ['april', 0, 0],
      ['may', 0, 0],
      ['june', 0.4, 0], // 24 / 60
      ['july', 0.4, 0],
      ['august', 0.4, 0],
      ['september', 0.5, 0.4], // 30 / 60, 24 / 60
      ['october', 0.5, 0.4],
      ['november', 0.5, 0.4],
      ['december', 0, 0.6], // 30 / 50: 50 head in December
    ] as const)('%s', (month, calvingSeason, seasonAfterCalving) => {
      const shares = getCalfBirthShares(
        periodProps(monthlyHerd, 'bullsLt1', month),
      );
      expect(value(shares!.calvingSeason)).toBeCloseTo(calvingSeason, 12);
      expect(value(shares!.seasonAfterCalving)).toBeCloseTo(
        seasonAfterCalving,
        12,
      );
    });
  });

  test('an empty list of start months is a herd that does not calve: every share is 0', () => {
    const herd: BeefManureAndEntericHerdInput = {
      ...herdDetails,
      classes: {
        period: 'monthly',
        calvingSeasonStartMonths: [],
        cowsGt3Years: {
          january: { head: { value: 100 }, fractionCowsCalving: { value: 0 } },
          february: { head: { value: 100 }, fractionCowsCalving: { value: 0 } },
          march: { head: { value: 100 }, fractionCowsCalving: { value: 0 } },
          april: { head: { value: 100 }, fractionCowsCalving: { value: 0 } },
          may: { head: { value: 100 }, fractionCowsCalving: { value: 0 } },
          june: { head: { value: 100 }, fractionCowsCalving: { value: 0 } },
          july: { head: { value: 100 }, fractionCowsCalving: { value: 0 } },
          august: { head: { value: 100 }, fractionCowsCalving: { value: 0 } },
          september: {
            head: { value: 100 },
            fractionCowsCalving: { value: 0 },
          },
          october: { head: { value: 100 }, fractionCowsCalving: { value: 0 } },
          november: { head: { value: 100 }, fractionCowsCalving: { value: 0 } },
          december: { head: { value: 100 }, fractionCowsCalving: { value: 0 } },
        },
      },
    };
    const cows = getCowCalvingShares(
      periodProps(herd, 'cowsGt3Years', 'september'),
    );
    expect(value(cows!.calvingSeason)).toBe(0);
    expect(value(cows!.seasonAfterCalving)).toBe(0);
    expect(
      value(
        calculateAdditionalIntakeForMilkProduction(
          periodProps(herd, 'cowsGt3Years', 'september'),
        ),
      ),
    ).toBe(1);
  });
});

describe('Beef seasonal (Method 1) calving seasons from calvingSeasons', () => {
  describe('cows > 3 years: LCjk=4,5 and MAjk=4,5 in each season', () => {
    test.each([
      // season, LC (season of calving), LC (season after calving), MA
      ['spring', 0.6, 0.2, 1.2], // 0.6 x 1.3 + 0.2 x 1.1 + 0.2
      ['summer', 0, 0.6, 1.06], // 0.6 x 1.1 + 0.4
      ['autumn', 0, 0, 1], // summer is not a calving season
      ['winter', 0.2, 0, 1.06], // 0.2 x 1.3 + 0.8
    ] as const)(
      '%s',
      (season, calvingSeason, seasonAfterCalving, expectedMA) => {
        const props = periodProps(seasonalHerd, 'cowsGt3Years', season);
        const shares = getCowCalvingShares(props);
        expect(value(shares!.calvingSeason)).toBeCloseTo(calvingSeason, 12);
        expect(value(shares!.seasonAfterCalving)).toBeCloseTo(
          seasonAfterCalving,
          12,
        );
        expect(
          value(calculateAdditionalIntakeForMilkProduction(props)),
        ).toBeCloseTo(expectedMA, 12);
      },
    );
  });

  describe('bull calves < 1 year: calves born in the season of calving and in the season before, over the head in the season', () => {
    test.each([
      // season, born in the season of calving / head, born in the season before / head
      ['spring', 0.8, 0.2], // 40 / 50, 10 / 50 (winter)
      ['summer', 0, 0.5], // 40 / 80 (spring)
      ['autumn', 0, 0],
      ['winter', 0.25, 0], // 10 / 40
    ] as const)('%s', (season, calvingSeason, seasonAfterCalving) => {
      const shares = getCalfBirthShares(
        periodProps(seasonalHerd, 'bullsLt1', season),
      );
      expect(value(shares!.calvingSeason)).toBeCloseTo(calvingSeason, 12);
      expect(value(shares!.seasonAfterCalving)).toBeCloseTo(
        seasonAfterCalving,
        12,
      );
    });
  });

  test('a calf class with no animals in a season has no share born', () => {
    const herd: BeefManureAndEntericHerdInput = {
      ...seasonalHerd,
      classes: {
        period: 'seasonal',
        calvingSeasons: ['spring'],
        bullsLt1: {
          spring: { head: { value: 0 }, calvesBorn: { value: 10 } },
          summer: { head: { value: 0 }, calvesBorn: { value: 0 } },
          autumn: { head: { value: 0 }, calvesBorn: { value: 0 } },
          winter: { head: { value: 0 }, calvesBorn: { value: 0 } },
        },
      },
    };
    const shares = getCalfBirthShares(periodProps(herd, 'bullsLt1', 'spring'));
    expect(value(shares!.calvingSeason)).toBe(0);
    expect(value(shares!.seasonAfterCalving)).toBe(0);
  });
});

describe('Beef calving input validation', () => {
  // Checked against the classes schemas themselves: the herd's `classes` field is a union
  // (empty, seasonal or monthly), which reports a failure as "Invalid input".
  const monthlyIssues = (classes: unknown) => {
    const result = BeefClassesMonthlyInputSchema.safeParse(classes);
    return result.success ? [] : result.error.issues.map((i) => i.message);
  };
  const seasonalIssues = (classes: unknown) => {
    const result = BeefClassesSeasonalInputSchema.safeParse(classes);
    return result.success ? [] : result.error.issues.map((i) => i.message);
  };

  /** A copy of an example herd's classes that can be changed for one test */
  type EditableClasses = {
    calvingSeasonStartMonths?: string[];
    calvingSeasons?: string[];
    cowsGt3Years: Record<string, Record<string, unknown>>;
    bullsLt1: Record<string, Record<string, unknown>>;
  };
  const editableClasses = (herd: BeefManureAndEntericHerdInput) =>
    structuredClone(herd.classes) as unknown as EditableClasses;

  test('both example herds are valid', () => {
    expect(monthlyIssues(monthlyHerd.classes)).toEqual([]);
    expect(seasonalIssues(seasonalHerd.classes)).toEqual([]);
  });

  test('an invalid herd is rejected by the herd schema too', () => {
    const classes = editableClasses(monthlyHerd);
    delete classes.calvingSeasonStartMonths;
    expect(
      HerdSchema.safeParse({
        ...monthlyHerd,
        classes,
        isFebruaryInLeapYear: false,
      }).success,
    ).toBe(false);
  });

  test('a monthly herd must give calvingSeasonStartMonths', () => {
    const classes = editableClasses(monthlyHerd);
    delete classes.calvingSeasonStartMonths;
    const result = BeefClassesMonthlyInputSchema.safeParse(classes);
    expect(result.error?.issues.map((i) => i.path)).toEqual([
      ['calvingSeasonStartMonths'],
    ]);
  });

  test('a seasonal herd must give calvingSeasons', () => {
    const classes = editableClasses(seasonalHerd);
    delete classes.calvingSeasons;
    const result = BeefClassesSeasonalInputSchema.safeParse(classes);
    expect(result.error?.issues.map((i) => i.path)).toEqual([
      ['calvingSeasons'],
    ]);
  });

  test('every period of a cow class needs fractionCowsCalving, and of a calf class calvesBorn', () => {
    const classes = editableClasses(monthlyHerd);
    delete classes.cowsGt3Years.july.fractionCowsCalving;
    delete classes.bullsLt1.october.calvesBorn;
    const result = BeefClassesMonthlyInputSchema.safeParse(classes);
    expect(result.error?.issues.map((i) => i.path)).toEqual([
      ['bullsLt1', 'october', 'calvesBorn'],
      ['cowsGt3Years', 'july', 'fractionCowsCalving'],
    ]);
  });

  test('the old season share inputs are not accepted', () => {
    const classes = editableClasses(seasonalHerd);
    classes.cowsGt3Years.spring = {
      head: { value: 100 },
      fractionCowsThisSeasonInCalf: { value: 0.6 },
      fractionCowsPreviousSeasonInCalf: { value: 0.2 },
    };
    const result = BeefClassesSeasonalInputSchema.safeParse(classes);
    expect(result.success).toBe(false);
  });

  test('monthly: cows calving in a month outside every calving season are rejected', () => {
    // The calving seasons run June to August and September to November: March is in neither
    const classes = editableClasses(monthlyHerd);
    classes.cowsGt3Years.march.fractionCowsCalving = { value: 0.05 };
    expect(monthlyIssues(classes)).toEqual([
      'cowsGt3Years.march.fractionCowsCalving: 0.05 of the cows calve in march, which is in no calving season. Add a month to calvingSeasonStartMonths that starts a calving season covering march (march or one of the 2 months before it), or set fractionCowsCalving to 0.',
    ]);
  });

  test('monthly: calves born in a month outside every calving season are rejected', () => {
    const classes = editableClasses(monthlyHerd);
    classes.bullsLt1.december.calvesBorn = { value: 4 };
    expect(monthlyIssues(classes)).toEqual([
      'bullsLt1.december.calvesBorn: 4 calves are born in december, which is in no calving season. Add a month to calvingSeasonStartMonths that starts a calving season covering december (december or one of the 2 months before it), or set calvesBorn to 0.',
    ]);
  });

  test('monthly: a herd with no calving seasons cannot have calving', () => {
    const classes = editableClasses(monthlyHerd);
    classes.calvingSeasonStartMonths = [];
    // every month with calving or calves born in the example herd
    expect(monthlyIssues(classes)).toHaveLength(5 + 6);
  });

  test('seasonal: calving in a season that is not a calving season is rejected', () => {
    const classes = editableClasses(seasonalHerd);
    classes.cowsGt3Years.summer.fractionCowsCalving = { value: 0.1 };
    classes.bullsLt1.summer.calvesBorn = { value: 5 };
    expect(seasonalIssues(classes)).toEqual([
      'cowsGt3Years.summer.fractionCowsCalving: 0.1 of the cows calve in summer, which is in no calving season. Add summer to calvingSeasons, or set fractionCowsCalving to 0.',
      'bullsLt1.summer.calvesBorn: 5 calves are born in summer, which is in no calving season. Add summer to calvingSeasons, or set calvesBorn to 0.',
    ]);
  });

  test('a start month listed twice is rejected', () => {
    const classes = editableClasses(monthlyHerd);
    classes.calvingSeasonStartMonths = ['june', 'september', 'june'];
    expect(monthlyIssues(classes)).toEqual([
      'calvingSeasonStartMonths lists june more than once.',
    ]);
  });

  test('a calving season listed twice is rejected', () => {
    const classes = editableClasses(seasonalHerd);
    classes.calvingSeasons = ['winter', 'spring', 'winter'];
    expect(seasonalIssues(classes)).toEqual([
      'calvingSeasons lists winter more than once.',
    ]);
  });

  test('monthly: calving in the season of calving and the season after it cannot add up to more than 1', () => {
    // September to November are the September calving season (0.3 + 0.1 + 0 = 0.4) and
    // also the season after the June calving season (0.2): 0.6 of the cows, allowed.
    // Raising November to 0.5 makes the September season 0.9, and 0.9 + 0.2 = 1.1.
    const classes = editableClasses(monthlyHerd);
    classes.cowsGt3Years.november.fractionCowsCalving = { value: 0.5 };
    expect(monthlyIssues(classes)).toEqual([
      'cowsGt3Years.september: the calving in its season of calving (0.9) and in its season after calving (0.2) add up to more than 1. Check fractionCowsCalving and calvingSeasonStartMonths.',
      'cowsGt3Years.october: the calving in its season of calving (0.9) and in its season after calving (0.2) add up to more than 1. Check fractionCowsCalving and calvingSeasonStartMonths.',
      'cowsGt3Years.november: the calving in its season of calving (0.9) and in its season after calving (0.2) add up to more than 1. Check fractionCowsCalving and calvingSeasonStartMonths.',
    ]);
  });

  test('seasonal: calving in the season of calving and the season after it cannot add up to more than 1', () => {
    // Spring is a calving season (0.6) and the season after the winter one (0.2): 0.8,
    // allowed. Raising winter to 0.5 makes spring 0.6 + 0.5 = 1.1.
    const classes = editableClasses(seasonalHerd);
    classes.cowsGt3Years.winter.fractionCowsCalving = { value: 0.5 };
    expect(seasonalIssues(classes)).toEqual([
      'cowsGt3Years.spring: the calving in its season of calving (0.6) and in its season after calving (0.5) add up to more than 1. Check fractionCowsCalving and calvingSeasons.',
    ]);
  });
});
