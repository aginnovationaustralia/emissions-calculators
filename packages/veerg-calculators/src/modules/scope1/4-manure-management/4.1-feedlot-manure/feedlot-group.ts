import {
  FeedlotGroupLivestockInputTransformed,
  FeedlotGroupSharedInputTransformed,
} from '@/calculators/Feedlot/types/feedlot-group.input';
import {
  FeedlotMMSType,
  FeedlotMMSTypes,
  GrazingProductionSystemsWithRainfall,
  MeanAnnualTemperature,
  SecondaryFeedlotMMSTypes,
  State,
  TertiaryFeedlotMMSTypes,
} from '@/constants/enums';
import { HasConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { br, Container } from '@/tools/containers';
import { captureMethod1Or2Value } from '@/tools/multi';
import {
  oneMinus,
  zeroMassPerHeadPerDayCH4,
  zeroMassVolatilisedN,
  zeroN,
  zeroN2O,
} from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import {
  Mass,
  massPerHeadPerDay,
  MassPerHeadPerDay,
  realNumber,
} from '@/tools/units';
import {
  getCrudeProtein,
  getDryMatterDigestibility,
  getDryMatterIntake,
  getNitrogenRetentionRate,
} from '../../shared/feedlot/helpers';

const subscriptNotation = {
  drylot: '5',
  solidStorage: '4',
  composting: '7',
  directApplication: '13',
  anaerobicLagoon: '1',
};

const secondaryAndTertiaryMMSTypes = [
  ...SecondaryFeedlotMMSTypes,
  ...TertiaryFeedlotMMSTypes,
] as const;

/**
 * Calculate volatile solid production rate *VSj* per cattle for a feedlot group *j*
 */
const calculateVolatileSolidsForGroup = (
  group: FeedlotGroupLivestockInputTransformed,
  constants: HasConstants<'FEEDLOT' | 'LIVESTOCK'>,
): Container<MassPerHeadPerDay<'Volatile Solids'>> => {
  const dryMatterIntake = getDryMatterIntake(group, constants);
  const dryMatterDigestibility = getDryMatterDigestibility(group, constants);
  const ashContent = selectConstant(
    constants.LIVESTOCK,
    'ASH_CONTENT_OF_MANURE',
    'feedlot',
  );

  /**
   * VSj = Ij * (1 - DMDj) * ( 1 - A )
   */
  return dryMatterIntake
    .multiply(oneMinus(dryMatterDigestibility))
    .multiply(oneMinus(ashContent))
    .switchUnit((v) => massPerHeadPerDay('Volatile Solids', v.store))
    .named(`VSj`)
    .reference('4.1.1.1 (5)');
};

/**
 * Calculate methane emissions *ECH4* produced by a feedlot group (4.3.1.1/4.3.1.2)
 */
export const calculateManureManagementCH4ForGroup = (
  group: FeedlotGroupLivestockInputTransformed,
  state: Container<State>,
  method2MeanAnnualTemperature: Container<MeanAnnualTemperature> | undefined,
  constants: HasConstants<'FEEDLOT' | 'LIVESTOCK' | 'COMMON'>,
) => {
  const volatileSolids = calculateVolatileSolidsForGroup(group, constants);

  const emissionsPotential = selectConstant(
    constants.LIVESTOCK,
    'EMISSIONS_POTENTIAL_VOLATILE_SOLIDS_TO_CH4',
    'feedlot',
  ).named('B0');

  const densityOfMethane = selectConstant(
    constants.COMMON,
    'DENSITY_OF_METHANE',
  ).named('𝜌');

  const drylotMCF = selectConstant(
    constants.FEEDLOT,
    'MMS',
    'drylot',
    'METHANE_CONVERSION_FACTOR_BY_STATE',
    state,
  ).named('MCFim=5');

  /**
   * Mjm=5 T=1 = VSj * Bo * MMSm=5T=1 * MCFim=5 * 𝜌
   *
   * Where MMSm=5T=1 = 1 (all manure starts in a drylot system)
   */
  const primaryMethaneProduction = volatileSolids
    .multiply(emissionsPotential)
    .multiply(drylotMCF)
    .multiply(densityOfMethane)
    .named(`Mjm=5T=1`)
    .reference('4.1.1.1 (2)');

  const fractionSolidsLost = selectConstant(
    constants.FEEDLOT,
    'MMS',
    'drylot',
    'FRACTION_SOLIDS_LOST',
  ).named(`VSL`);

  const secondaryMethaneProduction = SecondaryFeedlotMMSTypes.map((mms) => {
    const methaneConversionFactor = captureMethod1Or2Value(
      selectConstant(
        constants.FEEDLOT,
        'MMS',
        mms,
        'METHANE_CONVERSION_FACTOR_BY_STATE',
        state,
      ),
      method2MeanAnnualTemperature
        ? selectConstant(
            constants.LIVESTOCK,
            'MANURE_MANAGEMENT_METHANE_CONVERSION_FACTORS',
            mms,
            method2MeanAnnualTemperature,
          )
        : undefined,
    );

    /**
     * MjmT=2 = (1 - VSL) * VSj * Bo * MMSmT=2 * MCFim * 𝜌
     */
    return volatileSolids
      .multiply(oneMinus(fractionSolidsLost))
      .multiply(emissionsPotential)
      .multiply(group.manureAllocations[mms])
      .multiply(methaneConversionFactor)
      .multiply(densityOfMethane)
      .named(`Mjm=${subscriptNotation[mms]}T=2`)
      .reference('4.1.1.1 (3)');
  });

  const fractionSolidsRunoff = selectConstant(
    constants.FEEDLOT,
    'MMS',
    'anaerobicLagoon',
    'FRACTION_SOLIDS_RUNOFF',
  ).named(`MMSm=1T=3`);
  const anaerobicLagoonMCF = captureMethod1Or2Value(
    selectConstant(
      constants.FEEDLOT,
      'MMS',
      'anaerobicLagoon',
      'METHANE_CONVERSION_FACTOR_BY_STATE',
      state,
    ),
    method2MeanAnnualTemperature !== undefined
      ? selectConstant(
          constants.LIVESTOCK,
          'MANURE_MANAGEMENT_METHANE_CONVERSION_FACTORS',
          'anaerobicLagoon',
          method2MeanAnnualTemperature,
        )
      : undefined,
  );

  /**
   * Mijm=1 T=3 = VSj * Bo * MMSm=1T=3 * MCFim=1 * 𝜌
   */
  const tertiaryMethaneProduction = volatileSolids
    .multiply(emissionsPotential)
    .multiply(fractionSolidsRunoff)
    .multiply(anaerobicLagoonMCF)
    .multiply(densityOfMethane)
    .named(`Mjm=1T=3 `)
    .reference('4.1.1.1 (4)');

  const totalMethaneProduction = sum(
    [
      primaryMethaneProduction,
      ...secondaryMethaneProduction,
      tertiaryMethaneProduction,
    ],
    zeroMassPerHeadPerDayCH4,
  ).named(`MjmT`);

  /**
   * ECH4 = SUM[j,m,T] (Dj * MjmT * Nj) * 10^-3
   */
  return totalMethaneProduction
    .multiply(group.head)
    .multiply(group.averageLengthOfStayDays)
    .named(`ECH4 (j)`)
    .reference('4.1.1.1 (1)');
};

/**
 * Calculate nitrogen excretion rate *NEj* per cattle for a feedlot group *j*
 */
export const calculateNitrogenExcretionForGroup = (
  group: FeedlotGroupSharedInputTransformed,
  constants: HasConstants<'FEEDLOT' | 'COMMON'>,
): Container<MassPerHeadPerDay<'N'>> => {
  const dryMatterIntake = getDryMatterIntake(group, constants);
  const crudeProteinContent = getCrudeProtein(group, constants);

  const conversionFactor = selectConstant(
    constants.COMMON,
    'NITROGEN_TO_PROTEIN',
  );

  /**
   * NIj = Ij * CPj ÷ 6.25
   */
  const nitrogenIntake = dryMatterIntake
    .multiply(crudeProteinContent)
    .divide(conversionFactor)
    .named('NIj')
    .reference('4.1.1.3 (5)');

  const nitrogenRetentionRate = getNitrogenRetentionRate(group, constants);
  /**
   * NEj = NIj * (1 - NRj)
   */
  return nitrogenIntake
    .multiply(oneMinus(nitrogenRetentionRate))
    .named('NEj')
    .reference('4.1.1.3 (4)');
};

const calculateNitrogenPerMMSForGroup = (
  group: FeedlotGroupSharedInputTransformed,
  constants: HasConstants<'FEEDLOT' | 'COMMON'>,
): Record<FeedlotMMSType, Container<Mass<'N'>>> => {
  const annualNitrogenExcretion = calculateNitrogenExcretionForGroup(
    group,
    constants,
  )
    .multiply(group.head)
    .multiply(group.averageLengthOfStayDays)
    .named(`AEj`)
    .reference('4.1.1.3 (3)');

  const fractionSolidsRunoff = selectConstant(
    constants.FEEDLOT,
    'MMS',
    'anaerobicLagoon',
    'FRACTION_SOLIDS_RUNOFF',
  ).named(`MMSm=1T=3`);

  const anaerobicLagoonNitrogen = annualNitrogenExcretion
    .multiply(fractionSolidsRunoff)
    .named(`MNjm=1T=3`);

  const drylotFracGASM = selectConstant(
    constants.FEEDLOT,
    'MMS',
    'drylot',
    'FracGASM',
  );
  const drylotEF = selectConstant(constants.FEEDLOT, 'MMS', 'drylot', 'EFm');

  /**
   * NTjmT=2 = (MNjm=5T=1 * (1 - FracGASMm=5 - EFm=5)) - MNjmT=3
   */
  const nitrogenTransferredToSecondaryTreatment = annualNitrogenExcretion
    .multiply(
      br(
        oneMinus(drylotFracGASM.switchUnit((v) => realNumber(v.store))).minus(
          drylotEF.switchUnit((v) => realNumber(v.store)),
        ),
      ),
    )
    .minus(anaerobicLagoonNitrogen)
    .named(`NTjmT=2`);

  return {
    drylot: annualNitrogenExcretion,
    anaerobicLagoon: anaerobicLagoonNitrogen,
    solidStorage: nitrogenTransferredToSecondaryTreatment
      .multiply(group.manureAllocations.solidStorage)
      .named(`MNjm=4T=2`),
    composting: nitrogenTransferredToSecondaryTreatment
      .multiply(group.manureAllocations.composting)
      .named(`MNjm=7T=2`),
    directApplication: nitrogenTransferredToSecondaryTreatment
      .multiply(group.manureAllocations.directApplication)
      .named(`MNjm=13T=2`),
  };
};

/**
 * Calculate direct nitrous oxide emissions *EN2O,dir* produced by a feedlot group
 * (4.3.1.3/4.3.1.4)
 */
export const calculateDirectN2OEmissionsForGroup = (
  group: FeedlotGroupSharedInputTransformed,
  constants: HasConstants<'FEEDLOT' | 'COMMON'>,
) => {
  const nitrogenPerMMS = calculateNitrogenPerMMSForGroup(group, constants);
  const CN2O = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_N2O',
  ).named('CN2O');

  const directN2OPerMMS = FeedlotMMSTypes.filter(
    (mms) => mms !== 'directApplication',
  ).map((mms) => {
    const EFm = selectConstant(constants.FEEDLOT, 'MMS', mms, 'EFm').named(
      `EFm=${subscriptNotation[mms]}`,
    );

    /**
     * EN2O,dir = SUM[j,m,T] (MNjmT * EFjm * CN2O) * 10^-3
     */
    return nitrogenPerMMS[mms]
      .multiply(EFm)
      .multiply(CN2O)
      .named(`EN2O,dir (j, m=${subscriptNotation[mms]})`)
      .reference('4.1.1.3 (1)');
  });

  return sum(directN2OPerMMS, zeroN2O).named(`EN2O,dir`);
};

/**
 * Calculate nitrous oxide emissions from atmospheric deposition *EN2O,ad* produced by a
 * feedlot group (4.1.1.5/4.1.1.6)
 */
export const calculateAtmosphericDepositionN2OEmissionsForGroup = (
  group: FeedlotGroupSharedInputTransformed,
  grazingSystem: Container<GrazingProductionSystemsWithRainfall>,
  constants: HasConstants<'FEEDLOT' | 'COMMON' | 'LIVESTOCK' | 'CROP'>,
) => {
  const nitrogenPerMMS = calculateNitrogenPerMMSForGroup(group, constants);

  const MMSATMOS = sum(
    FeedlotMMSTypes.filter((mms) => mms !== 'directApplication').map((mms) => {
      const FracGASM = selectConstant(
        constants.FEEDLOT,
        'MMS',
        mms,
        'FracGASM',
      ).named(`FracGASMm=${subscriptNotation[mms]}`);

      /**
       * MMSATMOS = SUM[j,m,T] MNjmT * FracGASMmT
       */
      return nitrogenPerMMS[mms].multiply(FracGASM);
    }),
    zeroMassVolatilisedN,
  ).named('MMSATMOS');

  const EFN2O = selectConstant(
    constants.CROP,
    'EF_N2O_ATMOSPHERIC_DEPOSITION_PRODUCTION_SYSTEM',
    grazingSystem,
  ).named('EFN2O');

  const CN2O = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_N2O',
  ).named('CN2O');

  return MMSATMOS.multiply(EFN2O)
    .multiply(CN2O)
    .named(`EN2O,ad (j)`)
    .reference('4.1.1.5 (1)');
};

/**
 * Calculate nitrogen *applicable* to soil produced by a feedlot group. The nitrogen
 * actually applied to soil within the activity boundary (*MNSoilscope1*) is calculated
 * in `calculateMassOfNitrogenAppliedToSoilsForFeedlot`.
 */
export const calculateMassOfNitrogenAppliedToSoilsForGroup = (
  group: FeedlotGroupSharedInputTransformed,
  constants: HasConstants<'FEEDLOT' | 'COMMON'>,
) => {
  const nitrogenPerMMS = calculateNitrogenPerMMSForGroup(group, constants);

  const applicableNitrogenPerMMS = secondaryAndTertiaryMMSTypes.map((mms) => {
    const EFm = selectConstant(constants.FEEDLOT, 'MMS', mms, 'EFm').named(
      `EFm=${subscriptNotation[mms]}`,
    );
    const FracGASM = selectConstant(
      constants.FEEDLOT,
      'MMS',
      mms,
      'FracGASM',
    ).named(`FracGASMm=${subscriptNotation[mms]}`);

    /**
     * MNjmT=2,3 * (1 - EFmT=2,3 - FracGASMmT=2,3)
     *
     * PF is applied in `calculateMassOfNitrogenAppliedToSoilsForFeedlot`
     */
    return nitrogenPerMMS[mms].multiply(
      oneMinus(EFm.switchUnit((v) => realNumber(v.store))).minus(
        FracGASM.switchUnit((v) => realNumber(v.store)),
      ),
    );
  });

  return sum(applicableNitrogenPerMMS, zeroN);
};
