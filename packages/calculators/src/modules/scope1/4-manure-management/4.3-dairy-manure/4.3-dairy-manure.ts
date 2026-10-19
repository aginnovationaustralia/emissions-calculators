import {
  DairyClassInputTransformed,
  DairyClassMatureInputTransformed,
  DairyClassWeanedInputTransformed,
  isClassPreWeaned,
} from '@/calculators/Dairy/types/dairy-class.input';
import {
  ClimateZoneType,
  DairyCattleBreed,
  DairyMMSType,
  DairyMMSTypes,
  DairyMMSTypesWithPasture,
  DairyMMSTypeWithPasture,
  GrazingProductionSystemsWithRainfall,
  MeanAnnualTemperature,
  State,
} from '@/constants/enums';
import { isInLeachingZoneToFracWET } from '@/constants/translations';
import { HasConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { br, Container, max, num, root } from '@/tools/containers';
import { captureMethod1Or2Value } from '@/tools/multi';
import { oneMinus, zero } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import {
  mass,
  Mass,
  MassPerHeadPerDay,
  massPerHeadPerDay,
  realNumber,
  RealNumber,
  volumePerHeadPerDay,
  VolumePerHeadPerDay,
} from '@/tools/units';
import { calculateNitrogenRetentionForCattle } from '../../shared/beef/calculate';
import {
  calculateOrGetFeedIntakeForDairy,
  calculateRelativeFeedIntakeForDairy,
} from '../../shared/dairy/calculate';
import {
  getCrudeProtein,
  getDryMatterDigestibility,
  getLengthOfStay,
  getLiveweight,
  getLiveweightGain,
  getProportionOfTimeSpentInLocationForHerd,
  getRelativeSize,
  getSolidSeparationRate,
} from '../../shared/dairy/helpers';
import {
  DairyHerdLivestockInputTransformed,
  DairyHerdSharedInputTransformed,
} from '../../shared/dairy/input';
import { ConstantsForDairyManure } from './constants';

const subscriptNotation = {
  anaerobicLagoon: '1',
  sumpDispersal: '3a',
  drainToPaddock: '3b',
  solidStorage: '4',
  pastureRangeAndPaddock: '14',
};

/**
 * Calculate values of *MMSm* per system *m*. These values only apply
 * to manure produced by milking cows (j=1). From Chapter 4.3:
 *
 * > Nitrous oxide emissions from managed manure are only relevant for milking cows
 * > (j=1). The manure management systems (m) will differ for manure excreted while
 * > animals are grazing or in the milking shed or feedpad. Manure from other dairy
 * > cattle classes (j=2-5) is all assumed to be excreted to pasture (m=14)
 */
export const calculateManureAllocations = (
  herdInput: DairyHerdSharedInputTransformed,
  constants: HasConstants<'DAIRY'>,
): Record<DairyMMSTypeWithPasture, Container<RealNumber>> => {
  const timeSpentInLocations = getProportionOfTimeSpentInLocationForHerd(
    herdInput,
    constants,
  );
  const { milkingShedMMSAllocation, feedPadMMSAllocation } =
    herdInput.manureAllocations;

  /**
   * The maths here is only given in an example in the description of the MMSm input
   * value in section 4.3.2.2:
   *
   * > The annual fraction of time spent in the milking shed and on the feedpad are used
   * > to allocate manure to different MMS.
   * > ...
   * > For example, for a grazing-only system (MMSjm=14 = 0.89) where 50% of the waste
   * > from the milking shed is drained to paddocks and the remaining 50% is spread a
   * > through sump and dispersal system:
   * >
   * > MMSjm=3a = 0.11*0.50 = 0.055
   * >
   * > MMSjm=3b = 0.11*0.50 = 0.055
   */
  const allocation = (mms: Exclude<DairyMMSType, 'pastureRangeAndPaddock'>) => {
    const fromMilkingShed = milkingShedMMSAllocation[mms].multiply(
      timeSpentInLocations.milkingShed,
    );
    const fromFeedpad = feedPadMMSAllocation[mms].multiply(
      timeSpentInLocations.feedpad,
    );
    return fromMilkingShed
      .plus(fromFeedpad)
      .named(`MMSm=${subscriptNotation[mms]}`);
  };

  return {
    anaerobicLagoon: allocation('anaerobicLagoon'),
    sumpDispersal: allocation('sumpDispersal'),
    drainToPaddock: allocation('drainToPaddock'),
    solidStorage: allocation('solidStorage'),
    /**
     * 4.3.2.2: The fraction of volatile solids voided to pasture (MMSjm=14) is equal to
     * the annual fraction of time spent on pasture in the provided table.
     */
    pastureRangeAndPaddock: timeSpentInLocations.pasture,
  };
};

/**
 * Calculate volatile solid production *VSj* for a mature or weaned
 * dairy class *j*.
 *
 * There are fixed constants for pre-weaned cattle, however, they aren't used in
 * calculating CH4 emissions.
 */
const calculateVolatileSolidsForClass = (
  dairyClass:
    DairyClassMatureInputTransformed | DairyClassWeanedInputTransformed,
  milkProduction: Container<VolumePerHeadPerDay<'Milk'>>,
  breed: Container<DairyCattleBreed>,
  constants: ConstantsForDairyManure,
) => {
  const dryMatterDigestibility = getDryMatterDigestibility(
    dairyClass,
    constants,
  );

  const feedIntake = calculateOrGetFeedIntakeForDairy(
    dairyClass,
    milkProduction,
    breed,
    constants,
  );

  const ashContent = selectConstant(
    constants.LIVESTOCK,
    'ASH_CONTENT_OF_MANURE',
    'dairy',
  ).named(`A`);

  const volatileSolids = br(
    feedIntake
      .multiply(oneMinus(dryMatterDigestibility))
      .plus(br(num(0.04).multiply(feedIntake))),
  ).multiply(oneMinus(ashContent));

  return volatileSolids
    .switchUnit((v) => massPerHeadPerDay('Volatile Solids', v.store))
    .named(`VSj=${dairyClass.number}`)
    .reference('4.3.1.1 (3)');
};

/**
 * Calculate the fraction of volatile solids *FVSm* sent to each manure management
 * system, taking solid separation into account. These values only apply
 * to manure produced by milking cows (j=1). From Chapter 4.3:
 *
 * > Nitrous oxide emissions from managed manure are only relevant for milking cows
 * > (j=1). The manure management systems (m) will differ for manure excreted while
 * > animals are grazing or in the milking shed or feedpad. Manure from other dairy
 * > cattle classes (j=2-5) is all assumed to be excreted to pasture (m=14)
 */
export const calculateFractionOfVolatileSolidsPerMMS = (
  herdInput: DairyHerdLivestockInputTransformed,
  constants: HasConstants<'DAIRY'>,
): Record<DairyMMSTypeWithPasture, Container<RealNumber>> => {
  const resolvedAllocations = calculateManureAllocations(herdInput, constants);

  const solidSeparationRate = getSolidSeparationRate(
    herdInput.manureAllocations,
    constants,
  );

  /**
   * FVSjm=4 = MMSjm=4 + (MMSjm=1,7,9 * SSm)
   *
   * NOTE: m=7 (covered anaerobic lagoons) and m=9 (pit storage) do not apply here; solid
   * separation is only associated with uncovered anaerobic lagoons out of the options
   * given for dairy cattle manure management. So, presumably, this should be:
   *
   * FVSjm=4 = MMSjm=4 + (MMSjm=1 * SSm)
   */
  const solidStorageIncludingSeparatedSolids = resolvedAllocations.solidStorage
    .plus(resolvedAllocations.anaerobicLagoon.multiply(solidSeparationRate))
    .named(`FVSjm=4`)
    .reference('4.3.1.1 (5)');

  /**
   * FVSjm = MMSjm * (1 - SSm)
   *
   * NOTE: Following the above, and in order for all FVSjm to sum to 1, this should
   * only apply to m=1 (i.e, uncovered anaerobic lagoons). This assumption will need
   * double checking.
   */
  const anaerobicLagoonExcludingSeparatedSolids =
    resolvedAllocations.anaerobicLagoon
      .multiply(oneMinus(solidSeparationRate))
      .named(`FVSjm=1`)
      .reference('4.3.1.1 (4)');

  return {
    sumpDispersal: resolvedAllocations.sumpDispersal,
    drainToPaddock: resolvedAllocations.drainToPaddock,
    pastureRangeAndPaddock: resolvedAllocations.pastureRangeAndPaddock,
    solidStorage: solidStorageIncludingSeparatedSolids,
    anaerobicLagoon: anaerobicLagoonExcludingSeparatedSolids,
  };
};

/**
 * Calculate the nitrogen retention rate *NRj* for a dairy class *j*.
 */
const calculateNitrogenRetentionRateForClass = (
  dairyClass: DairyClassInputTransformed,
  milkProduction: Container<VolumePerHeadPerDay<'Milk'>>,
  breed: Container<DairyCattleBreed>,
  constants: ConstantsForDairyManure,
): Container<MassPerHeadPerDay<'N'>> => {
  const milkDensity = selectConstant(
    constants.DAIRY,
    'MILK_CONSTANTS',
    'DENSITY_OF_MILK',
  );

  const relativeIntake = calculateRelativeFeedIntakeForDairy(
    dairyClass,
    milkProduction,
    breed,
    constants,
  )
    .named(`Lj=${dairyClass.number}`)
    .reference('4.3.1.3 (7)');

  const relativeSize = getRelativeSize(dairyClass, breed, constants);

  const liveweightGain = getLiveweightGain(dairyClass, constants);

  /**
   * MPj * 1.03
   *
   * Note that 1.03 is the density of milk; this gives us milk production in kilograms
   * per head per day rather than litres.
   */
  const milkProductionByMass = (
    dairyClass.className === 'milkingCows'
      ? milkProduction
      : root(volumePerHeadPerDay('Milk', 0))
  ).multiply(milkDensity);

  /**
   * The rest of this equation is evaluated in this shared function.
   */
  return calculateNitrogenRetentionForCattle(
    milkProductionByMass,
    relativeIntake,
    relativeSize,
    liveweightGain,
    constants,
  )
    .named(`NRj=${dairyClass.number}`)
    .reference('4.3.1.3 (6)');
};

/**
 * Calculate the nitrogen excretion rate *NEj* for a dairy class *j*.
 */
const calculateNitrogenExcretionForClass = (
  dairyClass: DairyClassInputTransformed,
  milkProduction: Container<VolumePerHeadPerDay<'Milk'>>,
  breed: Container<DairyCattleBreed>,
  constants: ConstantsForDairyManure,
): Container<MassPerHeadPerDay<'N'>> => {
  if (isClassPreWeaned(dairyClass)) {
    return selectConstant(
      constants.DAIRY,
      'CLASSES',
      dairyClass.className,
      'nitrogenExcreted',
    ).named(`NPW,j=${dairyClass.number}`);
  }

  const metabolicLiveweight = getLiveweight(dairyClass, breed, constants).power(
    num(0.75),
  );

  const nitrogenRetentionRate = calculateNitrogenRetentionRateForClass(
    dairyClass,
    milkProduction,
    breed,
    constants,
  );

  const crudeProteinIntake = calculateOrGetFeedIntakeForDairy(
    dairyClass,
    milkProduction,
    breed,
    constants,
  )
    .multiply(getCrudeProtein(dairyClass, constants))
    .named(`CPIj=${dairyClass.number}`)
    .reference('4.3.1.3 (5)');

  const nitrogenToCrudeProtein = selectConstant(
    constants.COMMON,
    'NITROGEN_TO_PROTEIN',
  );

  const nitrogenExcretion = crudeProteinIntake
    .divide(nitrogenToCrudeProtein)
    .minus(nitrogenRetentionRate)
    .minus(
      br(
        num(1.1e-4)
          .multiply(metabolicLiveweight)
          .switchUnit((v) => massPerHeadPerDay('CrudeProtein', v.store))
          .divide(nitrogenToCrudeProtein),
      ),
    )
    .named(`NEj=${dairyClass.number}`)
    .reference('4.3.1.3 (4)');

  return max(nitrogenExcretion, zero);
};

/**
 * Calculate the annual nitrogen excretion *AEj* for a dairy class *j*.
 */
const calculateAnnualNitrogenExcretionForClass = (
  dairyClass: DairyClassInputTransformed,
  milkProduction: Container<VolumePerHeadPerDay<'Milk'>>,
  breed: Container<DairyCattleBreed>,
  constants: ConstantsForDairyManure,
): Container<Mass<'N'>> => {
  return calculateNitrogenExcretionForClass(
    dairyClass,
    milkProduction,
    breed,
    constants,
  )
    .multiply(dairyClass.head)
    .multiply(getLengthOfStay(dairyClass, constants))
    .named(`AEj=${dairyClass.number}`);
};

/**
 * Calculates the amount of nitrogen *MNjm* produced by a class *j* allocated to system
 * *m* using given allocation proportions.
 */
const calculateNitrogenPerMMSForClass = (
  dairyClass: DairyClassInputTransformed,
  milkProduction: Container<VolumePerHeadPerDay<'Milk'>>,
  breed: Container<DairyCattleBreed>,
  manureAllocations: Record<DairyMMSTypeWithPasture, Container<RealNumber>>,
  constants: ConstantsForDairyManure,
): Record<DairyMMSTypeWithPasture, Container<Mass<'N'>>> => {
  const annualNitrogenExcretion = calculateAnnualNitrogenExcretionForClass(
    dairyClass,
    milkProduction,
    breed,
    constants,
  );

  return {
    anaerobicLagoon: annualNitrogenExcretion
      .multiply(manureAllocations.anaerobicLagoon)
      .named(`MNj=${dairyClass.number}m=1`),
    sumpDispersal: annualNitrogenExcretion
      .multiply(manureAllocations.sumpDispersal)
      .named(`MNj=${dairyClass.number}m=3a`),
    drainToPaddock: annualNitrogenExcretion
      .multiply(manureAllocations.drainToPaddock)
      .named(`MNj=${dairyClass.number}m=3b`),
    solidStorage: annualNitrogenExcretion
      .multiply(manureAllocations.solidStorage)
      .named(`MNj=${dairyClass.number}m=4`),
    pastureRangeAndPaddock: annualNitrogenExcretion
      .multiply(manureAllocations.pastureRangeAndPaddock)
      .named(`MNj=${dairyClass.number}m=14`),
  };
};

/**
 * Calculate methane emissions *ECH4* produced by a dairy class *j* (4.3.1.1/4.3.1.2)
 */
export const calculateManureManagementCH4ForClass = (
  dairyClass: DairyClassInputTransformed,
  milkProduction: Container<VolumePerHeadPerDay<'Milk'>>,
  breed: Container<DairyCattleBreed>,
  fractionOfVolatileSolidsPerSystem: Record<
    DairyMMSTypeWithPasture,
    Container<RealNumber>
  >,
  state: Container<State>,
  meanAnnualTemperature: Container<MeanAnnualTemperature> | undefined,
  constants: ConstantsForDairyManure,
) => {
  const days = getLengthOfStay(dairyClass, constants);
  const head = dairyClass.head;

  if (isClassPreWeaned(dairyClass)) {
    const methaneProduction = selectConstant(
      constants.DAIRY,
      'CLASSES',
      dairyClass.className,
      'methaneProduction',
    ).named(`MPWmanure,j=${dairyClass.number}`);

    /**
     * (Nj=3,5 * MPWmanure,j=3,5 * Dj=3,5)
     */
    return methaneProduction.multiply(head).multiply(days);
  }

  const volatileSolids = calculateVolatileSolidsForClass(
    dairyClass,
    milkProduction,
    breed,
    constants,
  );

  const emissionsPotential = selectConstant(
    constants.LIVESTOCK,
    'EMISSIONS_POTENTIAL_VOLATILE_SOLIDS_TO_CH4',
    'dairy',
  ).named('B0');

  const densityOfMethane = selectConstant(
    constants.COMMON,
    'DENSITY_OF_METHANE',
  ).named(`𝜌`);

  const methaneProductionPerSystem = DairyMMSTypesWithPasture.map((mms) => {
    const defaultMCF = selectConstant(
      constants.DAIRY,
      'MMS',
      mms,
      'METHANE_CONVERSION_FACTOR_BY_STATE',
      state,
    );

    const customMCF =
      meanAnnualTemperature !== undefined && mms !== 'pastureRangeAndPaddock'
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
      .multiply(fractionOfVolatileSolidsPerSystem[mms])
      .multiply(emissionsPotential)
      .multiply(densityOfMethane)
      .multiply(methaneConversionFactor)
      .named(`Mj=${dairyClass.number}m=${subscriptNotation[mms]}`)
      .reference('4.3.1.1 (2)');
  });

  return sum(methaneProductionPerSystem)
    .multiply(head)
    .multiply(days)
    .named(`ECH4 (j=${dairyClass.number})`)
    .reference('4.3.1.1 (1)');
};

/**
 * Calculate direct nitrous oxide emissions *EN2O,dir* produced by a dairy class *j*
 * (4.3.1.3/4.3.1.4 & 4.3.1.9)
 */
export const calculateDirectN2OEmissionsForClass = (
  dairyClass: DairyClassInputTransformed,
  milkProduction: Container<VolumePerHeadPerDay<'Milk'>>,
  breed: Container<DairyCattleBreed>,
  manureAllocations: Record<DairyMMSTypeWithPasture, Container<RealNumber>>,
  climateZone: Container<ClimateZoneType>,
  constants: ConstantsForDairyManure,
) => {
  const nitrogenPerMMS = calculateNitrogenPerMMSForClass(
    dairyClass,
    milkProduction,
    breed,
    manureAllocations,
    constants,
  );

  const CN2O = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_N2O',
  ).named('CN2O');

  /**
   * EN2O,dir = SUM[m,j] (MNjm * EFPRP * CN2O) * 10^-3
   */
  const directN2OPerMMS = DairyMMSTypesWithPasture.map((mms) => {
    const EFm = selectConstant(constants.DAIRY, 'MMS', mms, 'EFm');
    return nitrogenPerMMS[mms]
      .multiply(EFm)
      .multiply(CN2O)
      .named(`EN2O,dir (j=${dairyClass.number}, m=${subscriptNotation[mms]})`)
      .reference('4.3.1.3 (1)');
  });

  const EFprp = selectConstant(
    constants.LIVESTOCK,
    'EF_DEPOSITED_URINE_AND_DUNG_PRP',
    climateZone,
  ).named(`EFprp (${climateZone})`);

  /**
   * EN2O,dir = SUM[j] (MNjm=14 * EFPRP * CN2O) * 10^-3
   */
  const directN2OFromPasture = nitrogenPerMMS.pastureRangeAndPaddock
    .multiply(EFprp)
    .multiply(CN2O)
    .named(`EN2O,dir (j=${dairyClass.number}, PRP; m=14)`)
    .reference('4.3.1.3 (1)');

  return sum(directN2OPerMMS)
    .plus(directN2OFromPasture)
    .named(`EN2O,dir (j=${dairyClass.number})`);
};

/**
 * Calculate nitrous oxide emissions from atmospheric deposition *EN2O,ad* produced by a
 * dairy class *j* (4.3.1.5 & 4.3.1.10/4.3.1.11)
 */
export const calculateAtmosphericDepositionN2OEmissionsForClass = (
  dairyClass: DairyClassInputTransformed,
  milkProduction: Container<VolumePerHeadPerDay<'Milk'>>,
  breed: Container<DairyCattleBreed>,
  manureAllocations: Record<DairyMMSTypeWithPasture, Container<RealNumber>>,
  grazingSystem: Container<GrazingProductionSystemsWithRainfall>,
  constants: ConstantsForDairyManure,
) => {
  const nitrogenPerMMS = calculateNitrogenPerMMSForClass(
    dairyClass,
    milkProduction,
    breed,
    manureAllocations,
    constants,
  );

  const EFN2O = selectConstant(
    constants.CROP,
    'EF_N2O_ATMOSPHERIC_DEPOSITION_PRODUCTION_SYSTEM',
    grazingSystem,
  ).named('EFN2O');

  const CN2O = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_N2O',
  ).named('CN2O');

  const volatilisedNitrogenPerMMS = DairyMMSTypes.map((mms) => {
    const fracGASM = selectConstant(
      constants.DAIRY,
      'MMS',
      mms,
      'FracGASM',
    ).named(`FracGASMm=${subscriptNotation[mms]}`);
    /**
     * EN2O,ad = SUM[m,j] MNjm * EFN2O * CN2O * 10^-3
     *
     * (excluding m=14)
     */
    return nitrogenPerMMS[mms]
      .multiply(fracGASM)
      .named(`MNATMOS (j=${dairyClass.number}, m=${subscriptNotation[mms]})`);
  });
  const volatilisedNitrogen = sum(volatilisedNitrogenPerMMS).named(
    `MNATMOS (j=${dairyClass.number})`,
  );

  const fracGASMsoil = selectConstant(
    constants.CROP,
    'FRACTION_N_VOLATILISED_ORGANIC_FERTILISER',
  ).named('FracGASMsoil');

  /**
   * Mvol,m=14 = SUM[j] (MNjm=14 * FracGASMsoil)
   */
  const volatilisedNitrogenFromPasture = nitrogenPerMMS.pastureRangeAndPaddock
    .multiply(fracGASMsoil)
    .named('Mvol,m=14');

  /**
   * EN2O,MMS,ad = MNATMOS * EFN2O * CN2O * 10^-3
   *
   * EN2O,ad = Mvol,m=14 * EFN2O * CN2O * 10^-3
   */
  return br(volatilisedNitrogen.plus(volatilisedNitrogenFromPasture))
    .multiply(EFN2O)
    .multiply(CN2O)
    .named(`EN2O,ad`)
    .reference('4.3.1.5 (1)');
};

/**
 * Calculate nitrous oxide emissions from leaching and runoff *EN2O,ad* produced by a
 * dairy class *j* (4.3.1.6/4.3.1.7 combined with 4.3.1.12/4.3.1.13)
 */
export const calculateLeachingAndRunoffN2OEmissionsForClass = (
  dairyClass: DairyClassInputTransformed,
  milkProduction: Container<VolumePerHeadPerDay<'Milk'>>,
  breed: Container<DairyCattleBreed>,
  manureAllocations: Record<DairyMMSTypeWithPasture, Container<RealNumber>>,
  isInLeachingZone: Container<boolean>,
  constants: ConstantsForDairyManure,
) => {
  const nitrogenPerMMS = calculateNitrogenPerMMSForClass(
    dairyClass,
    milkProduction,
    breed,
    manureAllocations,
    constants,
  );

  const fracWET = isInLeachingZoneToFracWET(isInLeachingZone);
  const fracLeachMS = selectConstant(
    constants.CROP,
    'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF_SOLID_STORAGE',
  ).named('FracLeachMMS');
  const fracLeach = selectConstant(
    constants.CROP,
    'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF',
  ).named('FracLeach');

  /**
   * MNLeachjm=4 = MNjm=4 * FracWETi * FracLEACHMS
   */
  const nitrogenLostInSolidStorage = nitrogenPerMMS.solidStorage
    .multiply(fracWET)
    .multiply(fracLeachMS);

  /**
   * MNleachjm=14 = (MNjm=14 * FracWet * FracLEACH)
   */
  const nitrogenLostInPasture = nitrogenPerMMS.pastureRangeAndPaddock
    .multiply(fracWET)
    .multiply(fracLeach);

  const EFleach = selectConstant(
    constants.CROP,
    'EF_N2O_LEACHING_AND_RUNOFF',
  ).named(`EFleach`);

  const CN2O = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_N2O',
  ).named('CN2O');

  /**
   * EN2O,leach = MNLeachjm=4 * EFleach * CN2O * 10^-3
   */
  return br(nitrogenLostInSolidStorage.plus(nitrogenLostInPasture))
    .multiply(EFleach)
    .multiply(CN2O)
    .named(`EN2O,leach (j=${dairyClass.number})`)
    .reference('4.3.1.6 (1)');
};

/**
 * Calculate nitrogen applicable to soil produced by a dairy class. The mass of nitrogen
 * actually applied to soil is calculated in
 * `calculateMassOfNitrogenAppliedToSoilsForDairyHerd` (4.3.1.8)
 */
export const calculateMassOfNitrogenAppliedToSoilsForClass = (
  dairyClass: DairyClassInputTransformed,
  milkProduction: Container<VolumePerHeadPerDay<'Milk'>>,
  breed: Container<DairyCattleBreed>,
  manureAllocations: Record<DairyMMSTypeWithPasture, Container<RealNumber>>,
  isInLeachingZone: Container<boolean>,
  constants: ConstantsForDairyManure,
) => {
  const nitrogenPerMMS = calculateNitrogenPerMMSForClass(
    dairyClass,
    milkProduction,
    breed,
    manureAllocations,
    constants,
  );

  const fracWET = isInLeachingZoneToFracWET(isInLeachingZone);
  const fracLeachMS = selectConstant(
    constants.CROP,
    'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF_SOLID_STORAGE',
  ).named('FracLeachMMS');

  const applicableNitrogenPerMMS = DairyMMSTypes.map((mms) => {
    const fracGASM = selectConstant(
      constants.DAIRY,
      'MMS',
      mms,
      'FracGASM',
    ).named(`FracGASMm=${subscriptNotation[mms]}`);
    const EFm = selectConstant(constants.DAIRY, 'MMS', mms, 'EFm').named(
      `EFm=${subscriptNotation[mms]}`,
    );

    /**
     * MNLeachjm=4 = MNjkm=4T=1 * FracWET * FracLEACHMS
     */
    const nitrogenLostThroughLeaching = (
      mms === 'solidStorage'
        ? nitrogenPerMMS[mms].multiply(fracWET).multiply(fracLeachMS)
        : root(mass('N', 0))
    ).named(`Mleach,m=${subscriptNotation[mms]}`);

    return nitrogenPerMMS[mms]
      .multiply(
        oneMinus(EFm.switchUnit((v) => realNumber(v.store))).minus(
          fracGASM.switchUnit((v) => realNumber(v.store)),
        ),
      )
      .minus(nitrogenLostThroughLeaching);
  });

  const manureAppliedToSoil = sum(applicableNitrogenPerMMS);
  return manureAppliedToSoil;
};
