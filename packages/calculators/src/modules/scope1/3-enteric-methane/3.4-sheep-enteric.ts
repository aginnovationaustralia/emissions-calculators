import { ExecutionContext } from '@/calculators/executionContext';
import { HasIsFebruaryInLeapYearInputTransformed } from '@/calculators/types/has-is-february-in-leap-year.input';
import { br, num, NumberContainer } from '@/tools/containers';
import { zeroCH4 } from '@/tools/sentinels';
import { Mass, massPerHeadPerDay } from '@/tools/units';
import { calculateDailyFeedIntakeIjk } from '../shared/sheep/calculate';
import {
  calculateForAllClassPeriods,
  getDurationDays,
  SheepConstants,
  SheepPeriodProps,
} from '../shared/sheep/helpers';
import { SheepManureAndEntericHerdInputTransformed } from '../shared/sheep/input';

function calculateClassMethaneForPeriod(
  periodProps: SheepPeriodProps,
): NumberContainer<Mass<'CH4'>> {
  const { className, periodInput, periodName } = periodProps;
  const Nj = periodInput.head.named(`Nj=${periodName}k=${className}`);
  const Dj = getDurationDays(periodProps);

  const Ijk = calculateDailyFeedIntakeIjk(periodProps).named(
    `Ij=${periodName},k=${className}`,
  );

  /**
   * 3.4.1.1 (2)
   * Mijk = (Ijk * 0.0188) + 0.00158
   */
  const Mjk = br(num(0.0188).multiply(Ijk))
    .plus(num(0.00158))
    .switchUnit((u) => massPerHeadPerDay('CH4', u.store))
    .named(`Mj=${periodName},k=${className}`)
    .reference('3.4.1.1 (2)');

  return Mjk.multiply(Nj)
    .multiply(Dj)
    .named(`Eenteric,j=${periodName},k=${className}`)
    .reference('3.4.1.1 (1)');
}

export function calculate34SheepEntericMethane(
  flock: SheepManureAndEntericHerdInputTransformed &
    HasIsFebruaryInLeapYearInputTransformed,
  context: ExecutionContext<SheepConstants>,
) {
  /**
   * 3.4.1.1 (1)
   * Eenteric = SUM[j,k] (Njk * Mjk * Dj) * 10^-3
   */
  return calculateForAllClassPeriods(
    {
      flock,
      context,
    },
    calculateClassMethaneForPeriod,
    {
      classResultName: (className) => `Eenteric,k=${className}`,
      flockResultName: `Eenteric (flock)`,
      isFebruaryInLeapYear: flock.isFebruaryInLeapYear,
      fallback: zeroCH4,
    },
  );
}
