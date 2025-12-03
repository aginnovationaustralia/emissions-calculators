import { entriesFromObject } from '@/calculators/common/tools/object';
import { calculatePork } from '@/calculators/Pork/calculator';
import { ConstantsForPorkCalculator } from '@/calculators/Pork/constants';
import { PorkInput, PorkInputSchema } from '@/types/Pork/input';
import { PorkIntermediateOutput } from '@/types/Pork/intermediate.output';
import { PorkOutput } from '@/types/Pork/output';
import clone from 'nanoclone';
import { validateCalculatorInput } from '../../calculators/validate';
import { compareEmissionsFrom2Inputs } from '../common/comparisons';
import { testContext } from '../common/context';
import { executeEmissionsSpec } from '../common/emissions';
import { porkMinimalTestData, porkTestData } from './pork.data';

const expectations = {
  scope1: {
    fuelCO2: 1.505289,
    limeCO2: 0,
    ureaCO2: 73.33333333,
    fuelCH4: 0.0019735,
    manureManagementCH4: 4761.52298496,
    entericCH4: 133.32946853,
    manureManagementDirectN2O: 157.26604064,
    fertiliserN2O: 100.6841,
    atmosphericDepositionN2O: 9.5432668,
    atmosphericDepositionIndirectN2O: 19.53471175,
    leachingAndRunoffSoilN2O: 34.82114708,
    leachingAndRunoffMMSN2O: 0.67272485,
    fuelN2O: 0.007405,
    totalCO2: 74.83862233,
    totalCH4: 4894.85442699,
    totalN2O: 322.52939611,
    total: 5292.22244543,
  },
  scope2: {
    electricity: 0.594,
    total: 0.594,
  },
  scope3: {
    fertiliser: 164.043,
    purchasedFeed: 8.61698,
    herbicide: 0.953325,
    electricity: 0.036,
    fuel: 0.386309,
    lime: 0,
    bedding: 9,
    purchasedLivestock: 18,
    total: 201.035614,
  },
  carbonSequestration: {
    total: 159.6817,
  },
  net: {
    total: 5334.17035943,
  },
  intensities: {
    porkMeatExcludingSequestration: 12.48602741,
    porkMeatIncludingSequestration: 12.12311445,
  },
};

describe('Pork calculator, NSW', () => {
  const validatedInput = validateCalculatorInput(PorkInputSchema, porkTestData);

  if (!validatedInput.valid) {
    throw validatedInput.error;
  }

  const context = testContext('Pork');
  const emissions = calculatePork(validatedInput.result, context);

  executeEmissionsSpec(emissions, expectations);
});

describe('Pork calculator (multi activity)', () => {
  const originalActivity = clone(porkTestData.pork[0]);
  originalActivity.id = 'pork-original';
  const activityDoubleSaleweight = clone(originalActivity);
  activityDoubleSaleweight.id = 'pork-double-saleweight';

  entriesFromObject(activityDoubleSaleweight.classes).forEach(
    ([key, value]) => {
      if (value) {
        activityDoubleSaleweight.classes[key] = {
          ...value,
          saleWeight: value.saleWeight
            ? value.saleWeight * 2
            : value.saleWeight,
        };
      }
    },
  );

  const porkDoubleSaleweight = {
    ...porkTestData,
    pork: [activityDoubleSaleweight],
    vegetation: [],
  };

  const porkTestDataAllActivities = {
    ...porkTestData,
    pork: [originalActivity, activityDoubleSaleweight],
  };

  compareEmissionsFrom2Inputs<
    PorkInput,
    PorkIntermediateOutput,
    'intermediate',
    PorkOutput,
    ConstantsForPorkCalculator
  >(
    'Pork',
    calculatePork,
    porkTestData,
    porkDoubleSaleweight,
    porkTestDataAllActivities,
    (originalEmissions, secondEmissions) => {
      expect(originalEmissions.intensities.liveweightProducedKg).toBeCloseTo(
        secondEmissions.intensities.liveweightProducedKg / 2,
      );
    },
  );
});

const minimalExpectations = {
  scope1: {
    fuelCO2: 0,
    limeCO2: 0,
    ureaCO2: 0,
    fuelCH4: 0,
    manureManagementCH4: 0,
    entericCH4: 7.891812930097791,
    manureManagementDirectN2O: 0,
    fertiliserN2O: 0,
    atmosphericDepositionN2O: 0,
    atmosphericDepositionIndirectN2O: 17.79408514916607,
    leachingAndRunoffSoilN2O: 0,
    leachingAndRunoffMMSN2O: 0,
    fuelN2O: 0,
    totalCO2: 0,
    totalCH4: 7.891812930097791,
    totalN2O: 17.79408514916607,
    total: 25.685898079263858,
  },
  scope2: {
    electricity: 0,
    total: 0,
  },
  scope3: {
    fertiliser: 0,
    purchasedFeed: 0,
    herbicide: 0,
    electricity: 0,
    fuel: 0,
    lime: 0,
    bedding: 0,
    purchasedLivestock: 0.18,
    total: 0.18,
  },
  carbonSequestration: {
    total: 0,
  },
  net: {
    total: 25.865898079263857,
  },
  intensities: {
    porkMeatExcludingSequestration: 517.3179615852772,
    porkMeatIncludingSequestration: 517.3179615852772,
  },
};

describe('Pork calculator minimal input, NSW', () => {
  const validatedInput = validateCalculatorInput(
    PorkInputSchema,
    porkMinimalTestData,
  );
  if (!validatedInput.valid) {
    throw validatedInput.error;
  }

  const context = testContext('Pork');
  const emissions = calculatePork(validatedInput.result, context);

  executeEmissionsSpec(emissions, minimalExpectations);
});
