import {
  extractKeyFieldsFromFullCAMOutput,
  generateTemplateForSpatialUpdate,
  runSimulationBatch,
  RunSimulationBatchOptions,
} from '@/fullcam';
import {
  FullCAMAreaInput,
  FullCAMAreaInputTransformed,
  FullCAMAreaSchema,
} from '@/fullcam/input';
import { isErr, isOk } from '@/fullcam/result';
import {
  AreaPlotContent,
  FullCAMAreaError,
  FullCAMSubmission,
  InputAreaWithOutputKeyFields,
} from '@/fullcam/types';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, join } from 'path';
import './matchers';

/**
 * NOTE: These tests aren't executed by default for now. They are useful for exersizing
 * the FullCAM pipeline with real inputs and making real API requests.
 */
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
    },
  ],
  wildfireEvents: [],
  prescribedBurnEvents: [],
};
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
      plantingDate: '2015-01-02',
      speciesName: 'Native Species Regeneration >=500mm rainfall',
    },
  ],
  wildfireEvents: [
    {
      fireDate: '2025-01-01',
      percentBurned: 100,
      percentTreesKilled: 20,
    },
  ],
  prescribedBurnEvents: [],
};

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
      clearingDate: '2016-01-01',
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
  const input = {
    endYear,
    endMonth,
  };
  return {
    input: input as FullCAMAreaInputTransformed,
    originalInput: input as FullCAMAreaInput,
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

  const plotsFromUserInputs = [area1, area2, area3].map(
    (originalInput, index) => {
      const parsed = FullCAMAreaSchema.parse(originalInput);
      return {
        uniqueAreaKey: `${index + 1}-plotsFromUserInputs`,
        plotContent: generateTemplateForSpatialUpdate(parsed),
        input: parsed as FullCAMAreaInputTransformed,
        originalInput,
      };
    },
  );

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
  let succeededSubmissions: FullCAMSubmission[];
  let failedSubmissions: FullCAMAreaError[];

  beforeAll(async () => {
    const fullcamWorkflowApiKey = process.env.FULLCAM_WORKFLOW_API_KEY;
    if (!fullcamWorkflowApiKey) {
      throw new Error('FULLCAM_WORKFLOW_API_KEY is not set');
    }

    const fullcamBatchNotificationEmail =
      process.env.FULLCAM_BATCH_NOTIFICATION_EMAIL;
    if (!fullcamBatchNotificationEmail) {
      throw new Error('FULLCAM_BATCH_NOTIFICATION_EMAIL is not set');
    }

    const batchOptions: RunSimulationBatchOptions = {
      fullcamWorkflowApiKey,
      fullcamBatchNotificationEmail,
    };

    const batchResult = await runSimulationBatch(
      buildScenarioPlots(),
      batchOptions,
    );

    if (batchResult.isErr) {
      throw new Error('Failed to run batch: ' + batchResult.error.message);
    }

    const submissions = batchResult.value;

    succeededSubmissions = submissions.filter(isOk).map(({ value }) => value);
    failedSubmissions = submissions.filter(isErr).map(({ error }) => error);

    // The test dumps quite a few files to disk to aid in debugging
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
    const successfulExtractions = extractedResults
      .filter(isOk)
      .map(({ value }) => value);
    const failedExtractions = extractedResults.filter(isErr);

    if (failedExtractions.length > 0) {
      throw new Error(
        `Key field extraction failed for: ${failedExtractions.map((r) => r.error.area.uniqueAreaKey).join(', ')}`,
      );
    }

    resultsByKey = new Map(
      successfulExtractions.map((result) => [
        result.area.uniqueAreaKey,
        result,
      ]),
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
