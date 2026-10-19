import { ExecutionContext } from '@/calculators/executionContext';
import { isSheepClassPeriodInputWithProportionLambsBorn } from '@/calculators/Sheep/types/sheep-class-period.input';
import { HasIsFebruaryInLeapYearInputTransformed } from '@/calculators/types/has-is-february-in-leap-year.input';
import { HasConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { br, max, num, NumberContainer, root } from '@/tools/containers';
import { ifTrueElse } from '@/tools/if-else';
import { captureMethod1Or2Value } from '@/tools/multi';
import {
  daysInYear,
  e,
  one,
  oneMinus,
  tenToPowMinus3,
  zero,
} from '@/tools/sentinels';
import {
  MassPerHeadPerDay,
  massPerHeadPerDay,
  realNumber,
} from '@/tools/units';
import {
  calculateDailyFeedIntakeIjk,
  calculateProportionLactatingLEjk,
} from '../../shared/sheep/calculate';
import {
  calculateForAllClassPeriods,
  getDryMatterDigestibility,
  getDurationDays,
  getLiveweight,
  getLiveweightGain,
  SheepPeriodProps,
} from '../../shared/sheep/helpers';
import { SheepManureAndEntericHerdInputTransformed } from '../../shared/sheep/input';

type ConstantsForSheepManure = HasConstants<
  'SHEEP' | 'COMMON' | 'CROP' | 'LIVESTOCK'
>;

/**
 * Calculates CH4 emissions produced by a class *k* in period *j*.
 */
function calculateManureManagementCH4ForClassPeriod(
  periodProps: SheepPeriodProps,
) {
  const { flock, className, periodName, periodInput, context } = periodProps;
  const { constants } = context;

  const { state, excludedFromNaturalWater, method2MeanAnnualTemperature } =
    flock;

  const Ijk = calculateDailyFeedIntakeIjk(periodProps).named(
    `Ij=${periodName},k=${className}`,
  );

  const DMDjk = getDryMatterDigestibility(periodProps);

  const ashContentOfManureA = selectConstant(
    constants.LIVESTOCK,
    'ASH_CONTENT_OF_MANURE',
    'sheep',
  ).named('A');

  /**
   * VSjk = (Ijk * ((1 - DMDjk) + (0.04 * Ijk))) * ( 1 - A )
   */

  const VSjk = Ijk.multiply(
    oneMinus(DMDjk)
      .plus(Ijk.multiply(num(0.04)))
      .switchUnit((u) => realNumber(u.store)),
  )
    .multiply(oneMinus(ashContentOfManureA))
    .switchUnit((u) => massPerHeadPerDay('Volatile Solids', u.store))
    .named(`VSj=${periodName},k=${className}`)
    .reference('4.4.1.1 (3)');

  const B0 = selectConstant(
    constants.LIVESTOCK,
    'EMISSIONS_POTENTIAL_VOLATILE_SOLIDS_TO_CH4',
    'sheep',
  ).named('B0');

  const MMSm1 = ifTrueElse(
    excludedFromNaturalWater,
    num(0),
    selectConstant(constants.SHEEP, 'MMS', state, 'Lagoon'),
  ).named('MMSm=1');

  const MMSm14 = ifTrueElse(
    excludedFromNaturalWater,
    num(1),
    selectConstant(constants.SHEEP, 'MMS', state, 'PRP'),
  ).named('MMSm=14');

  // Uncovered anaerobic lagoon
  const defaultMCFm1 = selectConstant(
    constants.SHEEP,
    'MCF_LAGOON',
    state,
  ).named('MCFm=1');

  const MCFm1 = captureMethod1Or2Value(
    defaultMCFm1,
    method2MeanAnnualTemperature
      ? selectConstant(
          constants.LIVESTOCK,
          'MANURE_MANAGEMENT_METHANE_CONVERSION_FACTORS',
          'anaerobicLagoon',
          method2MeanAnnualTemperature,
        )
      : undefined,
  ).named('MCFm=1');

  // Pasture, range and paddock
  const MCFm14 = captureMethod1Or2Value(
    selectConstant(constants.SHEEP, 'MCF_PRP'),
    method2MeanAnnualTemperature
      ? selectConstant(
          constants.LIVESTOCK,
          'MANURE_MANAGEMENT_METHANE_CONVERSION_FACTORS',
          'pastureRangeAndPaddock',
          method2MeanAnnualTemperature,
        )
      : undefined,
  ).named('MCFm=14');

  const p = selectConstant(constants.COMMON, 'DENSITY_OF_METHANE').named('p');

  /**
   * Mjkm = VSjk * B0 * MMSm * MCFim * 𝜌
   */
  const Mjkm1 = VSjk.multiply(B0)
    .multiply(MMSm1)
    .multiply(MCFm1)
    .multiply(p)
    .named(`Mj=${periodName},k=${className},m=1`);
  const Mjkm14 = VSjk.multiply(B0)
    .multiply(MMSm14)
    .multiply(MCFm14)
    .multiply(p)
    .named(`Mj=${periodName},k=${className},m=14`);

  const totalMethaneProductionRate = Mjkm1.plus(Mjkm14)
    .named(`Mj=${periodName},k=${className}`)
    .reference('4.4.1.1 (2)');

  const head = periodInput.head.named(`Njk=${className}`);
  const days = getDurationDays(periodProps);
  return totalMethaneProductionRate
    .multiply(head)
    .multiply(days)
    .reference('4.4.1.1 (1)');
}

/**
 * Calculate methane emissions *ECH4* produced by a sheep flock (4.4.1.1/4.4.1.2)
 */
export function calculateManureManagementCH4ForSheepFlock(
  flock: SheepManureAndEntericHerdInputTransformed &
    HasIsFebruaryInLeapYearInputTransformed,
  context: ExecutionContext<ConstantsForSheepManure>,
) {
  return calculateForAllClassPeriods(
    {
      flock,
      context,
    },
    calculateManureManagementCH4ForClassPeriod,
    {
      classResultName: (className) => `ECH4=${className}`,
      flockResultName: 'ECH4 (flock)',
      isFebruaryInLeapYear: flock.isFebruaryInLeapYear,
    },
  );
}

/**
 * Calculates the nitrogen retention rate *NRjk* for sheep in class *k* in period *j*
 * (4.4.1.3 (6))
 */
function calculateNitrogenRetentionForSheep(periodProps: SheepPeriodProps) {
  const { flock, className, periodName, context } = periodProps;

  const { constants } = context;
  const classInput = flock.classes[className];
  if (!classInput) {
    return root(massPerHeadPerDay('N', 0)).named(
      `NRjk=${className},${periodName}`,
    );
  }
  const { greasyWoolProduction, cleanWoolYieldProportion } = classInput;
  const { state } = flock;

  const LEjk = calculateProportionLactatingLEjk(periodProps);

  const milkProductionForLambingEwe = selectConstant(
    constants.SHEEP,
    'MILK_PRODUCTION',
  );
  const MPjk = LEjk.multiply(milkProductionForLambingEwe)
    .named(`MPjk=${className},${periodName}`)
    .reference('4.4.1.3 (7)');

  const WPk = greasyWoolProduction
    .multiply(cleanWoolYieldProportion)
    .divide(daysInYear)
    .named(`WPk=${className}`)
    .reference('4.4.1.3 (8)');

  const LWGjk = getLiveweightGain(periodProps);
  const EBGjk = LWGjk.multiply(num(0.92))
    .named(`EBGjk=${className},${periodName}`)
    .reference('4.4.1.3 (9)');

  const SRWk = selectConstant(
    constants.SHEEP,
    'SEASONAL_FACTORS',
    state,
    className,
    'standardReferenceWeight',
  ).named(`SRWk=${className},${periodName}`);

  const Wjk = getLiveweight(periodProps);

  const Zjk = Wjk.divide(SRWk)
    .named(`Zjk=${className},${periodName}`)
    .reference('4.4.1.3 (10)');

  const crudeProteinPerNitrogen = selectConstant(
    constants.COMMON,
    'NITROGEN_TO_PROTEIN',
  );

  const proteinInEweMilk = selectConstant(constants.SHEEP, 'MILK_PROTEIN');
  /**
   * (0.045 * MPjk=3,4)
   * MILK_PROTEIN = 0.045
   */
  const nitrogenRetainedForMilk = br(MPjk.multiply(proteinInEweMilk));

  const proteinInGreasyWool = selectConstant(constants.SHEEP, 'WOOL_PROTEIN');
  /**
   * (WPk * 0.84)
   * WOOL_PROTEIN = 0.84
   */
  const nitrogenRetainedForWool = br(WPk.multiply(proteinInGreasyWool));

  const nitrogenRetainedForWeight = num(4).multiply(
    br(
      EBGjk.multiply(num(1000))
        .divide(num(4).multiply(SRWk.power(num(0.75))))
        .switchUnit((u) => realNumber(u.store))
        .minus(one),
    ),
  );
  const NRrelativeSize = one.plus(
    e.power(num(-6).multiply(Zjk.minus(num(0.4)))),
  );

  /**
   * NRijk = (
   *  (0.045 * MPjk=3,4) +
   *  (WPk * 0.84) +
   *  (EBGjk * ((212 - 4 * ((EBGjk * 1000)/(4* SRWk^0.75) - 1)) - ((140 - 4 * (((EBGjk * 1000)/4*SRWk^0.75) - 1))/(1 + e ^ (-6 * (Zjk - 0.4)))))) * 10^-3
   * ) / 6.25
   */
  const NRjk = br(
    nitrogenRetainedForMilk.plus(nitrogenRetainedForWool).plus(
      br(
        EBGjk.multiply(
          br(num(212).minus(nitrogenRetainedForWeight)).minus(
            br(num(140).minus(nitrogenRetainedForWeight)).divide(
              NRrelativeSize,
            ),
          ),
        ).switchUnit((u) => realNumber(u.store)),
      )
        .multiply(tenToPowMinus3)
        // Unit switch to make compatible with the rest of the sum
        .switchUnit((u) => massPerHeadPerDay('CrudeProtein', u.store)),
    ),
  )
    .divide(crudeProteinPerNitrogen)
    .named(`NRj=${className},k=${periodName}`)
    .reference('4.4.1.3 (6)');

  return NRjk;
}

/**
 * Calculates the milk intake *MCjk* for sheep in class *k* in period *j* (4.4.1.3 (5))
 */
function calculateMilkIntakeMCjk(
  periodProps: Pick<
    SheepPeriodProps,
    'className' | 'periodInput' | 'periodName' | 'context'
  >,
): NumberContainer<MassPerHeadPerDay<'Milk'>> {
  const { className, periodInput, periodName, context } = periodProps;
  const { constants } = context;
  if (!isSheepClassPeriodInputWithProportionLambsBorn(periodInput)) {
    return root(massPerHeadPerDay('Milk', 0)).named(
      `MCjk=${className},${periodName}`,
    );
  }
  const { proportionOfLambsBorn } = periodInput;

  const milkIntakeForLambs = selectConstant(constants.SHEEP, 'MILK_PRODUCTION');

  return proportionOfLambsBorn
    .multiply(milkIntakeForLambs)
    .named(`MCjk=${className},${periodName}`)
    .reference('4.4.1.3 (5)');
}

/**
 * Calculates crude protein intake *CPIjk* for sheep in class *k* in period *j*
 * (4.4.1.3 (6))
 */
function calculateCrudeProteinIntakeCPIjk(periodProps: SheepPeriodProps) {
  const { flock, className, periodInput, periodName, seasonName, context } =
    periodProps;
  const { constants } = context;
  const { state } = flock;
  const { method2CrudeProteinContent } = periodInput;
  const Ijk = calculateDailyFeedIntakeIjk(periodProps);

  const CPjk = captureMethod1Or2Value(
    selectConstant(
      constants.SHEEP,
      'SEASONAL_FACTORS',
      state,
      className,
      seasonName,
      'crudeProteinContent',
    ),
    method2CrudeProteinContent,
  ).named(`CPjk=${className},${periodName}`);

  const MCjk = calculateMilkIntakeMCjk(periodProps);

  const proteinInEweMilk = selectConstant(constants.SHEEP, 'MILK_PROTEIN');

  const CPIjk = Ijk.multiply(CPjk)
    .plus(MCjk.multiply(proteinInEweMilk))
    .named(`CPIjk=${className},${periodName}`)
    .reference('4.4.1.3 (4)');
  return CPIjk;
}

/**
 * Calculates total nitrogen excreted by sheep in class *k* in period *j* (i.e the inner
 * part of the sum for *AE*, 4.4.1.3 (2))
 */
function calculateTotalNitrogenExcretedInPeriod(periodProps: SheepPeriodProps) {
  const { className, periodInput, periodName, periodDuration, context } =
    periodProps;
  const { constants } = context;

  const { head, method2AverageDurationDays } = periodInput;

  const Njk = head.named(`Njk=${className},${periodName}`);

  const CPIjk = calculateCrudeProteinIntakeCPIjk(periodProps);
  const crudeProteinPerNitrogen = selectConstant(
    constants.COMMON,
    'NITROGEN_TO_PROTEIN',
  );
  const NRjk = calculateNitrogenRetentionForSheep(periodProps);

  /**
   * NEjk = (CPIjk / 6.25) - NRjk
   */
  const NEjk = max(CPIjk.divide(crudeProteinPerNitrogen).minus(NRjk), zero)
    .named(`NEjk=${className},${periodName}`)
    .reference('4.4.1.3 (3)');

  const Dj = captureMethod1Or2Value(
    periodDuration,
    method2AverageDurationDays,
  ).named(`Dj=${periodName}`);

  /**
   * AE = SUM[j,k] (Njk * NEjk * Dj)
   */
  return NEjk.multiply(Njk)
    .multiply(Dj)
    .named(`AEj=${className},k=${periodName}`)
    .reference('4.4.1.3 (2)');
}

/**
 * Calculates total nitrogen excreted by a flock *AE* (4.4.1.3 (2))
 */
function calculateTotalNitrogenExcretedAnnually(
  flock: SheepManureAndEntericHerdInputTransformed &
    HasIsFebruaryInLeapYearInputTransformed,
  context: ExecutionContext<ConstantsForSheepManure>,
) {
  return calculateForAllClassPeriods(
    { flock, context },
    calculateTotalNitrogenExcretedInPeriod,
    {
      classResultName: (className) => `AE (j = ${className})`,
      flockResultName: 'AE',
      isFebruaryInLeapYear: flock.isFebruaryInLeapYear,
    },
  );
}

/**
 * Calculate direct nitrous oxide emissions *EN2O,dir* produced by a sheep flock
 * (4.4.1.3/4.4.1.4)
 */
export function calculateDirectN2OEmissionsForSheepFlock(
  flock: SheepManureAndEntericHerdInputTransformed &
    HasIsFebruaryInLeapYearInputTransformed,
  context: ExecutionContext<ConstantsForSheepManure>,
) {
  const { constants } = context;
  const totalNitrogenExcreted = calculateTotalNitrogenExcretedAnnually(
    flock,
    context,
  );

  const EFPRP = selectConstant(
    constants.LIVESTOCK,
    'EF_DEPOSITED_URINE_AND_DUNG_PRP',
    flock.climateZone,
  ).named(`EFPRP (${flock.climateZone.unit})`);

  const CN2O = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_N2O',
  ).named('CN2O');

  return totalNitrogenExcreted
    .multiply(EFPRP)
    .multiply(CN2O)
    .named(`EN2O,dir`)
    .reference('4.4.1.3 (1)');
}

/**
 * Calculate nitrous oxide emissions from atmospheric deposition *EN2O,ad* produced by a
 * sheep flock (4.4.1.5/4.4.1.6)
 */
export function calculateAtmosphericDepositionN2OEmissionsForSheepFlock(
  flock: SheepManureAndEntericHerdInputTransformed &
    HasIsFebruaryInLeapYearInputTransformed,
  context: ExecutionContext<ConstantsForSheepManure>,
) {
  const { constants } = context;
  const totalNitrogenExcreted = calculateTotalNitrogenExcretedAnnually(
    flock,
    context,
  );

  const fracGASMsoil = selectConstant(
    constants.CROP,
    'FRACTION_N_VOLATILISED_ORGANIC_FERTILISER',
  ).named('FracGASMsoil');

  const volatilisedNitrogen = totalNitrogenExcreted
    .multiply(fracGASMsoil)
    .named(`Mvol`)
    .reference('4.4.1.5 (2)');

  const EFN2O = selectConstant(
    constants.CROP,
    'EF_N2O_ATMOSPHERIC_DEPOSITION_PRODUCTION_SYSTEM',
    flock.grazingSystem,
  ).named('EFN2O');
  const CN2O = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_N2O',
  ).named('CN2O');

  return volatilisedNitrogen
    .multiply(EFN2O)
    .multiply(CN2O)
    .reference('4.4.1.5 (1)');
}

/**
 * Calculate nitrous oxide emissions from leaching and runoff *ESN2O,leach* produced by a
 * sheep flock (4.4.1.7/4.4.1.8)
 */
export function calculateLeachingAndRunoffN2OEmissionsForSheepFlock(
  flock: SheepManureAndEntericHerdInputTransformed &
    HasIsFebruaryInLeapYearInputTransformed,
  context: ExecutionContext<ConstantsForSheepManure>,
) {
  const { constants } = context;

  const totalNitrogenExcreted = calculateTotalNitrogenExcretedAnnually(
    flock,
    context,
  );

  const FracLEACH = selectConstant(
    constants.CROP,
    'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF',
  ).named('FracLEACH');
  const FracWET = ifTrueElse(flock.isInLeachingZone, one, zero).named(
    'FracWET',
  );

  /**
   * Mleach = AE * FracWet * FracLEACH
   */
  const Mleach = totalNitrogenExcreted
    .multiply(FracWET)
    .multiply(FracLEACH)
    .named(`Mleach`)
    .reference('4.4.1.7 (2)');

  const EFleach = selectConstant(
    constants.CROP,
    'EF_N2O_LEACHING_AND_RUNOFF',
  ).named('EFleach');

  const CN2O = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_N2O',
  ).named('CN2O');

  /**
   * ESN2O,leach = Mleach * EFleach * CN2O * 10^-3
   */
  return Mleach.multiply(EFleach)
    .multiply(CN2O)
    .named('EN2O,leach')
    .reference('4.4.1.7 (1)');
}

/**
 * Calculate emissions produced by a sheep flock from manure management.
 */
export function calculate44SheepManureManagement(
  flock: SheepManureAndEntericHerdInputTransformed &
    HasIsFebruaryInLeapYearInputTransformed,
  context: ExecutionContext<ConstantsForSheepManure>,
) {
  return {
    manureManagementCH4: calculateManureManagementCH4ForSheepFlock(
      flock,
      context,
    ),
    manureDirectN2O: calculateDirectN2OEmissionsForSheepFlock(flock, context),
    manureAtmosphericDepositionN2O:
      calculateAtmosphericDepositionN2OEmissionsForSheepFlock(flock, context),
    manureLeachingRunoffN2O:
      calculateLeachingAndRunoffN2OEmissionsForSheepFlock(flock, context),
  };
}
