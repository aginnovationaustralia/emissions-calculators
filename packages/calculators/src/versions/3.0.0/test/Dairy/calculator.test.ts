/* eslint-disable camelcase */
import { calculateDairy } from '../../Dairy/calculator';
import { ConstantsForDairyCalculator } from '../../Dairy/constants';
import { DairyClass } from '../../types/Dairy/dairyclass.input';
import { DairyInput } from '../../types/Dairy/input';
import { DairyIntermediateOutput } from '../../types/Dairy/intermediate.output';
import { DairyOutput } from '../../types/Dairy/output';
import { compareEmissionsFrom2Inputs } from '../common/comparisons';
import { testContext } from '../common/context';
import { executeEmissionsSpec } from '../common/emissions';
import { dairyComplete, dairyTestData } from './dairy.data';

const expectations = {
  scope1: {
    atmosphericDepositionN2O: 31.6148351498862,
    fertiliserN2O: 19.6560948571429,
    manureManagementCH4: 704.14154138275,
    manureManagementN2O: 64.9348779717347,
    entericCH4: 2713.30523470814,
    transportN2O: 0.143263128,
    transportCH4: 0.071631564,
    transportCO2: 50.070463236,
    animalWasteN2O: 85.5279709727505,
    urineAndDungN2O: 12.4531783210503,
    leachingAndRunoffN2O: 105.446193083316,
    fuelCO2: 44.71502742,
    fuelCH4: 0.089220379,
    fuelN2O: 0.18209073,
    ureaCO2: 0.0066,
    limeCO2: 339.53333333333,
    total: 4171.89155623711,
  },
  scope2: {
    electricity: 3.9501,
    total: 3.9501,
  },
  scope3: {
    electricity: 0.4617,
    fertiliser: 17.3686,
    purchasedFeed: 24.375,
    herbicide: 20.25,
    fuel: 11.88736814,
    lime: 28.584,
    total: 102.92666814,
  },
  carbonSequestration: {
    total: 50.4992,
  },
  net: {
    total: 3586.45387572054,
  },
  intensities: {
    intensity: 22.2115482112808,
  },
};

describe('Dairy calculator, VIC', () => {
  const context = testContext('Diary');
  const emissions = calculateDairy(dairyTestData, context);

  executeEmissionsSpec(emissions, expectations);
});

describe('Dairy calculator (multi activity), VIC', () => {
  const originalActivity = {
    ...dairyComplete,
    id: 'dairy-original',
  };

  const originalMilkingCows = { ...dairyComplete.classes.milkingCows };
  const doubleMilkingCows: DairyClass = { ...originalMilkingCows };
  doubleMilkingCows.spring = {
    ...originalMilkingCows.spring,
    milkProduction: originalMilkingCows.spring.milkProduction! * 2,
  };
  doubleMilkingCows.summer = {
    ...originalMilkingCows.summer,
    milkProduction: originalMilkingCows.summer.milkProduction! * 2,
  };
  doubleMilkingCows.autumn = {
    ...originalMilkingCows.autumn,
    milkProduction: originalMilkingCows.autumn.milkProduction! * 2,
  };
  doubleMilkingCows.winter = {
    ...originalMilkingCows.winter,
    milkProduction: originalMilkingCows.winter.milkProduction! * 2,
  };

  const activityDoubleMilk = {
    ...originalActivity,
    id: 'dairy-double-milk',
    classes: {
      ...originalActivity.classes,
      milkingCows: doubleMilkingCows,
    },
  };

  const dairyTestDataMilkChanged = {
    ...dairyTestData,
    dairy: [activityDoubleMilk],
    vegetation: [],
  };

  const dairyTestDataAllActivities = {
    ...dairyTestData,
    dairy: [originalActivity, activityDoubleMilk],
  };

  compareEmissionsFrom2Inputs<
    DairyInput,
    DairyIntermediateOutput,
    'intermediate',
    DairyOutput,
    ConstantsForDairyCalculator
  >(
    'Dairy',
    calculateDairy,
    dairyTestData,
    dairyTestDataMilkChanged,
    dairyTestDataAllActivities,
    (originalEmissions, secondEmissions) => {
      expect(
        originalEmissions.intensities.milkSolidsProducedTonnes,
      ).toBeCloseTo(secondEmissions.intensities.milkSolidsProducedTonnes / 2);
    },
  );
});
