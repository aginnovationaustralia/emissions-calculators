/* eslint-disable no-console */
import { GrainsInput } from '@/calculators/Grains';
import { createHash } from 'crypto';
import * as fs from 'fs';
import {
  FullCAMAreaInput,
  FullCAMInputs,
  FullCAMOutputs,
  generateLulucfInput,
  generateTemplateForSpatialUpdate,
  GrainsInputWithFullCAM,
  GrainsInputWithFullCAMSchema,
  isLandUseFullCAMOutputs,
  runSimulationBatch,
  RunSimulationBatchOptions,
} from '.';
import { calculateEmissions, LULUCFInput } from '../..';
import { extractKeyFieldsFromFullCAMOutput } from './response';
import { isBatchSimulationError, isBatchSimulationSuccess } from './types';

function uniqueHash(input: FullCAMAreaInput, index: number): string {
  const hash = createHash('sha256').update(JSON.stringify(input)).digest('hex');
  return `${index}-${hash}`;
}

async function processLandUseKey(
  landUse: FullCAMInputs | FullCAMOutputs | undefined,
): Promise<LULUCFInput | undefined> {
  if (!landUse) {
    console.log('No landUse key defined');
    return undefined;
  }
  if (isLandUseFullCAMOutputs(landUse)) {
    console.log('LandUse key is already a FullCAMOutputs object');
    return landUse.areas.reduce(
      (acc, area) => {
        return {
          ...acc,
          activities: (acc.activities ?? []).concat(area.activities ?? []),
          burning: (acc.burning ?? []).concat(area.burning ?? []),
          perennialCrops: (acc.perennialCrops ?? []).concat(
            area.perennialCrops ?? [],
          ),
        };
      },
      {
        activities: [],
        burning: [],
      },
    );
  }

  const plotFiles = landUse.areas.map((inputArea, index) => ({
    uniqueAreaKey: uniqueHash(inputArea, index),
    plotContent: generateTemplateForSpatialUpdate(inputArea),
    inputArea,
  }));

  const batchOptions: RunSimulationBatchOptions = {
    fullcamWorkflowApiKey: process.env.FULLCAM_WORKFLOW_API_KEY,
    notificationEmail: process.env.FULLCAM_BATCH_NOTIFICATION_EMAIL,
  };

  console.log('Running simulation batch...');

  plotFiles.forEach((plotFile) =>
    fs.writeFileSync(`${plotFile.uniqueAreaKey}.plo`, plotFile.plotContent),
  );

  const simulationResults = await runSimulationBatch(plotFiles, batchOptions);

  console.dir(simulationResults, { depth: null });

  const batchResults = simulationResults.map(extractKeyFieldsFromFullCAMOutput);

  const failedResults = batchResults.filter(isBatchSimulationError);

  if (failedResults.length > 0) {
    console.warn('Warning: some batch simulations failed:', failedResults);
  }

  const successfulResults = batchResults.filter(isBatchSimulationSuccess);

  return generateLulucfInput(successfulResults);
}

const area1 = {
  latitude: -37.756414,
  longitude: 145.081546,
  region: 'Victorian Midlands',
  areaHectares: 100,
  startYear: 2003,
  startMonth: 1,
  endYear: 2023,
  endMonth: 12,
  plantingEvents: [
    {
      plantingDate: new Date('2022-01-01'),
      speciesName: 'Environmental Plantings',
    },
  ],
  clearingEvents: [],
  wildfireEvents: [],
  prescribedBurnEvents: [],
};

const area2 = {
  ...area1,
  plantingEvents: [
    ...area1.plantingEvents,
    {
      plantingDate: new Date('2022-02-01'),
      speciesName: 'Mallee eucalypt species',
    },
    {
      plantingDate: new Date('2022-03-01'),
      speciesName: 'Native Species Regeneration <500mm rainfall',
    },
    {
      plantingDate: new Date('2022-04-01'),
      speciesName: 'Native Species Regeneration >=500mm rainfall',
    },
  ],
};

async function main() {
  const userInput: unknown = {
    crops: [],
    isInLeachingZone: false,
    rainfallAbove600: false,
    state: 'vic',
    electricity: {
      method: 'location',
      electricityPurchasedKWh: 4000,
    },
    landUse: {
      fullcamMode: 'inputs',
      areas: [area1],
    },
  };

  const parseResult = GrainsInputWithFullCAMSchema.safeParse(userInput);

  if (!parseResult.success) {
    console.error(parseResult.error);
    throw new Error('The user input is not valid');
  }

  const validInput = userInput as GrainsInputWithFullCAM;

  const initialLandUse = validInput.landUse;

  const landUse = await processLandUseKey(initialLandUse);

  const inputForCalculation: GrainsInput = {
    ...validInput,
    landUse,
  };

  const emissions = calculateEmissions('grains', inputForCalculation);

  console.log('emissions', emissions);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
