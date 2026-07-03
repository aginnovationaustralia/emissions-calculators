import { FullCAMAreaInput } from '@/fullcam/input';
import { FullCAMAreaError } from '@/fullcam/types';
import '../matchers';
import {
  BatchResultPair,
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
In 2020, the remnant vegetation was thinned with a controlled burn
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

const areaGrazing: FullCAMAreaInput = {
  ...baseArea,
  areaHectares: 95 - 2 - 1,
};

const areaRemnantVegetation: FullCAMAreaInput = {
  ...baseArea,
  initialTrees: { speciesName: 'Native Species Regeneration <500mm rainfall' },
  areaHectares: 4,
  wildfireEvents: [
    {
      fireDate: '2008-01-01',
      percentBurned: 100,
      percentTreesKilled: 30,
    },
  ],
  prescribedBurnEvents: [
    {
      fireDate: '2020-01-01',
      percentBurned: 100,
    },
  ],
};

const areaRemnantVegetationCleared: FullCAMAreaInput = {
  ...baseArea,
  initialTrees: { speciesName: 'Native Species Regeneration <500mm rainfall' },
  areaHectares: 1,
  wildfireEvents: [
    {
      fireDate: '2008-01-01',
      percentBurned: 100,
      percentTreesKilled: 30,
    },
  ],
  clearingEvents: [
    {
      clearingDate: '2018-01-01',
      percentThinned: 100,
    },
  ],
};

const areaShelterBelt: FullCAMAreaInput = {
  ...baseArea,
  areaHectares: 2,
  plantingEvents: [
    {
      speciesName: 'Environmental plantings',
      plantingDate: '2005-01-01',
    },
  ],
};

const areaRiparianVegetation: FullCAMAreaInput = {
  ...baseArea,
  areaHectares: 1,
  plantingEvents: [
    {
      speciesName: 'Environmental plantings',
      plantingDate: '2010-01-01',
    },
  ],
};

function buildScenarioPlots(): TestScenarioPair[] {
  // Return the plot files built with FullCAM, plus the ones built from user inputs using template snippets
  return [
    {
      scenarioName: 'sheep-grazing',
      referenceArea: loadExamplePlotFile(
        'sheep-grazing/areaGrazing.plo',
        2025,
        12,
      ),
      userDefinedArea: areaGrazing,
    },
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

    it('has the right results for grazing area', () => {
      const grazingAreaResults = resultsByKey.get('sheep-grazing')!;

      // Test is failing, carbonMassInDebrisPerHectare is 3.5899... in expected scenario but is 0 in generated scenario
      // Do we need to allow defining crops on areas to generate crop debris?
      compareResults(grazingAreaResults);
    });
    it('has the right results for remnant vegetation', () => {
      const remnantVegetationResults = resultsByKey.get('remnant-vegetation')!;
      compareResults(remnantVegetationResults);
    });
    it('has the right results for remnant vegetation cleared', () => {
      const remnantVegetationClearedResults = resultsByKey.get(
        'remnant-vegetation-cleared',
      )!;
      compareResults(remnantVegetationClearedResults);
    });
    it('has the right results for shelter belt', () => {
      const shelterBeltResults = resultsByKey.get('shelter-belt')!;

      // carbonMassInDebrisPerHectare is 53.39 in reference scenario, 31.95 in user defined scenario. The reference
      // has around 5TC/ha when planting occurs (2005). Muh less carbon accumulates in debris in user scenario

      // carbonMassInTreesPerHectare is 206 in reference, 134 in user defined scenario. Slower growth in user scenario.
      // Tests start passing if the reference plot changes EventQ.Event.PlnF.tTYFCat from BeltH to BlockES. BlockES is the type in the template we use. Do we need to support block vs belt in the user planting event input
      compareResults(shelterBeltResults);
    });
    it('has the right results for riparian vegetation', () => {
      const riparianVegetationResults = resultsByKey.get(
        'riparian-vegetation',
      )!;

      // carbonMassInDebrisPerHectare is 30.1 in reference, 22.1 in user defined scenario. Another example of initial debris from a crop. But debris accumulates faster after planting as well.
      compareResults(riparianVegetationResults);
    });
  });
});
