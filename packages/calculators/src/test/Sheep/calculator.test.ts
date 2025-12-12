import { entriesFromObject } from '@/calculators/common/tools/object';
import { calculateSheep } from '@/calculators/Sheep/calculator';
import { ConstantsForSheepCalculator } from '@/calculators/Sheep/constants';
import { SheepInput, SheepInputSchema } from '@/types/Sheep/input';
import { SheepIntermediateOutput } from '@/types/Sheep/intermediate.output';
import { SheepOutput } from '@/types/Sheep/output';
import clone from 'nanoclone';
import { validateCalculatorInput } from '../../calculators/validate';
import { compareEmissionsFrom2Inputs } from '../common/comparisons';
import { testContext } from '../common/context';
import {
  ensureEveryKeyIsDefined,
  executeEmissionsSpec,
  KeyValuePairs,
} from '../common/emissions';
import { lambingRatesTestData, sheepTestData } from './input.data';
import { sheepTestInput } from './sheep.data';

const expectations = {
  scope1: {
    atmosphericDepositionN2O: -56.97801019438,
    leachingAndRunoffN2O: -399.20581930768,
    urineAndDungN2O: -621.09801626704,
    fertiliserN2O: 16.58426785714,
  },
  scope2: {
    electricity: 0.539,
    total: 0.539,
  },
  scope3: {
    electricity: 0.063,
    total: 931.43402427758,
  },
  net: {
    total: 212.69846125251,
    sheep: 212.69846125251,
  },
  intensities: {
    sheepMeatBreedingIncludingSequestration: 0.55810091874,
    sheepMeatBreedingExcludingSequestration: 0.8583561374,
    woolIncludingSequestration: 2.01536442878,
    woolExcludingSequestration: 3.09961938505,
  },
};

const lambingExpectations = {
  scope1: {
    atmosphericDepositionN2O: 0.42202932229111,
    urineAndDungN2O: 4.46591875440332,
    entericCH4: 90.8434046705948,
    manureManagementCH4: 4.93256081245122,
    total: 100.68481355974,
  },
  scope2: {
    electricity: 0,
    total: 0,
  },
  scope3: {
    purchasedMineralSupplementation: 0.0286639776,
    purchasedFeed: 1.8375,
    total: 1.8661639776,
  },
  net: {
    total: 102.55097753734,
    sheep: 102.55097753734,
  },
};

describe('Sheep calculator, VIC', () => {
  const context = testContext('Sheep');
  const emissions = calculateSheep(sheepTestData, context);

  executeEmissionsSpec(emissions, expectations);
});

describe('Lambing scenario, VIC', () => {
  const context = testContext('Sheep');
  const emissions = calculateSheep(lambingRatesTestData, context);

  executeEmissionsSpec(emissions, lambingExpectations);
});

describe('Sheep scenarios', () => {
  const input = {
    ...sheepTestData,
    sheep: [
      {
        ...sheepTestInput,
        classes: {
          breedingEwes: sheepTestInput.classes.breedingEwes,
          eweLambs: sheepTestInput.classes.eweLambs,
          wetherLambs: sheepTestInput.classes.wetherLambs,
        },
      },
    ],
  };

  const validatedInput = validateCalculatorInput(SheepInputSchema, input);

  if (!validatedInput.valid) {
    throw new Error(JSON.stringify(validatedInput.issues));
  }

  const context = testContext('Sheep');
  const emissions = calculateSheep(validatedInput.result, context);

  ensureEveryKeyIsDefined(emissions as unknown as KeyValuePairs);
});

describe('Sheep calculator (multi activity)', () => {
  const originalActivity = clone(sheepTestData.sheep[0]);
  originalActivity.id = 'sheep-original';
  const activityDoubleWool = clone(originalActivity);
  activityDoubleWool.id = 'sheep-double-wool';

  // Double the wool production by adjusting the breeding ewes wool production
  entriesFromObject(activityDoubleWool.classes).forEach(([key, value]) => {
    if (!value) {
      return;
    }
    activityDoubleWool.classes[key] = {
      ...value,
      woolShorn: value.woolShorn * 2,
    };
  });

  const sheepDoubleWool: SheepInput = {
    ...sheepTestData,
    sheep: [activityDoubleWool],
    vegetation: [],
  };

  const sheepTestDataAllActivities: SheepInput = {
    ...sheepTestData,
    sheep: [originalActivity, activityDoubleWool],
  };

  compareEmissionsFrom2Inputs<
    SheepInput,
    SheepIntermediateOutput,
    'intermediate',
    SheepOutput,
    ConstantsForSheepCalculator
  >(
    'Sheep',
    calculateSheep,
    sheepTestData,
    sheepDoubleWool,
    sheepTestDataAllActivities,
    (originalEmissions, secondEmissions) => {
      expect(originalEmissions.intensities.woolProducedKg).toBeCloseTo(
        secondEmissions.intensities.woolProducedKg / 2,
      );
    },
  );
});
