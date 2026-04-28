import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { OtherLivestockHerdInputTransformed } from '@/calculators/OtherLivestock/types/herd.input';
import { OtherLivestockInputTransformed } from '@/calculators/OtherLivestock/types/input';
import { isWetClimateZone } from '@/constants/enums';
import { selectConstant } from '@/tools/constants';
import { num } from '@/tools/containers';
import { daysInYear, one, zero } from '@/tools/sentinels';
import { sum } from '@/tools/sum';

const calculateManureMethaneForHerd = (
  input: OtherLivestockInputTransformed,
  herd: OtherLivestockHerdInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  const { excludedFromNaturalWater, classes } = herd;
  const { state, method2MeanAnnualTemperature } = input;

  const MMSm1 = excludedFromNaturalWater ? num(0) : num(0.05);
  const MMSm14 = excludedFromNaturalWater ? num(1) : num(0.95);

  const emissionsFromClasses = classes.map((cls) => {
    const { head, type, number } = cls;

    const Nj = head.named(`Nj=${type}`);

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

    const MCFim1 = method2MeanAnnualTemperature
      ? selectConstant(
          constants.LIVESTOCK,
          'METHANE_CONVERSION_BY_MEAN_ANNUAL_TEMPERATURE',
          method2MeanAnnualTemperature,
        ).named(`MCFim=1 (${method2MeanAnnualTemperature})`)
      : selectConstant(
          constants.LIVESTOCK,
          'METHANE_CONVERSION_BY_STATE',
          state,
        ).named(`MCFim=1 (${state})`);

    const MCFim14 = selectConstant(
      constants.LIVESTOCK,
      'METHANE_CONVERSION_PASTURE',
    ).named('MCFim=14 (pasture)');

    const p = selectConstant(constants.COMMON, 'DENSITY_OF_METHANE').named('p');

    // M jm = VS j * BO * MMSm * MCF im * 𝜌 -- 1704
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

const calculateNitrousEmissionsFromHerd = (
  herd: OtherLivestockHerdInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  const { classes } = herd;

  const nitrogenExcretedByClasses = classes.map((cls) => {
    const { head, type, number } = cls;
    const Nj = head.named(`Nj=${number}`);
    const NEj = selectConstant(
      constants.LIVESTOCK,
      'OTHER_LIVESTOCK_EMISSION_FACTORS',
      type,
      'NITROGEN_EXCRETED',
    ).named(`NEj=${number}`);

    return NEj.multiply(Nj).multiply(daysInYear).named(`AEj=${number}`);
  });

  const nitrogenExcreted = sum(nitrogenExcretedByClasses, {
    name: 'AE (herd)',
  });

  return nitrogenExcreted;
};

const calculateNitrousEmissionsFromHerdsAE = (
  input: OtherLivestockInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { herds } = input;

  const emissionsFromHerds = herds.map((herd) => {
    return calculateNitrousEmissionsFromHerd(herd, context);
  });

  return sum(emissionsFromHerds, { name: 'AE' });
};

export function calculate_4_7_1_3_OtherLivestockManureDirectN2O(
  input: OtherLivestockInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { constants } = context;
  /*
    EN2O,dir = AE * EF PRP * CN2O * 10^-3

    AE = annual nitrogen excreted by each livestock type (kg N/year)
    EF PRP= emission factor for nitrous oxide from urine and dung deposited to soil (kg N2O-N/kg N deposited)
    CN2O = factor to convert elemental mass of nitrous oxide to molecular mass (dimensionless)
*/

  const { climateZone } = input;
  const wetOrDry = isWetClimateZone(climateZone) ? 'wet' : 'dry';

  const AE = calculateNitrousEmissionsFromHerdsAE(input, context);

  const EFprp = selectConstant(constants.LIVESTOCK, 'EFPRP', wetOrDry).named(
    'EF PRP',
  );
  const cn2o = selectConstant(constants.COMMON, 'GWP_FACTORSC15').named('CN2O');

  return AE.multiply(EFprp).multiply(cn2o).named('EN2O,dir');
}

export function calculate_4_7_1_5_OtherLivestockManureDepositionN2O(
  input: OtherLivestockInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { constants } = context;

  /*
  EN2O,ad = Mvol * EF N2O * CN2O * 10^-3

  Mvol = AE * FracGASMsoil
  */

  const { productionSystem } = input;

  const AE = calculateNitrousEmissionsFromHerdsAE(input, context);

  const fracGASMsoil = selectConstant(
    constants.CROP,
    'FRACTION_N_VOLATILISED_ORGANIC_FERTILISER',
  ).named('FracGASMsoil');

  const Mvol = AE.multiply(fracGASMsoil).named('Mvol');

  const EFn2o = selectConstant(
    constants.LIVESTOCK,
    'EF_ATMOSPHERIC_DEPOSITION',
    productionSystem,
  );

  const cn2o = selectConstant(constants.COMMON, 'GWP_FACTORSC15').named('CN2O');

  const En2oad = Mvol.multiply(EFn2o).multiply(cn2o).named('EN2O,ad');

  return En2oad;
}

export function calculate_4_7_1_7_OtherLivestockManureLeachingRunoffN2O(
  input: OtherLivestockInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  /*
    EN2O,leach = Mleach * EF leach * CN2O * 10^-3

    Mleach = AE * FracWet * FracLEACH
  */

  const { constants } = context;

  const AE = calculateNitrousEmissionsFromHerdsAE(input, context);

  const FracWET = (input.isInLeachingZone ? one : zero).named('FracWET');
  const FracLEACH = selectConstant(
    constants.CROP,
    'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF',
  ).named('FracLEACH');
  const EFleach = selectConstant(
    constants.CROP,
    'EF_N2O_LEACHING_AND_RUNOFF',
  ).named('EFleach');
  const cn2o = selectConstant(constants.COMMON, 'GWP_FACTORSC15').named('CN2O');

  const Mleach = AE.multiply(FracWET).multiply(FracLEACH).named('Mleach');
  const En2oleach = Mleach.multiply(EFleach).multiply(cn2o).named('EN2O,leach');

  return En2oleach;
}
