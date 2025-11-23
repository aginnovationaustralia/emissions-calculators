import { calculateDeer } from '@/calculators/Deer/calculator';
import { DeerComplete } from '@/types/Deer/deer.input';
import { DeerInput } from '@/types/Deer/input';
import { DeerOutput } from '@/types/Deer/output';
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
    urineAndDungN2O: 0,
    atmosphericDepositionN2O: 0,
    leachingAndRunoffN2O: 0,
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
    purchasedFeed: 0,
    herbicide: 0,
    electricity: 0,
    fuel: 0,
    lime: 0,
    purchasedLivestock: 0,
    total: 0,
  },
};

const expectations: DeerOutput = {
  ...expectedScopes,
  carbonSequestration: {
    total: 0,
  },
  net: {
    total: 0,
  },
  intensities: {
    liveweightProducedKg: 0,
    deerMeatExcludingSequestration: 0,
    deerMeatIncludingSequestration: 0,
  },
  intermediate: [],
};

const emptyDeer: DeerComplete = {
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
  grainFeed: 0,
  hayFeed: 0,
  herbicide: 0,
  herbicideOther: 0,
  doesFawning: {
    spring: 0,
    summer: 0,
    autumn: 0,
    winter: 0,
  },
  seasonalFawning: {
    spring: 0,
    summer: 0,
    autumn: 0,
    winter: 0,
  },
};

const emptyInputWithEnterprise: DeerInput = {
  state: 'vic',
  rainfallAbove600: false,
  deers: [emptyDeer],
  vegetation: [],
};

const emptyInput: DeerInput = {
  state: 'vic',
  rainfallAbove600: false,
  deers: [],
  vegetation: [],
};

describe('Deer calculator, empty enterprise', () => {
  const context = testContext('Deer');
  const emissions = calculateDeer(emptyInputWithEnterprise, context);

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

describe('Deer calculator, no enterprise', () => {
  const context = testContext('Deer');
  const emissions = calculateDeer(emptyInput, context);

  executeEmissionsSpec(emissions, expectations as unknown as KeyValuePairs);
});
