import { calculateBeef } from '@/calculators/Beef/calculator';
import { BeefComplete } from '@/types/Beef/beef.input';
import { BeefInput } from '@/types/Beef/input';
import { BeefOutput } from '@/types/Beef/output';
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
    savannahBurningN2O: 0,
    savannahBurningCH4: 0,
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
    purchasedMineralSupplementation: 0,
    purchasedFeed: 0,
    herbicide: 0,
    electricity: 0,
    fuel: 0,
    lime: 0,
    purchasedLivestock: 0,
    total: 0,
  },
};

const expectations: BeefOutput = {
  ...expectedScopes,
  carbonSequestration: {
    total: 0,
    intermediate: [],
  },
  net: {
    total: 0,
    beef: 0,
  },
  intensities: {
    liveweightBeefProducedKg: 0,
    beefExcludingSequestration: 0,
    beefIncludingSequestration: 0,
  },
  intermediate: [],
};

const emptyBeef: BeefComplete = {
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
  mineralSupplementation: {
    mineralBlock: 0,
    mineralBlockUrea: 0,
    weanerBlock: 0,
    weanerBlockUrea: 0,
    drySeasonMix: 0,
    drySeasonMixUrea: 0,
  },
  electricitySource: 'State Grid',
  electricityRenewable: 0,
  electricityUse: 0,
  grainFeed: 0,
  hayFeed: 0,
  cottonseedFeed: 0,
  herbicide: 0,
  herbicideOther: 0,
  cowsCalving: {
    spring: 0,
    summer: 0,
    autumn: 0,
    winter: 0,
  },
};

const emptyInputWithEnterprise: BeefInput = {
  state: 'vic',
  northOfTropicOfCapricorn: false,
  rainfallAbove600: false,
  beef: [emptyBeef],
  burning: [],
  vegetation: [],
};

const emptyInput: BeefInput = {
  state: 'vic',
  northOfTropicOfCapricorn: false,
  rainfallAbove600: false,
  beef: [],
  burning: [],
  vegetation: [],
};

describe('Beef calculator, empty enterprise', () => {
  const context = testContext('Beef');
  const emissions = calculateBeef(emptyInputWithEnterprise, context);

  const expectedWithEnterprise = {
    ...expectations,
    intermediate: [
      {
        ...expectedScopes,
        carbonSequestration: 0,
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

describe('Beef calculator, no enterprise', () => {
  const context = testContext('Beef');
  const emissions = calculateBeef(emptyInput, context);

  executeEmissionsSpec(emissions, expectations as unknown as KeyValuePairs);
});
