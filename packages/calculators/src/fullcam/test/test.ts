/* eslint-disable no-console */
import { calculateEmissions } from '@/calculators';
import { entriesFromObject } from '@/calculators/common/tools';
import { GrainsInput } from '@/calculators/Grains';
import { LULUCFInput } from '@/modules';
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
} from '..';
import { extractKeyFieldsFromFullCAMOutput } from '../response';
import {
  isBatchSimulationSuccess,
  isFullCAMSubmissionFailed,
  isFullCAMSubmissionSucceeded,
} from '../types';

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

  const plotFiles = landUse.areas.map((input, index) => ({
    uniqueAreaKey: uniqueHash(input, index),
    plotContent: generateTemplateForSpatialUpdate(input),
    input,
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

  const succeededResults = simulationResults.filter(
    isFullCAMSubmissionSucceeded,
  );
  const failedResults = simulationResults.filter(isFullCAMSubmissionFailed);
  if (failedResults.length > 0) {
    console.warn(
      'Warning: some batch simulations failed:',
      failedResults.map((r) => ({
        uniqueAreaKey: r.area.uniqueAreaKey,
        input: r.area.input,
        error: r.error,
      })),
    );
  }

  // console.dir(simulationResults, { depth: null });

  // fs.writeFileSync(
  //   'simulation.json',
  //   JSON.stringify(simulationResults, null, 2),
  // );

  succeededResults.forEach((r) => {
    fs.writeFileSync(`${r.area.uniqueAreaKey}.csv`, r.outputCsv);
  });

  const batchResults = succeededResults.map(extractKeyFieldsFromFullCAMOutput);

  // console.log('batchResults', batchResults.length);
  // console.dir(batchResults, { depth: null });

  const successfulResults = batchResults.filter(isBatchSimulationSuccess);

  return generateLulucfInput(successfulResults);
}

const area1: FullCAMAreaInput = {
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
      plantingDate: new Date('2010-01-01'),
      speciesName: 'Environmental Plantings',
    },
  ],
  clearingEvents: [],
  wildfireEvents: [],
  prescribedBurnEvents: [],
};

const area2: FullCAMAreaInput = {
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
  const userInput: GrainsInputWithFullCAM = {
    crops: [
      {
        areaSown: 100,
        isInLeachingZone: false,
        electricityAllocation: 0,
        chemicals: [],
        refrigerants: [],
        inorganicFertilisers: {
          productionSystem: 'Non-irrigated crops',
          applications: [],
          calculationMethodScope1: '1',
        },
        organicFertilisers: {
          applications: [],
        },
        waste: {
          offsiteManure: [],
          solidWaste: {
            landfill: [],
            incineration: [],
            composting: [],
            anaerobicDigestion: [],
          },
        },
        services: [],
        transportFuel: [],
        stationaryFuel: [],
        rainfallAbove600: false,
        cropResidues: {
          calculationMethod: '1',
        },
        averageYield: 3,
        fractionOfAnnualCropBurnt: 1,
        limestone: 500,
        limestoneFraction: 1,
        dolomiteFraction: 0,
        type: 'Wheat',
        state: 'vic',
        lulucfAllocation: 1,
      },
    ],
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

  // console.dir(initialLandUse, { depth: null });
  // console.dir(landUse, { depth: null });

  const inputForCalculation: GrainsInput = {
    ...validInput,
    landUse,
  };

  const emissions = calculateEmissions('grains', inputForCalculation);

  if (emissions.status === 'OK') {
    console.log('Emissions calculated correctly');
    console.dir(
      entriesFromObject(emissions.emissions.scope1).map(([k, v]) => [
        k,
        v.value / 1000,
      ]),
      { depth: null },
    );
  } else if (emissions.status === 'INVALID_INPUT') {
    console.error('Input was not valid', emissions.message);
  } else {
    console.error('Error calculating emissions', emissions.error.message);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
