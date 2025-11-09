import { VineyardInput } from '@/types/Vineyard/input';
import { VineyardOutput } from '@/types/Vineyard/output';
import { VineyardCrop } from '@/types/Vineyard/vineyard.input';
import { calculateVineyard } from '../../calculators/Vineyard/calculator';
import { testContext } from '../common/context';
import { executeEmissionsSpec, KeyValuePairs } from '../common/emissions';

const expectedScopes = {
  scope1: {
    fuelCO2: 0,
    limeCO2: 0,
    ureaCO2: 0,
    wasteWaterCO2: 0,
    compostedSolidWasteCO2: 0,
    fuelCH4: 0,
    fertiliserN2O: 0,
    atmosphericDepositionN2O: 0,
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
    commercialFlights: 0,
    inboundFreight: 0,
    solidWasteSentOffsite: 0,
    outboundFreight: 0,
    total: 0,
  },
};

const expectations: VineyardOutput = {
  ...expectedScopes,
  carbonSequestration: {
    total: 0,
    intermediate: [],
  },
  net: {
    total: 0,
    vineyards: [],
  },
  intensities: [],
  intermediate: [],
};

const emptyVineyardCrop: VineyardCrop = {
  state: 'vic',
  rainfallAbove600: false,
  irrigated: false,
  areaPlanted: 0,
  averageYield: 0,
  nonUreaNitrogen: 0,
  phosphorusApplication: 0,
  potassiumApplication: 0,
  sulfurApplication: 0,
  ureaApplication: 0,
  ureaAmmoniumNitrate: 0,
  limestone: 0,
  limestoneFraction: 0,
  herbicideUse: 0,
  glyphosateOtherHerbicideUse: 0,
  electricityRenewable: 0,
  electricityUse: 0,
  electricitySource: 'State Grid',
  fuel: {
    transportFuel: [],
    stationaryFuel: [],
    naturalGas: 0,
  },
  fluidWaste: [],
  solidWaste: {
    sentOffsiteTonnes: 0,
    onsiteCompostingTonnes: 0,
  },
  inboundFreight: [],
  outboundFreight: [],
  totalCommercialFlightsKm: 0,
};

const emptyInputWithEnterprise: VineyardInput = {
  vineyards: [emptyVineyardCrop],
  vegetation: [],
};

const emptyInput: VineyardInput = {
  vineyards: [],
  vegetation: [],
};

describe('Vineyard calculator, empty enterprise', () => {
  const context = testContext('Vineyard');
  const emissions = calculateVineyard(emptyInputWithEnterprise, context);

  const expectedWithEnterprise = {
    ...expectations,
    intermediate: [
      {
        ...expectedScopes,
        carbonSequestration: 0,
        intensities: {
          cropProducedKg: 0,
          vineyardsExcludingSequestration: 0,
          vineyardsIncludingSequestration: 0,
        },
        net: {
          total: 0,
        },
      },
    ],
    intensities: [
      {
        cropProducedKg: 0,
        vineyardsExcludingSequestration: 0,
        vineyardsIncludingSequestration: 0,
      },
    ],
    net: {
      total: 0,
      vineyards: [0],
    },
  };

  executeEmissionsSpec(
    emissions,
    expectedWithEnterprise as unknown as KeyValuePairs,
  );
});

describe('Vineyard calculator, no enterprise', () => {
  const context = testContext('Vineyard');
  const emissions = calculateVineyard(emptyInput, context);

  executeEmissionsSpec(emissions, expectations as unknown as KeyValuePairs);
});
