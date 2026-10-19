import {
  PoultryClassLivestockInputTransformed,
  PoultryClassSharedInputTransformed,
} from '@/calculators/Poultry/types/poultry-class.input';
import {
  GrazingProductionSystemsWithRainfall,
  MeanAnnualTemperature,
  PoultryMMS1Type,
  PoultryMMS1Types,
  PoultryMMS1TypesWithPasture,
  PoultryMMS1TypeWithPasture,
  PoultryMMS2Type,
  PoultryMMS2Types,
  PoultryMMSTypeWithPasture,
  State,
} from '@/constants/enums';
import { isInLeachingZoneToFracWET } from '@/constants/translations';
import { HasConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { Container, root } from '@/tools/containers';
import { captureMethod1Or2Value } from '@/tools/multi';
import { oneMinus } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import {
  mass,
  Mass,
  massPerHeadPerDay,
  MassPerHeadPerDay,
  realNumber,
} from '@/tools/units';

const subscriptNotation: Record<PoultryMMSTypeWithPasture, string> = {
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
  poultryClass: PoultryClassSharedInputTransformed,
  constants: HasConstants<'POULTRY'>,
) =>
  captureMethod1Or2Value(
    selectConstant(
      constants.POULTRY,
      'CLASSES',
      poultryClass.className,
      'dryMatterIntake',
    ),
    poultryClass.method2DryMatterIntake,
  ).named(`Ij=${poultryClass.classNumber}`);

/**
 * Convenience wrapper for getting dry matter intake *Ij* for a class *j*
 */
const getDryMatterDigestibility = (
  poultryClass: PoultryClassLivestockInputTransformed,
  constants: HasConstants<'POULTRY'>,
) =>
  captureMethod1Or2Value(
    selectConstant(
      constants.POULTRY,
      'CLASSES',
      poultryClass.className,
      'dryMatterDigestibility',
    ),
    poultryClass.method2DryMatterDigestibility,
  ).named(`DMDj=${poultryClass.classNumber}`);

/**
 * Convenience wrapper for getting crude protein *CPj* for a class *j*
 */
const getCrudeProtein = (
  poultryClass: PoultryClassSharedInputTransformed,
  constants: HasConstants<'POULTRY'>,
) =>
  captureMethod1Or2Value(
    selectConstant(
      constants.POULTRY,
      'CLASSES',
      poultryClass.className,
      'crudeProtein',
    ),
    poultryClass.method2CrudeProtein,
  ).named(`CPj=${poultryClass.classNumber}`);

/**
 * Calculate volatile solid production rate *VSj* for a given class *j* (4.6.1.1 (5))
 */
const calculateVolatileSolidProduction = (
  poultryClass: PoultryClassLivestockInputTransformed,
  constants: HasConstants<'COMMON' | 'POULTRY'>,
) => {
  const dryMatterIntake = getDryMatterIntake(poultryClass, constants);

  const dryMatterDigestibility = getDryMatterDigestibility(
    poultryClass,
    constants,
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
    .multiply(oneMinus(ashContent))
    .switchUnit((v) => massPerHeadPerDay('Volatile Solids', v.store));
};

/**
 * Calculate the volatile solids *VSTj* produced by a class *j* that are transferred out (i.e. not lost)
 * of each manure management system used in stage 1 of manure treatment (4.6.1.1 (4)).
 *
 * Note that there is no second stage for manure applied to pasture range/paddocks.
 */
const calculateVolatileSolidsTransferredOutOfPrimarySystems = (
  poultryClass: PoultryClassLivestockInputTransformed,
  constants: HasConstants<'COMMON' | 'POULTRY'>,
): Record<PoultryMMS1Type, Container<MassPerHeadPerDay<'Volatile Solids'>>> => {
  const volatileSolids = calculateVolatileSolidProduction(
    poultryClass,
    constants,
  );
  /**
   * VSTjmT=2 = VSj * MMSjmT=1 * (1 - VSLmT=1)
   */
  const solidsTransferredOutOf = (mms: PoultryMMS1Type) => {
    const solidsIn = volatileSolids.multiply(
      poultryClass.manureAllocations[mms].manureAllocated,
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
  poultryClass: PoultryClassLivestockInputTransformed,
  state: Container<State>,
  meanAnnualTemperature: Container<MeanAnnualTemperature> | undefined,
  constants: HasConstants<'COMMON' | 'POULTRY' | 'LIVESTOCK'>,
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
  ).named(`B0j=${poultryClass.classNumber}`);

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
     * d) Poultry and Pigs pasture range and paddock should apply the drylot MCFs - source NIR
     */
    const defaultMCF = selectConstant(
      constants.POULTRY,
      'MMS',
      mms,
      'METHANE_CONVERSION_FACTOR_BY_STATE',
      state,
    );

    const customMCF =
      meanAnnualTemperature && mms !== 'pastureRangeAndPaddock'
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

    const allocation =
      mms !== 'pastureRangeAndPaddock'
        ? poultryClass.manureAllocations[mms].manureAllocated
        : poultryClass.manureAllocations.pastureRangeAndPaddock;

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
  poultryClass: PoultryClassLivestockInputTransformed,
  state: Container<State>,
  meanAnnualTemperature: Container<MeanAnnualTemperature> | undefined,
  constants: HasConstants<'COMMON' | 'POULTRY' | 'LIVESTOCK'>,
) => {
  const emissionsPotential = selectConstant(
    constants.POULTRY,
    'CLASSES',
    poultryClass.className,
    'emissionsPotential',
  ).named(`B0j=${poultryClass.classNumber}`);

  const densityOfMethane = selectConstant(
    constants.COMMON,
    'DENSITY_OF_METHANE',
  ).named(`𝜌`);

  const solidsTransferredOutOf =
    calculateVolatileSolidsTransferredOutOfPrimarySystems(
      poultryClass,
      constants,
    );

  const methaneProductionPerSystem = PoultryMMS2Types.map((mms2) => {
    const volatileSolidsInSystem = sum(
      PoultryMMS1Types.map((mms1) =>
        solidsTransferredOutOf[mms1].multiply(
          poultryClass.manureAllocations[mms1].treatmentStage2Allocations[mms2],
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
 * poultry class.
 */
export const calculateManureManagementCH4ForClass = (
  poultryClass: PoultryClassLivestockInputTransformed,
  state: Container<State>,
  meanAnnualTemperature: Container<MeanAnnualTemperature> | undefined,
  constants: HasConstants<'COMMON' | 'POULTRY' | 'LIVESTOCK'>,
) => {
  /**
   * ECH4 = SUM(j,k,m,T) Djk * MjkmT * Njk
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
        state,
        meanAnnualTemperature,
        constants,
      ),
    );

  return totalMethaneProductionPerBirdPerDay
    .multiply(poultryClass.head)
    .multiply(poultryClass.days)
    .named(`ECH4 (j=${poultryClass.classNumber})`)
    .reference('4.6.1.1 (1)');
};

/**
 * Calculate nitrogen intake rate 'NIj' for a given class 'j' (4.6.1.3 (5))
 */
const calculateNitrogenIntakeForClass = (
  poultryClass: PoultryClassSharedInputTransformed,
  constants: HasConstants<'COMMON' | 'POULTRY'>,
) => {
  const crudeProtein = getCrudeProtein(poultryClass, constants);

  const dryMatterIntake = getDryMatterIntake(poultryClass, constants);

  const crudeProteinToNitrogen = selectConstant(
    constants.COMMON,
    'NITROGEN_TO_PROTEIN',
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
  poultryClass: PoultryClassSharedInputTransformed,
  constants: HasConstants<'COMMON' | 'POULTRY'>,
) => {
  /**
   * NEjk = NIjk * (1 - NRjk)
   */
  const NRjk = selectConstant(
    constants.POULTRY,
    'CLASSES',
    poultryClass.className,
    'nitrogenRetentionRate',
  ).named(`NRj=${poultryClass.classNumber}`);
  return calculateNitrogenIntakeForClass(poultryClass, constants)
    .multiply(oneMinus(NRjk))
    .named(`NEj=${poultryClass.classNumber}`);
};

/**
 * Calculate *MNjmT=1* for each manure management system used in stage 1 of treatment
 * (4.6.1.3 (2))
 */
export const calculateNitrogenPerStage1MMSForClass = (
  poultryClass: PoultryClassSharedInputTransformed,
  constants: HasConstants<'COMMON' | 'POULTRY'>,
): Record<PoultryMMS1TypeWithPasture, Container<Mass<'N'>>> => {
  const { head, days, manureAllocations, classNumber } = poultryClass;

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
      .multiply(manureAllocations.manureWithLitter.manureAllocated)
      .named(`MNj=${classNumber}m=10T=1`),
    beltManureRemoval: annualNitrogenExcretion
      .multiply(manureAllocations.beltManureRemoval.manureAllocated)
      .named(`MNj=${classNumber}m=11aT=1`),
    manureStoredInHouse: annualNitrogenExcretion
      .multiply(manureAllocations.manureStoredInHouse.manureAllocated)
      .named(`MNj=${classNumber}m=11bT=1`),
    pastureRangeAndPaddock: annualNitrogenExcretion
      .multiply(manureAllocations.pastureRangeAndPaddock)
      .named(`MNj=${classNumber}m=14T=1`),
  };
};

/**
 * Calculate the mass of nitrogen *MNjmT=2* in each manure management system used in
 * stage 2 of treatment created by class *j* (4.6.1.3 (6))
 */
export const calculateNitrogenPerStage2MMSForClass = (
  poultryClass: PoultryClassSharedInputTransformed,
  nitrogenPerStage1MMS: Record<
    PoultryMMS1TypeWithPasture,
    Container<Mass<'N'>>
  >,
  constants: HasConstants<'COMMON' | 'POULTRY'>,
): Record<PoultryMMS2Type, Container<Mass<'N'>>> => {
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
          fractionNitrogenVolatised.switchUnit((v) => realNumber(v.store)),
        ).minus(
          nitrousOxideEmissionsFactor.switchUnit((v) => realNumber(v.store)),
        ),
      )
      .named(`NTj=${poultryClass.classNumber}m=${subscriptNotation[mms]}T=1`);
  };

  const nitrogenOutOfEachPrimarySystem = {
    manureWithLitter: nitrogenExitingPrimarySystem('manureWithLitter'),
    beltManureRemoval: nitrogenExitingPrimarySystem('beltManureRemoval'),
    manureStoredInHouse: nitrogenExitingPrimarySystem('manureStoredInHouse'),
  };

  const nitrogenEnteringSecondarySystem = (mms2: PoultryMMS2Type) => {
    const nFromEachPrimarySystem = PoultryMMS1Types.map((mms1) => {
      const n = nitrogenOutOfEachPrimarySystem[mms1]
        .multiply(
          poultryClass.manureAllocations[mms1].treatmentStage2Allocations[mms2],
        )
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
  poultryClass: PoultryClassSharedInputTransformed,
  climateZone: Container<'wet' | 'dry'>,
  constants: HasConstants<'COMMON' | 'POULTRY' | 'LIVESTOCK'>,
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

  const CN2O = selectConstant(constants.COMMON, 'ELEMENTAL_TO_MOLECULAR_N2O');

  /**
   * 4.6.1.3 (1): EN2O,dir = SUMj,k,m,T (MNjkmT * EFm * CN2O) * 10^-3
   *
   * NOTE: EFm=14 = 0, so no emissions from PRP are calculated here. 4.6.1.10 (1) covers
   * direct emissions from pasture.
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
      )
      .reference('4.6.1.3 (1)');
  });

  /**
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
      .multiply(CN2O)
      .named('EMN2O,PRP,dir')
      .reference('4.6.1.10 (1)');

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
  poultryClass: PoultryClassSharedInputTransformed,
  grazingSystem: Container<GrazingProductionSystemsWithRainfall>,
  constants: HasConstants<'COMMON' | 'POULTRY' | 'LIVESTOCK' | 'CROP'>,
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
    .multiply(EFN2O)
    .multiply(CN2O)
    .named(`E20,ad (j=${poultryClass.classNumber})`)
    .reference('4.6.1.5 (1)');
};

/**
 * Calculate emissions from leaching and runoff *EN2O,leach* from manure produced by a
 * poultry class (4.6.1.7 (1) and 4.6.1.14 (1))
 */
export const calculateLeachingAndRunoffN2OEmissionsForClass = (
  poultryClass: PoultryClassSharedInputTransformed,
  isInLeachingZone: Container<boolean>,
  constants: HasConstants<'COMMON' | 'POULTRY' | 'CROP'>,
) => {
  const fracWETSoil = isInLeachingZoneToFracWET(isInLeachingZone);
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

  const CN2O = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_N2O',
  ).named('CN2O');

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
 * Calculate the mass of nitrogen applicable to soils produced by a poultry class.
 * Nitrogen actually applied within the activity boundary is calculated in
 * `calculateMassOfNitrogenAppliedToSoilsForPoultry` (4.6.1.9)
 */
export const calculateMassOfNitrogenAppliedToSoilsForClass = (
  poultryClass: PoultryClassSharedInputTransformed,
  isInLeachingZone: Container<boolean>,
  constants: HasConstants<'COMMON' | 'POULTRY' | 'CROP'>,
) => {
  /**
   * MNSoilscope1 = (SUMj,m (MNjmT=2 * (1 - EFjm=1-13 - FracGASMjm=1-13) - Mleach,MMS) * PF
   *
   * Multiplication by PF is applied outside this function after summing the total for
   * each class.
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

  const fracWETSoil = isInLeachingZoneToFracWET(isInLeachingZone);
  const fracLeachMS = selectConstant(
    constants.CROP,
    'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF_SOLID_STORAGE',
  ).named('FracLeachMMS');

  /**
   * SUM (MNjmT=2 * (1 - EFjm=1-13 - FracGASMjm=1-13) - Mleach,MMS)
   */
  const nitrogenFromSecondarySystemsAppliedToSoils = PoultryMMS2Types.map(
    (mms) => {
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
            nitrousOxideEmissionsFactor.switchUnit((v) => realNumber(v.store)),
          ).minus(fracGASM.switchUnit((v) => realNumber(v.store))),
        )
        .minus(nitrogenLostThroughLeaching);
    },
  );

  return sum(nitrogenFromSecondarySystemsAppliedToSoils);
};
