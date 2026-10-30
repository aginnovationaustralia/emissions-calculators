import { DairyClassInputTransformed } from '@/calculators/Dairy/types/dairy-class.input';
import { DairyCattleBreed } from '@/constants/enums';
import { HasConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { br, Container, num, root } from '@/tools/containers';
import { captureMethod1Or2Value } from '@/tools/multi';
import {
  percentageToFraction,
  zeroMassPerHeadPerDayDryMatter,
} from '@/tools/sentinels';
import {
  Liveweight,
  LiveweightGain,
  liveweightGain,
  MassPerHeadPerDay,
  RealNumber,
  VolumePerHeadPerDay,
  volumePerHeadPerDay,
} from '@/tools/units';
import {
  DairyMilkProductionInputTransformed,
  isMilkVolumeBased,
} from '../../../../calculators/Dairy/types/milk.input';
import { estimateForageIntake } from '../beef/calculate';
import {
  getDryMatterDigestibility,
  getLiveweight,
  getLiveweightGain,
  getMetabolicRateIncrease,
} from './helpers';

/**
 * Calculates or returns milk production *MPj* in litres per head per day, depending
 * on how the input was given.
 */
export const calculateMilkProduction = (
  input: DairyMilkProductionInputTransformed,
  constants: HasConstants<'DAIRY'>,
): Container<VolumePerHeadPerDay<'Milk'>> => {
  if (isMilkVolumeBased(input)) {
    return input.litresPerHeadPerDay;
  }

  const fatContent = captureMethod1Or2Value(
    selectConstant(constants.DAIRY, 'MILK_CONSTANTS', 'FAT_CONTENT'),
    input.fatContent,
  );
  const proteinContent = captureMethod1Or2Value(
    selectConstant(constants.DAIRY, 'MILK_CONSTANTS', 'PROTEIN_CONTENT'),
    input.proteinContent,
  );

  /**
   * 3.3.1.1 (5)
   * MPj = MSj / 0.01 * (FCj + PCj)
   */
  const litresPerHeadPerDay: Container<VolumePerHeadPerDay<'Milk'>> =
    input.kgSolidsPerHeadPerDay
      .divide(percentageToFraction(fatContent.plus(proteinContent)))
      .switchUnit((v) => volumePerHeadPerDay('Milk', v.store))
      .named('MP')
      .reference('3.3.1.1 (5)');

  return litresPerHeadPerDay;
};

/**
 * Calculates additional feed intake needed for milk production *MIj*
 */
export const calculateAdditionalIntakeForMilkProduction = (
  milkProduction: Container<VolumePerHeadPerDay<'Milk'>>,
  dryMatterDigestibility: Container<RealNumber>,
  constants: HasConstants<'DAIRY'>,
): Container<MassPerHeadPerDay<'DryMatter'>> => {
  const netEnergy = selectConstant(
    constants.DAIRY,
    'MILK_CONSTANTS',
    'NET_ENERGY',
  ).named('NE');

  const grossEnergyContent = selectConstant(
    constants.DAIRY,
    'MILK_CONSTANTS',
    'GROSS_ENERGY_CONTENT',
  ).named('GEC');

  const k = selectConstant(
    constants.DAIRY,
    'MILK_CONSTANTS',
    'EFFICIENCY_OF_MILK_PRODUCTION',
  ).named('k');

  const densityOfMilk = selectConstant(
    constants.DAIRY,
    'MILK_CONSTANTS',
    'DENSITY_OF_MILK',
  );

  /**
   * 3.3.1.1 (6)
   * qmj = 0.795 * (DMDj * 100) - 0.0014
   *
   * (where qmj is the metabolisability of the diet)
   *
   * NOTE: The multiplication by 100 is a double up here. The original equation is:
   * > Q = 0.00795DMD - 0.0014
   *
   * The gradient has already been multiplied by 100.
   */
  const qmj = num(0.795)
    .multiply(dryMatterDigestibility)
    .minus(num(0.0014))
    .named('qmj')
    .reference('3.3.1.1 (6)');

  /**
   *    3.3.1.1 (4)
   * MIj = (MPj * 1.03 * NE) / (GEC * k * qmj)
   */
  return br(milkProduction.multiply(densityOfMilk).multiply(netEnergy))
    .divide(br(grossEnergyContent.multiply(k).multiply(qmj)))
    .named('MIj')
    .reference('3.3.1.1 (4)');
};

/**
 * Calculates feed intake for dairy cattle *Ij* based on the equation developed by
 * [Minson and McDonald (1987)](https://www.tropicalgrasslands.info/public/journals/4/Historic/Tropical%20Grasslands%20Journal%20archive/PDFs/Vol_21_1987/Vol_21_03_87_pp116_122.pdf),
 * adapted by the guidance.
 */
export const calculateFeedIntakeForDairy = (
  liveweight: Container<Liveweight>,
  liveweightGain: Container<LiveweightGain>,
  metabolicRateIncrease: Container<RealNumber>,
  additionalIntakeForMilk: Container<MassPerHeadPerDay<'DryMatter'>>,
): Container<MassPerHeadPerDay<'DryMatter'>> => {
  const intakeForWeightGain: Container<MassPerHeadPerDay<'DryMatter'>> =
    estimateForageIntake(liveweight, liveweightGain).multiply(
      metabolicRateIncrease,
    );

  return intakeForWeightGain.plus(additionalIntakeForMilk);
};

/**
 * Wrapper around `calculateFeedIntakeForDairy` to handle determining
 * the relevant inputs before calculating feed intake *Ij*.
 */
export const calculateOrGetFeedIntakeForDairy = (
  dairyClass: DairyClassInputTransformed,
  milkProduction: Container<VolumePerHeadPerDay<'Milk'>>,
  breed: Container<DairyCattleBreed>,
  constants: HasConstants<'DAIRY'>,
): Container<MassPerHeadPerDay<'DryMatter'>> => {
  /**
   * 3.3.1.1 (3)
   * Ij = (1.185 + 0.00454 * Wj - 0.0000026 * Wj^2 + 0.315 * LWGj)^2 * MRj + MIj
   */
  const liveweight = getLiveweight(dairyClass, breed, constants).named(
    `Wj=${dairyClass.number}`,
  );
  const liveweightGain = getLiveweightGain(dairyClass, constants).named(
    `LWGj=${dairyClass.number}`,
  );

  // This adjustment is only relevant for cows producing milk.
  const additionalIntakeForMilk =
    dairyClass.className === 'milkingCows'
      ? calculateAdditionalIntakeForMilkProduction(
          milkProduction,
          getDryMatterDigestibility(dairyClass, constants),
          constants,
        )
          .named(`MIj=${dairyClass.number}`)
          .reference('3.3.1.1 (4)')
      : zeroMassPerHeadPerDayDryMatter;
  const metabolicRateIncrease = getMetabolicRateIncrease(dairyClass, constants);

  const defaultFeedIntake = calculateFeedIntakeForDairy(
    liveweight,
    liveweightGain,
    metabolicRateIncrease,
    additionalIntakeForMilk,
  )
    .named(`Ij=${dairyClass.number}`)
    .reference('3.3.1.1 (3)');

  return defaultFeedIntake;
};

/**
 * Calculates feed intake relative to intake needed for maintenance *Lj*.
 */
export const calculateRelativeFeedIntakeForDairy = (
  dairyClass: DairyClassInputTransformed,
  milkProduction: Container<VolumePerHeadPerDay<'Milk'>>,
  breed: Container<DairyCattleBreed>,
  constants: HasConstants<'DAIRY'>,
) => {
  const feedIntake = calculateOrGetFeedIntakeForDairy(
    dairyClass,
    milkProduction,
    breed,
    constants,
  );

  const liveweight = getLiveweight(dairyClass, breed, constants).named(
    `Wj=${dairyClass.number}`,
  );
  const noLiveweightGain = root(liveweightGain(0));

  const additionalIntakeForMilk =
    dairyClass.className === 'milkingCows'
      ? calculateAdditionalIntakeForMilkProduction(
          milkProduction,
          getDryMatterDigestibility(dairyClass, constants),
          constants,
        ).named(`MIj=${dairyClass.number}`)
      : zeroMassPerHeadPerDayDryMatter;
  const metabolicRateIncrease = getMetabolicRateIncrease(dairyClass, constants);

  const intakeForMaintenance = calculateFeedIntakeForDairy(
    liveweight,
    noLiveweightGain,
    metabolicRateIncrease,
    additionalIntakeForMilk,
  );

  /**
   * 3.3.1.1 (3)
   * Lj = Ij / ((1.185 + 0.00454 * Wj - 0.0000026 * Wj^2)^2 * MRj + MIj)
   *
   * Note that the denominator here is the same as the equation for *Ij*, except without
   * the term for liveweight gain. I.e., the denominator is equal to *Ij* when liveweight
   * gain *LWGj* equals zero.
   *
   * To explain it conceptually, we're calculating intake relative to the intake needed
   * for the cattle to maintain its weight with no change. So, we can take this shortcut.
   * This is how the National Inventory Report (2023) expresses it as well.
   */
  return feedIntake.divide(intakeForMaintenance);
};
