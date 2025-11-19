/* eslint-disable camelcase */
import { entriesFromObject } from '@/calculators/common/tools/object';
import { calculateGoat } from '@/calculators/Goat/calculator';
import { ConstantsForGoatCalculator } from '@/calculators/Goat/constants';
import { GoatInput, GoatInputSchema } from '@/types/Goat/input';
import { GoatIntermediateOutput } from '@/types/Goat/intermediate.output';
import { GoatOutput } from '@/types/Goat/output';
import clone from 'nanoclone';
import { validateCalculatorInput } from '../../calculators/validate';
import { compareEmissionsFrom2Inputs } from '../common/comparisons';
import { testContext } from '../common/context';
import {
  ensureEveryKeyIsDefined,
  executeEmissionsSpec,
  KeyValuePairs,
} from '../common/emissions';
import { goatTestData } from './goats.data';

const expectations = {
  scope1: {
    atmosphericDepositionN2O: 3.03504802857,
    fertiliserN2O: 19.79243357143,
    manureManagementCH4: 8.6184,
    entericCH4: 126.0,
    urineAndDungN2O: 10.494,
    leachingAndRunoffN2O: 13.37935028571,
    fuelCO2: 7.454868,
    fuelCH4: 0.0117106,
    fuelN2O: 0.023222,
    ureaCO2: 14.69233333333,
    limeCO2: 39.6,
    total: 243.10136581905,
  },
  scope2: {
    electricity: 0.1782,
    total: 0.1782,
  },
  scope3: {
    electricity: 0.0108,
    fertiliser: 42.4284,
    purchasedMineralSupplementation: 0.02979315438,
    purchasedFeed: 48.0,
    herbicide: 18.825,
    fuel: 1.898276,
    lime: 3.573,
    purchasedLivestock: 963.9,
    total: 1078.66526915437,
  },
  carbonSequestration: {
    total: 145.6623,
  },
  net: {
    total: 1176.28253497342,
  },
  intensities: {
    goatMeatBreedingExcludingSequestration: 3.85406657427,
    goatMeatBreedingIncludingSequestration: 3.4293951457,
    woolExcludingSequestration: 13.9174626293,
    woolIncludingSequestration: 12.38392691501,
  },
};

describe('Goat calculator, NSW', () => {
  const context = testContext('Goat');
  const emissions = calculateGoat(goatTestData, context);

  executeEmissionsSpec(emissions, expectations);
});

describe('Goat scenarios', () => {
  const input = {
    ...goatTestData,
    goats: [
      {
        ...goatTestData.goats[0],
        classes: {},
      },
    ],
  } as GoatInput;
  const validatedInput = validateCalculatorInput(GoatInputSchema, input);

  expect(validatedInput).toBeDefined();

  const context = testContext('Goat');
  const actualEmissions = calculateGoat(validatedInput, context);

  ensureEveryKeyIsDefined(actualEmissions as unknown as KeyValuePairs);
});

describe('Goat calculator (multi activity meat)', () => {
  const originalActivity = clone(goatTestData.goats[0]);
  originalActivity.id = 'goat-original';
  const activityDoubleSaleweight = clone(originalActivity);
  activityDoubleSaleweight.id = 'goat-double-saleweight';

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

  const goatDoubleSaleweight = {
    ...goatTestData,
    goats: [activityDoubleSaleweight],
    vegetation: [],
  };

  const goatTestDataAllActivities = {
    ...goatTestData,
    goats: [originalActivity, activityDoubleSaleweight],
  };

  compareEmissionsFrom2Inputs<
    GoatInput,
    GoatIntermediateOutput,
    'intermediate',
    GoatOutput,
    ConstantsForGoatCalculator
  >(
    'Goat',
    calculateGoat,
    goatTestData,
    goatDoubleSaleweight,
    goatTestDataAllActivities,
    (originalEmissions, secondEmissions) => {
      expect(originalEmissions.intensities.amountMeatProduced).toBeCloseTo(
        secondEmissions.intensities.amountMeatProduced / 2,
      );
    },
  );
});

describe('Goat calculator (multi activity wool)', () => {
  const originalActivity = clone(goatTestData.goats[0]);
  originalActivity.id = 'goat-original';

  const activityTripleWool = clone(originalActivity);
  activityTripleWool.id = 'goat-triple-wool';

  const goatOriginal = {
    ...goatTestData,
    goats: [originalActivity],
  };

  entriesFromObject(activityTripleWool.classes).forEach(([key, value]) => {
    if (!value) {
      return;
    }
    activityTripleWool.classes[key] = {
      ...value,
      woolShorn: value.woolShorn * 3,
    };
  });

  const goatTripleWool: GoatInput = {
    ...goatTestData,
    goats: [activityTripleWool],
    vegetation: [],
  };

  const goatTestDataAllActivities: GoatInput = {
    ...goatTestData,
    goats: [originalActivity, activityTripleWool],
  };

  compareEmissionsFrom2Inputs<
    GoatInput,
    GoatIntermediateOutput,
    'intermediate',
    GoatOutput,
    ConstantsForGoatCalculator
  >(
    'Goat',
    calculateGoat,
    goatOriginal,
    goatTripleWool,
    goatTestDataAllActivities,
    (originalEmissions, secondEmissions) => {
      expect(originalEmissions.intensities.amountWoolProduced).toBeCloseTo(
        secondEmissions.intensities.amountWoolProduced / 3,
      );
    },
  );
});
