/* eslint-disable camelcase */
import clone from 'nanoclone';
import { validateCalculatorInput } from '../../calculators';
import { entriesFromObject } from '../../common/tools/object';
import { calculateDeer } from '../../Deer/calculator';
import { DeerInputSchema } from '../../types/Deer/input';
import { compareEmissionsFrom2Inputs } from '../common/comparisons';
import { testContext, V2_0_0 } from '../common/context';
import {
  ensureEveryKeyIsDefined,
  executeEmissionsSpec,
  KeyValuePairs,
} from '../common/emissions';
import { deerTestData } from './deer.data';

const expectations_1_2_0 = {
  scope1: {
    atmosphericDepositionN2O: 4.65150006357,
    fertiliserN2O: 19.57505785714,
    manureManagementCH4: 37.815855,
    entericCH4: 790.3,
    urineAndDungN2O: 31.029758571,
    leachingAndRunoffN2O: 30.06615951429,
    fuelCO2: 1.9701255,
    fuelCH4: 0.0037177,
    fuelN2O: 0.009064,
    ureaCO2: 16.866666667,
    limeCO2: 3.96,
    total: 936.2479048731,
  },
  scope2: {
    electricity: 0.15,
    total: 0.15,
  },
  scope3: {
    electricity: 0.03,
    fertiliser: 42.4366,
    purchasedFeed: 2.625,
    herbicide: 0.885,
    fuel: 0.5237615,
    lime: 0.3573,
    purchasedLivestock: 486.0,
    total: 532.8576615,
  },
  carbonSequestration: {
    total: 107.7879,
  },
  net: {
    total: 1361.46766637309,
  },
  intensities: {
    deerMeatExcludingSequestration: 17.792982941,
    deerMeatIncludingSequestration: 16.487649608,
  },
};

describe('Deer calculator, TAS', () => {
  const context = testContext(V2_0_0, 'Deer');
  const emissions = calculateDeer(deerTestData, context);

  executeEmissionsSpec(V2_0_0, emissions, expectations_1_2_0);
});

describe('Deer scenarios', () => {
  const input = {
    ...deerTestData,
    deers: [
      {
        ...deerTestData.deers[0],
        classes: {},
      },
    ],
  };

  const validatedInput = validateCalculatorInput(DeerInputSchema, input);

  expect(validatedInput).toBeDefined();

  const context = testContext(V2_0_0, 'Beef');
  const emissions = calculateDeer(validatedInput, context);

  ensureEveryKeyIsDefined(emissions as unknown as KeyValuePairs);
});

describe('Deer calculator (multi activity)', () => {
  const originalActivity = clone(deerTestData.deers[0]);
  originalActivity.id = 'deer-original';
  const activityDoubleSaleweight = clone(originalActivity);
  activityDoubleSaleweight.id = 'deer-double-saleweight';

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

  const deerOriginal = {
    ...deerTestData,
    deers: [originalActivity],
  };

  const deerDoubleSaleweight = {
    ...deerTestData,
    deers: [activityDoubleSaleweight],
    vegetation: [],
  };

  const deerTestDataAllActivities = {
    ...deerTestData,
    deers: [originalActivity, activityDoubleSaleweight],
  };

  compareEmissionsFrom2Inputs(
    'Deer',
    calculateDeer,
    deerOriginal,
    deerDoubleSaleweight,
    deerTestDataAllActivities,
    (originalEmissions, secondEmissions) => {
      expect(originalEmissions.intensities.liveweightProducedKg).toBeCloseTo(
        secondEmissions.intensities.liveweightProducedKg / 2,
      );
    },
  );
});
