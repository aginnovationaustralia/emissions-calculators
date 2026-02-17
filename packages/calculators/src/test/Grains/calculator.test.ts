import { calculateGrains } from '@/calculators/Grains/calculator';
import { GrainsInputSchema } from '@/calculators/Grains/types';
import { Decimal } from 'decimal.js-light';
import clone from 'nanoclone';
import { executeEmissionsSpec } from '../common/emissions';
import { testContext } from './context';
import { grainsTestData } from './grains.data';

const expectations = {
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
  const context = testContext('Grains');
  const emissions = calculateGrains(
    GrainsInputSchema.parse(grainsTestData),
    context,
  );

  executeEmissionsSpec(emissions, expectations);
});

describe('Grains calculator (multi activity)', () => {
  const parsed = GrainsInputSchema.parse(grainsTestData);
  const originalActivity = clone(parsed.crops[0]);
  originalActivity.id = 'grains-original';
  const activityDoubleSaleweight = clone(originalActivity);
  activityDoubleSaleweight.id = 'grains-double-yield';
  const vegetation = [clone(parsed.vegetation[0])];
  vegetation[0].allocationToCrops = [0.5];

  activityDoubleSaleweight.averageYield.unit.value = new Decimal(
    activityDoubleSaleweight.averageYield.unit.value.mul(2),
  );

  // const grainsOriginal = {
  //   ...parsed,
  //   crops: [originalActivity],
  //   vegetation,
  // };

  // const grainsDoubleSaleweight = {
  //   ...parsed,
  //   crops: [activityDoubleSaleweight],
  //   vegetation: [],
  // };

  // const grainsTestDataAllActivities = {
  //   ...parsed,
  //   crops: [originalActivity, activityDoubleSaleweight],
  //   vegetation,
  // };

  //   compareEmissionsFrom2Inputs<
  //     GrainsInputTransformed,
  //     GrainsIntermediateOutput,
  //     'intermediate',
  //     GrainsOutput,
  //     ConstantsForGrainsCalculator
  //   >(
  //     'Grains',
  //     calculateGrains,
  //     grainsOriginal,
  //     grainsDoubleSaleweight,
  //     grainsTestDataAllActivities,
  //     (originalEmissions, secondEmissions) => {
  //       expect(
  //         originalEmissions.intensitiesWithSequestration[0].grainProducedTonnes,
  //       ).toBeCloseTo(
  //         secondEmissions.intensitiesWithSequestration[0].grainProducedTonnes / 2,
  //         7,
  //       );
  //     },
  //     {
  //       transformIntermediate: (intermediate) => {
  //         const { intensitiesWithSequestration, ...rest } = intermediate;
  //         return {
  //           ...rest,
  //           intensitiesWithSequestration: [intensitiesWithSequestration],
  //           intensities: [
  //             intermediate.intensitiesWithSequestration
  //               .grainsIncludingSequestration,
  //           ],
  //           intermediate: [intermediate],
  //           carbonSequestration: {
  //             total: intermediate.carbonSequestration.total,
  //             intermediate: [intermediate.carbonSequestration.total],
  //           },
  //         };
  //       },
  //     },
  //   );
});
