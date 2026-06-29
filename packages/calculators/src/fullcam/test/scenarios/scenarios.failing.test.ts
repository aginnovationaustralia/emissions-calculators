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
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import './matchers';

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
    },
    // It's not possible to add a second planting event
    {
      plantingDate: '2016-01-02',
      speciesName: 'Environmental plantings',
    },
  ],
  wildfireEvents: [],
  prescribedBurnEvents: [],
};

function buildScenarioPlots(): Omit<AreaPlotContent, 'plotfileName'>[] {
  // Generate plot files using simple inputs, via template snippets
  const plotsFromUserInputs = [area1].map((originalInput, index) => {
    const parsed = FullCAMAreaSchema.parse(originalInput);
    return {
      uniqueAreaKey: `${index + 1}-failing-plotsFromUserInputs`,
      plotContent: generateTemplateForSpatialUpdate(parsed),
      input: parsed as FullCAMAreaInputTransformed,
      originalInput,
    };
  });

  // Return the plot files built with FullCAM, plus the ones built from user inputs using template snippets
  return plotsFromUserInputs;
}

describe('FullCAM scenario batch simulations that currently fail', () => {
  let resultsByKey: Map<string, InputAreaWithOutputKeyFields>;
  let succeededSubmissions: FullCAMSubmission[];
  let failedSubmissions: FullCAMAreaError[];

  // Run the batch simulation once before all tests are run
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

    // Run all the plot files through FullCAM batch simulation
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

    // NOTE: The test dumps quite a few files to disk to aid in debugging
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
      const outputDir = join(__dirname, 'out/success');
      mkdirSync(outputDir, { recursive: true });
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

    // If any plot files triggered a failure, fail the test immediately
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
      expect(resultsByKey.size).toBe(1);
    });
  });
});
