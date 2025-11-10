import { calculatePoultry } from '@/calculators/Poultry/calculator';
import { BroilersComplete } from '@/types/Poultry/broilers.input';
import { EggSale } from '@/types/Poultry/eggsale.input';
import { PoultryInput } from '@/types/Poultry/input';
import { LayerClass } from '@/types/Poultry/layerclass.input';
import { LayersComplete } from '@/types/Poultry/layers.input';
import { PoultryOutput } from '@/types/Poultry/output';
import { testContext } from '../common/context';
import { executeEmissionsSpec, KeyValuePairs } from '../common/emissions';

const expectedScopes = {
  scope1: {
    fuelCO2: 0,
    fuelCH4: 0,
    fuelN2O: 0,
    manureManagementCH4: 0,
    manureManagementN2O: 0,
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
    purchasedFeed: 0,
    purchasedHay: 0,
    purchasedLivestock: 0,
    herbicide: 0,
    electricity: 0,
    fuel: 0,
    total: 0,
  },
};

const expectations: PoultryOutput = {
  ...expectedScopes,
  carbonSequestration: {
    total: 0,
    intermediate: [],
  },
  net: {
    total: 0,
    broilers: 0,
    layers: 0,
  },
  intensities: {
    meatProducedKg: 0,
    eggsProducedKg: 0,
    poultryMeatIncludingSequestration: 0,
    poultryMeatExcludingSequestration: 0,
    poultryEggsIncludingSequestration: 0,
    poultryEggsExcludingSequestration: 0,
  },
  intermediateBroilers: [],
  intermediateLayers: [],
};

const emptyBroilers: BroilersComplete = {
  groups: [],
  diesel: 0,
  petrol: 0,
  lpg: 0,
  electricitySource: 'State Grid',
  electricityRenewable: 0,
  electricityUse: 0,
  hay: 0,
  herbicide: 0,
  herbicideOther: 0,
  manureWasteAllocation: 0,
  wasteHandledDrylotOrStorage: 0,
  litterRecycled: 0,
  litterRecycleFrequency: 0,
  purchasedFreeRange: 0,
  meatChickenGrowersPurchases: {
    head: 0,
    purchaseWeight: 0,
  },
  meatChickenLayersPurchases: {
    head: 0,
    purchaseWeight: 0,
  },
  meatOtherPurchases: {
    head: 0,
    purchaseWeight: 0,
  },
  sales: [],
};

const emptyLayerClass: LayerClass = {
  autumn: 0,
  winter: 0,
  spring: 0,
  summer: 0,
};

const emptyEggSale: EggSale = {
  eggsProduced: 0,
  averageWeight: 0,
};

const emptyLayers: LayersComplete = {
  layers: emptyLayerClass,
  meatChickenLayers: emptyLayerClass,
  feed: [],
  purchasedFreeRange: 0,
  diesel: 0,
  petrol: 0,
  lpg: 0,
  electricitySource: 'State Grid',
  electricityRenewable: 0,
  electricityUse: 0,
  hay: 0,
  herbicide: 0,
  herbicideOther: 0,
  manureWasteAllocation: 0,
  wasteHandledDrylotOrStorage: 0,
  litterRecycled: 0,
  litterRecycleFrequency: 0,
  meatChickenLayersPurchases: {
    head: 0,
    purchaseWeight: 0,
  },
  layersPurchases: {
    head: 0,
    purchaseWeight: 0,
  },
  customFeedPurchased: 0,
  customFeedEmissionIntensity: 0,
  meatChickenLayersEggSale: emptyEggSale,
  layersEggSale: emptyEggSale,
};

const emptyInputWithEnterprise: PoultryInput = {
  state: 'vic',
  northOfTropicOfCapricorn: false,
  rainfallAbove600: false,
  broilers: [emptyBroilers],
  layers: [emptyLayers],
  vegetation: [],
};

const emptyInput: PoultryInput = {
  state: 'vic',
  northOfTropicOfCapricorn: false,
  rainfallAbove600: false,
  broilers: [],
  layers: [],
  vegetation: [],
};

describe('Poultry calculator, empty enterprise', () => {
  const context = testContext('Poultry');
  const emissions = calculatePoultry(emptyInputWithEnterprise, context);

  const expectedWithEnterprise = {
    ...expectations,
    intermediateBroilers: [
      {
        ...expectedScopes,
        intensities: {
          meatProducedKg: 0,
          poultryMeatIncludingSequestration: 0,
          poultryMeatExcludingSequestration: 0,
        },
        net: {
          total: 0,
        },
      },
    ],
    intermediateLayers: [
      {
        ...expectedScopes,
        intensities: {
          eggsProducedKg: 0,
          poultryEggsIncludingSequestration: 0,
          poultryEggsExcludingSequestration: 0,
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

describe('Poultry calculator, no enterprise', () => {
  const context = testContext('Poultry');
  const emissions = calculatePoultry(emptyInput, context);

  executeEmissionsSpec(emissions, expectations as unknown as KeyValuePairs);
});
