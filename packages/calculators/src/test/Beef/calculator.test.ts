/* eslint-disable camelcase */
import { calculateBeef } from '@/calculators/Beef/calculator';
import { ConstantsForBeefCalculator } from '@/calculators/Beef/constants';
import { entriesFromObject } from '@/calculators/common/tools/object';
import { BeefInput, BeefInputSchema } from '@/types/Beef/input';
import { BeefIntermediateOutput } from '@/types/Beef/intermediate.output';
import { BeefOutput } from '@/types/Beef/output';
import clone from 'nanoclone';
import { validateCalculatorInput } from '../../calculators/validate';
import { compareEmissionsFrom2Inputs } from '../common/comparisons';
import { testContext } from '../common/context';
import {
  ensureEveryKeyIsDefined,
  executeEmissionsSpec,
  KeyValuePairs,
} from '../common/emissions';
import { beefTestInput } from './beef.data';
import { beefTestData } from './input.data';

const expectations = {
  scope1: {
    atmosphericDepositionN2O: 4414.937327266,
    leachingAndRunoffN2O: 30832.2499168963,
    urineAndDungN2O: 46697.2906056871,
    manureManagementCH4: 12316.2149283396,
    entericCH4: 263509.714745869,
    fertiliserN2O: 19.7924335714,
    limeCO2: 39.6,
    fuelCO2: 1.617879,
    fuelCH4: 0.0028414,
    fuelN2O: 0.006088,
    ureaCO2: 14.6923333333,
    savannahBurningCH4: 0,
    savannahBurningN2O: 0,
  },
  scope2: {
    electricity: 2.079,
  },
  scope3: {
    fertiliser: 42.4284,
    purchasedMineralSupplementation: 0.0297931544,
    purchasedFeed: 81.0,
    herbicide: 18.825,
    electricity: 0.243,
    fuel: 0.421271,
    lime: 3.573,
    purchasedLivestock: 484.0,
    total: 630.5204641544,
  },
  carbonSequestration: {
    total: 256.7532,
  },
  net: {
    total: 358221.965363518,
  },
  intensities: {
    beefIncludingSequestration: 16282.81660743265,
    beefExcludingSequestration: 16294.4872074326,
    liveweightBeefProducedKg: 22000,
  },
};

describe('Beef calculator, VIC', () => {
  const context = testContext('Beef');
  const emissions = calculateBeef(
    validateCalculatorInput(BeefInputSchema, beefTestData),
    context,
  );

  executeEmissionsSpec(emissions, expectations);
});

describe('Beef input scenarios', () => {
  describe('all classes are missing', () => {
    const input = {
      ...beefTestData,
      beef: [
        {
          ...beefTestInput,
          classes: {},
        },
      ],
    };

    const validatedInput = validateCalculatorInput(BeefInputSchema, input);

    expect(validatedInput).toBeDefined();

    const context = testContext('Beef');
    const emissions = calculateBeef(validatedInput, context);

    ensureEveryKeyIsDefined(emissions as unknown as KeyValuePairs);
  });
});

describe('Beef calculator (multi activity)', () => {
  const originalActivity = clone(beefTestData.beef[0]);
  originalActivity.id = 'beef-original';
  const activityDoubleSaleweight = clone(originalActivity);
  activityDoubleSaleweight.id = 'beef-double-saleweight';

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

  const beefDoubleSaleweight: BeefInput = {
    ...beefTestData,
    beef: [activityDoubleSaleweight],
    vegetation: [],
  };

  const beefTestDataAllActivities: BeefInput = {
    ...beefTestData,
    beef: [originalActivity, activityDoubleSaleweight],
  };

  compareEmissionsFrom2Inputs<
    BeefInput,
    BeefIntermediateOutput,
    'intermediate',
    BeefOutput,
    ConstantsForBeefCalculator
  >(
    'Beef',
    calculateBeef,
    beefTestData,
    beefDoubleSaleweight,
    beefTestDataAllActivities,
    (originalEmissions, secondEmissions) => {
      expect(
        originalEmissions.intensities.liveweightBeefProducedKg,
      ).toBeCloseTo(secondEmissions.intensities.liveweightBeefProducedKg / 2);
    },
  );
});
