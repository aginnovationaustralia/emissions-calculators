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
    cropResidueN2O: 244.320006369,
    leachingAndRunoffN2O: 679.379452205,
    fuelN2O: 0.02087,
    total: 2558.089647448,
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
    total: 3424.326462648,
    crops: [3424.326462648],
  },
  carbonSequestration: {
    total: 104.962,
  },
  intensities: [
    {
      tonnesCropExcludingSequestration: 0.67262978133,
      tonnesCropIncludingSequestration: 0.65262558846,
      balesExcludingSequestration: 0.14797855189,
      balesIncludingSequestration: 0.14357762946,
      lintExcludingSequestration: 0.73989275947,
      lintIncludingSequestration: 0.71788814731,
      seedExcludingSequestration: 7.39892759465,
      seedIncludingSequestration: 7.17888147306,
      lintEconomicAllocation: 3035.18807787742,
      seedEconomicAllocation: 494.10038477074,
    },
  ],
};

describe('Cotton calculator, NSW', () => {
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

describe('Cotton calculator (multi activity)', () => {
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
