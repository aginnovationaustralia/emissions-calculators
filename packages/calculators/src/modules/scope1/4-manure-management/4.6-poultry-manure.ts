import { BaseGrainsCropTransformed } from '@/calculators/Grains/types/base-crop.input';
import {
  MeanAnnualTemperature,
  PoultryMMS1Type,
  PoultryMMS1Types,
  PoultryMMS1TypesWithPasture,
  PoultryMMS1TypeWithPasture,
  PoultryMMS2Type,
  PoultryMMS2Types,
  PoultryMMS2TypesWithPasture,
  PoultryMMS2TypeWithPasture,
} from '@/constants/enums';
import { selectConstant } from '@/tools/constants';
import { Container, num, root, RootContainer } from '@/tools/containers';
import { oneMinus } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import {
  mass,
  Mass,
  MassPerHeadPerDay,
  massPerMass,
  RealNumber,
} from '@/tools/units';
import {
  PoultryManureClassInputTransformed,
  PoultryManureInputTransformed,
} from './poultry-manure.input';
import {
  CropConstants,
  HasCommonConstants,
  LivestockConstants,
  PoultryConstants,
} from '@/constants/types';
import { ExecutionContext } from '@/calculators/executionContext';

const subscriptNotation: Record<
  PoultryMMS1TypeWithPasture | PoultryMMS2TypeWithPasture,
  string
> = {
  manureWithLitter: '10',
  beltManureRemoval: '11a',
  manureStoredInHouse: '11b',
  pastureRangeAndPaddock: '14',
  solidStorage: '4',
  composting: '6',
  digester: '7',
  directProcessing: '12',
  directApplication: '13',
};

/**
 * Convenience wrapper for getting dry matter intake *Ij* for a class *j*
 */
const getDryMatterIntake = (
  poultryClass: PoultryManureClassInputTransformed,
  constants: PoultryConstants,
) =>
  poultryClass.method2DryMatterIntake ??
  selectConstant(
    constants,
    'CLASSES',
    poultryClass.className,
    'dryMatterIntake',
  ).named(`Ij=${poultryClass.classNumber}`);

/**
 * Convenience wrapper for getting nitrogen retention rate *NRj* for a class *j*
 */
const getNitrogenRetentionRate = (
  poultryClass: PoultryManureClassInputTransformed,
  constants: PoultryConstants,
) =>
  poultryClass.method2NitrogenRetentionRate ??
  selectConstant(
    constants,
    'CLASSES',
    poultryClass.className,
    'nitrogenRetentionRate',
  ).named(`NRj=${poultryClass.classNumber}`);

/**
 * Convenience wrapper for getting crude protein *CPj* for a class *j*
 */
const getCrudeProtein = (
  poultryClass: PoultryManureClassInputTransformed,
  constants: PoultryConstants,
) =>
  poultryClass.method2CrudeProtein ??
  selectConstant(
    constants,
    'CLASSES',
    poultryClass.className,
    'crudeProtein',
  ).named(`CPj=${poultryClass.classNumber}`);

/**
 * Calculate volatile solid production rate *VSj* for a given class *j* (as per
 * 4.6.1.1 (5)).
 */
const calculateVolatileSolidProduction = (
  poultryClass: PoultryManureClassInputTransformed,
  constants: HasCommonConstants & { POULTRY: PoultryConstants },
) => {
  const dryMatterIntake = getDryMatterIntake(poultryClass, constants.POULTRY);

  const dryMatterDigestibility = selectConstant(
    constants.POULTRY,
    'CLASSES',
    poultryClass.className,
    'dryMatterDigestibility',
  ).named(`Ij=${poultryClass.classNumber}`);

  const ashContent = selectConstant(
    constants.POULTRY,
    'CLASSES',
    poultryClass.className,
    'manureAsh',
  ).named(`Ij=${poultryClass.classNumber}`);

  /**
   * VSjk = Ijk * (1 - DMDjk) * (1 - Aj)
   */
  return dryMatterIntake
    .multiply(oneMinus(dryMatterDigestibility))
    .multiply(oneMinus(ashContent));
};

/**
 * Calculate the volatile solids *VST* produced that are transferred out (i.e. not lost)
 * of each manure management system used in stage 1 of manure treatment. Note that there
 * is no second stage for manure applied to pasture range/paddocks.
 */
const calculateVolatileSolidsTransferredOutOfPrimarySystems = (
  poultryClass: PoultryManureClassInputTransformed,
  constants: HasCommonConstants & { POULTRY: PoultryConstants },
): Record<PoultryMMS1Type, Container<MassPerHeadPerDay<'DryMatter'>>> => {
  const volatileSolids = calculateVolatileSolidProduction(
    poultryClass,
    constants,
  );
  const solidsOutOfPrimarySystem = (primarySystem: PoultryMMS1Type) => {
    const solidsIn = volatileSolids.multiply(
      poultryClass.manureAllocation[primarySystem].allocationStage1,
    );
    const fractionOfSolidsLost = selectConstant(
      constants.POULTRY,
      'MMS',
      primarySystem,
      'fractionSolidsLost',
    ).named(
      `VSLj=${poultryClass.classNumber}m=${subscriptNotation[primarySystem]}T=1`,
    );
    return solidsIn.multiply(oneMinus(fractionOfSolidsLost));
  };

  const solidsTransferredOutOf = {
    manureWithLitter: solidsOutOfPrimarySystem('manureWithLitter').named(
      `VSTj=${poultryClass.classNumber}m=10`,
    ),
    beltManureRemoval: solidsOutOfPrimarySystem('beltManureRemoval').named(
      `VSTj=${poultryClass.classNumber}m=11a`,
    ),
    manureStoredInHouse: solidsOutOfPrimarySystem('manureStoredInHouse').named(
      `VSTj=${poultryClass.classNumber}m=11b`,
    ),
  };

  return solidsTransferredOutOf;
};

/**
 * Calculate the sum of methane production *MjmT* from all manure produced by poultry
 * class *j* for all manure management systems used in stage 1 of treatment (as per
 * 4.6.1.1 (2)).
 */
const calculateMethaneProductionInStage1MMSForClass = (
  poultryClass: PoultryManureClassInputTransformed,
  constants: HasCommonConstants & {
    POULTRY: PoultryConstants;
    LIVESTOCK: LivestockConstants;
  },
): Container<MassPerHeadPerDay<'CH4'>> => {
  const volatileSolids = calculateVolatileSolidProduction(
    poultryClass,
    constants,
  ).named(`VSj=${poultryClass.classNumber}`);

  const emissionsPotential = selectConstant(
    constants.POULTRY,
    'CLASSES',
    poultryClass.className,
    'emissionsPotential',
  ).named(`Boj=${poultryClass.classNumber}`);

  const densityOfMethane = selectConstant(
    constants.COMMON,
    'DENSITY_OF_METHANE',
  ).named(`𝜌`);

  const totalPotentialMethaneProductionForClass = volatileSolids
    .multiply(emissionsPotential)
    .multiply(densityOfMethane);
  /**
   * MjmT=1 = VSj * Boj * MMSjmT=1 * MCFim * 𝜌
   */
  // TODO: Add inputs and constants for MCFim

  const methaneProductionPerSystem = PoultryMMS1TypesWithPasture.map(
    (primarySystem) => {
      const methaneConversionFactor = num(1).named(
        `MCFim=${subscriptNotation[primarySystem]}`,
      );
      const allocation =
        primarySystem === 'pastureRangeAndPaddock'
          ? poultryClass.manureAllocation.pastureRangeAndPaddock
          : poultryClass.manureAllocation[primarySystem].allocationStage1;

      return totalPotentialMethaneProductionForClass
        .multiply(methaneConversionFactor)
        .multiply(allocation)
        .named(
          `Mj=${poultryClass.classNumber}m=${subscriptNotation[primarySystem]}T=1`,
        );
    },
  );

  return sum(methaneProductionPerSystem);
};

/**
 * Calculate the sum of methane production *MjmT* from all manure produced by poultry
 * class *j* for all manure management systems used in stage 2 of treatment (as per
 * 4.6.1.1 (3)).
 */
const calculateMethaneProductionInStage2MMSForClass = (
  poultryClass: PoultryManureClassInputTransformed,
  constants: HasCommonConstants & {
    POULTRY: PoultryConstants;
    LIVESTOCK: LivestockConstants;
  },
) => {
  const emissionsPotential = selectConstant(
    constants.POULTRY,
    'CLASSES',
    poultryClass.className,
    'emissionsPotential',
  ).named(`Boj=${poultryClass.classNumber}`);

  const densityOfMethane = selectConstant(
    constants.COMMON,
    'DENSITY_OF_METHANE',
  ).named(`𝜌`);

  const solidsTransferredOutOf =
    calculateVolatileSolidsTransferredOutOfPrimarySystems(
      poultryClass,
      constants,
    );

  /**
   * VSTj * MMSjmT=2
   */
  const calculateVolatileSolidsTransferredIntoSecondarySystem = (
    secondarySystem: PoultryMMS2Type,
  ) => {
    /**
     * VSTjmT=2 = VSjk * MMSjmT=1 * (1 - VSLmT=1)
     */
    const volatileSolidsTransferredInFromAllPrimarySystems =
      PoultryMMS1Types.map((primarySystem) =>
        solidsTransferredOutOf[primarySystem].multiply(
          poultryClass.manureAllocation[primarySystem][secondarySystem],
        ),
      );
    return sum(volatileSolidsTransferredInFromAllPrimarySystems);
  };

  const methaneProductionPerSystem = PoultryMMS2Types.map((secondarySystem) => {
    const volatileSolidsInSystem =
      calculateVolatileSolidsTransferredIntoSecondarySystem(secondarySystem);
    const methaneConversionFactor = num(1).named(`MCFi=''m=${secondarySystem}`);
    return volatileSolidsInSystem
      .multiply(emissionsPotential)
      .multiply(densityOfMethane)
      .multiply(methaneConversionFactor);
  });

  return sum(methaneProductionPerSystem);
};

/**
 * Calculates total annual methane emissions from manure management *ECH4* for the given
 * poultry class.
 */
const calculateManureManagementCH4ForClass = (
  poultryClass: PoultryManureClassInputTransformed,
  context: ExecutionContext<
    HasCommonConstants & {
      POULTRY: PoultryConstants;
      LIVESTOCK: LivestockConstants;
    }
  >,
) => {
  const { constants } = context;
  /**
   * ECH4 = SUM(j,m,T) Dj * MjmT * Nj
   *
   * Since this function only handles one class at a time, (i.e. 'ECH4j = SUM(m,T) Dj * MjmT * Nj') we can simplify this
   * by summing all values of MjmT before multiplying everything together.
   */

  /**
   * 'Mj' (SUM(m,T) MjmT)
   */
  const totalMethaneProductionPerBirdPerDay =
    calculateMethaneProductionInStage1MMSForClass(poultryClass, constants).plus(
      calculateMethaneProductionInStage2MMSForClass(poultryClass, constants),
    );

  return totalMethaneProductionPerBirdPerDay
    .multiply(poultryClass.head)
    .multiply(poultryClass.days);
};

/**
 * Calculate nitrogen intake rate 'NIj' for a given class 'j' as per 4.6.1.3 (5)
 */
const calculateNitrogenIntakeForClass = (
  poultryClass: PoultryManureClassInputTransformed,
  constants: HasCommonConstants & { POULTRY: PoultryConstants },
) => {
  const crudeProtein = getCrudeProtein(poultryClass, constants.POULTRY);

  const dryMatterIntake = getDryMatterIntake(poultryClass, constants.POULTRY);

  const crudeProteinToNitrogen = selectConstant(
    constants.COMMON,
    'CRUDE_PROTEIN_TO_NITROGEN_CONVERSION',
  ).named('CP per N');

  /**
   * NIjk = Ij * CPj ÷ 6.25
   */
  return dryMatterIntake
    .multiply(crudeProtein)
    .divide(crudeProteinToNitrogen)
    .named(`NIj=${poultryClass.classNumber}`);
};

/**
 * Calculate nitrogen excretion rate 'NEj for a given class 'j' as per 4.6.1.3 (4)
 */
const calculateNitrogenExcretionForClass = (
  poultryClass: PoultryManureClassInputTransformed,
  constants: HasCommonConstants & { POULTRY: PoultryConstants },
) => {
  /**
   * NEjk = NIjk * (1 - NRjk)
   */
  return calculateNitrogenIntakeForClass(poultryClass, constants).multiply(
    oneMinus(getNitrogenRetentionRate(poultryClass, constants.POULTRY)),
  );
};

/**
 * Calculate *MNjmT=1* for each manure management system used in stage 1 of treatment,
 * as per 4.6.1.3 (2)
 */
const calculateNitrogenPerStage1MMSForClass = (
  poultryClass: PoultryManureClassInputTransformed,
  constants: HasCommonConstants & { POULTRY: PoultryConstants },
): Record<PoultryMMS1TypeWithPasture, Container<Mass<'N'>>> => {
  const { head, days, manureAllocation, classNumber } = poultryClass;

  const nitrogenExcretionRate = calculateNitrogenExcretionForClass(
    poultryClass,
    constants,
  ).named(`NEj=${classNumber}`);

  const annualNitrogenExcretion = nitrogenExcretionRate
    .multiply(head)
    .multiply(days)
    .named(`AEj=${classNumber}`);

  /**
   * MNjmT=1 = AEj * MMSjmT=1
   */
  return {
    manureWithLitter: annualNitrogenExcretion
      .multiply(manureAllocation.manureWithLitter.allocationStage1)
      .named(`MMSj=${classNumber}m=10T=1`),
    beltManureRemoval: annualNitrogenExcretion
      .multiply(manureAllocation.beltManureRemoval.allocationStage1)
      .named(`MMSj=${classNumber}m=11aT=1`),
    manureStoredInHouse: annualNitrogenExcretion
      .multiply(manureAllocation.manureStoredInHouse.allocationStage1)
      .named(`MMSj=${classNumber}m=11bT=1`),
    pastureRangeAndPaddock: annualNitrogenExcretion
      .multiply(manureAllocation.pastureRangeAndPaddock)
      .named(`MMSj=${classNumber}m=14T=1`),
  };
};

/**
 * Calculate the amount of nitrogen exiting each system *NTjmT=1* (generated per poultry
 * class *j*) for further treatment in stage two, given amounts of nitrogen in each
 * manure management system used in stage one of treatment.
 *
 * Note that there is no second stage for manure applied to pasture
 * range/paddocks.
 */
const calculateNitrogenTransferredOutOfPrimarySystems = (
  nitrogenPerStage1MMS: Record<
    PoultryMMS1TypeWithPasture,
    Container<Mass<'N'>>
  >,
  constants: HasCommonConstants & { POULTRY: PoultryConstants },
): Record<PoultryMMS1Type, Container<Mass<'N'>>> => {
  const nitrogenOutOfPrimarySystem = (primarySystem: PoultryMMS1Type) => {
    const nitrogenInSystem = nitrogenPerStage1MMS[primarySystem];

    const fractionNitrogenVolatised = selectConstant(
      constants.POULTRY,
      'MMS',
      primarySystem,
      'FracGASM',
    ).named(`FracGASMmT=1`);

    const nitrousOxideEmissionsFactor = selectConstant(
      constants.POULTRY,
      'MMS',
      primarySystem,
      'EFm',
    ).named(`EFm`);

    return nitrogenInSystem.multiply(
      oneMinus(fractionNitrogenVolatised).minus(nitrousOxideEmissionsFactor),
    );
  };

  return {
    manureWithLitter: nitrogenOutOfPrimarySystem('manureWithLitter'),
    beltManureRemoval: nitrogenOutOfPrimarySystem('beltManureRemoval'),
    manureStoredInHouse: nitrogenOutOfPrimarySystem('manureStoredInHouse'),
  };
};

/**
 * Calculate *MNjmT=2* for each manure management system used in stage 2 of treatment,
 * as per 4.6.1.3 (6)
 */
const calculateNitrogenPerStage2MMSForClass = (
  poultryClass: PoultryManureClassInputTransformed,
  nitrogenPerStage1MMS: Record<
    PoultryMMS1TypeWithPasture,
    Container<Mass<'N'>>
  >,
  constants: HasCommonConstants & { POULTRY: PoultryConstants },
): Record<PoultryMMS2TypeWithPasture, Container<Mass<'N'>>> => {
  const nitrogenExitingPrimarySystems =
    calculateNitrogenTransferredOutOfPrimarySystems(
      nitrogenPerStage1MMS,
      constants,
    );

  const nitrogenInSecondarySystem = (
    secondarySystem: PoultryMMS2TypeWithPasture,
  ) => {
    const incomingNitrogenFromEachPrimarySystem = PoultryMMS1Types.map(
      (primarySystem) => {
        return nitrogenExitingPrimarySystems[primarySystem].multiply(
          poultryClass.manureAllocation[primarySystem][secondarySystem],
        );
      },
    );
    return sum(incomingNitrogenFromEachPrimarySystem);
  };

  return {
    solidStorage: nitrogenInSecondarySystem('solidStorage'),
    composting: nitrogenInSecondarySystem('composting'),
    digester: nitrogenInSecondarySystem('digester'),
    directProcessing: nitrogenInSecondarySystem('directProcessing'),
    directApplication: nitrogenInSecondarySystem('directApplication'),
  };
};

/**
 * TODO
 */
const calculateDirectN2OEmissionsForClass = (
  poultryClass: PoultryManureClassInputTransformed,
  constants: HasCommonConstants & { POULTRY: PoultryConstants },
) => {
  const nitrogenInPrimarySystems = calculateNitrogenPerStage1MMSForClass(
    poultryClass,
    constants,
  );

  const nitrogenInSecondarySystems = calculateNitrogenPerStage2MMSForClass(
    poultryClass,
    nitrogenInPrimarySystems,
    constants,
  );

  // REVISIT: Should pasture be included here?
  const n2oFromPrimarySystems = PoultryMMS1TypesWithPasture.map((mms) => {
    const nitrogenInSystem = nitrogenInPrimarySystems[mms];
    const nitrousOxideEmissionsFactor = selectConstant(
      constants.POULTRY,
      'MMS',
      mms,
      'EFm',
    ).named(`TODO`);

    return nitrogenInSystem.multiply(nitrousOxideEmissionsFactor);
  });

  const n2oFromSecondarySystems = PoultryMMS2Types.map((mms) => {
    const nitrogenInSystem = nitrogenInSecondarySystems[mms];
    const nitrousOxideEmissionsFactor = selectConstant(
      constants.POULTRY,
      'MMS',
      mms,
      'EFm',
    ).named(`TODO`);

    return nitrogenInSystem.multiply(nitrousOxideEmissionsFactor);
  });

  const n2oConversionFactor = selectConstant(
    constants.COMMON,
    'GWP_FACTORSC15',
  );

  return sum(n2oFromPrimarySystems)
    .plus(sum(n2oFromSecondarySystems))
    .multiply(n2oConversionFactor);
};

const calculateAtmosphericDepositionN2OEmissionsForClass = (
  poultryClass: PoultryManureClassInputTransformed,
  constants: HasCommonConstants & { POULTRY: PoultryConstants },
) => {
  const nitrogenInPrimarySystems = calculateNitrogenPerStage1MMSForClass(
    poultryClass,
    constants,
  );

  const nitrogenInSecondarySystems = calculateNitrogenPerStage2MMSForClass(
    poultryClass,
    nitrogenInPrimarySystems,
    constants,
  );

  // REVISIT: Should pasture be included here?
  const volatisedNitrogenFromPrimarySystems = PoultryMMS1Types.map((mms) => {
    const nitrogenInSystem = nitrogenInPrimarySystems[mms];
    const fracGASM = selectConstant(
      constants.POULTRY,
      'MMS',
      mms,
      'FracGASM',
    ).named(``);

    return nitrogenInSystem.multiply(fracGASM);
  });

  const volatisedNitrogenFromSecondarySystems = PoultryMMS2Types.map((mms) => {
    const nitrogenInSystem = nitrogenInSecondarySystems[mms];
    const fracGASM = selectConstant(
      constants.POULTRY,
      'MMS',
      mms,
      'FracGASM',
    ).named(``);

    return nitrogenInSystem.multiply(fracGASM);
  });

  const totalVolatisedNitrogen = sum(volatisedNitrogenFromPrimarySystems)
    .plus(sum(volatisedNitrogenFromSecondarySystems))
    .named('MMS_ATMOS');

  const n2oConversionFactor = selectConstant(
    constants.COMMON,
    'GWP_FACTORSC15',
  );

  // TODO: Add input + constant...?
  const n2oEmissionsFactor = new RootContainer(massPerMass('N2O', 'N'));

  return totalVolatisedNitrogen
    .multiply(n2oConversionFactor)
    .multiply(n2oEmissionsFactor);
};

const calculateMassOfNitrogenAppliedToSoilsForClass = (
  poultryClass: PoultryManureClassInputTransformed,
  isInLeachingZone: boolean,
  fractionAppliedToSoils: Container<RealNumber>,
  constants: HasCommonConstants & {
    POULTRY: PoultryConstants;
    CROP: CropConstants;
  },
) => {
  /* 4.6.1.9 MANURE APPLIED TO SOILS
    The mass of nitrogen applied to soils for scope 1 emissions MNSoilscope1 (kg N) is
    calculated as:
    MNSoilscope1 = SUM SUM (MN jm T=2 * (1 - EF jm=1-13- FracGASM jm-1-13) - Mleach,MMS) * PF
    */

  const nitrogenInPrimarySystems = calculateNitrogenPerStage1MMSForClass(
    poultryClass,
    constants,
  );

  const nitrogenInSecondarySystems = calculateNitrogenPerStage2MMSForClass(
    poultryClass,
    nitrogenInPrimarySystems,
    constants,
  );

  // TODO: Does this go straight to scope 1 result? (Yes. Put this in a different function...?)
  // const _MNPastureRangePaddock = sum(
  //   manuresT1.map((m) => m.pastureRangeAndPaddock),
  // ).named('MNPastureRangePaddock');

  const fracWETSoil = (isInLeachingZone ? num(1) : num(0)).named('FracWETSoil');

  const nitrogenFromSecondarySystemsAppliedToSoils = PoultryMMS2Types.map(
    (mms) => {
      const fracLeachMS = selectConstant(
        constants.CROP,
        'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF_SOLID_STORAGE',
      ).named('FracLeachMMS');

      /**
       *
       */
      const nitrogenLostThroughLeaching = (
        mms === 'solidStorage'
          ? nitrogenInSecondarySystems[mms]
              .multiply(fracWETSoil)
              .multiply(fracLeachMS)
          : root(mass('N', 0))
      ).named(`'Mleach,m=${subscriptNotation[mms]}'`);

      const nitrousOxideEmissionsFactor = selectConstant(
        constants.POULTRY,
        'MMS',
        mms,
        'EFm',
      ).named(`EFm=${subscriptNotation[mms]}T=2`);
      const fracGASM = selectConstant(
        constants.POULTRY,
        'MMS',
        mms,
        'FracGASM',
      ).named(`FracGASMm=${subscriptNotation[mms]}T=2`);

      return nitrogenInSecondarySystems[mms]
        .multiply(oneMinus(nitrousOxideEmissionsFactor).minus(fracGASM))
        .minus(nitrogenLostThroughLeaching);
    },
  );

  return {
    scope1: sum(nitrogenFromSecondarySystemsAppliedToSoils)
      .multiply(fractionAppliedToSoils)
      // All nitrogen applied directly to soil will not leave the farm boundary.
      .plus(nitrogenInSecondarySystems['directApplication']),
    scope3: sum(nitrogenFromSecondarySystemsAppliedToSoils).multiply(
      oneMinus(fractionAppliedToSoils),
    ),
  };
};

export function calculateMassOfNitrogenAppliedToSoilsForPoultry(
  manureInput: PoultryManureInputTransformed,
  isInLeachingZone: boolean,
  constants: HasCommonConstants & {
    POULTRY: PoultryConstants;
    CROP: CropConstants;
  },
) {
  const nitrogenAppliedToSoilPerClass = [
    calculateMassOfNitrogenAppliedToSoilsForClass(
      manureInput.classes.layers,
      isInLeachingZone,
      manureInput.fractionAppliedToSoils,
      constants,
    ),
    calculateMassOfNitrogenAppliedToSoilsForClass(
      manureInput.classes.meatChickenBreeder,
      isInLeachingZone,
      manureInput.fractionAppliedToSoils,
      constants,
    ),
    calculateMassOfNitrogenAppliedToSoilsForClass(
      manureInput.classes.meatChickenGrowers,
      isInLeachingZone,
      manureInput.fractionAppliedToSoils,
      constants,
    ),
    calculateMassOfNitrogenAppliedToSoilsForClass(
      manureInput.classes.meatOther,
      isInLeachingZone,
      manureInput.fractionAppliedToSoils,
      constants,
    ),
  ];

  return {
    scope1: sum(nitrogenAppliedToSoilPerClass.map((n) => n.scope1)).named(
      'MNSoil (Scope 1)',
    ),
    scope3: sum(nitrogenAppliedToSoilPerClass.map((n) => n.scope3)).named(
      'MNSoil (Scope 3)',
    ),
  };
}
