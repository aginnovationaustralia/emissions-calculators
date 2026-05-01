import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { selectConstant } from '@/tools/constants';
import { Container, br, num } from '@/tools/containers';
import {
  Mass,
  MassPerHeadPerDay,
  RealNumber,
  VolumePerHeadPerDay,
  massPerEnergy,
  massPerHeadPerDay,
  realNumber,
} from '@/tools/units';
import {
  DairyMilkInputTransformed,
  isMilkVolumeBased,
} from '../../4-manure-management/dairy-manure.input';

export const calculateMilkProduction = (
  input: DairyMilkInputTransformed,
): Container<VolumePerHeadPerDay<'Milk'>> => {
  if (isMilkVolumeBased(input)) {
    return input.litresPerHeadPerDay;
  }

  const { kgSolidsPerHeadPerDay, fatContent, proteinContent } = input;

  //@ts-expect-error Erasure of units
  const litresPerHeadPerDay: Container<VolumePerHeadPerDay<'Milk'>> =
    kgSolidsPerHeadPerDay.divide(
      num(0.01).multiply(fatContent.plus(proteinContent)),
    );

  return litresPerHeadPerDay;
};

export const calculateExtraIntakeForMilkProductionMIj = (
  MPj: Container<VolumePerHeadPerDay<'Milk'>>,
  DMDj: Container<RealNumber>,
  constants: ConstantsForGrainsCalculator,
): Container<MassPerHeadPerDay<'DryMatter'>> => {
  // Ch 3.3 line 234
  // line 278
  const NE = selectConstant(
    constants.DAIRY,
    'NET_ENERGY_FOR_MILK_PRODUCTION',
  ).named('NE');
  // line 279
  const GEC = selectConstant(constants.DAIRY, 'GROSS_ENERGY_CONTENT').named(
    'GEC',
  );
  // line 281
  const k = selectConstant(
    constants.DAIRY,
    'EFFICIENCY_OF_MILK_PRODUCTION',
  ).named('k');

  const qmj = num(0.795).multiply(DMDj).minus(num(0.0014)).named('qmj');

  return MPj.multiply(num(1.03))
    .switchUnit((r) => massPerEnergy('Milk', r.value))
    .multiply(NE)
    .divide(
      GEC.multiply(k)
        .multiply(qmj)
        .switchUnit((r) => realNumber(r.value)),
    )
    .switchUnit((r) => massPerHeadPerDay('DryMatter', r.value))
    .named('MIj');
};

export const calculateFeedIntakeIj = (
  Wj: Container<Mass<'Liveweight'>>,
  LWGj: Container<MassPerHeadPerDay<'Liveweight'>>,
  MRj: Container<MassPerHeadPerDay<'DryMatter'>>,
  MIj: Container<MassPerHeadPerDay<'DryMatter'>>,
): Container<MassPerHeadPerDay<'DryMatter'>> => {
  // Ij: Ch 3.3 line 226

  const intakeForWeightGain: Container<MassPerHeadPerDay<'DryMatter'>> = br(
    num(1.185)
      .plus(num(0.00454).multiply(Wj))
      .minus(num(0.0000026).multiply(Wj.squared()))
      //@ts-expect-error Erasure of units, converting liveweight and liveweight gain to intake of dry matter
      .plus(num(0.315).multiply(LWGj)),
  )
    .squared()
    .switchUnit((r) => realNumber(r.value))
    .multiply(MRj);

  const Ij: Container<MassPerHeadPerDay<'DryMatter'>> =
    intakeForWeightGain.plus(MIj);

  return Ij;
};
