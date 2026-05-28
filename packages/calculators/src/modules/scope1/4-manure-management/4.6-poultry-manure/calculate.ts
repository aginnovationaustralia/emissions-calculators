import { ExecutionContext } from '@/calculators/executionContext';
import {
  HasCommonConstants,
  PoultryConstants,
  LivestockConstants,
  CropConstants,
} from '@/constants/types';
import { sum } from '@/tools/sum';
import { PoultryManureInputTransformed } from './poultry-manure.input';
import {
  calculateDirectN2OEmissionsForClass,
  calculateAtmosphericDepositionN2OEmissionsForClass,
  calculateLeachingAndRunoffN2OEmissionsForClass,
  calculateMassOfNitrogenAppliedToSoilsForClass,
  calculateManureManagementCH4ForClass,
} from './4.6-poultry-manure';

/**
 * Calculate methane emissions produced by a whole poultry flock from manure management
 * (4.6.1.1/4.6.1.2).
 */
export function calculateManureManagementCH4ForPoultry(
  manureInput: PoultryManureInputTransformed,
  context: ExecutionContext<
    HasCommonConstants & {
      POULTRY: PoultryConstants;
      LIVESTOCK: LivestockConstants;
    }
  >,
) {
  const layersCH4 = calculateManureManagementCH4ForClass(
    manureInput.classes.layers,
    manureInput.mms1To2Allocation,
    manureInput.state,
    manureInput.temperatureZone,
    context.constants,
  ).named('ECH4 (j=1)');
  const meatBreedersCH4 = calculateManureManagementCH4ForClass(
    manureInput.classes.meatChickenBreeder,
    manureInput.mms1To2Allocation,
    manureInput.state,
    manureInput.temperatureZone,
    context.constants,
  );
  const meatGrowersCH4 = calculateManureManagementCH4ForClass(
    manureInput.classes.meatChickenGrowers,
    manureInput.mms1To2Allocation,
    manureInput.state,
    manureInput.temperatureZone,
    context.constants,
  );
  const meatOtherCH4 = calculateManureManagementCH4ForClass(
    manureInput.classes.meatOther,
    manureInput.mms1To2Allocation,
    manureInput.state,
    manureInput.temperatureZone,
    context.constants,
  );

  return layersCH4
    .plus(meatBreedersCH4)
    .plus(meatGrowersCH4)
    .plus(meatOtherCH4)
    .named('ECH4');
}

/**
 * Calculate direct N2O emissions produced by a whole poultry flock from manure
 * management (4.6.1.3/4.6.1.4 + 4.6.1.10).
 */
export function calculateDirectN2OEmissionsForPoultry(
  manureInput: PoultryManureInputTransformed,
  context: ExecutionContext<
    HasCommonConstants & {
      POULTRY: PoultryConstants;
      LIVESTOCK: LivestockConstants;
    }
  >,
) {
  const layersDirectN2O = calculateDirectN2OEmissionsForClass(
    manureInput.classes.layers,
    manureInput.mms1To2Allocation,
    manureInput.climateZone,
    context.constants,
  );
  const meatBreedersDirectN2O = calculateDirectN2OEmissionsForClass(
    manureInput.classes.meatChickenBreeder,
    manureInput.mms1To2Allocation,
    manureInput.climateZone,
    context.constants,
  );
  const meatGrowersDirectN2O = calculateDirectN2OEmissionsForClass(
    manureInput.classes.meatChickenGrowers,
    manureInput.mms1To2Allocation,
    manureInput.climateZone,
    context.constants,
  );
  const meatOtherDirectN2O = calculateDirectN2OEmissionsForClass(
    manureInput.classes.meatOther,
    manureInput.mms1To2Allocation,
    manureInput.climateZone,
    context.constants,
  );

  return layersDirectN2O
    .plus(meatBreedersDirectN2O)
    .plus(meatGrowersDirectN2O)
    .plus(meatOtherDirectN2O)
    .named('EN2O,dir');
}

/**
 * Calculate atmospheric deposition N2O emissions produced by a whole poultry flock from
 * manure management (4.6.1.5 + 4.6.1.12).
 */
export function calculateAtmosphericDepositionN2OEmissionsForPoultry(
  manureInput: PoultryManureInputTransformed,
  context: ExecutionContext<
    HasCommonConstants & {
      POULTRY: PoultryConstants;
      LIVESTOCK: LivestockConstants;
      CROP: CropConstants;
    }
  >,
) {
  const layersAtmosphericDepN2O =
    calculateAtmosphericDepositionN2OEmissionsForClass(
      manureInput.classes.layers,
      manureInput.mms1To2Allocation,
      manureInput.productionSystem,
      context.constants,
    );
  const meatBreederAtmosphericDepN2O =
    calculateAtmosphericDepositionN2OEmissionsForClass(
      manureInput.classes.meatChickenBreeder,
      manureInput.mms1To2Allocation,
      manureInput.productionSystem,
      context.constants,
    );
  const meatGrowerAtmosphericDepN2O =
    calculateAtmosphericDepositionN2OEmissionsForClass(
      manureInput.classes.meatChickenGrowers,
      manureInput.mms1To2Allocation,
      manureInput.productionSystem,
      context.constants,
    );
  const meatOtherAtmosphericDepN2O =
    calculateAtmosphericDepositionN2OEmissionsForClass(
      manureInput.classes.meatOther,
      manureInput.mms1To2Allocation,
      manureInput.productionSystem,
      context.constants,
    );

  return layersAtmosphericDepN2O
    .plus(meatBreederAtmosphericDepN2O)
    .plus(meatGrowerAtmosphericDepN2O)
    .plus(meatOtherAtmosphericDepN2O)
    .named('EN2O,ad');
}

/**
 * Calculate leaching and runoff N2O emissions produced by a whole poultry flock from
 * manure management (4.6.1.7 + 4.6.1.14).
 */
export function calculateLeachingAndRunoffN2OEmissionsForPoultry(
  manureInput: PoultryManureInputTransformed,
  context: ExecutionContext<
    HasCommonConstants & {
      POULTRY: PoultryConstants;
      CROP: CropConstants;
    }
  >,
) {
  const layersLeachingRunoffN2O =
    calculateLeachingAndRunoffN2OEmissionsForClass(
      manureInput.classes.layers,
      manureInput.mms1To2Allocation,
      manureInput.isInLeachingZone,
      context.constants,
    );

  const meatBreederLeachingRunoffN2O =
    calculateLeachingAndRunoffN2OEmissionsForClass(
      manureInput.classes.meatChickenBreeder,
      manureInput.mms1To2Allocation,
      manureInput.isInLeachingZone,
      context.constants,
    );

  const meatGrowerLeachingRunoffN2O =
    calculateLeachingAndRunoffN2OEmissionsForClass(
      manureInput.classes.meatChickenGrowers,
      manureInput.mms1To2Allocation,
      manureInput.isInLeachingZone,
      context.constants,
    );

  const meatOtherLeachingRunoffN2O =
    calculateLeachingAndRunoffN2OEmissionsForClass(
      manureInput.classes.meatOther,
      manureInput.mms1To2Allocation,
      manureInput.isInLeachingZone,
      context.constants,
    );

  return layersLeachingRunoffN2O
    .plus(meatBreederLeachingRunoffN2O)
    .plus(meatGrowerLeachingRunoffN2O)
    .plus(meatOtherLeachingRunoffN2O)
    .named('EN2O,leach');
}

/**
 * Calculate the mass of nitrogen applied to soils for scope 1 and 3 emissions
 * (*MNSoilscope1* and *MNSoilscope3*) produced by a whole poultry flock
 * (4.6.1.9).
 */
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
      manureInput.mms1To2Allocation,
      isInLeachingZone,
      manureInput.fractionAppliedToSoils,
      constants,
    ),
    calculateMassOfNitrogenAppliedToSoilsForClass(
      manureInput.classes.meatChickenBreeder,
      manureInput.mms1To2Allocation,
      isInLeachingZone,
      manureInput.fractionAppliedToSoils,
      constants,
    ),
    calculateMassOfNitrogenAppliedToSoilsForClass(
      manureInput.classes.meatChickenGrowers,
      manureInput.mms1To2Allocation,
      isInLeachingZone,
      manureInput.fractionAppliedToSoils,
      constants,
    ),
    calculateMassOfNitrogenAppliedToSoilsForClass(
      manureInput.classes.meatOther,
      manureInput.mms1To2Allocation,
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

/**
 * Calculate emissions from poultry manure management (4.6)
 */
export function calculatePoultryManureEmissions(
  manureInput: PoultryManureInputTransformed,
  context: ExecutionContext<
    HasCommonConstants & {
      POULTRY: PoultryConstants;
      LIVESTOCK: LivestockConstants;
      CROP: CropConstants;
    }
  >,
) {
  return {
    manureManagementCH4: calculateManureManagementCH4ForPoultry(
      manureInput,
      context,
    ),
    manureManagementN2O: calculateDirectN2OEmissionsForPoultry(
      manureInput,
      context,
    )
      .plus(
        calculateAtmosphericDepositionN2OEmissionsForPoultry(
          manureInput,
          context,
        ),
      )
      .plus(
        calculateLeachingAndRunoffN2OEmissionsForPoultry(manureInput, context),
      ),
  };
}
