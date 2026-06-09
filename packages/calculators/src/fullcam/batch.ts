/* eslint-disable no-console */
import { unzipSync } from 'fflate';
import { Result } from 'true-myth';
import { z } from 'zod';
import { runSimulation } from './requests';
import {
  AreaPlotContent,
  BatchSimulationRequest,
  FullCAMSubmission,
} from './types';

/** Plot API v1 root; batch workflow paths omit the `/2024/` segment used by run-plotsimulation. */
const PLOT_V1_BASE =
  'https://api.dcceew.gov.au/climate/carbon-accounting/plotsimworkflow/v1';

const FULLCAM_BATCH_BASE = `${PLOT_V1_BASE}/fullcam-simulator`;

export const BATCH_CREATE_URL = `${FULLCAM_BATCH_BASE}/batches`;
export const BATCH_RUN_URL = `${FULLCAM_BATCH_BASE}/batches-run`;
export const batchStatusUrl = (batchId: string, includeDetails = true) =>
  `${FULLCAM_BATCH_BASE}/batches-status/${encodeURIComponent(batchId)}?includeDetails=${includeDetails}`;
export const batchResultPackageUrl = (batchId: string) =>
  `${FULLCAM_BATCH_BASE}/simulation-result-package/${encodeURIComponent(batchId)}`;

export type BatchSimulationResponse = {
  simulationCsv: string;
  areaKey: string;
};

// const plotFileName = 'fullcam-emissions-calculator.plo';

function basename(path: string): string {
  const norm = path.replace(/\\/g, '/');
  const i = norm.lastIndexOf('/');
  return i === -1 ? norm : norm.slice(i + 1);
}

// function plotStemFromNames(
//   originalFileName: string | null | undefined,
//   uploadedFileName: string | null | undefined,
// ): string {
//   const name = originalFileName || uploadedFileName || plotFileName;
//   return basename(name).replace(/\.plo$/i, '');
// }

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const SINGLE_SIMULATION_CONCURRENCY = 5;

/** Run `fn` over `items` with at most `concurrency` tasks in flight at once. */
async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  if (items.length === 0) {
    return [];
  }

  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      const i = nextIndex++;
      results[i] = await fn(items[i], i);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );

  return results;
}

function safePlotFileName(areaKey: string): string {
  const safe = areaKey.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 200);
  return `${safe}.plo`;
}

type PlotFileUploadResult = {
  originalFileName?: string | null;
  uploadedFileName?: string | null;
  httpStatusCode: number;
};

type CreateBatchResponse = {
  batchId: string | null;
  plotFileUploadResults: PlotFileUploadResult[] | null;
};

function parseCreateBatchResponse(text: string): CreateBatchResponse {
  try {
    return JSON.parse(text) as CreateBatchResponse;
  } catch {
    throw new Error(`create batch: expected JSON, got: ${text.slice(0, 500)}`);
  }
}

function findSimulationCsvInArchive(
  archive: Record<string, Uint8Array>,
  plotStem: string,
  areaKey: string,
): string {
  // console.dir(archive, { depth: null });
  // console.log('Archive', Object.keys(archive));

  const csvPaths = Object.keys(archive).filter(
    (p) =>
      !p.endsWith('/') &&
      /\.csv$/i.test(p) &&
      !p.includes('__MACOSX') &&
      !basename(p).startsWith('.'),
  );
  const stem = plotStem.toLowerCase();

  const byStem =
    csvPaths.find((p) => basename(p).toLowerCase() === `${stem}.csv`) ??
    csvPaths.find((p) => p.toLowerCase().endsWith(`/${stem}.csv`));

  const byAreaKey = csvPaths.find(
    (p) => p.includes(areaKey) && /\.csv$/i.test(p),
  );

  const chosen =
    byStem ?? byAreaKey ?? (csvPaths.length === 1 ? csvPaths[0] : undefined);

  console.log({ plotStem, areaKey, byStem, byAreaKey, chosen });

  if (!chosen) {
    throw new Error(
      `Could not map simulation CSV for plot stem "${plotStem}" (areaKey prefix ${areaKey.slice(0, 32)}). ` +
        `Found ${csvPaths.length} CSV paths in archive.`,
    );
  }

  return new TextDecoder('utf-8').decode(archive[chosen]);
}

export type RunSimulationBatchOptions = {
  batchName?: string;
  /** Completion notification address required by the Plot API. */
  notificationEmail?: string;
  /** Must match plot file format; defaults to 2024 to align with {@link SIMULATION_API_URL}. */
  version?: '2020' | '2024' | 'RMT';
  /**
   * When true, the server-side pipeline may update spatial/species data before simulation.
   * Plot XML from {@link updateSpatial} is usually ready to simulate as-is (`false`).
   */
  isUpdatingSpatialAndSpecies?: boolean;
  pollIntervalMs?: number;
  maxWaitMs?: number;
  fullcamApiKey?: string;
  fullcamWorkflowApiKey?: string;
};

const DEFAULT_POLL_MS = 5000;
const DEFAULT_MAX_WAIT_MS = 45 * 60_000;

type FetchOptions = {
  method: 'POST' | 'GET';
  headers?: Record<string, string>;
  body?: string | FormData;
  fullcamWorkflowApiKey: string;
};

type Fetcher = (url: string, options: FetchOptions) => Promise<Response>;

type PipelineOptions = {
  fetcher: Fetcher;
  fullcamWorkflowApiKey: string;
  batchName: string;
  notificationEmail: string;
};

const defaultFetcher: Fetcher = async (url, options) => {
  const fetchOptions = {
    method: options.method,
    headers: {
      ...options.headers,
      'Ocp-Apim-Subscription-Key': options.fullcamWorkflowApiKey,
    },
    body: options.body,
  };
  return fetch(url, fetchOptions);
};

async function createBatch(
  plots: AreaPlotContent[],
  { fullcamWorkflowApiKey, fetcher }: PipelineOptions,
): Promise<Result<string, Error>> {
  const formData = new FormData();
  for (let i = 0; i < plots.length; i++) {
    const r = plots[i];
    const name = r.plotfileName;
    formData.append(
      'plotFiles',
      new File([r.plotContent], name, { type: 'application/xml' }),
    );
  }

  const createRes = await fetcher(BATCH_CREATE_URL, {
    method: 'POST',
    body: formData,
    fullcamWorkflowApiKey,
  });

  const createText = await createRes.text();
  if (!createRes.ok || (createRes.status !== 200 && createRes.status !== 207)) {
    throw new Error(
      `FullCAM fullcam-simulator/batches failed: ${createRes.status} ${createRes.statusText} ${createText}`,
    );
  }

  const created = parseCreateBatchResponse(createText);
  const batchId = created.batchId;
  if (!batchId) {
    throw new Error(
      `create batch: missing batchId in response: ${createText.slice(0, 800)}`,
    );
  }

  const uploads = created.plotFileUploadResults ?? [];
  if (uploads.length !== plots.length) {
    throw new Error(
      `create batch: expected ${plots.length} upload results, got ${uploads.length}`,
    );
  }

  for (let i = 0; i < uploads.length; i++) {
    const u = uploads[i];
    if (u.httpStatusCode !== 201) {
      throw new Error(
        `Plot file upload failed for ${plots[i].uniqueAreaKey}: HTTP ${u.httpStatusCode} ` +
          `(originalFileName=${u.originalFileName}, uploadedFileName=${u.uploadedFileName})`,
      );
    }
  }

  return Result.ok(batchId);
}

async function runBatch(
  batchId: string,
  {
    fullcamWorkflowApiKey,
    fetcher,
    batchName,
    notificationEmail,
  }: PipelineOptions,
): Promise<Result<void, Error>> {
  const version = '2024';
  const isUpdatingSpatialAndSpecies = true;
  const body = JSON.stringify({
    batchId,
    batchName,
    version,
    notificationEmail,
    isUpdatingSpatialAndSpecies,
  });

  const runRes = await fetcher(BATCH_RUN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
    fullcamWorkflowApiKey,
  });

  const runText = await runRes.text();
  if (runRes.status === 409) {
    throw new Error(
      `batches-run conflict (409): workflow may already exist for batch ${batchId}: ${runText}`,
    );
  }
  if (!runRes.ok || runRes.status !== 202) {
    throw new Error(
      `fullcam-simulator/batches-run failed: ${runRes.status} ${runRes.statusText}`,
    );
  }
  return Result.ok(void 0);
}

const batchStatusCompletedSchema = z.object({
  runtimeStatus: z.literal('Completed'),
  output: z.object({
    plotSimulationResults: z.array(
      z.object({
        plotFileName: z.string(),
        status: z.enum(['Completed', 'Failed']),
        errorMessage: z.string().nullable(),
        isCompleted: z.boolean(),
        isFailed: z.boolean(),
      }),
    ),
  }),
});

const batchStatusNotCompleteSchema = z.object({
  runtimeStatus: z.enum(['Failed', 'Running', 'Unknown']),
});

type BatchStatusCompleted = z.infer<typeof batchStatusCompletedSchema>;
// type BatchStatusNotComplete = z.infer<typeof batchStatusNotCompleteSchema>;
type PlotSimulationResults =
  BatchStatusCompleted['output']['plotSimulationResults'];

const batchStatusSchema = z.discriminatedUnion('runtimeStatus', [
  batchStatusCompletedSchema,
  batchStatusNotCompleteSchema,
]);

type BatchStatus = z.infer<typeof batchStatusSchema>;

const isBatchStatusCompleted = (
  status: BatchStatus,
): status is BatchStatusCompleted => status.runtimeStatus === 'Completed';

async function waitBatch(
  batchId: string,
  { fullcamWorkflowApiKey, fetcher }: PipelineOptions,
): Promise<Result<PlotSimulationResults, Error>> {
  const pollIntervalMs = DEFAULT_POLL_MS;
  const maxWaitMs = DEFAULT_MAX_WAIT_MS;
  const deadline = Date.now() + maxWaitMs;
  let lastStatusText = '';
  let lastPhase: BatchStatus['runtimeStatus'] = 'Unknown';
  let plotResults: PlotSimulationResults = [];

  while (Date.now() < deadline) {
    const statusRes = await fetcher(batchStatusUrl(batchId), {
      method: 'GET',
      fullcamWorkflowApiKey,
    });
    lastStatusText = await statusRes.text();

    const parseResult = batchStatusSchema.safeParse(JSON.parse(lastStatusText));

    if (!parseResult.success) {
      throw new Error(
        `Could not parse status response for batch ${batchId}. Last status: ${lastStatusText.slice(0, 2000)}. Message: ${parseResult.error.message}`,
      );
    }

    lastPhase = parseResult.data.runtimeStatus;
    if (isBatchStatusCompleted(parseResult.data)) {
      plotResults = parseResult.data.output?.plotSimulationResults;
      break;
    }
    if (lastPhase === 'Failed') {
      throw new Error(
        `FullCAM batch workflow failed for batch ${batchId}. Last status: ${lastStatusText.slice(0, 2000)}`,
      );
    }

    await delay(pollIntervalMs);
  }

  if (lastPhase !== 'Completed') {
    throw new Error(
      `Timed out after ${maxWaitMs}ms waiting for batch ${batchId} to complete. ` +
        `Last phase=${lastPhase} body=${lastStatusText.slice(0, 1500)}`,
    );
  }
  return Result.ok(plotResults);
}

async function fetchArchive(
  batchId: string,
  { fullcamWorkflowApiKey, fetcher }: PipelineOptions,
): Promise<Result<Record<string, Uint8Array>, Error>> {
  const zipRes = await fetcher(batchResultPackageUrl(batchId), {
    method: 'GET',
    fullcamWorkflowApiKey,
  });

  if (!zipRes.ok) {
    const zipErr = await zipRes.text();
    throw new Error(
      `simulation-result-package failed: ${zipRes.status} ${zipRes.statusText} ${zipErr.slice(0, 800)}`,
    );
  }

  const zipBuf = new Uint8Array(await zipRes.arrayBuffer());
  let archive: Record<string, Uint8Array>;
  try {
    archive = unzipSync(zipBuf);
  } catch (e) {
    throw new Error(
      `Failed to unzip simulation result package for batch ${batchId}: ${e instanceof Error ? e.message : String(e)}`,
    );
  }
  return Result.ok(archive);
}

function extractSimulationResults(
  areas: AreaPlotContent[],
  archive: Record<string, Uint8Array>,
  plotResults: PlotSimulationResults,
): FullCAMSubmission[] {
  const results = areas.map((area): FullCAMSubmission => {
    const batchResult = plotResults.find(
      (result) => result.plotFileName === area.plotfileName,
    );
    if (!batchResult) {
      return {
        area,
        error: 'Could not find simulation result for plot',
      };
    }
    const batchStatus = batchResult.status;
    if (batchStatus === 'Failed') {
      return {
        area,
        error: batchResult.errorMessage ?? 'Unknown error',
      };
    }
    const outputCsv = findSimulationCsvInArchive(
      archive,
      area.plotfileName,
      area.uniqueAreaKey,
    );
    return {
      area,
      outputCsv,
    };
  });
  return results;
}

async function batchPipeline(
  plots: AreaPlotContent[],
  options: PipelineOptions,
): Promise<Result<FullCAMSubmission[], Error>> {
  // create form data for creating the batch
  // create the batch request
  const createResult = await createBatch(plots, options);
  if (createResult.isErr) {
    return Result.err(createResult.error);
  }
  const batchId = createResult.value;

  // run the batch
  const runResult = await runBatch(batchId, options);
  if (runResult.isErr) {
    return Result.err(runResult.error);
  }

  // wait for batch results
  const waitResult = await waitBatch(batchId, options);
  if (waitResult.isErr) {
    return Result.err(waitResult.error);
  }

  // fetch and unzip the batch results
  const fetchResult = await fetchArchive(batchId, options);
  if (fetchResult.isErr) {
    return Result.err(fetchResult.error);
  }
  const archive = fetchResult.value;

  // extract simulation results
  const extractResult = extractSimulationResults(
    plots,
    archive,
    waitResult.value,
  );

  return Result.ok(extractResult);
}

/**
 * Runs multiple plot simulations via the batch workflow (swagger: FullCAMSimulatorWorkflow):
 * POST `/fullcam-simulator/batches` (multipart `plotFiles`),
 * POST `/fullcam-simulator/batches-run` (JSON),
 * poll GET `/fullcam-simulator/batches-status/{batchId}`,
 * GET `/fullcam-simulator/simulation-result-package/{batchId}` (ZIP of CSVs).
 *
 * {@link RunSimulationBatchOptions.notificationEmail} may be supplied in `options` or via
 * `FULLCAM_BATCH_NOTIFICATION_EMAIL`. {@link RunSimulationBatchOptions.batchName} defaults from
 * `FULLCAM_BATCH_NAME` or a generated name.
 */
export async function runSimulationBatch(
  requests: Omit<AreaPlotContent, 'plotfileName'>[],
  options?: Partial<RunSimulationBatchOptions>,
): Promise<FullCAMSubmission[]> {
  if (requests.length === 0) {
    return [];
  }

  const fullcamWorkflowApiKey = options?.fullcamWorkflowApiKey;
  if (!fullcamWorkflowApiKey) {
    throw new Error('fullcamWorkflowApiKey is required');
  }

  // console.log('fullcamApiKey', fullcamApiKey);
  // console.log('fullcamWorkflowApiKey', fullcamWorkflowApiKey);

  const batchName =
    options?.batchName ??
    process.env.FULLCAM_BATCH_NAME ??
    `aia-fullcam-${new Date().toISOString().replace(/[:.]/g, '-')}`;

  const notificationEmail =
    options?.notificationEmail ?? process.env.FULLCAM_BATCH_NOTIFICATION_EMAIL;

  if (!notificationEmail) {
    throw new Error(
      'runSimulationBatch requires notificationEmail in options or FULLCAM_BATCH_NOTIFICATION_EMAIL',
    );
  }

  const safeRequests = requests.map((request) => ({
    ...request,
    plotfileName: safePlotFileName(request.uniqueAreaKey),
  }));

  const pipelineOptions = {
    fetcher: defaultFetcher,
    fullcamWorkflowApiKey,
    batchName,
    notificationEmail,
  };

  const results = await batchPipeline(safeRequests, pipelineOptions);

  if (results.isErr) {
    throw new Error(results.error.message);
  }

  return results.value;
}

// NOTE: The preferred solution is to get batch execution fully tested and implemented. This will be upgraded shortly
export async function runSimulationsSingle(
  requests: BatchSimulationRequest[],
  options: RunSimulationBatchOptions,
): Promise<BatchSimulationResponse[]> {
  return mapWithConcurrency(
    requests,
    SINGLE_SIMULATION_CONCURRENCY,
    async (request) => {
      const simulationCsv = await runSimulation(
        request.plotContent,
        options.fullcamApiKey ?? '',
      );
      return {
        areaKey: request.uniqueAreaKey,
        simulationCsv,
      };
    },
  );
}
