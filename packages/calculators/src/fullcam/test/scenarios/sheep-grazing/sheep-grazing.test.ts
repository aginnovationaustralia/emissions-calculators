import { generateTemplateForSpatialUpdate } from '@/fullcam';
import {
  FullCAMAreaInput,
  FullCAMAreaInputTransformed,
  FullCAMAreaSchema,
} from '@/fullcam/input';
import {
  AreaPlotContent,
  FullCAMAreaError,
  InputAreaWithOutputKeyFields,
} from '@/fullcam/types';
import '../matchers';
import {
  compareResults,
  generateBatchResults,
  loadExamplePlotFile,
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

function buildScenarioPlots(): Omit<AreaPlotContent, 'plotfileName'>[] {
  // Load valid plot files directly from disk, ready to submit for batch simulation. Exported from fullcam application
  const examplePlotFiles: Omit<AreaPlotContent, 'plotfileName'>[] = [
    loadExamplePlotFile('sheep-grazing/areaGrazing.plo', 2025, 12),
    loadExamplePlotFile('sheep-grazing/areaRemnantVegetation.plo', 2025, 12),
    loadExamplePlotFile(
      'sheep-grazing/areaRemnantVegetationCleared.plo',
      2025,
      12,
    ),
    loadExamplePlotFile('sheep-grazing/areaShelterBelt.plo', 2025, 12),
    loadExamplePlotFile('sheep-grazing/areaRiparianVegetation.plo', 2025, 12),
  ];

  // Generate plot files using simple inputs, via template snippets
  const plotsFromUserInputs = [
    areaGrazing,
    areaRemnantVegetation,
    areaRemnantVegetationCleared,
    areaShelterBelt,
    areaRiparianVegetation,
  ].map((originalInput, index) => {
    const parsed = FullCAMAreaSchema.parse(originalInput);
    return {
      uniqueAreaKey: `${index + 1}-plotsFromUserInputs`,
      plotContent: generateTemplateForSpatialUpdate(parsed),
      input: parsed as FullCAMAreaInputTransformed,
      originalInput,
    };
  });

  // Return the plot files built with FullCAM, plus the ones built from user inputs using template snippets
  return examplePlotFiles.concat(plotsFromUserInputs);
}

describe('FullCAM scenario for sheep grazing farm', () => {
  let resultsByKey: Map<string, InputAreaWithOutputKeyFields>;
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
      expect(resultsByKey.size).toBe(10);
    });

    it('has the right results for grazing area', () => {
      // Currently failing on carbonMassInDebrisPerHectare. Expected is 330.2792352523473 from crop debris. Do we need to allow
      // choosing crops on areas?
      compareResults(resultsByKey, 'areaGrazing.plo', '1-plotsFromUserInputs');
    });
    it('has the right results for remnant vegetation', () => {
      compareResults(
        resultsByKey,
        'areaRemnantVegetation.plo',
        '2-plotsFromUserInputs',
      );
    });
    it('has the right results for remnant vegetation cleared', () => {
      compareResults(
        resultsByKey,
        'areaRemnantVegetationCleared.plo',
        '3-plotsFromUserInputs',
      );
    });
    it('has the right results for shelter belt', () => {
      compareResults(
        resultsByKey,
        'areaShelterBelt.plo',
        '4-plotsFromUserInputs',
      );
    });
    it('has the right results for remnant vegetation cleared', () => {
      compareResults(
        resultsByKey,
        'areaRiparianVegetation.plo',
        '5-plotsFromUserInputs',
      );
    });
  });
});
