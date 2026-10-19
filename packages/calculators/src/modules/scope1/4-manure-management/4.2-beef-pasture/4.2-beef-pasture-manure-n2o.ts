import {
  isBeefCalfClassPeriodInput,
  isBeefClassPeriodInputWithCalves,
} from '@/calculators/Beef/types/beef-class-period.input';
import { ExecutionContext } from '@/calculators/executionContext';
import { HasIsFebruaryInLeapYearInputTransformed } from '@/calculators/types/has-is-february-in-leap-year.input';
import { selectConstant } from '@/tools/constants';
import { br, max, num, root } from '@/tools/containers';
import { tenToPowMinus4, zero } from '@/tools/sentinels';
import { massPerHeadPerDay } from '@/tools/units';
import {
  calculateNitrogenRetentionForCattle,
  calculateOrGetFeedIntakeForBeef,
  calculateRelativeIntakeForBeef,
} from '../../shared/beef/calculate';
import {
  BeefPeriodProps,
  calculateForAllClassPeriods,
  getCrudeProtein,
  getDurationDays,
  getLiveweight,
  getLiveweightGain,
  getRelativeSize,
} from '../../shared/beef/helpers';
import { BeefManureAndEntericHerdInputTransformed } from '../../shared/beef/input';
import { ConstantsForBeefManure } from './constants';

/**
 * Calculate milk production *MPjk* for a beef class *k* in period *j* (4.2.1.3 (5))
 */
const calculateMilkProduction = (periodProps: BeefPeriodProps) => {
  const { context, className, seasonName, currentPeriod, herd, classInput } =
    periodProps;
  const { constants } = context;
  const { breed } = herd;

  if (isBeefClassPeriodInputWithCalves(currentPeriod)) {
    const LCCalving = currentPeriod.proportionCowsThisSeasonInCalf;
    const DMPCalving = selectConstant(
      constants.BEEF_PASTURE,
      'MILK_FACTORS',
      'DAILY_MILK_PRODUCTION_BY_BREED',
      breed,
      'calving',
    ).named(`DMPCalving (${className}, ${seasonName})`);

    const milkProductionFromCalvingCows = br(LCCalving.multiply(DMPCalving));

    const LCAfterCalving = currentPeriod.proportionCowsPreviousSeasonInCalf;
    const DMPAfterCalving = selectConstant(
      constants.BEEF_PASTURE,
      'MILK_FACTORS',
      'DAILY_MILK_PRODUCTION_BY_BREED',
      breed,
      'postCalving',
    ).named(`DMPAfterCalving (${className}, ${seasonName})`);
    const milkProductionFromPostCalvingCows = br(
      LCAfterCalving.multiply(DMPAfterCalving),
    );

    return milkProductionFromCalvingCows
      .plus(milkProductionFromPostCalvingCows)
      .named(`MPjk=${classInput.number} (j = ${seasonName})`)
      .reference('4.2.1.3 (5)');
  }

  return root(massPerHeadPerDay('Milk', 0)).named(
    `MPjk=${classInput.number} (${className}, non-calving class)`,
  );
};

/**
 * Calculates *MCjk* for a beef cattle class *k* in period *j*.
 */
const calculateMilkIntake = (periodProps: BeefPeriodProps) => {
  const { classInput, herd, seasonName, context, currentPeriod } = periodProps;
  const { breed } = herd;
  const { constants } = context;
  if (!isBeefCalfClassPeriodInput(currentPeriod)) {
    return root(massPerHeadPerDay('Milk', 0)).named(
      `MCjk=${classInput.number} (non-calf class)`,
    );
  }

  const milkProductionCalving = selectConstant(
    constants.BEEF_PASTURE,
    'MILK_FACTORS',
    'DAILY_MILK_PRODUCTION_BY_BREED',
    breed,
    'calving',
  );
  const milkIntakeForCalvesBornThisSeason = br(
    milkProductionCalving.multiply(
      currentPeriod.proportionCalvesBornThisSeason,
    ),
  );

  const milkProductionPostCalving = selectConstant(
    constants.BEEF_PASTURE,
    'MILK_FACTORS',
    'DAILY_MILK_PRODUCTION_BY_BREED',
    breed,
    'postCalving',
  );
  const milkIntakeForCalvesBornPreviousSeason = br(
    milkProductionPostCalving.multiply(
      currentPeriod.proportionCalvesBornPreviousSeason,
    ),
  );

  return milkIntakeForCalvesBornThisSeason
    .plus(milkIntakeForCalvesBornPreviousSeason)
    .named(`MCjk=${classInput.number} (j = ${seasonName}, ${breed.unit})`);
};

/**
 * Wrapper around `calculateNitrogenRetentionForCattle` to adapt it to the shape of
 * `BeefPeriodProps`.
 */
const calculateNitrogenRetentionForBeef = (periodProps: BeefPeriodProps) => {
  const { context, classInput, periodName } = periodProps;
  const liveweightGain = getLiveweightGain(periodProps);
  const relativeIntake = calculateRelativeIntakeForBeef(periodProps);
  const relativeSize = getRelativeSize(periodProps);
  const milkProduction = calculateMilkProduction(periodProps);

  return calculateNitrogenRetentionForCattle(
    milkProduction,
    relativeIntake,
    relativeSize,
    liveweightGain,
    context.constants,
  )
    .named(`NRjk=${classInput.number} (j = ${periodName})`)
    .reference('4.2.1.3 (4)');
};

const calculateNitrogenExcretionForBeef = (periodProps: BeefPeriodProps) => {
  const { classInput, context, periodName } = periodProps;
  const { constants } = context;

  const feedIntake = calculateOrGetFeedIntakeForBeef(periodProps);
  const crudeProtein = getCrudeProtein(periodProps);
  const milkIntake = calculateMilkIntake(periodProps);
  const nitrogenRetention = calculateNitrogenRetentionForBeef(periodProps);
  const metabolicLiveweight = getLiveweight(periodProps).power(num(0.75));

  const milkProteinPerNitrogen = selectConstant(
    constants.LIVESTOCK,
    'NITROGEN_TO_MILK_PROTEIN',
  );

  const crudeProteinPerNitrogen = selectConstant(
    constants.COMMON,
    'NITROGEN_TO_PROTEIN',
  );

  /**
   * NEjkl = (Ijkl * CPj ÷ 6.25) + (0.032 * MCjk=1,3,6 ÷ 6.38) - NRjkl - [(1.1 * 10^-4 * Wjkl ^ 0.75) ÷ 6.25]
   */
  const nitrogenExcretion = br(
    feedIntake.multiply(crudeProtein).divide(crudeProteinPerNitrogen),
  )
    .plus(br(num(0.032).multiply(milkIntake).divide(milkProteinPerNitrogen)))
    .minus(nitrogenRetention)
    .minus(
      br(
        br(num(1.1).multiply(tenToPowMinus4).multiply(metabolicLiveweight))
          /**
           * This switch is a bit of a trick again - the value undergoing the switch
           * isn't necessarily a mass of crude protein per head per day, but since
           * we know the intended output unit and have a definition of the unit for
           * 6.25, this is the smoothest place to make the switch.
           */
          .switchUnit((val) => massPerHeadPerDay('CrudeProtein', val.store))
          .divide(crudeProteinPerNitrogen),
      ),
    )
    .named(`NEjk=${classInput.number} (j = ${periodName})`)
    .reference('4.2.1.1 (3)');

  return max(nitrogenExcretion, zero);
};

export const calculateTotalNitrogenExcretedByClassInPeriod = (
  periodProps: BeefPeriodProps,
) => {
  const { currentPeriod, className, seasonName } = periodProps;
  /*
    EN2O,dir = (AE * EFPRP * CN2O) * 10^-3
    AE = SUM SUM SUM (Njkl * NEjkl * Dj)
    NEjkl = (Ijkl * CPj ÷ 6.25) + (0.032 * MCjk=1,3,6 ÷ 6.38) - NRjkl - [(1.1 * 10^-4 * Wjkl ^ 0.75) ÷ 6.25]
  */

  const Njkl = currentPeriod.head.named(`Njkl (${className}, ${seasonName})`);
  const Dj = getDurationDays(periodProps).named(`Dj=${seasonName}`);

  const NEjkl = calculateNitrogenExcretionForBeef(periodProps);

  const AE = NEjkl.multiply(Njkl)
    .multiply(Dj)
    .named(`AE (${className}, ${seasonName})`)
    .reference('4.2.1.3 (2)');

  return AE;
};

export const calculateManureManagementSoilDirectN2OForHerd = (
  herd: BeefManureAndEntericHerdInputTransformed &
    HasIsFebruaryInLeapYearInputTransformed,
  context: ExecutionContext<ConstantsForBeefManure>,
) => {
  const { constants } = context;
  const AE = calculateForAllClassPeriods(
    { herd, context },
    calculateTotalNitrogenExcretedByClassInPeriod,
    {
      classResultName: (className) => `AE=${className}`,
      herdResultName: 'AE (herd)',
      isFebruaryInLeapYear: herd.isFebruaryInLeapYear,
    },
  );

  const wetOrDry = herd.climateZone;
  const EFPRP = selectConstant(
    constants.LIVESTOCK,
    'EF_DEPOSITED_URINE_AND_DUNG_PRP',
    wetOrDry,
  ).named(`EFPRP ${wetOrDry}`);

  const cgn2o = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_N2O',
  ).named('Cg,N2O');

  return AE.multiply(EFPRP)
    .multiply(cgn2o)
    .named('EN2O,dir (herd)')
    .reference('4.2.1.3 (1)');
};
