import { BeefInput } from '@aginnovationaustralia/emissions-calculators/beef';

// Create a sample beef input (simplified for demonstration)
export const beefInputData: BeefInput = {
  state: 'nsw' as const,
  northOfTropicOfCapricorn: true,
  rainfallAbove600: true,
  beef: [
    {
      classes: {
        bullsGt1: {
          autumn: {
            head: 50,
            liveweight: 600,
            liveweightGain: 50,
            crudeProtein: 12,
            dryMatterDigestibility: 65,
          },
          winter: {
            head: 50,
            liveweight: 580,
            liveweightGain: 30,
            crudeProtein: 10,
            dryMatterDigestibility: 60,
          },
          spring: {
            head: 50,
            liveweight: 620,
            liveweightGain: 80,
            crudeProtein: 14,
            dryMatterDigestibility: 70,
          },
          summer: {
            head: 50,
            liveweight: 650,
            liveweightGain: 60,
            crudeProtein: 13,
            dryMatterDigestibility: 68,
          },
          headSold: 10,
          saleWeight: 650,
          purchases: [],
        },
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
      electricitySource: 'State Grid' as const,
      electricityRenewable: 0,
      electricityUse: 0,
      grainFeed: 0,
      hayFeed: 0,
      cottonseedFeed: 0,
      herbicide: 0,
      herbicideOther: 0,
      cowsCalving: {
        autumn: 0,
        winter: 0,
        spring: 0,
        summer: 0,
      },
    },
  ],
  burning: [],
  vegetation: [],
};
