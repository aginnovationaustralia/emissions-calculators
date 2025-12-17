import { GoatComplete } from '@/types/Goat/goat.input';
import { GoatClasses } from '@/types/Goat/goatclasses.input';
import { GoatInput } from '@/types/Goat/input';
import { veg1, veg2, veg3, veg4 } from './vegetation.data';

const emptySeason = {
  head: 0,
};
const emptyClass = {
  summer: emptySeason,
  autumn: emptySeason,
  winter: emptySeason,
  spring: emptySeason,
  headShorn: 0,
  woolShorn: 0,
  cleanWoolYield: 0,
  headSold: 0,
  saleWeight: 0,
};

const goats: GoatClasses = {
  breedingDoesNannies: {
    summer: {
      head: 100,
    },
    autumn: {
      head: 100,
    },
    winter: {
      head: 100,
    },
    spring: {
      head: 100,
    },
    headShorn: 100,
    woolShorn: 100,
    cleanWoolYield: 65,
    purchases: [{ head: 100, purchaseWeight: 100 }],
    headSold: 20,
    saleWeight: 100,
  },
  bucksBilly: {
    summer: {
      head: 100,
    },
    autumn: {
      head: 100,
    },
    winter: {
      head: 100,
    },
    spring: {
      head: 100,
    },
    headShorn: 100,
    woolShorn: 100,
    cleanWoolYield: 65,
    purchases: [{ head: 100, purchaseWeight: 100 }],
    headSold: 20,
    saleWeight: 100,
  },
  kids: {
    summer: {
      head: 100,
    },
    autumn: {
      head: 100,
    },
    winter: {
      head: 100,
    },
    spring: {
      head: 100,
    },
    headShorn: 100,
    woolShorn: 100,
    cleanWoolYield: 65,
    purchases: [{ head: 100, purchaseWeight: 100 }],
    headSold: 20,
    saleWeight: 100,
  },
  maidenBreedingDoesNannies: {
    summer: {
      head: 100,
    },
    autumn: {
      head: 100,
    },
    winter: {
      head: 100,
    },
    spring: {
      head: 100,
    },
    headShorn: 100,
    woolShorn: 100,
    cleanWoolYield: 65,
    purchases: [{ head: 100, purchaseWeight: 100 }],
    headSold: 20,
    saleWeight: 100,
  },
  otherDoesCulledFemales: {
    summer: {
      head: 100,
    },
    autumn: {
      head: 100,
    },
    winter: {
      head: 100,
    },
    spring: {
      head: 100,
    },
    headShorn: 100,
    woolShorn: 100,
    cleanWoolYield: 65,
    purchases: [{ head: 100, purchaseWeight: 100 }],
    headSold: 20,
    saleWeight: 100,
  },
  tradeBucks: {
    summer: {
      head: 100,
    },
    autumn: {
      head: 100,
    },
    winter: {
      head: 100,
    },
    spring: {
      head: 100,
    },
    headShorn: 100,
    woolShorn: 100,
    cleanWoolYield: 65,
    purchases: [{ head: 100, purchaseWeight: 100 }],
    headSold: 20,
    saleWeight: 100,
  },
  tradeWethers: {
    summer: {
      head: 200,
    },
    autumn: {
      head: 200,
    },
    winter: {
      head: 200,
    },
    spring: {
      head: 200,
    },
    headShorn: 200,
    woolShorn: 100,
    cleanWoolYield: 65,
    purchases: [{ head: 200, purchaseWeight: 100 }],
    headSold: 40,
    saleWeight: 100,
  },
  wethers: {
    summer: {
      head: 100,
    },
    autumn: {
      head: 100,
    },
    winter: {
      head: 100,
    },
    spring: {
      head: 100,
    },
    headShorn: 100,
    woolShorn: 100,
    cleanWoolYield: 65,
    purchases: [{ head: 100, purchaseWeight: 100 }],
    headSold: 20,
    saleWeight: 100,
  },
  tradeMaidenBreedingDoesNannies: emptyClass,
  tradeBreedingDoesNannies: emptyClass,
  tradeOtherDoesCulledFemales: emptyClass,
  tradeKids: emptyClass,
};

export const goatComplete: GoatComplete = {
  id: '1',
  classes: goats,
  limestone: 100,
  limestoneFraction: 1,
  fertiliser: {
    cropsDryland: 2,
    cropsIrrigated: 5,
    otherFertilisers: [
      {
        otherType: 'Ammonium Nitrate (AN)',
        otherDryland: 1,
        otherIrrigated: 4,
      },
    ],
    pastureDryland: 10,
    pastureIrrigated: 3,
    singleSuperphosphate: 2,
  },
  diesel: 200,
  petrol: 3000,
  lpg: 0,
  mineralSupplementation: {
    drySeasonMixUrea: 0.05,
    drySeasonMix: 0.05,
    mineralBlockUrea: 0.3,
    mineralBlock: 0.1,
    weanerBlockUrea: 0.25,
    weanerBlock: 0.01,
  },
  electricitySource: 'State Grid',
  electricityRenewable: 0.1,
  electricityUse: 300,
  grainFeed: 100,
  hayFeed: 80,
  herbicide: 400,
  herbicideOther: 300,
};

export const goatTestData: GoatInput = {
  goats: [goatComplete],
  rainfallAbove600: true,
  state: 'nsw',
  vegetation: [
    { vegetation: veg1, goatProportion: [1] },
    { vegetation: veg2, goatProportion: [1] },
    { vegetation: veg3, goatProportion: [1] },
    { vegetation: veg4, goatProportion: [1] },
  ],
};
