import { calculatePork } from '@/calculators/Pork/calculator';
import { PorkInput } from '@/types/Pork/input';
import { PorkOutput } from '@/types/Pork/output';
import { PorkComplete } from '@/types/Pork/pork.input';
import { testContext } from '../common/context';
import { executeEmissionsSpec, KeyValuePairs } from '../common/emissions';

const expectedScopes = {
  scope1: {
    fuelCO2: 0,
    fuelCH4: 0,
    fuelN2O: 0,
    ureaCO2: 0,
    limeCO2: 0,
    fertiliserN2O: 0,
    entericCH4: 0,
    manureManagementCH4: 0,
    manureManagementDirectN2O: 0,
    atmosphericDepositionN2O: 0,
    atmosphericDepositionIndirectN2O: 0,
    leachingAndRunoffSoilN2O: 0,
    leachingAndRunoffMMSN2O: 0,
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
    purchasedFeed: 0,
    electricity: 0,
    fuel: 0,
    fertiliser: 0,
    herbicide: 0,
    lime: 0,
    purchasedLivestock: 0,
    bedding: 0,
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
  },
  intensities: {
    liveweightProducedKg: 0,
    porkMeatIncludingSequestration: 0,
    porkMeatExcludingSequestration: 0,
  },
  intermediate: [],
};

const emptyPork: PorkComplete = {
  classes: {},
  limestone: 0,
  limestoneFraction: 0,
  fertiliser: {
    singleSuperphosphate: 0,
    pastureDryland: 0,
    pastureIrrigated: 0,
    cropsDryland: 0,
    cropsIrrigated: 0,
  },
  diesel: 0,
  petrol: 0,
  lpg: 0,
  electricitySource: 'State Grid',
  electricityRenewable: 0,
  electricityUse: 0,
  herbicide: 0,
  herbicideOther: 0,
  beddingHayBarleyStraw: 0,
  feedProducts: [],
};

const emptyInputWithEnterprise: PorkInput = {
  state: 'vic',
  rainfallAbove600: false,
  pork: [emptyPork],
  vegetation: [],
};

const emptyInput: PorkInput = {
  state: 'vic',
  rainfallAbove600: false,
  pork: [],
  vegetation: [],
};

describe('Pork calculator, empty enterprise', () => {
  const context = testContext('Pork');
  const emissions = calculatePork(emptyInputWithEnterprise, context);

  const expectedWithEnterprise: PorkOutput = {
    ...expectations,
    intermediate: [
      {
        ...expectedScopes,
        carbonSequestration: { total: 0 },
        id: 'pork-0',
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

describe('Pork calculator, no enterprise', () => {
  const context = testContext('Pork');
  const emissions = calculatePork(emptyInput, context);

  executeEmissionsSpec(emissions, expectations as unknown as KeyValuePairs);
});
