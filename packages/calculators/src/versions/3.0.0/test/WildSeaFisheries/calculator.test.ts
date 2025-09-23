/* eslint-disable camelcase */
import clone from 'nanoclone';
import { WildSeaFisheriesInput } from '../../types/WildSeaFisheries/input';
import { calculateWildSeaFisheries } from '../../WildSeaFisheries/calculator';
import { compareEmissionsFrom2Inputs } from '../common/comparisons';
import { testContext, V3_0_0 } from '../common/context';
import { executeEmissionsSpec } from '../common/emissions';
import { fisheriesTestData } from './input.data';

const expectations_1_2_0 = {
  scope1: {
    fuelCO2: 14.7463028713,
    fuelCH4: 0.021384268,
    fuelN2O: 0.1141065971,
    hfcsRefrigerantLeakage: 63.245,
    total: 78.12679374,
  },
  scope2: {
    electricity: 1.07748,
    total: 1.07748,
  },
  scope3: {
    bait: 25.9668,
    electricity: 0.21956,
    fuel: 5.78340293,
    total: 31.9697629335,
  },
  net: {
    total: 96.17403666989,
  },
  intensities: [
    {
      intensityExcludingCarbonOffset: 10.47233925464,
      intensityIncludingCarbonOffset: 9.04376782607,
    },
    {
      intensityExcludingCarbonOffset: 46.95477218871,
      intensityIncludingCarbonOffset: 42.24888983576,
    },
    {
      intensityExcludingCarbonOffset: 10.97163520306,
      intensityIncludingCarbonOffset: 8.36293955089,
    },
  ],
};

describe('WildSeaFisheries calculator, NSW', () => {
  const context = testContext(V3_0_0, 'WildSeaFisheries');
  const emissions = calculateWildSeaFisheries(fisheriesTestData, context);

  executeEmissionsSpec(V3_0_0, emissions, expectations_1_2_0);
});

describe('WildSeaFisheries calculator (multi activity)', () => {
  const originalActivity = clone(fisheriesTestData.enterprises[0]);
  originalActivity.id = 'fish-original';

  const fishOriginal = {
    ...fisheriesTestData,
    enterprises: [originalActivity],
  };

  const activityDoubleYield = clone(originalActivity);
  activityDoubleYield.id = 'fish-double-yield';

  activityDoubleYield.totalWholeWeightCaught *= 2;

  const fishDoubleYield: WildSeaFisheriesInput = {
    ...fisheriesTestData,
    enterprises: [activityDoubleYield],
  };

  const fisheriesTestDataAllActivities: WildSeaFisheriesInput = {
    ...fisheriesTestData,
    enterprises: [originalActivity, activityDoubleYield],
  };

  compareEmissionsFrom2Inputs(
    V3_0_0,
    calculateWildSeaFisheries,
    fishOriginal,
    fishDoubleYield,
    fisheriesTestDataAllActivities,
    (originalEmissions, secondEmissions) => {
      expect(
        originalEmissions.intensities[0].totalHarvestWeightTonnes,
      ).toBeCloseTo(
        secondEmissions.intensities[0].totalHarvestWeightTonnes / 2,
        7,
      );
    },
  );
});
