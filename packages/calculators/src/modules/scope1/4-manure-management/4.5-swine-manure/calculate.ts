import { ExecutionContext } from '@/calculators/executionContext';
import { SwineHerdInputTransformed } from '@/calculators/Swine/types/swine-herd.input';
import {
  CropConstants,
  HasCommonConstants,
  LivestockConstants,
  SwineConstants,
} from '@/constants/types';
import {
  calculateAtmosphericDepositionN2OEmissionsForClass,
  calculateDirectN2OEmissionsForClass,
  calculateLeachingAndRunoffN2OEmissionsForClass,
  calculateManureManagementCH4ForClass,
} from './4.5-swine-manure';
import {
  GrazingProductionSystemsWithRainfall,
  MeanAnnualTemperature,
  PureState,
} from '@/constants/enums';
import { sum } from '@/tools/sum';
import { SwineInputTransformed } from '@/calculators/Swine/types/input';

/**
 * Calculate methane emissions produced by an individual swine herd from manure management
 * (4.5.1.1/4.5.1.2).
 */
function calculateManureManagementCH4ForSwineHerd(
  herdInput: SwineHerdInputTransformed,
  state: PureState,
  temperatureZone: MeanAnnualTemperature | undefined,
  context: ExecutionContext<
    HasCommonConstants & {
      SWINE: SwineConstants;
      LIVESTOCK: LivestockConstants;
    }
  >,
) {
  const swineClassEmissions = Object.values(herdInput).map((swineClass) =>
    calculateManureManagementCH4ForClass(
      swineClass,
      state,
      temperatureZone,
      context.constants,
    ).named(`ECH4 (j=${swineClass.number})`),
  );
  return sum(swineClassEmissions).named('ECH4');
}

/**
 * Calculate direct N2O emissions produced by an individual swine herd from manure
 * management (4.5.1.3/4.5.1.4).
 */
function calculateDirectN2OEmissionsForSwineHerd(
  herdInput: SwineHerdInputTransformed,
  context: ExecutionContext<
    HasCommonConstants & {
      SWINE: SwineConstants;
      LIVESTOCK: LivestockConstants;
    }
  >,
) {
  const swineClassEmissions = Object.values(herdInput).map((swineClass) =>
    calculateDirectN2OEmissionsForClass(swineClass, context.constants).named(
      `EN2O,dir (j=${swineClass.number})`,
    ),
  );

  return sum(swineClassEmissions).named('EN2O,dir');
}

/**
 * Calculate atmospheric deposition N2O emissions produced by an individual swine herd
 * from manure management (REVISIT: Also labeled as 4.5.1.1/4.5.1.2 in the guidance, this
 * reference will need to be updated).
 */
function calculateAtmosphericDepositionN2OEmissionsForSwineHerd(
  herdInput: SwineHerdInputTransformed,
  productionSystem: GrazingProductionSystemsWithRainfall,
  context: ExecutionContext<
    HasCommonConstants & {
      SWINE: SwineConstants;
      LIVESTOCK: LivestockConstants;
      CROP: CropConstants;
    }
  >,
) {
  const swineClassEmissions = Object.values(herdInput).map((swineClass) =>
    calculateAtmosphericDepositionN2OEmissionsForClass(
      swineClass,
      productionSystem,
      context.constants,
    ).named(`EN2O,ad (j=${swineClass.number})`),
  );
  return sum(swineClassEmissions).named('EN2O,ad');
}

/**
 * Calculate leaching and runoff N2O emissions produced by an individual swine herd from
 * manure management (REVISIT: Also labeled as 4.5.1.3/4.5.1.4 in the guidance, this
 * reference will need to be updated).
 */
function calculateLeachingAndRunoffN2OEmissionsForSwineHerd(
  herdInput: SwineHerdInputTransformed,
  isInLeachingZone: boolean,
  context: ExecutionContext<
    HasCommonConstants & {
      SWINE: SwineConstants;
      CROP: CropConstants;
    }
  >,
) {
  const swineClassEmissions = Object.values(herdInput).map((swineClass) =>
    calculateLeachingAndRunoffN2OEmissionsForClass(
      swineClass,
      isInLeachingZone,
      context.constants,
    ).named(`EN2O,ad (j=${swineClass.number})`),
  );
  return sum(swineClassEmissions).named('EN2O,leach');
}

/**
 * Calculate methane emissions produced by swine herds from manure management
 * (4.5.1.1/4.5.1.2).
 */
export function calculateManureManagementCH4ForSwine(
  input: SwineInputTransformed,
  context: ExecutionContext<
    HasCommonConstants & {
      SWINE: SwineConstants;
      LIVESTOCK: LivestockConstants;
    }
  >,
) {
  return sum(
    input.herds.map((herd) =>
      calculateManureManagementCH4ForSwineHerd(
        herd,
        input.state,
        input.temperatureZone,
        context,
      ),
    ),
  );
}

/**
 * Calculate direct N2O emissions produced by swine herds from manure management
 * (4.5.1.3/4.5.1.4).
 */
export function calculateDirectN2OEmissionsForSwine(
  input: SwineInputTransformed,
  context: ExecutionContext<
    HasCommonConstants & {
      SWINE: SwineConstants;
      LIVESTOCK: LivestockConstants;
    }
  >,
) {
  return sum(
    input.herds.map((herd) =>
      calculateDirectN2OEmissionsForSwineHerd(herd, context),
    ),
  );
}

/**
 * Calculate atmospheric deposition N2O emissions produced by swine herds from manure
 * management (REVISIT: Also labeled as 4.5.1.1/4.5.1.2 in the guidance, this reference
 * will need to be updated).
 */
export function calculateAtmosphericDepositionN2OEmissionsForSwine(
  input: SwineInputTransformed,
  context: ExecutionContext<
    HasCommonConstants & {
      SWINE: SwineConstants;
      LIVESTOCK: LivestockConstants;
      CROP: CropConstants;
    }
  >,
) {
  return sum(
    input.herds.map((herd) =>
      calculateAtmosphericDepositionN2OEmissionsForSwineHerd(
        herd,
        input.productionSystem,
        context,
      ),
    ),
  );
}

/**
 * Calculate leaching and runoff N2O emissions produced by swine herds from manure
 * management (REVISIT: Also labeled as 4.5.1.3/4.5.1.4 in the guidance, this reference
 * will need to be updated).
 */
export function calculateLeachingAndRunoffN2OEmissionsForSwine(
  input: SwineInputTransformed,
  context: ExecutionContext<
    HasCommonConstants & {
      SWINE: SwineConstants;
      LIVESTOCK: LivestockConstants;
      CROP: CropConstants;
    }
  >,
) {
  return sum(
    input.herds.map((herd) =>
      calculateLeachingAndRunoffN2OEmissionsForSwineHerd(
        herd,
        input.isInLeachingZone,
        context,
      ),
    ),
  );
}

export function calculateSwineManureEmissions(
  input: SwineInputTransformed,
  context: ExecutionContext<
    HasCommonConstants & {
      SWINE: SwineConstants;
      LIVESTOCK: LivestockConstants;
      CROP: CropConstants;
    }
  >,
) {
  return {
    manureManagementCH4: calculateManureManagementCH4ForSwine(input, context),
    manureManagementN2O: calculateDirectN2OEmissionsForSwine(input, context)
      .plus(calculateAtmosphericDepositionN2OEmissionsForSwine(input, context))
      .plus(calculateLeachingAndRunoffN2OEmissionsForSwine(input, context)),
  };
}
