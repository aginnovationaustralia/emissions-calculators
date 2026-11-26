import {
  BeefCalfClassPeriodInputTransformed,
  BeefClassPeriodWithCalvesInputTransformed,
  isBeefCalfClassPeriodInput,
  isBeefClassPeriodInputWithCalves,
} from '@/calculators/Beef/types/beef-class-period.input';
import { Month, Months, Season, Seasons } from '@/constants/enums';
import { Container, root } from '@/tools/containers';
import { zero } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { head, RealNumber } from '@/tools/units';

const zeroHead = root(head(0), { name: 'zero head' });
import {
  getMonthsForSeasonAfterCalving,
  getMonthsForSeasonOfCalving,
  getSeasonsForSeasonAfterCalving,
  getSeasonsForSeasonOfCalving,
} from './calving-seasons';
import { BeefPeriodProps } from './helpers';

/** The shares of a class in calf (or born) in the season of calving and the season after it. */
export type CalvingShares = {
  /** LCjk=4,5 (calving), or the share of the calves born in the season of calving */
  calvingSeason: Container<RealNumber>;
  /** LCjk=4,5 (after calving), or the share of the calves born in the season before */
  seasonAfterCalving: Container<RealNumber>;
};

type CalvingPeriods = {
  /** The periods whose calving makes up the share for the season of calving */
  seasonOfCalving: string[];
  /** The periods whose calving makes up the share for the season after calving */
  seasonAfterCalving: string[];
};

const isMonth = (name: string): name is Month =>
  (Months as readonly string[]).includes(name);
const isSeason = (name: string): name is Season =>
  (Seasons as readonly string[]).includes(name);

/**
 * The periods whose calving makes up each share in the current period, from the herd's
 * calving seasons (seasonal herds) or calving season start months (monthly herds). See
 * calving-seasons.ts for the rules.
 */
export const getCalvingPeriods = ({
  herd,
  periodName,
}: BeefPeriodProps): CalvingPeriods => {
  const { classes } = herd;
  if ('calvingSeasonStartMonths' in classes && isMonth(periodName)) {
    const startMonths = classes.calvingSeasonStartMonths.map((m) => m.unit);
    return {
      seasonOfCalving: getMonthsForSeasonOfCalving(periodName, startMonths),
      seasonAfterCalving: getMonthsForSeasonAfterCalving(
        periodName,
        startMonths,
      ),
    };
  }
  if ('calvingSeasons' in classes && isSeason(periodName)) {
    const calvingSeasons = classes.calvingSeasons.map((s) => s.unit);
    return {
      seasonOfCalving: getSeasonsForSeasonOfCalving(periodName, calvingSeasons),
      seasonAfterCalving: getSeasonsForSeasonAfterCalving(
        periodName,
        calvingSeasons,
      ),
    };
  }
  // The input schemas rule this out: every herd's classes give their calving seasons
  throw new Error(
    `Beef period ${periodName}: the herd's classes give no calving seasons for it`,
  );
};

type ClassPeriods<T> = Record<string, T>;

/** Sums the class's `fractionCowsCalving` over the given periods (those of a calving season). */
const sumCowsCalving = (
  periodProps: BeefPeriodProps,
  periods: string[],
  name: string,
) => {
  const classPeriods =
    periodProps.classInput as unknown as ClassPeriods<BeefClassPeriodWithCalvesInputTransformed>;
  return sum(
    periods.map((period) => classPeriods[period].fractionCowsCalving),
    zero,
    { name },
  );
};

/** Sums the class's `calvesBorn` over the given periods (those of a calving season). */
const sumCalvesBorn = (
  periodProps: BeefPeriodProps,
  periods: string[],
  name: string,
) => {
  const classPeriods =
    periodProps.classInput as unknown as ClassPeriods<BeefCalfClassPeriodInputTransformed>;
  return sum(
    periods.map((period) => classPeriods[period].calvesBorn),
    zeroHead,
    { name },
  );
};

/**
 * LCjk=4,5 for a cow class in a period: the proportion of cows in calf in the season of
 * calving, applied to the season of calving and to the season after it, and 0 for all other
 * periods (Chapter 3, 3.2.1.1 (4); 3.2.2.1 for Method 2 herd flow). Each share is the class's
 * `fractionCowsCalving` summed over the periods of that calving season. Returns `undefined`
 * for classes that are not cows > 1 year.
 */
export const getCowCalvingShares = (
  periodProps: BeefPeriodProps,
): CalvingShares | undefined => {
  if (!isBeefClassPeriodInputWithCalves(periodProps.currentPeriod)) {
    return undefined;
  }
  const { seasonOfCalving, seasonAfterCalving } =
    getCalvingPeriods(periodProps);
  const { periodName } = periodProps;
  const number = periodProps.classInput.number;
  const reference = 'Chapter 3, 3.2.1.1 (4), 3.2.2.1 (LCjk=4,5)';

  return {
    calvingSeason: sumCowsCalving(
      periodProps,
      seasonOfCalving,
      `LCjk=${number} (season of calving, j=${periodName})`,
    ).reference(reference),
    seasonAfterCalving: sumCowsCalving(
      periodProps,
      seasonAfterCalving,
      `LCjk=${number} (season after calving, j=${periodName})`,
    ).reference(reference),
  };
};

/**
 * The share of a calf class born in the season of calving and in the season before it, for
 * its milk intake MCjk=1,3,6 (4.2.1.3 (3)): the calves born in that calving season
 * (`calvesBorn` summed over its periods, CRjk) divided by the number of animals in the class
 * in the current period (Njk), as GEETA does (CRcalv / Njkl). 0 when the class has no animals
 * in the period. Returns `undefined` for classes that are not calves.
 */
export const getCalfBirthShares = (
  periodProps: BeefPeriodProps,
): CalvingShares | undefined => {
  const { currentPeriod } = periodProps;
  if (!isBeefCalfClassPeriodInput(currentPeriod)) {
    return undefined;
  }
  const { seasonOfCalving, seasonAfterCalving } =
    getCalvingPeriods(periodProps);
  const { periodName } = periodProps;
  const number = periodProps.classInput.number;
  const reference = '4.2.1.3 (3)';
  const animals = currentPeriod.head;
  const noAnimals = animals.unit.store.value.isZero();

  const share = (periods: string[], season: string) => {
    const born = sumCalvesBorn(
      periodProps,
      periods,
      `CRjk=${number} (${season}, j=${periodName})`,
    );
    const name = `CRjk=${number} / Njk (${season}, j=${periodName})`;
    if (noAnimals) {
      return zero.named(name);
    }
    return born.divide(animals).named(name).reference(reference);
  };

  return {
    calvingSeason: share(seasonOfCalving, 'season of calving'),
    seasonAfterCalving: share(seasonAfterCalving, 'season before'),
  };
};
