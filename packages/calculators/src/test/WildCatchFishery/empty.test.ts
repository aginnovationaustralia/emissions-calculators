import { WildCatchFisheryInput } from '@/types/WildCatchFishery/input';
import { WildCatchFisheryOutput } from '@/types/WildCatchFishery/output';
import {
  WildCatchFisheryEnterpriseInput,
  WildCatchFisheryProductionSystem,
} from '@/types/WildCatchFishery/wildcatchfishery.input';
import { calculateWildCatchFishery } from '../../calculators/WildCatchFishery/calculator';
import { testContext } from '../common/context';
import { executeEmissionsSpec, KeyValuePairs } from '../common/emissions';

const expectedScopes = {
  scope1: {
    fuelCO2: 0,
    fuelCH4: 0,
    fuelN2O: 0,
    wasteWaterCO2: 0,
    compostedSolidWasteCO2: 0,
    hfcsRefrigerantLeakage: 0,
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

const expectations: WildCatchFisheryOutput = {
  ...expectedScopes,
  carbonSequestration: {
    total: 0,
    intermediate: [],
  },
  purchasedOffsets: {
    total: 0,
  },
  net: {
    total: 0,
  },
  intensities: {
    totalHarvestWeightKg: 0,
    wildCatchFisheryExcludingCarbonOffsets: 0,
    wildCatchFisheryIncludingCarbonOffsets: 0,
  },
  intermediate: [],
};

const emptyEnterprise: WildCatchFisheryEnterpriseInput = {
  state: 'wa_sw',
  productionSystem: WildCatchFisheryProductionSystem.ABALONE,
  totalHarvestKg: 0,
  refrigerants: [],
  bait: [],
  customBait: [],
  inboundFreight: [],
  outboundFreight: [],
  totalCommercialFlightsKm: 0,
  electricitySource: 'State Grid',
  electricityRenewable: 0,
  electricityUse: 0,
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
};

const emptyInputWithEnterprise: WildCatchFisheryInput = {
  enterprises: [emptyEnterprise],
};

const emptyInput: WildCatchFisheryInput = {
  enterprises: [],
};

describe('WildCatchFishery calculator, empty enterprise', () => {
  const context = testContext('WildCatchFishery');
  const emissions = calculateWildCatchFishery(
    emptyInputWithEnterprise,
    context,
  );

  const expectedWithEnterprise = {
    ...expectations,
    intermediate: [
      {
        ...expectedScopes,
        carbonSequestration: { total: 0 },
        intensities: expectations.intensities,
        net: {
          total: 0,
        },
      },
    ],
  };

  executeEmissionsSpec(
    emissions,
    expectedWithEnterprise as unknown as KeyValuePairs,
  );
});

describe('WildCatchFishery calculator, no enterprise', () => {
  const context = testContext('WildCatchFishery');
  const emissions = calculateWildCatchFishery(emptyInput, context);

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
