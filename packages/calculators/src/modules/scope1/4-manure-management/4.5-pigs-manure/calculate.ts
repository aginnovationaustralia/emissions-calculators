import { ExecutionContext } from '@/calculators/executionContext';
import {
  PigsHerdFertiliserInputTransformed,
  PigsHerdLivestockInputTransformed,
} from '@/modules/scope1/shared/pigs/input';
import { zeroN } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import {
  calculateAtmosphericDepositionN2OEmissionsForClass,
  calculateDirectN2OEmissionsForClass,
  calculateLeachingAndRunoffN2OEmissionsForClass,
  calculateManureManagementCH4ForClass,
  calculateMassOfNitrogenAppliedToSoilsForClass,
} from './4.5-pigs-manure';
import { ConstantsForPigsManure } from './constants';
import { PigsManureInputTransformed } from './pigs-manure.input';

/**
 * Calculate methane emissions produced by an individual pig herd from manure management
 * (4.5.1.1/4.5.1.2).
 */
export function calculateManureManagementCH4ForPigsHerd(
  herd: PigsHerdLivestockInputTransformed,
  context: ExecutionContext<ConstantsForPigsManure>,
) {
  const pigsClassEmissions = Object.values(herd.classes).map((pigsClass) =>
    calculateManureManagementCH4ForClass(
      pigsClass,
      herd.state,
      herd.method2MeanAnnualTemperature,
      context.constants,
    ),
  );
  return sum(pigsClassEmissions).named('ECH4');
}

/**
 * Calculate direct N2O emissions produced by an individual pig herd from manure
 * management (4.5.1.3/4.5.1.4).
 */
export function calculateDirectN2OEmissionsForPigsHerd(
  herdInput: PigsHerdLivestockInputTransformed,
  context: ExecutionContext<ConstantsForPigsManure>,
) {
  const pigsClassEmissions = Object.values(herdInput.classes).map((pigsClass) =>
    calculateDirectN2OEmissionsForClass(pigsClass, context.constants),
  );

  return sum(pigsClassEmissions).named('EN2O,dir');
}

/**
 * Calculate atmospheric deposition N2O emissions produced by an individual pig herd
 * from manure management (TODO: Also labeled as 4.5.1.1/4.5.1.2 in the guidance, this
 * reference will need to be updated).
 */
export function calculateAtmosphericDepositionN2OEmissionsForPigsHerd(
  herdInput: PigsHerdLivestockInputTransformed,
  context: ExecutionContext<ConstantsForPigsManure>,
) {
  const pigsClassEmissions = Object.values(herdInput.classes).map((pigsClass) =>
    calculateAtmosphericDepositionN2OEmissionsForClass(
      pigsClass,
      herdInput.grazingSystem,
      context.constants,
    ),
  );
  return sum(pigsClassEmissions).named('EN2O,ad');
}

/**
 * Calculate leaching and runoff N2O emissions produced by an individual pig herd from
 * manure management
 */
export function calculateLeachingAndRunoffN2OEmissionsForPigsHerd(
  herdInput: PigsHerdLivestockInputTransformed,
  context: ExecutionContext<ConstantsForPigsManure>,
) {
  const pigsClassEmissions = Object.values(herdInput.classes).map((pigsClass) =>
    calculateLeachingAndRunoffN2OEmissionsForClass(
      pigsClass,
      herdInput.isInLeachingZone,
      context.constants,
    ),
  );
  return sum(pigsClassEmissions).named('EN2O,leach');
}

export function calculate45PigsManureManagement(
  herd: PigsHerdLivestockInputTransformed,
  context: ExecutionContext<ConstantsForPigsManure>,
) {
  return {
    manureManagementCH4: calculateManureManagementCH4ForPigsHerd(herd, context),
    manureDirectN2O: calculateDirectN2OEmissionsForPigsHerd(herd, context),
    manureAtmosphericDepositionN2O:
      calculateAtmosphericDepositionN2OEmissionsForPigsHerd(herd, context),
    manureLeachingRunoffN2O: calculateLeachingAndRunoffN2OEmissionsForPigsHerd(
      herd,
      context,
    ),
  };
}

/**
 * Calculate nitrogen applied to soils *MNSoilscope1* produced by a pig herd.
 * TODO: The section number is subject to change due to formatting issues in the draft
 * guidance.
 */
function calculateMassOfNitrogenAppliedToSoilsForPigsHerd(
  herdInput: PigsHerdFertiliserInputTransformed,
  constants: ConstantsForPigsManure,
) {
  const nitrogenProducedByPigsHerd = sum(
    Object.values(herdInput.classes).map((pigsClass) =>
      calculateMassOfNitrogenAppliedToSoilsForClass(
        pigsClass,
        herdInput.isInLeachingZone,
        constants,
      ),
    ),
  );
  return nitrogenProducedByPigsHerd
    .multiply(herdInput.fractionAppliedToSoils)
    .named('MNSoilscope1');
}

/**
 * Calculate nitrogen applied to soils *MNSoilscope1* produced by a pig herd.
 * TODO: The section number is subject to change due to formatting issues in the draft
 * guidance.
 */
export function calculateMassOfNitrogenAppliedToSoilsForPigs(
  input: PigsManureInputTransformed,
  constants: ConstantsForPigsManure,
) {
  return input.herds.length === 0
    ? zeroN
    : sum(
        input.herds.map((herd) =>
          calculateMassOfNitrogenAppliedToSoilsForPigsHerd(herd, constants),
        ),
      );
}
