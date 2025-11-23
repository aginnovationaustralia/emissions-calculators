import { calculateRice } from '@/calculators/Rice/calculator';
import { RiceInput } from '@/types/Rice/input';
import { RiceOutput } from '@/types/Rice/output';
import { RiceCrop } from '@/types/Rice/rice.input';
import { testContext } from '../common/context';
import { executeEmissionsSpec, KeyValuePairs } from '../common/emissions';

const expectedScopes = {
  scope1: {
    fuelCO2: 0,
    limeCO2: 0,
    ureaCO2: 0,
    fieldBurningCH4: 0,
    riceCultivationCH4: 0,
    fuelCH4: 0,
    fertiliserN2O: 0,
    atmosphericDepositionN2O: 0,
    fieldBurningN2O: 0,
    cropResidueN2O: 0,
    leachingAndRunoffN2O: 0,
    fuelN2O: 0,
    totalCO2: 0,
    totalCH4: 0,
    totalN2O: 0,
    total: 0,
  },
  scope2: {
    electricity: 0,
    total: 0,
  },
  scope3: {
    fertiliser: 0,
    herbicide: 0,
    electricity: 0,
    fuel: 0,
    lime: 0,
    total: 0,
  },
};

const expectations = {
  ...expectedScopes,
  carbonSequestration: {
    total: 0,
  },
  net: {
    total: 0,
    crops: [],
  },
  intensities: {
    riceProducedTonnes: 0,
    riceExcludingSequestration: 0,
    riceIncludingSequestration: 0,
    intensity: 0,
  },
  intermediate: [],
};

const emptyRiceCrop: RiceCrop = {
  state: 'vic',
  averageRiceYield: 0,
  areaSown: 0,
  growingSeasonDays: 0,
  waterRegimeType: 'Upland',
  waterRegimeSubType: 'Regular rainfed',
  ricePreseasonFloodingPeriod: 'Non flooded pre-season < 180 days',
  ureaApplication: 0,
  nonUreaNitrogen: 0,
  ureaAmmoniumNitrate: 0,
  phosphorusApplication: 0,
  potassiumApplication: 0,
  sulfurApplication: 0,
  fractionOfAnnualCropBurnt: 0,
  herbicideUse: 0,
  glyphosateOtherHerbicideUse: 0,
  electricityAllocation: 0,
  limestone: 0,
  limestoneFraction: 0,
  dieselUse: 0,
  petrolUse: 0,
  lpg: 0,
};

const emptyInputWithEnterprise: RiceInput = {
  state: 'vic',
  crops: [emptyRiceCrop],
  electricityRenewable: 0,
  electricityUse: 0,
  vegetation: [],
};

const emptyInput: RiceInput = {
  state: 'vic',
  crops: [],
  electricityRenewable: 0,
  electricityUse: 0,
  vegetation: [],
};

describe('Rice calculator, empty enterprise', () => {
  const context = testContext('Rice');
  const emissions = calculateRice(emptyInputWithEnterprise, context);

  const expectedWithEnterprise: RiceOutput = {
    ...expectations,
    intermediate: [
      {
        ...expectedScopes,
        id: 'rice-0',
        carbonSequestration: { total: 0 },
        intensities: expectations.intensities,
        net: {
          total: 0,
        },
      },
    ],
    intensities: expectations.intensities,
    net: {
      total: 0,
      crops: [0],
    },
  };

  executeEmissionsSpec(
    emissions,
    expectedWithEnterprise as unknown as KeyValuePairs,
  );
});

describe('Rice calculator, no enterprise', () => {
  const context = testContext('Rice');
  const emissions = calculateRice(emptyInput, context);

  executeEmissionsSpec(emissions, expectations as unknown as KeyValuePairs);
});
