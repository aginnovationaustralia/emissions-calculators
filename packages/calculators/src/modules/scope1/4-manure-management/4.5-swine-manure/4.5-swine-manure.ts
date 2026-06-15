import { SwineSpecificClassInputTransformed } from '@/calculators/Swine/types/swine-class.input';
import {
  GrazingProductionSystemsWithRainfall,
  MeanAnnualTemperature,
  PrimarySwineMMSType,
  PrimarySwineMMSTypes,
  PrimarySwineMMSWithSolidSeparationTypes,
  PureState,
  SecondarySwineMMSType,
  SecondarySwineMMSTypes,
  SecondarySwineMMSTypesWithoutDirectApplication,
} from '@/constants/enums';
import {
  CropConstants,
  HasCommonConstants,
  LivestockConstants,
  SwineConstants,
} from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { Container, num } from '@/tools/containers';
import { oneMinus } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { Mass, realNumber, RealNumber } from '@/tools/units';

/**
 * ### WARNING ###
 *
 * The implementation of Chapter 4.5 in this file is somewhat different from the draft
 * version of the guidance. A number of items in this chapter are contradictory and/or
 * ambiguous. In the interim, this implementation tries to stick to what is logical as
 * best as possible, but as a result there are a number of items here that do not mirror
 * the guidance at all.
 *
 * In summary, there is no use of the value 'MMSjmT=2' in this code. This has a number
 * of run-on impacts on the calculations, detailed in various comments below
 */

const subscriptNotation: Record<
  PrimarySwineMMSType | SecondarySwineMMSType,
  string
> = {
  anaerobicLagoon: '1',
  // Drylot equivalent.
  outdoorAndFreeRange: '5',
  solidStorage: '4',
  digester: '7',
  deepLitter: '8',
  pitStorage: '9',
  directApplication: '13',
};

/**
 * Convenience wrapper for volatile solid production (*VSj*)
 */
const getVolatileSolidsProductionForClass = (
  swineClass: SwineSpecificClassInputTransformed,
  constants: { SWINE: SwineConstants },
) => {
  return (
    swineClass.method2VolatileSolidProductionRate ??
    selectConstant(
      constants.SWINE,
      'SWINE_CLASS_FACTORS',
      swineClass.name,
      'VOLATILE_SOLIDS',
    ).named(`VSj=${swineClass.number}`)
  );
};

/**
 * Convenience wrapper for nitrogen waste production (*NWj*)
 */
const getNitrogenWasteProductionForClass = (
  swineClass: SwineSpecificClassInputTransformed,
  constants: { SWINE: SwineConstants },
) => {
  return (
    swineClass.method2NitrogenWasteProductionRate ??
    selectConstant(
      constants.SWINE,
      'SWINE_CLASS_FACTORS',
      swineClass.name,
      'NITROGEN_IN_WASTE',
    ).named(`NWj=${swineClass.number}`)
  );
};

/**
 * Convenience wrapper for solid separation rate (*SSj*)
 */
const getSolidSeparationRate = (
  swineClass: SwineSpecificClassInputTransformed,
  constants: { SWINE: SwineConstants },
) => {
  if (swineClass.manureAllocation.solidSeparationInputMethod === '2')
    return swineClass.manureAllocation.fractionSolidsSeparatedPreTreatment;

  return (
    swineClass.manureAllocation.solidsSeparatedPreTreatment
      ? selectConstant(constants.SWINE, 'DEFAULT_FRACTION_SOLIDS_SEPARATED')
      : num(0)
  ).named(`SSj=${swineClass.number}`);
};

/**
 * Convenience wrapper for nitrogen separation rate (*SNj*)
 */
const getNitrogenSeparationRate = (
  swineClass: SwineSpecificClassInputTransformed,
  constants: { SWINE: SwineConstants },
) => {
  if (swineClass.manureAllocation.solidSeparationInputMethod === '2')
    return swineClass.manureAllocation.fractionNitrogenSeparatedPreTreatment;

  return (
    swineClass.manureAllocation.solidsSeparatedPreTreatment
      ? selectConstant(constants.SWINE, 'DEFAULT_FRACTION_NITROGEN_SEPARATED')
      : num(0)
  ).named(`SNj=${swineClass.number}`);
};

/**
 * Calculate annual nitrogen excretion *AEj* for a class *j* (4.5.1.3 (5))
 */
const calculateAnnualNitrogenExcretionForClass = (
  swineClass: SwineSpecificClassInputTransformed,
  constants: { SWINE: SwineConstants },
) =>
  getNitrogenWasteProductionForClass(swineClass, constants)
    .multiply(swineClass.head)
    .multiply(swineClass.days)
    .named(`AEj=${swineClass.number}`);

/**
 * Calculate fraction of volatile solids *FVSjmT=1* produced by class *j* in each primary
 * MMS (4.5.1.1 (3 & 4))
 */
const calculateFractionVolatileSolidsInPrimarySystems = (
  swineClass: SwineSpecificClassInputTransformed,
  constants: { SWINE: SwineConstants },
): Record<PrimarySwineMMSType, Container<RealNumber>> => {
  const solidSeparationRate = getSolidSeparationRate(swineClass, constants);

  /**
   * From (4.5.1.1 (4)): FVSjm=4T=1 = MMSjm=4T=1 + (MMSjm=1,7,9T=1 * SSm)
   *
   * NOTE: Presumably, since covered anaerobic lagoons, uncovered lagoons, and pit
   * storage (m = 1,7,9 respectively) are the only systems where solid separation is used
   * (implied in figure 4.8 of Chapter 4 of the guidance), the fraction is only adjusted
   * for this systems.
   *
   * This does suggest that the equation for FVSjmT=1 where m != 4 is incorrectly written
   * (sort of), see below.
   *
   * REVISIT: Why only 1,7,9? The sum of values for FVSjmT=1 would potentially be less than
   * 1, which does not represent an impossible scenario if this is another way manure is
   * 'lost', but then that should surely be accounted for somewhere else as another source
   * of emissions.
   *
   * That, or the equation below for FVS is incorrect (Should be as written for m = 1,7,9
   * and FVSjmT=1 = MMSjmT=1 for m = 5,8, such that all values of FVSjmT=1 for a class j
   * sum to 1).
   */
  const solidsInSolidStorage = sum(
    PrimarySwineMMSWithSolidSeparationTypes.map((mms) =>
      swineClass.manureAllocation[mms].multiply(solidSeparationRate),
    ),
  )
    .plus(swineClass.manureAllocation.solidStorage)
    .named(`FVSj=${swineClass.number}m=4T=1`);

  /**
   * From (4.5.1.1 (3)): FVSjmT=1 = MMSjmT=1 * (1 - SSm)
   *
   * NOTE/REVISIT: The fraction of volatile solids is only adjusted for some systems as
   * implied by 4.5.1.1 (4).
   * The guidance defines the variable as *SSj* (implying the value is varies across
   * groups of swine) but is expressed as *SSm* here (implying the value varies across
   * manure management systems). As an input, it's being treated as the former in this
   * implementation, but this might have been an attempt at indicating that this value
   * changes per MMS, specifically, that it only applies for covered anaerobic lagoons,
   * uncovered lagoons, and pit storage (m = 1,7,9 respectively) since solid separation
   * only occurs in these systems.
   *
   * In order for all values of FVSjmT=1 (for some swine class j, across all values
   * of m) to sum to 1, the equation as defined in 4.5.1.1 (3) is used to calculate
   * FVSjmT=1 for m = 1, 7, and 9. For m = 5, 8, we're instead calculating this value
   * as FVSjmT=1 = MMSjmT=1. This accounts for all volatile solids produced.
   *
   * This may need to be revised with the publication of the full guidance.
   *
   */
  return {
    deepLitter: swineClass.manureAllocation.deepLitter.named(
      `FVSj=${swineClass.number}m=8T=1`,
    ),
    outdoorAndFreeRange: swineClass.manureAllocation.outdoorAndFreeRange.named(
      `FVSj=${swineClass.number}m=5T=1`,
    ),
    anaerobicLagoon: swineClass.manureAllocation.anaerobicLagoon
      .multiply(oneMinus(solidSeparationRate))
      .named(`FVSj=${swineClass.number}m=1T=1`),
    digester: swineClass.manureAllocation.digester
      .multiply(oneMinus(solidSeparationRate))
      .named(`FVSj=${swineClass.number}m=7T=1`),
    pitStorage: swineClass.manureAllocation.pitStorage
      .multiply(oneMinus(solidSeparationRate))
      .named(`FVSj=${swineClass.number}m=9T=1`),
    solidStorage: solidsInSolidStorage,
  };
};

/**
 * Calculate the fraction of TOTAL volatile solids produced by a swine class j sent to
 * each secondary MMS *FVSjmT=2*.
 *
 * NOTE: *MMSjmT=2* is defined in the guidance as the allocation of manure, not volatile
 * solids. However, this contradicts
 *  (a) the assumptions about how manure transitions between systems as shown in figure
 *  4.8 (Chapter 4.5), and
 *  (b) that volatile solids and nitrogen can be separated at different rates when solid
 *  separation occurs.
 *
 * Until these contradictions are resolved, instead of calculating the fraction of
 * TRANSFERRED volatile solids in each secondary system (*MMSjmT=2*), this calculates the
 * fraction of TOTAL volatile solids (before any is lost) in each secondary system.
 * Hence, the sum of these values may be less than or equal to one.
 *
 * For some level of conceptual consistency with the symbols the guidance uses, these
 * values are named *FVSjmT=2*. Also note that *VSTjmT=2 = SUM[m] (FVSjmT=2 * VSj)* (for
 * a given value of *j*)
 */
export const calculateFractionVolatileSolidsInSecondarySystems = (
  swineClass: SwineSpecificClassInputTransformed,
  constants: { SWINE: SwineConstants },
): Record<SecondarySwineMMSType, Container<RealNumber>> => {
  const fractionVolatileSolidsInPrimarySystems =
    calculateFractionVolatileSolidsInPrimarySystems(swineClass, constants);

  /**
   * From 4.5.1.1 (6):
   * VSTijmT=2 = VSj * FVSjmT=1 * (1 - VSLmT=1)
   *
   * This only calculates FVSjmT=1 * (1 - VSLmT=1), i.e. the fraction of total volatile
   * solids that end up in secondary treatment. For some level of consistency in terms
   * of symbols, the values calculated here are named FVSjmT=2.
   *
   */
  const fracSolidsLeaving = (mms: PrimarySwineMMSType) => {
    const fractionLost = selectConstant(
      constants.SWINE,
      'MMS',
      mms,
      'VOLATILE_SOLIDS_LOST',
    ).named(`VSLm=${subscriptNotation[mms]}`);

    return fractionVolatileSolidsInPrimarySystems[mms]
      .multiply(oneMinus(fractionLost))
      .named(`VSTj=${swineClass.number}m=${subscriptNotation[mms]}T=2`);
  };

  /**
   * NOTE: Since there is only one valid secondary MMS defined per primary MMS in the
   * guidance, values MMSjmT=2 are calculated under the assumption that:
   * - Manure from covered anaerobic lagoons moves to uncovered lagoons
   * - Manure from pit storage moves to solid storage
   * - Everything else is applied to soil, i.e. not treated again
   */
  const fractionOfAllSolids = {
    anaerobicLagoon: fracSolidsLeaving('digester').named(
      `MMSj=${swineClass.number}m=1T=2`,
    ),
    solidStorage: fracSolidsLeaving('deepLitter').named(
      `MMSj=${swineClass.number}m=4T=2`,
    ),
    directApplication: fracSolidsLeaving('anaerobicLagoon')
      .plus(fracSolidsLeaving('pitStorage'))
      .plus(fracSolidsLeaving('solidStorage'))
      .plus(fracSolidsLeaving('outdoorAndFreeRange'))
      .named(`MMSj=${swineClass.number}m=13T=2`),
  };

  return fractionOfAllSolids;
};

/**
 * Calculate fraction of nitrogen *FNjmT=1* produced by class *j* in each primary MMS
 * (4.5.1.3 (3))
 */
const calculateFractionNitrogenInPrimarySystems = (
  swineClass: SwineSpecificClassInputTransformed,
  constants: { SWINE: SwineConstants },
): Record<PrimarySwineMMSType, Container<RealNumber>> => {
  const nitrogenSeparationRate = getNitrogenSeparationRate(
    swineClass,
    constants,
  );

  /**
   * FNjm=4T=1 = MMSjm=4T=1 + (MMSjm=1,7,9 T=1 * SNm)
   * NOTE: See comments in `calculateFractionVolatileSolidsInPrimarySystems`
   */
  const nitrogenInSolidStorage = sum(
    PrimarySwineMMSWithSolidSeparationTypes.map((mms) =>
      swineClass.manureAllocation[mms].multiply(nitrogenSeparationRate),
    ),
  )
    .plus(swineClass.manureAllocation.solidStorage)
    .named(`FNj=${swineClass.number}m=4T=1`);

  /**
   * FNjm T=1 = MMSjm T=1 * (1 - SNm)
   * NOTE: See comments in `calculateFractionVolatileSolidsInPrimarySystems` for why this
   * is done differently for deep litter and outdoor/free range systems.
   */
  return {
    deepLitter: swineClass.manureAllocation.deepLitter.named(
      `FNj=${swineClass.number}m=8T=1`,
    ),
    outdoorAndFreeRange: swineClass.manureAllocation.outdoorAndFreeRange.named(
      `FNj=${swineClass.number}m=5T=1`,
    ),
    anaerobicLagoon: swineClass.manureAllocation.anaerobicLagoon
      .multiply(oneMinus(nitrogenSeparationRate))
      .named(`FNj=${swineClass.number}m=1T=1`),
    digester: swineClass.manureAllocation.digester
      .multiply(oneMinus(nitrogenSeparationRate))
      .named(`FNj=${swineClass.number}m=7T=1`),
    pitStorage: swineClass.manureAllocation.pitStorage
      .multiply(oneMinus(nitrogenSeparationRate))
      .named(`FNj=${swineClass.number}m=9T=1`),
    solidStorage: nitrogenInSolidStorage,
  };
};

/**
 * Calculate the fraction of TOTAL nitrogen produced by a swine class j sent to
 * each secondary MMS *FNjmT=2*.
 *
 * NOTE: *MMSjmT=2* is defined in the guidance as the allocation of manure, not volatile
 * solids. However, this contradicts
 *  (a) the assumptions about how manure transitions between systems as shown in figure
 *  4.8 (Chapter 4.5), and
 *  (b) that volatile solids and nitrogen can be separated at different rates when solid
 *  separation occurs.
 *
 * Until these contradictions are resolved, instead of calculating the fraction of
 * TRANSFERRED nitrogen in each secondary system (*MMSjmT=2*), this calculates the
 * fraction of TOTAL nitrogen (before any is lost) in each secondary system. Hence, the
 * sum of these values may be less than or equal to one.
 *
 * For some level of conceptual consistency with the symbols the guidance uses, these
 * values are named *FNjmT=2*.
 */
export const calculateFractionNitrogenInSecondarySystems = (
  swineClass: SwineSpecificClassInputTransformed,
  constants: { SWINE: SwineConstants },
): Record<SecondarySwineMMSType, Container<RealNumber>> => {
  const nitrogenInPrimarySystems = calculateFractionNitrogenInPrimarySystems(
    swineClass,
    constants,
  );

  /**
   * From 4.5.1.3 (7):
   * NTjmT=2 = (MNjmT=1 * (1 - FracGASMmT=1 - EFmT=1))
   *
   * Where:
   * MNjmT=1 = AEj * FNjmT=1 (4.5.1.3 (2))
   *
   * Here we are calculating (FNjmT=1 * (1 - FracGASMmT=1 - EFmT=1)), i.e the fraction of
   * total nitrogen produced that reaches the second stage of treatment. For some level
   * of consistency in terms of symbols, the values calculated here are named FNjmT=2.
   */

  const fractionNitrogenLeaving = (mms: PrimarySwineMMSType) => {
    const fracGASM = selectConstant(
      constants.SWINE,
      'MMS',
      mms,
      'FracGASM',
    ).named(`FracGASMm=${subscriptNotation[mms]}T=1`);

    const EFm = selectConstant(constants.SWINE, 'MMS', mms, 'EFm').named(
      `EFm=${subscriptNotation[mms]}T=1`,
    );

    return nitrogenInPrimarySystems[mms]
      .multiply(
        oneMinus(fracGASM.switchUnit((v) => realNumber(v.value))).minus(
          EFm.switchUnit((v) => realNumber(v.value)),
        ),
      )
      .named(`VSTj=${swineClass.number}m=${subscriptNotation[mms]}T=2`);
  };

  return {
    anaerobicLagoon: fractionNitrogenLeaving('digester').named(
      `FNj=${swineClass.number}m=1T=2`,
    ),
    solidStorage: fractionNitrogenLeaving('deepLitter').named(
      `FNj=${swineClass.number}m=4T=2`,
    ),
    directApplication: fractionNitrogenLeaving('anaerobicLagoon')
      .plus(fractionNitrogenLeaving('solidStorage'))
      .plus(
        fractionNitrogenLeaving('outdoorAndFreeRange').plus(
          fractionNitrogenLeaving('pitStorage'),
        ),
      ),
  };
};

/**
 * Calculate the mass of nitrogen *MNjmT=1 in each primary MMS produced by class *j*
 * (4.5.1.3 (2))
 */
const calculateNitrogenPerStage1MMSForClass = (
  swineClass: SwineSpecificClassInputTransformed,
  constants: HasCommonConstants & {
    SWINE: SwineConstants;
  },
): Record<PrimarySwineMMSType, Container<Mass<'N'>>> => {
  /**
   * MNjmT=1 = AEj * FNjmT=1
   */
  const annualNitrogenExcretion = calculateAnnualNitrogenExcretionForClass(
    swineClass,
    constants,
  );
  const fractionNitrogenPerPrimaryMMS =
    calculateFractionNitrogenInPrimarySystems(swineClass, constants);

  return {
    deepLitter: fractionNitrogenPerPrimaryMMS.deepLitter
      .multiply(annualNitrogenExcretion)
      .named(`MNj=${swineClass.number}m=8T=1`),
    outdoorAndFreeRange: fractionNitrogenPerPrimaryMMS.outdoorAndFreeRange
      .multiply(annualNitrogenExcretion)
      .named(`MNj=${swineClass.number}m=5T=1`),
    anaerobicLagoon: fractionNitrogenPerPrimaryMMS.anaerobicLagoon
      .multiply(annualNitrogenExcretion)
      .named(`MNj=${swineClass.number}m=1T=1`),
    digester: fractionNitrogenPerPrimaryMMS.digester
      .multiply(annualNitrogenExcretion)
      .named(`MNj=${swineClass.number}m=7T=1`),
    pitStorage: fractionNitrogenPerPrimaryMMS.pitStorage
      .multiply(annualNitrogenExcretion)
      .named(`MNj=${swineClass.number}m=9T=1`),
    solidStorage: fractionNitrogenPerPrimaryMMS.solidStorage
      .multiply(annualNitrogenExcretion)
      .named(`MNj=${swineClass.number}m=4T=1`),
  };
};

/**
 * Calculate the mass of nitrogen *MNjmT=2* in each secondary MMS produced by class *j*
 * (4.5.1.3 (6))
 */
const calculateNitrogenPerStage2MMSForClass = (
  swineClass: SwineSpecificClassInputTransformed,
  constants: {
    SWINE: SwineConstants;
  },
): Record<SecondarySwineMMSType, Container<Mass<'N'>>> => {
  const annualNitrogenExcretion = calculateAnnualNitrogenExcretionForClass(
    swineClass,
    constants,
  );

  const fractionsOfNitrogenPerSecondarySystem =
    calculateFractionNitrogenInSecondarySystems(swineClass, constants);

  return {
    anaerobicLagoon: annualNitrogenExcretion
      .multiply(fractionsOfNitrogenPerSecondarySystem.anaerobicLagoon)
      .named(`MNj=${swineClass.number}m=1T=2`),
    solidStorage: annualNitrogenExcretion
      .multiply(fractionsOfNitrogenPerSecondarySystem.solidStorage)
      .named(`MNj=${swineClass.number}m=4T=2`),
    directApplication: annualNitrogenExcretion
      .multiply(fractionsOfNitrogenPerSecondarySystem.directApplication)
      .named(`MNj=${swineClass.number}m=13T=2`),
  };
};

/**
 * Calculate CH4 emissions *ECH4* produced by a single swine class *j* (4.5.1.1 (1 & 2)).
 */
export const calculateManureManagementCH4ForClass = (
  swineClass: SwineSpecificClassInputTransformed,
  state: PureState,
  meanAnnualTemperature: MeanAnnualTemperature | undefined,
  constants: HasCommonConstants & {
    SWINE: SwineConstants;
    LIVESTOCK: LivestockConstants;
  },
): Container<Mass<'CH4'>> => {
  const volatileSolids = getVolatileSolidsProductionForClass(
    swineClass,
    constants,
  ).named(`VSj=${swineClass.number}`);

  const emissionsPotential = selectConstant(
    constants.SWINE,
    'EMISSIONS_POTENTIAL',
  ).named(`Bo`);

  const densityOfMethane = selectConstant(
    constants.COMMON,
    'DENSITY_OF_METHANE',
  ).named(`𝜌`);

  const fractionOfVolatileSolidsInPrimarySystems =
    calculateFractionVolatileSolidsInPrimarySystems(swineClass, constants);

  /**
   * MjmT=1 = VSj * Bo * FVSjmT=1 * MCFim * 𝜌
   */
  const methaneProductionPerPrimarySystem = PrimarySwineMMSTypes.map((mms) => {
    /**
     * NOTE - From A.1.8.1:
     *
     * a) Drylot MCF is state based - 0.02 (NT) or 0.01 (Other States) - source NIR
     * ...
     * d) Poultry and Swine pasture range and paddock should apply the drylot MCFs - source NIR
     */
    const methaneConversionFactor = (
      meanAnnualTemperature === undefined || mms === 'outdoorAndFreeRange'
        ? selectConstant(
            constants.SWINE,
            'MMS',
            mms,
            'METHANE_CONVERSION_FACTOR_BY_STATE',
            state,
          )
        : selectConstant(
            constants.LIVESTOCK,
            'MANURE_MANAGEMENT_METHANE_CONVERSION_FACTORS',
            mms,
            meanAnnualTemperature,
          )
    ).named(`MCFim=${subscriptNotation[mms]}`);

    return volatileSolids
      .multiply(emissionsPotential)
      .multiply(densityOfMethane)
      .multiply(methaneConversionFactor)
      .multiply(fractionOfVolatileSolidsInPrimarySystems[mms])
      .named(`Mj=${swineClass.number}m=${subscriptNotation[mms]}T=1`);
  });

  /**
   * Values of *FVSjmT=2*. See below.
   */
  const fractionOfVolatileSolidsInSecondarySystems =
    calculateFractionVolatileSolidsInSecondarySystems(swineClass, constants);

  /**
   * MjmT=2 = VSTj * Bo * MMSjmT=2 * MCFim * 𝜌
   *
   * NOTE: Instead we are calulating this as:
   * MjmT=2 = VSj * Bo * FVSjmT=2 * MCFim * 𝜌
   */
  const methaneProductionPerSecondarySystem = SecondarySwineMMSTypes.map(
    (mms) => {
      const methaneConversionFactor = (
        meanAnnualTemperature === undefined
          ? selectConstant(
              constants.SWINE,
              'MMS',
              mms,
              'METHANE_CONVERSION_FACTOR_BY_STATE',
              state,
            )
          : selectConstant(
              constants.LIVESTOCK,
              'MANURE_MANAGEMENT_METHANE_CONVERSION_FACTORS',
              mms,
              meanAnnualTemperature,
            )
      ).named(`MCFim=${subscriptNotation[mms]}`);

      return volatileSolids
        .multiply(emissionsPotential)
        .multiply(densityOfMethane)
        .multiply(methaneConversionFactor)
        .multiply(fractionOfVolatileSolidsInSecondarySystems[mms])
        .named(`Mj=${swineClass.number}m=${subscriptNotation[mms]}T=2`);
    },
  );

  /**
   * ECH4 = SUM[j,m,T] (Dj * MjmT * Nj) * 10^-3
   *
   * For one class only:
   * ECH4j = SUM[m,T] (Dj * MjmT * Nj) * 10^-3
   *       = Dj * Nj * SUM[m,T] (MjmT) * 10^-3
   */
  return sum([
    ...methaneProductionPerPrimarySystem,
    ...methaneProductionPerSecondarySystem,
  ])
    .multiply(swineClass.head)
    .multiply(swineClass.days)
    .named(`ECH4 (j=${swineClass.number})`);
};

/**
 * Calculate direct N2O emissions *EN2O,dir* produced by a single swine class *j*
 * (4.5.1.1 (3 & 4)).
 */
export const calculateDirectN2OEmissionsForClass = (
  swineClass: SwineSpecificClassInputTransformed,
  constants: HasCommonConstants & {
    SWINE: SwineConstants;
  },
) => {
  const CN2O = selectConstant(constants.COMMON, 'GWP_FACTORSC15');

  const nitrogenPerStage1MMS = calculateNitrogenPerStage1MMSForClass(
    swineClass,
    constants,
  );

  const n2oFromPrimarySystems = PrimarySwineMMSTypes.map((mms) => {
    const EFm = selectConstant(constants.SWINE, 'MMS', mms, 'EFm').named(
      `EFm=${subscriptNotation[mms]}T=1`,
    );

    /**
     * (MNjmT * EFjm * CN2O)
     */
    return nitrogenPerStage1MMS[mms]
      .multiply(EFm)
      .multiply(CN2O)
      .named(
        `EN2O,dir (j=${swineClass.number}, m=${subscriptNotation[mms]}, T=2)`,
      );
  });

  const nitrogenPerStage2MMS = calculateNitrogenPerStage2MMSForClass(
    swineClass,
    constants,
  );

  const n2oFromSecondarySystems =
    SecondarySwineMMSTypesWithoutDirectApplication.map((mms) => {
      const EFm = selectConstant(constants.SWINE, 'MMS', mms, 'EFm').named(
        `EFm=${subscriptNotation[mms]}T=2`,
      );
      /**
       * (MNjmT * EFjm * CN2O)
       */
      return nitrogenPerStage2MMS[mms]
        .multiply(EFm)
        .multiply(CN2O)
        .named(
          `EN2O,dir (j=${swineClass.number}, m=${subscriptNotation[mms]}, T=2)`,
        );
    });

  /**
   * EN2O,dir = SUM[j,m,T] (MNjmT * EFjm * CN2O) * 10^-3
   */
  return sum([...n2oFromPrimarySystems, ...n2oFromSecondarySystems]);
};

/**
 * Calculate atmospheric deposition N2O emissions *EN2O,ad* produced by a single swine
 * class *j*
 *
 * REVISIT: This section is labelled as 4.5.1.1 which is a duplicate.
 */
export const calculateAtmosphericDepositionN2OEmissionsForClass = (
  swineClass: SwineSpecificClassInputTransformed,
  productionSystem: GrazingProductionSystemsWithRainfall,
  constants: HasCommonConstants & {
    SWINE: SwineConstants;
    LIVESTOCK: LivestockConstants;
  },
) => {
  const nitrogenInPrimarySystems = calculateNitrogenPerStage1MMSForClass(
    swineClass,
    constants,
  );

  const nitrogenInSecondarySystems = calculateNitrogenPerStage2MMSForClass(
    swineClass,
    constants,
  );

  /**
   * MMSATMOS = SUM[j,m,T] MNjmT * FracGASMmT
   */
  const volatilisedNitrogenFromPrimarySystems = PrimarySwineMMSTypes.map(
    (mms) => {
      const nitrogenInSystem = nitrogenInPrimarySystems[mms];
      const fracGASM = selectConstant(
        constants.SWINE,
        'MMS',
        mms,
        'FracGASM',
      ).named(`FracGASMm=${subscriptNotation[mms]}T=1`);

      return nitrogenInSystem.multiply(fracGASM);
    },
  );

  /**
   * MMSATMOS = SUM[j,m,T] MNjmT * FracGASMmT
   */
  const volatilisedNitrogenFromSecondarySystems =
    SecondarySwineMMSTypesWithoutDirectApplication.map((mms) => {
      const nitrogenInSystem = nitrogenInSecondarySystems[mms];
      const fracGASM = selectConstant(
        constants.SWINE,
        'MMS',
        mms,
        'FracGASM',
      ).named(`FracGASMm=${subscriptNotation[mms]}T=2`);

      return nitrogenInSystem.multiply(fracGASM);
    });

  const totalVolatisedNitrogen = sum([
    ...volatilisedNitrogenFromPrimarySystems,
    ...volatilisedNitrogenFromSecondarySystems,
  ]).named('MMS_ATMOS');

  const CN2O = selectConstant(constants.COMMON, 'GWP_FACTORSC15').named('CN2O');

  const EFN2O = selectConstant(
    constants.LIVESTOCK,
    'EF_ATMOSPHERIC_DEPOSITION',
    productionSystem,
  ).named('EFN2O');

  /**
   * EN2O,ad = (MMSATMOS * EFN2O * CN2O) * 10^-3
   */
  return totalVolatisedNitrogen
    .multiply(CN2O)
    .multiply(EFN2O)
    .named(`E20,ad (j=${swineClass.number})`);
};

/**
 * Calculate N2O emissions from leaching and runoff *EN2O,leach* produced by a single
 * swine class *j*
 *
 * REVISIT: This section is labelled as 4.5.1.3 which is a duplicate.
 */
export const calculateLeachingAndRunoffN2OEmissionsForClass = (
  swineClass: SwineSpecificClassInputTransformed,
  isInLeachingZone: boolean,
  constants: HasCommonConstants & {
    SWINE: SwineConstants;
    CROP: CropConstants;
  },
) => {
  const fracWETSoil = (isInLeachingZone ? num(1) : num(0)).named('FracWETSoil');
  const fracLeachMS = selectConstant(
    constants.CROP,
    'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF_SOLID_STORAGE',
  ).named('FracLeachMMS');

  const nitrogenInPrimarySystems = calculateNitrogenPerStage1MMSForClass(
    swineClass,
    constants,
  );

  /**
   * MNLeachjm=5 = MNjm=5T=1 * FracWET * FracLEACHMS
   */
  const nitrogenLostOutdoors = nitrogenInPrimarySystems.outdoorAndFreeRange
    .multiply(fracWETSoil)
    .multiply(fracLeachMS)
    .named(`MNleachj=${swineClass.number}m=5`);

  const EFleach = selectConstant(
    constants.CROP,
    'EF_N2O_LEACHING_AND_RUNOFF',
  ).named(`EFleach`);

  const CN2O = selectConstant(constants.COMMON, 'GWP_FACTORSC15').named('CN2O');

  /**
   * EN2O,leach = MNLeachjm=5 * EFleach * Cg * 10^-3
   *
   * NOTE: Cg isn't defined, but the guidance uses this as a simplified version of the
   * equation:
   *
   * SUM[j,m] (MNLeachjm m=1-13 * EFleach * CN2O) * 10^-3
   *
   * So it's clear Cg = CN2O.
   */
  return nitrogenLostOutdoors
    .multiply(EFleach)
    .multiply(CN2O)
    .named(`EN2O,leach (j=${swineClass.number})`);
};

/**
 * Calculate the mass of nitrogen applied to soils *MNSoil* produced by a single swine
 * class *j*.
 *
 * REVISIT: This section is labelled as 4.5.1.5, due to other errors in the section
 * numbers this will probably change.
 */
export const calculateMassOfNitrogenAppliedToSoilsForClass = (
  swineClass: SwineSpecificClassInputTransformed,
  isInLeachingZone: boolean,
  constants: HasCommonConstants & {
    SWINE: SwineConstants;
    CROP: CropConstants;
  },
) => {
  const fracWETSoil = (isInLeachingZone ? num(1) : num(0)).named('FracWETSoil');

  const fracLeachMS = selectConstant(
    constants.CROP,
    'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF_SOLID_STORAGE',
  ).named('FracLeachMS');

  const nitrogenLostOutdoors = calculateNitrogenPerStage1MMSForClass(
    swineClass,
    constants,
  )
    .outdoorAndFreeRange.multiply(fracWETSoil)
    .multiply(fracLeachMS)
    .named(`Mleachm=4 (j=${swineClass.number})`);

  const nitrogenPerSecondarySystem = calculateNitrogenPerStage2MMSForClass(
    swineClass,
    constants,
  );

  /**
   *
   * SUM[j,m] (MNjmT=2 * (1 - EFmT=2 - FracGASMmT=2) - MNLeachjm=5)
   *
   * NOTE: It doesn't make sense that MNLeachjm=5 would be subtracted for each MMS used
   * in this sum. Expanding the list of secondary MMS options would change the result if
   * that were true. I have assumed that this was meant to be written as:
   *
   * (SUM[j,m] MNjmT=2 * (1 - EFmT=2 - FracGASMmT=2)) - MNLeachjm=5
   *
   * or alternatively,
   *
   * SUM[j,m] (MNjmT=2 * (1 - EFmT=2 - FracGASMmT=2) - MNLeachjm)
   *
   * where MNleachjm = 0 when m != 5.
   *
   * REVISIT: Take extra care revising this when the full guidance is published.
   */
  return sum(
    SecondarySwineMMSTypes.map((mms) => {
      /**
       * From the guidance:
       * > Note: where direct application occurs at treatment stage 2 (MNjm=13T=2),
       * EFjm=13T=2 and FracGASMjm=13T=2 are set to zero.
       *
       * I.e. (1 - EFm=13T=2 - FracGASMm=13T=2) = 1, so
       * MNjm=13T=2 * (1 - EFm=13T=2 - FracGASMm=13T=2) can just be simplified to
       * MNjm=13T=2.
       */
      if (mms === 'directApplication') return nitrogenPerSecondarySystem[mms];

      const EFm = selectConstant(constants.SWINE, 'MMS', mms, 'EFm').named(
        `EFm=${subscriptNotation[mms]}T=2`,
      );

      const fracGASM = selectConstant(
        constants.SWINE,
        'MMS',
        mms,
        'FracGASM',
      ).named(`FracGASMm=${subscriptNotation[mms]}T=2`);

      /**
       * MNjmT=2 * (1 - EFmT=2 - FracGASMmT=2)
       *
       * On the need for the unit switch: My understanding (take it with a grain of salt)
       * is that EFm and FracGASMm can be thought of as fractions of the nitrogen that
       * reacts and becomes other substances. Here, we're multiplying the total nitrogen
       * by the fraction of what remains as nitrogren.
       */
      return nitrogenPerSecondarySystem[mms].multiply(
        oneMinus(EFm.switchUnit((v) => realNumber(v.value))).minus(
          fracGASM.switchUnit((v) => realNumber(v.value)),
        ),
      );
    }),
  )
    .minus(nitrogenLostOutdoors)
    .named(`MNSoil (j=${swineClass.number})`);
};
