/* eslint-disable camelcase */
import clone from 'nanoclone';
import { calculateBuffalo } from '../../Buffalo/calculator';
import { validateCalculatorInput } from '../../calculators';
import { entriesFromObject } from '../../common/tools/object';
import { BuffaloInput } from '../../types/Buffalo/input';
import { compareEmissionsFrom2Inputs } from '../common/comparisons';
import { testContext, V3_0_0 } from '../common/context';
import {
  ensureEveryKeyIsDefined,
  executeEmissionsSpec,
  KeyValuePairs,
} from '../common/emissions';
import { buffaloTestData } from './buffalo.data';

const expectations_1_2_0 = {
  scope1: {
    atmosphericDepositionN2O: 14.11225364018,
    leachingAndRunoffN2O: 135.31544517857,
    urineAndDungN2O: 74.43140179,
    manureManagementCH4: 90.938925,
    entericCH4: 2407.3,
    fertiliserN2O: 132.83155285714,
    limeCO2: 33.66,
    fuelCO2: 1.5833985,
    fuelCH4: 0.0024295,
    fuelN2O: 0.00773,
    ureaCO2: 13.93333333,
    total: 2904.11646979494,
  },
  scope2: {
    electricity: 2.112,
    total: 2.112,
  },
  scope3: {
    fertiliser: 486.8914,
    purchasedFeed: 974.625,
    herbicide: 1.06875,
    electricity: 0.128,
    fuel: 0.4125185,
    lime: 3.03705,
    purchasedLivestock: 720.0,
    total: 2186.1627185,
  },
  carbonSequestration: {
    total: 37.3973,
  },
  net: {
    total: 5054.99388829494,
  },
  intensities: {
    buffaloMeatExcludingSequestration: 10.2824658,
    buffaloMeatIncludingSequestration: 10.20695384,
  },
};

describe('Buffalo calculator, NSW', () => {
  const context = testContext(V3_0_0, 'Beef');
  const emissions = calculateBuffalo(buffaloTestData, context);

  executeEmissionsSpec(V3_0_0, emissions, expectations_1_2_0);
});

describe('Buffalo scenarios', () => {
  const input = {
    ...buffaloTestData,
    buffalos: [
      {
        ...buffaloTestData.buffalos[0],
        classes: {},
      },
    ],
  };

  const validatedInput = validateCalculatorInput(BuffaloInput, input);

  expect(validatedInput).toBeDefined();

  const context = testContext(V3_0_0, 'Buffalo');
  const actualEmissions = calculateBuffalo(validatedInput, context);

  ensureEveryKeyIsDefined(actualEmissions as unknown as KeyValuePairs);
});

describe('Buffalo calculator (multi activity)', () => {
  const originalActivity = clone(buffaloTestData.buffalos[0]);
  originalActivity.id = 'buffalo-original';
  const activityDoubleSaleweight = clone(originalActivity);
  activityDoubleSaleweight.id = 'buffalo-double-saleweight';

  entriesFromObject(activityDoubleSaleweight.classes).forEach(
    ([key, value]) => {
      if (!value) {
        return;
      }
      activityDoubleSaleweight.classes[key] = {
        ...value,
        saleWeight: value.saleWeight ? value.saleWeight * 2 : value.saleWeight,
      };
    },
  );

  const buffaloDoubleSaleweight = {
    ...buffaloTestData,
    buffalos: [activityDoubleSaleweight],
    vegetation: [],
  };

  const buffaloTestDataAllActivities = {
    ...buffaloTestData,
    buffalos: [originalActivity, activityDoubleSaleweight],
  };

  compareEmissionsFrom2Inputs(
    'Buffalo',
    calculateBuffalo,
    buffaloTestData,
    buffaloDoubleSaleweight,
    buffaloTestDataAllActivities,
    (originalEmissions, secondEmissions) => {
      expect(originalEmissions.intensities.liveweightProducedKg).toBeCloseTo(
        secondEmissions.intensities.liveweightProducedKg / 2,
      );
    },
  );
});
