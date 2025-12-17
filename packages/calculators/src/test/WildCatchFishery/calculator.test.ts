import { WildCatchFisheryOutput } from '@/types/WildCatchFishery/output';
import clone from 'nanoclone';
import { calculateWildCatchFishery } from '../../calculators/WildCatchFishery/calculator';
import { compareEmissionsFrom2Inputs } from '../common/comparisons';
import { testContext } from '../common/context';
import { executeEmissionsSpec, KeyValuePairs } from '../common/emissions';
import { wildCatchFisheryTestData } from './input.data';

const expectedScopes = {
  scope1: {
    fuelCO2: 9.5807488,
    fuelCH4: 0.1190384,
    fuelN2O: 0.31785678,
    wasteWaterCO2: 13.23963328,
    compostedSolidWasteCO2: 0.2852,
    hfcsRefrigerantLeakage: 94.166,
    totalCO2: 23.10558208,
    totalCH4: 0.1190384,
    totalN2O: 0.31785678,
    totalHFCs: 94.166,
    total: 117.70847727,
  },
  scope2: {
    electricity: 0.25875,
    total: 0.25875,
  },
  scope3: {
    purchasedBait: 72.556,
    electricity: 0.05625,
    fuel: 2.5697414,
    commercialFlights: 1616.0,
    inboundFreight: 2088,
    outboundFreight: 18.492,
    solidWasteSentOffsite: 8,
    total: 3805.6739914,
  },
  intensities: {
    wildCatchFisheryIncludingCarbonOffsets: 68.27930748,
    wildCatchFisheryExcludingCarbonOffsets: 70.06502176,
    totalHarvestWeightKg: 56000,
  },
  carbonSequestration: {
    total: 0,
  },
  net: {
    total: 3823.64121867,
  },
};

const expectations: WildCatchFisheryOutput = {
  ...expectedScopes,

  purchasedOffsets: {
    total: 100,
  },

  intermediate: [
    { ...expectedScopes, id: '0', carbonSequestration: { total: 0 } },
  ],
};

describe('Wild Catch Fishery calculator, SA', () => {
  const context = testContext('Wild Catch Fishery');
  const emissions = calculateWildCatchFishery(
    wildCatchFisheryTestData,
    context,
  );

  executeEmissionsSpec(emissions, expectations as unknown as KeyValuePairs);
});

describe('Wild Catch Fishery calculator (multi activity)', () => {
  const originalActivity = clone(wildCatchFisheryTestData.enterprises[0]);
  originalActivity.id = 'wcf-original';
  const activityDoubleSaleweight = clone(originalActivity);
  activityDoubleSaleweight.id = 'wcf-double-saleweight';

  activityDoubleSaleweight.totalHarvestKg *= 2;

  const wcfDoubleSaleweight = {
    ...wildCatchFisheryTestData,
    enterprises: [activityDoubleSaleweight],
    vegetation: [],
  };

  const wildCatchFisheryTestDataAllActivities = {
    ...wildCatchFisheryTestData,
    enterprises: [originalActivity, activityDoubleSaleweight],
  };

  compareEmissionsFrom2Inputs(
    'Wild Catch Fishery',
    calculateWildCatchFishery,
    wildCatchFisheryTestData,
    wcfDoubleSaleweight,
    wildCatchFisheryTestDataAllActivities,
    (originalEmissions, secondEmissions) => {
      expect(originalEmissions.intensities.totalHarvestWeightKg).toBeCloseTo(
        secondEmissions.intensities.totalHarvestWeightKg / 2,
      );
    },
  );
});
