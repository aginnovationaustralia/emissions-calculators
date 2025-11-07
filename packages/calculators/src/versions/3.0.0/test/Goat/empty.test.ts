import { calculateGoat } from '../../Goat/calculator';
import { GoatComplete } from '../../types/Goat/goat.input';
import { GoatInput } from '../../types/Goat/input';
import { GoatOutput } from '../../types/Goat/output';
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

const expectations: GoatOutput = {
  ...expectedScopes,
  carbonSequestration: {
    total: 0,
    intermediate: [],
  },
  net: {
    total: 0,
  },
  intensities: {
    amountMeatProduced: 0,
    amountWoolProduced: 0,
    goatMeatBreedingIncludingSequestration: 0,
    goatMeatBreedingExcludingSequestration: 0,
    woolIncludingSequestration: 0,
    woolExcludingSequestration: 0,
  },
  intermediate: [],
};

const emptyGoat: GoatComplete = {
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
  herbicide: 0,
  herbicideOther: 0,
};

const emptyInputWithEnterprise: GoatInput = {
  state: 'vic',
  rainfallAbove600: false,
  goats: [emptyGoat],
  vegetation: [],
};

const emptyInput: GoatInput = {
  state: 'vic',
  rainfallAbove600: false,
  goats: [],
  vegetation: [],
};

describe('Goat calculator, empty enterprise', () => {
  const context = testContext('Goat');
  const emissions = calculateGoat(emptyInputWithEnterprise, context);

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

describe('Goat calculator, no enterprise', () => {
  const context = testContext('Goat');
  const emissions = calculateGoat(emptyInput, context);

  executeEmissionsSpec(emissions, expectations as unknown as KeyValuePairs);
});
