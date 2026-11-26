import { InputContainer } from '@/tools/inputs';
import { Head, RealNumber } from '@/tools/units';
import z from 'zod';

const COW_CLASSES = ['cows1To2Years', 'cows2To3Years', 'cowsGt3Years'] as const;
const CALF_CLASSES = ['bullsLt1', 'cowsLt1', 'steersLt1'] as const;

type CowPeriod = { fractionCowsCalving: InputContainer<RealNumber> };
type CalfPeriod = {
  head: InputContainer<Head>;
  calvesBorn: InputContainer<Head>;
};

/** The calving classes of a herd, as far as these checks read them */
type CalvingClasses<P extends string> = Partial<
  Record<(typeof COW_CLASSES)[number], Record<P, CowPeriod>> &
    Record<(typeof CALF_CLASSES)[number], Record<P, CalfPeriod>>
>;

const showDecimal = (n: number) => Number(n.toPrecision(12));
const valueOf = (container: InputContainer<RealNumber | Head>) =>
  container.unit.store.value.toNumber();

/**
 * Herd-level checks of a beef herd's calving, shared by seasonal and monthly herds. Each
 * issue has the path of the input it is about, below the herd's classes.
 *
 * - no calving season (or start month) is listed twice, and calving seasons don't overlap:
 *   start months are at least `seasonLength` periods apart (3 months for monthly herds,
 *   Chapter 3, 3.2.2.1: "the calving season should be considered 3 months from the calving
 *   month")
 * - no cow class calves, and no calf class has calves born, in a period outside every calving
 *   season. The guidance's seasons come from when the herd calves: LCjk=4,5 is the proportion
 *   in calf "in the season of calving" (3.2.1.1 (4)), and under Method 2 the calving season
 *   is 3 months from the calving month (3.2.2.1). Calving in a period that is in no calving
 *   season contradicts the herd's calving seasons, so it is rejected rather than left out
 * - for every period of every cow class, the share in calf in the season of calving and the
 *   share in the season after calving add up to no more than 1, as LCjk=4,5 is a proportion
 *   of the class (Chapter 3, 3.2.1.1 (4))
 * - for every period in which a calf class has animals, the calves born in its season of
 *   calving and in the season before are no more than the class's head in the period: the
 *   calves' milk intake (4.2.1.3 (3)) takes them as shares of the class. A period with no
 *   animals has no milk intake, so its shares are not used
 *
 * `getSeasonOfCalving` and `getSeasonAfterCalving` give the periods whose calving makes up
 * each share (see shared/beef/calving-seasons.ts); a period is in a calving season when
 * `getSeasonOfCalving` gives it any. `howToCover` says how to add a calving season that covers
 * a period.
 */
export const checkHerdCalving = <P extends string>(
  ctx: z.core.$RefinementCtx,
  {
    classes,
    periods,
    calvingSeasonsKey,
    calvingSeasons,
    seasonLength,
    getSeasonOfCalving,
    getSeasonAfterCalving,
    howToCover,
  }: {
    classes: CalvingClasses<P>;
    periods: readonly P[];
    calvingSeasonsKey: string;
    calvingSeasons: readonly P[];
    /** The number of periods in a calving season */
    seasonLength: number;
    getSeasonOfCalving: (period: P, calvingSeasons: readonly P[]) => P[];
    getSeasonAfterCalving: (period: P, calvingSeasons: readonly P[]) => P[];
    howToCover: (period: P) => string;
  },
) => {
  const addIssue = (path: (string | number)[], message: string) =>
    ctx.addIssue({ code: 'custom', message, path, input: undefined });

  // Calving seasons listed twice, or overlapping
  const repeated = calvingSeasons.filter(
    (period, i) => calvingSeasons.indexOf(period) !== i,
  );
  if (repeated.length > 0) {
    addIssue(
      [calvingSeasonsKey],
      `${calvingSeasonsKey} lists ${repeated.join(', ')} more than once.`,
    );
  }
  const starts = calvingSeasons.filter(
    (period, i) => calvingSeasons.indexOf(period) === i,
  );
  const periodsApart = (a: P, b: P) => {
    const gap = Math.abs(periods.indexOf(a) - periods.indexOf(b));
    return Math.min(gap, periods.length - gap);
  };
  starts.forEach((a, i) =>
    starts.slice(i + 1).forEach((b) => {
      if (periodsApart(a, b) < seasonLength) {
        addIssue(
          [calvingSeasonsKey],
          `${calvingSeasonsKey}: ${a} and ${b} are less than ${seasonLength} months apart, so their calving seasons overlap. Each calving season is the ${seasonLength} months from its start month: list only the first month of each season.`,
        );
      }
    }),
  );

  const isInACalvingSeason = (period: P) =>
    getSeasonOfCalving(period, calvingSeasons).length > 0;

  for (const className of COW_CLASSES) {
    const cls = classes[className];
    if (!cls) {
      continue;
    }
    const total = (periodsToSum: P[]) =>
      periodsToSum.reduce(
        (sum, period) => sum + valueOf(cls[period].fractionCowsCalving),
        0,
      );
    for (const period of periods) {
      const value = valueOf(cls[period].fractionCowsCalving);
      if (value > 0 && !isInACalvingSeason(period)) {
        addIssue(
          [className, period, 'fractionCowsCalving'],
          `${className}.${period}.fractionCowsCalving: ${showDecimal(value)} of the cows calve in ${period}, which is in no calving season. ${howToCover(period)}, or set fractionCowsCalving to 0.`,
        );
      }

      const calving = total(getSeasonOfCalving(period, calvingSeasons));
      const afterCalving = total(getSeasonAfterCalving(period, calvingSeasons));
      if (calving + afterCalving > 1 + 1e-9) {
        addIssue(
          [className, period],
          `${className}.${period}: the calving in its season of calving (${showDecimal(calving)}) and in its season after calving (${showDecimal(afterCalving)}) add up to more than 1. Check fractionCowsCalving and ${calvingSeasonsKey}.`,
        );
      }
    }
  }

  for (const className of CALF_CLASSES) {
    const cls = classes[className];
    if (!cls) {
      continue;
    }
    const born = (periodsToSum: P[]) =>
      periodsToSum.reduce(
        (sum, period) => sum + valueOf(cls[period].calvesBorn),
        0,
      );
    for (const period of periods) {
      const value = valueOf(cls[period].calvesBorn);
      if (value > 0 && !isInACalvingSeason(period)) {
        addIssue(
          [className, period, 'calvesBorn'],
          `${className}.${period}.calvesBorn: ${showDecimal(value)} calves are born in ${period}, which is in no calving season. ${howToCover(period)}, or set calvesBorn to 0.`,
        );
      }

      const bornCalving = born(getSeasonOfCalving(period, calvingSeasons));
      const bornBefore = born(getSeasonAfterCalving(period, calvingSeasons));
      const head = valueOf(cls[period].head);
      if (head > 0 && bornCalving + bornBefore > head + 1e-9) {
        addIssue(
          [className, period],
          `${className}.${period}: ${showDecimal(bornCalving)} calves born in its season of calving and ${showDecimal(bornBefore)} in the season before are more than the ${showDecimal(head)} head in the class in ${period}. Check calvesBorn, head and ${calvingSeasonsKey}.`,
        );
      }
    }
  }
};
