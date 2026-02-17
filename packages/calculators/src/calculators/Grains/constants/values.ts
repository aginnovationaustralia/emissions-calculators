import {
  CommonConstants,
  CropConstants,
  STATES,
  SwineConstants,
} from './types';

export const commonConstants: CommonConstants = {
  // NGAF 2023 Table 10
  REFRIGERATION_LEAKAGE_RATES: {
    'Domestic refrigerators': 1.7,
    'Transport refrigeration': 15.7,
    'Domestic A/C portable': 2.5,
    'Domestic A/C split': 3.5,
    'Domestic A/C packaged': 2.5,
    'Light vehicle A/C': 6.7,
    'Heavy vehicle A/C': 10.8,
  },

  // NGAF 2023 Table 11
  REFRIGERANT_GWP: {
    R22: 1760,
    R32: 677,
    R134A: 1300,
    R410A: 1924,
    R404A: 3943,
  },

  /**
   * @description Total GHG (kg CO2-e/kg input)
   * @units kg CO2-e/kg
   */
  UREA_FERTILISER_GHG: 1.495,

  /**
   * @description Conversion factor for the global warming potential of N2O, as CO2-e
   */
  GWP_FACTORSC6: 265,

  /**
   * @description Conversion factor for elemental to molecular CO2
   */
  GWP_FACTORSC13: 44 / 12,
  /**
   * @description Conversion factor for elemental to molecular CH4
   */
  GWP_FACTORSC14: 16 / 12,

  GWP_FACTORSC15: 1,

  /**
   * @description Conversion factor for elemental to molecular CO2 from lime
   */
  GWP_FACTORSC18: 44 / 12,

  LIME_SCOPE3_EF: 0.432,

  AGROCHEMICAL_FACTORS: {
    Herbicide: 33,
    HerbicideOther: 18.6,
    Insecticide: 18.9,
    Fungicide: 12.6,
    PlantGrowthRegulator: 10.5,
  },

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

  // https://www.dcceew.gov.au/sites/default/files/documents/national-greenhouse-account-factors-2023.pdf
  // Table 2a kg CO2e/kWh
  ELECTRICITY_RMF_SCOPE2_EF: 0.81,
  ELECTRICITY_RMF_SCOPE3_EF: 0.1,

  // https://cer.gov.au/schemes/renewable-energy-target/renewable-energy-target-liability-and-exemptions/renewable-power-percentage
  RENEWABLE_POWER_PERCENTAGE: 16.67, // 2026

  // https://www.dcceew.gov.au/sites/default/files/documents/national-greenhouse-account-factors-2023.pdf
  JURISDICTIONAL_RENEWABLE_POWER_PERCENTAGE: 74.13, // 2023

  /**
   * @description Scope 1 and Scope 3 factors relating to fuel
   * @reference Table 6 and 7 (Dept of Industry, Science, Energy and Resources 2022)
   * @link https://www.dcceew.gov.au/sites/default/files/documents/national-greenhouse-account-factors-2023.pdf
   */
  FUEL_ENERGYGJ: {
    // NGAF 2023 Table 8
    STATIONARY: {
      'petroleum based oils': {
        ENERGY_CONTENT_FACTOR: 38.8,
        SCOPE1_EF: {
          CO2: 13.9,
          CH4: 0.0,
          N2O: 0.0,
        },
        SCOPE3_EF: 18.0,
      },
      'petroleum based greases': {
        ENERGY_CONTENT_FACTOR: 38.8,
        SCOPE1_EF: {
          CO2: 3.5,
          CH4: 0.0,
          N2O: 0.0,
        },
        SCOPE3_EF: 18.0,
      },
      'crude oil': {
        ENERGY_CONTENT_FACTOR: 45.3,
        SCOPE1_EF: {
          CO2: 69.6,
          CH4: 0.08,
          N2O: 0.2,
        },
        SCOPE3_EF: 0, // NE
      },
      'other natural gas liquids': {
        ENERGY_CONTENT_FACTOR: 46.5,
        SCOPE1_EF: {
          CO2: 61.0,
          CH4: 0.08,
          N2O: 0.2,
        },
        SCOPE3_EF: 0, // NE
      },
      'automotive petrol': {
        ENERGY_CONTENT_FACTOR: 34.2,
        SCOPE1_EF: {
          CO2: 67.4,
          CH4: 0.02,
          N2O: 0.2,
        },
        SCOPE3_EF: 17.2,
      },
      'aviation gasoline': {
        ENERGY_CONTENT_FACTOR: 33.1,
        SCOPE1_EF: {
          CO2: 67.0,
          CH4: 0.06,
          N2O: 0.6,
        },
        SCOPE3_EF: 18.0,
      },
      kerosene: {
        ENERGY_CONTENT_FACTOR: 37.5,
        SCOPE1_EF: {
          CO2: 68.9,
          CH4: 0.01,
          N2O: 0.2,
        },
        SCOPE3_EF: 18.0,
      },
      'aviation turbine fuel/kerosene': {
        ENERGY_CONTENT_FACTOR: 36.8,
        SCOPE1_EF: {
          CO2: 69.6,
          CH4: 0.02,
          N2O: 0.2,
        },
        SCOPE3_EF: 18.0,
      },
      'heating oil': {
        ENERGY_CONTENT_FACTOR: 37.3,
        SCOPE1_EF: {
          CO2: 69.5,
          CH4: 0.03,
          N2O: 0.2,
        },
        SCOPE3_EF: 18.0,
      },
      'diesel oil': {
        ENERGY_CONTENT_FACTOR: 38.6,
        SCOPE1_EF: {
          CO2: 69.9,
          CH4: 0.01,
          N2O: 0.5,
        },
        SCOPE3_EF: 17.3,
      },
      'fuel oil': {
        ENERGY_CONTENT_FACTOR: 39.7,
        SCOPE1_EF: {
          CO2: 73.6,
          CH4: 0.08,
          N2O: 0.5,
        },
        SCOPE3_EF: 18.0,
      },
      'liquefied aromatic hydrocarbons': {
        ENERGY_CONTENT_FACTOR: 34.4,
        SCOPE1_EF: {
          CO2: 69.7,
          CH4: 0.03,
          N2O: 0.2,
        },
        SCOPE3_EF: 18.0,
      },
      solvents: {
        ENERGY_CONTENT_FACTOR: 34.4,
        SCOPE1_EF: {
          CO2: 69.7,
          CH4: 0.03,
          N2O: 0.2,
        },
        SCOPE3_EF: 18.0,
      },
      lpg: {
        ENERGY_CONTENT_FACTOR: 25.7,
        SCOPE1_EF: {
          CO2: 60.2,
          CH4: 0.5,
          N2O: 0.3,
        },
        SCOPE3_EF: 20.2,
      },
      naphtha: {
        ENERGY_CONTENT_FACTOR: 31.4,
        SCOPE1_EF: {
          CO2: 69.8,
          CH4: 0.01,
          N2O: 0.01,
        },
        SCOPE3_EF: 18.0,
      },
      'petroleum coke': {
        ENERGY_CONTENT_FACTOR: 34.2,
        SCOPE1_EF: {
          CO2: 92.6,
          CH4: 0.08,
          N2O: 0.2,
        },
        SCOPE3_EF: 18.0,
      },
      'refinery gas and liquids': {
        ENERGY_CONTENT_FACTOR: 42.9,
        SCOPE1_EF: {
          CO2: 54.7,
          CH4: 0.03,
          N2O: 0.03,
        },
        SCOPE3_EF: 18.0,
      },
      'refinery coke': {
        ENERGY_CONTENT_FACTOR: 34.2,
        SCOPE1_EF: {
          CO2: 92.6,
          CH4: 0.08,
          N2O: 0.2,
        },
        SCOPE3_EF: 18.0,
      },
      'other petroleum products': {
        ENERGY_CONTENT_FACTOR: 34.4,
        SCOPE1_EF: {
          CO2: 69.8,
          CH4: 0.02,
          N2O: 0.1,
        },
        SCOPE3_EF: 18.0,
      },
      biodiesel: {
        ENERGY_CONTENT_FACTOR: 34.6,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.08,
          N2O: 0.2,
        },
        SCOPE3_EF: 0.0, // NE
      },
      ethanol: {
        ENERGY_CONTENT_FACTOR: 23.4,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.08,
          N2O: 0.2,
        },
        SCOPE3_EF: 0.0, // NE
      },
      'other biofuels': {
        ENERGY_CONTENT_FACTOR: 23.4,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.08,
          N2O: 0.2,
        },
        SCOPE3_EF: 0.0, // NE
      },
      'renewable aviation kerosone': {
        ENERGY_CONTENT_FACTOR: 36.8,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.02,
          N2O: 0.2,
        },
        SCOPE3_EF: 0.0, // NE
      },
      'renewable diesel': {
        ENERGY_CONTENT_FACTOR: 38.6,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.1,
          N2O: 0.2,
        },
        SCOPE3_EF: 0.0, // NE
      },
    },
    // NGAF 2023 Table 9
    TRANSPORT: {
      gasoline: {
        ENERGY_CONTENT_FACTOR: 34.2,
        SCOPE1_EF: {
          CO2: 67.4,
          CH4: 0.02,
          N2O: 0.2,
        },
        SCOPE3_EF: 17.2,
      },
      diesel: {
        ENERGY_CONTENT_FACTOR: 38.6,
        SCOPE1_EF: {
          CO2: 69.9,
          CH4: 0.01,
          N2O: 0.5,
        },
        SCOPE3_EF: 17.3,
      },
      lpg: {
        ENERGY_CONTENT_FACTOR: 26.2,
        SCOPE1_EF: {
          CO2: 60.2,
          CH4: 0.5,
          N2O: 0.3,
        },
        SCOPE3_EF: 20.2,
      },
      'fuel oil': {
        ENERGY_CONTENT_FACTOR: 39.7,
        SCOPE1_EF: {
          CO2: 73.6,
          CH4: 0.08,
          N2O: 0.5,
        },
        SCOPE3_EF: 18.0,
      },
      ethanol: {
        ENERGY_CONTENT_FACTOR: 23.4,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.08,
          N2O: 0.2,
        },
        SCOPE3_EF: 0.0, // NE
      },
      biodiesel: {
        ENERGY_CONTENT_FACTOR: 34.6,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.08,
          N2O: 0.2,
        },
        SCOPE3_EF: 0.0, // NE
      },
      'renewable diesel': {
        ENERGY_CONTENT_FACTOR: 38.6,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.01,
          N2O: 0.5,
        },
        SCOPE3_EF: 0.0, // NE
      },
      'other biofuels': {
        ENERGY_CONTENT_FACTOR: 23.4,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.08,
          N2O: 0.2,
        },
        SCOPE3_EF: 0.0, // NE
      },
      lng: {
        ENERGY_CONTENT_FACTOR: 25.3,
        SCOPE1_EF: {
          CO2: 51.4,
          CH4: 7.3,
          N2O: 0.3,
        },
        SCOPE3_EF: 18.0,
      },
      'aviation gasoline': {
        ENERGY_CONTENT_FACTOR: 33.1,
        SCOPE1_EF: {
          CO2: 67.0,
          CH4: 0.06,
          N2O: 0.6,
        },
        SCOPE3_EF: 18.0,
      },
      'aviation kerosene': {
        ENERGY_CONTENT_FACTOR: 36.8,
        SCOPE1_EF: {
          CO2: 69.6,
          CH4: 0.01,
          N2O: 0.6,
        },
        SCOPE3_EF: 18.0,
      },
      'aviation renewable kerosone': {
        ENERGY_CONTENT_FACTOR: 36.8,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.01,
          N2O: 0.6,
        },
        SCOPE3_EF: 0.0, // NE
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
   * @description Scope 1 and Scope 3 values relating to liming
   * @inventory2018 3G_1
   * @reference Mudahar, M.S., Hignett, T.P., 1982. Energy and Fertilizer-- Policy Implications and Options for Developing Countries. International Fertilizer Development Center, Muscle Shoals, Alabama
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

  // Taken from AusLCI CEF V47 2026
  SERVICE_EMISSIONS_BY_AREA: {
    'Air blast spraying, orchards': 37.88,
    'Bed forming, cotton': 26.58,
    'Bed forming, horticulture': 38.55,
    'Boom spraying, cotton': 2.33,
    'Boom spraying, horticulture': 8.31,
    'Control of brigalow suckers, graslan aerial application': 35.78,
    'Cultivating, broadacre crop, controlled traffic': 28.92,
    'Cultivating, broadacre crop, conventional': 45.19,
    'Cultivating, cotton': 16.62,
    'Cultivating, large implement, horticulture': 61.48,
    'Cultivating, medium implement, horticulture': 32.9,
    'Disc ploughing, broadacre crop, controlled traffic': 29.12,
    'Disc ploughing, broadacre crop, conventional': 45.49,
    'Discing, cotton': 31.57,
    'Fertiliser application, cotton': 19.61,
    'Fertiliser side dressing, horticulture': 13.96,
    'Fertiliser spreading, cotton': 7.64,
    'Fertiliser spreading, horticulture': 6.65,
    'Fertilizing, broadacre crop, pre & post-emergence, controlled traffic': 1.74,
    'Fertilizing, broadacre crop, pre & post-emergence, conventional': 2.33,
    'Grader operation, broadacre crop, medium load factor, controlled traffic': 52.36,
    'Grader operation, broadacre crop, medium load factor, conventional': 67.73,
    'Grain collection, broadacre, in-field with tractor and bin, controlled traffic': 5.23,
    'Grain collection, broadacre, in-field with tractor and bin, conventional': 6.98,
    'Harrowing, horticulture': 9.3,
    'Harvesting, broadacre crop, combine less than 200kW, controlled traffic': 26.72,
    'Harvesting, broadacre crop, combine less than 200kW, conventional': 39.88,
    'Harvesting, cotton': 132.92,
    'Harvesting, specialised machine, horticulture, 150 kW combine': 365.54,
    'Hay baling, large square bales, broadacre crop, controlled traffic': 5.78,
    'Hay baling, large square bales, broadacre crop, conventional': 7.71,
    'Hay baling, round bales, broadacre crop, controlled traffic': 6.31,
    'Hay baling, round bales, broadacre crop, conventional': 8.41,
    'Hay baling, small square bales, broadacre crop, controlled traffic': 5.26,
    'Hay baling, small square bales, broadacre crop, conventional': 7.01,
    'Hay mowing, broadacre crop, controlled traffic': 11.41,
    'Hay mowing, broadacre crop, conventional': 15.22,
    'Hay raking, broadacre crop, controlled traffic': 1.02,
    'Hay raking, broadacre crop, conventional': 1.36,
    'Inter-row cultivation, horticulture': 29.91,
    'Inter-row tractor, horticulture': 29.91,
    'Irrigation, centre pivot irrigation system': 0.14,
    'Irrigation, hose move sprinkler system': 0.14,
    'Irrigation, pipe irrigation system': 0.14,
    'Irrigation, solid set irrigation system': 0.14,
    'Irrigation, travel spray boom irrigation system': 0.14,
    'Irrigation, under tree irrigation system': 0.14,
    'Irrigation,flood or furrow irrigation': 0.04,
    'Irrigation,travelling gun irrigation system': 0.14,
    'Levelling, cotton': 146.21,
    'Liming, broadacre crop, pre & post-emergence, controlled traffic': 2.87,
    'Liming, broadacre crop, pre & post-emergence, conventional': 3.82,
    'Mulching, cotton': 25.59,
    'Offset disc harrowing, horticulture': 57.16,
    'Picking, cotton': 72.44,
    'Planting, broadacre crop, soil clay content 0 to 10%, controlled traffic': 8.47,
    'Planting, broadacre crop, soil clay content 0 to 10%, conventional': 11.3,
    'Planting, broadacre crop, soil clay content 10 to 20%, controlled traffic': 7.9,
    'Planting, broadacre crop, soil clay content 10 to 20%, conventional': 14.62,
    'Planting, broadacre crop, soil clay content greater than 20%, controlled traffic': 11.13,
    'Planting, broadacre crop, soil clay content greater than 20%, conventional': 20.6,
    'Planting, cotton': 11.63,
    'Precision planting, horticulture': 69.12,
    'Ripping, large implement, horticulture': 112.98,
    'Ripping, medium implement, horticulture': 69.78,
    'Rolling, cotton': 10.3,
    'Root cutting, cotton': 11.3,
    'Rotary hoeing, medium implement, horticulture': 154.85,
    'Savanna burning, northern Australia woodland, Qld & NT': 418.58,
    'Savanna burning, open eucalypt woodland, late dry season, Qld & NT': 335.32,
    'Scarifiying, broadacre crop, controlled traffic': 17.0,
    'Scarifiying, broadacre crop, conventional': 22.66,
    'Seedling transplanting, horticulture': 54.17,
    'Spraying, aerial, broadacre crop': 5.84,
    'Spraying, aerial, cotton': 4.86,
    'Spraying, aerial, rice': 30.61,
    'Spraying, broadacre crop, pre & post-emergence, controlled traffic': 1.74,
    'Spraying, broadacre crop, pre & post-emergence, conventional': 2.33,
    'Windrowing, broadacre crop, controlled traffic': 11.96,
    'Windrowing, broadacre crop, conventional': 15.95,
  },
  SERVICE_EMISSIONS_BY_HOUR: {
    'Bulldozer operation, medium load factor': 96.74,
  },

  // Appendix A1 Table A.4.1.1
  SOLID_WASTE_LANDFILL_EF: {
    'Food waste': 2.1,
    'Paper and cardboard': 3.3,
    'Green waste': 1.6,
    Wood: 0.7,
    Textiles: 2.0,
    Sludge: 0.4,
    'Rubber and leather': 3.3,
    'Inert waste': 0,
    'Municipal solid waste': 1.6,
    'Commercial waste': 1.3,
    'Industrial waste': 1.3,
    'Construction and demolition waste': 0.2,
  },

  // Appendix A1 Table A.4.1.1
  SOLID_WASTE_INCINERATION_EF: {
    'Food waste': 0,
    'Green waste': 0,
    Wood: 0,
    Sludge: 0,
    'Paper and cardboard': 0.0169,
    Textiles: 0.3667,
    'Rubber and leather': 0.4919,
    'Inert waste': 0.11,
    'Municipal solid waste': 0.0537,
    'Industrial waste': 1.649,
  },
  SOLID_WASTE_COMPOSTING_EF: 0.046,
  SOLID_WASTE_ANAEROBIC_DIGESTION_EF: 0.028,

  // Appendix A1 Table A.4.1.2
  SOLID_WASTE_BY_VOLUME_TO_MASS: {
    'Food waste': 0.5,
    'Paper and cardboard': 0.09,
    'Green waste': 0.24,
    Wood: 0.15,
    Textiles: 0.14,
    Sludge: 0.72,
    'Rubber and leather': 0.14,
    'Inert waste': 0.42,
    'Municipal solid waste': 0.36,
    'Commercial waste': 0.33,
    'Industrial waste': 0.33,
    'Construction and demolition waste': 0.39,
  },
};

export const cropConstants: CropConstants = {
  /**
   * @description Fraction of N in inorganic fertiliser types. Table A.2.2.6, A.2.2.7, A.2.2.9
   */
  /*
  Volatilises
  Fertiliser type f FracGASFf
  Other fertilisers 0.11 // TODO: There aren't any other fertilisers in the other lists of fertiliser types
  */
  /*
 // REVISIT: Appendix Table 3.1 includes SSP but this is not in other fertiliser tables
 Scope 3 EF
Single Super Phosphate (SSP) 0.26
*/
  INORGANIC_FERTILISER_FRACTIONS: {
    'Monoammonium phosphate': {
      N: 0.1,
      Urea: 0,
      Volatilises: 0.08,
      Scope3EF: 0.83,
    },
    'Diammonium Phosphate': {
      N: 0.18,
      Urea: 0,
      Volatilises: 0.08,
      Scope3EF: 1.0,
    },
    Urea: { N: 0.46, Urea: 1, Volatilises: 0.15, Scope3EF: 1.5 },
    'Sulphate of Ammonia': {
      N: 0.21,
      Urea: 0,
      Volatilises: 0.08,
      Scope3EF: 0.75,
    },
    'Urea-Ammonium Nitrate': {
      N: 0.32,
      Urea: 0.35,
      Volatilises: 0.05,
      Scope3EF: 1.09,
    },
    'Ammonium nitrate': {
      N: 0.337,
      Urea: 0,
      Volatilises: 0.05,
      Scope3EF: 1.09,
    },
    'Calcium Ammonium Nitrate': {
      N: 0.27,
      Urea: 0,
      Volatilises: 0.05,
      Scope3EF: 0.88,
    },
  },

  // TODO: Waiting on data from CRC
  INORGANIC_FERTILISER_FRACTIONS_BY_REGION: {
    Ammonia: {
      China: 0.0,
      Yemen: 0.0,
      Canada: 0.0,
      Unspecified: 0.0,
    },
    Urea: {
      China: 0.0,
      Yemen: 0.0,
      Canada: 0.0,
      Unspecified: 0.0,
    },
  },
  INORGANIC_FERTILISER_FRACTIONS_BY_NON_REGIONAL: {
    // TODO: Waiting on data from CRC
    'Monoammonium phosphate': 0.0,
    'Diammonium Phosphate': 0.0,
    'Urea-Ammonium Nitrate': 0.0,
    'Ammonium Nitrate': 0.0,
    'Calcium Ammonium Nitrate': 0.0,
    'Sulphate of Ammonia': 0.0,
    'Nitrogen - Generic': 0.0,
    'Nitrogen - Nitrate': 0.0,
    'Nitrogen - Ammonia': 0.0,
    'Muriate of Potash': 0.0,
    'Single superphosphate': 0.0,
    'Double Superphosphate': 0.0,
    'Phosphorus - Generic': 0.0,
    'Potassium - Generic': 0.0,
    'Sulfur - Generic': 0.0,
    'Zinc - Generic': 0.0,
    'Calcium - Generic lime as proxy': 0.0,
  },

  ORGANIC_FERTILISER_FRACTIONS: {
    'Dairy cattle': { N: 0.029 },
    'Beef cattle': { N: 0.023 },
    Poultry: { N: 0.51 },
    Swine: { N: 0.41 },
    Sheep: { N: 0.033 },
    'Horses/Mules': { N: 0.013 },
  },

  /**
   * @description Methane emissions factor for savannah burning
   * @inventory2022 Table 5.31
   * @units Gg element / Gg burnt
   */
  BURNING_METHANE_EF: 0.0035,

  /**
   * @description N2O emissions factor for savannah burning
   * @inventory2022 Table 5.31
   * @units Gg element / Gg burnt
   */
  BURNING_N2O_EF: 0.0076,

  // A.2.1.4
  EF_RESIDUES_RETURNED_TO_SOIL: {
    wet: 0.006,
    dry: 0.005,
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
  },

  PASTURERESIDUE: {
    'Annual grass': {
      averageYield: 4.41,
      belowAboveResidueRatio: 0.4,
      aboveGroundN: 0.015,
      belowGroundN: 0.012,
      fractionRemoved: 0.8,
    },
    'Grass clover mixture': {
      averageYield: 8.34,
      belowAboveResidueRatio: 0.8,
      aboveGroundN: 0.025,
      belowGroundN: 0.016,
      fractionRemoved: 0.8,
    },
    Lucerne: {
      averageYield: 8.62,
      belowAboveResidueRatio: 0.4,
      aboveGroundN: 0.027,
      belowGroundN: 0.019,
      fractionRemoved: 0.8,
    },
    'Other legume': {
      averageYield: 5.62,
      belowAboveResidueRatio: 0.4,
      aboveGroundN: 0.027,
      belowGroundN: 0.022,
      fractionRemoved: 0.8,
    },
    'Perennial pasture': {
      averageYield: 8.35,
      belowAboveResidueRatio: 0.8,
      aboveGroundN: 0.015,
      belowGroundN: 0.012,
      fractionRemoved: 0.8,
    },
  },

  EF_N2O_PRODUCTION_SYSTEM: {
    'Irrigated pasture': 0.0059,
    'Irrigated crop (low rainfall)': 0.0029,
    'Irrigated crop (high rainfall)': 0.008,
    'Irrigated crop': 0.007,
    'Non-irrigated pasture': 0.0018,
    'Non-irrigated crops': 0.0041,
    Sugar: 0.0199,
    Cotton: 0.0053,
    'Horticultural crops': 0.0064,
    'Rice (continuous flooding)': 0.003,
    'Rice (single and multiple drainage, or alternate wetting and drying)': 0.005,
    Aquaculture: 0.0026,
    Forestry: 0.0018,
  },

  // FracGASMsoil
  FRACTION_N_VOLATILISED_ORGANIC_FERTILISER: 0.21,

  // FracLeach
  FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF: 0.24,

  // EF leach
  EF_N2O_LEACHING_AND_RUNOFF: 0.011,
};

export const swineConstants: SwineConstants = {
  // A.1.6.2
  // A.1.6.3
  MMS: {
    'Outdoor (Dry lot)': {
      N_VOLATISED_EF: 0.3,
      N2O_EF: 0.02,
    },
    'Deep litter': {
      N_VOLATISED_EF: 0.125,
      N2O_EF: 0.01,
    },
    'Stockpile (Solid storage)': {
      N_VOLATISED_EF: 0.2,
      N2O_EF: 0.005,
    },
    'Effluent pond (Uncovered anaerobic lagoon)': {
      N_VOLATISED_EF: 0.55,
      N2O_EF: 0,
    },
    'Anaerobic digester / Covered lagoon': {
      N_VOLATISED_EF: 0,
      N2O_EF: 0,
    },
    'Short HRT tank storage < 1 month (pit storage)': {
      N_VOLATISED_EF: 0.25,
      N2O_EF: 0.002,
    },
  },
};
