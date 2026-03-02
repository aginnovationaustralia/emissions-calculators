import { CommonConstantsWithNumbers } from './strong-types';
import { STATES } from './types';

export const commonConstantsWithNumbers: CommonConstantsWithNumbers = {
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
  // National Inventory Report Volume 1 [6, p. 1]
  EF_UREA_CO2: 0.2,

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

  GWP_FACTORSC15: 44 / 28,

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
  // NGAF 2023 Table 1
  ELECTRICITY: {
    [STATES.NSW]: {
      SCOPE2_EF: 0.68,
      SCOPE3_EF: 0.05,
    },
    [STATES.ACT]: {
      SCOPE2_EF: 0.68,
      SCOPE3_EF: 0.05,
    },
    [STATES.VIC]: {
      SCOPE2_EF: 0.79,
      SCOPE3_EF: 0.07,
    },
    [STATES.QLD]: {
      SCOPE2_EF: 0.73,
      SCOPE3_EF: 0.15,
    },
    [STATES.SA]: {
      SCOPE2_EF: 0.25,
      SCOPE3_EF: 0.08,
    },
    [STATES.WA_SW]: {
      SCOPE2_EF: 0.53,
      SCOPE3_EF: 0.04,
    },
    [STATES.WA_NW]: {
      SCOPE2_EF: 0.62,
      SCOPE3_EF: 0.07,
    },
    [STATES.TAS]: {
      SCOPE2_EF: 0.12,
      SCOPE3_EF: 0.01,
    },
    [STATES.NT]: {
      SCOPE2_EF: 0.54,
      SCOPE3_EF: 0.07,
    },
    Australia: {
      SCOPE2_EF: 0.65,
      SCOPE3_EF: 0.08,
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

  // NGAF 2023 Table 9
  TRANSPORT_FUEL_FACTORS: {
    'Cars and light commercial vehicles': {
      Gasoline: {
        ENERGY_CONTENT_FACTOR: 34.2,
        SCOPE1_EF: {
          CO2: 67.4,
          CH4: 0.02,
          N2O: 0.2,
        },
        SCOPE3_EF: 17.2,
      },
      'Diesel oil': {
        ENERGY_CONTENT_FACTOR: 38.6,
        SCOPE1_EF: {
          CO2: 69.9,
          CH4: 0.01,
          N2O: 0.5,
        },
        SCOPE3_EF: 17.3,
      },
      'Liquefied petroleum gas (LPG)': {
        ENERGY_CONTENT_FACTOR: 26.2,
        SCOPE1_EF: {
          CO2: 60.2,
          CH4: 0.5,
          N2O: 0.3,
        },
        SCOPE3_EF: 20.2,
      },
      'Fuel oil': {
        ENERGY_CONTENT_FACTOR: 39.7,
        SCOPE1_EF: {
          CO2: 73.6,
          CH4: 0.08,
          N2O: 0.5,
        },
        SCOPE3_EF: 18.0,
      },
      Ethanol: {
        ENERGY_CONTENT_FACTOR: 23.4,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.2,
          N2O: 0.2,
        },
        SCOPE3_EF: 0.0, // NE
      },
      Biodiesel: {
        ENERGY_CONTENT_FACTOR: 34.6,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.8,
          N2O: 1.7,
        },
        SCOPE3_EF: 0.0, // NE
      },
      'Renewable diesel': {
        ENERGY_CONTENT_FACTOR: 38.6,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.01,
          N2O: 0.5,
        },
        SCOPE3_EF: 0.0, // NE
      },
      'Other biofuels': {
        ENERGY_CONTENT_FACTOR: 23.4,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.8,
          N2O: 1.7,
        },
        SCOPE3_EF: 0.0, // NE
      },
    },
    'Cars and light commercial vehicles (pre 2004)': {
      Gasoline: {
        ENERGY_CONTENT_FACTOR: 34.2,
        SCOPE1_EF: {
          CO2: 67.4,
          CH4: 0.6,
          N2O: 1.6,
        },
        SCOPE3_EF: 17.2,
      },
      'Diesel oil': {
        ENERGY_CONTENT_FACTOR: 38.6,
        SCOPE1_EF: {
          CO2: 69.9,
          CH4: 0.1,
          N2O: 0.4,
        },
        SCOPE3_EF: 17.3,
      },
      'Liquefied petroleum gas (LPG)': {
        ENERGY_CONTENT_FACTOR: 26.2,
        SCOPE1_EF: {
          CO2: 60.2,
          CH4: 0.7,
          N2O: 0.6,
        },
        SCOPE3_EF: 20.2,
      },

      Ethanol: {
        ENERGY_CONTENT_FACTOR: 23.4,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.8,
          N2O: 1.7,
        },
        SCOPE3_EF: 0.0, // NE
      },

      'Renewable diesel': {
        ENERGY_CONTENT_FACTOR: 38.6,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.01,
          N2O: 0.5,
        },
        SCOPE3_EF: 0.0, // NE
      },
    },
    'Light duty vehicles': {
      'Compressed natural gas': {
        /* REVISIT: NGAF table 9 bullet point states: "For compressed natural gas, emission factors are for gas that has converted to standard conditions."
         * I believe this implies converting back to GJ/kL */
        ENERGY_CONTENT_FACTOR: 0.0393 / 1000,
        SCOPE1_EF: {
          CO2: 51.4,
          CH4: 7.3,
          N2O: 0.3,
        },
        SCOPE3_EF: 18.0,
      },
      'Liquefied natural gas': {
        ENERGY_CONTENT_FACTOR: 25.3,
        SCOPE1_EF: {
          CO2: 51.4,
          CH4: 7.3,
          N2O: 0.3,
        },
        SCOPE3_EF: 18.0,
      },
    },
    'Heavy duty vehicles': {
      'Compressed natural gas': {
        /* REVISIT: NGAF table 9 bullet point states: "For compressed natural gas, emission factors are for gas that has converted to standard conditions."
         * I believe this implies converting back to GJ/kL */
        ENERGY_CONTENT_FACTOR: 0.0393 / 1000,
        SCOPE1_EF: {
          CO2: 51.4,
          CH4: 2.8,
          N2O: 0.3,
        },
        SCOPE3_EF: 18.0,
      },
      'Liquefied natural gas': {
        ENERGY_CONTENT_FACTOR: 25.3,
        SCOPE1_EF: {
          CO2: 51.4,
          CH4: 2.8,
          N2O: 0.3,
        },
        SCOPE3_EF: 18.0,
      },
      'Diesel oil - Euro iv or higher': {
        ENERGY_CONTENT_FACTOR: 38.6,
        SCOPE1_EF: {
          CO2: 69.9,
          CH4: 0.07,
          N2O: 0.4,
        },
        SCOPE3_EF: 17.3,
      },
      'Diesel oil - Euro iii': {
        ENERGY_CONTENT_FACTOR: 38.6,
        SCOPE1_EF: {
          CO2: 69.9,
          CH4: 0.1,
          N2O: 0.4,
        },
        SCOPE3_EF: 17.3,
      },
      'Diesel oil - Euro i': {
        ENERGY_CONTENT_FACTOR: 38.6,
        SCOPE1_EF: {
          CO2: 69.9,
          CH4: 0.2,
          N2O: 0.4,
        },
        SCOPE3_EF: 17.3,
      },
      'Renewable diesel - Euro iv or higher': {
        ENERGY_CONTENT_FACTOR: 38.6,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.07,
          N2O: 0.4,
        },
        SCOPE3_EF: 0.0, // NE
      },
      'Renewable diesel - Euro iii': {
        ENERGY_CONTENT_FACTOR: 38.6,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.1,
          N2O: 0.4,
        },
        SCOPE3_EF: 0.0, // NE
      },
      'Renewable diesel - Euro i': {
        ENERGY_CONTENT_FACTOR: 38.6,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.2,
          N2O: 0.4,
        },
        SCOPE3_EF: 0.0, // NE
      },
    },
    Aviation: {
      'Gasoline for use as fuel in an aircraft': {
        ENERGY_CONTENT_FACTOR: 33.1,
        SCOPE1_EF: {
          CO2: 67.0,
          CH4: 0.06,
          N2O: 0.6,
        },
        SCOPE3_EF: 18.0,
      },
      'Kerosene for use as fuel in an aircraft': {
        ENERGY_CONTENT_FACTOR: 36.8,
        SCOPE1_EF: {
          CO2: 69.6,
          CH4: 0.01,
          N2O: 0.6,
        },
        SCOPE3_EF: 18.0,
      },
      'Renewable aviation kerosene': {
        ENERGY_CONTENT_FACTOR: 36.8,
        SCOPE1_EF: {
          CO2: 0.0,
          CH4: 0.01,
          N2O: 0.6,
        },
        SCOPE3_EF: 0.0, // NE
      },
    },
    Vessel: {
      Petrol: {
        ENERGY_CONTENT_FACTOR: 34.2,
        SCOPE1_EF: {
          CO2: 67.4,
          CH4: 10.1,
          N2O: 0.3,
        },
        SCOPE3_EF: 17.2,
      },
      Diesel: {
        ENERGY_CONTENT_FACTOR: 38.6,
        SCOPE1_EF: {
          CO2: 69.9,
          CH4: 0.2,
          N2O: 0.5,
        },
        SCOPE3_EF: 17.3,
      },
      'Fuel Oil': {
        ENERGY_CONTENT_FACTOR: 39.7,
        SCOPE1_EF: {
          CO2: 73.6,
          CH4: 0.2,
          N2O: 0.5,
        },
        SCOPE3_EF: 18.0,
      },
    },
    'Off-road Agriculture and forestry equipment': {
      Diesel: {
        ENERGY_CONTENT_FACTOR: 38.6,
        SCOPE1_EF: {
          CO2: 69.9,
          CH4: 0.3,
          N2O: 0.5,
        },
        SCOPE3_EF: 17.3,
      },
    },
  },

  // NGAF table 4
  STATIONARY_FUEL_FACTORS: {
    'Solid fuels': {
      'Bituminous coal': {
        ENERGY_CONTENT_FACTOR: 27,
        SCOPE1_EF: {
          CO2: 90,
          CH4: 0.04,
          N2O: 0.2,
        },
        SCOPE3_EF: 3,
      },
      'Sub-bituminous coal': {
        ENERGY_CONTENT_FACTOR: 21,
        SCOPE1_EF: {
          CO2: 90,
          CH4: 0.04,
          N2O: 0.2,
        },
        SCOPE3_EF: 2.5,
      },
      Anthracite: {
        ENERGY_CONTENT_FACTOR: 29,
        SCOPE1_EF: {
          CO2: 90,
          CH4: 0.04,
          N2O: 0.2,
        },
        SCOPE3_EF: 0,
      },
      'Brown coal (lignite)': {
        ENERGY_CONTENT_FACTOR: 10.2,
        SCOPE1_EF: {
          CO2: 93.5,
          CH4: 0.02,
          N2O: 0.3,
        },
        SCOPE3_EF: 0.4,
      },
      'Coking coal': {
        ENERGY_CONTENT_FACTOR: 30,
        SCOPE1_EF: {
          CO2: 91.8,
          CH4: 0.03,
          N2O: 0.2,
        },
        SCOPE3_EF: 6.4,
      },
      'Coal briquettes': {
        ENERGY_CONTENT_FACTOR: 22.1,
        SCOPE1_EF: {
          CO2: 95,
          CH4: 0.08,
          N2O: 0.3,
        },
        SCOPE3_EF: 0,
      },
      'Coal coke': {
        ENERGY_CONTENT_FACTOR: 27,
        SCOPE1_EF: {
          CO2: 107,
          CH4: 0.03,
          N2O: 0.2,
        },
        SCOPE3_EF: 0,
      },
      'Coal tar': {
        ENERGY_CONTENT_FACTOR: 37.5,
        SCOPE1_EF: {
          CO2: 81.8,
          CH4: 0.03,
          N2O: 0.2,
        },
        SCOPE3_EF: 0,
      },
      'Other solid fossil fuels': {
        ENERGY_CONTENT_FACTOR: 22.1,
        SCOPE1_EF: {
          CO2: 95,
          CH4: 0.08,
          N2O: 0.2,
        },
        SCOPE3_EF: 0,
      },
      'Industrial materials derived from fossil fuels': {
        ENERGY_CONTENT_FACTOR: 26.3,
        SCOPE1_EF: {
          CO2: 81.6,
          CH4: 0.03,
          N2O: 0.2,
        },
        SCOPE3_EF: 0,
      },
      'Passenger car tyres': {
        ENERGY_CONTENT_FACTOR: 32,
        SCOPE1_EF: {
          CO2: 62.8,
          CH4: 0.03,
          N2O: 0.2,
        },
        SCOPE3_EF: 0,
      },
      'Truck and off-road tyres': {
        ENERGY_CONTENT_FACTOR: 27.1,
        SCOPE1_EF: {
          CO2: 55.9,
          CH4: 0.03,
          N2O: 0.2,
        },
        SCOPE3_EF: 0,
      },
      'Non-biomass municipal materials': {
        ENERGY_CONTENT_FACTOR: 10.5,
        SCOPE1_EF: {
          CO2: 87.1,
          CH4: 0.8,
          N2O: 1,
        },
        SCOPE3_EF: 0,
      },
      'Dry wood': {
        ENERGY_CONTENT_FACTOR: 16.2,
        SCOPE1_EF: {
          CO2: 0,
          CH4: 0.1,
          N2O: 1.1,
        },
        SCOPE3_EF: 0,
      },
      'Green and air dried wood': {
        ENERGY_CONTENT_FACTOR: 10.4,
        SCOPE1_EF: {
          CO2: 0,
          CH4: 0.1,
          N2O: 1.1,
        },
        SCOPE3_EF: 0,
      },
      'Sulphite lyes': {
        ENERGY_CONTENT_FACTOR: 12.4,
        SCOPE1_EF: {
          CO2: 0,
          CH4: 0.08,
          N2O: 0.5,
        },
        SCOPE3_EF: 0,
      },
      Bagasse: {
        ENERGY_CONTENT_FACTOR: 9.6,
        SCOPE1_EF: {
          CO2: 0,
          CH4: 0.3,
          N2O: 1.1,
        },
        SCOPE3_EF: 0,
      },
      'Biomass,  municipal and industrial materials': {
        ENERGY_CONTENT_FACTOR: 12.2,
        SCOPE1_EF: {
          CO2: 0,
          CH4: 0.8,
          N2O: 1,
        },
        SCOPE3_EF: 0,
      },
      Charcoal: {
        ENERGY_CONTENT_FACTOR: 31.1,
        SCOPE1_EF: {
          CO2: 0,
          CH4: 5.3,
          N2O: 1,
        },
        SCOPE3_EF: 0,
      },
      'Other primary solid biomass fuels': {
        ENERGY_CONTENT_FACTOR: 12.2,
        SCOPE1_EF: {
          CO2: 0,
          CH4: 0.8,
          N2O: 1,
        },
        SCOPE3_EF: 0,
      },
    },

    // NGAF Table 8
    'Liquid fuels': {
      'Petroleum based oils other than fuels': {
        ENERGY_CONTENT_FACTOR: 38.8,
        SCOPE1_EF: {
          CO2: 13.9,
          CH4: 0.0,
          N2O: 0.0,
        },
        SCOPE3_EF: 18.0,
      },
      'Petroleum based greases': {
        ENERGY_CONTENT_FACTOR: 38.8,
        SCOPE1_EF: {
          CO2: 3.5,
          CH4: 0.0,
          N2O: 0.0,
        },
        SCOPE3_EF: 18.0,
      },
      'Crude oil and condensates': {
        ENERGY_CONTENT_FACTOR: 45.3,
        SCOPE1_EF: {
          CO2: 69.6,
          CH4: 0.08,
          N2O: 0.2,
        },
        SCOPE3_EF: 0, // NE
      },
      'Other natural gas liquids': {
        ENERGY_CONTENT_FACTOR: 46.5,
        SCOPE1_EF: {
          CO2: 61.0,
          CH4: 0.08,
          N2O: 0.2,
        },
        SCOPE3_EF: 0, // NE
      },
      'Automotive gasoline/petrol': {
        ENERGY_CONTENT_FACTOR: 34.2,
        SCOPE1_EF: {
          CO2: 67.4,
          CH4: 0.2,
          N2O: 0.2,
        },
        SCOPE3_EF: 17.2,
      },
      'Aviation gasoline': {
        ENERGY_CONTENT_FACTOR: 33.1,
        SCOPE1_EF: {
          CO2: 67.0,
          CH4: 0.2,
          N2O: 0.2,
        },
        SCOPE3_EF: 18.0,
      },
      Kerosene: {
        ENERGY_CONTENT_FACTOR: 37.5,
        SCOPE1_EF: {
          CO2: 68.9,
          CH4: 0.01,
          N2O: 0.2,
        },
        SCOPE3_EF: 18.0,
      },
      'Aviation turbine fuel/kerosene': {
        ENERGY_CONTENT_FACTOR: 36.8,
        SCOPE1_EF: {
          CO2: 69.6,
          CH4: 0.02,
          N2O: 0.2,
        },
        SCOPE3_EF: 18.0,
      },
      'Heating oil': {
        ENERGY_CONTENT_FACTOR: 37.3,
        SCOPE1_EF: {
          CO2: 69.5,
          CH4: 0.03,
          N2O: 0.2,
        },
        SCOPE3_EF: 18.0,
      },
      'Diesel oil': {
        ENERGY_CONTENT_FACTOR: 38.6,
        SCOPE1_EF: {
          CO2: 69.9,
          CH4: 0.1,
          N2O: 0.2,
        },
        SCOPE3_EF: 17.3,
      },
      'Fuel oil': {
        ENERGY_CONTENT_FACTOR: 39.7,
        SCOPE1_EF: {
          CO2: 73.6,
          CH4: 0.04,
          N2O: 0.2,
        },
        SCOPE3_EF: 18.0,
      },
      'Liquefied aromatic hydrocarbons': {
        ENERGY_CONTENT_FACTOR: 34.4,
        SCOPE1_EF: {
          CO2: 69.7,
          CH4: 0.03,
          N2O: 0.2,
        },
        SCOPE3_EF: 18.0,
      },
      'Solvents: mineral turpentine or white spirits': {
        ENERGY_CONTENT_FACTOR: 34.4,
        SCOPE1_EF: {
          CO2: 69.7,
          CH4: 0.03,
          N2O: 0.2,
        },
        SCOPE3_EF: 18.0,
      },
      'Liquefied petroleum gas': {
        ENERGY_CONTENT_FACTOR: 25.7,
        SCOPE1_EF: {
          CO2: 60.2,
          CH4: 0.2,
          N2O: 0.2,
        },
        SCOPE3_EF: 20.2,
      },
      Naphtha: {
        ENERGY_CONTENT_FACTOR: 31.4,
        SCOPE1_EF: {
          CO2: 69.8,
          CH4: 0.01,
          N2O: 0.01,
        },
        SCOPE3_EF: 18.0,
      },
      'Petroleum coke': {
        ENERGY_CONTENT_FACTOR: 34.2,
        SCOPE1_EF: {
          CO2: 92.6,
          CH4: 0.08,
          N2O: 0.2,
        },
        SCOPE3_EF: 18.0,
      },
      'Refinery gas and liquids': {
        ENERGY_CONTENT_FACTOR: 42.9,
        SCOPE1_EF: {
          CO2: 54.7,
          CH4: 0.03,
          N2O: 0.03,
        },
        SCOPE3_EF: 18.0,
      },
      'Refinery coke': {
        ENERGY_CONTENT_FACTOR: 34.2,
        SCOPE1_EF: {
          CO2: 92.6,
          CH4: 0.08,
          N2O: 0.2,
        },
        SCOPE3_EF: 18.0,
      },
      'Other petroleum products': {
        ENERGY_CONTENT_FACTOR: 34.4,
        SCOPE1_EF: {
          CO2: 69.8,
          CH4: 0.02,
          N2O: 0.1,
        },
        SCOPE3_EF: 18.0,
      },
    },
  },

  // NGAF Table 5 direct and Table 6 indirect
  NATURAL_GAS_FACTORS: {
    ENERGY_CONTENT_FACTOR: 25.3, // GJ/kL
    SCOPE1_EF: {
      CO2: 51.4,
      CH4: 0.1,
      N2O: 0.03,
    },
    // Uses NGAF Table 6 non-metro values
    SCOPE3_EF: {
      nsw: 14.0,
      act: 14.0,
      vic: 4,
      qld: 7.9,
      sa: 10.6,
      wa_sw: 4.0,
      wa_nw: 4.0,
      tas: 4, // based on victoria
      nt: 4.0, // based on WA
    },
  },

  /**
   * @description Scope 1 and Scope 3 values relating to liming
   * @inventory2018 3G_1
   * @reference Mudahar, M.S., Hignett, T.P., 1982. Energy and Fertilizer-- Policy Implications and Options for Developing Countries. International Fertilizer Development Center, Muscle Shoals, Alabama
   */
  LIMING: {
    LIMESTONE_PURITY: 0.9,
    DOLOMITE_PURITY: 0.95,
    /** @type Proportion */
    LIMESTONE_EF: 0.12,
    /** @type Proportion */
    DOLOMITE_EF: 0.13,
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
