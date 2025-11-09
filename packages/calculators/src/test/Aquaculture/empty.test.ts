/* eslint-disable camelcase */
import { AquacultureEnterpriseInput, AquacultureInput } from '@/types';
import { AquacultureOutput } from '@/types/Aquaculture/output';
import { AquacultureProductionSystem } from '@/types/types';
import { calculateAquaculture } from '../../calculators/Aquaculture/calculator';
import { testContext } from '../common/context';
import { executeEmissionsSpec, KeyValuePairs } from '../common/emissions';

const expectedScopes = {
  scope1: {
    fuelCO2: 0,
    fuelCH4: 0,
    fuelN2O: 0,
    hfcsRefrigerantLeakage: 0,
    wasteWaterCO2: 0,
    compostedSolidWasteCO2: 0,
    totalCO2: 0,
    totalCH4: 0,
    totalN2O: 0,
    totalHFCs: 0,
    total: 0,
  },
  scope2: {
    electricity: 0,
    total: 0,
  },
  scope3: {
    purchasedBait: 0,
    electricity: 0,
    fuel: 0,
    commercialFlights: 0,
    inboundFreight: 0,
    outboundFreight: 0,
    solidWasteSentOffsite: 0,
    total: 0,
  },
};
const expectations: AquacultureOutput = {
  ...expectedScopes,
  intensities: {
    aquacultureIncludingCarbonOffsets: 0,
    aquacultureExcludingCarbonOffsets: 0,
    totalHarvestWeightKg: 0,
  },
  carbonSequestration: {
    total: 0,
    intermediate: [0],
  },
  net: {
    total: 0,
  },
  purchasedOffsets: {
    total: 0,
  },
  intermediate: [
    {
      ...expectedScopes,
      id: '0',
      carbonSequestration: { total: 0 },
      intensities: {
        aquacultureIncludingCarbonOffsets: 0,
        aquacultureExcludingCarbonOffsets: 0,
        totalHarvestWeightKg: 0,
      },
      net: {
        total: 0,
      },
    },
  ],
};

const emptyEnterprise: AquacultureEnterpriseInput = {
  state: 'wa_sw',
  productionSystem: AquacultureProductionSystem.OFFSHORE_CAGED_AQUACULTURE,
  totalHarvestKg: 0,
  refrigerants: [],
  bait: [],
  customBait: [],
  inboundFreight: [],
  outboundFreight: [],
  totalCommercialFlightsKm: 0,
  electricitySource: 'State Grid',
  electricityUse: 0,
  fuel: {
    transportFuel: [],
    stationaryFuel: [],
    naturalGas: 0,
  },
  electricityRenewable: 0,
  fluidWaste: [],
  solidWaste: {
    sentOffsiteTonnes: 0,
    onsiteCompostingTonnes: 0,
  },
};

const emptyInputs: AquacultureInput = {
  enterprises: [emptyEnterprise],
};

describe('Aquaculture calculator, empty enterprise', () => {
  const context = testContext('Aquaculture');
  const emissions = calculateAquaculture(emptyInputs, context);

  executeEmissionsSpec(emissions, expectations as unknown as KeyValuePairs);
});

describe('Aquaculture calculator, no enterprise', () => {
  const context = testContext('Aquaculture');
  const emissions = calculateAquaculture({ enterprises: [] }, context);

  const expected = {
    ...expectations,
    intermediate: [],
    carbonSequestration: {
      total: 0,
      intermediate: [],
    },
  };

  executeEmissionsSpec(emissions, expected as unknown as KeyValuePairs);
});
