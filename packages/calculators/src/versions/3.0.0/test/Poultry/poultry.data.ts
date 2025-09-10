import { BroilersComplete } from '../../types/Poultry/broilers.input';
import { PoultryFeedIngredients } from '../../types/Poultry/feedingredients.input';
import { BroilerGroup } from '../../types/Poultry/group.input';
import { PoultryInput } from '../../types/Poultry/input';
import { LayersComplete } from '../../types/Poultry/layers.input';
import { veg1, veg2, veg3, veg4 } from './vegetation.data';

const broilerWithdrawal: PoultryFeedIngredients = {
  wheat: 0.595,
  barley: 0.15,
  soybean: 0.124,
};
const prebreederProduction: PoultryFeedIngredients = {
  wheat: 0.21,
  barley: 0.25,
  sorghum: 0.2,
  millrun: 0.178,
};
const prebreederRearer: PoultryFeedIngredients = {
  wheat: 0.21,
  barley: 0.25,
  sorghum: 0.2,
  millrun: 0.178,
};
const broilerGrower: PoultryFeedIngredients = {
  wheat: 0.478,
  barley: 0.15,
  soybean: 0.204,
};
const broilerStarter: PoultryFeedIngredients = {
  wheat: 0.458,
  barley: 0.15,
  soybean: 0.203,
};
const broilerFinisher: PoultryFeedIngredients = {
  wheat: 0.563,
  barley: 0.15,
  soybean: 0.124,
};

const group1: BroilerGroup = {
  meatChickenGrowers: {
    birds: 2500000,
    averageStayLength50: 31,
    averageStayLength100: 49,
    liveweight50: 2.8,
    liveweight100: 3.1,
    dryMatterIntake: 0.1,
    crudeProtein: 0.5,
    dryMatterDigestibility: 1,
    manureAsh: 0.3,
    nitrogenRetentionRate: 1,
  },
  meatChickenLayers: {
    birds: 1700000,
    averageStayLength50: 27,
    averageStayLength100: 66,
    liveweight50: 3.4,
    liveweight100: 3.85,
    dryMatterIntake: 0.1,
    crudeProtein: 0.5,
    dryMatterDigestibility: 1,
    manureAsh: 0.3,
    nitrogenRetentionRate: 1,
  },
  meatOther: {
    birds: 2200000,
    averageStayLength50: 37,
    averageStayLength100: 52,
    liveweight50: 3.55,
    liveweight100: 4.04,
    dryMatterIntake: 0.1,
    crudeProtein: 0.5,
    dryMatterDigestibility: 1,
    manureAsh: 0.3,
    nitrogenRetentionRate: 1,
  },
  feed: [
    {
      ingredients: broilerWithdrawal,
      additionalIngredient: 0.1,
      emissionIntensity: 0,
      feedPurchased: 12,
    },
    {
      ingredients: prebreederProduction,
      additionalIngredient: 0.05,
      emissionIntensity: 0,
      feedPurchased: 12,
    },
    {
      ingredients: prebreederRearer,
      additionalIngredient: 0.05,
      emissionIntensity: 0.4,
      feedPurchased: 20,
    },
  ],
  customFeedPurchased: 13,
  customFeedEmissionIntensity: 0.2,
};

const group2: BroilerGroup = {
  meatChickenGrowers: {
    birds: 2500000,
    averageStayLength50: 31,
    averageStayLength100: 49,
    liveweight50: 2.8,
    liveweight100: 3.1,
    dryMatterIntake: 0.093,
    crudeProtein: 0.23,
    dryMatterDigestibility: 0.8,
    manureAsh: 0.15,
    nitrogenRetentionRate: 0.47,
  },
  meatChickenLayers: {
    birds: 1700000,
    averageStayLength50: 27,
    averageStayLength100: 66,
    liveweight50: 3.4,
    liveweight100: 3.85,
    dryMatterIntake: 0.103,
    crudeProtein: 0.19,
    dryMatterDigestibility: 0.8,
    manureAsh: 0.18,
    nitrogenRetentionRate: 0.32,
  },
  meatOther: {
    birds: 2200000,
    averageStayLength50: 37,
    averageStayLength100: 52,
    liveweight50: 3.55,
    liveweight100: 4.04,
    dryMatterIntake: 0.093,
    crudeProtein: 0.23,
    dryMatterDigestibility: 0.8,
    manureAsh: 0.15,
    nitrogenRetentionRate: 0.47,
  },
  feed: [
    {
      ingredients: broilerGrower,
      additionalIngredient: 0.1,
      emissionIntensity: 0.1,
      feedPurchased: 17,
    },
    {
      ingredients: prebreederProduction,
      additionalIngredient: 0.05,
      emissionIntensity: 0,
      feedPurchased: 23,
    },
    {
      ingredients: prebreederRearer,
      additionalIngredient: 0.05,
      emissionIntensity: 0,
      feedPurchased: 5,
    },
  ],
  customFeedPurchased: 13,
  customFeedEmissionIntensity: 0.2,
};

const group3: BroilerGroup = {
  meatChickenGrowers: {
    birds: 2500000,
    averageStayLength50: 31,
    averageStayLength100: 49,
    liveweight50: 2.8,
    liveweight100: 3.1,
    dryMatterIntake: 0.093,
    crudeProtein: 0.23,
    dryMatterDigestibility: 0.8,
    manureAsh: 0.15,
    nitrogenRetentionRate: 0.47,
  },
  meatChickenLayers: {
    birds: 1700000,
    averageStayLength50: 27,
    averageStayLength100: 66,
    liveweight50: 3.4,
    liveweight100: 3.85,
    dryMatterIntake: 0.103,
    crudeProtein: 0.19,
    dryMatterDigestibility: 0.8,
    manureAsh: 0.18,
    nitrogenRetentionRate: 0.32,
  },
  meatOther: {
    birds: 2200000,
    averageStayLength50: 37,
    averageStayLength100: 52,
    liveweight50: 3.55,
    liveweight100: 4.04,
    dryMatterIntake: 0.093,
    crudeProtein: 0.23,
    dryMatterDigestibility: 0.8,
    manureAsh: 0.15,
    nitrogenRetentionRate: 0.47,
  },
  feed: [
    {
      ingredients: broilerGrower,
      additionalIngredient: 0.1,
      emissionIntensity: 0.0,
      feedPurchased: 7,
    },
    {
      ingredients: prebreederProduction,
      additionalIngredient: 0.05,
      emissionIntensity: 0.34,
      feedPurchased: 7,
    },
    {
      ingredients: prebreederRearer,
      additionalIngredient: 0.05,
      emissionIntensity: 0,
      feedPurchased: 7,
    },
  ],
  customFeedPurchased: 14,
  customFeedEmissionIntensity: 0.2,
};

const group4: BroilerGroup = {
  meatChickenGrowers: {
    birds: 2500000,
    averageStayLength50: 31,
    averageStayLength100: 49,
    liveweight50: 2.8,
    liveweight100: 3.1,
    dryMatterIntake: 0.093,
    crudeProtein: 0.23,
    dryMatterDigestibility: 0.8,
    manureAsh: 0.15,
    nitrogenRetentionRate: 0.47,
  },
  meatChickenLayers: {
    birds: 1700000,
    averageStayLength50: 27,
    averageStayLength100: 66,
    liveweight50: 3.4,
    liveweight100: 3.85,
    dryMatterIntake: 0.103,
    crudeProtein: 0.19,
    dryMatterDigestibility: 0.8,
    manureAsh: 0.18,
    nitrogenRetentionRate: 0.32,
  },
  meatOther: {
    birds: 2200000,
    averageStayLength50: 37,
    averageStayLength100: 52,
    liveweight50: 3.55,
    liveweight100: 4.04,
    dryMatterIntake: 0.093,
    crudeProtein: 0.23,
    dryMatterDigestibility: 0.8,
    manureAsh: 0.15,
    nitrogenRetentionRate: 0.47,
  },
  feed: [
    {
      ingredients: broilerGrower,
      additionalIngredient: 0.1,
      emissionIntensity: 0.11,
      feedPurchased: 3,
    },
    {
      ingredients: prebreederProduction,
      additionalIngredient: 0.05,
      emissionIntensity: 0.0,
      feedPurchased: 3,
    },
    {
      ingredients: prebreederRearer,
      additionalIngredient: 0.05,
      emissionIntensity: 0.2,
      feedPurchased: 3,
    },
  ],
  customFeedPurchased: 10,
  customFeedEmissionIntensity: 0.3,
};

const broilers: BroilersComplete = {
  groups: [group1, group2, group3, group4],
  diesel: 74224.85,
  petrol: 15681,
  lpg: 1158226,
  electricitySource: 'State Grid',
  electricityRenewable: 0.0,
  electricityUse: 1793737.94,
  hay: 700,
  herbicide: 10000,
  herbicideOther: 20000,
  manureWasteAllocation: 0.3,
  litterRecycled: 0.05,
  litterRecycleFrequency: 2,
  meatChickenGrowersPurchases: {
    head: 700000,
    purchaseWeight: 0.022,
  },
  meatChickenLayersPurchases: { head: 1000000, purchaseWeight: 0.03 },
  meatOtherPurchases: { head: 10000000, purchaseWeight: 0.042 },
  purchasedFreeRange: 0.28,
  sales: [
    {
      meatChickenGrowersSales: { head: 5000000, saleWeight: 2.8 },
      meatChickenLayers: { head: 3400000, saleWeight: 3.4 },
      meatOther: { head: 4400000, saleWeight: 3.55 },
    },
    {
      meatChickenGrowersSales: { head: 5000000, saleWeight: 3.1 },
      meatChickenLayers: { head: 3400000, saleWeight: 3.85 },
      meatOther: { head: 4400000, saleWeight: 4.04 },
    },
  ],
  wasteHandledDrylotOrStorage: 0.7,
};

const layers: LayersComplete = {
  layers: {
    autumn: 4000000,
    spring: 4000000,
    summer: 4000000,
    winter: 7000000,
  },
  meatChickenLayers: {
    autumn: 9000000,
    spring: 3000000,
    summer: 3000000,
    winter: 3000000,
  },
  diesel: 50000,
  petrol: 4000,
  lpg: 9000,
  electricitySource: 'State Grid',
  electricityRenewable: 0.0,
  electricityUse: 1000000,
  hay: 5000,
  herbicide: 9000,
  herbicideOther: 2000,
  manureWasteAllocation: 0.2,
  wasteHandledDrylotOrStorage: 0.8,
  litterRecycled: 0.06,
  litterRecycleFrequency: 2,
  layersPurchases: { head: 500000, purchaseWeight: 1 },
  meatChickenLayersPurchases: { head: 700000, purchaseWeight: 1 },
  purchasedFreeRange: 0,
  customFeedEmissionIntensity: 0.3,
  customFeedPurchased: 2,
  feed: [
    {
      ingredients: broilerStarter,
      additionalIngredient: 0.1,
      emissionIntensity: 0.0,
      feedPurchased: 6,
    },
    {
      ingredients: broilerFinisher,
      additionalIngredient: 0.05,
      emissionIntensity: 0.7,
      feedPurchased: 6,
    },
    {
      ingredients: broilerGrower,
      additionalIngredient: 0.05,
      emissionIntensity: 0.0,
      feedPurchased: 8,
    },
  ],
  layersEggSale: {
    averageWeight: 0.3,
    eggsProduced: 200,
  },
  meatChickenLayersEggSale: {
    averageWeight: 0.3,
    eggsProduced: 100,
  },
};

export const poultryTestData: PoultryInput = {
  state: 'qld',
  northOfTropicOfCapricorn: true,
  rainfallAbove600: true,
  broilers: [broilers],
  layers: [layers],
  vegetation: [veg1, veg2, veg3, veg4],
};
