import { FeedlotComplete } from '@/types/Feedlot/feedlot.input';
import { FeedlotInput } from '@/types/Feedlot/input';
import { merge } from 'ts-deepmerge';
import { veg1, veg2, veg3, veg4 } from './vegetation.data';

export const feedlotEnterprise: FeedlotComplete = {
  groups: [
    // Group 1
    {
      stays: [
        {
          livestock: 1000,
          stayAverageDuration: 75,
          liveweight: 360,
          dailyIntake: 10.4,
          ndf: 22,
          etherExtract: 4.8,
          dryMatterDigestibility: 81,
          crudeProtein: 14,
          nitrogenRetention: 20.4,
        },
        {
          livestock: 100,
          stayAverageDuration: 140,
          liveweight: 450,
          dailyIntake: 10.8,
          ndf: 22,
          etherExtract: 5.0,
          dryMatterDigestibility: 81,
          crudeProtein: 12,
          nitrogenRetention: 12.7,
        },
        {
          livestock: 100,
          stayAverageDuration: 250,
          liveweight: 550,
          dailyIntake: 8.2,
          ndf: 24,
          etherExtract: 5.5,
          dryMatterDigestibility: 79,
          crudeProtein: 12,
          nitrogenRetention: 7,
        },
      ],
    },
    // Group 2
    {
      stays: [
        {
          livestock: 100,
          stayAverageDuration: 75,
          liveweight: 330,
          dailyIntake: 10.4,
          ndf: 22,
          etherExtract: 4.8,
          dryMatterDigestibility: 81,
          crudeProtein: 14,
          nitrogenRetention: 20.4,
        },
        {
          livestock: 100,
          stayAverageDuration: 140,
          liveweight: 450,
          dailyIntake: 10.8,
          ndf: 22,
          etherExtract: 5.0,
          dryMatterDigestibility: 81,
          crudeProtein: 12,
          nitrogenRetention: 12.7,
        },
        {
          livestock: 100,
          stayAverageDuration: 250,
          liveweight: 550,
          dailyIntake: 8.2,
          ndf: 24,
          etherExtract: 5.5,
          dryMatterDigestibility: 79,
          crudeProtein: 12,
          nitrogenRetention: 7,
        },
      ],
    },
    // Group 3
    {
      stays: [
        {
          livestock: 100,
          stayAverageDuration: 75,
          liveweight: 330,
          dailyIntake: 10.4,
          ndf: 22,
          etherExtract: 4.8,
          dryMatterDigestibility: 81,
          crudeProtein: 14,
          nitrogenRetention: 20.4,
        },
        {
          livestock: 100,
          stayAverageDuration: 140,
          liveweight: 450,
          dailyIntake: 10.8,
          ndf: 22,
          etherExtract: 5.0,
          dryMatterDigestibility: 81,
          crudeProtein: 12,
          nitrogenRetention: 12.7,
        },
        {
          livestock: 100,
          stayAverageDuration: 250,
          liveweight: 540,
          dailyIntake: 8.2,
          ndf: 24,
          etherExtract: 5.5,
          dryMatterDigestibility: 79,
          crudeProtein: 12,
          nitrogenRetention: 7,
        },
      ],
    },
    // Group 4
    {
      stays: [
        {
          livestock: 100,
          stayAverageDuration: 75,
          liveweight: 320,
          dailyIntake: 10.4,
          ndf: 22,
          etherExtract: 4.8,
          dryMatterDigestibility: 81,
          crudeProtein: 14,
          nitrogenRetention: 20.4,
        },
        {
          livestock: 100,
          stayAverageDuration: 140,
          liveweight: 440,
          dailyIntake: 10.8,
          ndf: 22,
          etherExtract: 5.0,
          dryMatterDigestibility: 81,
          crudeProtein: 12,
          nitrogenRetention: 12.7,
        },
        {
          livestock: 100,
          stayAverageDuration: 250,
          liveweight: 535,
          dailyIntake: 8.2,
          ndf: 24,
          etherExtract: 5.5,
          dryMatterDigestibility: 79,
          crudeProtein: 12,
          nitrogenRetention: 7,
        },
      ],
    },
  ],
  purchases: {
    bullsGt1: [
      {
        head: 10,
        purchaseWeight: 210,
        purchaseSource: 'nth QLD',
      },
    ],
    steersLt1: [
      {
        head: 20,
        purchaseWeight: 220,
        purchaseSource: 'nth QLD',
      },
    ],
    steers1To2: [
      {
        head: 30,
        purchaseWeight: 230,
        purchaseSource: 'nth QLD',
      },
    ],
    steersGt2: [
      {
        head: 40,
        purchaseWeight: 240,
        purchaseSource: 'nth QLD',
      },
    ],
    cowsGt2: [
      {
        head: 50,
        purchaseWeight: 250,
        purchaseSource: 'nth QLD',
      },
    ],
    heifersLt1: [
      {
        head: 60,
        purchaseWeight: 260,
        purchaseSource: 'nth QLD',
      },
    ],
    heifers1To2: [
      {
        head: 70,
        purchaseWeight: 270,
        purchaseSource: 'nth QLD',
      },
    ],
    heifersGt2: [
      {
        head: 80,
        purchaseWeight: 280,
        purchaseSource: 'nth QLD',
      },
    ],
    steersGt2Traded: [
      {
        head: 90,
        purchaseWeight: 290,
        purchaseSource: 'sw WA',
      },
    ],
    heifersLt1Traded: [
      {
        head: 100,
        purchaseWeight: 300,
        purchaseSource: 'sw WA',
      },
    ],
    steers1To2Traded: [
      {
        head: 110,
        purchaseWeight: 310,
        purchaseSource: 'sw WA',
      },
    ],
    bullsGt1Traded: [],
    cowsGt2Traded: [],
    heifers1To2Traded: [],
    heifersGt2Traded: [],
    steersLt1Traded: [],
  },
  sales: {
    bullsGt1: [{ head: 10, saleWeight: 500 }],
    steersLt1: [],
    steers1To2: [],
    steersGt2: [],
    cowsGt2: [],
    heifersLt1: [],
    heifers1To2: [{ head: 200, saleWeight: 300 }],
    heifersGt2: [],
    steersGt2Traded: [],
    steers1To2Traded: [],
    steersLt1Traded: [],
    bullsGt1Traded: [],
    cowsGt2Traded: [],
    heifersLt1Traded: [],
    heifers1To2Traded: [],
    heifersGt2Traded: [],
  },
  system: 'Drylot',
  fertiliser: {
    pastureDryland: 5,
    pastureIrrigated: 0,
    cropsDryland: 0,
    cropsIrrigated: 6,
    otherDryland: 0,
    otherIrrigated: 0,
    singleSuperphosphate: 2,
    otherType: 'Diammonium Phosphate (DAP)',
  },
  diesel: 26000,
  petrol: 500,
  lpg: 200,
  electricitySource: 'State Grid',
  electricityRenewable: 0,
  electricityUse: 12500,
  grainFeed: 3200,
  hayFeed: 516,
  cottonseedFeed: 220,
  herbicide: 25.5,
  herbicideOther: 18,
  distanceCattleTransported: 1500,
  truckType: '4 Deck Trailer',
  limestone: 1,
  limestoneFraction: 1,
};

export const feedlotTestData: FeedlotInput = {
  feedlots: [feedlotEnterprise],
  state: 'qld',
  vegetation: [veg1, veg2, veg3, veg4],
};

export const feedlotTestData110: FeedlotInput = merge(feedlotTestData, {
  fertiliser: {
    otherDryland: 0,
    otherIrrigated: 0,
  },
});
