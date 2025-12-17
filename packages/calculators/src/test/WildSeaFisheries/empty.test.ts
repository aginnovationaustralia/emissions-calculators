import { WildSeaFisheriesEnterprise } from '@/types/WildSeaFisheries/enterprise.input';
import { WildSeaFisheriesInput } from '@/types/WildSeaFisheries/input';
import { WildSeaFisheriesOutput } from '@/types/WildSeaFisheries/output';
import { calculateWildSeaFisheries } from '../../calculators/WildSeaFisheries/calculator';
import { testContext } from '../common/context';
import { executeEmissionsSpec, KeyValuePairs } from '../common/emissions';

const expectedScopes = {
  scope1: {
    fuelCO2: 0,
    fuelCH4: 0,
    fuelN2O: 0,
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
    bait: 0,
    electricity: 0,
    fuel: 0,
    total: 0,
  },
};

const expectations: WildSeaFisheriesOutput = {
  ...expectedScopes,
  purchasedOffsets: {
    total: 0,
  },
  net: {
    total: 0,
  },
  intensities: [],
  intermediate: [],
};

const emptyEnterprise: WildSeaFisheriesEnterprise = {
  state: 'wa_sw',
  electricitySource: 'State Grid',
  electricityRenewable: 0,
  electricityUse: 0,
  totalWholeWeightCaught: 0,
  diesel: 0,
  petrol: 0,
  lpg: 0,
  refrigerants: [],
  transports: [],
  flights: [],
  bait: [],
  custombait: [],
  carbonOffset: 0,
};

const emptyInputWithEnterprise: WildSeaFisheriesInput = {
  enterprises: [emptyEnterprise],
};

const emptyInput: WildSeaFisheriesInput = {
  enterprises: [],
};

describe('WildSeaFisheries calculator, empty enterprise', () => {
  const context = testContext('WildSeaFisheries');
  const emissions = calculateWildSeaFisheries(
    emptyInputWithEnterprise,
    context,
  );

  const expectedWithEnterprise: WildSeaFisheriesOutput = {
    ...expectations,
    intermediate: [
      {
        ...expectedScopes,
        purchasedOffsets: { total: 0 },
        carbonSequestration: { total: 0 },
        id: 'wild-sea-fisheries-0',
        intensities: {
          intensityExcludingCarbonOffset: 0,
          intensityIncludingCarbonOffset: 0,
          totalHarvestWeightTonnes: 0,
        },
        net: {
          total: 0,
        },
      },
    ],
    intensities: [
      {
        intensityExcludingCarbonOffset: 0,
        intensityIncludingCarbonOffset: 0,
        totalHarvestWeightTonnes: 0,
      },
    ],
  };

  executeEmissionsSpec(
    emissions,
    expectedWithEnterprise as unknown as KeyValuePairs,
  );
});

describe('WildSeaFisheries calculator, no enterprise', () => {
  const context = testContext('WildSeaFisheries');
  const emissions = calculateWildSeaFisheries(emptyInput, context);

  executeEmissionsSpec(emissions, expectations as unknown as KeyValuePairs);
});
