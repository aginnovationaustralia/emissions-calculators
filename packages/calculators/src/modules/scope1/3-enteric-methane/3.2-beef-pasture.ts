import { ExecutionContext } from '@/calculators/executionContext';
import { HasIsFebruaryInLeapYearInputTransformed } from '@/calculators/types/has-is-february-in-leap-year.input';
import { selectConstant } from '@/tools/constants';
import { calculateOrGetFeedIntakeForBeef } from '../shared/beef/calculate';
import {
  BeefConstants,
  BeefPeriodProps,
  calculateForAllClassPeriods,
  getDurationDays,
} from '../shared/beef/helpers';
import { BeefManureAndEntericHerdInputTransformed } from '../shared/beef/input';

function calculateDailyMethaneForPeriod(periodProps: BeefPeriodProps) {
  const { context } = periodProps;
  const { constants } = context;
  const feedIntake = calculateOrGetFeedIntakeForBeef(periodProps);
  const dryMatterToMethaneConversionFactor = selectConstant(
    constants.BEEF_PASTURE,
    'DRY_MATTER_TO_METHANE_CONVERSION_FACTOR',
  ).named('dryMatterToMethaneConversionFactor');

  /**
   * 3.2.1.1 (2)
   * Mjkl = 20.7 * Ijkl * 10^-3
   *
   * NOTE: The 20.7 figure comes from [Charmley et al. (2015)](https://www.researchgate.net/publication/286511461_A_universal_equation_to_predict_methane_production_of_forage-fed_cattle_in_Australia)
   * and is given in g CH4/kg DM. The constant selected has already been converted to
   * kg CH4/kg DM, so no further conversion is needed here.
   */
  return feedIntake
    .multiply(dryMatterToMethaneConversionFactor)
    .named('Mjkl')
    .reference('3.2.1.1 (2)');
}

function calculateClassMethaneForPeriod(periodProps: BeefPeriodProps) {
  /**
   * 3.2.1.1 (1)
   * Eenteric = SUM (Dj * Mjkl * Nj)
   */
  const { className, currentPeriod, periodName } = periodProps;
  const { head } = currentPeriod;
  const Nj = head.named(`Nj=${periodName}`);
  const Dj = getDurationDays(periodProps);

  const Mjkl = calculateDailyMethaneForPeriod(periodProps);
  return Mjkl.multiply(Nj)
    .multiply(Dj)
    .named(`Eenteric j=${periodName},k=${className}`)
    .reference('3.2.1.1 (1)');
}

export function calculate32BeefPastureEntericMethaneForHerd(
  herd: BeefManureAndEntericHerdInputTransformed &
    HasIsFebruaryInLeapYearInputTransformed,
  context: ExecutionContext<BeefConstants>,
) {
  return calculateForAllClassPeriods(
    { herd, context },
    calculateClassMethaneForPeriod,
    {
      classResultName: (className) => `Eenteric=${className}`,
      herdResultName: 'Eenteric (herd)',
      isFebruaryInLeapYear: herd.isFebruaryInLeapYear,
    },
  );
}
