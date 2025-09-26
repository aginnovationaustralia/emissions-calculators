/* eslint-disable camelcase */
import clone from 'nanoclone';
import { entriesFromObject } from '../../common/tools/object';
import { calculateSheepBeef } from '../../SheepBeef/calculator';
import { ConstantsForSheepBeefCalculator } from '../../SheepBeef/constants';
import { BeefIntermediateOutput } from '../../types/Beef/intermediate.output';
import { SheepIntermediateOutput } from '../../types/Sheep/intermediate.output';
import { SheepBeefInput } from '../../types/SheepBeef/input';
import { SheepBeefOutput } from '../../types/SheepBeef/output';
import { compareEmissionsFrom2Inputs } from '../common/comparisons';
import { testContext, V2_0_0 } from '../common/context';
import { executeEmissionsSpec } from '../common/emissions';
import { sheepbeefTestData } from './sheepbeef.data';

// REVISIT: Need to generate fresh expectations using sheepbeef 1.1.0 sheet
const expectations_1_2_0 = {
  intermediate: {
    beef: {
      scope1: {
        fuelCO2: 1.617879,
        fuelN2O: 0.006088,
        fuelCH4: 0.0028414,
        // atmosphericDepositionN2O: 4415.8246116231,
        // fertiliserN2O: 28.4812157143,
        // total: 357859.268123006,
      },
      scope2: {
        // electricity: 2.133,
      },
      scope3: {
        purchasedMineralSupplementation: 0.0297931544,
        purchasedLivestock: 484.0,
        fuel: 0.421271,
        // total: 630.4664641544,
      },
    },
    sheep: {
      scope1: {
        fuelN2O: 0.007405,
        fuelCH4: 0.0035895,
        fuelCO2: 1.813404,
        // leachingAndRunoffN2O: -396.6882587362,
        urineAndDungN2O: -621.098016267,
        // fertiliserN2O: 28.4812157143,
        // atmosphericDepositionN2O: -55.7631131515,
        // total: -589.2145575536,
      },
      scope2: {
        // electricity: 0.553,
      },
      scope3: {
        purchasedMineralSupplementation: 0.0292902776,
        fuel: 0.481644,
        // total: 931.4200242776,
      },
    },
  },
  scope1: {
    savannahBurningCH4: 0,
    savannahBurningN2O: 0,
  },
  carbonSequestration: {
    total: 371.1838,
  },
  net: {
    // total: 358463.442253884,
    // beef: 358235.11438716,
    // sheep: 228.3278667239,
  },
  intensities: {
    // beefIncludingSequestration: 16283.4142903255,
    // beefExcludingSequestration: 16295.0848903255,
    // woolExcludingSequestration: 3.2477114194,
    // woolIncludingSequestration: 2.1634564631,
    // sheepMeatBreedingExcludingSequestration: 0.8993662392,
    // sheepMeatBreedingIncludingSequestration: 0.5991110206,
  },
};

describe('checking Sheepbeef calculator, VIC', () => {
  const context = testContext(V2_0_0, 'SheepBeef');
  const emissions = calculateSheepBeef(sheepbeefTestData, context);

  executeEmissionsSpec(V2_0_0, emissions, expectations_1_2_0);

  it('Generates IDs for intermediate activities', () => {
    expect(emissions.intermediateBeef[0].id).toBe('beef-0');
    expect(emissions.intermediateSheep[0].id).toBe('sheep-0');
  });
});

describe('Sheepbeef calculator (multi sheep activity)', () => {
  const originalActivity = clone(sheepbeefTestData.sheep[0]);
  originalActivity.id = 'sheep-original';
  const activityDoubleWool = clone(originalActivity);
  activityDoubleWool.id = 'sheep-double-wool';

  // Double the wool production by adjusting the class wool shorn
  entriesFromObject(activityDoubleWool.classes).forEach(([key, value]) => {
    if (!value) {
      return;
    }
    activityDoubleWool.classes[key] = {
      ...value,
      woolShorn: value.woolShorn * 2,
    };
  });

  const sheepOriginal: SheepBeefInput = {
    ...sheepbeefTestData,
    sheep: [originalActivity],
    beef: [],
  };

  const sheepDoubleWool: SheepBeefInput = {
    ...sheepbeefTestData,
    sheep: [activityDoubleWool],
    beef: [],
    vegetation: [],
  };

  const sheepTestDataAllActivities: SheepBeefInput = {
    ...sheepbeefTestData,
    sheep: [originalActivity, activityDoubleWool],
    beef: [],
  };

  const emptyArray: BeefIntermediateOutput[] = [];

  compareEmissionsFrom2Inputs<
    SheepBeefInput,
    SheepIntermediateOutput,
    'intermediateSheep',
    SheepBeefOutput,
    ConstantsForSheepBeefCalculator
  >(
    'Sheep',
    calculateSheepBeef,
    sheepOriginal,
    sheepDoubleWool,
    sheepTestDataAllActivities,
    (originalEmissions, secondEmissions) => {
      expect(originalEmissions.intensities.woolProducedKg).toBeCloseTo(
        secondEmissions.intensities.woolProducedKg / 2,
      );
    },
    {
      intermediateKeyName: 'intermediateSheep',
      transformIntermediate: (intermediate) => ({
        ...intermediate,
        intensities: {
          ...intermediate.intensities,
          beefIncludingSequestration: 0,
          beefExcludingSequestration: 0,
          liveweightBeefProducedKg: 0,
        },
        scope1: {
          ...intermediate.scope1,
          savannahBurningCH4: 0,
          savannahBurningN2O: 0,
        },
        carbonSequestration: {
          total: intermediate.carbonSequestration,
          intermediate: [],
        },
        intermediateBeef: emptyArray,
      }),
    },
  );
});

describe('Sheepbeef calculator (multi beef activity)', () => {
  const originalActivity = clone(sheepbeefTestData.beef[0]);
  originalActivity.id = 'beef-original';
  const activityDoubleWeight = clone(originalActivity);
  activityDoubleWeight.id = 'beef-double-wool';

  // Double the meat production by adjusting the sale weight
  entriesFromObject(activityDoubleWeight.classes).forEach(([key, value]) => {
    if (!value) {
      return;
    }
    activityDoubleWeight.classes[key] = {
      ...value,
      saleWeight: value.saleWeight * 2,
    };
  });

  const sheepOriginal: SheepBeefInput = {
    ...sheepbeefTestData,
    sheep: [],
    beef: [originalActivity],
  };

  const sheepDoubleWool: SheepBeefInput = {
    ...sheepbeefTestData,
    sheep: [],
    beef: [activityDoubleWeight],
    vegetation: [],
  };

  const sheepTestDataAllActivities: SheepBeefInput = {
    ...sheepbeefTestData,
    sheep: [],
    beef: [originalActivity, activityDoubleWeight],
  };

  const emptyArray: SheepIntermediateOutput[] = [];

  compareEmissionsFrom2Inputs<
    SheepBeefInput,
    BeefIntermediateOutput,
    'intermediateBeef',
    SheepBeefOutput,
    ConstantsForSheepBeefCalculator
  >(
    'Sheep',
    calculateSheepBeef,
    sheepOriginal,
    sheepDoubleWool,
    sheepTestDataAllActivities,
    (originalEmissions, secondEmissions) => {
      expect(originalEmissions.intensities.woolProducedKg).toBeCloseTo(
        secondEmissions.intensities.woolProducedKg / 2,
      );
    },
    {
      intermediateKeyName: 'intermediateBeef',
      transformIntermediate: (intermediate) => ({
        ...intermediate,
        intensities: {
          ...intermediate.intensities,
          woolIncludingSequestration: 0,
          woolExcludingSequestration: 0,
          sheepMeatBreedingIncludingSequestration: 0,
          sheepMeatBreedingExcludingSequestration: 0,
          woolProducedKg: 0,
          sheepMeatProducedKg: 0,
        },
        scope1: {
          ...intermediate.scope1,
          savannahBurningCH4: 0,
          savannahBurningN2O: 0,
        },
        carbonSequestration: {
          total: intermediate.carbonSequestration,
          intermediate: [],
        },
        intermediateSheep: emptyArray,
      }),
    },
  );
});
