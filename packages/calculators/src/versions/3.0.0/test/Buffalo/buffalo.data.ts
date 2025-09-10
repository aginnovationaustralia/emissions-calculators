import { BuffaloComplete } from '../../types/Buffalo/buffalo.input';
import { BuffaloClass } from '../../types/Buffalo/buffaloclass.input';
import { BuffaloClasses } from '../../types/Buffalo/buffaloclasses.input';
import { BuffaloInput } from '../../types/Buffalo/input';
import { veg1, veg2, veg3, veg4 } from './vegetation.data';

const emptySeason = {
  head: 0,
};

const emptyClass: BuffaloClass = {
  spring: emptySeason,
  summer: emptySeason,
  autumn: emptySeason,
  winter: emptySeason,
  headSold: 0,
  saleWeight: 0,
  purchases: [],
};

const buffalos: BuffaloClasses = {
  bulls: {
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
    headSold: 0,
    saleWeight: 0,
    purchases: [{ head: 100, purchaseWeight: 100 }],
  },
  cows: {
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
    headSold: 0,
    saleWeight: 0,
    purchases: [{ head: 100, purchaseWeight: 100 }],
  },
  steers: {
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
    headSold: 300,
    saleWeight: 450,
    purchases: [{ head: 100, purchaseWeight: 100 }],
  },
  calfs: {
    spring: {
      head: 0,
    },
    summer: {
      head: 0,
    },
    autumn: {
      head: 0,
    },
    winter: {
      head: 0,
    },
    headSold: 0,
    saleWeight: 0,
    purchases: [{ head: 100, purchaseWeight: 100 }],
  },
  tradeBulls: {
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
      head: 0,
    },
    headSold: 655,
    saleWeight: 550,
    purchases: [{ head: 100, purchaseWeight: 100 }],
  },
  tradeCows: {
    spring: {
      head: 0,
    },
    summer: {
      head: 0,
    },
    autumn: {
      head: 0,
    },
    winter: {
      head: 0,
    },
    headSold: 0,
    saleWeight: 0,
    purchases: [{ head: 100, purchaseWeight: 100 }],
  },
  tradeCalfs: emptyClass,
  tradeSteers: emptyClass,
};

export const buffaloComplete: BuffaloComplete = {
  classes: buffalos,
  cowsCalving: {
    autumn: 0,
    spring: 1,
    summer: 0,
    winter: 0,
  },
  seasonalCalving: {
    autumn: 0,
    spring: 1,
    summer: 0,
    winter: 0,
  },
  fertiliser: {
    pastureDryland: 15,
    pastureIrrigated: 2,
    cropsDryland: 0,
    cropsIrrigated: 2,
    otherType: 'Monoammonium phosphate (MAP)',
    otherDryland: 650,
    otherIrrigated: 2,
    singleSuperphosphate: 0,
  },
  limestone: 85,
  limestoneFraction: 1,
  electricityUse: 4000,
  electricitySource: 'State Grid',
  electricityRenewable: 0.2,
  diesel: 500,
  petrol: 0,
  lpg: 150,
  grainFeed: 3200,
  hayFeed: 65,
  herbicide: 25,
  herbicideOther: 13,
};

export const buffaloTestData: BuffaloInput = {
  buffalos: [buffaloComplete],
  rainfallAbove600: true,
  state: 'nsw',
  vegetation: [veg1, veg2, veg3, veg4],
};
