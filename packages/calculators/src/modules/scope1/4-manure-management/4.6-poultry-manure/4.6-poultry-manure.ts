import {
  GrazingProductionSystemsWithRainfall,
  MeanAnnualTemperature,
  PoultryMMS1Type,
  PoultryMMS1Types,
  PoultryMMS1TypesWithPasture,
  PoultryMMS1TypeWithPasture,
  PoultryMMS2Types,
  PoultryMMS2TypesWithPasture,
  PoultryMMS2TypeWithPasture,
  PureState,
} from '@/constants/enums';
import { selectConstant } from '@/tools/constants';
import { Container, num, root } from '@/tools/containers';
import { oneMinus } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import {
  mass,
  Mass,
  MassPerHeadPerDay,
  realNumber,
  RealNumber,
} from '@/tools/units';
import {
  PoultryManureClassInputTransformed,
  PoultryMMS1To2AllocationInputTransformed,
} from './poultry-manure.input';
import {
  CropConstants,
  HasCommonConstants,
  LivestockConstants,
  PoultryConstants,
} from '@/constants/types';

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
 * Convenience wrapper for getting dry matter intake *Ij* for a class *j*
 */
const getDryMatterDigestibility = (
  poultryClass: PoultryManureClassInputTransformed,
  constants: PoultryConstants,
) =>
  poultryClass.method2DryMatterDigestibility ??
  selectConstant(
    constants,
    'CLASSES',
    poultryClass.className,
    'dryMatterDigestibility',
  ).named(`DMDj=${poultryClass.classNumber}`);

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
 * Calculate volatile solid production rate *VSj* for a given class *j* (4.6.1.1 (5))
 */
const calculateVolatileSolidProduction = (
  poultryClass: PoultryManureClassInputTransformed,
  constants: HasCommonConstants & { POULTRY: PoultryConstants },
) => {
  const dryMatterIntake = getDryMatterIntake(poultryClass, constants.POULTRY);

  const dryMatterDigestibility = getDryMatterDigestibility(
    poultryClass,
    constants.POULTRY,
  );

  const ashContent = selectConstant(
    constants.POULTRY,
    'CLASSES',
    poultryClass.className,
    'manureAsh',
  ).named(`Aj=${poultryClass.classNumber}`);

  /**
   * VSjk = Ijk * (1 - DMDjk) * (1 - Aj)
   */
  return dryMatterIntake
    .multiply(oneMinus(dryMatterDigestibility))
    .multiply(oneMinus(ashContent));
};

/**
 * Calculate the volatile solids *VSTj* produced by a class *j* that are transferred out (i.e. not lost)
 * of each manure management system used in stage 1 of manure treatment (4.6.1.1 (4)).
 *
 * Note that there is no second stage for manure applied to pasture range/paddocks.
 */
const calculateVolatileSolidsTransferredOutOfPrimarySystems = (
  poultryClass: PoultryManureClassInputTransformed,
  constants: HasCommonConstants & { POULTRY: PoultryConstants },
): Record<PoultryMMS1Type, Container<MassPerHeadPerDay<'DryMatter'>>> => {
  const volatileSolids = calculateVolatileSolidProduction(
    poultryClass,
    constants,
  );
  /**
   * VSTjmT=2 = VSj * MMSjmT=1 * (1 - VSLmT=1)
   */
  const solidsTransferredOutOf = (mms: PoultryMMS1Type) => {
    const solidsIn = volatileSolids.multiply(
      poultryClass.manureAllocation[mms],
    );
    const fractionOfSolidsLost = selectConstant(
      constants.POULTRY,
      'MMS',
      mms,
      'fractionSolidsLost',
    ).named(`VSLj=${poultryClass.classNumber}m=${subscriptNotation[mms]}T=1`);
    return solidsIn.multiply(oneMinus(fractionOfSolidsLost));
  };

  return {
    manureWithLitter: solidsTransferredOutOf('manureWithLitter').named(
      `VSTj=${poultryClass.classNumber}m=10T=2`,
    ),
    beltManureRemoval: solidsTransferredOutOf('beltManureRemoval').named(
      `VSTj=${poultryClass.classNumber}m=11aT=2`,
    ),
    manureStoredInHouse: solidsTransferredOutOf('manureStoredInHouse').named(
      `VSTj=${poultryClass.classNumber}=m=11bT=2`,
    ),
  };
};

/**
 * Calculate the sum of methane production *MjmT=1* from all manure produced by poultry
 * class *j* for all manure management systems used in stage 1 of treatment (4.6.1.1 (2))
 */
const calculateMethaneProductionInStage1MMSForClass = (
  poultryClass: PoultryManureClassInputTransformed,
  state: PureState,
  meanAnnualTemperature: MeanAnnualTemperature | undefined,
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
  const methaneProductionPerSystem = PoultryMMS1TypesWithPasture.map((mms) => {
    /**
     * NOTE - From A.1.8.1:
     *
     * a) Drylot MCF is state based - 0.02 (NT) or 0.01 (Other States) - source NIR
     * ...
     * d) Poultry and Swine pasture range and paddock should apply the drylot MCFs - source NIR
     */
    const methaneConversionFactor = (
      meanAnnualTemperature === undefined || mms === 'pastureRangeAndPaddock'
        ? selectConstant(
            constants.POULTRY,
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
    const allocation = poultryClass.manureAllocation[mms];

    return totalPotentialMethaneProductionForClass
      .multiply(methaneConversionFactor)
      .multiply(allocation)
      .named(`Mj=${poultryClass.classNumber}m=${subscriptNotation[mms]}T=1`);
  });

  return sum(methaneProductionPerSystem);
};

/**
 * Calculate the sum of methane production *MjmT=2* from all manure produced by poultry
 * class *j* for all manure management systems used in stage 2 of treatment (4.6.1.1 (3))
 */
const calculateMethaneProductionInStage2MMSForClass = (
  poultryClass: PoultryManureClassInputTransformed,
  stage2ManureAllocations: PoultryMMS1To2AllocationInputTransformed,
  state: PureState,
  meanAnnualTemperature: MeanAnnualTemperature | undefined,
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

  const methaneProductionPerSystem = PoultryMMS2TypesWithPasture.map((mms2) => {
    const volatileSolidsInSystem = sum(
      PoultryMMS1Types.map((mms1) =>
        solidsTransferredOutOf[mms1].multiply(
          stage2ManureAllocations[mms1][mms2],
        ),
      ),
    );
    const methaneConversionFactor = (
      meanAnnualTemperature === undefined
        ? selectConstant(
            constants.POULTRY,
            'MMS',
            mms2,
            'METHANE_CONVERSION_FACTOR_BY_STATE',
            state,
          )
        : selectConstant(
            constants.LIVESTOCK,
            'MANURE_MANAGEMENT_METHANE_CONVERSION_FACTORS',
            mms2,
            meanAnnualTemperature,
          )
    ).named(`MCFim=${subscriptNotation[mms2]}`);
    return volatileSolidsInSystem
      .multiply(emissionsPotential)
      .multiply(densityOfMethane)
      .multiply(methaneConversionFactor)
      .named(`Mj=${poultryClass.classNumber}m=${subscriptNotation[mms2]}T=2`);
  });

  return sum(methaneProductionPerSystem);
};

/**
 * Calculates total annual methane emissions from manure management *ECH4* for the given
 * poultry class (*ECH4j*, if you will).
 */
export const calculateManureManagementCH4ForClass = (
  poultryClass: PoultryManureClassInputTransformed,
  stage2ManureAllocations: PoultryMMS1To2AllocationInputTransformed,
  state: PureState,
  meanAnnualTemperature: MeanAnnualTemperature | undefined,
  constants: HasCommonConstants & {
    POULTRY: PoultryConstants;
    LIVESTOCK: LivestockConstants;
  },
) => {
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
    calculateMethaneProductionInStage1MMSForClass(
      poultryClass,
      state,
      meanAnnualTemperature,
      constants,
    ).plus(
      calculateMethaneProductionInStage2MMSForClass(
        poultryClass,
        stage2ManureAllocations,
        state,
        meanAnnualTemperature,
        constants,
      ),
    );

  return totalMethaneProductionPerBirdPerDay
    .multiply(poultryClass.head)
    .multiply(poultryClass.days)
    .named(`ECH4 (j=${poultryClass.classNumber})`);
};

/**
 * Calculate nitrogen intake rate 'NIj' for a given class 'j' (4.6.1.3 (5))
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
  const nitrogenIntake = dryMatterIntake
    .multiply(crudeProtein)
    .divide(crudeProteinToNitrogen)
    .named(`NIj=${poultryClass.classNumber}`);

  return nitrogenIntake;
};

/**
 * Calculate nitrogen excretion rate 'NEj for a given class 'j' (4.6.1.3 (4))
 */
const calculateNitrogenExcretionForClass = (
  poultryClass: PoultryManureClassInputTransformed,
  constants: HasCommonConstants & { POULTRY: PoultryConstants },
) => {
  /**
   * NEjk = NIjk * (1 - NRjk)
   */
  return calculateNitrogenIntakeForClass(poultryClass, constants)
    .multiply(
      oneMinus(getNitrogenRetentionRate(poultryClass, constants.POULTRY)),
    )
    .named(`NEj=${poultryClass.classNumber}`);
};

/**
 * Calculate *MNjmT=1* for each manure management system used in stage 1 of treatment
 * (4.6.1.3 (2))
 */
export const calculateNitrogenPerStage1MMSForClass = (
  poultryClass: PoultryManureClassInputTransformed,
  constants: HasCommonConstants & { POULTRY: PoultryConstants },
): Record<PoultryMMS1TypeWithPasture, Container<Mass<'N'>>> => {
  const { head, days, manureAllocation, classNumber } = poultryClass;

  const nitrogenExcretionRate = calculateNitrogenExcretionForClass(
    poultryClass,
    constants,
  );

  const annualNitrogenExcretion = nitrogenExcretionRate
    .multiply(head)
    .multiply(days)
    .named(`AEj=${classNumber}`);

  /**
   * MNjmT=1 = AEj * MMSjmT=1
   */
  return {
    manureWithLitter: annualNitrogenExcretion
      .multiply(manureAllocation.manureWithLitter)
      .named(`MNj=${classNumber}m=10T=1`),
    beltManureRemoval: annualNitrogenExcretion
      .multiply(manureAllocation.beltManureRemoval)
      .named(`MNj=${classNumber}m=11aT=1`),
    manureStoredInHouse: annualNitrogenExcretion
      .multiply(manureAllocation.manureStoredInHouse)
      .named(`MNj=${classNumber}m=11bT=1`),
    pastureRangeAndPaddock: annualNitrogenExcretion
      .multiply(manureAllocation.pastureRangeAndPaddock)
      .named(`MNj=${classNumber}m=14T=1`),
  };
};

/**
 * Calculate the mass of nitrogen *MNjmT=2* in each manure management system used in
 * stage 2 of treatment created by class *j* (4.6.1.3 (6))
 */
export const calculateNitrogenPerStage2MMSForClass = (
  poultryClass: PoultryManureClassInputTransformed,
  stage2ManureAllocations: PoultryMMS1To2AllocationInputTransformed,
  nitrogenPerStage1MMS: Record<
    PoultryMMS1TypeWithPasture,
    Container<Mass<'N'>>
  >,
  constants: HasCommonConstants & { POULTRY: PoultryConstants },
): Record<PoultryMMS2TypeWithPasture, Container<Mass<'N'>>> => {
  /**
   * NTjkmT=2 = (MNjkmT=1 * (1 - FracGASMmT=1 - EFmT=1))
   */
  const nitrogenExitingPrimarySystem = (mms: PoultryMMS1Type) => {
    const nitrogenInSystem = nitrogenPerStage1MMS[mms];

    const fractionNitrogenVolatised = selectConstant(
      constants.POULTRY,
      'MMS',
      mms,
      'FracGASM',
    ).named(`FracGASMm=${subscriptNotation[mms]}T=1`);

    const nitrousOxideEmissionsFactor = selectConstant(
      constants.POULTRY,
      'MMS',
      mms,
      'EFm',
    ).named(`EFm=${subscriptNotation[mms]}`);

    return nitrogenInSystem
      .multiply(
        oneMinus(
          /**
           * On the unit switch:
           * My understanding here is that the two values being subtracted here are
           * fractions of 'other stuff' in the mass of nitrogen. Subtracting them from 1
           * gives us the fraction of N that isn't 'other stuff', i.e, the solid nitrogen
           * that can be transferred to stage 2 of treatment.
           */
          fractionNitrogenVolatised.switchUnit((v) => realNumber(v.value)),
        ).minus(
          nitrousOxideEmissionsFactor.switchUnit((v) => realNumber(v.value)),
        ),
      )
      .named(`NTj=${poultryClass.classNumber}m=${subscriptNotation[mms]}T=1`);
  };

  const nitrogenOutOfEachPrimarySystem = {
    manureWithLitter: nitrogenExitingPrimarySystem('manureWithLitter'),
    beltManureRemoval: nitrogenExitingPrimarySystem('beltManureRemoval'),
    manureStoredInHouse: nitrogenExitingPrimarySystem('manureStoredInHouse'),
  };

  const nitrogenEnteringSecondarySystem = (
    mms2: PoultryMMS2TypeWithPasture,
  ) => {
    const nFromEachPrimarySystem = PoultryMMS1Types.map((mms1) => {
      const n = nitrogenOutOfEachPrimarySystem[mms1]
        .multiply(stage2ManureAllocations[mms1][mms2])
        .named(
          `NTj=${poultryClass.classNumber}m=${subscriptNotation[mms1]}T=2`,
        );
      return n;
    });
    return sum(nFromEachPrimarySystem).named(
      `MNj=${poultryClass.classNumber}m=${subscriptNotation[mms2]}T=2`,
    );
  };
  /**
   * MNjkmT=2 = NTjkmT=2 * MMSmT=2
   */
  return {
    solidStorage: nitrogenEnteringSecondarySystem('solidStorage'),
    composting: nitrogenEnteringSecondarySystem('composting'),
    digester: nitrogenEnteringSecondarySystem('digester'),
    directProcessing: nitrogenEnteringSecondarySystem('directProcessing'),
    directApplication: nitrogenEnteringSecondarySystem('directApplication'),
  };
};

/**
 * Calculate direct nitrous oxide emissions *EN2O,dir* from a poultry class
 * (4.6.1.3 (1) and  4.6.1.10 (1)).
 */
export const calculateDirectN2OEmissionsForClass = (
  poultryClass: PoultryManureClassInputTransformed,
  stage2ManureAllocations: PoultryMMS1To2AllocationInputTransformed,
  climateZone: 'wet' | 'dry',
  constants: HasCommonConstants & {
    POULTRY: PoultryConstants;
    LIVESTOCK: LivestockConstants;
  },
) => {
  const nitrogenInPrimarySystems = calculateNitrogenPerStage1MMSForClass(
    poultryClass,
    constants,
  );

  const nitrogenInSecondarySystems = calculateNitrogenPerStage2MMSForClass(
    poultryClass,
    stage2ManureAllocations,
    nitrogenInPrimarySystems,
    constants,
  );

  const CN2O = selectConstant(constants.COMMON, 'GWP_FACTORSC15');

  /**
   * 4.6.1.3 (1): EN2O,dir = SUMj,m,T (MNjmT * EFjm * CN2O) * 10^-3
   *
   * REVISIT: I'm not sure if the inclusion (or rather, lack of exclusion) of pasture in
   * 4.6.1.3 is a mistake. The guidelines currently calculate 'direct N2O' from manure
   * deposited at pasture in two different ways for poultry, it's unclear to me if these
   * are two different forms of direct N2O or if these equations are meant to be
   * used exclusively (there is nothing I've seen to suggest this).
   *
   * For now, I'm performing both calculations for pasture.
   */
  const n2oFromPrimarySystems = PoultryMMS1TypesWithPasture.map((mms) => {
    const nitrogenInSystem = nitrogenInPrimarySystems[mms];
    const nitrousOxideEmissionsFactor = selectConstant(
      constants.POULTRY,
      'MMS',
      mms,
      'EFm',
    ).named(`EFm=${subscriptNotation[mms]}`);

    return nitrogenInSystem
      .multiply(nitrousOxideEmissionsFactor)
      .multiply(CN2O)
      .named(
        `EN2O,dir (m=${subscriptNotation[mms]}, j=${poultryClass.classNumber})`,
      );
  });

  const n2oFromSecondarySystems = PoultryMMS2Types.map((mms) => {
    const nitrogenInSystem = nitrogenInSecondarySystems[mms];
    const nitrousOxideEmissionsFactor = selectConstant(
      constants.POULTRY,
      'MMS',
      mms,
      'EFm',
    ).named(`EFm=${subscriptNotation[mms]}`);

    return nitrogenInSystem
      .multiply(nitrousOxideEmissionsFactor)
      .multiply(CN2O)
      .named(
        `EN2O,dir (m=${subscriptNotation[mms]}, j=${poultryClass.classNumber})`,
      );
  });

  /**
   * See above re: REVISIT comment.
   *
   * 4.6.1.10 (1): EMN2O,PRP,dir = SUMj (MNjm=14T=1 * EFPRP * CN2O) * 10^-3
   */
  const EFprp = selectConstant(
    constants.LIVESTOCK,
    'EF_DEPOSITED_URINE_AND_DUNG_PRP',
    climateZone,
  ).named(`EFprp (${climateZone})`);
  const additionalN2OFromPasture =
    nitrogenInPrimarySystems.pastureRangeAndPaddock
      .multiply(EFprp)
      .multiply(CN2O);

  /**
   * EN2O,dir + EMN2O,PRP,dir
   */
  return sum(n2oFromPrimarySystems)
    .plus(sum(n2oFromSecondarySystems))
    .plus(additionalN2OFromPasture);
};

/**
 * Calculate total annual atmospheric deposition emissions from manure management
 * *EN2O,ad* from a poultry class (4.6.1.5 and 4.6.1.12).
 */
export const calculateAtmosphericDepositionN2OEmissionsForClass = (
  poultryClass: PoultryManureClassInputTransformed,
  stage2ManureAllocations: PoultryMMS1To2AllocationInputTransformed,
  productionSystem: GrazingProductionSystemsWithRainfall,
  constants: HasCommonConstants & {
    POULTRY: PoultryConstants;
    LIVESTOCK: LivestockConstants;
    CROP: CropConstants;
  },
) => {
  const nitrogenInPrimarySystems = calculateNitrogenPerStage1MMSForClass(
    poultryClass,
    constants,
  );

  const nitrogenInSecondarySystems = calculateNitrogenPerStage2MMSForClass(
    poultryClass,
    stage2ManureAllocations,
    nitrogenInPrimarySystems,
    constants,
  );

  const volatilisedNitrogenFromPrimarySystemsWithoutPasture =
    PoultryMMS1Types.map((mms) => {
      const nitrogenInSystem = nitrogenInPrimarySystems[mms];
      const fracGASM = selectConstant(
        constants.POULTRY,
        'MMS',
        mms,
        'FracGASM',
      ).named(`FracGASMm=${subscriptNotation[mms]}T=1`);

      return nitrogenInSystem.multiply(fracGASM);
    });

  /**
   * MMSATMOS = SUMj,m,T MNjmT * FracGASMmT
   *
   * NOTE: Volatised nitrogen at pasture is calculated with a separate factor.
   */
  const volatilisedNitrogenFromSecondarySystems = PoultryMMS2Types.map(
    (mms) => {
      const nitrogenInSystem = nitrogenInSecondarySystems[mms];
      const fracGASM = selectConstant(
        constants.POULTRY,
        'MMS',
        mms,
        'FracGASM',
      ).named(`FracGASMm=${subscriptNotation[mms]}T=2`);

      return nitrogenInSystem.multiply(fracGASM);
    },
  );

  const fracGASMsoil = selectConstant(
    constants.CROP,
    'FRACTION_N_VOLATILISED_ORGANIC_FERTILISER',
  ).named('FracGASMsoil');

  /**
   * Mvol,m=14 = MNjm=14T=1 * FracGASMsoil
   *
   * NOTE: The subscript in the guidelines is misleading. Mvol,m=14 is a mass of
   * volatised nitrogen, not a volume.
   */
  const volatilisedNitrogenFromPasture =
    nitrogenInPrimarySystems.pastureRangeAndPaddock
      .multiply(fracGASMsoil)
      .named('Mvol,m=14');

  const totalVolatisedNitrogenExcludingPasture = sum(
    volatilisedNitrogenFromPrimarySystemsWithoutPasture,
  )
    .plus(sum(volatilisedNitrogenFromSecondarySystems))
    .named('MMS_ATMOS');

  const CN2O = selectConstant(constants.COMMON, 'GWP_FACTORSC15').named('CN2O');

  const EFN2O = selectConstant(
    constants.LIVESTOCK,
    'EF_ATMOSPHERIC_DEPOSITION',
    productionSystem,
  ).named('EFN2O');

  /**
   * From 4.6.1.5 (1): EN2O,ad = (MMSATMOS * EFN2O * CN2O) * 10^-3
   *
   * From 4.6.1.12 (1): EN2O,ad = Mvol,m=14 * EFN2O * CN2O * 10^-3
   *
   * We can factorise this into:
   *  (MMSATMOS + Mvol,m=14) * EFN2O * CN2O * 10^-3
   *
   */
  return totalVolatisedNitrogenExcludingPasture
    .plus(volatilisedNitrogenFromPasture)
    .multiply(CN2O)
    .multiply(EFN2O)
    .named(`E20,ad (j=${poultryClass.classNumber})`);
};

/**
 * Calculate emissions from leaching and runoff *EN2O,leach* from manure produced by a
 * poultry class (4.6.1.7 (1) and 4.6.1.14 (1))
 */
export const calculateLeachingAndRunoffN2OEmissionsForClass = (
  poultryClass: PoultryManureClassInputTransformed,
  stage2ManureAllocations: PoultryMMS1To2AllocationInputTransformed,
  isInLeachingZone: boolean,
  constants: HasCommonConstants & {
    POULTRY: PoultryConstants;
    CROP: CropConstants;
  },
) => {
  const fracWETSoil = (isInLeachingZone ? num(1) : num(0)).named('FracWETSoil');
  const fracLeachMS = selectConstant(
    constants.CROP,
    'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF_SOLID_STORAGE',
  ).named('FracLeachMMS');

  const nitrogenInPrimarySystems = calculateNitrogenPerStage1MMSForClass(
    poultryClass,
    constants,
  );
  const nitrogenLostInPasture = nitrogenInPrimarySystems.pastureRangeAndPaddock
    .multiply(fracWETSoil)
    .multiply(fracLeachMS)
    .named(`Mleachm=14 (j=${poultryClass.classNumber})`);
  const nitrogenLostInSolidStorage = calculateNitrogenPerStage2MMSForClass(
    poultryClass,
    stage2ManureAllocations,
    nitrogenInPrimarySystems,
    constants,
  )
    .solidStorage.multiply(fracWETSoil)
    .multiply(fracLeachMS)
    .named(`Mleachm=4 (j=${poultryClass.classNumber})`);

  const EFleach = selectConstant(
    constants.CROP,
    'EF_N2O_LEACHING_AND_RUNOFF',
  ).named(`EFleach`);

  const CN2O = selectConstant(constants.COMMON, 'GWP_FACTORSC15').named('CN2O');

  /**
   * 4.6.1.7: EN2O,leach = MNLeachjm=4 * EFleach * CN2O * 10^-3
   *
   * 4.6.1.14: EN2O,leach = Mleachjm=14 * EFleach * CN2O * 10^-3
   *
   * Factorised as: EN2O,leach (Mleachjm=4 + Mleachjm=14) * EFleach * CN2O * 10^-3
   */
  return nitrogenLostInPasture
    .plus(nitrogenLostInSolidStorage)
    .multiply(EFleach)
    .multiply(CN2O);
};

/**
 * Calculate the mass of nitrogen applied to soils for scope 1 and 3 emissions
 * (*MNSoilscope1* and *MNSoilscope3*) produced by a poultry class (4.6.1.9).
 */
export const calculateMassOfNitrogenAppliedToSoilsForClass = (
  poultryClass: PoultryManureClassInputTransformed,
  stage2ManureAllocations: PoultryMMS1To2AllocationInputTransformed,
  isInLeachingZone: boolean,
  fractionAppliedToSoils: Container<RealNumber>,
  constants: HasCommonConstants & {
    POULTRY: PoultryConstants;
    CROP: CropConstants;
  },
) => {
  /**
   * MNSoil (scope 1) = SUMj,m (MNjmT=2 * (1 - EFjm=1-13 - FracGASMjm=1-13) - Mleach,MMS)
   *
   * MNSoil (scope 3) = SUMj,m,T MNjmT=2 * (1 - EFmT=2 - FracGASMmT=2) * (1 - PF)
   *
   * NOTES (possibly need to REVISIT):
   * - *m=1-13* is fairly confusing subscript, we've assumed we're summing over *m* where
   * *T=2* only (i.e. only secondary treatment systems *m=4,6,7,12,13*).
   * - *Mleach,MMS* is not defined in this chapter. Presumably, this is meant to be
   * nitrogen lost from leaching (hence it's no longer in the soil). Therefore, we assume
   * *Mleach,MMS* is equivalent to *MNLeachjm=4* (see equation 4.6.1.7 (2))
   * - This implementation assumes that the missing subtraction of *Mleach,MMS* in the
   * scope 3 equation is a mistake (Mleach,MMS is the amount of nitrogen lost; if it's
   * 'lost' then it's not being applied to soils out of the farm boundary either).
   * - The nitrogen from manure directly deposited onto pasture ranges and paddocks is
   * excluded from this calculation.
   */
  const nitrogenInPrimarySystems = calculateNitrogenPerStage1MMSForClass(
    poultryClass,
    constants,
  );

  const nitrogenInSecondarySystems = calculateNitrogenPerStage2MMSForClass(
    poultryClass,
    stage2ManureAllocations,
    nitrogenInPrimarySystems,
    constants,
  );

  const fracWETSoil = (isInLeachingZone ? num(1) : num(0)).named('FracWETSoil');

  /**
   * SUM (MNjmT=2 * (1 - EFjm=1-13 - FracGASMjm=1-13) - Mleach,MMS)
   */
  const nitrogenFromSecondarySystemsAppliedToSoils = PoultryMMS2Types.map(
    (mms) => {
      const fracLeachMS = selectConstant(
        constants.CROP,
        'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF_SOLID_STORAGE',
      ).named('FracLeachMMS');

      /**
       * MNLeachjm=4 = MNjkm=4T=1 * FracWET * FracLEACHMS
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
        .multiply(
          oneMinus(
            // See above (`calculateNitrogenPerStage2MMSForClass`) for explanation of unit switch.
            nitrousOxideEmissionsFactor.switchUnit((v) => realNumber(v.value)),
          ).minus(fracGASM.switchUnit((v) => realNumber(v.value))),
        )
        .minus(nitrogenLostThroughLeaching);
    },
  );

  return {
    scope1: sum(nitrogenFromSecondarySystemsAppliedToSoils)
      .multiply(fractionAppliedToSoils)
      // All nitrogen applied directly to soil will not leave the farm boundary.
      .plus(nitrogenInSecondarySystems['directApplication'])
      .named(`MNSoil (Scope 1, j=${poultryClass.classNumber})`),
    scope3: sum(nitrogenFromSecondarySystemsAppliedToSoils).multiply(
      oneMinus(fractionAppliedToSoils).named(
        `MNSoil (Scope 3, j=${poultryClass.classNumber})`,
      ),
    ),
  };
};
