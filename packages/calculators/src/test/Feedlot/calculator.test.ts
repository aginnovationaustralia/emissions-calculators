/* eslint-disable camelcase */
import { entriesFromObject } from '@/calculators/common/tools/object';
import { calculateEntireFeedlot } from '@/calculators/Feedlot/calculator';
import { FeedlotInputSchema } from '@/types/Feedlot/input';
import clone from 'nanoclone';
import { validateCalculatorInput } from '../../calculators/validate';
import { compareEmissionsFrom2Inputs } from '../common/comparisons';
import { testContext } from '../common/context';
import {
  ensureEveryKeyIsDefined,
  executeEmissionsSpec,
  KeyValuePairs,
} from '../common/emissions';
import { feedlotTestData, feedlotTestData110 } from './feedlot.data';

const expectations = {
  scope1: {
    fuelCO2: 71.616618,
    transportCO2: 3.17705985,
    ureaCO2: 8.06666667,
    limeCO2: 0.396,
    fuelCH4: 0.058903,
    transportCH4: 0.00454515,
    entericCH4: 351.1454296,
    manureManagementCH4: 58.51425617,
    manureDirectN2O: 346.6054915,
    manureIndirectN2O: 52.04001243,
    manureAppliedToSoilN2O: 35.42511589,
    atmosphericDepositionN2O: 7.9864973,
    fuelN2O: 0.35598,
    transportN2O: 0.0090903,
    total: 935.40166586,
  },
  scope2: {
    electricity: 8.875,
    total: 8.875,
  },
  scope3: {
    electricity: 1.25,
    fuel: 17.761238,
    lime: 0.03573,
    feed: 1318.1,
    fertiliser: 16.6694,
    herbicide: 1.179,
    purchaseLivestock: 2201.1,
    total: 3556.095368,
  },
  carbonSequestration: {
    total: 356.357,
  },
  net: {
    total: 4144.01503386,
  },
  intensities: {
    beefExcludingSequestration: 69.23649283,
    beefIncludingSequestration: 63.75407744,
  },
};

describe('Feedlot calculator, VIC', () => {
  const context = testContext('Feedlot');
  const emissions = calculateEntireFeedlot(feedlotTestData110, context);

  executeEmissionsSpec(emissions, expectations);
});

describe('Feedlot scenarios', () => {
  const input = {
    ...feedlotTestData110,
    purchases: {},
    sales: {},
  };

  const validatedInput = validateCalculatorInput(FeedlotInputSchema, input);

  expect(validatedInput).toBeDefined();

  const context = testContext('Beef');
  const emissions = calculateEntireFeedlot(validatedInput, context);

  ensureEveryKeyIsDefined(emissions as unknown as KeyValuePairs);
});

describe('Feedlot calculator (multi activity)', () => {
  const originalActivity = clone(feedlotTestData.feedlots[0]);
  originalActivity.id = 'feedlot-original';
  const activityDoubleSaleweight = clone(originalActivity);
  activityDoubleSaleweight.id = 'feedlot-double-saleweight';

  entriesFromObject(activityDoubleSaleweight.sales).forEach(([key, value]) => {
    const doubledSales = value.map((sale) => ({
      ...sale,
      saleWeight: sale.saleWeight ? sale.saleWeight * 2 : sale.saleWeight,
    }));
    activityDoubleSaleweight.sales[key] = doubledSales;
  });

  const feedlotDoubleSaleweight = {
    ...feedlotTestData,
    feedlots: [activityDoubleSaleweight],
    vegetation: [],
  };

  const feedlotTestDataAllActivities = {
    ...feedlotTestData,
    feedlots: [originalActivity, activityDoubleSaleweight],
  };

  compareEmissionsFrom2Inputs(
    'Feedlot',
    calculateEntireFeedlot,
    feedlotTestData,
    feedlotDoubleSaleweight,
    feedlotTestDataAllActivities,
    (originalEmissions, secondEmissions) => {
      expect(originalEmissions.intensities.liveweightProducedKg).toBeCloseTo(
        secondEmissions.intensities.liveweightProducedKg / 2,
      );
    },
  );
});
