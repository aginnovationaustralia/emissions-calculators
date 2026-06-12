import {
  extractKeyFieldsFromFullCAMOutput,
  FullCAMAreaInput,
  generateTemplateForSpatialUpdate,
  runSimulationBatch,
  RunSimulationBatchOptions,
} from '@/fullcam';
import {
  AreaPlotContent,
  FullCAMSubmissionFailed,
  FullCAMSubmissionSucceeded,
  InputAreaWithOutputKeyFields,
  isBatchSimulationError,
  isBatchSimulationSuccess,
  isFullCAMSubmissionFailed,
  isFullCAMSubmissionSucceeded,
} from '@/fullcam/types';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, join } from 'path';
import './matchers';

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
      plantingDate: new Date('2015-01-02'),
      speciesName: 'Environmental plantings',
    },
  ],
  wildfireEvents: [],
  prescribedBurnEvents: [],
};
// lonBL="151.428" latBL="-30.542"
const area2: FullCAMAreaInput = {
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
      plantingDate: new Date('2015-01-02'),
      speciesName: 'Native Species Regeneration >=500mm rainfall',
    },
  ],
  wildfireEvents: [
    {
      fireDate: new Date('2025-01-01'),
      percentBurned: 100,
      percentTreesKilled: 20,
    },
  ],
  prescribedBurnEvents: [],
};

// lonBL="151.428" latBL="-30.542"
const area3: FullCAMAreaInput = {
  latitude: -30.542,
  longitude: 151.428,
  region: 'New England Tablelands',
  areaHectares: 100,
  startYear: 2010,
  startMonth: 1,
  endYear: 2016,
  endMonth: 1,
  initialTrees: { speciesName: 'Native Species Regeneration >=500mm rainfall' },
  plantingEvents: [],
  clearingEvents: [
    {
      clearingDate: new Date('2016-01-01'),
      percentThinned: 100,
    },
  ],
  wildfireEvents: [],
  prescribedBurnEvents: [],
};

function loadExamplePlotFile(
  fileName: string,
  endYear: number,
  endMonth: number,
): Omit<AreaPlotContent, 'plotfileName'> {
  const filePath = join(__dirname, fileName);
  const plotContent = readFileSync(filePath, 'utf8');
  return {
    input: {
      endYear,
      endMonth,
    } as FullCAMAreaInput,
    uniqueAreaKey: basename(fileName),
    plotContent,
  };
}

function buildScenarioPlots(): Omit<AreaPlotContent, 'plotfileName'>[] {
  const examplePlotFiles: Omit<AreaPlotContent, 'plotfileName'>[] = [
    loadExamplePlotFile('1-ExampleEnvironmentalPlanting.plo', 2030, 1),
    loadExamplePlotFile('2-ExampleRegeneration.plo', 2030, 1),
    loadExamplePlotFile('3-ExampleDeforestation.plo', 2016, 1),
  ];

  const plotsFromUserInputs = [area1, area2, area3].map((input, index) => ({
    uniqueAreaKey: `${index + 1}-plotsFromUserInputs`,
    plotContent: generateTemplateForSpatialUpdate(input),
    input,
  }));

  return examplePlotFiles.concat(plotsFromUserInputs);
}

const comparedKeyFields = [
  'carbonMassInDebrisPerHectare',
  'carbonMassInTreesPerHectare',
  'carbonMassInForestProductsPerHectare',
  'ch4FromBiomassBurningPerHectare',
  'n2oFromBiomassBurningPerHectare',
] as const;

function compareResults(
  resultsByKey: Map<string, InputAreaWithOutputKeyFields>,
  exampleFilename: string,
  inputFilename: string,
) {
  const exampleResult = resultsByKey.get(exampleFilename);
  const inputResult = resultsByKey.get(inputFilename);

  if (!exampleResult || !inputResult) {
    throw new Error(
      `Result not found for ${exampleFilename} or ${inputFilename}`,
    );
  }

  const exampleKeyFields = exampleResult.keyFields;
  const inputKeyFields = inputResult.keyFields;

  // console.log(`Comparing results for ${exampleFilename} and ${inputFilename}`);
  // console.log(`Example key fields:`, exampleKeyFields);
  // console.log(`Input key fields:`, inputKeyFields);

  expect(inputKeyFields).toBeWithinRatioOf(exampleKeyFields, {
    margin: 0.75,
    keys: [...comparedKeyFields],
  });
}

describe('FullCAM scenario batch simulations', () => {
  let resultsByKey: Map<string, InputAreaWithOutputKeyFields>;
  let succeededSubmissions: FullCAMSubmissionSucceeded[];
  let failedSubmissions: FullCAMSubmissionFailed[];

  beforeAll(async () => {
    const batchOptions: RunSimulationBatchOptions = {
      fullcamWorkflowApiKey: process.env.FULLCAM_WORKFLOW_API_KEY,
      notificationEmail: process.env.FULLCAM_BATCH_NOTIFICATION_EMAIL,
    };

    const batchResult = await runSimulationBatch(
      buildScenarioPlots(),
      batchOptions,
    );

    if (batchResult.isErr) {
      throw new Error('Failed to run batch: ' + batchResult.error.message);
    }

    const submissions = batchResult.value;

    succeededSubmissions = submissions.filter(isFullCAMSubmissionSucceeded);
    failedSubmissions = submissions.filter(isFullCAMSubmissionFailed);

    failedSubmissions.forEach((submission) => {
      const outFailedDir = join(__dirname, 'out/failed');
      mkdirSync(outFailedDir, { recursive: true });
      const filepath = join(
        outFailedDir,
        `${submission.area.uniqueAreaKey}.plo`,
      );
      writeFileSync(filepath, submission.area.plotContent);
    });

    succeededSubmissions.forEach((submission) => {
      const plofilepath = join(
        __dirname,
        'out/success',
        `${submission.area.uniqueAreaKey}.plo`,
      );
      writeFileSync(plofilepath, submission.area.plotContent);
      const csvfilepath = join(
        __dirname,
        'out/success',
        `${submission.area.uniqueAreaKey}.csv`,
      );
      writeFileSync(csvfilepath, submission.outputCsv);
    });

    const extractedResults = succeededSubmissions.map(
      extractKeyFieldsFromFullCAMOutput,
    );
    const successfulExtractions = extractedResults.filter(
      isBatchSimulationSuccess,
    );
    const failedExtractions = extractedResults.filter(isBatchSimulationError);

    if (failedExtractions.length > 0) {
      throw new Error(
        `Key field extraction failed for: ${failedExtractions.map((r) => r.uniqueAreaKey).join(', ')}`,
      );
    }

    resultsByKey = new Map(
      successfulExtractions.map((result) => [result.uniqueAreaKey, result]),
    );
  });

  describe('completes batch for all scenarios', () => {
    it('does not have failures', () => {
      expect(failedSubmissions.map((s) => s.area.uniqueAreaKey)).toEqual([]);
    });
    it('has the correct number of results', () => {
      expect(resultsByKey.size).toBe(6);
    });

    it('has the right results for scenario 1', () => {
      compareResults(
        resultsByKey,
        '1-ExampleEnvironmentalPlanting.plo',
        '1-plotsFromUserInputs',
      );
    });
    it('has the right results for scenario 2', () => {
      compareResults(
        resultsByKey,
        '2-ExampleRegeneration.plo',
        '2-plotsFromUserInputs',
      );
    });
    it('has the right results for scenario 3', () => {
      compareResults(
        resultsByKey,
        '3-ExampleDeforestation.plo',
        '3-plotsFromUserInputs',
      );
    });
  });
});
