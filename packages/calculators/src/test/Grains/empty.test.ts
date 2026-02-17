import { calculateGrains } from '@/calculators/Grains/calculator';
import {
  GrainsCrop,
  GrainsInput,
  GrainsInputSchema,
} from '@/calculators/Grains/types';
import { GrainsInputTransformed } from '@/calculators/Grains/types/input';
import { executeEmissionsSpec, KeyValuePairs } from '../common/emissions';
import { testContext } from './context';

const expectedScopes = {
  scope1: {
    fuelCO2: 0,
    fuelCH4: 0,
    fuelN2O: 0,
    ureaCO2: 0,
    limeCO2: 0,
    fertiliserN2O: 0,
    atmosphericDepositionN2O: 0,
    leachingAndRunoffN2O: 0,
    cropResidueN2O: 0,
    fieldBurningN2O: 0,
    fieldBurningCH4: 0,
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
    total: 0,
  },
};

const expectations = {
  ...expectedScopes,
  carbonSequestration: {
    total: 0,
    intermediate: [],
  },
  net: {
    total: 0,
    crops: [],
  },
  intensities: [],
  intensitiesWithSequestration: [],
  intermediate: [],
};

const emptyGrainsCrop: GrainsCrop = {
  type: 'Wheat',
  state: 'vic',
  averageYield: 0,
  areaSown: 0,
  rainfallAbove600: false,
  fractionOfAnnualCropBurnt: 0,
  electricityAllocation: 0,
  limestone: 0,
  limestoneFraction: 0,
  chemicals: [],
  refrigerants: [],
  inorganicFertilisers: {
    productionSystem: 'Non-irrigated crops',
    applications: [],
    calculationMethodScope1: '1',
  },
  organicFertilisers: {
    applications: [],
    calculationMethod: '1',
  },
  isInLeachingZone: false,
  transportFuel: [],
  stationaryFuel: [],
  naturalGas: 0,
  cropResidues: {
    calculationMethod: '1',
  },
  services: [],
  waste: {
    solidWaste: {
      landfill: [],
      incineration: [],
      composting: [],
      anaerobicDigestion: [],
    },
    offsiteManure: [],
  },
};

const emptyInputWithEnterprise: GrainsInputTransformed =
  GrainsInputSchema.parse({
    state: 'vic',
    crops: [emptyGrainsCrop],
    electricityRenewable: 0,
    electricityUse: 0,
    vegetation: [],
  });

const emptyInput: GrainsInput = {
  state: 'vic',
  crops: [],
  electricity: {
    electricityRenewable: 0,
    electricityUse: 0,
  },
  vegetation: [],
};

describe('Grains calculator, empty enterprise', () => {
  const context = testContext('Grains');
  const emissions = calculateGrains(emptyInputWithEnterprise, context);

  const expectedWithEnterprise = {
    ...expectations,
    intermediate: [
      {
        ...expectedScopes,
        carbonSequestration: { total: 0 },
        intensitiesWithSequestration: {
          grainProducedTonnes: 0,
          grainsExcludingSequestration: 0,
          grainsIncludingSequestration: 0,
        },
        net: {
          total: 0,
        },
      },
    ],
    intensities: [0],
    intensitiesWithSequestration: [
      {
        grainProducedTonnes: 0,
        grainsExcludingSequestration: 0,
        grainsIncludingSequestration: 0,
      },
    ],
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

describe('Grains calculator, no enterprise', () => {
  const context = testContext('Grains');
  const emissions = calculateGrains(
    GrainsInputSchema.parse(emptyInput),
    context,
  );

  executeEmissionsSpec(emissions, expectations as unknown as KeyValuePairs);
});
