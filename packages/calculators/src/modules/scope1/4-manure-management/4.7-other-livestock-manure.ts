import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { OtherLivestockHerdInputTransformed } from '@/calculators/OtherLivestock/types/herd.input';
import { OtherLivestockInputTransformed } from '@/calculators/OtherLivestock/types/input';
import { selectConstant } from '@/tools/constants';
import { num } from '@/tools/containers';
import { daysInYear } from '@/tools/sentinels';
import { sum } from '@/tools/sum';

const calculateManureMethaneForHerd = (
  input: OtherLivestockInputTransformed,
  herd: OtherLivestockHerdInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  const { excludedFromWater, classes } = herd;
  const { state } = input;

  const MMSm1 = excludedFromWater ? num(0) : num(0.05);
  const MMSm14 = excludedFromWater ? num(1) : num(0.95);

  const emissionsFromClasses = classes.map((cls) => {
    const { head, type, number } = cls;

    const Nj = head.named(`Nj=${type}`);

    // M jm = VS j * BO * MMSm * MCF im * 𝜌 -- 1704
    const VSj = selectConstant(
      constants.LIVESTOCK,
      'OTHER_LIVESTOCK_EMISSION_FACTORS',
      type,
      'VOLATILE_SOLIDS',
    ).named(`VSj=${number}`);

    const Bo = selectConstant(
      constants.COMMON,
      'EMISSIONS_POTENTIAL_VOLATILE_SOLIDS_TO_CH4',
    ).named('BO');

    const MCFim1 = selectConstant(
      constants.LIVESTOCK,
      'METHANE_CONVERSION_BY_STATE',
      state,
    ).named(`MCFim=1 (${state})`);

    const MCFim14 = selectConstant(
      constants.LIVESTOCK,
      'METHANE_CONVERSION_PASTURE',
    ).named('MCFim=14 (pasture)');

    const p = selectConstant(constants.COMMON, 'DENSITY_OF_METHANE').named('p');

    const Mjm1 = VSj.multiply(Bo)
      .multiply(MMSm1)
      .multiply(MCFim1)
      .multiply(p)
      .named(`Mjm=1 (${type})`);

    const Mjm14 = VSj.multiply(Bo)
      .multiply(MMSm14)
      .multiply(MCFim14)
      .multiply(p)
      .named(`Mjm=14 (${type})`);

    const Mjm = sum([Mjm1, Mjm14], { name: `Mjm (${type})` });

    return Mjm.multiply(Nj).multiply(daysInYear).named(`EMCH4j=${number}`);
  });

  return sum(emissionsFromClasses, { name: 'EMCH4 (herd)' });
};

export function calculate_4_7_1_1_OtherLivestockManureMethane(
  input: OtherLivestockInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { herds } = input;

  const emissionsFromHerds = herds.map((herd) => {
    return calculateManureMethaneForHerd(input, herd, context);
  });

  return sum(emissionsFromHerds, { name: 'EMCH4' });
}
