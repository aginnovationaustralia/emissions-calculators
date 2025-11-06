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

const expectations_1_2_0 = {
  intermediate: {
    beef: {
      scope1: {
        fuelCO2: 1.617879,
        fuelN2O: 0.006088,
        fuelCH4: 0.0028414,
        atmosphericDepositionN2O: 4414.937327266,
        entericCH4: 263509.71474586945,
        fertiliserN2O: 19.79243357142857,
        leachingAndRunoffN2O: 30832.249916896315,
        manureManagementCH4: 12316.214928339561,
        totalCH4: 275825.932515609,
        totalN2O: 81964.27637142081,
        ureaCO2: 14.692333333333334,
        limeCO2: 39.599999999999994,
        totalCO2: 55.91021233333333,
        total: 357846.11909936316,
        urineAndDungN2O: 46697.29060568706,
        savannahBurningN2O: 0,
        savannahBurningCH4: 0,
      },
      scope2: {
        electricity: 2.079,
        total: 2.079,
      },
      scope3: {
        purchasedMineralSupplementation: 0.0297931544,
        purchasedLivestock: 484.0,
        fuel: 0.421271,
        electricity: 0.243,
        fertiliser: 42.4284,
        purchasedFeed: 81,
        herbicide: 18.825000000000003,
        lime: 3.573,
        total: 630.520464154375,
      },
      net: { total: 358221.9653635175 },
      carbonSequestration: 256.7532,
      intensities: {
        beefIncludingSequestration: 16282.816607432615,
        beefExcludingSequestration: 16294.487207432614,
        liveweightBeefProducedKg: 22000,
      },
    },
    sheep: {
      scope1: {
        fuelN2O: 0.007405,
        fuelCH4: 0.0035895,
        fuelCO2: 1.813404,
        leachingAndRunoffN2O: -399.20581930767656,
        urineAndDungN2O: -621.098016267,
        fertiliserN2O: 16.58426785714286,
        atmosphericDepositionN2O: -56.97801019437837,
        entericCH4: 414.5888941467905,
        manureManagementCH4: 23.543305573428547,
        totalCH4: 438.135789220219,
        totalN2O: -1060.6901729119547,
        ureaCO2: 14.69196666666667,
        limeCO2: 1.20505,
        totalCO2: 17.710420666666668,
        total: -604.843963025069,
        savannahBurningN2O: 0,
        savannahBurningCH4: 0,
      },
      scope2: {
        electricity: 0.539,
        total: 0.539,
      },
      scope3: {
        purchasedMineralSupplementation: 0.0292902776,
        fuel: 0.481644,
        electricity: 0.063,
        fertiliser: 33.6404,
        purchasedFeed: 5.7,
        herbicide: 9.412500000000001,
        lime: 0.10719,
        purchasedLivestock: 882,
        total: 931.434024277575,
      },
      net: { total: 212.69846125250595 },
      carbonSequestration: 114.4306,
      intensities: {
        woolProducedKg: 100000,
        sheepMeatProducedKg: 20000,
        sheepMeatBreedingIncludingSequestration: 0.5581009187383538,
        sheepMeatBreedingExcludingSequestration: 0.8583561373972459,
        woolIncludingSequestration: 2.0153644287773886,
        woolExcludingSequestration: 3.09961938504561,
      },
    },
  },
  scope1: {
    savannahBurningCH4: 0,
    savannahBurningN2O: 0,
    atmosphericDepositionN2O: 4357.959317071622,
    entericCH4: 263924.30364001624,
    fertiliserN2O: 36.37670142857143,
    leachingAndRunoffN2O: 30433.044097588638,
    manureManagementCH4: 12339.75823391299,
    totalCH4: 276264.06830482924,
    totalN2O: 80903.58619850886,
    ureaCO2: 29.384300000000003,
    fuelCO2: 3.4312830000000005,
    fuelCH4: 0.0064309,
    fuelN2O: 0.013493000000000002,
    limeCO2: 40.805049999999994,
    totalCO2: 73.620633,
    total: 357241.2751363381,
    urineAndDungN2O: 46076.19258942002,
  },
  scope2: { electricity: 2.6180000000000003, total: 2.6180000000000003 },
  scope3: {
    electricity: 0.306,
    fuel: 0.9029149999999999,
    fertiliser: 76.06880000000001,
    purchasedFeed: 86.7,
    purchasedMineralSupplementation: 0.05908343195,
    herbicide: 28.237500000000004,
    lime: 3.68019,
    purchasedLivestock: 1366,
    total: 1561.9544884319498,
  },
  carbonSequestration: {
    total: 371.1838,
    intermediate: [],
  },
  net: {
    total: 358434.66382477,
    beef: 358221.9653635175,
    sheep: 212.69846125250595,
  },
  intensities: {
    woolProducedKg: 100000,
    sheepMeatProducedKg: 20000,
    sheepMeatBreedingIncludingSequestration: 940.4991179075598,
    sheepMeatBreedingExcludingSequestration: 940.7993731262188,
    woolIncludingSequestration: 3396.2468146661886,
    woolExcludingSequestration: 3397.331069622457,
    beefIncludingSequestration: 16292.48471930773,
    beefExcludingSequestration: 16304.155319307729,
    liveweightBeefProducedKg: 22000,
  },

  intermediateBeef: [
    {
      scope1: {
        leachingAndRunoffN2O: 30832.249916896315,
        atmosphericDepositionN2O: 4414.937327266,
        urineAndDungN2O: 46697.29060568706,
        manureManagementCH4: 12316.214928339561,
        entericCH4: 263509.71474586945,
        fertiliserN2O: 19.79243357142857,
        savannahBurningCH4: 0,
        savannahBurningN2O: 0,
        limeCO2: 39.599999999999994,
        fuelCO2: 1.6178790000000003,
        fuelCH4: 0.0028414,
        fuelN2O: 0.006088000000000001,
        ureaCO2: 14.692333333333334,
        totalCO2: 55.91021233333333,
        totalCH4: 275825.932515609,
        totalN2O: 81964.27637142081,
        total: 357846.1190993631,
      },
      scope2: { electricity: 2.079, total: 2.079 },
      scope3: {
        fertiliser: 42.4284,
        purchasedMineralSupplementation: 0.029793154375000002,
        purchasedFeed: 81,
        herbicide: 18.825000000000003,
        electricity: 0.243,
        fuel: 0.421271,
        lime: 3.573,
        purchasedLivestock: 484,
        total: 630.520464154375,
      },
      carbonSequestration: 256.7532,
      net: { total: 358221.9653635175 },
      intensities: {
        beefIncludingSequestration: 16282.816607432615,
        beefExcludingSequestration: 16294.487207432614,
        liveweightBeefProducedKg: 22000,
      },
    },
  ],
  intermediateSheep: [
    {
      scope1: {
        leachingAndRunoffN2O: -399.20581930767656,
        atmosphericDepositionN2O: -56.97801019437837,
        urineAndDungN2O: -621.0980162670427,
        manureManagementCH4: 23.543305573428547,
        entericCH4: 414.5888941467905,
        fertiliserN2O: 16.58426785714286,
        limeCO2: 1.20505,
        fuelCO2: 1.813404,
        fuelCH4: 0.0035895,
        fuelN2O: 0.007405,
        ureaCO2: 14.69196666666667,
        totalCO2: 17.710420666666668,
        totalCH4: 438.135789220219,
        totalN2O: -1060.6901729119547,
        total: -604.843963025069,
      },
      scope2: { electricity: 0.539, total: 0.539 },
      scope3: {
        fertiliser: 33.6404,
        purchasedMineralSupplementation: 0.029290277575000002,
        purchasedFeed: 5.7,
        herbicide: 9.412500000000001,
        electricity: 0.063,
        fuel: 0.48164399999999996,
        lime: 0.10719,
        purchasedLivestock: 882,
        total: 931.434024277575,
      },
      carbonSequestration: 114.4306,
      intensities: {
        woolProducedKg: 100000,
        sheepMeatProducedKg: 20000,
        sheepMeatBreedingIncludingSequestration: 0.5581009187383538,
        sheepMeatBreedingExcludingSequestration: 0.8583561373972459,
        woolIncludingSequestration: 2.0153644287773886,
        woolExcludingSequestration: 3.09961938504561,
      },
      net: { total: 212.69846125250595 },
    },
  ],
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
