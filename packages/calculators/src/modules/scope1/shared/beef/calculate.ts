import { isBeefClassPeriodInputWithCalves } from '@/calculators/Beef/types/beef-class-period.input';
import { HasConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { br, Container, num, root } from '@/tools/containers';
import { captureMethod1Or2Value } from '@/tools/multi';
import { e, one, oneMinus } from '@/tools/sentinels';
import {
  Liveweight,
  LiveweightGain,
  liveweightGain,
  MassPerHeadPerDay,
  massPerHeadPerDay,
  RealNumber,
  realNumber,
} from '@/tools/units';
import { BeefPeriodProps, getLiveweight, getLiveweightGain } from './helpers';

/**
 * Calculates the estimated feed intake using the equation developed by [Minson and
 * McDonald (1987)](https://www.tropicalgrasslands.info/public/journals/4/Historic/Tropical%20Grasslands%20Journal%20archive/PDFs/Vol_21_1987/Vol_21_03_87_pp116_122.pdf):
 *
 * > I = (1.185 + 0.00454L + 0.0000026L^2 + 0.315G)^2
 *
 * (L and G being liveweight and liveweight gain respectively)
 *
 * This equation is adapted to calculate feed intake (usually defined as *Ij*) in
 * the guidance across beef pasutre and dairy. This function does NOT return that value,
 * it just calculates the equation above, and sets the correct unit on the result.
 * @param liveweight *Wj* (Liveweight)
 * @param liveweightGain *LWGj* (Liveweight Gain)
 * @returns
 */
export const estimateForageIntake = (
  liveweight: Container<Liveweight>,
  liveweightGain: Container<LiveweightGain>,
): Container<MassPerHeadPerDay<'DryMatter'>> => {
  return br(
    num(1.185)
      .plus(num(0.00454).multiply(liveweight))
      .minus(num(0.0000026).multiply(liveweight.squared()))
      .plus(
        num(0.315)
          .multiply(liveweightGain)
          .switchUnit((u) => realNumber(u.store)),
      ),
  )
    .squared()
    .switchUnit((r) => massPerHeadPerDay('DryMatter', r.store));
};

/**
 * Calculate nitrogen retained in the body for cattle.
 *
 * This equation is common to both beef (Chapter 4.2) and dairy (Chapter 4.3), and almost
 * identical save for the dairy version of this equation adding a factor (1.03) to
 * convert milk production from L/head/day to kg/head/day. For dairy calculations, this
 * function needs to take the milk production after it has been converted to kg/head/day.
 */
export const calculateNitrogenRetentionForCattle = (
  milkProduction: Container<MassPerHeadPerDay<'Milk'>>,
  relativeIntake: Container<RealNumber>,
  relativeSize: Container<RealNumber>,
  liveweightGain: Container<LiveweightGain>,
  constants: HasConstants<'LIVESTOCK' | 'COMMON'>,
) => {
  const milkProteinPerNitrogen = selectConstant(
    constants.LIVESTOCK,
    'NITROGEN_TO_MILK_PROTEIN',
  );

  const crudeProteinPerNitrogen = selectConstant(
    constants.COMMON,
    'NITROGEN_TO_PROTEIN',
  );

  /**
   * 0.032 * MPj / 6.38
   *
   * NOTES:
   * - As mentioned above, the dairy version of this equation also multiplies this by
   * 1.03 to convert from volume of milk to mass. The type of the milk production
   * argument requires that this conversion happen before this function is called.
   * - Sections 4.2 and 4.3 use the subscript *j* to mean different things. Here it is
   * being used to describe different classes of cattle, not time periods.
   */
  const nitrogenRetainedForMilkProduction = num(0.032)
    .multiply(milkProduction)
    .divide(milkProteinPerNitrogen);

  /**
   * (0.212 - 0.008 * (Lj - 2) - (0.140 - 0.008 * (Lj - 2) / 1 + e^(-6*(Zj - 0.4)) ) * (LWGjkl * 0.92)) / 6.25
   */
  const nitrogenRetainedByBody = br(
    br(
      num(0.212)
        .minus(num(0.008).multiply(relativeIntake.minus(num(2))))
        .minus(
          br(
            br(
              num(0.14).minus(
                num(0.008).multiply(relativeIntake.minus(num(2))),
              ),
            ).divide(
              one.plus(
                e.power(num(-6).multiply(br(relativeSize.minus(num(0.4))))),
              ),
            ),
          ),
        ),
    ).multiply(br(liveweightGain).multiply(num(0.92))),
  )
    /**
     * We have defined 6.25 as a constant  ('NITROGEN_TO_PROTEIN') with an
     * associated unit. We use this for crude protein conversion, rather than create a
     * second substance type, we're using it here to let the units resolve happily.
     */
    .switchUnit((v) => massPerHeadPerDay('CrudeProtein', v.store))
    .divide(crudeProteinPerNitrogen);

  return nitrogenRetainedForMilkProduction.plus(nitrogenRetainedByBody);
};

/**
 * Calculate feed intake adjustment from milk production *MAjk* for a beef class *k* in
 * period *j*
 */
export const calculateAdditionalIntakeForMilkProduction = (
  periodProps: BeefPeriodProps,
) => {
  const { classInput, periodName, currentPeriod, context } = periodProps;
  const { constants } = context;

  /**
   * MAjk=4,5 = (LCijkl=4,5 * FAjk=4,5) + (1 - LCjk=4,5 )
   *
   * NOTE: The proposal to fix this equation is to modify it to:
   *
   * (LC (calving current season) * FA (calving current season))
   * + (LC (calving previous season) * FA (calving previous season))
   * + (1 - LC (calving current season) - LC (calving previous season))
   */
  if (isBeefClassPeriodInputWithCalves(currentPeriod)) {
    const calvingFeedAdjustment = selectConstant(
      constants.BEEF_PASTURE,
      'MILK_FACTORS',
      'FEED_ADJUSTMENTS',
      'calving',
    ).named(`FAjk=${classInput.number} (currently calving)`);

    const postCalvingFeedAdjustment = selectConstant(
      constants.BEEF_PASTURE,
      'MILK_FACTORS',
      'FEED_ADJUSTMENTS',
      'postCalving',
    ).named(`FAjk=${classInput.number} (previously calving)`);

    const calvingCowAdjustment = br(
      currentPeriod.proportionCowsThisSeasonInCalf.multiply(
        calvingFeedAdjustment,
      ),
    );

    const postCalvingCowAdjustment = br(
      currentPeriod.proportionCowsPreviousSeasonInCalf.multiply(
        postCalvingFeedAdjustment,
      ),
    );

    const nonCalvingCowAdjustment = br(
      oneMinus(currentPeriod.proportionCowsThisSeasonInCalf).minus(
        currentPeriod.proportionCowsPreviousSeasonInCalf,
      ),
    );

    return calvingCowAdjustment
      .plus(postCalvingCowAdjustment)
      .plus(nonCalvingCowAdjustment)
      .named(`MA j=${periodName},k=${classInput.number}`);
  }

  return num(1).named(`MA j=${periodName},k=${classInput.number}`);
};

/**
 * Calculates feed intake for beef cattle *Ij* based on the equation developed by
 * [Minson and McDonald (1987)](https://www.tropicalgrasslands.info/public/journals/4/Historic/Tropical%20Grasslands%20Journal%20archive/PDFs/Vol_21_1987/Vol_21_03_87_pp116_122.pdf),
 * adapted by the guidance.
 */
export const calculateOrGetFeedIntakeForBeef = (
  periodProps: BeefPeriodProps,
): Container<MassPerHeadPerDay<'DryMatter'>> => {
  const { method2DryMatterIntake } = periodProps.currentPeriod;

  const liveweight = getLiveweight(periodProps);
  const liveweightGain = getLiveweightGain(periodProps);

  const milkAdjustment =
    calculateAdditionalIntakeForMilkProduction(periodProps);

  return captureMethod1Or2Value(
    estimateForageIntake(liveweight, liveweightGain)
      .multiply(milkAdjustment)
      .named(
        `Ijk=${periodProps.classInput.number} (j=${periodProps.periodName})`,
      ),
    method2DryMatterIntake,
  );
};

/**
 * Calculate intake relative for maintenance *Ijk* for a beef class *k* in period *j*
 * (4.2.1.3 (6))
 */
export const calculateRelativeIntakeForBeef = (
  periodProps: BeefPeriodProps,
): Container<RealNumber> => {
  const feedIntake = calculateOrGetFeedIntakeForBeef(periodProps);

  const liveweight = getLiveweight(periodProps);
  const noLiveweightGain = root(liveweightGain(0));
  const milkAdjustment =
    calculateAdditionalIntakeForMilkProduction(periodProps);

  /**
   * Ljkl = Ijkl / ((1.185 + 0.00454 * Wjkl - 0.0000026 * Wjkl^2)^2 * MAjk)
   */
  const intakeForMaintenance = estimateForageIntake(
    liveweight,
    noLiveweightGain,
  ).multiply(milkAdjustment);

  return feedIntake
    .divide(intakeForMaintenance)
    .named(`Ljk=${periodProps.classInput.number} (j=${periodProps.periodName})`)
    .reference('4.2.1.3 (6)');
};
