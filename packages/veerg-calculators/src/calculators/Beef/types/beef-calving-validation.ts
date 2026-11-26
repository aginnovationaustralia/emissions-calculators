import { InputContainer } from '@/tools/inputs';
import { RealNumber } from '@/tools/units';
import z from 'zod';

const COW_CLASSES = ['cows1To2Years', 'cows2To3Years', 'cowsGt3Years'] as const;

type CowClasses = Partial<
  Record<(typeof COW_CLASSES)[number], object | undefined>
>;

const showDecimal = (n: number) => Number(n.toPrecision(12));

/**
 * Herd-level checks of a beef herd's calving, shared by seasonal and monthly herds:
 *
 * - no calving season (or start month) is listed twice
 * - for every period of every cow class, the share in calf in the season of calving and the
 *   share in the season after calving add up to no more than 1, as LCjk=4,5 is a proportion
 *   of the class (Chapter 3, 3.2.1.1 (4))
 *
 * `getSeasonOfCalving` and `getSeasonAfterCalving` give the periods whose calving makes up
 * each share (see shared/beef/calving-seasons.ts).
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
  }: {
    classes: CowClasses;
    periods: readonly P[];
    calvingSeasonsKey: string;
    calvingSeasons: readonly P[];
    getSeasonOfCalving: (period: P, calvingSeasons: readonly P[]) => P[];
    getSeasonAfterCalving: (period: P, calvingSeasons: readonly P[]) => P[];
  },
) => {
  const repeated = calvingSeasons.filter(
    (period, i) => calvingSeasons.indexOf(period) !== i,
  );
  if (repeated.length > 0) {
    ctx.addIssue(
      `${calvingSeasonsKey} lists ${repeated.join(', ')} more than once.`,
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
