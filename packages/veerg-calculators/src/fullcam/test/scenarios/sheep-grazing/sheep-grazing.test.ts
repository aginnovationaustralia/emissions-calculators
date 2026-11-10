import { FullCAMAreaInput } from '@/fullcam/input';
import { FullCAMAreaError } from '@/fullcam/types';
import '../matchers';
import {
  BatchResultPair,
  checkValuesAreZero,
  compareResults,
  generateBatchResults,
  loadExamplePlotFile,
  TestScenarioPair,
} from '../setup';

/*
Scenario 1
A 100 ha farm is mostly used for sheep grazing. There is a small 5 ha section that is original remnant vegetation.
In 2005, a 2 ha linear shelter belt was planted out.
In 2008, the remnant vegetation suffered a wildfire with 30% dead trees
In 2010, a 1 ha section of riparian vegetation was planted out
In 2018, 1 ha of the remnant vegetation was cleared
In 2025, the remnant vegetation was thinned with a controlled burn
*/

const startYear = 2000;
const startMonth = 1;
const endYear = 2025;
const endMonth = 12;

// Taralga
const latitude = -34.4486118;
const longitude = 149.7149025;

const baseArea: FullCAMAreaInput = {
  areaHectares: 0,
  endMonth,
  endYear,
  initialTrees: false,
  latitude,
  longitude,
  plantingEvents: [],
  prescribedBurnEvents: [],
  region: 'NSW South Western Slopes',
  startMonth,
  startYear,
  wildfireEvents: [],
};

// const areaGrazing: FullCAMAreaInput = {
//   ...baseArea,
//   areaHectares: 95 - 2 - 1,
// };

const areaRemnantVegetation: FullCAMAreaInput = {
  ...baseArea,
  initialTrees: {
    speciesName: 'Native Species Regeneration <500mm rainfall',
    maxTreeAge: 1000,
    averageTreeAge: 1000,
  },
  isInLeachingZone: false,
  areaHectares: 4,
  wildfireEvents: [
    {
      fireDate: '2008-01-01',
      percentBurned: 100,
      treesKilled: false,
    },
  ],
  prescribedBurnEvents: [
    {
      fireDate: '2025-01-01',
      percentBurned: 100,
    },
  ],
};

const areaRemnantVegetationCleared: FullCAMAreaInput = {
  ...baseArea,
  initialTrees: {
    speciesName: 'Native Species Regeneration <500mm rainfall',
    maxTreeAge: 1000,
    averageTreeAge: 1000,
  },
  isInLeachingZone: false,
  areaHectares: 1,
  wildfireEvents: [
    {
      fireDate: '2008-01-01',
      percentBurned: 100,
      treesKilled: false,
    },
  ],
  clearingEvent: {
    clearingDate: '2018-01-01',
    percentThinned: 100,
    percentMassRecoveredAsProducts: 0,
    useAfterClearing: 'pasture',
    pastureProductionSystem: 'Non-irrigated pasture',
  },
};

const areaRemnantVegetationToProducts: FullCAMAreaInput = {
  ...baseArea,
  initialTrees: {
    speciesName: 'Native Species Regeneration <500mm rainfall',
    maxTreeAge: 1000,
    averageTreeAge: 1000,
  },
  isInLeachingZone: false,
  areaHectares: 1,
  wildfireEvents: [
    {
      fireDate: '2008-01-01',
      percentBurned: 100,
      treesKilled: false,
    },
  ],
  clearingEvent: {
    clearingDate: '2013-02-01',
    percentThinned: 50,
    percentMassRecoveredAsProducts: 90,
    useAfterClearing: 'pasture',
    pastureProductionSystem: 'Irrigated pasture',
  },
};

const areaShelterBelt: FullCAMAreaInput = {
  ...baseArea,
  areaHectares: 2,
  plantingEvents: [
    {
      speciesName: 'Environmental plantings',
      plantingDate: '2005-01-01',
      shape: 'BeltGt1500SPH',
    },
  ],
};

// FullCAM does have a "water" shape, which generates slightly more carbon and growth than the simple Block.
// For simplicity we're only supporting Block, so we only have to match a reference Block event.
const areaRiparianVegetation: FullCAMAreaInput = {
  ...baseArea,
  areaHectares: 1,
  plantingEvents: [
    {
      speciesName: 'Environmental plantings',
      plantingDate: '2010-01-01',
      shape: 'Block',
    },
  ],
};

function buildScenarioPlots(): TestScenarioPair[] {
  // Return the plot files built with FullCAM, plus the ones built from user inputs using template snippets
  return [
    // The user modelling we allow via our inputs should specifically not model growth from non-forestry sources.
    // An area left for grazing should not be included in our scope.
    // {
    //   scenarioName: 'sheep-grazing',
    //   referenceArea: loadExamplePlotFile(
    //     'sheep-grazing/areaGrazing.plo',
    //     2025,
    //     12,
    //   ),
    //   userDefinedArea: areaGrazing,
    // },
    {
      scenarioName: 'remnant-vegetation',
      referenceArea: loadExamplePlotFile(
        'sheep-grazing/areaRemnantVegetation.plo',
        2025,
        12,
      ),
      userDefinedArea: areaRemnantVegetation,
    },
    {
      scenarioName: 'remnant-vegetation-cleared',
      referenceArea: loadExamplePlotFile(
        'sheep-grazing/areaRemnantVegetationCleared.plo',
        2025,
        12,
      ),
      userDefinedArea: areaRemnantVegetationCleared,
    },
    {
      scenarioName: 'remnant-vegetation-to-products',
      referenceArea: loadExamplePlotFile(
        'sheep-grazing/areaRemnantVegetationToProducts.plo',
        2025,
        12,
      ),
      userDefinedArea: areaRemnantVegetationToProducts,
    },
    {
      scenarioName: 'shelter-belt',
      referenceArea: loadExamplePlotFile(
        'sheep-grazing/areaShelterBelt.plo',
        2025,
        12,
      ),
      userDefinedArea: areaShelterBelt,
    },
    {
      scenarioName: 'riparian-vegetation',
      referenceArea: loadExamplePlotFile(
        'sheep-grazing/areaRiparianVegetation.plo',
        2025,
        12,
      ),
      userDefinedArea: areaRiparianVegetation,
    },
  ];
}

describe('FullCAM scenario for sheep grazing farm', () => {
  let resultsByKey: Map<string, BatchResultPair>;
  let failedSubmissions: FullCAMAreaError[];

  // Run the batch simulation once before all tests are run
  beforeAll(async () => {
    const batchResults = await generateBatchResults(
      buildScenarioPlots(),
      'sheep-grazing',
    );
    resultsByKey = batchResults.resultsByKey;
    failedSubmissions = batchResults.failedSubmissions;
  });

  describe('completes batch for all scenarios', () => {
    it('does not have failures', () => {
      expect(failedSubmissions.map((s) => s.area.uniqueAreaKey)).toEqual([]);
    });
    it('has the correct number of results', () => {
      expect(resultsByKey.size).toBe(5);
    });

    // it('has the right results for grazing area', () => {
    //   const grazingAreaResults = resultsByKey.get('sheep-grazing')!;

    //   // Test is failing, carbonMassInDebrisPerHectare is 3.5899... in expected scenario but is 0 in generated scenario
    //   // Do we need to allow defining crops on areas to generate crop debris?
    //   // ANSWER: No, we don't want users to define areas with no forested vegetation, so this is out of scope.
    //   compareResults(grazingAreaResults);
    // });
    it('has the right results for remnant vegetation', () => {
      const remnantVegetationResults = resultsByKey.get('remnant-vegetation')!;
      compareResults(remnantVegetationResults);

      checkValuesAreZero(remnantVegetationResults, {
        carbonMassInDebrisPerHectare: false,
        carbonMassInTreesPerHectare: false,
        carbonMassInForestProductsPerHectare: true,
        ch4FromBiomassBurningPerHectare: false,
        n2oFromBiomassBurningPerHectare: false,
      });
    });
    it('has the right results for remnant vegetation cleared', () => {
      const remnantVegetationClearedResults = resultsByKey.get(
        'remnant-vegetation-cleared',
      )!;
      compareResults(remnantVegetationClearedResults);

      checkValuesAreZero(remnantVegetationClearedResults, {
        carbonMassInDebrisPerHectare: false,
        carbonMassInTreesPerHectare: true,
        carbonMassInForestProductsPerHectare: true,
        ch4FromBiomassBurningPerHectare: true,
        n2oFromBiomassBurningPerHectare: true,
      });
    });
    it('has the right results for remnant vegetation to products', () => {
      const remnantVegetationToProductsResults = resultsByKey.get(
        'remnant-vegetation-to-products',
      )!;
      compareResults(remnantVegetationToProductsResults);

      checkValuesAreZero(remnantVegetationToProductsResults, {
        carbonMassInDebrisPerHectare: false,
        carbonMassInTreesPerHectare: false,
        carbonMassInForestProductsPerHectare: false,
        ch4FromBiomassBurningPerHectare: true,
        n2oFromBiomassBurningPerHectare: true,
      });
    });

    it('has the right results for shelter belt', () => {
      const shelterBeltResults = resultsByKey.get('shelter-belt')!;

      compareResults(shelterBeltResults);

      checkValuesAreZero(shelterBeltResults, {
        carbonMassInDebrisPerHectare: false,
        carbonMassInTreesPerHectare: false,
        carbonMassInForestProductsPerHectare: true,
        ch4FromBiomassBurningPerHectare: true,
        n2oFromBiomassBurningPerHectare: true,
      });
    });

    it('has the right results for riparian vegetation', () => {
      const riparianVegetationResults = resultsByKey.get(
        'riparian-vegetation',
      )!;

      compareResults(riparianVegetationResults);

      checkValuesAreZero(riparianVegetationResults, {
        carbonMassInDebrisPerHectare: false,
        carbonMassInTreesPerHectare: false,
        carbonMassInForestProductsPerHectare: true,
        ch4FromBiomassBurningPerHectare: true,
        n2oFromBiomassBurningPerHectare: true,
      });
    });
  });
});
