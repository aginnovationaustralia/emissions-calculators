import { unzipSync } from 'fflate';
import { runSimulation } from './requests';

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

export type BatchSimulationRequest = {
  plotContent: string;
  areaKey: string;
};

export type BatchSimulationResponse = {
  simulationCsv: string;
  areaKey: string;
};

const plotFileName = 'fullcam-emissions-calculator.plo';

function basename(path: string): string {
  const norm = path.replace(/\\/g, '/');
  const i = norm.lastIndexOf('/');
  return i === -1 ? norm : norm.slice(i + 1);
}

function plotStemFromNames(
  originalFileName: string | null | undefined,
  uploadedFileName: string | null | undefined,
): string {
  const name = originalFileName || uploadedFileName || plotFileName;
  return basename(name).replace(/\.plo$/i, '');
}

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

function safePlotFileName(areaKey: string, index: number): string {
  const safe = areaKey.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 200);
  return `${index}-${safe}.plo`;
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

/** Best-effort terminal detection for batches-status (OpenAPI does not publish a response schema). */
function workflowPhase(
  body: unknown,
): 'completed' | 'failed' | 'running' | 'unknown' {
  if (body === null || body === undefined) return 'unknown';
  const s = JSON.stringify(body);
  if (/runtimeStatus"\s*:\s*"(Failed|Terminated)"/i.test(s)) {
    return 'failed';
  }
  if (
    /runtimeStatus"\s*:\s*"Completed"/i.test(s) ||
    /"workflowStatus"\s*:\s*"Completed"/i.test(s) ||
    /"overallStatus"\s*:\s*"Completed"/i.test(s)
  ) {
    return 'completed';
  }
  if (
    /runtimeStatus"\s*:\s*"(Running|Pending)"/i.test(s) ||
    /"workflowStatus"\s*:\s*"(Running|Pending)"/i.test(s) ||
    /"status"\s*:\s*"(Running|Pending|InProgress)"/i.test(s)
  ) {
    return 'running';
  }
  return 'unknown';
}

function findSimulationCsvInArchive(
  archive: Record<string, Uint8Array>,
  plotStem: string,
  areaKey: string,
): string {
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
  fullcamApiKey: string;
};

const DEFAULT_POLL_MS = 5000;
const DEFAULT_MAX_WAIT_MS = 45 * 60_000;

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
  requests: BatchSimulationRequest[],
  options?: Partial<RunSimulationBatchOptions>,
): Promise<BatchSimulationResponse[]> {
  if (requests.length === 0) {
    return [];
  }

  const fullcamApiKey = options?.fullcamApiKey;
  if (!fullcamApiKey) {
    throw new Error('fullcamApiKey is required');
  }

  console.log('fullcamApiKey', fullcamApiKey);

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

  const version = options?.version ?? '2024';
  const isUpdatingSpatialAndSpecies =
    options?.isUpdatingSpatialAndSpecies ?? false;
  const pollIntervalMs = options?.pollIntervalMs ?? DEFAULT_POLL_MS;
  const maxWaitMs = options?.maxWaitMs ?? DEFAULT_MAX_WAIT_MS;

  const formData = new FormData();
  for (let i = 0; i < requests.length; i++) {
    const r = requests[i];
    const name = safePlotFileName(r.areaKey, i);
    formData.append(
      'plotFiles',
      new File([r.plotContent], name, { type: 'application/xml' }),
    );
  }

  const createRes = await fetch(BATCH_CREATE_URL, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': fullcamApiKey,
    },
    body: formData,
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
  if (uploads.length !== requests.length) {
    throw new Error(
      `create batch: expected ${requests.length} upload results, got ${uploads.length}`,
    );
  }

  for (let i = 0; i < uploads.length; i++) {
    const u = uploads[i];
    if (u.httpStatusCode !== 201) {
      throw new Error(
        `Plot file upload failed for ${requests[i].areaKey}: HTTP ${u.httpStatusCode} ` +
          `(originalFileName=${u.originalFileName}, uploadedFileName=${u.uploadedFileName})`,
      );
    }
  }

  const runBody = JSON.stringify({
    batchId,
    batchName,
    version,
    notificationEmail,
    isUpdatingSpatialAndSpecies,
  });

  const runRes = await fetch(BATCH_RUN_URL, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': fullcamApiKey,
      'Content-Type': 'application/json',
    },
    body: runBody,
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

  const deadline = Date.now() + maxWaitMs;
  let lastStatusText = '';
  let lastPhase: ReturnType<typeof workflowPhase> = 'unknown';

  while (Date.now() < deadline) {
    const statusRes = await fetch(batchStatusUrl(batchId), {
      headers: { 'Ocp-Apim-Subscription-Key': fullcamApiKey },
    });
    lastStatusText = await statusRes.text();

    let statusJson: unknown;
    try {
      statusJson = JSON.parse(lastStatusText) as unknown;
    } catch {
      statusJson = null;
    }

    lastPhase = workflowPhase(statusJson);
    if (lastPhase === 'completed') {
      break;
    }
    if (lastPhase === 'failed') {
      throw new Error(
        `FullCAM batch workflow failed for batch ${batchId}. Last status: ${lastStatusText.slice(0, 2000)}`,
      );
    }

    await delay(pollIntervalMs);
  }

  if (lastPhase !== 'completed') {
    throw new Error(
      `Timed out after ${maxWaitMs}ms waiting for batch ${batchId} to complete. ` +
        `Last phase=${lastPhase} body=${lastStatusText.slice(0, 1500)}`,
    );
  }

  const zipRes = await fetch(batchResultPackageUrl(batchId), {
    headers: { 'Ocp-Apim-Subscription-Key': fullcamApiKey },
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

  const results: BatchSimulationResponse[] = [];
  for (let i = 0; i < requests.length; i++) {
    const { areaKey } = requests[i];
    const upload = uploads[i];
    const stem = plotStemFromNames(
      upload.originalFileName,
      upload.uploadedFileName,
    );
    const simulationCsv = findSimulationCsvInArchive(archive, stem, areaKey);
    results.push({ areaKey, simulationCsv });
  }

  return results;
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
        options.fullcamApiKey,
      );
      return {
        areaKey: request.areaKey,
        simulationCsv,
      };
    },
  );
}
