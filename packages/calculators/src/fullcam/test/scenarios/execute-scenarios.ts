/* eslint-disable no-console */
import {
  extractKeyFieldsFromFullCAMOutput,
  FullCAMAreaInput,
  runSimulationBatch,
  RunSimulationBatchOptions,
} from '@/fullcam';
import {
  AreaPlotContent,
  isBatchSimulationError,
  isBatchSimulationSuccess,
  isFullCAMSubmissionFailed,
  isFullCAMSubmissionSucceeded,
} from '@/fullcam/types';
import * as fs from 'fs';

/* Scenario 1: an environmental planting plot
 * taken from initial FullCAM examples
 */

/* Scenario 2: a natural regeneration plot
 * taken from initial FullCAM examples
 */

/* Scenario 1: a forest clearing plot
 * taken from initial FullCAM examples
 */

function loadExamplePlotFile(
  fileName: string,
  endYear: number,
  endMonth: number,
): Omit<AreaPlotContent, 'plotfileName'> {
  const plotContent = fs.readFileSync(fileName, 'utf8');
  return {
    input: {
      endYear,
      endMonth,
    } as FullCAMAreaInput,
    uniqueAreaKey: fileName,
    plotContent,
  };
}
async function main() {
  const examplePlotFiles: Omit<AreaPlotContent, 'plotfileName'>[] = [
    loadExamplePlotFile('1-ExampleEnvironmentalPlanting.plo', 2030, 1),
    loadExamplePlotFile('2-ExampleRegeneration.plo', 2030, 1),
    loadExamplePlotFile('3-ExampleDeforestation.plo', 2016, 1),
  ];
  const batchOptions: RunSimulationBatchOptions = {
    fullcamWorkflowApiKey: process.env.FULLCAM_WORKFLOW_API_KEY,
    notificationEmail: process.env.FULLCAM_BATCH_NOTIFICATION_EMAIL,
  };
  const exampleResults = await runSimulationBatch(
    examplePlotFiles,
    batchOptions,
  );

  const succeededResults = exampleResults.filter(isFullCAMSubmissionSucceeded);
  const failedExamples = exampleResults.filter(isFullCAMSubmissionFailed);
  if (failedExamples.length > 0) {
    console.warn(
      'Warning: some example batch simulations failed:',
      failedExamples.map((r) => ({
        uniqueAreaKey: r.area.uniqueAreaKey,
        input: r.area.input,
        error: r.error,
      })),
    );
    // failedExamples.forEach((r) => {
    //   fs.writeFileSync(
    //     `out/failed/${r.area.uniqueAreaKey}.input.json`,
    //     JSON.stringify(r.area.input, null, 2),
    //   );
    //   fs.writeFileSync(
    //     `out/failed/${r.area.uniqueAreaKey}.plo`,
    //     r.area.plotContent,
    //   );
    // });
  }
  fs.mkdirSync('out/success', { recursive: true });
  fs.mkdirSync('out/failed', { recursive: true });

  succeededResults.forEach((r) => {
    fs.writeFileSync(`out/success/${r.area.uniqueAreaKey}.csv`, r.outputCsv);
    // fs.writeFileSync(`out/success/${r.area.uniqueAreaKey}.plo`, r.area.plotContent);
  });
  failedExamples.forEach((r) => {
    // fs.writeFileSync(`out/failed/${r.area.uniqueAreaKey}.input.json`, JSON.stringify(r.area.input, null, 2));
    // fs.writeFileSync(`out/failed/${r.area.uniqueAreaKey}.plo`, r.area.plotContent);
  });

  const batchResults = succeededResults.map(extractKeyFieldsFromFullCAMOutput);

  const successfulBatchResults = batchResults.filter(isBatchSimulationSuccess);
  const failedBatchResults = batchResults.filter(isBatchSimulationError);

  console.log(
    `Succeeded ${examplePlotFiles.length} examples, failed ${failedExamples.length} in batch, ${failedBatchResults.length} in extraction`,
  );
  console.dir(
    successfulBatchResults.map((r) => [r.uniqueAreaKey, r.keyFields]),
    { depth: null },
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
