import { FullCAMAreaInput } from '@/fullcam/input';
import { FullCAMAreaError } from '@/fullcam/types';
import './matchers';
import {
  BatchResultPair,
  generateBatchResults,
  loadExamplePlotFile,
  TestScenarioPair,
} from './setup';

/**
 * Extra events that generated plot files that are not considered valid by FullCAM
 */

// Simulates simple environmental planting
const area1: FullCAMAreaInput = {
  latitude: -30.542,
  longitude: 151.428,
  region: 'New England Tablelands',
  areaHectares: 100,
  startYear: 2015,
  startMonth: 1,
  endYear: 2030,
  endMonth: 1,
  initialTrees: false,
  plantingEvents: [
    {
      plantingDate: '2015-01-02',
      speciesName: 'Environmental plantings',
      shape: 'Block',
    },
    // It's not possible to add a second planting event
    {
      plantingDate: '2016-01-02',
      speciesName: 'Environmental plantings',
      shape: 'BeltLt1500SPH',
    },
  ],
  wildfireEvents: [],
  prescribedBurnEvents: [],
};

function buildScenarioPlots(): TestScenarioPair[] {
  // Return the plot files built with FullCAM, plus the ones built from user inputs using template snippets
  return [
    {
      scenarioName: 'double-planting',
      referenceArea: loadExamplePlotFile(
        '1-ExampleEnvironmentalPlanting.plo',
        2030,
        1,
      ),
      userDefinedArea: area1,
    },
  ];
}

describe('FullCAM scenario batch simulations that currently fail', () => {
  let resultsByKey: Map<string, BatchResultPair>;
  let failedSubmissions: FullCAMAreaError[];

  // Run the batch simulation once before all tests are run
  beforeAll(async () => {
    const batchResults = await generateBatchResults(
      buildScenarioPlots(),
      'scenarios-failing',
    );
    resultsByKey = batchResults.resultsByKey;
    failedSubmissions = batchResults.failedSubmissions;
  });

  describe.skip('completes batch for all scenarios', () => {
    it('does not have failures', () => {
      expect(failedSubmissions.map((s) => s.area.uniqueAreaKey)).toEqual([]);
    });
    it('has the correct number of results', () => {
      expect(resultsByKey.size).toBe(1);
    });
  });
});
