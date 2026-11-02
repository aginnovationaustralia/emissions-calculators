import {
  PigsClassLivestockInputTransformed,
  PigsClassSharedInputTransformed,
} from '@/calculators/Pigs/types/pigs-class.input';
import {
  GrazingProductionSystemsWithRainfall,
  MeanAnnualTemperature,
  PrimaryPigsMMSType,
  PrimaryPigsMMSTypes,
  PrimaryPigsMMSTypesWithoutPasture,
  PrimaryPigsMMSWithSolidSeparationType,
  PrimaryPigsMMSWithSolidSeparationTypes,
  SecondaryPigsMMSType,
  SecondaryPigsMMSTypes,
  SecondaryPigsMMSTypesWithoutDirectApplication,
  State,
} from '@/constants/enums';
import { isInLeachingZoneToFracWET } from '@/constants/translations';
import { HasConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { Container } from '@/tools/containers';
import { ifTrueElse } from '@/tools/if-else';
import { captureMethod1Or2Value } from '@/tools/multi';
import {
  oneMinus,
  zero,
  zeroMassPerHeadPerDayCH4,
  zeroMassVolatilisedN,
  zeroN,
  zeroN2O,
} from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { Mass, realNumber, RealNumber, voidUnit } from '@/tools/units';

const subscriptNotation: Record<
  PrimaryPigsMMSType | SecondaryPigsMMSType,
  string
> = {
  anaerobicLagoon: '1',
  // Drylot used as pasture equivalent.
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
  pigsClass: PigsClassLivestockInputTransformed,
  constants: HasConstants<'PIGS'>,
) => {
  return captureMethod1Or2Value(
    selectConstant(
      constants.PIGS,
      'PIGS_CLASS_FACTORS',
      pigsClass.name,
      'VOLATILE_SOLIDS',
    ),
    pigsClass.method2VolatileSolidProductionRate,
  ).named(`VSj=${pigsClass.number}`);
};

/**
 * Convenience wrapper for nitrogen waste production (*NWj*)
 */
const getNitrogenWasteProductionForClass = (
  pigsClass: PigsClassSharedInputTransformed,
  constants: HasConstants<'PIGS'>,
) => {
  return captureMethod1Or2Value(
    selectConstant(
      constants.PIGS,
      'PIGS_CLASS_FACTORS',
      pigsClass.name,
      'NITROGEN_IN_WASTE',
    ),
    pigsClass.method2NitrogenWasteProductionRate,
  ).named(`NWj=${pigsClass.number}`);
};

/**
 * Convenience wrapper for solid separation rate (*SSj*)
 */
const getSolidSeparationRate = (
  pigsClass: PigsClassLivestockInputTransformed,
  mms: PrimaryPigsMMSWithSolidSeparationType,
  constants: HasConstants<'PIGS'>,
) => {
  const manureAllocation = pigsClass.manureAllocations[mms];
  if (manureAllocation.solidSeparationInputMethod === '2') {
    return captureMethod1Or2Value(
      voidUnit(),
      manureAllocation.fractionSolidsSeparatedPreTreatment,
    );
  }

  const defaultSSMethod1 = ifTrueElse(
    manureAllocation.solidsSeparatedPreTreatment,
    selectConstant(constants.PIGS, 'DEFAULT_FRACTION_SOLIDS_SEPARATED'),
    zero,
  ).named(`SSm`);

  return captureMethod1Or2Value(defaultSSMethod1, undefined).named(`SSm`);
};

/**
 * Convenience wrapper for nitrogen separation rate (*SNj*)
 */
const getNitrogenSeparationRate = (
  pigsClass: PigsClassSharedInputTransformed,
  mms: PrimaryPigsMMSWithSolidSeparationType,
  constants: HasConstants<'PIGS'>,
) => {
  const manureAllocation = pigsClass.manureAllocations[mms];
  const defaultSeparatedRate = selectConstant(
    constants.PIGS,
    'DEFAULT_FRACTION_NITROGEN_SEPARATED',
  ).named(`SNm`);

  // Method-1 and method-2 fields live on different arms of the xor input union,
  // so narrow first and supply a method-1 baseline on both paths for dual capture.
  // Note that solidsSeparatedPreTreatment is a user input key needed for method 1, so the method 1
  // shown to compare to a method 2 result is only partially complete
  if (manureAllocation.solidSeparationInputMethod === '2') {
    return captureMethod1Or2Value(
      defaultSeparatedRate,
      manureAllocation.fractionNitrogenSeparatedPreTreatment,
    );
  }

  const method1Rate = ifTrueElse(
    manureAllocation.solidsSeparatedPreTreatment,
    defaultSeparatedRate,
    zero,
  ).named(`SNm`);

  return captureMethod1Or2Value(method1Rate, undefined);
};

/**
 * Calculate annual nitrogen excretion *AEj* for a class *j* (4.5.1.3 (5))
 */
const calculateAnnualNitrogenExcretionForClass = (
  pigsClass: PigsClassSharedInputTransformed,
  constants: HasConstants<'PIGS'>,
) =>
  getNitrogenWasteProductionForClass(pigsClass, constants)
    .multiply(pigsClass.head)
    .multiply(pigsClass.days)
    .named(`AEj=${pigsClass.number}`);

/**
 * Calculate fraction of volatile solids *FVSjmT=1* produced by class *j* in each primary
 * MMS (4.5.1.1 (3 & 4))
 */
const calculateFractionVolatileSolidsInPrimarySystems = (
  pigsClass: PigsClassLivestockInputTransformed,
  constants: HasConstants<'PIGS'>,
): Record<PrimaryPigsMMSType, Container<RealNumber>> => {
  const solidSeparationRates = {
    anaerobicLagoon: getSolidSeparationRate(
      pigsClass,
      'anaerobicLagoon',
      constants,
    ),
    digester: getSolidSeparationRate(pigsClass, 'digester', constants),
    pitStorage: getSolidSeparationRate(pigsClass, 'pitStorage', constants),
  };

  /**
   * From (4.5.1.1 (4)): FVSjm=4T=1 = MMSjm=4T=1 + (MMSjm=1,7,9T=1 * SSm)
   *
   * NOTE: Solid separation only applies to liquid systems.
   */
  const solidsInSolidStorage = sum(
    PrimaryPigsMMSWithSolidSeparationTypes.map((mms) =>
      pigsClass.manureAllocations[mms].manureAllocated.multiply(
        solidSeparationRates[mms],
      ),
    ),
    zero,
  )
    .plus(pigsClass.manureAllocations.solidStorage.manureAllocated)
    .named(`FVSj=${pigsClass.number}m=4T=1`);

  /**
   * From (4.5.1.1 (3)): FVSjmT=1 = MMSjmT=1 * (1 - SSm)
   */
  return {
    deepLitter: pigsClass.manureAllocations.deepLitter.manureAllocated.named(
      `FVSj=${pigsClass.number}m=8T=1`,
    ),
    outdoorAndFreeRange: pigsClass.manureAllocations.outdoorAndFreeRange.named(
      `FVSj=${pigsClass.number}m=5T=1`,
    ),
    anaerobicLagoon: pigsClass.manureAllocations.anaerobicLagoon.manureAllocated
      .multiply(oneMinus(solidSeparationRates.anaerobicLagoon))
      .named(`FVSj=${pigsClass.number}m=1T=1`),
    digester: pigsClass.manureAllocations.digester.manureAllocated
      .multiply(oneMinus(solidSeparationRates.digester))
      .named(`FVSj=${pigsClass.number}m=7T=1`),
    pitStorage: pigsClass.manureAllocations.pitStorage.manureAllocated
      .multiply(oneMinus(solidSeparationRates.pitStorage))
      .named(`FVSj=${pigsClass.number}m=9T=1`),
    solidStorage: solidsInSolidStorage,
  };
};

/**
 * Calculate the fraction of TOTAL volatile solids produced by a pigs class j sent to
 * each secondary MMS *FVSjmT=2*.
 */
export const calculateFractionVolatileSolidsInSecondarySystems = (
  pigsClass: PigsClassLivestockInputTransformed,
  constants: HasConstants<'PIGS'>,
): Record<SecondaryPigsMMSType, Container<RealNumber>> => {
  const fractionVolatileSolidsInPrimarySystems =
    calculateFractionVolatileSolidsInPrimarySystems(pigsClass, constants);

  /**
   * From 4.5.1.1 (6):
   * VSTijmT=2 = VSj * FVSjmT=1 * (1 - VSLmT=1)
   *
   * This only calculates FVSjmT=1 * (1 - VSLmT=1), i.e. the fraction of total volatile
   * solids that end up in secondary treatment. For some level of consistency in terms
   * of symbols, the values calculated here are named FVSjmT=2.
   *
   */
  const fracSolidsLeaving = (mms: PrimaryPigsMMSType) => {
    const fractionLost = selectConstant(
      constants.PIGS,
      'MMS',
      mms,
      'VOLATILE_SOLIDS_LOST',
    ).named(`VSLm=${subscriptNotation[mms]}`);

    return fractionVolatileSolidsInPrimarySystems[mms]
      .multiply(oneMinus(fractionLost))
      .named(`VSTj=${pigsClass.number}m=${subscriptNotation[mms]}T=2`);
  };

  const fractionSolidsLeavingPrimarySystems = {
    anaerobicLagoon: fracSolidsLeaving('anaerobicLagoon'),
    digester: fracSolidsLeaving('digester'),
    pitStorage: fracSolidsLeaving('pitStorage'),
    solidStorage: fracSolidsLeaving('solidStorage'),
    deepLitter: fracSolidsLeaving('deepLitter'),
  };

  const fractionSolidsEnteringSecondarySystem = (
    secondaryMMS: SecondaryPigsMMSType,
  ) =>
    sum(
      PrimaryPigsMMSTypesWithoutPasture.map((primaryMMS) => {
        const fracLeaving = fractionSolidsLeavingPrimarySystems[primaryMMS];

        /**
         * Manure can't be allocated from one system in stage 1 to the same system in
         * stage 2 - movement from one facility to another of the same type is regarded
         * as part of one stage of treatment.
         *
         * This does mean we have to perform a lot of checks here to keep typescript happy
         */
        switch (primaryMMS) {
          // Deep litter is a stage 1 MMS only.
          case 'deepLitter':
            return fracLeaving.multiply(
              pigsClass.manureAllocations[primaryMMS]
                .treatmentStage2Allocations[secondaryMMS],
            );
          case 'anaerobicLagoon':
            return secondaryMMS === 'anaerobicLagoon'
              ? zero
              : fracLeaving.multiply(
                  pigsClass.manureAllocations[primaryMMS]
                    .treatmentStage2Allocations[secondaryMMS],
                );
          case 'solidStorage':
            return secondaryMMS === 'solidStorage'
              ? zero
              : fracLeaving.multiply(
                  pigsClass.manureAllocations[primaryMMS]
                    .treatmentStage2Allocations[secondaryMMS],
                );
          case 'digester':
            return secondaryMMS === 'digester'
              ? zero
              : fracLeaving.multiply(
                  pigsClass.manureAllocations[primaryMMS]
                    .treatmentStage2Allocations[secondaryMMS],
                );
          case 'pitStorage':
            return secondaryMMS === 'pitStorage'
              ? zero
              : fracLeaving.multiply(
                  pigsClass.manureAllocations[primaryMMS]
                    .treatmentStage2Allocations[secondaryMMS],
                );
        }
      }),
      zero,
    ).named(`MMSj=${pigsClass.number}m=${subscriptNotation[secondaryMMS]}T=2`);

  return {
    anaerobicLagoon: fractionSolidsEnteringSecondarySystem('anaerobicLagoon'),
    solidStorage: fractionSolidsEnteringSecondarySystem('solidStorage'),
    digester: fractionSolidsEnteringSecondarySystem('digester'),
    pitStorage: fractionSolidsEnteringSecondarySystem('pitStorage'),
    directApplication:
      fractionSolidsEnteringSecondarySystem('directApplication'),
  };
};

/**
 * Calculate fraction of nitrogen *FNjmT=1* produced by class *j* in each primary MMS
 * (4.5.1.3 (3))
 */
const calculateFractionNitrogenInPrimarySystems = (
  pigsClass: PigsClassSharedInputTransformed,
  constants: HasConstants<'PIGS'>,
): Record<PrimaryPigsMMSType, Container<RealNumber>> => {
  const nitrogenSeparationRates = {
    anaerobicLagoon: getNitrogenSeparationRate(
      pigsClass,
      'anaerobicLagoon',
      constants,
    ),
    digester: getNitrogenSeparationRate(pigsClass, 'digester', constants),
    pitStorage: getNitrogenSeparationRate(pigsClass, 'pitStorage', constants),
  };
  /**
   * FNjm=4T=1 = MMSjm=4T=1 + (MMSjm=1,7,9 T=1 * SNm)
   *
   */
  const nitrogenInSolidStorage = sum(
    PrimaryPigsMMSWithSolidSeparationTypes.map((mms) =>
      pigsClass.manureAllocations[mms].manureAllocated.multiply(
        nitrogenSeparationRates[mms],
      ),
    ),
    zero,
  )
    .plus(pigsClass.manureAllocations.solidStorage.manureAllocated)
    .named(`FNj=${pigsClass.number}m=4T=1`);

  /**
   * FNjmT=1 = MMSjm T=1 * (1 - SNm)
   *
   * NOTE: Solid separation does not occur in deep litter/outdoor systems, i.e. SNm = 0.
   */
  return {
    deepLitter: pigsClass.manureAllocations.deepLitter.manureAllocated.named(
      `FNj=${pigsClass.number}m=8T=1`,
    ),
    outdoorAndFreeRange: pigsClass.manureAllocations.outdoorAndFreeRange.named(
      `FNj=${pigsClass.number}m=5T=1`,
    ),
    anaerobicLagoon: pigsClass.manureAllocations.anaerobicLagoon.manureAllocated
      .multiply(oneMinus(nitrogenSeparationRates.anaerobicLagoon))
      .named(`FNj=${pigsClass.number}m=1T=1`),
    digester: pigsClass.manureAllocations.digester.manureAllocated
      .multiply(oneMinus(nitrogenSeparationRates.digester))
      .named(`FNj=${pigsClass.number}m=7T=1`),
    pitStorage: pigsClass.manureAllocations.pitStorage.manureAllocated
      .multiply(oneMinus(nitrogenSeparationRates.pitStorage))
      .named(`FNj=${pigsClass.number}m=9T=1`),
    solidStorage: nitrogenInSolidStorage,
  };
};

/**
 * Calculate the mass of nitrogen *MNjmT=1 in each primary MMS produced by class *j*
 * (4.5.1.3 (2))
 */
const calculateNitrogenPerStage1MMSForClass = (
  pigsClass: PigsClassSharedInputTransformed,
  constants: HasConstants<'PIGS'>,
): Record<PrimaryPigsMMSType, Container<Mass<'N'>>> => {
  /**
   * MNjmT=1 = AEj * FNjmT=1
   */
  const annualNitrogenExcretion = calculateAnnualNitrogenExcretionForClass(
    pigsClass,
    constants,
  );
  const fractionNitrogenPerPrimaryMMS =
    calculateFractionNitrogenInPrimarySystems(pigsClass, constants);

  return {
    deepLitter: fractionNitrogenPerPrimaryMMS.deepLitter
      .multiply(annualNitrogenExcretion)
      .named(`MNj=${pigsClass.number}m=8T=1`),
    outdoorAndFreeRange: fractionNitrogenPerPrimaryMMS.outdoorAndFreeRange
      .multiply(annualNitrogenExcretion)
      .named(`MNj=${pigsClass.number}m=5T=1`),
    anaerobicLagoon: fractionNitrogenPerPrimaryMMS.anaerobicLagoon
      .multiply(annualNitrogenExcretion)
      .named(`MNj=${pigsClass.number}m=1T=1`),
    digester: fractionNitrogenPerPrimaryMMS.digester
      .multiply(annualNitrogenExcretion)
      .named(`MNj=${pigsClass.number}m=7T=1`),
    pitStorage: fractionNitrogenPerPrimaryMMS.pitStorage
      .multiply(annualNitrogenExcretion)
      .named(`MNj=${pigsClass.number}m=9T=1`),
    solidStorage: fractionNitrogenPerPrimaryMMS.solidStorage
      .multiply(annualNitrogenExcretion)
      .named(`MNj=${pigsClass.number}m=4T=1`),
  };
};

/**
 * Calculate the mass of nitrogen *MNjmT=2* in each secondary MMS produced by class *j*
 * (4.5.1.3 (6))
 */
const calculateNitrogenPerStage2MMSForClass = (
  pigsClass: PigsClassSharedInputTransformed,
  constants: HasConstants<'PIGS'>,
): Record<SecondaryPigsMMSType, Container<Mass<'N'>>> => {
  const nitrogenInPrimarySystems = calculateNitrogenPerStage1MMSForClass(
    pigsClass,
    constants,
  );

  const fractionNitrogenLeaving = (mms: PrimaryPigsMMSType) => {
    const fracGASM = selectConstant(
      constants.PIGS,
      'MMS',
      mms,
      'FracGASM',
    ).named(`FracGASMm=${subscriptNotation[mms]}T=1`);

    const EFm = selectConstant(constants.PIGS, 'MMS', mms, 'EFm').named(
      `EFm=${subscriptNotation[mms]}T=1`,
    );

    return nitrogenInPrimarySystems[mms]
      .multiply(
        oneMinus(fracGASM.switchUnit((v) => realNumber(v.store))).minus(
          EFm.switchUnit((v) => realNumber(v.store)),
        ),
      )
      .named(`NTj=${pigsClass.number}m=${subscriptNotation[mms]}T=2`);
  };

  const nitrogenExitingPrimarySystems = {
    anaerobicLagoon: fractionNitrogenLeaving('anaerobicLagoon'),
    digester: fractionNitrogenLeaving('digester'),
    pitStorage: fractionNitrogenLeaving('pitStorage'),
    solidStorage: fractionNitrogenLeaving('solidStorage'),
    deepLitter: fractionNitrogenLeaving('deepLitter'),
  };

  const nitrogenEnteringSecondarySystem = (
    secondaryMMS: SecondaryPigsMMSType,
  ) =>
    sum(
      PrimaryPigsMMSTypesWithoutPasture.map((primaryMMS) => {
        const nitrogenLeaving = nitrogenExitingPrimarySystems[primaryMMS];

        /**
         * Manure can't be allocated from one system in stage 1 to the same system in
         * stage 2 - movement from one facility to another of the same type is regarded
         * as part of one stage of treatment.
         *
         * This does mean we have to perform a lot of checks here to keep typescript happy
         */
        switch (primaryMMS) {
          // Deep litter is a stage 1 MMS only.
          case 'deepLitter':
            return nitrogenLeaving.multiply(
              pigsClass.manureAllocations[primaryMMS]
                .treatmentStage2Allocations[secondaryMMS],
            );
          case 'anaerobicLagoon':
            return secondaryMMS === 'anaerobicLagoon'
              ? zeroN
              : nitrogenLeaving.multiply(
                  pigsClass.manureAllocations[primaryMMS]
                    .treatmentStage2Allocations[secondaryMMS],
                );
          case 'solidStorage':
            return secondaryMMS === 'solidStorage'
              ? zeroN
              : nitrogenLeaving.multiply(
                  pigsClass.manureAllocations[primaryMMS]
                    .treatmentStage2Allocations[secondaryMMS],
                );
          case 'digester':
            return secondaryMMS === 'digester'
              ? zeroN
              : nitrogenLeaving.multiply(
                  pigsClass.manureAllocations[primaryMMS]
                    .treatmentStage2Allocations[secondaryMMS],
                );
          case 'pitStorage':
            return secondaryMMS === 'pitStorage'
              ? zeroN
              : nitrogenLeaving.multiply(
                  pigsClass.manureAllocations[primaryMMS]
                    .treatmentStage2Allocations[secondaryMMS],
                );
        }
      }),
      zeroN,
    );

  return {
    anaerobicLagoon: nitrogenEnteringSecondarySystem('anaerobicLagoon').named(
      `MNj=${pigsClass.number}m=1T=2`,
    ),
    solidStorage: nitrogenEnteringSecondarySystem('solidStorage').named(
      `MNj=${pigsClass.number}m=4T=2`,
    ),
    digester: nitrogenEnteringSecondarySystem('digester').named(
      `MNj=${pigsClass.number}m=7T=2`,
    ),
    pitStorage: nitrogenEnteringSecondarySystem('pitStorage').named(
      `MNj=${pigsClass.number}m=9T=2`,
    ),
    directApplication: nitrogenEnteringSecondarySystem(
      'directApplication',
    ).named(`MNj=${pigsClass.number}m=13T=2`),
  };
};

/**
 * Calculate CH4 emissions *ECH4* produced by a single pigs class *j* (4.5.1.1 (1 & 2)).
 */
export const calculateManureManagementCH4ForClass = (
  pigsClass: PigsClassLivestockInputTransformed,
  state: Container<State>,
  meanAnnualTemperature: Container<MeanAnnualTemperature> | undefined,
  constants: HasConstants<'PIGS' | 'LIVESTOCK' | 'COMMON'>,
): Container<Mass<'CH4'>> => {
  const volatileSolids = getVolatileSolidsProductionForClass(
    pigsClass,
    constants,
  ).named(`VSj=${pigsClass.number}`);

  const emissionsPotential = selectConstant(
    constants.LIVESTOCK,
    'EMISSIONS_POTENTIAL_VOLATILE_SOLIDS_TO_CH4',
    'pigs',
  ).named(`B0`);

  const densityOfMethane = selectConstant(
    constants.COMMON,
    'DENSITY_OF_METHANE',
  ).named(`𝜌`);

  const fractionOfVolatileSolidsInPrimarySystems =
    calculateFractionVolatileSolidsInPrimarySystems(pigsClass, constants);

  /**
   * MjmT=1 = VSj * Bo * FVSjmT=1 * MCFim * 𝜌
   */
  const methaneProductionPerPrimarySystem = PrimaryPigsMMSTypes.map((mms) => {
    /**
     * NOTE - From A.1.8.1:
     *
     * a) Drylot MCF is state based - 0.02 (NT) or 0.01 (Other States) - source NIR
     * ...
     * d) Poultry and Pigs pasture range and paddock should apply the drylot MCFs - source NIR
     */

    const defaultMCF = selectConstant(
      constants.PIGS,
      'MMS',
      mms,
      'METHANE_CONVERSION_FACTOR_BY_STATE',
      state,
    );

    const customMCF =
      meanAnnualTemperature && mms !== 'outdoorAndFreeRange'
        ? selectConstant(
            constants.LIVESTOCK,
            'MANURE_MANAGEMENT_METHANE_CONVERSION_FACTORS',
            mms,
            meanAnnualTemperature,
          )
        : undefined;

    const methaneConversionFactor = captureMethod1Or2Value(
      defaultMCF,
      customMCF,
    ).named(`MCFim=${subscriptNotation[mms]}`);

    return volatileSolids
      .multiply(emissionsPotential)
      .multiply(densityOfMethane)
      .multiply(methaneConversionFactor)
      .multiply(fractionOfVolatileSolidsInPrimarySystems[mms])
      .named(`Mj=${pigsClass.number}m=${subscriptNotation[mms]}T=1`);
  });

  /**
   * Values of *FVSjmT=2*. See below.
   */
  const fractionOfVolatileSolidsInSecondarySystems =
    calculateFractionVolatileSolidsInSecondarySystems(pigsClass, constants);

  /**
   * MjmT=2 = VSTj * Bo * MMSjmT=2 * MCFim * 𝜌
   *
   * NOTE: Instead we are calulating this as:
   * MjmT=2 = VSj * Bo * FVSjmT=2 * MCFim * 𝜌
   */
  const methaneProductionPerSecondarySystem = SecondaryPigsMMSTypes.map(
    (mms) => {
      const methaneConversionFactor = (
        meanAnnualTemperature === undefined
          ? selectConstant(
              constants.PIGS,
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
        .named(`Mj=${pigsClass.number}m=${subscriptNotation[mms]}T=2`);
    },
  );

  /**
   * ECH4 = SUM[j,m,T] (Dj * MjmT * Nj) * 10^-3
   *
   * For one class only:
   * ECH4j = SUM[m,T] (Dj * MjmT * Nj) * 10^-3
   *       = Dj * Nj * SUM[m,T] (MjmT) * 10^-3
   */
  return sum(
    [
      ...methaneProductionPerPrimarySystem,
      ...methaneProductionPerSecondarySystem,
    ],
    zeroMassPerHeadPerDayCH4,
  )
    .multiply(pigsClass.head)
    .multiply(pigsClass.days)
    .named(`ECH4 (j=${pigsClass.number})`)
    .reference('4.5.1.1 (1)');
};

/**
 * Calculate direct N2O emissions *EN2O,dir* produced by a single pigs class *j*
 * (4.5.1.1 (3 & 4)).
 */
export const calculateDirectN2OEmissionsForClass = (
  pigsClass: PigsClassSharedInputTransformed,
  constants: HasConstants<'PIGS' | 'COMMON'>,
) => {
  const CN2O = selectConstant(constants.COMMON, 'ELEMENTAL_TO_MOLECULAR_N2O');

  const nitrogenPerStage1MMS = calculateNitrogenPerStage1MMSForClass(
    pigsClass,
    constants,
  );

  const n2oFromPrimarySystems = PrimaryPigsMMSTypes.map((mms) => {
    const EFm = selectConstant(constants.PIGS, 'MMS', mms, 'EFm').named(
      `EFm=${subscriptNotation[mms]}T=1`,
    );

    /**
     * (MNjmT * EFjm * CN2O)
     */
    return nitrogenPerStage1MMS[mms]
      .multiply(EFm)
      .multiply(CN2O)
      .named(
        `EN2O,dir (j=${pigsClass.number}, m=${subscriptNotation[mms]}, T=1)`,
      );
  });

  const nitrogenPerStage2MMS = calculateNitrogenPerStage2MMSForClass(
    pigsClass,
    constants,
  );

  const n2oFromSecondarySystems =
    SecondaryPigsMMSTypesWithoutDirectApplication.map((mms) => {
      const EFm = selectConstant(constants.PIGS, 'MMS', mms, 'EFm').named(
        `EFm=${subscriptNotation[mms]}T=2`,
      );
      /**
       * (MNjmT * EFjm * CN2O)
       */
      return nitrogenPerStage2MMS[mms]
        .multiply(EFm)
        .multiply(CN2O)
        .named(
          `EN2O,dir (j=${pigsClass.number}, m=${subscriptNotation[mms]}, T=2)`,
        );
    });

  /**
   * EN2O,dir = SUM[j,m,T] (MNjmT * EFjm * CN2O) * 10^-3
   */
  return sum(
    [...n2oFromPrimarySystems, ...n2oFromSecondarySystems],
    zeroN2O,
  ).reference('4.5.1.3 (1)');
};

/**
 * Calculate atmospheric deposition N2O emissions *EN2O,ad* produced by a single pigs
 * class *j*
 *
 * TODO: This section is labelled as 4.5.1.1 which is a duplicate.
 * Status: waiting for final draft
 */
export const calculateAtmosphericDepositionN2OEmissionsForClass = (
  pigsClass: PigsClassSharedInputTransformed,
  grazingSystem: Container<GrazingProductionSystemsWithRainfall>,
  constants: HasConstants<'PIGS' | 'LIVESTOCK' | 'COMMON' | 'CROP'>,
) => {
  const nitrogenInPrimarySystems = calculateNitrogenPerStage1MMSForClass(
    pigsClass,
    constants,
  );

  const nitrogenInSecondarySystems = calculateNitrogenPerStage2MMSForClass(
    pigsClass,
    constants,
  );

  /**
   * MMSATMOS = SUM[j,m,T] MNjmT * FracGASMmT
   */
  const volatilisedNitrogenFromPrimarySystems = PrimaryPigsMMSTypes.map(
    (mms) => {
      const nitrogenInSystem = nitrogenInPrimarySystems[mms];
      const fracGASM = selectConstant(
        constants.PIGS,
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
    SecondaryPigsMMSTypesWithoutDirectApplication.map((mms) => {
      const nitrogenInSystem = nitrogenInSecondarySystems[mms];
      const fracGASM = selectConstant(
        constants.PIGS,
        'MMS',
        mms,
        'FracGASM',
      ).named(`FracGASMm=${subscriptNotation[mms]}T=2`);

      return nitrogenInSystem.multiply(fracGASM);
    });

  const totalVolatisedNitrogen = sum(
    [
      ...volatilisedNitrogenFromPrimarySystems,
      ...volatilisedNitrogenFromSecondarySystems,
    ],
    zeroMassVolatilisedN,
  ).named('MMS_ATMOS');

  const CN2O = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_N2O',
  ).named('CN2O');

  const EFN2O = selectConstant(
    constants.CROP,
    'EF_N2O_ATMOSPHERIC_DEPOSITION_PRODUCTION_SYSTEM',
    grazingSystem,
  ).named('EFN2O');

  /**
   * EN2O,ad = (MMSATMOS * EFN2O * CN2O) * 10^-3
   */
  return totalVolatisedNitrogen
    .multiply(EFN2O)
    .multiply(CN2O)
    .named(`E20,ad (j=${pigsClass.number})`);
};

/**
 * Calculate N2O emissions from leaching and runoff *EN2O,leach* produced by a single
 * pigs class *j*
 *
 * TODO: This section is labelled as 4.5.1.3 which is a duplicate.
 * Status: waiting for final draft
 */
export const calculateLeachingAndRunoffN2OEmissionsForClass = (
  pigsClass: PigsClassSharedInputTransformed,
  isInLeachingZone: Container<boolean>,
  constants: HasConstants<'PIGS' | 'COMMON' | 'CROP'>,
) => {
  const fracWETSoil = isInLeachingZoneToFracWET(isInLeachingZone);
  const fracLeachMS = selectConstant(
    constants.CROP,
    'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF_SOLID_STORAGE',
  ).named('FracLeachMMS');

  const nitrogenInPrimarySystems = calculateNitrogenPerStage1MMSForClass(
    pigsClass,
    constants,
  );

  /**
   * MNLeachjm=5 = MNjm=5T=1 * FracWET * FracLEACHMS
   */
  const nitrogenLostOutdoors = nitrogenInPrimarySystems.outdoorAndFreeRange
    .multiply(fracWETSoil)
    .multiply(fracLeachMS)
    .named(`MNleachj=${pigsClass.number}m=5`);

  const EFleach = selectConstant(
    constants.CROP,
    'EF_N2O_LEACHING_AND_RUNOFF',
  ).named(`EFleach`);

  const CN2O = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_N2O',
  ).named('CN2O');

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
    .named(`EN2O,leach (j=${pigsClass.number})`);
};

/**
 * Calculate the mass of nitrogen applied to soils *MNSoil* produced by a single pigs
 * class *j*.
 *
 * TODO: This section is labelled as 4.5.1.5, due to other errors in the section
 * numbers this will probably change.
 * Status: waiting for final draft
 */
export const calculateMassOfNitrogenAppliedToSoilsForClass = (
  pigsClass: PigsClassSharedInputTransformed,
  isInLeachingZone: Container<boolean>,
  constants: HasConstants<'PIGS' | 'COMMON' | 'CROP'>,
) => {
  const fracWETSoil = isInLeachingZoneToFracWET(isInLeachingZone);

  const fracLeachMS = selectConstant(
    constants.CROP,
    'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF_SOLID_STORAGE',
  ).named('FracLeachMS');

  const nitrogenLostOutdoors = calculateNitrogenPerStage1MMSForClass(
    pigsClass,
    constants,
  )
    .outdoorAndFreeRange.multiply(fracWETSoil)
    .multiply(fracLeachMS)
    .named(`Mleachm=4 (j=${pigsClass.number})`);

  const nitrogenPerSecondarySystem = calculateNitrogenPerStage2MMSForClass(
    pigsClass,
    constants,
  );

  /**
   *
   * SUM[j,m] (MNjmT=2 * (1 - EFmT=2 - FracGASMmT=2) - MNLeachjm)
   *
   * NOTE: MNLeachjm = 0 for everything that isn't a drylot system.
   */
  return sum(
    SecondaryPigsMMSTypes.map((mms) => {
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

      const EFm = selectConstant(constants.PIGS, 'MMS', mms, 'EFm').named(
        `EFm=${subscriptNotation[mms]}T=2`,
      );

      const fracGASM = selectConstant(
        constants.PIGS,
        'MMS',
        mms,
        'FracGASM',
      ).named(`FracGASMm=${subscriptNotation[mms]}T=2`);

      /**
       * MNjmT=2 * (1 - EFmT=2 - FracGASMmT=2)
       */
      return nitrogenPerSecondarySystem[mms].multiply(
        oneMinus(EFm.switchUnit((v) => realNumber(v.store))).minus(
          fracGASM.switchUnit((v) => realNumber(v.store)),
        ),
      );
    }),
    zeroN,
  )
    .minus(nitrogenLostOutdoors)
    .named(`MNSoil (j=${pigsClass.number})`);
};
