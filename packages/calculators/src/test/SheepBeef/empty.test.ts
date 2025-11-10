import { calculateSheepBeef } from '@/calculators/SheepBeef/calculator';
import { BeefComplete } from '@/types/Beef/beef.input';
import { SheepComplete } from '@/types/Sheep/sheep.input';
import { SheepClass } from '@/types/Sheep/sheepclass.input';
import { SheepBeefInput } from '@/types/SheepBeef/input';
import { SheepBeefOutput } from '@/types/SheepBeef/output';
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
  scope1Sheep: {
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

const expectations: SheepBeefOutput = {
  scope1: expectedScopes.scope1,
  scope2: expectedScopes.scope2,
  scope3: expectedScopes.scope3,
  carbonSequestration: {
    total: 0,
    intermediate: [],
  },
  net: {
    total: 0,
    beef: 0,
    sheep: 0,
  },
  intensities: {
    liveweightBeefProducedKg: 0,
    beefIncludingSequestration: 0,
    beefExcludingSequestration: 0,
    woolIncludingSequestration: 0,
    woolExcludingSequestration: 0,
    sheepMeatBreedingIncludingSequestration: 0,
    sheepMeatBreedingExcludingSequestration: 0,
    woolProducedKg: 0,
    sheepMeatProducedKg: 0,
  },
  intermediate: {
    beef: {
      scope1: expectedScopes.scope1,
      scope2: expectedScopes.scope2,
      scope3: expectedScopes.scope3,
      carbonSequestration: 0,
      net: {
        total: 0,
      },
      intensities: {
        liveweightBeefProducedKg: 0,
        beefExcludingSequestration: 0,
        beefIncludingSequestration: 0,
      },
    },
    sheep: {
      scope1: {
        ...expectedScopes.scope1Sheep,
        savannahBurningN2O: 0,
        savannahBurningCH4: 0,
      },
      scope2: expectedScopes.scope2,
      scope3: expectedScopes.scope3,
      carbonSequestration: 0,
      net: {
        total: 0,
      },
      intensities: {
        woolProducedKg: 0,
        sheepMeatProducedKg: 0,
        woolIncludingSequestration: 0,
        woolExcludingSequestration: 0,
        sheepMeatBreedingIncludingSequestration: 0,
        sheepMeatBreedingExcludingSequestration: 0,
      },
    },
  },
  intermediateBeef: [],
  intermediateSheep: [],
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

const emptyInputWithEnterprise: SheepBeefInput = {
  state: 'vic',
  northOfTropicOfCapricorn: false,
  rainfallAbove600: false,
  beef: [emptyBeef],
  sheep: [emptySheep],
  burning: [],
  vegetation: [],
};

const emptyInput: SheepBeefInput = {
  state: 'vic',
  northOfTropicOfCapricorn: false,
  rainfallAbove600: false,
  beef: [],
  sheep: [],
  burning: [],
  vegetation: [],
};

describe('SheepBeef calculator, empty enterprise', () => {
  const context = testContext('SheepBeef');
  const emissions = calculateSheepBeef(emptyInputWithEnterprise, context);

  const expectedWithEnterprise = {
    ...expectations,
    intermediateBeef: [
      {
        scope1: expectedScopes.scope1,
        scope2: expectedScopes.scope2,
        scope3: expectedScopes.scope3,
        carbonSequestration: 0,
        intensities: {
          liveweightBeefProducedKg: 0,
          beefExcludingSequestration: 0,
          beefIncludingSequestration: 0,
        },
        net: {
          total: 0,
        },
      },
    ],
    intermediateSheep: [
      {
        scope1: expectedScopes.scope1Sheep,
        scope2: expectedScopes.scope2,
        scope3: expectedScopes.scope3,
        carbonSequestration: 0,
        intensities: {
          woolProducedKg: 0,
          sheepMeatProducedKg: 0,
          woolIncludingSequestration: 0,
          woolExcludingSequestration: 0,
          sheepMeatBreedingIncludingSequestration: 0,
          sheepMeatBreedingExcludingSequestration: 0,
        },
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

describe('SheepBeef calculator, no enterprise', () => {
  const context = testContext('SheepBeef');
  const emissions = calculateSheepBeef(emptyInput, context);

  executeEmissionsSpec(emissions, expectations as unknown as KeyValuePairs);
});
