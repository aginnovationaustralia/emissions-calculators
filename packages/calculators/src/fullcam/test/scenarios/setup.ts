import { runSimulationBatch, RunSimulationBatchOptions } from '@/fullcam/batch';
import {
  FullCAMAreaInput,
  FullCAMAreaInputTransformed,
  FullCAMAreaSchema,
} from '@/fullcam/input';
import { extractKeyFieldsFromFullCAMOutput } from '@/fullcam/response';
import { isErr, isOk } from '@/fullcam/result';
import { generateTemplateForSpatialUpdate } from '@/fullcam/templates/spatial-update';
import { AreaPlotContent, InputAreaWithOutputKeyFields } from '@/fullcam/types';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, join } from 'path';

export function loadExamplePlotFile(
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

const comparedKeyFields = [
  'carbonMassInDebrisPerHectare',
  'carbonMassInTreesPerHectare',
  'carbonMassInForestProductsPerHectare',
  'ch4FromBiomassBurningPerHectare',
  'n2oFromBiomassBurningPerHectare',
] as const;

export type BatchResultPair = {
  scenarioName: string;
  expected: InputAreaWithOutputKeyFields;
  actual: InputAreaWithOutputKeyFields;
};

export function compareResults(results: BatchResultPair) {
  const { expected, actual } = results;

  // console.log(`Comparing results for ${exampleFilename} and ${inputFilename}`);
  // console.log(`Example key fields:`, exampleKeyFields);
  // console.log(`Input key fields:`, inputKeyFields);

  // Grab expected and actual results, and check every actual value is within 75% of the expected value
  expect(actual.keyFields).toBeWithinRatioOf(expected.keyFields, {
    margin: 0.75,
    keys: [...comparedKeyFields],
    actualKey: actual.area.uniqueAreaKey,
    expectedKey: expected.area.uniqueAreaKey,
  });
}

export type TestScenarioPair = {
  scenarioName: string;
  referenceArea: Omit<AreaPlotContent, 'plotfileName'>;
  userDefinedArea: FullCAMAreaInput;
};

const areaKeyForReference = (scenarioName: string) =>
  `${scenarioName}-reference`;
const areaKeyForGenerated = (scenarioName: string) =>
  `${scenarioName}-generated`;

export async function generateBatchResults(
  scenariosToRun: TestScenarioPair[],
  scenarioName: string,
) {
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

  const allPlots = scenariosToRun.flatMap((scenario) => {
    const parsed = FullCAMAreaSchema.parse(scenario.userDefinedArea);
    return [
      {
        ...scenario.referenceArea,
        uniqueAreaKey: areaKeyForReference(scenario.scenarioName),
      },
      {
        uniqueAreaKey: areaKeyForGenerated(scenario.scenarioName),
        plotContent: generateTemplateForSpatialUpdate(parsed),
        input: parsed as FullCAMAreaInputTransformed,
        originalInput: scenario.userDefinedArea,
      },
    ];
  });

  // Run all the plot files through FullCAM batch simulation
  const batchResult = await runSimulationBatch(allPlots, batchOptions);

  if (batchResult.isErr) {
    throw new Error('Failed to run batch: ' + batchResult.error.message);
  }

  const submissions = batchResult.value;

  //   console.dir(batchResult);

  const succeededSubmissions = submissions
    .filter(isOk)
    .map(({ value }) => value);
  const failedSubmissions = submissions.filter(isErr).map(({ error }) => error);

  // NOTE: The test dumps quite a few files to disk to aid in debugging
  const outputDir = join(__dirname, 'out', scenarioName);
  const successDir = join(outputDir, 'success');
  const failedDir = join(outputDir, 'failed');
  failedSubmissions.forEach((submission) => {
    mkdirSync(failedDir, { recursive: true });
    const filepath = join(failedDir, `${submission.area.uniqueAreaKey}.plo`);
    writeFileSync(filepath, submission.area.plotContent);
  });

  succeededSubmissions.forEach((submission) => {
    mkdirSync(successDir, { recursive: true });
    const plofilepath = join(
      successDir,
      `${submission.area.uniqueAreaKey}.plo`,
    );
    writeFileSync(plofilepath, submission.area.plotContent);
    const csvfilepath = join(
      successDir,
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
    // console.dir(failedExtractions, { depth: null });
    throw new Error(
      `Key field extraction failed for: ${failedExtractions.map((r) => `${r.error.area.uniqueAreaKey} - ${r.error.error.message}`).join(', ')}`,
    );
  }

  const resultsByKey = new Map(
    scenariosToRun.map(({ scenarioName }) => {
      const expected = successfulExtractions.find(
        (r) => r.area.uniqueAreaKey === areaKeyForReference(scenarioName),
      );
      const actual = successfulExtractions.find(
        (r) => r.area.uniqueAreaKey === areaKeyForGenerated(scenarioName),
      );

      if (expected === undefined) {
        throw new Error(`Expected result not found for ${scenarioName}`);
      }
      if (actual === undefined) {
        throw new Error(`Actual result not found for ${scenarioName}`);
      }
      return [
        scenarioName,
        {
          scenarioName,
          expected,
          actual,
        },
      ];
    }),
  );

  return { resultsByKey, failedSubmissions, succeededSubmissions };
}
