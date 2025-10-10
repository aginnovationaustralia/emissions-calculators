import { Fertiliser } from '../../types/fertiliser.input';
import { Feed } from '../../types/Pork/feed.input';
import { PorkInput } from '../../types/Pork/input';
import { PorkComplete } from '../../types/Pork/pork.input';
import { PorkClasses } from '../../types/Pork/porkclasses.input';
import { CustomisedFertiliser } from '../../types/types';
import { veg1, veg2, veg3, veg4 } from './vegetation.data';

const classes: PorkClasses = {
  sows: {
    spring: 110,
    summer: 120,
    autumn: 130,
    winter: 140,
    headPurchased: 0,
    headSold: 0,
    purchasedWeight: 0,
    saleWeight: 0,
    manure: {
      autumn: {
        outdoorSystems: 50,
        coveredAnaerobicPond: 25,
        uncoveredAnaerobicPond: 0,
        deepLitter: 25,
        undefinedSystem: 0,
      },
      winter: {
        outdoorSystems: 50,
        coveredAnaerobicPond: 25,
        uncoveredAnaerobicPond: 0,
        deepLitter: 25,
        undefinedSystem: 0,
      },
      spring: {
        outdoorSystems: 50,
        coveredAnaerobicPond: 25,
        uncoveredAnaerobicPond: 0,
        deepLitter: 25,
        undefinedSystem: 0,
      },
      summer: {
        outdoorSystems: 50,
        coveredAnaerobicPond: 25,
        uncoveredAnaerobicPond: 0,
        deepLitter: 25,
        undefinedSystem: 0,
      },
    },
  },
  boars: {
    spring: 200,
    summer: 200,
    autumn: 200,
    winter: 200,
    headPurchased: 0,
    headSold: 0,
    purchasedWeight: 0,
    saleWeight: 0,
    manure: {
      autumn: {
        outdoorSystems: 50,
        coveredAnaerobicPond: 25,
        uncoveredAnaerobicPond: 0,
        deepLitter: 25,
        undefinedSystem: 0,
      },
      winter: {
        outdoorSystems: 50,
        coveredAnaerobicPond: 25,
        uncoveredAnaerobicPond: 0,
        deepLitter: 25,
        undefinedSystem: 0,
      },
      spring: {
        outdoorSystems: 50,
        coveredAnaerobicPond: 25,
        uncoveredAnaerobicPond: 0,
        deepLitter: 25,
        undefinedSystem: 0,
      },
      summer: {
        outdoorSystems: 50,
        coveredAnaerobicPond: 25,
        uncoveredAnaerobicPond: 0,
        deepLitter: 25,
        undefinedSystem: 0,
      },
    },
  },
  gilts: {
    spring: 310,
    summer: 320,
    autumn: 330,
    winter: 340,
    headPurchased: 0,
    headSold: 1000,
    purchasedWeight: 0,
    saleWeight: 400,
    manure: {
      autumn: {
        outdoorSystems: 50,
        coveredAnaerobicPond: 25,
        uncoveredAnaerobicPond: 0,
        deepLitter: 25,
        undefinedSystem: 0,
      },
      winter: {
        outdoorSystems: 50,
        coveredAnaerobicPond: 25,
        uncoveredAnaerobicPond: 0,
        deepLitter: 25,
        undefinedSystem: 0,
      },
      spring: {
        outdoorSystems: 50,
        coveredAnaerobicPond: 25,
        uncoveredAnaerobicPond: 0,
        deepLitter: 25,
        undefinedSystem: 0,
      },
      summer: {
        outdoorSystems: 50,
        coveredAnaerobicPond: 25,
        uncoveredAnaerobicPond: 0,
        deepLitter: 25,
        undefinedSystem: 0,
      },
    },
  },
  suckers: {
    spring: 410,
    summer: 420,
    autumn: 430,
    winter: 440,
    headPurchased: 0,
    headSold: 0,
    purchasedWeight: 0,
    saleWeight: 0,
    manure: {
      autumn: {
        outdoorSystems: 25,
        coveredAnaerobicPond: 0,
        uncoveredAnaerobicPond: 25,
        deepLitter: 0,
        undefinedSystem: 50,
      },
      winter: {
        outdoorSystems: 25,
        coveredAnaerobicPond: 0,
        uncoveredAnaerobicPond: 25,
        deepLitter: 0,
        undefinedSystem: 50,
      },
      spring: {
        outdoorSystems: 25,
        coveredAnaerobicPond: 0,
        uncoveredAnaerobicPond: 25,
        deepLitter: 0,
        undefinedSystem: 50,
      },
      summer: {
        outdoorSystems: 25,
        coveredAnaerobicPond: 0,
        uncoveredAnaerobicPond: 25,
        deepLitter: 0,
        undefinedSystem: 50,
      },
    },
  },
  weaners: {
    spring: 510,
    summer: 520,
    autumn: 530,
    winter: 540,
    headPurchased: 100,
    headSold: 100,
    purchasedWeight: 50,
    saleWeight: 100,
    manure: {
      autumn: {
        outdoorSystems: 25,
        coveredAnaerobicPond: 0,
        uncoveredAnaerobicPond: 25,
        deepLitter: 0,
        undefinedSystem: 50,
      },
      winter: {
        outdoorSystems: 25,
        coveredAnaerobicPond: 0,
        uncoveredAnaerobicPond: 25,
        deepLitter: 0,
        undefinedSystem: 50,
      },
      spring: {
        outdoorSystems: 25,
        coveredAnaerobicPond: 0,
        uncoveredAnaerobicPond: 25,
        deepLitter: 0,
        undefinedSystem: 50,
      },
      summer: {
        outdoorSystems: 25,
        coveredAnaerobicPond: 0,
        uncoveredAnaerobicPond: 25,
        deepLitter: 0,
        undefinedSystem: 50,
      },
    },
  },
  growers: {
    spring: 610,
    summer: 620,
    autumn: 630,
    winter: 640,
    headPurchased: 0,
    headSold: 0,
    purchasedWeight: 0,
    saleWeight: 0,
    manure: {
      autumn: {
        outdoorSystems: 25,
        coveredAnaerobicPond: 0,
        uncoveredAnaerobicPond: 25,
        deepLitter: 0,
        undefinedSystem: 50,
      },
      winter: {
        outdoorSystems: 25,
        coveredAnaerobicPond: 0,
        uncoveredAnaerobicPond: 25,
        deepLitter: 0,
        undefinedSystem: 50,
      },
      spring: {
        outdoorSystems: 25,
        coveredAnaerobicPond: 0,
        uncoveredAnaerobicPond: 25,
        deepLitter: 0,
        undefinedSystem: 50,
      },
      summer: {
        outdoorSystems: 25,
        coveredAnaerobicPond: 0,
        uncoveredAnaerobicPond: 25,
        deepLitter: 0,
        undefinedSystem: 50,
      },
    },
  },
  slaughterPigs: {
    spring: 710,
    summer: 720,
    autumn: 730,
    winter: 740,
    headPurchased: 0,
    headSold: 150,
    purchasedWeight: 0,
    saleWeight: 200,
    manure: {
      autumn: {
        outdoorSystems: 50,
        coveredAnaerobicPond: 25,
        uncoveredAnaerobicPond: 0,
        deepLitter: 25,
        undefinedSystem: 0,
      },
      winter: {
        outdoorSystems: 50,
        coveredAnaerobicPond: 25,
        uncoveredAnaerobicPond: 0,
        deepLitter: 25,
        undefinedSystem: 0,
      },
      spring: {
        outdoorSystems: 50,
        coveredAnaerobicPond: 25,
        uncoveredAnaerobicPond: 0,
        deepLitter: 25,
        undefinedSystem: 0,
      },
      summer: {
        outdoorSystems: 50,
        coveredAnaerobicPond: 25,
        uncoveredAnaerobicPond: 0,
        deepLitter: 25,
        undefinedSystem: 0,
      },
    },
  },
};

const fertiliser: Fertiliser = {
  pastureDryland: 20,
  cropsDryland: 30,
  otherDryland: 5,
  otherType: 'Urea-Ammonium Nitrate (UAN)' as CustomisedFertiliser,
  pastureIrrigated: 20,
  cropsIrrigated: 30,
  otherIrrigated: 5,
  singleSuperphosphate: 25,
  otherFertilisers: [],
};

const limestone = 0;
const limestoneFraction = 1;
const herbicide = 14.4;
const herbicideOther = 25.5;

const growerFinisher: Feed['ingredients'] = {
  wheat: 0.45,
  barley: 0.3,
  canolaMeal: 0.12,
  millMix: 0.03,
  meatMeal: 0.02,
  soybeanMeal: 0.02,
  tallow: 0.01,
  wheyPowder: 0,
  bloodMeal: 0,
  fishmeal: 0,
  wheatBran: 0,
  beetPulp: 0,
};

const breeder: Feed['ingredients'] = {
  wheat: 0.5,
  barley: 0.2,
  canolaMeal: 0.1,
  millMix: 0.05,
  meatMeal: 0.05,
  soybeanMeal: 0.04,
  tallow: 0.035,
  wheyPowder: 0,
  bloodMeal: 0,
  fishmeal: 0,
  wheatBran: 0,
  beetPulp: 0,
};

const lactatingSows: Feed['ingredients'] = {
  wheat: 0.4,
  barley: 0.3,
  wheatBran: 0.055,
  beetPulp: 0.02,
  soybeanMeal: 0.18,
  wheyPowder: 0,
  canolaMeal: 0,
  meatMeal: 0,
  bloodMeal: 0,
  fishmeal: 0,
  tallow: 0,
  millMix: 0,
};

const feed: Feed[] = [
  {
    ingredients: growerFinisher,
    feedPurchased: 8,
    additionalIngredients: 0.1,
    emissionsIntensity: 0.2,
  },
  {
    ingredients: breeder,
    feedPurchased: 2,
    additionalIngredients: 0.05,
    emissionsIntensity: 0.15,
  },
  {
    ingredients: growerFinisher,
    feedPurchased: 5,
    additionalIngredients: 0.05,
    emissionsIntensity: 0.1,
  },
  {
    ingredients: lactatingSows,
    feedPurchased: 12,
    additionalIngredients: 0.02,
    emissionsIntensity: 0.15,
  },
];

const beddingHayBarleyStraw = 40;

const electricityUse = 1000;
const electricityRenewable = 0.1;
const electricitySource = 'State Grid';
const diesel = 500;
const petrol = 0;
const lpg = 100;

export const porkComplete: PorkComplete = {
  id: 'first',
  classes,
  limestone,
  limestoneFraction,
  herbicide,
  herbicideOther,
  electricityUse,
  electricityRenewable,
  electricitySource,
  diesel,
  petrol,
  lpg,
  beddingHayBarleyStraw,
  fertiliser,
  feedProducts: feed,
};

export const porkTestData: PorkInput = {
  state: 'nsw',
  pork: [porkComplete],
  northOfTropicOfCapricorn: false,
  rainfallAbove600: false,
  vegetation: [
    {
      vegetation: veg1,
      allocatedProportion: [1],
    },
    {
      vegetation: veg2,
      allocatedProportion: [1],
    },
    {
      vegetation: veg3,
      allocatedProportion: [1],
    },
    {
      vegetation: veg4,
      allocatedProportion: [1],
    },
  ],
};

const minimalClasses: PorkClasses = {
  sows: {
    spring: 110,
    summer: 120,
    autumn: 130,
    winter: 140,
    headPurchased: 5,
    headSold: 5,
    purchasedWeight: 10,
    saleWeight: 10,
    manure: {
      autumn: {},
      winter: {},
      spring: {},
      summer: {},
    },
  },
  boars: {
    spring: 0,
    summer: 0,
    autumn: 0,
    winter: 0,
    headPurchased: 0,
    headSold: 0,
    purchasedWeight: 0,
    saleWeight: 0,
    manure: {
      autumn: {
        outdoorSystems: 50,
        coveredAnaerobicPond: 25,
        uncoveredAnaerobicPond: 0,
        deepLitter: 25,
        undefinedSystem: 0,
      },
      winter: {
        outdoorSystems: 0,
        coveredAnaerobicPond: 0,
        uncoveredAnaerobicPond: 0,
        deepLitter: 0,
        undefinedSystem: 0,
      },
      spring: {},
      summer: {},
    },
  },
};

const porkMinimalComplete: PorkComplete = {
  id: 'minimal',
  classes: minimalClasses,
  limestone: 0,
  limestoneFraction,
  herbicide: 0,
  herbicideOther: 0,
  electricityUse: 0,
  electricityRenewable: 0,
  electricitySource: 'State Grid',
  diesel: 0,
  petrol: 0,
  lpg: 0,
  beddingHayBarleyStraw: 0,
  fertiliser: {
    pastureDryland: 0,
    cropsDryland: 0,
    otherDryland: 0,
    otherType: 'Urea-Ammonium Nitrate (UAN)',
    pastureIrrigated: 0,
    cropsIrrigated: 0,
    otherIrrigated: 0,
    singleSuperphosphate: 0,
    otherFertilisers: [],
  },
  feedProducts: [],
};

export const porkMinimalTestData: PorkInput = {
  state: 'nsw',
  pork: [porkMinimalComplete],
  northOfTropicOfCapricorn: false,
  rainfallAbove600: false,
  vegetation: [],
};
