import { ExecutionContext } from '@/calculators/executionContext';
import { PoultryFlockLivestockInputTransformed } from '@/modules/scope1/shared/poultry/input';
import { zeroCH4, zeroN, zeroN2O } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import {
  calculateAtmosphericDepositionN2OEmissionsForClass,
  calculateDirectN2OEmissionsForClass,
  calculateLeachingAndRunoffN2OEmissionsForClass,
  calculateManureManagementCH4ForClass,
  calculateMassOfNitrogenAppliedToSoilsForClass,
} from './4.6-poultry-manure';
import { ConstantsForPoultryManure } from './constants';
import { PoultryManureInputTransformed } from './poultry-manure.input';

/**
 * Calculate methane emissions produced by a whole poultry flock from manure management
 * (4.6.1.1/4.6.1.2).
 */
export function calculateManureManagementCH4ForPoultryFlock(
  flock: PoultryFlockLivestockInputTransformed,
  context: ExecutionContext<ConstantsForPoultryManure>,
) {
  return sum(
    Object.values(flock.classes).map((classInput) =>
      calculateManureManagementCH4ForClass(
        classInput,
        flock.state,
        flock.method2MeanAnnualTemperature,
        context.constants,
      ).named(`ECH4 (j = ${classInput.classNumber})`),
    ),
    zeroCH4,
  ).named('ECH4');
}

/**
 * Calculate direct N2O emissions produced by a whole poultry flock from manure
 * management (4.6.1.3/4.6.1.4 + 4.6.1.10).
 */
export function calculateDirectN2OEmissionsForPoultryFlock(
  flock: PoultryFlockLivestockInputTransformed,
  context: ExecutionContext<ConstantsForPoultryManure>,
) {
  return sum(
    Object.values(flock.classes).map((classInput) =>
      calculateDirectN2OEmissionsForClass(
        classInput,
        flock.climateZone,
        context.constants,
      ).named(`EN2O,dir (j = ${classInput.classNumber})`),
    ),
    zeroN2O,
  ).named('EN2O,dir');
}

/**
 * Calculate atmospheric deposition N2O emissions produced by a whole poultry flock from
 * manure management (4.6.1.5 + 4.6.1.12).
 */
export function calculateAtmosphericDepositionN2OEmissionsForPoultryFlock(
  flock: PoultryFlockLivestockInputTransformed,
  context: ExecutionContext<ConstantsForPoultryManure>,
) {
  return sum(
    Object.values(flock.classes).map((classInput) =>
      calculateAtmosphericDepositionN2OEmissionsForClass(
        classInput,
        flock.grazingSystem,
        context.constants,
      ).named(`EN2O,ad (j = ${classInput.classNumber})`),
    ),
    zeroN2O,
  ).named('EN2O,ad');
}

/**
 * Calculate leaching and runoff N2O emissions produced by a whole poultry flock from
 * manure management (4.6.1.7 + 4.6.1.14).
 */
export function calculateLeachingAndRunoffN2OEmissionsForPoultryFlock(
  flock: PoultryFlockLivestockInputTransformed,
  context: ExecutionContext<ConstantsForPoultryManure>,
) {
  return sum(
    Object.values(flock.classes).map((classInput) =>
      calculateLeachingAndRunoffN2OEmissionsForClass(
        classInput,
        flock.isInLeachingZone,
        context.constants,
      ).named(`EN2O,leach (j = ${classInput.classNumber})`),
    ),
    zeroN2O,
  ).named('EN2O,leach');
}

/**
 * Calculate the mass of nitrogen applied to soils *MNSoilscope1* produced by poultry
 * flocks (4.6.1.9).
 */
export function calculateMassOfNitrogenAppliedToSoilsForPoultry(
  manureInput: PoultryManureInputTransformed,
  constants: ConstantsForPoultryManure,
) {
  return sum(
    manureInput.flocks.map((flock) => {
      const { classes, isInLeachingZone, fractionAppliedToSoils } = flock;
      return sum(
        Object.values(classes).map((poultryClass) =>
          calculateMassOfNitrogenAppliedToSoilsForClass(
            poultryClass,
            isInLeachingZone,
            constants,
          ),
        ),
        zeroN,
      ).multiply(fractionAppliedToSoils);
    }),
    zeroN,
  )
    .named('MNSoilscope1')
    .reference('4.6.1.9 (1)');
}

/**
 * Calculate emissions from poultry manure management (4.6)
 */
export function calculate46PoultryManureManagement(
  manureInput: PoultryFlockLivestockInputTransformed,
  context: ExecutionContext<ConstantsForPoultryManure>,
) {
  return {
    manureManagementCH4: calculateManureManagementCH4ForPoultryFlock(
      manureInput,
      context,
    ),

    manureDirectN2O: calculateDirectN2OEmissionsForPoultryFlock(
      manureInput,
      context,
    ),
    manureAtmosphericDepositionN2O:
      calculateAtmosphericDepositionN2OEmissionsForPoultryFlock(
        manureInput,
        context,
      ),
    manureLeachingRunoffN2O:
      calculateLeachingAndRunoffN2OEmissionsForPoultryFlock(
        manureInput,
        context,
      ),
  };
}
