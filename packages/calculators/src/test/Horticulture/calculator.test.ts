import {
  calculateEntireHorticulture,
  calculateHorticulture,
} from '@/calculators/Horticulture/calculator';
import { ConstantsForHorticultureCalculator } from '@/calculators/Horticulture/constants';
import { HorticultureInput } from '@/types/Horticulture/input';
import { HorticultureIntermediateOutput } from '@/types/Horticulture/intermediate.output';
import { HorticultureOutput } from '@/types/Horticulture/output';
import clone from 'nanoclone';
import { compareEmissionsFrom2Inputs } from '../common/comparisons';
import { testContext } from '../common/context';
import { executeEmissionsSpec } from '../common/emissions';
import { horticultureTestData } from './horticulture.data';

const expectations = {
  scope1: {
    atmosphericDepositionN2O: 12.488859429,
    fuelCO2: 1.848387,
    fuelCH4: 0.0032176,
    fuelN2O: 0.006772,
    limeCO2: 15.84,
    leachingAndRunoffN2O: 73.745835429,
    fertiliserN2O: 113.535085714,
    cropResidueN2O: 51.276682286,
    ureaCO2: 37.95,
    fieldBurningN2O: 0,
    fieldBurningCH4: 0,
    hfcsRefrigerantLeakage: 208,
    total: 514.694839457,
  },
  scope2: {
    electricity: 0.16632,
    total: 0.16632,
  },
  scope3: {
    fertiliser: 110.613,
    herbicide: 0.269475,
    electricity: 0.01944,
    fuel: 0.480095,
    lime: 1.4292,
    total: 112.81121,
  },
  net: {
    total: 548.941694457,
    crops: [548.941694457],
  },
  intensities: [
    {
      tonnesCropExcludingSequestration: 0.209224123,
      tonnesCropIncludingSequestration: 0.182980565,
    },
  ],
};

describe('Horticulture calculator, VIC', () => {
  const context = testContext('Horticulture');
  const emissions = calculateEntireHorticulture(
    horticultureTestData.crops,
    horticultureTestData.electricityUse,
    horticultureTestData.electricityRenewable,
    horticultureTestData.state,
    horticultureTestData.vegetation,
    context,
  );

  executeEmissionsSpec(emissions, expectations);
});

describe('Horticulture calculator (multi activity)', () => {
  const originalActivity = clone(horticultureTestData.crops[0]);
  originalActivity.id = 'hort-original';
  const activityDoubleYield = clone(originalActivity);
  activityDoubleYield.id = 'hort-double-yield';
  const vegetation = [clone(horticultureTestData.vegetation[0])];
  vegetation[0].allocationToCrops = [0.5];

  activityDoubleYield.averageYield *= 2;

  const hortOriginal: HorticultureInput = {
    ...horticultureTestData,
    crops: [originalActivity],
    vegetation,
  };

  const hortDoubleYield = {
    ...horticultureTestData,
    crops: [activityDoubleYield],
    vegetation: [],
  };

  const horticultureTestDataAllActivities = {
    ...horticultureTestData,
    crops: [originalActivity, activityDoubleYield],
    vegetation,
  };

  compareEmissionsFrom2Inputs<
    HorticultureInput,
    HorticultureIntermediateOutput,
    'intermediate',
    HorticultureOutput,
    ConstantsForHorticultureCalculator
  >(
    'Grains',
    calculateHorticulture,
    hortOriginal,
    hortDoubleYield,
    horticultureTestDataAllActivities,
    (originalEmissions, secondEmissions) => {
      expect(originalEmissions.intensities[0].cropProducedTonnes).toBeCloseTo(
        secondEmissions.intensities[0].cropProducedTonnes / 2,
        7,
      );
    },
    {
      transformIntermediate: (intermediate) => {
        const { intensitiesWithSequestration: _, ...rest } = intermediate;
        return {
          ...rest,
          intensities: [intermediate.intensitiesWithSequestration],
          intermediate: [intermediate],
          carbonSequestration: {
            total: intermediate.carbonSequestration.total,
            intermediate: [intermediate.carbonSequestration.total],
          },
        };
      },
    },
  );
});
