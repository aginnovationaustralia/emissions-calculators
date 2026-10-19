import { ExecutionContext } from '@/calculators/executionContext';
import { isInLeachingZoneToFracWET } from '@/constants/translations';
import { HasConstants } from '@/constants/types';
import { OtherLivestockManureAndEntericHerdInputTransformed } from '@/modules/scope1/shared/other-livestock/input';
import { selectConstant } from '@/tools/constants';
import { ifTrueElse } from '@/tools/if-else';
import { captureMethod1Or2Value } from '@/tools/multi';
import { daysInYear, one, zero } from '@/tools/sentinels';
import { sum } from '@/tools/sum';

type ConstantsForOtherLivestockManure = HasConstants<
  'COMMON' | 'LIVESTOCK' | 'CROP'
>;

/**
 * Calculate methane emissions from manure *ECH4* produced by a herd of 'other' livestock
 * (4.7.1.1/4.7.1.2)
 */
export function calculateManureManagementCH4ForOtherLivestockHerd(
  herd: OtherLivestockManureAndEntericHerdInputTransformed,
  context: ExecutionContext<ConstantsForOtherLivestockManure>,
) {
  const { constants } = context;
  const {
    excludedFromNaturalWater,
    livestock,
    state,
    method2MeanAnnualTemperature,
  } = herd;

  const MMSm1 = ifTrueElse(
    excludedFromNaturalWater,
    zero,
    selectConstant(
      constants.LIVESTOCK,
      'OTHER_LIVESTOCK_MMS_FACTORS',
      'anaerobicLagoon',
      'ALLOCATION_TO_MMS_WITH_NATURAL_WATER',
    ),
  ).named('MMSm=1');

  const MMSm14 = ifTrueElse(
    excludedFromNaturalWater,
    one,
    selectConstant(
      constants.LIVESTOCK,
      'OTHER_LIVESTOCK_MMS_FACTORS',
      'pastureRangeAndPaddock',
      'ALLOCATION_TO_MMS_WITH_NATURAL_WATER',
    ),
  ).named('MMSm=14');

  const emissionsFromClasses = livestock.map((cls) => {
    const { head, type, number } = cls;

    const Nj = head.named(`Nj=${type}`);

    const VSj = selectConstant(
      constants.LIVESTOCK,
      'OTHER_LIVESTOCK_EMISSION_FACTORS',
      type,
      'VOLATILE_SOLIDS',
    ).named(`VSj=${number}`);

    const B0 = selectConstant(
      constants.LIVESTOCK,
      'EMISSIONS_POTENTIAL_VOLATILE_SOLIDS_TO_CH4',
      'other',
    ).named('B0');

    const MCFim1 = captureMethod1Or2Value(
      selectConstant(
        constants.LIVESTOCK,
        'OTHER_LIVESTOCK_MMS_FACTORS',
        'anaerobicLagoon',
        'METHANE_CONVERSION_FACTOR_BY_STATE',
        state,
      ),
      method2MeanAnnualTemperature
        ? selectConstant(
            constants.LIVESTOCK,
            'MANURE_MANAGEMENT_METHANE_CONVERSION_FACTORS',
            'anaerobicLagoon',
            method2MeanAnnualTemperature,
          )
        : undefined,
    ).named(`MCFim=1 (${state})`);

    const MCFim14 = selectConstant(
      constants.LIVESTOCK,
      'OTHER_LIVESTOCK_MMS_FACTORS',
      'pastureRangeAndPaddock',
      'METHANE_CONVERSION_FACTOR_BY_STATE',
      state,
    ).named('MCFim=14 (pasture)');

    const p = selectConstant(constants.COMMON, 'DENSITY_OF_METHANE').named('p');

    // M jm = VS j * B0 * MMSm * MCF im * 𝜌 -- 1704
    const Mjm1 = VSj.multiply(B0)
      .multiply(MMSm1)
      .multiply(MCFim1)
      .multiply(p)
      .named(`Mjm=1 (${type})`)
      .reference('4.7.1.1 (2)');

    const Mjm14 = VSj.multiply(B0)
      .multiply(MMSm14)
      .multiply(MCFim14)
      .multiply(p)
      .named(`Mjm=14 (${type})`)
      .reference('4.7.1.1 (2)');

    const Mjm = sum([Mjm1, Mjm14], { name: `Mjm (${type})` });

    return Mjm.multiply(Nj)
      .multiply(daysInYear)
      .named(`EMCH4j=${number}`)
      .reference('4.7.1.1 (1)');
  });

  return sum(emissionsFromClasses, { name: 'EMCH4 (herd)' });
}

/**
 * Calculates annual nitrogen excreted *AE* by a herd of 'other' livestock (4.7.1.3 (2))
 */
const calculateAnnualNitrogenExcretionForHerd = (
  herd: OtherLivestockManureAndEntericHerdInputTransformed,
  context: ExecutionContext<ConstantsForOtherLivestockManure>,
) => {
  const { constants } = context;
  const { livestock } = herd;

  const nitrogenExcretedByClasses = livestock.map((cls) => {
    const { head, type, number } = cls;
    const Nj = head.named(`Nj=${number}`);
    const NEj = selectConstant(
      constants.LIVESTOCK,
      'OTHER_LIVESTOCK_EMISSION_FACTORS',
      type,
      'NITROGEN_EXCRETED',
    ).named(`NEj=${number}`);

    return NEj.multiply(Nj)
      .multiply(daysInYear)
      .named(`AEj=${number}`)
      .reference('4.7.1.3 (2)');
  });

  const nitrogenExcreted = sum(nitrogenExcretedByClasses).named('AE');

  return nitrogenExcreted;
};

/**
 * Calculate direct nitrous oxide emissions from manure *EN2O,dir* produced by a herd of
 * 'other' livestock (4.7.1.3)
 */
export function calculateDirectN2OEmissionsForOtherLivestockHerd(
  herd: OtherLivestockManureAndEntericHerdInputTransformed,
  context: ExecutionContext<ConstantsForOtherLivestockManure>,
) {
  const { constants } = context;

  const AE = calculateAnnualNitrogenExcretionForHerd(herd, context);

  const EFprp = selectConstant(
    constants.LIVESTOCK,
    'EF_DEPOSITED_URINE_AND_DUNG_PRP',
    herd.climateZone,
  ).named('EF PRP');
  const cn2o = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_N2O',
  ).named('CN2O');

  /**
   * EN2O,dir = AE * EF PRP * CN2O * 10^-3
   */
  return AE.multiply(EFprp)
    .multiply(cn2o)
    .named('EN2O,dir')
    .reference('4.7.1.3 (1)');
}

/**
 * Calculate nitrous oxide emissions from atmospheric deposition *EN2O,ad* produced by a
 * herd of 'other' livestock (4.7.1.5)
 */
export function calculateAtmosphericDepositionN2OEmissionsForOtherLivestockHerd(
  herd: OtherLivestockManureAndEntericHerdInputTransformed,
  context: ExecutionContext<ConstantsForOtherLivestockManure>,
) {
  const { constants } = context;

  const AE = calculateAnnualNitrogenExcretionForHerd(herd, context);

  const fracGASMsoil = selectConstant(
    constants.CROP,
    'FRACTION_N_VOLATILISED_ORGANIC_FERTILISER',
  ).named('FracGASMsoil');

  /**
   * Mvol = AE * FracGASMsoil
   */
  const Mvol = AE.multiply(fracGASMsoil).named('Mvol').reference('4.7.1.5 (2)');

  const EFN2O = selectConstant(
    constants.CROP,
    'EF_N2O_ATMOSPHERIC_DEPOSITION_PRODUCTION_SYSTEM',
    herd.grazingSystem,
  );

  const CN2O = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_N2O',
  ).named('CN2O');

  /**
   * EN2O,ad = Mvol * EF N2O * CN2O * 10^-3
   */
  const En2oad = Mvol.multiply(EFN2O)
    .multiply(CN2O)
    .named('EN2O,ad')
    .reference('4.7.1.5 (1)');

  return En2oad;
}

/**
 * Calculate nitrous oxide emissions from leaching and runoff *EN2O,leach* produced by a
 * herd of 'other' livestock (4.7.1.7)
 */
export function calculateLeachingAndRunoffN2OEmissionsForOtherLivestockHerd(
  input: OtherLivestockManureAndEntericHerdInputTransformed,
  context: ExecutionContext<ConstantsForOtherLivestockManure>,
) {
  /*
    EN2O,leach = Mleach * EF leach * CN2O * 10^-3

    Mleach = AE * FracWet * FracLEACH
  */

  const { constants } = context;

  const AE = calculateAnnualNitrogenExcretionForHerd(input, context);

  const FracWET = isInLeachingZoneToFracWET(input.isInLeachingZone);
  const FracLEACH = selectConstant(
    constants.CROP,
    'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF',
  ).named('FracLEACH');
  const EFleach = selectConstant(
    constants.CROP,
    'EF_N2O_LEACHING_AND_RUNOFF',
  ).named('EFleach');
  const cn2o = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_N2O',
  ).named('CN2O');

  const Mleach = AE.multiply(FracWET)
    .multiply(FracLEACH)
    .named('Mleach')
    .reference('4.7.1.7 (2)');
  return Mleach.multiply(EFleach)
    .multiply(cn2o)
    .named('EN2O,leach')
    .reference('4.7.1.7 (1)');
}

export function calculate47OtherLivestockManureManagement(
  herd: OtherLivestockManureAndEntericHerdInputTransformed,
  context: ExecutionContext<ConstantsForOtherLivestockManure>,
) {
  return {
    manureManagementCH4: calculateManureManagementCH4ForOtherLivestockHerd(
      herd,
      context,
    ),
    manureDirectN2O: calculateDirectN2OEmissionsForOtherLivestockHerd(
      herd,
      context,
    ),
    manureAtmosphericDepositionN2O:
      calculateAtmosphericDepositionN2OEmissionsForOtherLivestockHerd(
        herd,
        context,
      ),
    manureLeachingRunoffN2O:
      calculateLeachingAndRunoffN2OEmissionsForOtherLivestockHerd(
        herd,
        context,
      ),
  };
}
