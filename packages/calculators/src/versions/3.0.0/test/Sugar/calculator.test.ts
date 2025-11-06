/* eslint-disable camelcase */
import clone from 'nanoclone';
import { calculateEntireSugar, calculateSugar } from '../../Sugar/calculator';
import { SugarInput } from '../../types/Sugar/input';
import { compareEmissionsFrom2Inputs } from '../common/comparisons';
import { testContext } from '../common/context';
import { executeEmissionsSpec } from '../common/emissions';
import { sugarTestData } from './sugar.data';

const expectations = {
  scope1: {
    fuelCO2: 979.1126628,
    limeCO2: 0.198,
    ureaCO2: 472.2666666667,
    fieldBurningCH4: 0.0,
    fuelCH4: 0.8005744,
    fertiliserN2O: 2836.1184342857,
    atmosphericDepositionN2O: 311.9730277714,
    cropResidueN2O: 176.6877590893,
    fieldBurningN2O: 0.0,
    leachingAndRunoffN2O: 468.983606142857,
    fuelN2O: 4.83188,
    total: 5250.97261115595,
  },
  scope2: {
    electricity: 191.7,
    total: 191.7,
  },
  scope3: {
    fertiliser: 1156.7466666666667,
    herbicide: 274.125,
    electricity: 27,
    fuel: 242.6095028,
    lime: 0.017865,
    total: 1700.4990344666667,
  },
  net: {
    total: 6906.93374562262,
    crops: [6906.93374562262],
  },
  intensities: [
    {
      // REVISIT: Calculate fresh intensity using 1.1.0 sheet
      // sugarExcludingSequestration: 0.28953141875015065,
      sugarIncludingSequestration: 0.2807178857,
    },
  ],
};

describe('Sugar calculator, QLD', () => {
  const context = testContext('Sugar');
  const emissions = calculateEntireSugar(
    sugarTestData.crops,
    sugarTestData.electricityUse,
    sugarTestData.electricityRenewable,
    sugarTestData.state,
    sugarTestData.vegetation,
    context,
  );

  executeEmissionsSpec(emissions, expectations);
});

describe('Sugar calculator (multi activity)', () => {
  const originalActivity = clone(sugarTestData.crops[0]);
  originalActivity.id = 'sugar-original';
  const activityDoubleYield = clone(originalActivity);
  activityDoubleYield.id = 'sugar-double-yield';

  activityDoubleYield.averageCaneYield *= 2;

  const sugarDoubleYield: SugarInput = {
    ...sugarTestData,
    crops: [activityDoubleYield],
    vegetation: [],
  };

  const sugarTestDataAllActivities: SugarInput = {
    ...sugarTestData,
    crops: [originalActivity, activityDoubleYield],
  };

  compareEmissionsFrom2Inputs(
    'Sugar',
    calculateSugar,
    sugarTestData,
    sugarDoubleYield,
    sugarTestDataAllActivities,
    (originalEmissions, secondEmissions) => {
      expect(originalEmissions.intensities[0].sugarProducedKg).toBeCloseTo(
        secondEmissions.intensities[0].sugarProducedKg / 2,
        7,
      );
    },
  );
});
