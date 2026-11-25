import {
  BeefClassPeriodExtendedInputTransformed,
  isBeefCalfClassPeriodInput,
  isBeefClassPeriodInputWithCalves,
} from '@/calculators/Beef/types/beef-class-period.input';
import { Month, Months } from '@/constants/enums';
import { Container } from '@/tools/containers';
import { zero } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { RealNumber } from '@/tools/units';
import {
  getMonthsForSeasonAfterCalving,
  getMonthsForSeasonOfCalving,
} from './calving-seasons';
import { BeefPeriodProps } from './helpers';

/** The shares of a class in calf (or born) in the season of calving and the season after it. */
export type CalvingShares = {
  /** LCjk=4,5 (calving), or the calves born in the season of calving */
  calvingSeason: Container<RealNumber>;
  /** LCjk=4,5 (after calving), or the calves born in the previous (calving) season */
  seasonAfterCalving: Container<RealNumber>;
};

const isMonth = (name: string): name is Month =>
  (Months as readonly string[]).includes(name);

/** The herd's calving season start months, when its monthly classes give them. */
export const getCalvingSeasonStartMonths = ({
  herd,
}: BeefPeriodProps): Month[] | undefined => {
  const { classes } = herd;
  if (!('calvingSeasonStartMonths' in classes)) {
    return undefined;
  }
  return classes.calvingSeasonStartMonths?.map((m) => m.unit);
};

/**
 * Sums a per-month input over the given months of the class. The months are those of a
 * fixed calving season (see calving-seasons.ts), so the total is the season's share.
 */
const sumOverMonths = (
  periodProps: BeefPeriodProps,
  months: Month[],
  key: 'fractionCowsCalvingThisMonth' | 'fractionCalvesBornThisMonth',
  name: string,
): Container<RealNumber> => {
  const classPeriods = periodProps.classInput as unknown as Record<
    Month,
    BeefClassPeriodExtendedInputTransformed &
      Partial<Record<typeof key, Container<RealNumber>>>
  >;
  const values = months.map(
    (month) => classPeriods[month][key] ?? zero.named(`${key} (${month})`),
  );
  return sum(values, zero, { name });
};

/**
 * The shares for a period in the derived form: the herd gives its calving season start
 * months and the class gives the calving in each month. Returns `undefined` when the
 * herd gives the season shares directly, or the period is not monthly.
 */
const deriveFromStartMonths = (
  periodProps: BeefPeriodProps,
  key: 'fractionCowsCalvingThisMonth' | 'fractionCalvesBornThisMonth',
  label: string,
  reference: string,
): CalvingShares | undefined => {
  const startMonths = getCalvingSeasonStartMonths(periodProps);
  const { periodName } = periodProps;
  if (startMonths === undefined || !isMonth(periodName)) {
    return undefined;
  }
  const number = periodProps.classInput.number;

  return {
    calvingSeason: sumOverMonths(
      periodProps,
      getMonthsForSeasonOfCalving(periodName, startMonths),
      key,
      `${label}jk=${number} (season of calving, j=${periodName})`,
    ).reference(reference),
    seasonAfterCalving: sumOverMonths(
      periodProps,
      getMonthsForSeasonAfterCalving(periodName, startMonths),
      key,
      `${label}jk=${number} (season after calving, j=${periodName})`,
    ).reference(reference),
  };
};

/**
 * LCjk=4,5 for a cow class in a period: the proportion of cows in calf in the season of
 * calving, applied to the season of calving and to the season after it (3.2.1.1 (4),
 * 4.2.1.3 (5)). Returns `undefined` for classes that are not cows > 1 year.
 *
 * For a monthly herd with calving season start months, the shares come from the fixed
 * 3-month calving seasons (Chapter 3, 3.2.2.1): each month of a calving season gets the
 * season's total calving, each month of the season after it gets that total too, and all
 * other months get 0. Otherwise they are the period's own inputs.
 */
export const getCowCalvingShares = (
  periodProps: BeefPeriodProps,
): CalvingShares | undefined => {
  const { currentPeriod } = periodProps;
  if (!isBeefClassPeriodInputWithCalves(currentPeriod)) {
    return undefined;
  }

  const derived = deriveFromStartMonths(
    periodProps,
    'fractionCowsCalvingThisMonth',
    'LC',
    'Chapter 3, 3.2.2.1 (LCjk=4,5)',
  );
  if (derived) {
    return derived;
  }

  const { fractionCowsThisSeasonInCalf, fractionCowsPreviousSeasonInCalf } =
    currentPeriod;
  if (
    fractionCowsThisSeasonInCalf === undefined ||
    fractionCowsPreviousSeasonInCalf === undefined
  ) {
    // The input schema rules this out: without start months both are required
    throw new Error(
      `Beef ${periodProps.className} ${periodProps.periodName}: no calving season shares`,
    );
  }
  return {
    calvingSeason: fractionCowsThisSeasonInCalf,
    seasonAfterCalving: fractionCowsPreviousSeasonInCalf,
  };
};

/**
 * The share of a calf class born in the season of calving and in the season before it,
 * for its milk intake MCjk=1,3,6 (4.2.1.3 (3)). Returns `undefined` for classes that are
 * not calves. Derived from the fixed calving seasons as for the cows
 * (`getCowCalvingShares`) when the herd gives its calving season start months.
 */
export const getCalfBirthShares = (
  periodProps: BeefPeriodProps,
): CalvingShares | undefined => {
  const { currentPeriod } = periodProps;
  if (!isBeefCalfClassPeriodInput(currentPeriod)) {
    return undefined;
  }

  const derived = deriveFromStartMonths(
    periodProps,
    'fractionCalvesBornThisMonth',
    'CR',
    'Chapter 3, 3.2.2.1 (calving season); 4.2.1.3 (3)',
  );
  if (derived) {
    return derived;
  }

  const { fractionCalvesBornThisSeason, fractionCalvesBornPreviousSeason } =
    currentPeriod;
  if (
    fractionCalvesBornThisSeason === undefined ||
    fractionCalvesBornPreviousSeason === undefined
  ) {
    // The input schema rules this out: without start months both are required
    throw new Error(
      `Beef ${periodProps.className} ${periodProps.periodName}: no calf birth shares`,
    );
  }
  return {
    calvingSeason: fractionCalvesBornThisSeason,
    seasonAfterCalving: fractionCalvesBornPreviousSeason,
  };
};
