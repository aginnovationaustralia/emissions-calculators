import {
  AquacultureBait,
  FluidWasteTreatmentType,
  FreightTypes,
} from '../types/types';
import {
  AllConstants,
  AquacultureConstants,
  BeefConstants,
  BuffaloConstants,
  CommonConstants,
  CottonConstants,
  CropConstants,
  DairyConstants,
  DeerConstants,
  FeedlotConstants,
  FisheriesConstants,
  GoatConstants,
  LIVESTOCK_SOURCE_LOCATION,
  LivestockConstants,
  PorkConstants,
  PoultryConstants,
  RiceConstants,
  SavannaConstants,
  SheepConstants,
  STATES,
  SugarConstants,
} from './versionedConstants';

export const REGIONS = {
  SOUTHWEST: 'southwest',
  PILBARA: 'pilbara',
  KIMBERLEY: 'kimberley',
};

export const sheepConstants: SheepConstants = {
  /**
   * @description Feed availability rate for sheep across seasons and states, in tonnes per hectare
   * @inventory2018 Appendix 5.D.3
   * @units t/ha
   */
  FEEDAVAILABILITY: {
    spring: {
      [STATES.ACT]: 2.9,
      [STATES.NSW]: 2.9,
      [STATES.QLD]: 1.5,
      [STATES.SA]: 4,
      [STATES.TAS]: 2.5,
      [STATES.VIC]: 3.2,
      [STATES.WA_SW]: 3.5,
      [STATES.WA_NW]: 3.5,
      [STATES.NT]: 1.5,
    },
    summer: {
      [STATES.ACT]: 2.5,
      [STATES.NSW]: 2.5,
      [STATES.QLD]: 2.0,
      [STATES.SA]: 2.5,
      [STATES.TAS]: 2.5,
      [STATES.VIC]: 3,
      [STATES.WA_SW]: 1.5,
      [STATES.WA_NW]: 1.5,
      [STATES.NT]: 2,
    },
    autumn: {
      [STATES.ACT]: 1.6,
      [STATES.NSW]: 1.6,
      [STATES.QLD]: 2.2,
      [STATES.SA]: 0.7,
      [STATES.TAS]: 1.3,
      [STATES.VIC]: 1.8,
      [STATES.WA_SW]: 0.7,
      [STATES.WA_NW]: 0.7,
      [STATES.NT]: 2.2,
    },
    winter: {
      [STATES.ACT]: 1.7,
      [STATES.NSW]: 1.7,
      [STATES.QLD]: 1.7,
      [STATES.SA]: 0.9,
      [STATES.TAS]: 0.8,
      [STATES.VIC]: 1.0,
      [STATES.WA_SW]: 1.2,
      [STATES.WA_NW]: 1.2,
      [STATES.NT]: 1.7,
    },
  },

  /**
   * @description Crude protein content for sheep across seasons and states, as percentage
   * @inventory2018 Appendix 5.D.4
   * @units %
   * @type Percentage
   */
  CRUDEPROTEIN: {
    spring: {
      [STATES.ACT]: 20,
      [STATES.NSW]: 20,
      [STATES.QLD]: 8,
      [STATES.SA]: 16,
      [STATES.TAS]: 20,
      [STATES.VIC]: 16,
      [STATES.WA_SW]: 18,
      [STATES.WA_NW]: 18,
      [STATES.NT]: 7,
    },
    summer: {
      [STATES.ACT]: 10,
      [STATES.NSW]: 10,
      [STATES.QLD]: 10,
      [STATES.SA]: 7,
      [STATES.TAS]: 7,
      [STATES.VIC]: 7,
      [STATES.WA_SW]: 6,
      [STATES.WA_NW]: 6,
      [STATES.NT]: 13,
    },
    autumn: {
      [STATES.ACT]: 12,
      [STATES.NSW]: 12,
      [STATES.QLD]: 9,
      [STATES.SA]: 9,
      [STATES.TAS]: 14,
      [STATES.VIC]: 13,
      [STATES.WA_SW]: 6,
      [STATES.WA_NW]: 6,
      [STATES.NT]: 10,
    },
    winter: {
      [STATES.ACT]: 18,
      [STATES.NSW]: 18,
      [STATES.QLD]: 8,
      [STATES.SA]: 20,
      [STATES.TAS]: 16,
      [STATES.VIC]: 10,
      [STATES.WA_SW]: 21,
      [STATES.WA_NW]: 21,
      [STATES.NT]: 6,
    },
  },

  /**
   * @description Dry matter digestibility for sheep across seasons and states, as percentage
   * @inventory2018 Appendix 5.D.2
   * @units %
   * @type Percentage
   */
  DRYMATTERDIGESTIBILITY: {
    spring: {
      [STATES.ACT]: 75,
      [STATES.NSW]: 75,
      [STATES.QLD]: 51,
      [STATES.SA]: 70,
      [STATES.TAS]: 75,
      [STATES.VIC]: 70,
      [STATES.WA_SW]: 73,
      [STATES.WA_NW]: 73,
      [STATES.NT]: 55,
    },
    summer: {
      [STATES.ACT]: 61,
      [STATES.NSW]: 61,
      [STATES.QLD]: 55,
      [STATES.SA]: 55,
      [STATES.TAS]: 55,
      [STATES.VIC]: 55,
      [STATES.WA_SW]: 55,
      [STATES.WA_NW]: 55,
      [STATES.NT]: 61,
    },
    autumn: {
      [STATES.ACT]: 64,
      [STATES.NSW]: 64,
      [STATES.QLD]: 59,
      [STATES.SA]: 55,
      [STATES.TAS]: 67,
      [STATES.VIC]: 65,
      [STATES.WA_SW]: 50,
      [STATES.WA_NW]: 50,
      [STATES.NT]: 57,
    },
    winter: {
      [STATES.ACT]: 72,
      [STATES.NSW]: 72,
      [STATES.QLD]: 58,
      [STATES.SA]: 75,
      [STATES.TAS]: 70,
      [STATES.VIC]: 60,
      [STATES.WA_SW]: 76,
      [STATES.WA_NW]: 76,
      [STATES.NT]: 54,
    },
  },

  /**
   * @description Standard reference weight for sheep across seasons and states, in kilograms
   * @inventory2018 Appendix 5.D.7
   * @units kg
   */
  STANDARDWEIGHT: {
    rams: {
      [STATES.ACT]: 78,
      [STATES.NSW]: 78,
      [STATES.TAS]: 77,
      [STATES.WA_SW]: 84,
      [STATES.SA]: 84,
      [STATES.VIC]: 70,
      [STATES.QLD]: 70,
      [STATES.NT]: 70,
      [STATES.WA_NW]: 70,
    },
    tradeRams: {
      [STATES.ACT]: 78,
      [STATES.NSW]: 78,
      [STATES.TAS]: 77,
      [STATES.WA_SW]: 84,
      [STATES.SA]: 84,
      [STATES.VIC]: 70,
      [STATES.QLD]: 70,
      [STATES.NT]: 70,
      [STATES.WA_NW]: 70,
    },
    wethers: {
      [STATES.ACT]: 62,
      [STATES.NSW]: 62,
      [STATES.TAS]: 66,
      [STATES.WA_SW]: 72,
      [STATES.SA]: 72,
      [STATES.VIC]: 60,
      [STATES.QLD]: 60,
      [STATES.NT]: 60,
      [STATES.WA_NW]: 60,
    },
    maidenBreedingEwes: {
      [STATES.ACT]: 57,
      [STATES.NSW]: 57,
      [STATES.TAS]: 55,
      [STATES.WA_SW]: 60,
      [STATES.SA]: 60,
      [STATES.VIC]: 50,
      [STATES.QLD]: 50,
      [STATES.NT]: 50,
      [STATES.WA_NW]: 50,
    },
    tradeMaidenBreedingEwes: {
      [STATES.ACT]: 57,
      [STATES.NSW]: 57,
      [STATES.TAS]: 55,
      [STATES.WA_SW]: 60,
      [STATES.SA]: 60,
      [STATES.VIC]: 50,
      [STATES.QLD]: 50,
      [STATES.NT]: 50,
      [STATES.WA_NW]: 50,
    },
    breedingEwes: {
      [STATES.ACT]: 57,
      [STATES.NSW]: 57,
      [STATES.TAS]: 55,
      [STATES.WA_SW]: 60,
      [STATES.SA]: 60,
      [STATES.VIC]: 50,
      [STATES.QLD]: 50,
      [STATES.NT]: 50,
      [STATES.WA_NW]: 50,
    },
    tradeBreedingEwes: {
      [STATES.ACT]: 57,
      [STATES.NSW]: 57,
      [STATES.TAS]: 55,
      [STATES.WA_SW]: 60,
      [STATES.SA]: 60,
      [STATES.VIC]: 50,
      [STATES.QLD]: 50,
      [STATES.NT]: 50,
      [STATES.WA_NW]: 50,
    },
    otherEwes: {
      [STATES.ACT]: 57,
      [STATES.NSW]: 57,
      [STATES.TAS]: 55,
      [STATES.WA_SW]: 60,
      [STATES.SA]: 60,
      [STATES.VIC]: 50,
      [STATES.QLD]: 50,
      [STATES.NT]: 50,
      [STATES.WA_NW]: 50,
    },
    tradeOtherEwes: {
      [STATES.ACT]: 57,
      [STATES.NSW]: 57,
      [STATES.TAS]: 55,
      [STATES.WA_SW]: 60,
      [STATES.SA]: 60,
      [STATES.VIC]: 50,
      [STATES.QLD]: 50,
      [STATES.NT]: 50,
      [STATES.WA_NW]: 50,
    },
    eweLambs: {
      [STATES.ACT]: 60,
      [STATES.NSW]: 60,
      [STATES.TAS]: 60,
      [STATES.WA_SW]: 66,
      [STATES.SA]: 66,
      [STATES.VIC]: 55,
      [STATES.QLD]: 55,
      [STATES.NT]: 55,
      [STATES.WA_NW]: 55,
    },
    tradeEweLambs: {
      [STATES.ACT]: 60,
      [STATES.NSW]: 60,
      [STATES.TAS]: 60,
      [STATES.WA_SW]: 66,
      [STATES.SA]: 66,
      [STATES.VIC]: 55,
      [STATES.QLD]: 55,
      [STATES.NT]: 55,
      [STATES.WA_NW]: 55,
    },
    wetherLambs: {
      [STATES.ACT]: 60,
      [STATES.NSW]: 60,
      [STATES.TAS]: 60,
      [STATES.WA_SW]: 66,
      [STATES.SA]: 66,
      [STATES.VIC]: 55,
      [STATES.QLD]: 55,
      [STATES.NT]: 55,
      [STATES.WA_NW]: 55,
    },
    tradeWetherLambs: {
      [STATES.ACT]: 60,
      [STATES.NSW]: 60,
      [STATES.TAS]: 60,
      [STATES.WA_SW]: 66,
      [STATES.SA]: 66,
      [STATES.VIC]: 55,
      [STATES.QLD]: 55,
      [STATES.NT]: 55,
      [STATES.WA_NW]: 55,
    },
    tradeLambsAndHoggets: {
      [STATES.ACT]: 60,
      [STATES.NSW]: 60,
      [STATES.TAS]: 60,
      [STATES.WA_SW]: 66,
      [STATES.SA]: 66,
      [STATES.VIC]: 55,
      [STATES.QLD]: 55,
      [STATES.NT]: 55,
      [STATES.WA_NW]: 55,
    },
    tradeWethers: {
      [STATES.ACT]: 62,
      [STATES.NSW]: 62,
      [STATES.TAS]: 66,
      [STATES.WA_SW]: 72,
      [STATES.SA]: 72,
      [STATES.VIC]: 60,
      [STATES.QLD]: 60,
      [STATES.NT]: 60,
      [STATES.WA_NW]: 60,
    },
    tradeEwes: {
      [STATES.ACT]: 57,
      [STATES.NSW]: 57,
      [STATES.TAS]: 55,
      [STATES.WA_SW]: 60,
      [STATES.SA]: 60,
      [STATES.VIC]: 50,
      [STATES.QLD]: 50,
      [STATES.NT]: 50,
      [STATES.WA_NW]: 50,
    },
  },

  /**
   * @description Emission factors for purchased sheep by breed, in kg CO2-e/kg liveweight
   * @reference Wiedemann et al. (2016)
   * @units kg CO2-e/kg
   */
  EMISSIONFACTOR: {
    MERINO: 9.3,
    CROSSBRED: 6.9,
  },

  /**
   * @description Urine and dung deposited during grazing
   */
  EF_URINEDUNGDEPOSITED: 0.004,
};

export const beefConstants: BeefConstants = {
  /**
   * @description Dry matter digestibility for beef across seasons and states, as percentage
   * @inventory2018 Appendix 5.B.3
   * @units %
   * @type Percentage
   */
  DRYMATTERDIGESTIBILITY: {
    spring: {
      [STATES.ACT]: 55,
      [STATES.NSW]: 55,
      [STATES.NT]: 55,
      [STATES.QLD]: 53,
      [STATES.SA]: 70,
      [STATES.TAS]: 75,
      [STATES.VIC]: 80,
      [STATES.WA_SW]: 80,
      [STATES.WA_NW]: 40,
    },
    summer: {
      [STATES.ACT]: 65,
      [STATES.NSW]: 65,
      [STATES.NT]: 61,
      [STATES.QLD]: 57,
      [STATES.SA]: 55,
      [STATES.TAS]: 60,
      [STATES.VIC]: 55,
      [STATES.WA_SW]: 58,
      [STATES.WA_NW]: 65,
    },
    autumn: {
      [STATES.ACT]: 60,
      [STATES.NSW]: 60,
      [STATES.NT]: 57,
      [STATES.QLD]: 55,
      [STATES.SA]: 55,
      [STATES.TAS]: 70,
      [STATES.VIC]: 60,
      [STATES.WA_SW]: 50,
      [STATES.WA_NW]: 55,
    },
    winter: {
      [STATES.ACT]: 50,
      [STATES.NSW]: 50,
      [STATES.NT]: 54,
      [STATES.QLD]: 51,
      [STATES.SA]: 75,
      [STATES.TAS]: 75,
      [STATES.VIC]: 76,
      [STATES.WA_SW]: 75,
      [STATES.WA_NW]: 45,
    },
  },

  /**
   * @description Crude protein content for beef across seasons and states, as percentage
   * @inventory2018 Appendix 5.B.4
   * @units %
   * @type Percentage
   */
  CRUDEPROTEIN: {
    spring: {
      [STATES.ACT]: 7,
      [STATES.NSW]: 7,
      [STATES.NT]: 5.8,
      [STATES.QLD]: 7,
      [STATES.SA]: 7.2,
      [STATES.TAS]: 16,
      [STATES.VIC]: 20,
      [STATES.WA_SW]: 25,
      [STATES.WA_NW]: 4,
    },
    summer: {
      [STATES.ACT]: 13,
      [STATES.NSW]: 13,
      [STATES.NT]: 9.2,
      [STATES.QLD]: 13,
      [STATES.SA]: 9.9,
      [STATES.TAS]: 7,
      [STATES.VIC]: 10,
      [STATES.WA_SW]: 7,
      [STATES.WA_NW]: 12,
    },
    autumn: {
      [STATES.ACT]: 10,
      [STATES.NSW]: 10,
      [STATES.NT]: 7.5,
      [STATES.QLD]: 10,
      [STATES.SA]: 7.8,
      [STATES.TAS]: 9,
      [STATES.VIC]: 16,
      [STATES.WA_SW]: 10,
      [STATES.WA_NW]: 9,
    },
    winter: {
      [STATES.ACT]: 6,
      [STATES.NSW]: 6,
      [STATES.NT]: 5.3,
      [STATES.QLD]: 6,
      [STATES.SA]: 5.9,
      [STATES.TAS]: 20,
      [STATES.VIC]: 20,
      [STATES.WA_SW]: 21,
      [STATES.WA_NW]: 6,
    },
  },
  /**
   * @description Amount of nitrogen excreted by beef cattle across class and state, in kilograms per year
   * @units kg/year
   */
  NITROGENEXCRETEDNUMBER: {
    bullsGt1: {
      [STATES.ACT]: 700,
      [STATES.NSW]: 700,
      [STATES.TAS]: 770,
      [STATES.WA_SW]: 770,
      [STATES.SA]: 770,
      [STATES.VIC]: 770,
      [STATES.QLD]: 770,
      [STATES.NT]: 770,
      [REGIONS.KIMBERLEY]: 770,
      [STATES.WA_NW]: 770,
    },
    bullsGt1Traded: {
      [STATES.ACT]: 700,
      [STATES.NSW]: 700,
      [STATES.TAS]: 770,
      [STATES.WA_SW]: 770,
      [STATES.SA]: 770,
      [STATES.VIC]: 770,
      [STATES.QLD]: 770,
      [STATES.NT]: 770,
      [REGIONS.KIMBERLEY]: 770,
      [STATES.WA_NW]: 770,
    },
    steersLt1: {
      [STATES.ACT]: 500,
      [STATES.NSW]: 500,
      [STATES.TAS]: 550,
      [STATES.WA_SW]: 550,
      [STATES.SA]: 550,
      [STATES.VIC]: 550,
      [STATES.QLD]: 550,
      [STATES.NT]: 550,
      [REGIONS.KIMBERLEY]: 550,
      [STATES.WA_NW]: 550,
    },
    steers1To2: {
      [STATES.ACT]: 600,
      [STATES.NSW]: 600,
      [STATES.TAS]: 660,
      [STATES.WA_SW]: 660,
      [STATES.SA]: 660,
      [STATES.VIC]: 660,
      [STATES.QLD]: 660,
      [STATES.NT]: 660,
      [REGIONS.KIMBERLEY]: 660,
      [STATES.WA_NW]: 660,
    },
    steersGt2: {
      [STATES.ACT]: 600,
      [STATES.NSW]: 600,
      [STATES.TAS]: 660,
      [STATES.WA_SW]: 660,
      [STATES.SA]: 660,
      [STATES.VIC]: 660,
      [STATES.QLD]: 660,
      [STATES.NT]: 660,
      [REGIONS.KIMBERLEY]: 660,
      [STATES.WA_NW]: 660,
    },
    cowsGt2: {
      [STATES.ACT]: 500,
      [STATES.NSW]: 500,
      [STATES.TAS]: 550,
      [STATES.WA_SW]: 550,
      [STATES.SA]: 550,
      [STATES.VIC]: 550,
      [STATES.QLD]: 550,
      [STATES.NT]: 550,
      [REGIONS.KIMBERLEY]: 550,
      [STATES.WA_NW]: 550,
    },
    cowsGt2Traded: {
      [STATES.ACT]: 500,
      [STATES.NSW]: 500,
      [STATES.TAS]: 550,
      [STATES.WA_SW]: 550,
      [STATES.SA]: 550,
      [STATES.VIC]: 550,
      [STATES.QLD]: 550,
      [STATES.NT]: 550,
      [REGIONS.KIMBERLEY]: 550,
      [STATES.WA_NW]: 550,
    },
    heifersLt1: {
      [STATES.ACT]: 500,
      [STATES.NSW]: 500,
      [STATES.TAS]: 550,
      [STATES.WA_SW]: 550,
      [STATES.SA]: 550,
      [STATES.VIC]: 550,
      [STATES.QLD]: 550,
      [STATES.NT]: 550,
      [REGIONS.KIMBERLEY]: 550,
      [STATES.WA_NW]: 550,
    },
    heifersLt1Traded: {
      [STATES.ACT]: 500,
      [STATES.NSW]: 500,
      [STATES.TAS]: 550,
      [STATES.WA_SW]: 550,
      [STATES.SA]: 550,
      [STATES.VIC]: 550,
      [STATES.QLD]: 550,
      [STATES.NT]: 550,
      [REGIONS.KIMBERLEY]: 550,
      [STATES.WA_NW]: 550,
    },
    heifers1To2: {
      [STATES.ACT]: 500,
      [STATES.NSW]: 500,
      [STATES.TAS]: 550,
      [STATES.WA_SW]: 550,
      [STATES.SA]: 550,
      [STATES.VIC]: 550,
      [STATES.QLD]: 550,
      [STATES.NT]: 550,
      [REGIONS.KIMBERLEY]: 550,
      [STATES.WA_NW]: 550,
    },
    heifers1To2Traded: {
      [STATES.ACT]: 500,
      [STATES.NSW]: 500,
      [STATES.TAS]: 550,
      [STATES.WA_SW]: 550,
      [STATES.SA]: 550,
      [STATES.VIC]: 550,
      [STATES.QLD]: 550,
      [STATES.NT]: 550,
      [REGIONS.KIMBERLEY]: 550,
      [STATES.WA_NW]: 550,
    },
    heifersGt2: {
      [STATES.ACT]: 500,
      [STATES.NSW]: 500,
      [STATES.TAS]: 550,
      [STATES.WA_SW]: 550,
      [STATES.SA]: 550,
      [STATES.VIC]: 550,
      [STATES.QLD]: 550,
      [STATES.NT]: 550,
      [REGIONS.KIMBERLEY]: 550,
      [STATES.WA_NW]: 550,
    },
    heifersGt2Traded: {
      [STATES.ACT]: 500,
      [STATES.NSW]: 500,
      [STATES.TAS]: 550,
      [STATES.WA_SW]: 550,
      [STATES.SA]: 550,
      [STATES.VIC]: 550,
      [STATES.QLD]: 550,
      [STATES.NT]: 550,
      [REGIONS.KIMBERLEY]: 550,
      [STATES.WA_NW]: 550,
    },
    steersGt2Traded: {
      [STATES.ACT]: 600,
      [STATES.NSW]: 600,
      [STATES.TAS]: 660,
      [STATES.WA_SW]: 660,
      [STATES.SA]: 660,
      [STATES.VIC]: 660,
      [STATES.QLD]: 660,
      [STATES.NT]: 660,
      [REGIONS.KIMBERLEY]: 660,
      [STATES.WA_NW]: 660,
    },
    steers1To2Traded: {
      [STATES.ACT]: 600,
      [STATES.NSW]: 600,
      [STATES.TAS]: 660,
      [STATES.WA_SW]: 660,
      [STATES.SA]: 660,
      [STATES.VIC]: 660,
      [STATES.QLD]: 660,
      [STATES.NT]: 660,
      [REGIONS.KIMBERLEY]: 660,
      [STATES.WA_NW]: 660,
    },
    steersLt1Traded: {
      [STATES.ACT]: 500,
      [STATES.NSW]: 500,
      [STATES.TAS]: 550,
      [STATES.WA_SW]: 550,
      [STATES.SA]: 550,
      [STATES.VIC]: 550,
      [STATES.QLD]: 550,
      [STATES.NT]: 550,
      [REGIONS.KIMBERLEY]: 550,
      [STATES.WA_NW]: 550,
    },
  },

  /**
   * @description Urine and dung deposited during grazing
   */
  EF_URINEDUNGDEPOSITED: 0.004,

  /**
   * @description Emission factors for purchased cattle by region, in kg CO2-e/kg liveweight
   * @reference Wiedemann et al. (2016); Christie (2022)
   * @units kg CO2-e/kg
   */
  LIVESTOCK_SOURCE_EMISSIONFACTOR: {
    [LIVESTOCK_SOURCE_LOCATION['Dairy origin']]: 4.4,
    [LIVESTOCK_SOURCE_LOCATION['nth/sth/central QLD']]: 12.4,
    [LIVESTOCK_SOURCE_LOCATION['nth/sth NSW/VIC/sth SA']]: 11.7,
    [LIVESTOCK_SOURCE_LOCATION['NSW/SA pastoral zone']]: 12.4,
    [LIVESTOCK_SOURCE_LOCATION['sw WA']]: 11.7,
    [LIVESTOCK_SOURCE_LOCATION['WA pastoral']]: 12.4,
    [LIVESTOCK_SOURCE_LOCATION.TAS]: 11.7,
    [LIVESTOCK_SOURCE_LOCATION.NT]: 12.4,
  },

  /**
   * @description Milk intake of cows, in kg / day
   * @inventory2018 5.B.5
   * @units kg / day
   */
  MILK_INTAKE: {
    NORTHOFTROPIC: {
      CALVING_SEASON: 4,
      SEASON_AFTER_CALVING: 3,
    },
    SOUTHOFTROPIC: {
      CALVING_SEASON: 6,
      SEASON_AFTER_CALVING: 4,
    },
  },

  /**
   * @description Feed adjustment factor for cows
   * @inventory2018 5.B.5
   */
  FEED_ADJUSTMENT: {
    CALVING_SEASON: 1.3,
    SEASON_AFTER_CALVING: 1.1,
  },
};

export const savannaConstants: SavannaConstants = {
  /**
   * @description Static lookup for savannah coarse fuel, by region
   */
  FUELCOARSE: {
    'Combined Ref': {
      Qld1: '71',
      Qld2: '72',
      Qld3: '73',
      Qld4: '74',
      Qld5: '75',
      Qld6: '76',
      Qld7: '77',
      Qld8: '78',
      Qld9: '79',
      Qld10: '710',
      NT1: '81',
      NT2: '82',
      NT3: '83',
      NT4: '84',
      NT5: '85',
      NT6: '86',
      NT7: '87',
      NT8: '88',
      NT9: '89',
      NT10: '810',
      Kimberley1: '91',
      Kimberley2: '92',
      Kimberley3: '93',
      Kimberley4: '94',
      Kimberley5: '95',
      Kimberley6: '96',
      Kimberley7: '97',
      Kimberley8: '98',
      Kimberley9: '99',
      Kimberley10: '910',
      Pilbara1: '101',
      Pilbara2: '102',
      Pilbara3: '103',
      Pilbara4: '104',
      Pilbara5: '105',
      Pilbara6: '106',
      Pilbara7: '107',
      Pilbara8: '108',
      Pilbara9: '109',
      Pilbara10: '1010',
    },
    Yo: {
      Qld1: 5.97818,
      Qld2: 5.4075,
      Qld3: 4.96198,
      Qld4: 4.96198,
      Qld5: 5.21557,
      Qld6: 8.55158,
      Qld7: 8.14308,
      Qld8: 7.97898,
      Qld9: 7.8505,
      Qld10: 7.48462,
      NT1: 5.97818,
      NT2: 5.4075,
      NT3: 4.96198,
      NT4: 4.96198,
      NT5: 5.21557,
      NT6: 8.55158,
      NT7: 8.14308,
      NT8: 7.97898,
      NT9: 7.8505,
      NT10: 7.48462,
      Kimberley1: 5.97818,
      Kimberley2: 5.4075,
      Kimberley3: 4.96198,
      Kimberley4: 4.96198,
      Kimberley5: 5.21557,
      Kimberley6: 8.55158,
      Kimberley7: 8.14308,
      Kimberley8: 7.97898,
      Kimberley9: 7.8505,
      Kimberley10: 7.48462,
      Pilbara1: 5.97818,
      Pilbara2: 5.4075,
      Pilbara3: 4.96198,
      Pilbara4: 4.96198,
      Pilbara5: 5.21557,
      Pilbara6: 8.55158,
      Pilbara7: 8.14308,
      Pilbara8: 7.97898,
      Pilbara9: 7.8505,
      Pilbara10: 7.48462,
    },
    L: {
      Qld1: 0.05888,
      Qld2: 0.24606,
      Qld3: 0.18948,
      Qld4: 0.18948,
      Qld5: 0.21756,
      Qld6: 0.0722,
      Qld7: 0.22387,
      Qld8: 0.12031,
      Qld9: 0.12056,
      Qld10: 0.2044,
      NT1: 0.05888,
      NT2: 0.24606,
      NT3: 0.18948,
      NT4: 0.18948,
      NT5: 0.21756,
      NT6: 0.0722,
      NT7: 0.22387,
      NT8: 0.12031,
      NT9: 0.12056,
      NT10: 0.2044,
      Kimberley1: 0.05888,
      Kimberley2: 0.24606,
      Kimberley3: 0.18948,
      Kimberley4: 0.18948,
      Kimberley5: 0.21756,
      Kimberley6: 0.0722,
      Kimberley7: 0.22387,
      Kimberley8: 0.12031,
      Kimberley9: 0.12056,
      Kimberley10: 0.2044,
      Pilbara1: 0.05888,
      Pilbara2: 0.24606,
      Pilbara3: 0.18948,
      Pilbara4: 0.18948,
      Pilbara5: 0.21756,
      Pilbara6: 0.0722,
      Pilbara7: 0.22387,
      Pilbara8: 0.12031,
      Pilbara9: 0.12056,
      Pilbara10: 0.2044,
    },
    D: {
      Qld1: 0.072,
      Qld2: 0.072,
      Qld3: 0.072,
      Qld4: 0.072,
      Qld5: 0.072,
      Qld6: 0.072,
      Qld7: 0.072,
      Qld8: 0.072,
      Qld9: 0.072,
      Qld10: 0.072,
      NT1: 0.072,
      NT2: 0.072,
      NT3: 0.072,
      NT4: 0.072,
      NT5: 0.072,
      NT6: 0.072,
      NT7: 0.072,
      NT8: 0.072,
      NT9: 0.072,
      NT10: 0.072,
      Kimberley1: 0.072,
      Kimberley2: 0.072,
      Kimberley3: 0.072,
      Kimberley4: 0.072,
      Kimberley5: 0.072,
      Kimberley6: 0.072,
      Kimberley7: 0.072,
      Kimberley8: 0.072,
      Kimberley9: 0.072,
      Kimberley10: 0.072,
      Pilbara1: 0.072,
      Pilbara2: 0.072,
      Pilbara3: 0.072,
      Pilbara4: 0.072,
      Pilbara5: 0.072,
      Pilbara6: 0.072,
      Pilbara7: 0.072,
      Pilbara8: 0.072,
      Pilbara9: 0.072,
      Pilbara10: 0.072,
    },
  },

  /**
   * @description Static lookup for savannah fine fuel, by region
   */
  FUELFINE: {
    'Combined Ref': {
      Qld1: '71',
      Qld2: '72',
      Qld3: '73',
      Qld4: '74',
      Qld5: '75',
      Qld6: '76',
      Qld7: '77',
      Qld8: '78',
      Qld9: '79',
      Qld10: '710',
      NT1: '81',
      NT2: '82',
      NT3: '83',
      NT4: '84',
      NT5: '85',
      NT6: '86',
      NT7: '87',
      NT8: '88',
      NT9: '89',
      NT10: '810',
      Kimberley1: '91',
      Kimberley2: '92',
      Kimberley3: '93',
      Kimberley4: '94',
      Kimberley5: '95',
      Kimberley6: '96',
      Kimberley7: '97',
      Kimberley8: '98',
      Kimberley9: '99',
      Kimberley10: '910',
      Pilbara1: '101',
      Pilbara2: '102',
      Pilbara3: '103',
      Pilbara4: '104',
      Pilbara5: '105',
      Pilbara6: '106',
      Pilbara7: '107',
      Pilbara8: '108',
      Pilbara9: '109',
      Pilbara10: '1010',
    },
    Yo: {
      Qld1: 0.40885,
      Qld2: 0.37206,
      Qld3: 0.37352,
      Qld4: 0.37352,
      Qld5: 0.34846,
      Qld6: 0.26884,
      Qld7: 0.25533,
      Qld8: 0.25396,
      Qld9: 0.24826,
      Qld10: 0.25508,
      NT1: 0.40885,
      NT2: 0.37206,
      NT3: 0.37352,
      NT4: 0.37352,
      NT5: 0.34846,
      NT6: 0.26884,
      NT7: 0.25533,
      NT8: 0.25396,
      NT9: 0.24826,
      NT10: 0.25508,
      Kimberley1: 0.40885,
      Kimberley2: 0.37206,
      Kimberley3: 0.37352,
      Kimberley4: 0.37352,
      Kimberley5: 0.34846,
      Kimberley6: 0.26884,
      Kimberley7: 0.25533,
      Kimberley8: 0.25396,
      Kimberley9: 0.24826,
      Kimberley10: 0.25508,
      Pilbara1: 0.40885,
      Pilbara2: 0.37206,
      Pilbara3: 0.37352,
      Pilbara4: 0.37352,
      Pilbara5: 0.34846,
      Pilbara6: 0.26884,
      Pilbara7: 0.25533,
      Pilbara8: 0.25396,
      Pilbara9: 0.24826,
      Pilbara10: 0.25508,
    },
    L: {
      Qld1: 5.2189,
      Qld2: 3.85447,
      Qld3: 3.46804,
      Qld4: 4.2354,
      Qld5: 4.94919,
      Qld6: 2.67616,
      Qld7: 2.55178,
      Qld8: 2.34277,
      Qld9: 2.45375,
      Qld10: 2.43343,
      NT1: 4.02581,
      NT2: 3.96032,
      NT3: 2.7036,
      NT4: 3.99075,
      NT5: 4.25842,
      NT6: 2.35541,
      NT7: 2.70701,
      NT8: 2.47525,
      NT9: 2.61767,
      NT10: 2.9654,
      Kimberley1: 3.9053,
      Kimberley2: 3.83521,
      Kimberley3: 2.4142,
      Kimberley4: 3.6844,
      Kimberley5: 3.99772,
      Kimberley6: 2.46568,
      Kimberley7: 2.72722,
      Kimberley8: 2.5792,
      Kimberley9: 2.89562,
      Kimberley10: 2.9491,
      Pilbara1: 3.9053,
      Pilbara2: 3.83521,
      Pilbara3: 2.4142,
      Pilbara4: 3.6844,
      Pilbara5: 3.99772,
      Pilbara6: 2.46568,
      Pilbara7: 2.72722,
      Pilbara8: 2.5792,
      Pilbara9: 2.89562,
      Pilbara10: 2.9491,
    },
    D: {
      Qld1: 0.8,
      Qld2: 0.8,
      Qld3: 0.8,
      Qld4: 0.8,
      Qld5: 0.8,
      Qld6: 0.8,
      Qld7: 0.8,
      Qld8: 0.8,
      Qld9: 0.8,
      Qld10: 0.8,
      NT1: 0.8,
      NT2: 0.8,
      NT3: 0.8,
      NT4: 0.8,
      NT5: 0.8,
      NT6: 0.8,
      NT7: 0.8,
      NT8: 0.8,
      NT9: 0.8,
      NT10: 0.8,
      Kimberley1: 0.8,
      Kimberley2: 0.8,
      Kimberley3: 0.8,
      Kimberley4: 0.8,
      Kimberley5: 0.8,
      Kimberley6: 0.8,
      Kimberley7: 0.8,
      Kimberley8: 0.8,
      Kimberley9: 0.8,
      Kimberley10: 0.8,
      Pilbara1: 0.8,
      Pilbara2: 0.8,
      Pilbara3: 0.8,
      Pilbara4: 0.8,
      Pilbara5: 0.8,
      Pilbara6: 0.8,
      Pilbara7: 0.8,
      Pilbara8: 0.8,
      Pilbara9: 0.8,
      Pilbara10: 0.8,
    },
    Gc: {
      Qld1: 1.33,
      Qld2: 1.2,
      Qld3: 1.33,
      Qld4: 1.15,
      Qld5: 1.25,
      Qld6: 1.4,
      Qld7: 1.7,
      Qld8: 1.4,
      Qld9: 1,
      Qld10: 1.8,
      NT1: 1.33,
      NT2: 1.2,
      NT3: 1.33,
      NT4: 1.15,
      NT5: 1.25,
      NT6: 1.4,
      NT7: 1.7,
      NT8: 1.4,
      NT9: 1,
      NT10: 1.8,
      Kimberley1: 1.33,
      Kimberley2: 1.2,
      Kimberley3: 1.33,
      Kimberley4: 1.15,
      Kimberley5: 1.25,
      Kimberley6: 1.4,
      Kimberley7: 1.7,
      Kimberley8: 1.4,
      Kimberley9: 1,
      Kimberley10: 1.8,
      Pilbara1: 1.33,
      Pilbara2: 1.2,
      Pilbara3: 1.33,
      Pilbara4: 1.15,
      Pilbara5: 1.25,
      Pilbara6: 1.4,
      Pilbara7: 1.7,
      Pilbara8: 1.4,
      Pilbara9: 1,
      Pilbara10: 1.8,
    },
  },

  /**
   * @description State lookup values for using other savannah lookup constants
   */
  FUEL_STATEREF: {
    wa_nw: 0,
    act: 1,
    nsw: 2,
    tas: 3,
    wa_sw: 4,
    sa: 5,
    vic: 6,
    qld: 7,
    nt: 8,
    kimberley: 9,
    pilbara: 10,
  },

  /**
   * @description Patchiness values for savannah burning by season
   * @type Proportion
   */
  BURN_PATCHINESS: {
    'early dry season': { high: 0.709, low: 0.79 },
    'late dry season': { high: 0.889, low: 0.97 },
  },

  /**
   * @description Completeness of combustion values for savannah burning by fuel and season
   * @type Proportion
   */
  BURN_COMPLETENESSOFCOMBUSTION: {
    low: {
      fine: { 'early dry season': 0.7992, 'late dry season': 0.8328 },
      coarse: { 'early dry season': 0.109, 'late dry season': 0.2016 },
    },
    high: {
      fine: { 'early dry season': 0.7444, 'late dry season': 0.8604 },
      coarse: { 'early dry season': 0.1464, 'late dry season': 0.3571 },
    },
  },

  /**
   * @description Carbon Mass Fraction Burnt in Fuel Burnt
   * @units Proportion
   */
  FUELBURNT_VEGETATION_CARBONFRACTION: {
    fine: {
      'Shrubland hummock': 0.46,
      'Woodland Hummock': 0.46,
      'Melaleuca woodland': 0.46,
      'Woodland Mixed': 0.46,
      'Open forest mixed': 0.46,
      'Shrubland (heath) with hummock grass': 0.398,
      'Woodland with hummock grass': 0.397,
      'Open woodland with mixed grass': 0.399,
      'Woodland with mixed grass': 0.41,
      'Woodland with tussock grass': 0.397,
    },
    coarse: {
      'Shrubland hummock': 0.46,
      'Woodland Hummock': 0.46,
      'Melaleuca woodland': 0.46,
      'Woodland Mixed': 0.46,
      'Open forest mixed': 0.46,
      'Shrubland (heath) with hummock grass': 0.482,
      'Woodland with hummock grass': 0.482,
      'Open woodland with mixed grass': 0.482,
      'Woodland with mixed grass': 0.482,
      'Woodland with tussock grass': 0.482,
    },
  },

  /**
   * @description Methane emissions factor for savannah burning
   * @units Gg CH$-C / Gg C
   */
  FUELBURNT_VEGETATION_EF_CH4: {
    fine: {
      'Shrubland hummock': 0.0031,
      'Woodland Hummock': 0.0015,
      'Melaleuca woodland': 0.0031,
      'Woodland Mixed': 0.0031,
      'Open forest mixed': 0.0031,
      'Shrubland (heath) with hummock grass': 0.0013,
      'Woodland with hummock grass': 0.0017,
      'Open woodland with mixed grass': 0.0012,
      'Woodland with mixed grass': 0.0016,
      'Woodland with tussock grass': 0.0015,
    },
    coarse: {
      'Shrubland hummock': 0.0031,
      'Woodland Hummock': 0.0015,
      'Melaleuca woodland': 0.0031,
      'Woodland Mixed': 0.0031,
      'Open forest mixed': 0.0031,
      'Shrubland (heath) with hummock grass': 0.0013,
      'Woodland with hummock grass': 0.0017,
      'Open woodland with mixed grass': 0.0012,
      'Woodland with mixed grass': 0.0016,
      'Woodland with tussock grass': 0.0015,
    },
  },

  /**
   * @description Nitrogen to Carbon ratio in fuel burnt
   */
  FUELBURNT_VEGETATION_NITROGENCARBONRATIO: {
    fine: {
      'Shrubland hummock': 0.0096,
      'Woodland Hummock': 0.0096,
      'Melaleuca woodland': 0.0096,
      'Woodland Mixed': 0.0096,
      'Open forest mixed': 0.0096,
      'Shrubland (heath) with hummock grass': 0.0107,
      'Woodland with hummock grass': 0.0118,
      'Open woodland with mixed grass': 0.0102,
      'Woodland with mixed grass': 0.0105,
      'Woodland with tussock grass': 0.0113,
    },
    coarse: {
      'Shrubland hummock': 0.0081,
      'Woodland Hummock': 0.0081,
      'Melaleuca woodland': 0.0081,
      'Woodland Mixed': 0.0081,
      'Open forest mixed': 0.0081,
      'Shrubland (heath) with hummock grass': 0.00389,
      'Woodland with hummock grass': 0.00389,
      'Open woodland with mixed grass': 0.00389,
      'Woodland with mixed grass': 0.00389,
      'Woodland with tussock grass': 0.00389,
    },
  },

  /**
   * @description N2O emissions factor for savannah burning
   * @units Gg N2O-N/Gg N
   */
  FUELBURNT_VEGETATION_N2O: {
    fine: {
      'Shrubland hummock': 0.0075,
      'Woodland Hummock': 0.0066,
      'Melaleuca woodland': 0.0075,
      'Woodland Mixed': 0.0075,
      'Open forest mixed': 0.0075,
      'Shrubland (heath) with hummock grass': 0.0059,
      'Woodland with hummock grass': 0.006,
      'Open woodland with mixed grass': 0.006,
      'Woodland with mixed grass': 0.012,
      'Woodland with tussock grass': 0.006,
    },
    coarse: {
      'Shrubland hummock': 0.0075,
      'Woodland Hummock': 0.0066,
      'Melaleuca woodland': 0.0075,
      'Woodland Mixed': 0.0075,
      'Open forest mixed': 0.0075,
      'Shrubland (heath) with hummock grass': 0.0059,
      'Woodland with hummock grass': 0.006,
      'Open woodland with mixed grass': 0.006,
      'Woodland with mixed grass': 0.012,
      'Woodland with tussock grass': 0.006,
    },
  },
};

export const feedlotConstants: FeedlotConstants = {
  /**
   * @description Leaching and runoff mass for feedlot
   * @inventory2022 3.D.A_3
   */
  MN_LEACH: 0,

  /**
   * @description mass of urinary N excretion on pasture
   * @inventory2022 3.D.B_2
   */
  UN_SOIL: 0,

  /**
   * @description mass of faecal N excretion on pasture
   * @inventory2022 3.D.B_2
   */
  FN_SOIL: 0,

  /**
   * @description FracGASM value for feedlot
   * @inventory2022 3.D.B_2
   */
  AG_SOILS: 0.21,

  /**
   * @description Emissions factor for amount of N deposited on pasture, weighted average calculated from IPCC 2019
   * @inventory2022 3.D.A_4
   */
  ANNUAL_N2O_EF: 0.00503,

  /**
   * @description integrated N2O emission factor for each feedlot class and state
   * @inventory2022 3.B.1c_7
   */
  I_NOF: 0.01942,

  /**
   * @description integrated fraction of N volatilised from feedlot cattle
   * @inventory2022 3.B.5c_1
   */
  I_FRACGASM: 0.71116,

  /**
   * @description Inorganic fertiliser EF for non-irrigated cropping
   * @inventory2022 3.B.5c_2
   */
  INDIRECT_EF: 0.0041,

  /**
   * @description Ash content expressed as a fraction of manure
   * @inventory2022 3.B.1 c_1
   */
  ASH_CONTENT: 0.16,

  /**
   * @description Methane emissions potential for feedlot
   * @inventory2022 3.B.1 c_1
   * @units m3 CH4/kg
   */
  EMISSION_POTENTIAL: 0.19,

  /**
   * @description Manure emission factors for each feedlot manure processing system
   * @inventory2022 Table A5.5.3.6, A5.5.3.7
   */
  MANURE_EF: {
    Drylot: {
      EF: 0.0054,
      FracGASM: 0.6,
    },
    'Solid Storage': {
      EF: 0.005,
      FracGASM: 0.25,
    },
    Composting: {
      EF: 0.01,
      FracGASM: 0.4,
    },
    'Uncovered anaerobic lagoon': {
      EF: 0,
      FracGASM: 0.35,
    },
  },

  /**
   * @description Integrated EF for feedlot by state
   * @inventory2022 A5.5.3.3
   */
  INTEGRATED_EF: {
    act: 0.0323,
    nsw: 0.0323,
    tas: 0,
    wa_sw: 0.0327,
    sa: 0.0323,
    vic: 0.0323,
    qld: 0.04023,
    nt: 0,
    wa_nw: 0,
  },

  /**
   * @description Emissions factors for purchased live stock, in kg CO2-e/kg liveweight
   * @reference Wiedemann et al. (2015b)
   * @units kg CO2-e/kg
   */
  PURCHASELIVESTOCK_EF: {
    NT: 12.4,
    'nth QLD': 12.4,
    'sth/central QLD': 12.4,
    'nth NSW': 11.7,
    'sth NSW/VIC/sth SA': 11.7,
    'NSW/SA pastoral zone': 12.4,
    'sw WA': 11.7,
    'WA pastoral': 12.4,
    TAS: 11.7,
  },
};

export const porkConstants: PorkConstants = {
  /**
   * @description Methane emission potential for pork, in m3 CH4/kg
   * @inventory2018 Appendix 5.E.4
   * @units m3 CH4/kg
   */
  METHANE_EMISSION_POTENTIAL: 0.45,

  /**
   * @description Emission factor for bedding for pork, in kg CO2-e/kg
   * @reference (Christie et al., 2012)
   * @units kg CO2-e/kg
   */
  EF_BEDDING: 0.225,

  /**
   * @description Nitrogen content of swine manure, by class
   * @inventory2022 Table A5.5.5.4
   * @units kg N/head/year
   */
  MANURE_NITROGEN: {
    boars: 16.93,
    sows: 17.91,
    gilts: 16.7,
    slaughter_pigs: 11.4,
  },

  /**
   * @description Volatile solids content of swine manure, by class
   * @inventory2022 Table A5.5.5.4
   * @units kg / head / day
   */
  MANURE_CHARACTERISTICS: {
    boars: 0.4,
    sows: 0.46,
    gilts: 0.55,
    slaughter_pigs: 0.39,
  },

  /**
   * @description Feed intake of swine, by class
   * @inventory2022 Table A5.5.5.2
   * @units kg / head / day
   */
  HERD_FEEDINTAKE: {
    boars: 2.3,
    sows: 2.62,
    gilts: 2.5,
    slaughter_pigs: 1.71,
  },

  /**
   * @description Integrated emissions factors for swine, by state
   * @inventory2022 Table A5.5.5.5
   */
  INTEGRATED_EF: {
    [STATES.ACT]: {
      iMCF: 0,
      iFracGasm: 0,
      iNOF: 0,
    },
    [STATES.NSW]: {
      iMCF: 0.44174,
      iFracGasm: 0.45946,
      iNOF: 0.00517,
    },
    [STATES.TAS]: {
      iMCF: 0.5243,
      iFracGasm: 0.4786,
      iNOF: 0.00343,
    },
    [STATES.WA_SW]: {
      iMCF: 0.52871,
      iFracGasm: 0.46465,
      iNOF: 0.00498,
    },
    [STATES.SA]: {
      iMCF: 0.5608,
      iFracGasm: 0.4786,
      iNOF: 0.00343,
    },
    [STATES.VIC]: {
      iMCF: 0.45067,
      iFracGasm: 0.45279,
      iNOF: 0.00533,
    },
    [STATES.QLD]: {
      iMCF: 0.6199,
      iFracGasm: 0.50371,
      iNOF: 0.00243,
    },
    [STATES.WA_NW]: {
      iMCF: 0.52871,
      iFracGasm: 0.46465,
      iNOF: 0.00498,
    },
    [STATES.NT]: {
      iMCF: 0.64598,
      iFracGasm: 0.50406,
      iNOF: 0.00225,
    },
  },

  /**
   * @description Fraction of animal waste available for leaching and runoff (FracWET)
   * @inventory2022 Table A5.5.10.2
   * @type Proportion
   */
  FRACWET: {
    [STATES.ACT]: 0.5,
    [STATES.NSW]: 0.5,
    [STATES.TAS]: 1,
    [STATES.WA_SW]: 0.4,
    [STATES.SA]: 0.75,
    [STATES.VIC]: 0.5,
    [STATES.QLD]: 0.25,
    [STATES.WA_NW]: 0.4,
    [STATES.NT]: 0,
  },

  /**
   * @description Allocation of waste to MMS
   * @inventory2022 Table A5.5.5.6
   * @type Proportion
   */
  WASTE_MMS: {
    [STATES.ACT]: 0.5,
    [STATES.NSW]: 0.06,
    [STATES.TAS]: 0.02,
    [STATES.WA_SW]: 0.1,
    [STATES.SA]: 0.02,
    [STATES.VIC]: 0.06,
    [STATES.QLD]: 0.03,
    [STATES.WA_NW]: 0.1,
    [STATES.NT]: 0.02,
  },

  /**
   * @description Emissions factors for swine feed ingredients, by ingredient
   * @reference (Wiedemann et al., 2021), (Reckmann et al., 2016)
   * @units kg CO2-e / kg ingredient
   */
  FEED_INGREDIENT_EF: {
    wheat: 0.252,
    barley: 0.341,
    wheyPowder: 0,
    canolaMeal: 0.284,
    soybeanMeal: 0.633,
    meatMeal: 0.386,
    bloodMeal: 1.9,
    fishmeal: 0,
    tallow: 0,
    wheatBran: 0.547,
    beetPulp: 0.704,
    millMix: 0,
  },

  /**
   * @description Methane Conversion Factors (MCF) and Nitrous Oxide Fractions (NOF) for manure management systems
   */
  MMS: {
    deepLitter: {
      MCF: 0.04,
      FracGASM: 0.125,
      NOF: 0.01,
    },
    coveredAnaerobicPond: {
      MCF: 0.1,
      FracGASM: 0,
      NOF: 0,
    },
    outdoorSystems: {
      MCF: 0.01,
      FracGASM: 0.3,
      NOF: 0.02,
    },
    uncoveredAnaerobicPond: {
      MCF: 0.75,
      FracGASM: 0.55,
      NOF: 0,
    },
  },
};

export const poultryConstants: PoultryConstants = {
  /**
   * @description Diet properties for poultry, by class
   * @inventory2022 Table A5.5.6.1
   */
  DIET_PROPERTIES: {
    layers: {
      dryMatterIntake: 0.086,
      dryMatterDigestibility: 0.8,
      crudeProtein: 0.19,
      nitrogenRetentionRate: 0.35,
      manureAsh: 0.18,
    },
    meat_chicken_growers: {
      dryMatterIntake: 0.093,
      dryMatterDigestibility: 0.8,
      crudeProtein: 0.23,
      nitrogenRetentionRate: 0.47,
      manureAsh: 0.15,
    },
    meat_chicken_layers: {
      dryMatterIntake: 0.103,
      dryMatterDigestibility: 0.8,
      crudeProtein: 0.19,
      nitrogenRetentionRate: 0.32,
      manureAsh: 0.18,
    },
    meat_other: {
      dryMatterIntake: 0.093,
      dryMatterDigestibility: 0.8,
      crudeProtein: 0.23,
      nitrogenRetentionRate: 0.47,
      manureAsh: 0.15,
    },
  },

  /**
   * @description MCFs Pasture range and paddock
   * @inventory2022 Table A5.5.6.5
   * @type Proportion
   */
  WASTE_MMS: {
    [STATES.ACT]: 0.01,
    [STATES.NSW]: 0.01,
    [STATES.NT]: 0.03,
    [STATES.QLD]: 0.03,
    [STATES.SA]: 0.01,
    [STATES.TAS]: 0.01,
    [STATES.VIC]: 0.01,
    [STATES.WA_SW]: 0.01,
    [STATES.WA_NW]: 0.01,
  },

  /**
   * @description Meat and layer chickens – Integrated MCFs, by state
   */
  MEATLAYER_EF_IMCF: {
    meat_chickens: {
      [STATES.ACT]: 0.024414,
      [STATES.NSW]: 0.024414,
      [STATES.NT]: 0.025014,
      [STATES.QLD]: 0.025014,
      [STATES.SA]: 0.024414,
      [STATES.TAS]: 0.23425,
      [STATES.VIC]: 0.024414,
      [STATES.WA_SW]: 0.024414,
      [STATES.WA_NW]: 0.024414,
    },
    layer_chickens: {
      [STATES.ACT]: 0.031702,
      [STATES.NSW]: 0.031702,
      [STATES.NT]: 0.03193,
      [STATES.QLD]: 0.03193,
      [STATES.SA]: 0.031702,
      [STATES.TAS]: 0.031011,
      [STATES.VIC]: 0.031702,
      [STATES.WA_SW]: 0.031702,
      [STATES.WA_NW]: 0.031702,
    },
  },

  /**
   * @description Meat and layer chickens – Integrated EFs, by state
   */
  MEATLAYER_EF: {
    meat_chickens: {
      iFracGASM: 0.385924,
      iNOF: 0.004157,
    },
    layer_chickens: {
      iFracGASM: 0.315956,
      iNOF: 0.004728,
    },
  },

  /**
   * @description Emissions factors for poultry feed ingredients, by ingredient
   * @reference (Christie et al., 2012), (Maraseni & Cockfield, 2011), (Castanheira & Freire, 2013), (O'Halloran et al., 2008)
   * @units kg CO2-e / kg ingredient
   */
  FEED_INGREDIENTS_GHG: {
    wheat: 0.3,
    barley: 0.11,
    soybean: 0.165,
    sorghum: 0.3,
    millrun: 0.3,
  },
};

export const dairyConstants: DairyConstants = {
  /**
   * @description Dairy cattle - Nitrous oxide EFs and fraction of N volatilised by manure management system
   * @inventory2022 Table A5.5.1.9
   */
  MANURE_MANAGEMENT: {
    PASTURE_EF: 0,
    ANAEROBIC_EF: 0,
    SUMP_EF: 0,
    DRAIN_EF: 0,
    SOLID_EF: 0.005,
    PASTURE_FRACGASM: 0,
    ANAEROBIC_FRACGASM: 0.35,
    SUMP_FRACGASM: 0.07,
    DRAIN_FRACGASM: 0.2,
    SOLID_FRACGASM: 0.3,
  },

  /**
   * @description Standard reference weights for dairy cattle, by class
   * @inventory2022 Table A5.5.1.3
   * @units kg
   */
  CATTLE_STANDARD_REFERENCE_WEIGHTS: {
    milking_cows: 580.7142857143,
    heifers_lt_1: 580.7142857143,
    heifers_gt_1: 580.7142857143,
    dairyBulls_lt_1: 770,
    dairyBulls_gt_1: 770,
  },

  /**
   * @description N2O oxide emission factors and fraction of N volatilised by manure management system
   * @inventory2022 Table A5.5.1.9
   */
  CATTLE_N2O_MMS: {
    void_at_pasture: { EF: 0, FracGASM: 0 },
    anaerobic_lagoon: { EF: 0, FracGASM: 0.35 },
    daily_spread: { EF: 0, FracGASM: 0.2 },
    solid_storage: { EF: 0.005, FracGASM: 0.3 },
  },

  /**
   * @description Mass of N volatilised from manure management system
   * @inventory2022 Table 3.D.A_6
   * @units Gg N2O-N / Gg N
   */
  MASS_N_VOLATISED_EF: 0.004,

  /**
   * @description Mass of N volatilised from manure applied to soils
   * @inventory2022 Table 3.D.A_4
   * @units Gg N2O-N / Gg N
   */
  MMS_EF: 0.00503,

  /**
   * @description Methane production from pre weaned calves, by class
   * @inventory2022 Table A5.5.1.5
   * @units Gg CH4-C / Gg N
   */
  METHANE_MPW: {
    milking_cows: 0,
    heifers_lt_1: 0.01825,
    heifers_gt_1: 0,
    dairyBulls_lt_1: 0.02081,
    dairyBulls_gt_1: 0,
  },

  /**
   * @description Nitrous oxide EFs for inorganic fertiliser, based on rainfall and crop type
   * @inventory2022 Table 5.21
   * @units Gg N2O-N / Gg N
   */
  PRODUCTIONSYSTEM_EF: {
    RAINFALL_LT_600: {
      'Non-irrigated Crop': 0.0029,
      'Irrigated Crop': 0.007,
      'Irrigated Pasture': 0.0059,
      'Non-irrigated Pasture': 0.0018,
    },
    RAINFALL_GT_600: {
      'Non-irrigated Crop': 0.008,
      'Irrigated Crop': 0.007,
      'Irrigated Pasture': 0.0059,
      'Non-irrigated Pasture': 0.0018,
    },
  },

  /**
   * @description Dairy Cattle - Methane Conversion Factors (MCF)
   * @inventory2022 Table 5.A.7
   */
  METHANE_CONVERSION_FACTOR: {
    [STATES.ACT]: {
      Pasture: 0.01,
      'Anaerobic lagoon': 0.73,
      'Sump and dispersal systems': 0.005,
      'Drains to paddock': 0.15,
      'Solid Storage': 0.02,
    },
    [STATES.NSW]: {
      Pasture: 0.01,
      'Anaerobic lagoon': 0.75,
      'Sump and dispersal systems': 0.005,
      'Drains to paddock': 0.18,
      'Solid Storage': 0.02,
    },
    [STATES.NT]: {
      Pasture: 0.02,
      'Anaerobic lagoon': 0.8,
      'Sump and dispersal systems': 0.01,
      'Drains to paddock': 0.5,
      'Solid Storage': 0.02,
    },
    [STATES.QLD]: {
      Pasture: 0.01,
      'Anaerobic lagoon': 0.77,
      'Sump and dispersal systems': 0.005,
      'Drains to paddock': 0.24,
      'Solid Storage': 0.02,
    },
    [STATES.SA]: {
      Pasture: 0.01,
      'Anaerobic lagoon': 0.74,
      'Sump and dispersal systems': 0.005,
      'Drains to paddock': 0.17,
      'Solid Storage': 0.02,
    },
    [STATES.TAS]: {
      Pasture: 0.01,
      'Anaerobic lagoon': 0.7,
      'Sump and dispersal systems': 0.001,
      'Drains to paddock': 0.13,
      'Solid Storage': 0.02,
    },
    [STATES.VIC]: {
      Pasture: 0.01,
      'Anaerobic lagoon': 0.74,
      'Sump and dispersal systems': 0.005,
      'Drains to paddock': 0.17,
      'Solid Storage': 0.02,
    },
    [STATES.WA_SW]: {
      Pasture: 0.01,
      'Anaerobic lagoon': 0.75,
      'Sump and dispersal systems': 0.005,
      'Drains to paddock': 0.18,
      'Solid Storage': 0.02,
    },
    [STATES.WA_NW]: {
      Pasture: 0.02,
      'Anaerobic lagoon': 0.8,
      'Sump and dispersal systems': 0.01,
      'Drains to paddock': 0.5,
      'Solid Storage': 0.02,
    },
  },

  /**
   * @description Ash content as a proportion of faecal DM
   * @inventory2018 3B.1a_1
   * @type Proportion
   */
  ASH_CONTENT: 0.08,
};

export const goatConstants: GoatConstants = {
  /**
   * @description Enteric fermentation emission factor for goat, in kg CH4/head/year
   * @reference IPCC (2006)
   * @units kg CH4/head/year
   */
  EF: 5,

  /**
   * @description Manure production for goat, in kg DM/head/year
   * @reference Expert working group assumption - equivalent to one sheep
   * @units kg DM/head/year
   */
  MANUREPRODUCTION: 114,
};

export const buffaloConstants: BuffaloConstants = {
  /**
   * @description Nitrogen excreted for buffalo, in kg N/head/year
   * @reference Expert working group assumption - equivalent to beef cattle - pasture
   * @units kg N/head/year
   */
  NITROGEN_EXCRETED_FACTOR: 39.5,

  /**
   * @description Faecal nitrogen proportion for buffalo, as a proportion of total nitrogen excreted
   * @type Proportion
   */
  FAECALN_PMF: 0.29,

  /**
   * @description Seasonal urinary nitrogen proportion for buffalo, as a proportion of total nitrogen excreted
   * @inventory2018 3B.4_5
   * @type Proportion
   */
  SEASONALURINE_PMU: 0.71,

  /**
   * @description Manure production for buffalo, in kg DM/head/year
   * @reference Expert working group assumption - equivalent to beef cattle - pasture
   * @units kg DM/head/year
   */
  MANUREPRODUCTION: 957,

  /**
   * @description Enteric fermentation emission factor for buffalo, in kg CH4/head/year
   * @reference IPCC (2006)
   * @units kg CH4/head/year
   */
  ENTERIC_EF: 76,
};

export const deerConstants: DeerConstants = {
  /**
   * @description Manure production for deer, in kg DM/head/year
   * @reference Expert working group assumption - equivalent to one sheep
   * @units kg DM/head/year
   */
  MANUREPRODUCTION: 319,

  /**
   * @description Enteric fermentation emission factor for deer, in kg CH4/head/year
   * @reference IPCC (2006)
   * @units kg CH4/head/year
   */
  ENTERIC_EF: 20,

  /**
   * @description Nitrogen excreted for deer, in kg N/head/year
   * @reference Expert working group assumption - equivalent to one sheep
   * @units kg N/head/year
   */
  NITROGEN_EXCRETED_FACTOR: 13.2,

  /**
   * @description Faecal nitrogen proportion for deer, as a proportion
   * @type Proportion
   */
  FAECALN_PMF: 0.29,
};

export const fisheriesConstants: FisheriesConstants = {
  /**
   * @description Coefficients for Rural fuel consumption model (litres per 1 Km)
   * @inventory2022 Table 56
   * @units litres / Km
   */
  TRANSPORT_FUEL_USAGE: {
    None: 0,
    'Small Car': 0.06419556,
    'Medium Car': 0.07771756,
    'Large Car': 0.09826507,
    'Courier Van-Utility': 0.07609467,
    '4WD Mid Size': 0.1024522,
    'Light Rigid': 0.08085994,
    'Medium Rigid': 0.1245859,
    'Heavy Rigid': 0.2322869,
    'Heavy Bus': 0.2333246,
  },

  /**
   * @description Direct (Scope 1) and indirect (Scope 3) emissions factors for the consumptions of transport fuels in different transport equipment
   * @inventory2022 Table 9
   * @units kg CO2-e / GJ
   */
  TRANSPORT_FUEL_EF: {
    Gasoline: { CO2: 67.4, CH4: 0.02, N2O: 0.2, SCOPE3: 17.2 },
    'Diesel oil': { CO2: 69.9, CH4: 0.01, N2O: 0.5, SCOPE3: 17.3 },
    'Liquefied petroleum gas (LPG)': {
      CO2: 60.2,
      CH4: 0.5,
      N2O: 0.3,
      SCOPE3: 20.2,
    },
    'Fuel oil': { CO2: 73.6, CH4: 0.08, N2O: 0.5, SCOPE3: 18 },
    Ethanol: { CO2: 0, CH4: 0.2, N2O: 0.2, SCOPE3: 0 },
    Biodiesel: { CO2: 0, CH4: 0.8, N2O: 1.7, SCOPE3: 0 },
    'Renewable diesel': { CO2: 0, CH4: 0.01, N2O: 0.5, SCOPE3: 0 },
    'Other biofuels': { CO2: 0, CH4: 0.8, N2O: 1.7, SCOPE3: 0 },
    'Liquified natural gas': { CO2: 51.4, CH4: 7.3, N2O: 0.3, SCOPE3: 18 },
  },

  /**
   * @description Emissions factors for bait
   * @reference FRDC - Data extracted/reverse-engineered by Blueshift/Dan from Seafish Calculator (UK/European numbers).
   * @units kg CO2-e / kg bait
   */
  BAIT_EF: {
    'Fish Frames': 0.098,
    'Fish Heads': 0.098,
    Sardines: 0.05,
    Squid: 0.192,
    'Whole Fish': 0.098,
  },
};

export const riceConstants: RiceConstants = {
  /**
   * @description Emissions factor for permanently flooded fields
   * @reference https://www.ipcc-nggip.iges.or.jp/public/2019rf/pdf/4_Volume4/19R_V4_Ch05_Cropland.pdf
   */
  EF_FLOODED_FIELDS: 1.19,

  /**
   * @description Default CH4 emissions scaling factors for water regimes during the cultivation period relative to continuously flooded fields
   * @reference https://www.ipcc-nggip.iges.or.jp/public/2019rf/pdf/4_Volume4/19R_V4_Ch05_Cropland.pdf
   */
  SF_CULTIVATION_WATER_REGIME: {
    'Continuously flooded': 1,
    'Single drainage period': 0.71,
    'Multiple drainage periods': 0.55,
    'Regular rainfed': 0.54,
    'Drought prone': 0.16,
    'Deep water': 0.06,
    'Paddy rotation': 0,
    'Fallow without flooding in previous year': 0,
  },

  /**
   * @description Default CH4 emissions scaling factors for water regimes before the cultivation period
   * @reference https://www.ipcc-nggip.iges.or.jp/public/2019rf/pdf/4_Volume4/19R_V4_Ch05_Cropland.pdf
   */
  SF_PRESEASON_WATER_REGIME: {
    'Non flooded pre-season < 180 days': 1,
    'Non flooded pre-season > 180 days': 0.89,
    'Flooded pre-season > 30 days': 2.41,
    'Non-flooded pre-season > 365 days': 0.59,
  },
};

export const livestockConstants: LivestockConstants = {
  /**
   * @description Energy required to manufacture herbicides and insecticides
   * @reference O'Halloran, N., Fisher, P., Rab, A., & Victoria, D. P. I. (2008). Preliminary estimation of the carbon footprint of the Australian vegetable industry (pp. 1-39). Discussion paper 4. Vegetable Industry Carbon Footprint Scoping Study. 2008, Horticulture Australia Ltd. Table 7
   */
  ENERGY_TO_MANUFACTURE: {
    /** @units MJ/kg */
    HERBICIDE_ENERGY: 550,
    /** @units MJ/kg */
    HERBICIDEGENERAL_ENERGY: 310,
    /** @units MJ/kg */
    INSECTICIDE_ENERGY: 315,
    /** @units kg CO2-e/MJ */
    HERBICIDE_EF: 0.06,
    /** @units kg CO2-e/MJ */
    HERBICIDEGENERAL_EF: 0.06,
    /** @units kg CO2-e/MJ */
    INSECTICIDE_EF: 0.06,
  },

  /**
   * @description Relative amount of CO2, CH4, and N2O emitted by herbicides
   * @type Proportion
   */
  EMISSION_BREAKDOWN: {
    HERBICIDE: { CO2: 1.0, CH4: 0.0, N2O: 0.0 },
  },

  /**
   * @description Emission factors for purchased livestock, in kg CO2-e/kg liveweight
   * @reference Wiedemann et al. (2015b)
   * @units kg CO2-e/kg
   */
  PURCHASED_LIVESTOCK_EF: {
    BUFFALO: 12,
    DEER: 8.1,
    GOAT: 23.8,
    PORK: 3.6,
    POULTRY_CONVENTIONAL: 2,
    POULTRY_FREE_RANGE: 1.8,
  },

  /**
   * @description Emissions factors for each agricultural soil type, in Gg N2O-N/Gg N
   * @inventory2022 Table 5.21
   * @units Gg N2O-N/Gg N
   */
  AGRICULTURAL_SOILS: {
    EF_IRRIGATEDPASTURE: 0.0059,
    EF_IRRIGATEDCROP: 0.007,
    EF_NONIRRIGATEDCROP: 0.0041,
    EF_NONIRRIGATEDPASTURE: 0.0018,
  },

  /**
   * @description Methane emission factor for warm climate
   */
  METHANE_WARM_EF: 0.012,

  /**
   * @description Methane emission factor for temperate climate
   */
  METHANE_TEMPERATE_EF: 0.003,

  /**
   * @description Methane emission potential, in m3 CH4/kg
   * @inventory2018 3B.1a_2
   * @units m3 CH4/kg
   */
  METHANE_EMISSION_POTENTIAL: 0.24,

  /**
   * @description Methane density, in kg CH4/m3
   * @inventory2018 3B.1a_2
   * @units kg CH4/m3
   */
  METHANE_DENSITY: 0.6784,

  /**
   * @description Other livestock – Allocation of animals to climate regions
   * @inventory2022 Table A5.5.7.3
   */
  OTHERLIVESTOCK_ALLOCATION_CLIMATEREGIONS: {
    [STATES.ACT]: {
      warm: 0,
      temperate: 1,
    },
    [STATES.NT]: {
      warm: 1,
      temperate: 0,
    },
    [STATES.NSW]: {
      warm: 0,
      temperate: 1,
    },
    [STATES.QLD]: {
      warm: 0,
      temperate: 1,
    },
    [STATES.SA]: {
      warm: 0,
      temperate: 1,
    },
    [STATES.TAS]: {
      warm: 0,
      temperate: 1,
    },
    [STATES.VIC]: {
      warm: 0,
      temperate: 1,
    },
    [STATES.WA_NW]: {
      warm: 0,
      temperate: 1,
    },
    [STATES.WA_SW]: {
      warm: 0,
      temperate: 1,
    },
  },

  /**
   * @description Urine and dung emission factor
   * @inventory2022 3.D.A_6
   */
  URINEDUNG_EF: 0.004,

  /**
   * @description Default emission factor for Urea
   * @reference IPCC (2006)
   */
  CARBON_FRACTION_OF_UREA: 0.2,

  /**
   * @description Proportion of gas volatilised from manure
   * @inventory2018 3DB_2
   */
  FRAC_GASM: 0.21,

  /**
   * @description Atmospheric N deposition of inorganic fertiliser
   * @inventory2018 3DB_1
   */
  INOGRANICFERTILISER_ATMOSPHERIC_N: 0.11,

  /**
   * @description Leaching and runoff of inorganic fertiliser
   * @inventory2018 3B.5a_4
   */
  LEECHING_AND_RUNOFF: 0.011,
};

export const sugarConstants: SugarConstants = {
  /**
   * @description Emissions factor for annual N2O production from sugar cane
   */
  SUGAR_ANNUAL_N2O_PRODUCTION_EF: 0.00503,

  /**
   * @description Default percent of sugar yield from total harvest, if no value is supplied in inputs
   * @type Proportion
   */
  SUGAR_YIELD: 0.1188625,
};

export const cottonConstants: CottonConstants = {
  /**
   * @description Intensity of economic allocation for cotton co-products, by type
   * @reference https://www.sciencedirect.com/science/article/abs/pii/S0959652618335935
   * @type Proportion
   */
  COTTON_INTENSITY_ECONOMIC_ALLOCATION: {
    LINT: 0.86,
    SEED: 0.14,
  },
};

export const aquacultureConstants: AquacultureConstants = {
  /**
   * @description Emissions factors for aquaculture bait
   * @reference Blueshift estimates
   * @units kg CO2-e / kg feed
   */
  AQUACULTURE_BAIT_EF: {
    [AquacultureBait.SARDINES]: 0.3,
    [AquacultureBait.LOW_ANIMAL_PROTEIN]: 1,
    [AquacultureBait.HIGH_ANIMAL_PROTEIN]: 2.2,
    [AquacultureBait.CEREAL]: 0.5,
    [AquacultureBait.SQUID]: 0.3,
    [AquacultureBait.FISH]: 0.3,
  },
};

export const cropConstants: CropConstants = {
  /**
   * @description Efficiency of residue burning
   */
  BURNING_EFFICIENCY_RESIDUE: 0.96,

  /**
   * @description N2O emissions factor for savannah burning
   * @inventory2022 Table 5.31
   * @units Gg element / Gg burnt
   */
  BURNING_N2O_EF: 0.0076,

  /**
   * @description Methane emissions factor for savannah burning
   * @inventory2022 Table 5.31
   * @units Gg element / Gg burnt
   */
  BURNING_METHANE_EF: 0.0035,

  COMPONENTS_ENERGY_EF: {
    N: { TOTAL_ENERGY: 65, EF: 0.05 },
    P: { TOTAL_ENERGY: 15, EF: 0.06 },
    K: { TOTAL_ENERGY: 10, EF: 0.06 },
    S: { TOTAL_ENERGY: 5, EF: 0.06 },
  },

  /**
   * @description NO2 emissions factors for synthetic fertilisers
   * @inventory2018 Table 5.23
   */
  PRODUCTIONSYSTEM_EF: {
    RAINFALL_LT_600: {
      'Non-irrigated crop': 0.0029,
      'Irrigated crop': 0.007,
      'Sugar cane': 0.0199,
      Cotton: 0.0053,
      Horticulture: 0.0064,
    },
    RAINFALL_GT_600: {
      'Non-irrigated crop': 0.008,
      'Irrigated crop': 0.007,
      'Sugar cane': 0.0199,
      Cotton: 0.0053,
      Horticulture: 0.0064,
    },
  },

  /**
   * @description Attributes of major pasture types
   * @inventory2022 A5.5.9.2
   */
  PASTURE_ATTRIBUTES: {
    'Annual grass': {
      FRACRENEWED_INTENSIVE: 0.1,
      FRACRENEWED_OTHER: 0.03,
      AVERAGE_YIELD: 4.41,
      BELOW_ABOVE_RATIO: 0.4,
      NCONTENT_ABOVEGROUND: 0.015,
      NCONTENT_BELOWGROUND: 0.012,
      NCONTENT_ABOVEGROUND_RESIDUE_REMOVED: 0.8,
    },
    'Grass clover mixture': {
      FRACRENEWED_INTENSIVE: 0.1,
      FRACRENEWED_OTHER: 0.03,
      AVERAGE_YIELD: 8.34,
      BELOW_ABOVE_RATIO: 0.8,
      NCONTENT_ABOVEGROUND: 0.025,
      NCONTENT_BELOWGROUND: 0.016,
      NCONTENT_ABOVEGROUND_RESIDUE_REMOVED: 0.8,
    },
    Lucerne: {
      FRACRENEWED_INTENSIVE: 0.1,
      FRACRENEWED_OTHER: 0.03,
      AVERAGE_YIELD: 8.62,
      BELOW_ABOVE_RATIO: 0.4,
      NCONTENT_ABOVEGROUND: 0.027,
      NCONTENT_BELOWGROUND: 0.019,
      NCONTENT_ABOVEGROUND_RESIDUE_REMOVED: 0.8,
    },
    'Other legume': {
      FRACRENEWED_INTENSIVE: 0.1,
      FRACRENEWED_OTHER: 0.03,
      AVERAGE_YIELD: 5.62,
      BELOW_ABOVE_RATIO: 0.4,
      NCONTENT_ABOVEGROUND: 0.027,
      NCONTENT_BELOWGROUND: 0.022,
      NCONTENT_ABOVEGROUND_RESIDUE_REMOVED: 0.8,
    },
    'Perennial pasture': {
      FRACRENEWED_INTENSIVE: 0.1,
      FRACRENEWED_OTHER: 0.03,
      AVERAGE_YIELD: 8.35,
      BELOW_ABOVE_RATIO: 0.8,
      NCONTENT_ABOVEGROUND: 0.015,
      NCONTENT_BELOWGROUND: 0.012,
      NCONTENT_ABOVEGROUND_RESIDUE_REMOVED: 0.8,
    },
  },

  /**
   * @description Proportion of crop residue burnt by state
   * @inventory2018 5.I.3
   * @type Proportion
   */
  CROPRESIDUE_PROPORTIONBURNT: {
    [STATES.NSW]: { burnt: 0.22, removed: 0.05 },
    [STATES.VIC]: { burnt: 0.21, removed: 0.07 },
    [STATES.QLD]: { burnt: 0.06, removed: 0.04 },
    [STATES.SA]: { burnt: 0.12, removed: 0.09 },
    [STATES.WA_SW]: { burnt: 0.06, removed: 0.11 },
    [STATES.WA_NW]: { burnt: 0.06, removed: 0.11 },
    [STATES.TAS]: { burnt: 0.09, removed: 0.16 },
    [STATES.NT]: { burnt: 0.23, removed: 0.01 },
    [STATES.ACT]: { burnt: 0, removed: 0 },
  },

  /**
   * @description Proportion of sugar cane residue burnt by state
   * @inventory2018 5.I.4
   * @type Proportion
   */
  CROPRESIDUE_FRACTIONSUGARCANEBURNT: {
    [STATES.NSW]: { burnt: 0.898, removed: 0 },
    [STATES.VIC]: { burnt: 0, removed: 0 },
    [STATES.QLD]: { burnt: 0.275, removed: 0.03 },
    [STATES.SA]: { burnt: 0, removed: 0 },
    [STATES.WA_SW]: { burnt: 1, removed: 0 },
    [STATES.WA_NW]: { burnt: 1, removed: 0 },
    [STATES.TAS]: { burnt: 0, removed: 0 },
    [STATES.NT]: { burnt: 0, removed: 0 },
    [STATES.ACT]: { burnt: 0, removed: 0 },
  },

  /**
   * @description Crop residue parameters for major crop types
   * @inventory2022 A5.5.9.1
   */
  CROPRESIDUE: {
    Wheat: {
      residueCropRatio: 1.5,
      belowAboveResidueRatio: 0.29,
      dryMatterContent: 0.88,
      carbonMassFraction: 0.4,
      aboveGroundN: 0.006,
      belowGroundN: 0.01,
      fractionOfResidueAtBurning: 0.5,
      fractionBurnt: 0.22,
      fractionRemoved: 0.05,
    },
    Barley: {
      residueCropRatio: 1.24,
      belowAboveResidueRatio: 0.32,
      dryMatterContent: 0.88,
      carbonMassFraction: 0.4,
      aboveGroundN: 0.007,
      belowGroundN: 0.01,
      fractionOfResidueAtBurning: 0.5,
      fractionBurnt: 0.22,
      fractionRemoved: 0.05,
    },
    Maize: {
      residueCropRatio: 0.81,
      belowAboveResidueRatio: 0.39,
      dryMatterContent: 0.85,
      carbonMassFraction: 0.42,
      aboveGroundN: 0.005,
      belowGroundN: 0.007,
      fractionOfResidueAtBurning: 1,
      fractionBurnt: 0.22,
      fractionRemoved: 0.05,
    },
    Oats: {
      residueCropRatio: 1.42,
      belowAboveResidueRatio: 0.43,
      dryMatterContent: 0.88,
      carbonMassFraction: 0.4,
      aboveGroundN: 0.006,
      belowGroundN: 0.01,
      fractionOfResidueAtBurning: 0.5,
      fractionBurnt: 0.22,
      fractionRemoved: 0.05,
    },
    Rice: {
      residueCropRatio: 1.31,
      belowAboveResidueRatio: 0.16,
      dryMatterContent: 0.8,
      carbonMassFraction: 0.42,
      aboveGroundN: 0.007,
      belowGroundN: 0.01,
      fractionOfResidueAtBurning: 1,
      fractionBurnt: 0.815,
      fractionRemoved: 0.06,
    },
    Sorghum: {
      residueCropRatio: 1.5,
      belowAboveResidueRatio: 0.22,
      dryMatterContent: 0.8,
      carbonMassFraction: 0.4,
      aboveGroundN: 0.008,
      belowGroundN: 0.007,
      fractionOfResidueAtBurning: 0.5,
      fractionBurnt: 0.22,
      fractionRemoved: 0.05,
    },
    Triticale: {
      residueCropRatio: 1.5,
      belowAboveResidueRatio: 0.42,
      dryMatterContent: 0.88,
      carbonMassFraction: 0.4,
      aboveGroundN: 0.006,
      belowGroundN: 0.01,
      fractionOfResidueAtBurning: 0.5,
      fractionBurnt: 0.22,
      fractionRemoved: 0.05,
    },
    'Other Cereals': {
      residueCropRatio: 1.46,
      belowAboveResidueRatio: 0.36,
      dryMatterContent: 0.88,
      carbonMassFraction: 0.4,
      aboveGroundN: 0.006,
      belowGroundN: 0.01,
      fractionOfResidueAtBurning: 0.5,
      fractionBurnt: 0.22,
      fractionRemoved: 0.05,
    },
    Pulses: {
      residueCropRatio: 1.37,
      belowAboveResidueRatio: 0.51,
      dryMatterContent: 0.87,
      carbonMassFraction: 0.4,
      aboveGroundN: 0.009,
      belowGroundN: 0.01,
      fractionOfResidueAtBurning: 0.5,
      fractionBurnt: 0.22,
      fractionRemoved: 0.05,
    },
    'Tuber and Roots': {
      residueCropRatio: 0.34,
      belowAboveResidueRatio: 0.43,
      dryMatterContent: 0.25,
      carbonMassFraction: 0.4,
      aboveGroundN: 0.02,
      belowGroundN: 0.01,
      fractionOfResidueAtBurning: 0,
      fractionBurnt: 0,
      fractionRemoved: 1,
    },
    Peanuts: {
      residueCropRatio: 1.07,
      belowAboveResidueRatio: 0.2,
      dryMatterContent: 0.8,
      carbonMassFraction: 0.42,
      aboveGroundN: 0.016,
      belowGroundN: 0.014,
      fractionOfResidueAtBurning: 0.5,
      fractionBurnt: 0.22,
      fractionRemoved: 0.05,
    },
    'Sugar Cane': {
      residueCropRatio: 0.25,
      belowAboveResidueRatio: 0.45,
      dryMatterContent: 0.2,
      carbonMassFraction: 0.4,
      aboveGroundN: 0.005,
      belowGroundN: 0.007,
      fractionOfResidueAtBurning: 1,
      fractionBurnt: 0.858,
      fractionRemoved: 0,
    },
    Cotton: {
      residueCropRatio: 1.9,
      belowAboveResidueRatio: 0.3,
      dryMatterContent: 0.9,
      carbonMassFraction: 0.4,
      aboveGroundN: 0.01,
      belowGroundN: 0.01,
      fractionOfResidueAtBurning: 0,
      fractionBurnt: 0,
      fractionRemoved: 0,
    },
    Hops: {
      residueCropRatio: 1.5,
      belowAboveResidueRatio: 0.29,
      dryMatterContent: 0.88,
      carbonMassFraction: 0.4,
      aboveGroundN: 0.006,
      belowGroundN: 0,
      fractionOfResidueAtBurning: 0,
      fractionBurnt: 0,
      fractionRemoved: 0,
    },
    Oilseeds: {
      residueCropRatio: 2.08,
      belowAboveResidueRatio: 0.33,
      dryMatterContent: 0.96,
      carbonMassFraction: 0.4,
      aboveGroundN: 0.009,
      belowGroundN: 0.01,
      fractionOfResidueAtBurning: 0.5,
      fractionBurnt: 0.22,
      fractionRemoved: 0.05,
    },
    'Forage Crops': {
      residueCropRatio: 1.34,
      belowAboveResidueRatio: 0.37,
      dryMatterContent: 0.88,
      carbonMassFraction: 0.4,
      aboveGroundN: 0.006,
      belowGroundN: 0.01,
      fractionOfResidueAtBurning: 0,
      fractionBurnt: 0,
      fractionRemoved: 0.8,
    },
    Lucerne: {
      residueCropRatio: 0,
      belowAboveResidueRatio: 0,
      dryMatterContent: 0,
      carbonMassFraction: 0,
      aboveGroundN: 0,
      belowGroundN: 0,
      fractionOfResidueAtBurning: 0,
      fractionBurnt: 0,
      fractionRemoved: 0,
    },
    'Other legume': {
      residueCropRatio: 0,
      belowAboveResidueRatio: 0,
      dryMatterContent: 0,
      carbonMassFraction: 0,
      aboveGroundN: 0,
      belowGroundN: 0,
      fractionOfResidueAtBurning: 0,
      fractionBurnt: 0,
      fractionRemoved: 0,
    },
    'Annual grass': {
      residueCropRatio: 0,
      belowAboveResidueRatio: 0,
      dryMatterContent: 0,
      carbonMassFraction: 0,
      aboveGroundN: 0,
      belowGroundN: 0,
      fractionOfResidueAtBurning: 0,
      fractionBurnt: 0,
      fractionRemoved: 0,
    },
    'Grass clover mixture': {
      residueCropRatio: 0,
      belowAboveResidueRatio: 0,
      dryMatterContent: 0,
      carbonMassFraction: 0,
      aboveGroundN: 0,
      belowGroundN: 0,
      fractionOfResidueAtBurning: 0,
      fractionBurnt: 0,
      fractionRemoved: 0,
    },
    'Perennial pasture': {
      residueCropRatio: 0,
      belowAboveResidueRatio: 0,
      dryMatterContent: 0,
      carbonMassFraction: 0,
      aboveGroundN: 0,
      belowGroundN: 0,
      fractionOfResidueAtBurning: 0,
      fractionBurnt: 0,
      fractionRemoved: 0,
    },
    'Perennial Hort': {
      residueCropRatio: 1.7,
      belowAboveResidueRatio: 0.5,
      dryMatterContent: 0.8,
      carbonMassFraction: 0.4,
      aboveGroundN: 0.006,
      belowGroundN: 0,
      fractionOfResidueAtBurning: 0,
      fractionBurnt: 0,
      fractionRemoved: 0,
    },
    'Annual Hort': {
      residueCropRatio: 1.5,
      belowAboveResidueRatio: 0.3,
      dryMatterContent: 0.88,
      carbonMassFraction: 0.4,
      aboveGroundN: 0.02,
      belowGroundN: 0.01,
      fractionOfResidueAtBurning: 0,
      fractionBurnt: 0,
      fractionRemoved: 0,
    },
  },

  /**
   * @description Emissions factor for annual N2O production from crop residue
   * @units kg N2O-e/kg N
   */
  CROP_RESIDUE_N2O_EF: 0.00503,

  /**
   * @description Fraction of N available for leaching and runoff from fertiliser
   */
  FERTILISER_FRACTION_RUNOFF_STATIC: 1,
};

export const commonConstants: CommonConstants = {
  /**
   * @description Emissions factor for feed purchased, in kg CO2-e/kg
   * @units kg CO2-e/kg
   */
  FEED_PURCHASED: {
    grain: { TotalGHG: 0.3 },
    cottonseed: { TotalGHG: 1.1 },
    /** @description Average of 0.25 and 0.2 */
    hay: { TotalGHG: 0.225 },
  },

  /**
   * @description N, P, K and S content in each fertiliser type
   * @type Proportion
   */
  FERTILISER_CONTENT: {
    MAP: { N: 0.11, P: 0.219, K: 0, S: 0 },
    DAP: { N: 0.18, P: 0.2, K: 0, S: 0 },
    SSP: { N: 0, P: 0.088, K: 0, S: 0.11 },
    UREA: { N: 0.46, P: 0, K: 0, S: 0 },
    TSP: { N: 0, P: 0.202, K: 0, S: 0.01 },
    UAN: { N: 0.32, P: 0, K: 0, S: 0 },
    SP11: { N: 0, P: 0.044, K: 0.25, S: 0.055 },
    SP21: { N: 0, P: 0.059, K: 0.165, S: 0.074 },
    SP31: { N: 0, P: 0.066, K: 0.127, S: 0.082 },
    SP41: { N: 0, P: 0.07, K: 0.1, S: 0.088 },
    SP51: { N: 0, P: 0.074, K: 0.08, S: 0.092 },
    MURIATE_OF_POTASH: { N: 0, P: 0, K: 0.5, S: 0 },
    SULPHATE_OF_POTASH: { N: 0, P: 0, K: 0.41, S: 0.17 },
    SULPHATE_OF_AMMONIA: { N: 0.21, P: 0, K: 0, S: 0.24 },
    AN: { N: 0.35, P: 0, K: 0, S: 0 },
    CAN: { N: 0.265, P: 0, K: 0, S: 0 },
  },

  /**
   * @description Emissions factors for commercial flights
   * @units kg CO2-e / PAX km
   */
  COMMERCIALFLIGHT_EF: 0.101,

  /**
   * @description Electricity emission factors for each state and Australia, in kg CO2-e/kWh
   * @reference Primary data sources comprise National Greenhouse and Energy Reporting (Measurement) Determination 2008 (Schedule 1), Australian Energy Statistics, Clean Energy Regulator, and AEMO data and Department of Climate Change, Energy, the Environment and Water.
   * @units kg CO2-e/kWh
   */
  ELECTRICITY: {
    [STATES.NSW]: {
      SCOPE2_EF: 0.66,
      SCOPE3_EF: 0.04,
    },
    [STATES.ACT]: {
      SCOPE2_EF: 0.66,
      SCOPE3_EF: 0.04,
    },
    [STATES.VIC]: {
      SCOPE2_EF: 0.77,
      SCOPE3_EF: 0.09,
    },
    [STATES.QLD]: {
      SCOPE2_EF: 0.71,
      SCOPE3_EF: 0.1,
    },
    [STATES.SA]: {
      SCOPE2_EF: 0.23,
      SCOPE3_EF: 0.05,
    },
    [STATES.WA_SW]: {
      SCOPE2_EF: 0.51,
      SCOPE3_EF: 0.06,
    },
    [STATES.WA_NW]: {
      SCOPE2_EF: 0.61,
      SCOPE3_EF: 0.09,
    },
    [STATES.TAS]: {
      SCOPE2_EF: 0.15,
      SCOPE3_EF: 0.03,
    },
    [STATES.NT]: {
      SCOPE2_EF: 0.56,
      SCOPE3_EF: 0.07,
    },
    Australia: {
      SCOPE2_EF: 0.63,
      SCOPE3_EF: 0.07,
    },
  },

  /**
   * @description Material breakdown for supplementation, in kg CO2-e/kg product
   * @reference AusLCI Published Processes
   * @link https://www.auslci.com.au/index.php/EmissionFactors
   * @units kg CO2-e/kg product
   */
  MATERIAL_BREAKDOWN_SUPPLEMENTATION: {
    mineralblock: {
      CO2: 0.98,
      CH4: 0.0154,
      N2O: 0.00456826192856515,
      KG_CO2: 0.89448581,
      FRACTION_OF_UREA: 0.3,
    },
    weanerblock: {
      CO2: 0.98,
      CH4: 0.0154,
      N2O: 0.00456826192856515,
      KG_CO2: 0.17767843,
      FRACTION_OF_UREA: 0.071,
    },
    dryseasonmix: {
      CO2: 0.98,
      CH4: 0.0154,
      N2O: 0.00456826192856515,
      KG_CO2: 1.0057536, // kg CO2-e/kg Product
      FRACTION_OF_UREA: 0.3,
    },
  },

  /**
   * @description Customized fertilizer emission factors, in kg CO2-e/kg product
   * @reference (Wood & Cowie, 2004; Davis & Haglund,1999) Table 5, Table 6, and Table 7.
   * @units kg CO2-e/kg
   */
  CUSTOMIZED_FERTILIZER: {
    'Monoammonium phosphate (MAP)': {
      TotalGHG: 703.2 / 1000,
    },
    'Diammonium Phosphate (DAP)': {
      TotalGHG: 866.2 / 1000,
    },
    'Urea-Ammonium Nitrate (UAN)': {
      TotalGHG: 1173.8 / 1000,
    },
    'Ammonium Nitrate (AN)': {
      TotalGHG: 2460.8 / 1000,
    },
    'Calcium Ammonium Nitrate (CAN)': {
      TotalGHG: 2336.9 / 1000,
    },
    'Triple Superphosphate (TSP)': {
      TotalGHG: 0.1848,
    },
    'Super Potash 1:1': {
      TotalGHG: 0.2061,
    },
    'Super Potash 2:1': {
      TotalGHG: 0.1743,
    },
    'Super Potash 3:1': {
      TotalGHG: 0.1602,
    },
    'Super Potash 4:1': {
      TotalGHG: 0.0894,
    },
    'Super Potash 5:1': {
      TotalGHG: 0.1422,
    },
    'Muriate of Potash': {
      TotalGHG: 0.3,
    },
    'Sulphate of Potash': {
      TotalGHG: 0.3,
    },
    'Sulphate of Ammonia': {
      TotalGHG: 0.7545,
    },
  },

  /**
   * @description Temperate emission factor, for sheep manure management
   */
  EF_TEMPERATURE: 0.003,

  /**
   * @description Conversion factor for elemental to molecular N2O
   */
  GWP_FACTORSC15: 44 / 28,

  /**
   * @description Conversion factor for elemental to molecular CO2 from lime
   */
  GWP_FACTORSC18: 44 / 12,

  /**
   * @description Conversion factor for elemental to molecular CO2
   */
  GWP_FACTORSC13: 44 / 12,

  /**
   * @description Conversion factor for elemental to molecular CH4
   */
  GWP_FACTORSC14: 16 / 12,

  /**
   * @description Conversion factor for elemental to molecular Nox
   */
  GWP_FACTORSC16: 46 / 14,

  /**
   * @description Proportion of Urea in UAN
   * @link http://sds.simplot.com/datasheets/12101.pdf?_gl=1*1j8hnbm*_ga*NDgxMDE2MzQ2LjE2ODUzMzY4ODk.*_ga_NVEQ5HDZCN*MTY4NTMzNjg5MC4xLjEuMTY4NTMzNzExOC4wLjAuMA..&_ga=2.215359572.234437473.1685336889-481016346.1685336889
   * @type Proportion
   */
  GWP_FACTORSC22: 0.35,

  /**
   * @description Proportion of gas volatilised from fertiliser
   * @inventory2018 3DB_1
   */
  FRAC_GASF: 0.11,

  /**
   * @description Conversion factor for the global warming potential of CH4, as CO2-e
   */
  GWP_FACTORSC5: 28,

  /**
   * @description Conversion factor for the global warming potential of N2O, as CO2-e
   */
  GWP_FACTORSC6: 265,

  /**
   * @description Scope 1 and Scope 3 values relating to liming
   * @inventory2018 3G_1
   * @reference Mudahar, M.S., Hignett, T.P., 1982. Energy and Fertilizer— Policy Implications and Options for Developing Countries. International Fertilizer Development Center, Muscle Shoals, Alabama
   */
  LIMING: {
    SCOPE1: {
      /** @type Proportion */
      LIMESTONE_FRACTIONPURITY: 0.9,
      LIMESTONE_EF: 0.12,
      /** @type Proportion */
      DOLOMITE_FRACTIONPURITY: 0.95,
      DOLOMITE_EF: 0.13,
    },
    SCOPE3: {
      FUEL_SCOPE3_PRODUCTION_NATURAL_GAS: 0.09,
      FUEL_SCOPE3_PRODUCTION_ELECTRICITY: 6.43,
      FUEL_SCOPE3_PRODUCTION_DISTILLATE_FUEL: 0.72,
      FUEL_SCOPE3_PRODUCTION_COAL: 0.08,
      FUEL_SCOPE3_PRODUCTION_GASOLINE: 0.09,
      FUEL_SCOPE3_POST_PRODUCTION_DISTILLATE_FUEL: 28.32,
    },
  },

  /**
   * @description Scope 1 and Scope 3 factors relating to fuel
   * @reference Table 6 and 7 (Dept of Industry, Science, Energy and Resources 2022)
   */
  FUEL_ENERGYGJ: {
    STATIONARY: {
      DIESEL: {
        ENERGY_CONTENT_FACTOR: 38.6,
        SCOPE1_EF: {
          CO2: 69.9,
          CH4: 0.1,
          N2O: 0.2,
        },
        SCOPE3_EF: 17.3,
      },
      PETROL: {
        ENERGY_CONTENT_FACTOR: 34.2,
        SCOPE1_EF: {
          CO2: 67.4,
          CH4: 0.2,
          N2O: 0.2,
        },
        SCOPE3_EF: 17.2,
      },
      LPG: {
        ENERGY_CONTENT_FACTOR: 25.7,
        SCOPE1_EF: {
          CO2: 60.2,
          CH4: 0.2,
          N2O: 0.2,
        },
        SCOPE3_EF: 20.2,
      },
      ETHANOL: {
        ENERGY_CONTENT_FACTOR: 23.4,
        SCOPE1_EF: {
          CO2: 0,
          CH4: 0.08,
          N2O: 0.2,
        },
        SCOPE3_EF: 0.0,
      },
      BIODIESEL: {
        ENERGY_CONTENT_FACTOR: 34.6,
        SCOPE1_EF: {
          CO2: 0,
          CH4: 0.08,
          N2O: 0.2,
        },
        SCOPE3_EF: 0.0,
      },
      RENEWABLE_DIESEL: {
        ENERGY_CONTENT_FACTOR: 38.6,
        SCOPE1_EF: {
          CO2: 0,
          CH4: 0.1,
          N2O: 0.2,
        },
        SCOPE3_EF: 0.0,
      },
      OTHER_BIOFUELS: {
        ENERGY_CONTENT_FACTOR: 23.4,
        SCOPE1_EF: {
          CO2: 0,
          CH4: 0.08,
          N2O: 0.2,
        },
        SCOPE3_EF: 0.0,
      },
      LNG: {
        ENERGY_CONTENT_FACTOR: 25.3,
        SCOPE1_EF: {
          CO2: 51.4,
          CH4: 7.3,
          N2O: 0.3,
        },
        SCOPE3_EF: 18.0,
      },
    },
    TRANSPORT: {
      DIESEL: {
        ENERGY_CONTENT_FACTOR: 38.6,
        SCOPE1_EF: {
          CO2: 69.9,
          CH4: 0.01,
          N2O: 0.5,
        },
        SCOPE3_EF: 17.3,
      },
      PETROL: {
        ENERGY_CONTENT_FACTOR: 34.2,
        SCOPE1_EF: {
          CO2: 67.4,
          CH4: 0.02,
          N2O: 0.2,
        },
        SCOPE3_EF: 17.2,
      },
      LPG: {
        ENERGY_CONTENT_FACTOR: 26.2,
        SCOPE1_EF: {
          CO2: 60.2,
          CH4: 0.5,
          N2O: 0.3,
        },
        SCOPE3_EF: 20.2,
      },
      FUEL_OIL: {
        ENERGY_CONTENT_FACTOR: 39.7,
        SCOPE1_EF: {
          CO2: 73.6,
          CH4: 0.08,
          N2O: 0.5,
        },
        SCOPE3_EF: 18.0,
      },
      ETHANOL: {
        ENERGY_CONTENT_FACTOR: 23.4,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.2,
          N2O: 0.2,
        },
        SCOPE3_EF: 0.0,
      },
      BIODIESEL: {
        ENERGY_CONTENT_FACTOR: 34.6,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.8,
          N2O: 1.7,
        },
        SCOPE3_EF: 0.0,
      },
      RENEWABLE_DIESEL: {
        ENERGY_CONTENT_FACTOR: 38.6,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.01,
          N2O: 0.5,
        },
        SCOPE3_EF: 0.0,
      },
      OTHER_BIOFUELS: {
        ENERGY_CONTENT_FACTOR: 23.4,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.8,
          N2O: 1.7,
        },
        SCOPE3_EF: 0.0,
      },
      LNG: {
        ENERGY_CONTENT_FACTOR: 25.3,
        SCOPE1_EF: {
          CO2: 51.4,
          CH4: 7.3,
          N2O: 0.3,
        },
        SCOPE3_EF: 18.0,
      },
      JET_A1: {
        ENERGY_CONTENT_FACTOR: 36.8,
        SCOPE1_EF: {
          CO2: 69.6,
          CH4: 0.01,
          N2O: 0.6,
        },
        SCOPE3_EF: 18.0,
      },
      JET_B: {
        ENERGY_CONTENT_FACTOR: 36.8,
        SCOPE1_EF: {
          CO2: 69.6,
          CH4: 0.01,
          N2O: 0.6,
        },
        SCOPE3_EF: 18.0,
      },
      AVGAS: {
        ENERGY_CONTENT_FACTOR: 33.1,
        SCOPE1_EF: {
          CO2: 67.0,
          CH4: 0.06,
          N2O: 0.6,
        },
        SCOPE3_EF: 18.0,
      },
    },
    NATURAL_GAS: {
      ENERGY_CONTENT_FACTOR: 1,
      SCOPE1_EF: {
        CO2: 51.4,
        CH4: 0.1,
        N2O: 0.03,
      },
      SCOPE3_EF: {
        nsw: 13.1,
        act: 13.1,
        vic: 4,
        qld: 8.8,
        sa: 10.7,
        wa_sw: 4.1,
        wa_nw: 4.1,
        tas: 0,
        nt: 0,
      },
    },
  },

  /**
   * @description Total GHG (kg CO2-e/kg input)
   * @units kg CO2-e/kg
   */
  UREA_FERTILISER_GHG: 1.495,

  /**
   * @description Total GHG (kg CO2-e/kg input)
   * @units kg CO2-e/kg
   */
  SUPERPHOSPHATE_GHG: 0.1122,

  /**
   * @description Emissions factor for mass of Urea applied to soils
   * @inventory2018 3H_1
   */
  FERTILISER_EF: 0.2,

  /**
   * @description Energy requirement to manufacture fertiliser components and associated CO2 emissions (EF)
   * @reference (Wells 2001; cited by Saunders et al. 2006)
   */
  AGROCHEMICAL_ENERGY_MANUFACTURE: {
    HERBICIDE_GLYPHOSATE: { TOTAL_ENERGY: 550, EF: 0.06 },
    HERBICIDE_GENERAL: { TOTAL_ENERGY: 310, EF: 0.06 },
    INSECTICIDE: { TOTAL_ENERGY: 315, EF: 0.06 },
  },

  /**
   * @description Leaching and runoff parameters
   * @inventory2022 3.B.5
   */
  LEACHING: {
    FRACLEACH: 0.02,
    FRACLEACH_MMS: 0.24,
    FRACLEACH_FERTILISER_SOILS: 0.24,
    /**
     * @description Added new key due to difference in value between layers and broilers
     */
    FRACLEACH_BROILER: 0.24,
    FRACWET: 1,
    FERT_N_FRACLEACH: 0.24,
    FERT_N_FRACWET: 1,
    STORAGE_FRACLEACH: 0.02,
    STORAGE_FRACWET: 1,
    STORAGE_EF: 0.011,
    N2O_EF: 0.011,
  },

  /**
   * @description Fuel usage for each truck type, in litres / km
   * @units litres / km
   */
  TRANSPORT_FUEL_USAGE: {
    '4 Deck Trailer': 0.785,
    '6 Deck Trailer': 1.11,
    'B-Double': 0.625,
  },

  /**
   * @description Emissions factor for each gas, in kg CO2-e / GJ
   * @reference Department of Industry, Science, Energy and Resources 2021
   * @units kg CO2-e / GJ
   */
  TRANSPORT_ECF: {
    CO2: 69.9,
    CH4: 0.1,
    N2O: 0.2,
  },

  /**
   * @description Static lookup tree values for soil type and species, by region
   */
  TREE_REGIONS: {
    RegionNo: {
      'South West': 1,
      Pilbara: 2,
      Kimberley: 3,
      'Central West': 4,
      'South Coastal': 5,
      'Goldfields/Eucla': 6,
      Gascoyne: 7,
      'Central Wheat Belt': 8,
      Interior: 9,
      'North Coast': 10,
      'South Coast': 11,
      'Northern Tablelands': 12,
      'Southern Tablelands': 13,
      'Northern Wheat/Sheep': 14,
      'Southern Wheat/Sheep': 15,
      Western: 16,
      'North East': 17,
      'East Coast': 18,
      'Central North/Midlands/South East': 19,
      'Central Plateau/Derwent Valley': 20,
      'West/South Coast': 21,
      'North West': 22,
      'South East': 23,
      Murray: 24,
      'Mid-North/Flinders': 25,
      Pastoral: 26,
      'West Coast/Eyre': 27,
      Mallee: 28,
      Wimmera: 29,
      'Northern Country': 30,
      'North East Vic': 31,
      'East Gippsland': 32,
      'West/South Gippsland': 33,
      Central: 34,
      'South West Vic': 35,
      'Central Highlands/Northern': 36,
      'Central West/Flinders': 37,
      'Channel Country': 38,
      'Maranoa/Warrego': 39,
      'Darling Downs/Burnett': 40,
      'North West/Gulf': 41,
      'Darwin-Daly': 42,
      'Arnhem-Roper': 43,
      'Victoria River-TennantCreek': 44,
      'Alice Springs': 45,
    },
    SoilType1: {
      'South West': 'Loams & Clays',
      Pilbara: 'No Soil / Tree data available',
      Kimberley: 'No Soil / Tree data available',
      'Central West': 'Coloured Sands',
      'South Coastal': 'Loams & Clays',
      'Goldfields/Eucla': 'No Soil / Tree data available',
      Gascoyne: 'No Soil / Tree data available',
      'Central Wheat Belt': 'Coloured Sands',
      Interior: 'No Soil / Tree data available',
      'North Coast': 'Duplex',
      'South Coast': 'Clay',
      'Northern Tablelands': 'Clay',
      'Southern Tablelands': 'Clay',
      'Northern Wheat/Sheep': 'Clay',
      'Southern Wheat/Sheep': 'Clay',
      Western: 'Clay',
      'North East': '"Other Soils"',
      'East Coast': '"Other Soils"',
      'Central North/Midlands/South East': '"Other Soils"',
      'Central Plateau/Derwent Valley': '"Other Soils"',
      'West/South Coast': '"Other Soils"',
      'North West': '"Other Soils"',
      'South East': 'Duplex Soils',
      Murray: 'Duplex Soils',
      'Mid-North/Flinders': 'Sandy Soils',
      Pastoral: 'Sandy Soils',
      'West Coast/Eyre': 'Sandy Soils',
      Mallee: 'Calcarosols',
      Wimmera: 'Calcarosols',
      'Northern Country': 'Grey Cracking Clays',
      'North East Vic': 'Grey Cracking Clays',
      'East Gippsland': 'Red Earths',
      'West/South Gippsland': 'Non-cracking Clays',
      Central: 'Red Duplex',
      'South West Vic': 'Cracking Clays',
      'Central Highlands/Northern': 'Clays',
      'Central West/Flinders': 'Clay Gidgee',
      'Channel Country': 'Clay Gidgee',
      'Maranoa/Warrego': 'Clay',
      'Darling Downs/Burnett': 'Clay (Brigalo and Belah)',
      'North West/Gulf': 'Duplex',
      'Darwin-Daly': 'Kandosols',
      'Arnhem-Roper': 'Kandosols',
      'Victoria River-TennantCreek': 'Kandosols',
      'Alice Springs': 'Kandosols',
    },
    SoilType2: {
      'South West': 'Sandy Duplexes',
      Pilbara: 'No Soil / Tree data available',
      Kimberley: 'No Soil / Tree data available',
      'Central West': 'Loams & Clays',
      'South Coastal': 'Sandy Duplexes',
      'Goldfields/Eucla': 'No Soil / Tree data available',
      Gascoyne: 'No Soil / Tree data available',
      'Central Wheat Belt': 'Loams & Clays',
      Interior: 'No Soil / Tree data available',
      'North Coast': 'Clay & Red Loam',
      'South Coast': 'Loam',
      'Northern Tablelands': 'Loam',
      'Southern Tablelands': 'Loam',
      'Northern Wheat/Sheep': 'Loam',
      'Southern Wheat/Sheep': 'Loam',
      Western: 'Loam',
      'North East': 'Structured Earths',
      'East Coast': 'Structured Earths',
      'Central North/Midlands/South East': 'Structured Earths',
      'Central Plateau/Derwent Valley': 'Structured Earths',
      'West/South Coast': 'Structured Earths',
      'North West': 'Structured Earths',
      'South East': 'Cracking Clays',
      Murray: 'Cracking Clays',
      'Mid-North/Flinders': 'Loamy Soils',
      Pastoral: 'Cracking Clays',
      'West Coast/Eyre': 'Loamy Soils',
      Mallee: 'Yellow Duplex',
      Wimmera: 'Yellow Duplex',
      'Northern Country': 'Red Duplex',
      'North East Vic': 'Red Duplex',
      'East Gippsland': 'Yellow Duplex',
      'West/South Gippsland': 'Gradational soils',
      Central: 'Yellow Duplex',
      'South West Vic': 'Red Duplex',
      'Central Highlands/Northern': 'Duplex',
      'Central West/Flinders': 'Open Downs',
      'Channel Country': 'Open Downs',
      'Maranoa/Warrego': 'Gradational soils',
      'Darling Downs/Burnett': 'Duplex Woodland',
      'North West/Gulf': 'Earths',
      'Darwin-Daly': 'Tenosols',
      'Arnhem-Roper': 'Tenosols',
      'Victoria River-TennantCreek': 'Tenosols',
      'Alice Springs': 'Tenosols',
    },
    TreeSpecies1: {
      'South West': 'Mixed species (Environmental Plantings)',
      Pilbara: 'No tree data available',
      Kimberley: 'Mixed species (Environmental Plantings)',
      'Central West': 'Mixed species (Environmental Plantings)',
      'South Coastal': 'Mixed species (Environmental Plantings)',
      'Goldfields/Eucla': 'Mixed species (Environmental Plantings)',
      Gascoyne: 'Mixed species (Environmental Plantings)',
      'Central Wheat Belt': 'Mixed species (Environmental Plantings)',
      Interior: 'No tree data available',
      'North Coast': 'Mixed species (Environmental Plantings)',
      'South Coast': 'Mixed species (Environmental Plantings)',
      'Northern Tablelands': 'Mixed species (Environmental Plantings)',
      'Southern Tablelands': 'Mixed species (Environmental Plantings)',
      'Northern Wheat/Sheep': 'Mixed species (Environmental Plantings)',
      'Southern Wheat/Sheep': 'Mixed species (Environmental Plantings)',
      Western: 'Mixed species (Environmental Plantings)',
      'North East': 'Mixed species (Environmental Plantings)',
      'East Coast': 'Mixed species (Environmental Plantings)',
      'Central North/Midlands/South East':
        'Mixed species (Environmental Plantings)',
      'Central Plateau/Derwent Valley':
        'Mixed species (Environmental Plantings)',
      'West/South Coast': 'Mixed species (Environmental Plantings)',
      'North West': 'Mixed species (Environmental Plantings)',
      'South East': 'Mixed species (Environmental Plantings)',
      Murray: 'Mixed species (Environmental Plantings)',
      'Mid-North/Flinders': 'Mixed species (Environmental Plantings)',
      Pastoral: 'Mixed species (Environmental Plantings)',
      'West Coast/Eyre': 'Mixed species (Environmental Plantings)',
      Mallee: 'Mixed species (Environmental Plantings)',
      Wimmera: 'Mixed species (Environmental Plantings)',
      'Northern Country': 'Mixed species (Environmental Plantings)',
      'North East Vic': 'Mixed species (Environmental Plantings)',
      'East Gippsland': 'Mixed species (Environmental Plantings)',
      'West/South Gippsland': 'Mixed species (Environmental Plantings)',
      Central: 'Mixed species (Environmental Plantings)',
      'South West Vic': 'Mixed species (Environmental Plantings)',
      'Central Highlands/Northern': 'Mixed species (Environmental Plantings)',
      'Central West/Flinders': 'Mixed species (Environmental Plantings)',
      'Channel Country': 'Mixed species (Environmental Plantings)',
      'Maranoa/Warrego': 'Mixed species (Environmental Plantings)',
      'Darling Downs/Burnett': 'Mixed species (Environmental Plantings)',
      'North West/Gulf': 'Mixed species (Environmental Plantings)',
      'Darwin-Daly': 'Mixed species (Environmental Plantings)',
      'Arnhem-Roper': 'Mixed species (Environmental Plantings)',
      'Victoria River-TennantCreek': 'Mixed species (Environmental Plantings)',
      'Alice Springs': 'Mixed species (Environmental Plantings)',
    },
    TreeSpecies2: {
      'South West': 'Tasmanian Blue Gum',
      Pilbara: 'No tree data available',
      Kimberley: 'No tree data available',
      'Central West': 'No tree data available',
      'South Coastal': 'No tree data available',
      'Goldfields/Eucla': 'No tree data available',
      Gascoyne: 'No tree data available',
      'Central Wheat Belt': 'No tree data available',
      Interior: 'No tree data available',
      'North Coast': 'Spotted Gum',
      'South Coast': 'Sugar Gum',
      'Northern Tablelands': 'Sugar Gum',
      'Southern Tablelands': 'Sugar Gum',
      'Northern Wheat/Sheep': 'Sugar Gum',
      'Southern Wheat/Sheep': 'Sugar Gum',
      Western: 'Sugar Gum',
      'North East': 'Tasmanian Blue Gum',
      'East Coast': 'Tasmanian Blue Gum',
      'Central North/Midlands/South East': 'Tasmanian Blue Gum',
      'Central Plateau/Derwent Valley': 'Tasmanian Blue Gum',
      'West/South Coast': 'Tasmanian Blue Gum',
      'North West': 'Tasmanian Blue Gum',
      'South East': 'Tasmanian Blue Gum',
      Murray: 'Tasmanian Blue Gum',
      'Mid-North/Flinders': 'Tasmanian Blue Gum',
      Pastoral: 'Tasmanian Blue Gum',
      'West Coast/Eyre': 'Tasmanian Blue Gum',
      Mallee: 'Sugar Gum',
      Wimmera: 'Sugar Gum',
      'Northern Country': 'Sugar Gum',
      'North East Vic': 'Sugar Gum',
      'East Gippsland': 'Tasmanian Blue Gum',
      'West/South Gippsland': 'Tasmanian Blue Gum',
      Central: 'Sugar Gum',
      'South West Vic': 'Sugar Gum',
      'Central Highlands/Northern': 'Hoop Pine',
      'Central West/Flinders': 'Hoop Pine',
      'Channel Country': 'Hoop Pine',
      'Maranoa/Warrego': 'Hoop Pine',
      'Darling Downs/Burnett': 'Hoop Pine',
      'North West/Gulf': 'Hoop Pine',
      'Darwin-Daly': 'No tree data available',
      'Arnhem-Roper': 'No tree data available',
      'Victoria River-TennantCreek': 'No tree data available',
      'Alice Springs': 'No tree data available',
    },
    TreeSpecies3: {
      'South West': 'Sydney Blue Gum',
      Pilbara: 'No tree data available',
      Kimberley: 'No tree data available',
      'Central West': 'No tree data available',
      'South Coastal': 'No tree data available',
      'Goldfields/Eucla': 'No tree data available',
      Gascoyne: 'No tree data available',
      'Central Wheat Belt': 'No tree data available',
      Interior: 'No tree data available',
      'North Coast': "Dunn's White Gum",
      'South Coast': 'Tasmanian Blue Gum',
      'Northern Tablelands': 'Tasmanian Blue Gum',
      'Southern Tablelands': 'Tasmanian Blue Gum',
      'Northern Wheat/Sheep': 'Tasmanian Blue Gum',
      'Southern Wheat/Sheep': 'Tasmanian Blue Gum',
      Western: 'Tasmanian Blue Gum',
      'North East': 'Shining Gum',
      'East Coast': 'Shining Gum',
      'Central North/Midlands/South East': 'Shining Gum',
      'Central Plateau/Derwent Valley': 'Shining Gum',
      'West/South Coast': 'Shining Gum',
      'North West': 'Shining Gum',
      'South East': 'Pinus Radiata',
      Murray: 'Pinus Radiata',
      'Mid-North/Flinders': 'Pinus Radiata',
      Pastoral: 'Pinus Radiata',
      'West Coast/Eyre': 'Pinus Radiata',
      Mallee: 'Tasmanian Blue Gum',
      Wimmera: 'Tasmanian Blue Gum',
      'Northern Country': 'Tasmanian Blue Gum',
      'North East Vic': 'Tasmanian Blue Gum',
      'East Gippsland': 'Shining Gum',
      'West/South Gippsland': 'Shining Gum',
      Central: 'Tasmanian Blue Gum',
      'South West Vic': 'Tasmanian Blue Gum',
      'Central Highlands/Northern': 'Lemon-scented Gum',
      'Central West/Flinders': 'Lemon-scented Gum',
      'Channel Country': 'Lemon-scented Gum',
      'Maranoa/Warrego': 'Lemon-scented Gum',
      'Darling Downs/Burnett': 'Lemon-scented Gum',
      'North West/Gulf': 'Lemon-scented Gum',
      'Darwin-Daly': 'No tree data available',
      'Arnhem-Roper': 'No tree data available',
      'Victoria River-TennantCreek': 'No tree data available',
      'Alice Springs': 'No tree data available',
    },
    TreeSpecies4: {
      'South West': 'Maritime Pine',
      Pilbara: 'No tree data available',
      Kimberley: 'No tree data available',
      'Central West': 'No tree data available',
      'South Coastal': 'No tree data available',
      'Goldfields/Eucla': 'No tree data available',
      Gascoyne: 'No tree data available',
      'Central Wheat Belt': 'No tree data available',
      Interior: 'No tree data available',
      'North Coast': 'Flooded Gum',
      'South Coast': 'Red Ironbark',
      'Northern Tablelands': 'Red Ironbark',
      'Southern Tablelands': 'Red Ironbark',
      'Northern Wheat/Sheep': 'Red Ironbark',
      'Southern Wheat/Sheep': 'Red Ironbark',
      Western: 'Red Ironbark',
      'North East': 'Radiata Pine (low input)',
      'East Coast': 'Radiata Pine (low input)',
      'Central North/Midlands/South East': 'Radiata Pine (low input)',
      'Central Plateau/Derwent Valley': 'Radiata Pine (low input)',
      'West/South Coast': 'Radiata Pine (low input)',
      'North West': 'Radiata Pine (low input)',
      'South East': 'No tree data available',
      Murray: 'No tree data available',
      'Mid-North/Flinders': 'No tree data available',
      Pastoral: 'No tree data available',
      'West Coast/Eyre': 'No tree data available',
      Mallee: 'Shining Gum',
      Wimmera: 'Shining Gum',
      'Northern Country': 'Shining Gum',
      'North East Vic': 'Shining Gum',
      'East Gippsland': 'Pinus Radiata',
      'West/South Gippsland': 'Mountain Ash',
      Central: 'Shining Gum',
      'South West Vic': 'Shining Gum',
      'Central Highlands/Northern': 'Western White Gum',
      'Central West/Flinders': 'Western White Gum',
      'Channel Country': 'Western White Gum',
      'Maranoa/Warrego': 'Western White Gum',
      'Darling Downs/Burnett': 'Western White Gum',
      'North West/Gulf': 'Western White Gum',
      'Darwin-Daly': 'No tree data available',
      'Arnhem-Roper': 'No tree data available',
      'Victoria River-TennantCreek': 'No tree data available',
      'Alice Springs': 'No tree data available',
    },
    TreeSpecies5: {
      'South West': 'Pinus Radiata',
      Pilbara: 'No tree data available',
      Kimberley: 'No tree data available',
      'Central West': 'No tree data available',
      'South Coastal': 'No tree data available',
      'Goldfields/Eucla': 'No tree data available',
      Gascoyne: 'No tree data available',
      'Central Wheat Belt': 'No tree data available',
      Interior: 'No tree data available',
      'North Coast': 'Slash Pine',
      'South Coast': 'Radiata Pine (low input)',
      'Northern Tablelands': 'Radiata Pine (low input)',
      'Southern Tablelands': 'Radiata Pine (low input)',
      'Northern Wheat/Sheep': 'Radiata Pine (low input)',
      'Southern Wheat/Sheep': 'Radiata Pine (low input)',
      Western: 'Radiata Pine (low input)',
      'North East': 'Radiata Pine (high input)',
      'East Coast': 'Radiata Pine (high input)',
      'Central North/Midlands/South East': 'Radiata Pine (high input)',
      'Central Plateau/Derwent Valley': 'Radiata Pine (high input)',
      'West/South Coast': 'Radiata Pine (high input)',
      'North West': 'Radiata Pine (high input)',
      'South East': 'No tree data available',
      Murray: 'No tree data available',
      'Mid-North/Flinders': 'No tree data available',
      Pastoral: 'No tree data available',
      'West Coast/Eyre': 'No tree data available',
      Mallee: 'Pinus Radiata (low input)',
      Wimmera: 'Pinus Radiata (low input)',
      'Northern Country': 'Pinus Radiata',
      'North East Vic': 'Pinus Radiata',
      'East Gippsland': 'No tree data available',
      'West/South Gippsland': 'Pinus Radiata',
      Central: 'Pinus Radiata',
      'South West Vic': 'Pinus Radiata',
      'Central Highlands/Northern': 'Blackbutt',
      'Central West/Flinders': 'Blackbutt',
      'Channel Country': 'Blackbutt',
      'Maranoa/Warrego': 'Blackbutt',
      'Darling Downs/Burnett': 'Blackbutt',
      'North West/Gulf': 'Blackbutt',
      'Darwin-Daly': 'No tree data available',
      'Arnhem-Roper': 'No tree data available',
      'Victoria River-TennantCreek': 'No tree data available',
      'Alice Springs': 'No tree data available',
    },
    TreeSpecies6: {
      'South West': 'No tree data available',
      Pilbara: 'No tree data available',
      Kimberley: 'No tree data available',
      'Central West': 'No tree data available',
      'South Coastal': 'No tree data available',
      'Goldfields/Eucla': 'No tree data available',
      Gascoyne: 'No tree data available',
      'Central Wheat Belt': 'No tree data available',
      Interior: 'No tree data available',
      'North Coast': 'Loblolly Pine',
      'South Coast': 'Radiata Pine (high input)',
      'Northern Tablelands': 'Radiata Pine (high input)',
      'Southern Tablelands': 'Radiata Pine (high input)',
      'Northern Wheat/Sheep': 'Radiata Pine (high input)',
      'Southern Wheat/Sheep': 'Radiata Pine (high input)',
      Western: 'Radiata Pine (high input)',
      'North East': 'No tree data available',
      'East Coast': 'No tree data available',
      'Central North/Midlands/South East': 'No tree data available',
      'Central Plateau/Derwent Valley': 'No tree data available',
      'West/South Coast': 'No tree data available',
      'North West': 'No tree data available',
      'South East': 'No tree data available',
      Murray: 'No tree data available',
      'Mid-North/Flinders': 'No tree data available',
      Pastoral: 'No tree data available',
      'West Coast/Eyre': 'No tree data available',
      Mallee: 'Pinus Radiata (high input)',
      Wimmera: 'Pinus Radiata (high input)',
      'Northern Country': 'No tree data available',
      'North East Vic': 'No tree data available',
      'East Gippsland': 'No tree data available',
      'West/South Gippsland': 'No tree data available',
      Central: 'No tree data available',
      'South West Vic': 'No tree data available',
      'Central Highlands/Northern': 'Pinus Hybrids',
      'Central West/Flinders': 'Pinus Hybrids',
      'Channel Country': 'Pinus Hybrids',
      'Maranoa/Warrego': 'Pinus Hybrids',
      'Darling Downs/Burnett': 'Pinus Hybrids',
      'North West/Gulf': 'Pinus Hybrids',
      'Darwin-Daly': 'No tree data available',
      'Arnhem-Roper': 'No tree data available',
      'Victoria River-TennantCreek': 'No tree data available',
      'Alice Springs': 'No tree data available',
    },
  },

  /**
   * @description Nitrogen content of swine manure, by class
   * @inventory2022 Table A5.5.5.4
   * @units kg N/head/year
   */

  /**
   * @description Global warming potentials for refrigerants
   * @reference NGAF 2022 Table 23
   * @units kg CO2-e / kg refrigerant
   */
  REFRIGERANT_GWP: {
    'HFC-23': 12400,
    'HFC-32': 677,
    'HFC-41': 116,
    'HFC-43-10mee': 1650,
    'HFC-125': 3170,
    'HFC-134': 1120,
    'HFC-134a': 1300,
    'HFC-143': 328,
    'HFC-143a': 4800,
    'HFC-152a': 138,
    'HFC-227ea': 3350,
    'HFC-236fa': 8060,
    'HFC-245ca': 716,
    'HFC-245fa': 858,
    'HFC-365mfc': 804,
    R438A: 2432,
    R448A: 1497,
    'R-22': 1810,
    'Ammonia (R-717)': 0,
    'R-11': 4750,
    'R-12': 10900,
    'R-13': 14400,
    'R-23': 14800,
    'R-32': 675,
    'R-113': 6130,
    'R-114': 10000,
    'R-115': 7370,
    'R-116': 12200,
    'R-123': 77,
    'R-124': 609,
    'R-125': 3500,
    'R-134a': 1430,
    'R-141b': 725,
    'R-142b': 2310,
    'R-143a': 4470,
    'R-152a': 124,
    'R-218': 8830,
    'R-227ea': 3220,
    'R-236fa': 9810,
    'R-245ca': 693,
    'R-245fa': 1030,
    'R-C318': 10300,
    'R-401A': 1200,
    'R-401B': 1300,
    'R-401C': 930,
    'R-402A': 2800,
    'R-402B': 2400,
    'R-403A': 3100,
    'R-403B': 4500,
    'R-404A': 3900,
    'R-405A': 5300,
    'R-406A': 1900,
    'R-407A': 2100,
    'R-407B': 2800,
    'R-407C': 1800,
    'R-407D': 1600,
    'R-407E': 1600,
    'R-408A': 3200,
    'R-409A': 1600,
    'R-409B': 1600,
    'R-410A': 2100,
    'R-411A': 1600,
    'R-411B': 1700,
    'R-412A': 2300,
    'R-413A': 2100,
    'R-414A': 1500,
    'R-414B': 1400,
    'R-415A': 1500,
    'R-415B': 550,
    'R-416A': 1100,
    'R-417A': 2300,
    'R-418A': 1700,
    'R-419A': 3000,
    'R-420A': 1500,
    'R-421A': 2600,
    'R-421B': 3200,
    'R-422A': 3100,
    'R-422B': 2500,
    'R-422C': 3100,
    'R-422D': 2700,
    'R-423A': 2300,
    'R-424A': 2400,
    'R-425A': 1500,
    'R-426A': 1500,
    'R-427A': 2100,
    'R-428A': 3600,
    'R-500': 8100,
    'R-502': 4700,
    'R-503': 15000,
    'R-507A': 4000,
    'R-508A': 13000,
    'R-508B': 13000,
    'R-509A': 5700,
  },

  /**
   * @description Emissions factors for wastewater treatment
   */
  WASTEWATER: {
    TREATMENT_EF: {
      [FluidWasteTreatmentType.MANAGED_AEROBIC]: 0,
      [FluidWasteTreatmentType.UNMANAGED_AEROBIC]: 0.3,
      [FluidWasteTreatmentType.ANEAROBIC_DIGESTER_REACTOR]: 0.8,
      [FluidWasteTreatmentType.SHALLOW_ANEAROBIC_LAGOON_LT_2M]: 0.2,
      [FluidWasteTreatmentType.DEEP_ANEAROBIC_LAGOON_GT_2M]: 0.8,
    },
    F_SLUDGE_FRACTION: 0.15,
    EF_COD: (6.3 / 25) * 28,
    METHANE_PRODUCTION: 0.65,
    FLARE_EF: (0.00581193271889401 / 25) * 34,
  },

  /**
   * @description Emissions factors for composting
   * @reference NGA factors (2023)
   * @units t/t
   */
  COMPOSTING_EF: 0.046,

  /**
   * @description Emissions factors for municipal solid waste
   * @units t CO2-e/t
   */
  MUNICIPAL_SOLID_WASTE_EF: 1.6,

  /**
   * @description Emissions factors for freight, in kg CO2-e / tonne-km
   * @reference EUROPEAN CHEMICAL TRANSPORT ASSOCIATION, European Chemical Industry Council, CTA-CEFIC-GUIDELINE-FOR-MEASURING-AND-MANAGING-CO2.
   * @units kg CO2-e / tonne-km
   */
  FREIGHT_KG_TONNE_EF: {
    [FreightTypes.TRUCK]: 0.079875,
    [FreightTypes.RAIL]: 0.038,
    [FreightTypes.LONG_HAUL_FLIGHT]: 0.633,
    [FreightTypes.MEDIUM_HAUL_FLIGHT]: 0.8,
    [FreightTypes.SMALL_CONTAINER_SHIP]: 0.0135,
    [FreightTypes.LARGE_CONTAINER_SHIP]: 0.0115,
  },
};

export const allConstants: AllConstants = {
  COMMON: commonConstants,
  CROP: cropConstants,
  FISHERIES: fisheriesConstants,
  RICE: riceConstants,
  AQUACULTURE: aquacultureConstants,
  BEEF: beefConstants,
  BUFFALO: buffaloConstants,
  COTTON: cottonConstants,
  DAIRY: dairyConstants,
  DEER: deerConstants,
  FEEDLOT: feedlotConstants,
  GOAT: goatConstants,
  LIVESTOCK: livestockConstants,
  PORK: porkConstants,
  POULTRY: poultryConstants,
  SAVANNA: savannaConstants,
  SHEEP: sheepConstants,
  SUGAR: sugarConstants,
};
