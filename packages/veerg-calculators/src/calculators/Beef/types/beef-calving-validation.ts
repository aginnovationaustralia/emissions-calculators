import { InputContainer } from '@/tools/inputs';
import { NumberUnit, RealNumber } from '@/tools/units';
import z from 'zod';

const COW_CLASSES = ['cows1To2Years', 'cows2To3Years', 'cowsGt3Years'] as const;
const CALF_CLASSES = ['bullsLt1', 'cowsLt1', 'steersLt1'] as const;

type CalvingClasses = Partial<
  Record<
    (typeof COW_CLASSES)[number] | (typeof CALF_CLASSES)[number],
    object | undefined
  >
>;

const showDecimal = (n: number) => Number(n.toPrecision(12));

/**
 * Herd-level checks of a beef herd's calving, shared by seasonal and monthly herds:
 *
 * - no calving season (or start month) is listed twice
 * - no cow class calves, and no calf class has calves born, in a period outside every calving
 *   season. The guidance's seasons come from when the herd calves: LCjk=4,5 is the proportion
 *   in calf "in the season of calving" (3.2.1.1 (4)), and under Method 2 "the calving season
 *   should be considered 3 months from the calving month" (3.2.2.1). Calving in a period that
 *   is in no calving season contradicts the herd's calving seasons, so it is rejected rather
 *   than left out (GEETA leaves it out)
 * - for every period of every cow class, the share in calf in the season of calving and the
 *   share in the season after calving add up to no more than 1, as LCjk=4,5 is a proportion
 *   of the class (Chapter 3, 3.2.1.1 (4))
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
    getSeasonOfCalving,
    getSeasonAfterCalving,
    howToCover,
  }: {
    classes: CalvingClasses;
    periods: readonly P[];
    calvingSeasonsKey: string;
    calvingSeasons: readonly P[];
    getSeasonOfCalving: (period: P, calvingSeasons: readonly P[]) => P[];
    getSeasonAfterCalving: (period: P, calvingSeasons: readonly P[]) => P[];
    howToCover: (period: P) => string;
  },
) => {
  const isInACalvingSeason = (period: P) =>
    getSeasonOfCalving(period, calvingSeasons).length > 0;
  const checkOutsideCalvingSeasons = (
    className: string,
    key: 'fractionCowsCalving' | 'calvesBorn',
    describe: (value: number, period: P) => string,
  ) => {
    const cls = classes[className as keyof CalvingClasses] as
      | Record<P, Record<string, InputContainer<NumberUnit> | undefined>>
      | undefined;
    if (!cls) {
      return;
    }
    for (const period of periods) {
      const value = cls[period][key]?.unit.store.value.toNumber() ?? 0;
      if (value > 0 && !isInACalvingSeason(period)) {
        ctx.addIssue(
          `${className}.${period}.${key}: ${describe(value, period)}, which is in no calving season. ${howToCover(period)}, or set ${key} to 0.`,
        );
      }
    }
  };

  const repeated = calvingSeasons.filter(
    (period, i) => calvingSeasons.indexOf(period) !== i,
  );
  if (repeated.length > 0) {
    ctx.addIssue(
      `${calvingSeasonsKey} lists ${repeated.join(', ')} more than once.`,
    );
  }

  for (const className of COW_CLASSES) {
    checkOutsideCalvingSeasons(
      className,
      'fractionCowsCalving',
      (value, period) => `${showDecimal(value)} of the cows calve in ${period}`,
    );
  }
  for (const className of CALF_CLASSES) {
    checkOutsideCalvingSeasons(
      className,
      'calvesBorn',
      (value, period) => `${showDecimal(value)} calves are born in ${period}`,
    );
  }

  for (const className of COW_CLASSES) {
    const cls = classes[className] as
      | Record<P, { fractionCowsCalving: InputContainer<RealNumber> }>
      | undefined;
    if (!cls) {
      continue;
    }
    const total = (periodsToSum: P[]) =>
      periodsToSum.reduce(
        (sum, period) =>
          sum + cls[period].fractionCowsCalving.unit.store.value.toNumber(),
        0,
      );
    for (const period of periods) {
      const calving = total(getSeasonOfCalving(period, calvingSeasons));
      const afterCalving = total(getSeasonAfterCalving(period, calvingSeasons));
      if (calving + afterCalving > 1 + 1e-9) {
        ctx.addIssue(
          `${className}.${period}: the calving in its season of calving (${showDecimal(calving)}) and in its season after calving (${showDecimal(afterCalving)}) add up to more than 1. Check fractionCowsCalving and ${calvingSeasonsKey}.`,
        );
      }
    }
  }
};
