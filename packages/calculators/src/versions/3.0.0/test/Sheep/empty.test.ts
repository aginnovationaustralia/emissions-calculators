import { calculateSheep } from '../../Sheep/calculator';
import { SheepInput } from '../../types/Sheep/input';
import { SheepComplete } from '../../types/Sheep/sheep.input';
import { SheepClass } from '../../types/Sheep/sheepclass.input';
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
    electricity: 0,
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
    sheep: 0,
  },
  intensities: {
    woolProducedKg: 0,
    sheepMeatProducedKg: 0,
    woolIncludingSequestration: 0,
    woolExcludingSequestration: 0,
    sheepMeatBreedingIncludingSequestration: 0,
    sheepMeatBreedingExcludingSequestration: 0,
  },
  intermediate: [],
};

const emptySheepSeason = {
  head: 0,
  liveweight: 0,
  liveweightGain: 0,
};

const emptySheepClass: SheepClass = {
  summer: emptySheepSeason,
  autumn: emptySheepSeason,
  winter: emptySheepSeason,
  spring: emptySheepSeason,
  headShorn: 0,
  woolShorn: 0,
  cleanWoolYield: 0,
  headSold: 0,
  saleWeight: 0,
};

const emptySheep: SheepComplete = {
  classes: {
    breedingEwes: emptySheepClass,
    eweLambs: emptySheepClass,
    wetherLambs: emptySheepClass,
  },
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
  merinoPercent: 0,
  ewesLambing: {
    spring: 0,
    summer: 0,
    autumn: 0,
    winter: 0,
  },
  seasonalLambing: {
    spring: 0,
    summer: 0,
    autumn: 0,
    winter: 0,
  },
};

const emptyInputWithEnterprise: SheepInput = {
  state: 'vic',
  northOfTropicOfCapricorn: false,
  rainfallAbove600: false,
  sheep: [emptySheep],
  vegetation: [],
};

const emptyInput: SheepInput = {
  state: 'vic',
  northOfTropicOfCapricorn: false,
  rainfallAbove600: false,
  sheep: [],
  vegetation: [],
};

describe('Sheep calculator, empty enterprise', () => {
  const context = testContext('Sheep');
  const emissions = calculateSheep(emptyInputWithEnterprise, context);

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

describe('Sheep calculator, no enterprise', () => {
  const context = testContext('Sheep');
  const emissions = calculateSheep(emptyInput, context);

  executeEmissionsSpec(emissions, expectations as unknown as KeyValuePairs);
});
