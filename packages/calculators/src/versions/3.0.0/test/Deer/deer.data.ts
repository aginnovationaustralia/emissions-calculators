import { DeerComplete } from '../../types/Deer/deer.input';
import { DeerClass } from '../../types/Deer/deerclass.input';
import { DeerClasses } from '../../types/Deer/deerclasses.input';
import { DeerInput } from '../../types/Deer/input';
import { veg1, veg2, veg3, veg4 } from './vegetation.data';

const emptySeason = {
  head: 0,
};

const emptyClass: DeerClass = {
  spring: emptySeason,
  summer: emptySeason,
  autumn: emptySeason,
  winter: emptySeason,
  headSold: 0,
  saleWeight: 0,
  purchases: [],
};

const deers: DeerClasses = {
  bucks: {
    spring: {
      head: 26,
    },
    summer: {
      head: 26,
    },
    autumn: {
      head: 26,
    },
    winter: {
      head: 26,
    },
    headSold: 100,
    saleWeight: 100,
    purchases: [{ head: 100, purchaseWeight: 100 }],
  },
  breedingDoes: {
    spring: {
      head: 314,
    },
    summer: {
      head: 314,
    },
    autumn: {
      head: 314,
    },
    winter: {
      head: 314,
    },
    headSold: 100,
    saleWeight: 100,
    purchases: [{ head: 100, purchaseWeight: 100 }],
  },
  otherDoes: {
    spring: {
      head: 300,
    },
    summer: {
      head: 300,
    },
    autumn: {
      head: 300,
    },
    winter: {
      head: 300,
    },
    headSold: 262,
    saleWeight: 50,
    purchases: [{ head: 100, purchaseWeight: 100 }],
  },
  fawn: {
    spring: {
      head: 88,
    },
    summer: {
      head: 99,
    },
    autumn: {
      head: 222,
    },
    winter: {
      head: 111,
    },
    headSold: 100,
    saleWeight: 100,
    purchases: [{ head: 100, purchaseWeight: 100 }],
  },
  tradeBucks: {
    spring: {
      head: 655,
    },
    summer: {
      head: 655,
    },
    autumn: {
      head: 655,
    },
    winter: {
      head: 200,
    },
    headSold: 655,
    saleWeight: 45,
    purchases: [{ head: 100, purchaseWeight: 100 }],
  },
  tradeDoes: {
    spring: {
      head: 100,
    },
    summer: {
      head: 100,
    },
    autumn: {
      head: 100,
    },
    winter: {
      head: 100,
    },
    headSold: 100,
    saleWeight: 100,
    purchases: [{ head: 100, purchaseWeight: 100 }],
  },
  tradeFawn: emptyClass,
  tradeOtherDoes: emptyClass,
};

export const deerComplete: DeerComplete = {
  id: 'deer-1',
  classes: deers,
  doesFawning: {
    autumn: 0,
    spring: 1,
    summer: 0,
    winter: 0,
  },
  seasonalFawning: {
    autumn: 0,
    spring: 1,
    summer: 0,
    winter: 0,
  },
  fertiliser: {
    pastureDryland: 10,
    pastureIrrigated: 2.5,
    cropsDryland: 7,
    cropsIrrigated: 3.5,
    otherDryland: 5,
    otherIrrigated: 3,
    singleSuperphosphate: 10,
    otherType: 'Diammonium Phosphate (DAP)',
  },
  limestone: 10,
  limestoneFraction: 1,

  electricityUse: 1000,
  electricityRenewable: 0,
  electricitySource: 'State Grid',
  diesel: 500,
  petrol: 100,
  lpg: 250,
  grainFeed: 5,
  hayFeed: 5,
  herbicide: 20,
  herbicideOther: 12,
};

export const deerTestData: DeerInput = {
  deers: [deerComplete],
  rainfallAbove600: true,
  state: 'tas',
  vegetation: [veg1, veg2, veg3, veg4],
};
