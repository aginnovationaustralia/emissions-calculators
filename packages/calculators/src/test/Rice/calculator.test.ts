import {
  calculateEntireRice,
  calculateRice,
} from '@/calculators/Rice/calculator';
import { ConstantsForRiceCalculator } from '@/calculators/Rice/constants';
import { RiceInput } from '@/types/Rice/input';
import { RiceIntermediateOutput } from '@/types/Rice/intermediate.output';
import { RiceOutput } from '@/types/Rice/output';
import clone from 'nanoclone';
import { compareEmissionsFrom2Inputs } from '../common/comparisons';
import { testContext } from '../common/context';
import { executeEmissionsSpec } from '../common/emissions';
import { riceTestData } from './rice.data';

const expectations = {
  scope1: {
    fuelCO2: 1.848387,
    limeCO2: 198,
    ureaCO2: 37.95,
    fieldBurningCH4: 276.068352,
    riceCultivationCH4: 1601.3592,
    fuelCH4: 0.0032176,
    fertiliserN2O: 77.539,
    atmosphericDepositionN2O: 8.52929,
    fieldBurningN2O: 111.4434816,
    cropResidueN2O: 12.95155155,
    leachingAndRunoffN2O: 36.04091342,
    fuelN2O: 0.006772,
    totalCO2: 237.798387,
    totalCH4: 1877.4307696,
    totalN2O: 246.51100857,
    total: 2361.74016517,
  },
  scope2: {
    electricity: 2.84,
    total: 2.84,
  },
  scope3: {
    fertiliser: 99.7023333333,
    herbicide: 0.278175,
    electricity: 0.4,
    fuel: 0.480095,
    lime: 17.865,
    total: 118.7256033333,
  },
  carbonSequestration: {
    total: 338.8878,
    intermediate: [338.8878],
  },
  net: {
    total: 2144.4179684991,
    crops: [2144.4179684991],
  },
  intensities: {
    intensity: 0.4288835937,
  },
};

describe('Rice calculator, QLD', () => {
  const context = testContext('Rice');
  const emissions = calculateEntireRice(
    riceTestData.crops,
    riceTestData.electricityUse,
    riceTestData.electricityRenewable,
    riceTestData.state,
    riceTestData.vegetation,
    context,
  );

  executeEmissionsSpec(emissions, expectations);
});

describe('Rice calculator (multi activity)', () => {
  const originalActivity = clone(riceTestData.crops[0]);
  originalActivity.id = 'rice-original';
  const activityDoubleYield = clone(originalActivity);
  activityDoubleYield.id = 'rice-double-yield';

  activityDoubleYield.averageRiceYield = originalActivity.averageRiceYield * 2;

  const riceDoubleYield: RiceInput = {
    ...riceTestData,
    crops: [activityDoubleYield],
    vegetation: [],
  };

  const riceTestDataAllActivities: RiceInput = {
    ...riceTestData,
    crops: [originalActivity, activityDoubleYield],
  };

  compareEmissionsFrom2Inputs<
    RiceInput,
    RiceIntermediateOutput,
    'intermediate',
    RiceOutput,
    ConstantsForRiceCalculator
  >(
    'Rice',
    calculateRice,
    riceTestData,
    riceDoubleYield,
    riceTestDataAllActivities,
    (originalEmissions, secondEmissions) => {
      expect(originalEmissions.intensities.riceProducedTonnes).toBeCloseTo(
        secondEmissions.intensities.riceProducedTonnes / 2,
        7,
      );
    },
  );
});
