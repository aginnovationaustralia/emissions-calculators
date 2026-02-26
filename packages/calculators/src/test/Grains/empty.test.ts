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
    fuelStationaryCO2: 0,
    fuelStationaryCH4: 0,
    fuelStationaryN2O: 0,
    limeCO2: 0,
    inorganicFertiliserN2O: 0,
    organicFertiliserN2O: 0,
    inorganicFertiliserAtmosphericDepositionN2O: 0,
    organicFertiliserAtmosphericDepositionN2O: 0,
    fertiliserLeachingAndRunoffN2O: 0,
    cropResidueN2O: 0,
    pastureResidueN2O: 0,
    residueLeachingAndRunoffN2O: 0,
    fieldBurningN2O: 0,
    fieldBurningCH4: 0,
    refrigerantHFCs: 0,
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
    electricity: 0,
    fuel: 0,
    lime: 0,
    total: 0,
  },
};

const expectations = {
  ...expectedScopes,
  // carbonSequestration: {
  //   total: 0,
  //   intermediate: [],
  // },
  net: {
    total: 0,
    crops: [],
  },
  // intensities: [],
  // intensitiesWithSequestration: [],
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
  dolomiteFraction: 0,
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
    electricity: {
      method: 'location',
      electricityPurchasedKWh: 0,
    },
    vegetation: [],
  });

const emptyInput: GrainsInput = {
  state: 'vic',
  crops: [],
  electricity: {
    method: 'location',
    electricityPurchasedKWh: 0,
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
        // carbonSequestration: { total: 0 },
        // intensitiesWithSequestration: {
        //   grainProducedTonnes: 0,
        //   grainsExcludingSequestration: 0,
        //   grainsIncludingSequestration: 0,
        // },
        net: {
          total: 0,
        },
      },
    ],
    // intensities: [0],
    // intensitiesWithSequestration: [
    //   {
    //     grainProducedTonnes: 0,
    //     grainsExcludingSequestration: 0,
    //     grainsIncludingSequestration: 0,
    //   },
    // ],
    net: {
      total: 0,
      // crops: [0],
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
