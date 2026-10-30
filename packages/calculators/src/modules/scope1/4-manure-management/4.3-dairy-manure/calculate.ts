import { ExecutionContext } from '@/calculators/executionContext';
import { DairyMMSTypeWithPasture } from '@/constants/enums';
import { Container, num } from '@/tools/containers';
import { zeroCH4, zeroN, zeroN2O } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { RealNumber } from '@/tools/units';
import { calculateMilkProduction } from '../../shared/dairy/calculate';
import {
  DairyHerdFertiliserInputTransformed,
  DairyHerdLivestockInputTransformed,
} from '../../shared/dairy/input';
import {
  calculateAtmosphericDepositionN2OEmissionsForClass,
  calculateDirectN2OEmissionsForClass,
  calculateFractionOfVolatileSolidsPerMMS,
  calculateLeachingAndRunoffN2OEmissionsForClass,
  calculateManureAllocations,
  calculateManureManagementCH4ForClass,
  calculateMassOfNitrogenAppliedToSoilsForClass,
} from './4.3-dairy-manure';
import { ConstantsForDairyManure } from './constants';
import { DairyManureInputTransformed } from './dairy-manure.input';

const otherDairyClassManureAllocations: Record<
  DairyMMSTypeWithPasture,
  Container<RealNumber>
> = {
  // Not using the 'one' and 'zero' sentinels here so that they can be assigned names
  anaerobicLagoon: num(0).named('MMSm=1j!=1'),
  sumpDispersal: num(0).named('MMSm=3aj!=1'),
  drainToPaddock: num(0).named('MMSm=3bj!=1'),
  solidStorage: num(0).named('MMSm=4j!=1'),
  pastureRangeAndPaddock: num(1).named('MMSm=14j!=1'),
};

/**
 * Calculate methane emissions *ECH4* produced by a dairy herd (4.3.1.1/4.3.1.2)
 */
export function calculateDairyManureCH4ForHerd(
  herd: DairyHerdLivestockInputTransformed,
  context: ExecutionContext<ConstantsForDairyManure>,
) {
  const { constants } = context;
  const milkingCowManureAllocations = calculateFractionOfVolatileSolidsPerMMS(
    herd,
    constants,
  );
  const milkProduction = calculateMilkProduction(
    herd.milkProduction,
    constants,
  );
  const classEmissions = Object.values(herd.classes).map((dairyClass) =>
    calculateManureManagementCH4ForClass(
      dairyClass,
      milkProduction,
      herd.breed,
      dairyClass.className === 'milkingCows'
        ? milkingCowManureAllocations
        : otherDairyClassManureAllocations,
      herd.state,
      herd.method2MeanAnnualTemperature,
      constants,
    ),
  );

  return sum(classEmissions, zeroCH4).named('ECH4');
}

/**
 * Calculate direct nitrous oxide emissions *EN2O,dir* produced by a dairy herd
 * (4.3.1.3/4.3.1.4 & 4.3.1.9)
 */
export function calculateDirectN2OEmissionsForDairyHerd(
  herd: DairyHerdLivestockInputTransformed,
  context: ExecutionContext<ConstantsForDairyManure>,
) {
  const { constants } = context;
  const milkProduction = calculateMilkProduction(
    herd.milkProduction,
    constants,
  );
  const milkingCowManureAllocations = calculateManureAllocations(
    herd,
    constants,
  );
  const classEmissions = Object.values(herd.classes).map((dairyClass) =>
    calculateDirectN2OEmissionsForClass(
      dairyClass,
      milkProduction,
      herd.breed,
      dairyClass.className === 'milkingCows'
        ? milkingCowManureAllocations
        : otherDairyClassManureAllocations,
      herd.climateZone,
      constants,
    ),
  );

  return sum(classEmissions, zeroN2O).named('EN2O,dir');
}

/**
 * Calculate nitrous oxide emissions from atmospheric deposition *EN2O,ad* produced by a
 * dairy herd (4.3.1.5 & 4.3.1.10/4.3.1.11)
 */
export function calculateAtmosphericDepositionN2OEmissionsForDairyHerd(
  herd: DairyHerdLivestockInputTransformed,
  context: ExecutionContext<ConstantsForDairyManure>,
) {
  const { constants } = context;
  const milkProduction = calculateMilkProduction(
    herd.milkProduction,
    constants,
  );
  const milkingCowManureAllocations = calculateManureAllocations(
    herd,
    constants,
  );
  const classEmissions = Object.values(herd.classes).map((dairyClass) =>
    calculateAtmosphericDepositionN2OEmissionsForClass(
      dairyClass,
      milkProduction,
      herd.breed,
      dairyClass.className === 'milkingCows'
        ? milkingCowManureAllocations
        : otherDairyClassManureAllocations,
      herd.grazingSystem,
      constants,
    ),
  );

  return sum(classEmissions, zeroN2O).named('EN2O,ad');
}

/**
 * Calculate nitrous oxide emissions from leaching and runoff *EN2O,leach* produced by a
 * dairy herd (4.3.1.6/4.3.1.7 & 4.3.1.12/4.3.1.13)
 */
export function calculateLeachingAndRunoffN2OEmissionsForDairyHerd(
  herd: DairyHerdLivestockInputTransformed,
  context: ExecutionContext<ConstantsForDairyManure>,
) {
  const { constants } = context;
  const milkProduction = calculateMilkProduction(
    herd.milkProduction,
    constants,
  );
  const milkingCowManureAllocations = calculateManureAllocations(
    herd,
    constants,
  );
  const classEmissions = Object.values(herd.classes).map((dairyClass) =>
    calculateLeachingAndRunoffN2OEmissionsForClass(
      dairyClass,
      milkProduction,
      herd.breed,
      dairyClass.className === 'milkingCows'
        ? milkingCowManureAllocations
        : otherDairyClassManureAllocations,
      herd.isInLeachingZone,
      constants,
    ),
  );

  return sum(classEmissions, zeroN2O).named('EN2O,leach');
}

/**
 * Calculate nitrogen applied to soil *MNSoilscope1* produced by a dairy herd (4.3.1.8).
 */
export function calculateMassOfNitrogenAppliedToSoilsForDairyHerd(
  herd: DairyHerdFertiliserInputTransformed,
  constants: ConstantsForDairyManure,
) {
  const milkingCowManureAllocations = calculateManureAllocations(
    herd,
    constants,
  );
  const milkProduction = calculateMilkProduction(
    herd.milkProduction,
    constants,
  );
  return sum(
    Object.values(herd.classes).map((dairyClass) =>
      calculateMassOfNitrogenAppliedToSoilsForClass(
        dairyClass,
        milkProduction,
        herd.breed,
        dairyClass.className === 'milkingCows'
          ? milkingCowManureAllocations
          : otherDairyClassManureAllocations,
        herd.isInLeachingZone,
        constants,
      ),
    ),
    zeroN,
  )
    .multiply(herd.fractionAppliedToSoils)
    .reference('4.3.1.8 (1)');
}
/**
 * Calculate nitrogen applied to soil *MNSoilscope1* produced by dairy herds (4.3.1.8)
 */
export function calculateMassOfNitrogenAppliedToSoilsForDairy(
  manureInput: DairyManureInputTransformed,
  constants: ConstantsForDairyManure,
) {
  return manureInput.herds.length === 0
    ? zeroN
    : sum(
        manureInput.herds.map((herd) =>
          calculateMassOfNitrogenAppliedToSoilsForDairyHerd(herd, constants),
        ),
        zeroN,
      );
}

export function calculate43DairyManureManagement(
  herd: DairyHerdLivestockInputTransformed,
  context: ExecutionContext<ConstantsForDairyManure>,
) {
  return {
    manureManagementCH4: calculateDairyManureCH4ForHerd(herd, context),
    manureDirectN2O: calculateDirectN2OEmissionsForDairyHerd(herd, context),
    manureAtmosphericDepositionN2O:
      calculateAtmosphericDepositionN2OEmissionsForDairyHerd(herd, context),
    manureLeachingRunoffN2O: calculateLeachingAndRunoffN2OEmissionsForDairyHerd(
      herd,
      context,
    ),
  };
}
