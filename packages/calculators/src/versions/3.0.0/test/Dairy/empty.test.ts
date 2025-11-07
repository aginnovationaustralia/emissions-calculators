import { calculateDairy } from '../../Dairy/calculator';
import { DairyComplete } from '../../types/Dairy/dairy.input';
import { DairyClass } from '../../types/Dairy/dairyclass.input';
import { DairyInput } from '../../types/Dairy/input';
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
    milkSolidsProducedTonnes: 0,
    intensity: 0,
  },
  intermediate: [],
};

const emptyDairySeason = {
  head: 0,
  liveweight: 0,
  liveweightGain: 0,
};

const emptyDairyClass: DairyClass = {
  summer: emptyDairySeason,
  autumn: emptyDairySeason,
  winter: emptyDairySeason,
  spring: emptyDairySeason,
};

const emptyDairy: DairyComplete = {
  classes: {
    milkingCows: emptyDairyClass,
    heifersLt1: emptyDairyClass,
    heifersGt1: emptyDairyClass,
    dairyBullsLt1: emptyDairyClass,
    dairyBullsGt1: emptyDairyClass,
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
  seasonalFertiliser: {
    autumn: {
      cropsIrrigated: 0,
      cropsDryland: 0,
      pastureIrrigated: 0,
      pastureDryland: 0,
    },
    winter: {
      cropsIrrigated: 0,
      cropsDryland: 0,
      pastureIrrigated: 0,
      pastureDryland: 0,
    },
    spring: {
      cropsIrrigated: 0,
      cropsDryland: 0,
      pastureIrrigated: 0,
      pastureDryland: 0,
    },
    summer: {
      cropsIrrigated: 0,
      cropsDryland: 0,
      pastureIrrigated: 0,
      pastureDryland: 0,
    },
  },
  areas: {
    croppedDryland: 0,
    croppedIrrigated: 0,
    improvedPastureDryland: 0,
    improvedPastureIrrigated: 0,
  },
  diesel: 0,
  petrol: 0,
  lpg: 0,
  electricityRenewable: 0,
  electricityUse: 0,
  grainFeed: 0,
  hayFeed: 0,
  cottonseedFeed: 0,
  herbicide: 0,
  herbicideOther: 0,
  manureManagementMilkingCows: {
    pasture: 0,
    anaerobicLagoon: 0,
    sumpAndDispersal: 0,
    drainToPaddocks: 0,
    soildStorage: 0,
  },
  manureManagementOtherDairyCows: {
    pasture: 0,
    anaerobicLagoon: 0,
    sumpAndDispersal: 0,
    drainToPaddocks: 0,
    soildStorage: 0,
  },
  emissionsAllocationToRedMeatProduction: 0,
  truckType: '4 Deck Trailer',
  distanceCattleTransported: 0,
};

const emptyInputWithEnterprise: DairyInput = {
  state: 'vic',
  rainfallAbove600: false,
  productionSystem: 'Non-irrigated Pasture',
  dairy: [emptyDairy],
  vegetation: [],
};

const emptyInput: DairyInput = {
  state: 'vic',
  rainfallAbove600: false,
  productionSystem: 'Non-irrigated Pasture',
  dairy: [],
  vegetation: [],
};

describe('Dairy calculator, empty enterprise', () => {
  const context = testContext('Dairy');
  const emissions = calculateDairy(emptyInputWithEnterprise, context);

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

describe('Dairy calculator, no enterprise', () => {
  const context = testContext('Dairy');
  const emissions = calculateDairy(emptyInput, context);

  executeEmissionsSpec(emissions, expectations as unknown as KeyValuePairs);
});
