/* eslint-disable camelcase */
import clone from 'nanoclone';
import {
  calculateEntireGrains,
  calculateGrains,
} from '../../Grains/calculator';
import { GrainsInput } from '../../types/Grains/input';
import { GrainsIntermediateOutput } from '../../types/Grains/intermediate.output';
import { GrainsOutput } from '../../types/Grains/output';
import { compareEmissionsFrom2Inputs } from '../common/comparisons';
import { testContext, V2_0_0 } from '../common/context';
import { executeEmissionsSpec } from '../common/emissions';
import { grainsTestData } from './grains.data';

const expectations_1_2_0 = {
  scope1: {
    atmosphericDepositionN2O: 15.0356816029,
    fuelCO2: 8.442144,
    fuelCH4: 0.0142995,
    fuelN2O: 0.034425,
    limeCO2: 554.4,
    leachingAndRunoffN2O: 60.93683904,
    fertiliserN2O: 136.6880145714,
    cropResidueN2O: 112.2506062889,
    ureaCO2: 84.524,
    fieldBurningN2O: 39.74047817143,
    fieldBurningCH4: 106.87488,
    total: 1118.9413681746,
  },
  scope2: {
    electricity: 2.64,
    total: 2.64,
  },
  scope3: {
    fertiliser: 241.79001333333332,
    herbicide: 1.884075,
    electricity: 0.16,
    fuel: 2.198544,
    lime: 50.022,
    total: 296.05463233333336,
  },
  net: {
    total: 1078.7482005079,
    crops: [
      508.490775796, 30.2453559, 155.839426027, 265.505669154, 118.666973631,
    ],
  },
  intensities: [
    0.169496925277, 0.0604907118, 0.15583942603, 0.05531368107, 0.09888914469,
  ],
  intensitiesWithSequestration: [
    {
      grainsExcludingSequestration: 0.23727448527,
      grainsIncludingSequestration: 0.169496925277,
    },
    {
      grainsExcludingSequestration: 0.1960458318,
      grainsIncludingSequestration: 0.0604907118,
    },
    {
      grainsExcludingSequestration: 0.17278381603,
      grainsIncludingSequestration: 0.15583942603,
    },
    {
      grainsExcludingSequestration: 0.05884376232,
      grainsIncludingSequestration: 0.05531368107,
    },
    {
      grainsExcludingSequestration: 0.12712979469,
      grainsIncludingSequestration: 0.09888914469,
    },
  ],
};

describe('Grains calculator, NSW', () => {
  const context = testContext(V2_0_0, 'Grains');
  const emissions = calculateEntireGrains(
    grainsTestData.crops,
    grainsTestData.electricityUse,
    grainsTestData.electricityRenewable,
    grainsTestData.state,
    grainsTestData.vegetation,
    context,
  );

  executeEmissionsSpec(V2_0_0, emissions, expectations_1_2_0);
});

describe('Grains calculator (multi activity)', () => {
  const originalActivity = clone(grainsTestData.crops[0]);
  originalActivity.id = 'grains-original';
  const activityDoubleSaleweight = clone(originalActivity);
  activityDoubleSaleweight.id = 'grains-double-yield';
  const vegetation = [clone(grainsTestData.vegetation[0])];
  vegetation[0].allocationToCrops = [0.5];

  activityDoubleSaleweight.averageGrainYield *= 2;

  const grainsOriginal = {
    ...grainsTestData,
    crops: [originalActivity],
    vegetation,
  };

  const grainsDoubleSaleweight = {
    ...grainsTestData,
    crops: [activityDoubleSaleweight],
    vegetation: [],
  };

  const grainsTestDataAllActivities = {
    ...grainsTestData,
    crops: [originalActivity, activityDoubleSaleweight],
    vegetation,
  };

  compareEmissionsFrom2Inputs<
    GrainsInput,
    GrainsIntermediateOutput,
    'intermediate',
    GrainsOutput
  >(
    'Grains',
    calculateGrains,
    grainsOriginal,
    grainsDoubleSaleweight,
    grainsTestDataAllActivities,
    (originalEmissions, secondEmissions) => {
      expect(
        originalEmissions.intensitiesWithSequestration[0].grainProducedTonnes,
      ).toBeCloseTo(
        secondEmissions.intensitiesWithSequestration[0].grainProducedTonnes / 2,
        7,
      );
    },
    {
      transformIntermediate: (intermediate) => {
        const { intensitiesWithSequestration, ...rest } = intermediate;
        return {
          ...rest,
          intensitiesWithSequestration: [intensitiesWithSequestration],
          intensities: [
            intermediate.intensitiesWithSequestration
              .grainsIncludingSequestration,
          ],
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
