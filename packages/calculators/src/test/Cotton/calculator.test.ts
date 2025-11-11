/* eslint-disable camelcase */
import {
  calculateCotton,
  calculateEntireCotton,
} from '@/calculators/Cotton/calculator';
import { ConstantsForCottonCalculator } from '@/calculators/Cotton/constants';
import { CottonInput } from '@/types/Cotton/input';
import { CottonIntermediateOutput } from '@/types/Cotton/intermediate.output';
import { CottonOutput } from '@/types/Cotton/output';
import clone from 'nanoclone';
import { compareEmissionsFrom2Inputs } from '../common/comparisons';
import { testContext } from '../common/context';
import { executeEmissionsSpec } from '../common/emissions';
import { cottonTestData } from './cotton.data';

const expectations = {
  scope1: {
    fuelCO2: 5.1281952,
    limeCO2: 2.8515666667,
    ureaCO2: 398.2,
    fieldBurningCH4: 0,
    fuelCH4: 0.0066146,
    fertiliserN2O: 1106.47111929,
    atmosphericDepositionN2O: 121.7118231214286,
    fieldBurningN2O: 0,
    cropResidueN2O: 244.32000636921427,
    leachingAndRunoffN2O: 679.3794522051428,
    fuelN2O: 0.02087,
    total: 2472.1162058431,
  },
  scope2: {
    electricity: 2.112,
    total: 2.112,
  },
  scope3: {
    fertiliser: 967.24125,
    herbicide: 0.1695,
    electricity: 0.128,
    fuel: 1.2979552,
    lime: 0.25011,
    total: 969.0868152,
  },
  net: {
    total: 3338.3530210431,
    crops: [3338.3530210431],
  },
  carbonSequestration: {
    total: 104.962,
  },
  intensities: [
    {
      tonnesCropExcludingSequestration: 0.6562445247,
      tonnesCropIncludingSequestration: 0.6362403318,
      // REVISIT: Calculate fresh bales intensity using 1.1.0 sheet
      // balesExcludingSequestration: 0.1509164417733,
      // balesIncludingSequestration: 0.1463754899913,
      lintExcludingSequestration: 0.72186897716,
      lintIncludingSequestration: 0.699864364999,
      seedExcludingSequestration: 7.2186897716,
      seedIncludingSequestration: 6.99864364999,
      lintEconomicAllocation: 2961.2509180971,
      seedEconomicAllocation: 482.064102946,
    },
  ],
};

describe.only('Cotton calculator, NSW', () => {
  const context = testContext('Cotton');
  const emissions = calculateEntireCotton(
    cottonTestData.crops,
    cottonTestData.electricityUse,
    cottonTestData.electricityRenewable,
    cottonTestData.state,
    cottonTestData.vegetation,
    context,
  );

  executeEmissionsSpec(emissions, expectations);
});

describe.skip('Cotton calculator (multi activity)', () => {
  const originalActivity = clone(cottonTestData.crops[0]);
  originalActivity.id = 'cotton-original';
  const activityDoubleSaleYield = clone(originalActivity);
  activityDoubleSaleYield.id = 'cotton-double-yield';

  activityDoubleSaleYield.areaSown *= 2;

  const cottonDoubleSaleYield: CottonInput = {
    ...cottonTestData,
    crops: [activityDoubleSaleYield],
    vegetation: [],
  };

  const cottonTestDataAllActivities: CottonInput = {
    ...cottonTestData,
    crops: [originalActivity, activityDoubleSaleYield],
  };

  compareEmissionsFrom2Inputs<
    CottonInput,
    CottonIntermediateOutput,
    'intermediate',
    CottonOutput,
    ConstantsForCottonCalculator
  >(
    'Grains',
    calculateCotton,
    cottonTestData,
    cottonDoubleSaleYield,
    cottonTestDataAllActivities,
    (originalEmissions, secondEmissions) => {
      expect(
        originalEmissions.intensities[0].cottonYieldProducedTonnes,
      ).toBeCloseTo(
        secondEmissions.intensities[0].cottonYieldProducedTonnes / 2,
        7,
      );
    },
  );
});
