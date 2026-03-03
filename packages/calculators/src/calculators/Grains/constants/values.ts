import { gjPerTonneTogjPerKg } from '@/tools/unit-conversion';
import {
  energyPerMass,
  energyPerVolume,
  massPerArea,
  massPerElectricity,
  massPerEnergy,
  massPerMass,
  massPerTime,
  massPerVolume,
  percentage,
  RealNumber,
  realNumber,
} from '@/tools/units';
import { State } from '@/types/enums';
import {
  CommonConstants,
  CropConstants,
  STATES,
  SwineConstants,
} from './types';

export const commonConstants: CommonConstants = {
  name: 'COMMON',

  // NGAF 2023 Table 10
  REFRIGERATION_LEAKAGE_RATES: {
    'Domestic refrigerators': realNumber(1.7),
    'Transport refrigeration': realNumber(15.7),
    'Domestic A/C portable': realNumber(2.5),
    'Domestic A/C split': realNumber(3.5),
    'Domestic A/C packaged': realNumber(2.5),
    'Light vehicle A/C': realNumber(6.7),
    'Heavy vehicle A/C': realNumber(10.8),
  },

  // NGAF 2023 Table 11
  REFRIGERANT_GWP: {
    R22: massPerMass('CO2e', 'Refrigerant', 1760),
    R32: massPerMass('CO2e', 'Refrigerant', 677),
    R134A: massPerMass('CO2e', 'Refrigerant', 1300),
    R410A: massPerMass('CO2e', 'Refrigerant', 1924),
    R404A: massPerMass('CO2e', 'Refrigerant', 3943),
  },

  /**
   * @description Total GHG (kg CO2-e/kg input)
   * @units kg CO2-e/kg
   */
  // National Inventory Report Volume 1 [6, p. 1]
  EF_UREA_CO2: massPerMass('CO2e', 'Urea', 0.2),

  /**
   * @description Conversion factor for the global warming potential of N2O, as CO2-e
   */
  GWP_FACTORSC6: massPerMass('N2O', 'CO2e', 265),

  /**
   * @description Conversion factor for elemental to molecular CO2
   */
  GWP_FACTORSC13: massPerMass('CO2', 'CO2e', 44 / 12),
  /**
   * @description Conversion factor for elemental to molecular CH4
   */
  GWP_FACTORSC14: realNumber(16 / 12),

  GWP_FACTORSC15: realNumber(44 / 28),

  /**
   * @description Conversion factor for elemental to molecular CO2 from lime
   */
  GWP_FACTORSC18: realNumber(44 / 12),

  LIME_SCOPE3_EF: massPerMass('CO2e', 'Lime', 0.432),

  // Table A.3.1.5
  AGROCHEMICAL_FACTORS: {
    'Herbicide (paraquat, diquat, glyphosate)': massPerMass(
      'CO2e',
      'Chemical',
      33,
    ),
    'Other herbicide': massPerMass('CO2e', 'Chemical', 18.6),
    Insecticide: massPerMass('CO2e', 'Chemical', 18.9),
    Fungicide: massPerMass('CO2e', 'Chemical', 12.6),
    'Plant growth regulator': massPerMass('CO2e', 'Chemical', 10.5),
  },

  /**
   * @description Electricity emission factors for each state and Australia, in kg CO2-e/kWh
   * @reference Primary data sources comprise National Greenhouse and Energy Reporting (Measurement) Determination 2008 (Schedule 1), Australian Energy Statistics, Clean Energy Regulator, and AEMO data and Department of Climate Change, Energy, the Environment and Water.
   * @units kg CO2-e/kWh
   */
  // NGAF 2023 Table 1
  ELECTRICITY: {
    [STATES.NSW]: {
      SCOPE2_EF: massPerElectricity('CO2e', 0.68),
      SCOPE3_EF: massPerElectricity('CO2e', 0.05),
    },
    [STATES.ACT]: {
      SCOPE2_EF: massPerElectricity('CO2e', 0.68),
      SCOPE3_EF: massPerElectricity('CO2e', 0.05),
    },
    [STATES.VIC]: {
      SCOPE2_EF: massPerElectricity('CO2e', 0.79),
      SCOPE3_EF: massPerElectricity('CO2e', 0.07),
    },
    [STATES.QLD]: {
      SCOPE2_EF: massPerElectricity('CO2e', 0.73),
      SCOPE3_EF: massPerElectricity('CO2e', 0.15),
    },
    [STATES.SA]: {
      SCOPE2_EF: massPerElectricity('CO2e', 0.25),
      SCOPE3_EF: massPerElectricity('CO2e', 0.08),
    },
    [STATES.WA_SW]: {
      SCOPE2_EF: massPerElectricity('CO2e', 0.53),
      SCOPE3_EF: massPerElectricity('CO2e', 0.04),
    },
    [STATES.WA_NW]: {
      SCOPE2_EF: massPerElectricity('CO2e', 0.62),
      SCOPE3_EF: massPerElectricity('CO2e', 0.07),
    },
    [STATES.TAS]: {
      SCOPE2_EF: massPerElectricity('CO2e', 0.12),
      SCOPE3_EF: massPerElectricity('CO2e', 0.01),
    },
    [STATES.NT]: {
      SCOPE2_EF: massPerElectricity('CO2e', 0.54),
      SCOPE3_EF: massPerElectricity('CO2e', 0.07),
    },
    Australia: {
      SCOPE2_EF: massPerElectricity('CO2e', 0.65),
      SCOPE3_EF: massPerElectricity('CO2e', 0.08),
    },
  },

  // https://www.dcceew.gov.au/sites/default/files/documents/national-greenhouse-account-factors-2023.pdf
  // Table 2a kg CO2e/kWh
  ELECTRICITY_RMF_SCOPE2_EF: massPerElectricity('CO2e', 0.81),
  ELECTRICITY_RMF_SCOPE3_EF: massPerElectricity('CO2e', 0.1),

  // https://cer.gov.au/schemes/renewable-energy-target/renewable-energy-target-liability-and-exemptions/renewable-power-percentage
  RENEWABLE_POWER_PERCENTAGE: percentage(16.67), // 2026

  // https://www.dcceew.gov.au/sites/default/files/documents/national-greenhouse-account-factors-2023.pdf
  JURISDICTIONAL_RENEWABLE_POWER_PERCENTAGE: percentage(74.13), // 2023

  // NGAF 2023 Table 9
  TRANSPORT_FUEL_FACTORS: {
    'Cars and light commercial vehicles': {
      Gasoline: {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 34.2),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 67.4),
          CH4: massPerEnergy('CH4', 0.02),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 17.2),
      },
      'Diesel oil': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 38.6),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 69.9),
          CH4: massPerEnergy('CH4', 0.01),
          N2O: massPerEnergy('N2O', 0.5),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 17.3),
      },
      'Liquefied petroleum gas (LPG)': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 26.2),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 60.2),
          CH4: massPerEnergy('CH4', 0.5),
          N2O: massPerEnergy('N2O', 0.3),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 20.2),
      },
      'Fuel oil': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 39.7),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 73.6),
          CH4: massPerEnergy('CH4', 0.08),
          N2O: massPerEnergy('N2O', 0.5),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
      Ethanol: {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 23.4),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 0.0),
          CH4: massPerEnergy('CH4', 0.2),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0.0), // NE
      },
      Biodiesel: {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 34.6),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 0.0),
          CH4: massPerEnergy('CH4', 0.8),
          N2O: massPerEnergy('N2O', 1.7),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0.0), // NE
      },
      'Renewable diesel': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 38.6),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 0.0),
          CH4: massPerEnergy('CH4', 0.01),
          N2O: massPerEnergy('N2O', 0.5),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0.0), // NE
      },
      'Other biofuels': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 23.4),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 0.0),
          CH4: massPerEnergy('CH4', 0.8),
          N2O: massPerEnergy('N2O', 1.7),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0.0), // NE
      },
    },
    'Cars and light commercial vehicles (pre 2004)': {
      Gasoline: {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 34.2),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 67.4),
          CH4: massPerEnergy('CH4', 0.6),
          N2O: massPerEnergy('N2O', 1.6),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 17.2),
      },
      'Diesel oil': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 38.6),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 69.9),
          CH4: massPerEnergy('CH4', 0.1),
          N2O: massPerEnergy('N2O', 0.4),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 17.3),
      },
      'Liquefied petroleum gas (LPG)': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 26.2),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 60.2),
          CH4: massPerEnergy('CH4', 0.7),
          N2O: massPerEnergy('N2O', 0.6),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 20.2),
      },

      Ethanol: {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 23.4),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 0.0),
          CH4: massPerEnergy('CH4', 0.8),
          N2O: massPerEnergy('N2O', 1.7),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0.0), // NE
      },

      'Renewable diesel': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 38.6),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 0.0),
          CH4: massPerEnergy('CH4', 0.01),
          N2O: massPerEnergy('N2O', 0.5),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0.0), // NE
      },
    },
    'Light duty vehicles': {
      'Compressed natural gas': {
        /* REVISIT: NGAF table 9 bullet point states: "For compressed natural gas, emission factors are for gas that has converted to standard conditions."
         * I believe this implies converting back to GJ/kL */
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 0.0393 / 1000),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 51.4),
          CH4: massPerEnergy('CH4', 7.3),
          N2O: massPerEnergy('N2O', 0.3),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
      'Liquefied natural gas': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 25.3),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 51.4),
          CH4: massPerEnergy('CH4', 7.3),
          N2O: massPerEnergy('N2O', 0.3),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
    },
    'Heavy duty vehicles': {
      'Compressed natural gas': {
        /* REVISIT: NGAF table 9 bullet point states: "For compressed natural gas, emission factors are for gas that has converted to standard conditions."
         * I believe this implies converting back to GJ/kL */
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 0.0393 / 1000),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 51.4),
          CH4: massPerEnergy('CH4', 2.8),
          N2O: massPerEnergy('N2O', 0.3),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
      'Liquefied natural gas': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 25.3),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 51.4),
          CH4: massPerEnergy('CH4', 2.8),
          N2O: massPerEnergy('N2O', 0.3),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
      'Diesel oil - Euro iv or higher': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 38.6),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 69.9),
          CH4: massPerEnergy('CH4', 0.07),
          N2O: massPerEnergy('N2O', 0.4),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 17.3),
      },
      'Diesel oil - Euro iii': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 38.6),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 69.9),
          CH4: massPerEnergy('CH4', 0.1),
          N2O: massPerEnergy('N2O', 0.4),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 17.3),
      },
      'Diesel oil - Euro i': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 38.6),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 69.9),
          CH4: massPerEnergy('CH4', 0.2),
          N2O: massPerEnergy('N2O', 0.4),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 17.3),
      },
      'Renewable diesel - Euro iv or higher': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 38.6),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 0.0),
          CH4: massPerEnergy('CH4', 0.07),
          N2O: massPerEnergy('N2O', 0.4),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0.0), // NE
      },
      'Renewable diesel - Euro iii': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 38.6),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 0.0),
          CH4: massPerEnergy('CH4', 0.1),
          N2O: massPerEnergy('N2O', 0.4),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0.0), // NE
      },
      'Renewable diesel - Euro i': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 38.6),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 0.0),
          CH4: massPerEnergy('CH4', 0.2),
          N2O: massPerEnergy('N2O', 0.4),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0.0), // NE
      },
    },
    Aviation: {
      'Gasoline for use as fuel in an aircraft': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 33.1),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 67.0),
          CH4: massPerEnergy('CH4', 0.06),
          N2O: massPerEnergy('N2O', 0.6),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
      'Kerosene for use as fuel in an aircraft': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 36.8),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 69.6),
          CH4: massPerEnergy('CH4', 0.01),
          N2O: massPerEnergy('N2O', 0.6),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
      'Renewable aviation kerosene': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 36.8),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 0.0),
          CH4: massPerEnergy('CH4', 0.01),
          N2O: massPerEnergy('N2O', 0.6),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0.0), // NE
      },
    },
    Vessel: {
      Petrol: {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 34.2),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 67.4),
          CH4: massPerEnergy('CH4', 10.1),
          N2O: massPerEnergy('N2O', 0.3),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 17.2),
      },
      Diesel: {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 38.6),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 69.9),
          CH4: massPerEnergy('CH4', 0.2),
          N2O: massPerEnergy('N2O', 0.5),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 17.3),
      },
      'Fuel Oil': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 39.7),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 73.6),
          CH4: massPerEnergy('CH4', 0.2),
          N2O: massPerEnergy('N2O', 0.5),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
    },
    'Off-road Agriculture and forestry equipment': {
      Diesel: {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 38.6),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 69.9),
          CH4: massPerEnergy('CH4', 0.3),
          N2O: massPerEnergy('N2O', 0.5),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 17.3),
      },
    },
  },

  // NGAF table 4
  STATIONARY_FUEL_FACTORS_BY_MASS: {
    'Solid fuels': {
      'Bituminous coal': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(27)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 90),
          CH4: massPerEnergy('CH4', 0.04),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 3),
      },
      'Sub-bituminous coal': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(21)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 90),
          CH4: massPerEnergy('CH4', 0.04),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 2.5),
      },
      Anthracite: {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(29)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 90),
          CH4: massPerEnergy('CH4', 0.04),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Brown coal (lignite)': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(10.2)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 93.5),
          CH4: massPerEnergy('CH4', 0.02),
          N2O: massPerEnergy('N2O', 0.3),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0.4),
      },
      'Coking coal': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(30)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 91.8),
          CH4: massPerEnergy('CH4', 0.03),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 6.4),
      },
      'Coal briquettes': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(22.1)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 95),
          CH4: massPerEnergy('CH4', 0.08),
          N2O: massPerEnergy('N2O', 0.3),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Coal coke': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(27)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 107),
          CH4: massPerEnergy('CH4', 0.03),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Coal tar': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(37.5)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 81.8),
          CH4: massPerEnergy('CH4', 0.03),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Other solid fossil fuels': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(22.1)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 95),
          CH4: massPerEnergy('CH4', 0.08),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Industrial materials derived from fossil fuels': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(26.3)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 81.6),
          CH4: massPerEnergy('CH4', 0.03),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Passenger car tyres': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(32)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 62.8),
          CH4: massPerEnergy('CH4', 0.03),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Truck and off-road tyres': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(27.1)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 55.9),
          CH4: massPerEnergy('CH4', 0.03),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Non-biomass municipal materials': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(10.5)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 87.1),
          CH4: massPerEnergy('CH4', 0.8),
          N2O: massPerEnergy('N2O', 1),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Dry wood': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(16.2)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 0),
          CH4: massPerEnergy('CH4', 0.1),
          N2O: massPerEnergy('N2O', 1.1),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Green and air dried wood': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(10.4)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 0),
          CH4: massPerEnergy('CH4', 0.1),
          N2O: massPerEnergy('N2O', 1.1),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Sulphite lyes': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(12.4)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 0),
          CH4: massPerEnergy('CH4', 0.08),
          N2O: massPerEnergy('N2O', 0.5),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      Bagasse: {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(9.6)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 0),
          CH4: massPerEnergy('CH4', 0.3),
          N2O: massPerEnergy('N2O', 1.1),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Biomass,  municipal and industrial materials': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(12.2)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 0),
          CH4: massPerEnergy('CH4', 0.8),
          N2O: massPerEnergy('N2O', 1),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      Charcoal: {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(31.1)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 0),
          CH4: massPerEnergy('CH4', 5.3),
          N2O: massPerEnergy('N2O', 1),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Other primary solid biomass fuels': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(12.2)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 0),
          CH4: massPerEnergy('CH4', 0.8),
          N2O: massPerEnergy('N2O', 1),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
    },

    // NGAF Table 8
    'Liquid fuels': {
      'Crude oil and condensates': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(45.3)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 69.6),
          CH4: massPerEnergy('CH4', 0.08),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0), // N)E
      },
      'Other natural gas liquids': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(46.5)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 61.0),
          CH4: massPerEnergy('CH4', 0.08),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0), // N)E
      },

      'Petroleum coke': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(34.2)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 92.6),
          CH4: massPerEnergy('CH4', 0.08),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
      'Refinery gas and liquids': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(42.9)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 54.7),
          CH4: massPerEnergy('CH4', 0.03),
          N2O: massPerEnergy('N2O', 0.03),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
      'Refinery coke': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneTogjPerKg(34.2)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 92.6),
          CH4: massPerEnergy('CH4', 0.08),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
    },
  },

  STATIONARY_FUEL_FACTORS_BY_VOLUME: {
    'Liquid fuels': {
      Naphtha: {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 31.4),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 69.8),
          CH4: massPerEnergy('CH4', 0.01),
          N2O: massPerEnergy('N2O', 0.01),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
      'Other petroleum products': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 34.4),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 69.8),
          CH4: massPerEnergy('CH4', 0.02),
          N2O: massPerEnergy('N2O', 0.1),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
      'Petroleum based oils other than fuels': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 38.8),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 13.9),
          CH4: massPerEnergy('CH4', 0.0),
          N2O: massPerEnergy('N2O', 0.0),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
      'Petroleum based greases': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 38.8),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 3.5),
          CH4: massPerEnergy('CH4', 0.0),
          N2O: massPerEnergy('N2O', 0.0),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
      'Automotive gasoline/petrol': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 34.2),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 67.4),
          CH4: massPerEnergy('CH4', 0.2),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 17.2),
      },
      'Aviation gasoline': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 33.1),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 67.0),
          CH4: massPerEnergy('CH4', 0.2),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
      Kerosene: {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 37.5),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 68.9),
          CH4: massPerEnergy('CH4', 0.01),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
      'Aviation turbine fuel/kerosene': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 36.8),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 69.6),
          CH4: massPerEnergy('CH4', 0.02),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
      'Heating oil': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 37.3),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 69.5),
          CH4: massPerEnergy('CH4', 0.03),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
      'Diesel oil': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 38.6),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 69.9),
          CH4: massPerEnergy('CH4', 0.1),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 17.3),
      },
      'Fuel oil': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 39.7),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 73.6),
          CH4: massPerEnergy('CH4', 0.04),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
      'Liquefied aromatic hydrocarbons': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 34.4),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 69.7),
          CH4: massPerEnergy('CH4', 0.03),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
      'Solvents: mineral turpentine or white spirits': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 34.4),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 69.7),
          CH4: massPerEnergy('CH4', 0.03),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
      'Liquefied petroleum gas': {
        ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 25.7),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 60.2),
          CH4: massPerEnergy('CH4', 0.2),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 20.2),
      },
    },
  },

  // NGAF Table 5 direct and Table 6 indirect
  NATURAL_GAS_FACTORS: {
    ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', 25.3), // GJ/kL
    SCOPE1_EF: {
      CO2: massPerEnergy('CO2', 51.4),
      CH4: massPerEnergy('CH4', 0.1),
      N2O: massPerEnergy('N2O', 0.03),
    },
    // Uses NGAF Table 6 non-metro values
    SCOPE3_EF: {
      nsw: massPerEnergy('CO2e', 14.0),
      act: massPerEnergy('CO2e', 14.0),
      vic: massPerEnergy('CO2e', 4),
      qld: massPerEnergy('CO2e', 7.9),
      sa: massPerEnergy('CO2e', 10.6),
      wa_sw: massPerEnergy('CO2e', 4.0),
      wa_nw: massPerEnergy('CO2e', 4.0),
      tas: massPerEnergy('CO2e', 4), // based on victoria
      nt: massPerEnergy('CO2e', 4.0), // based on WA
    },
  },

  /**
   * @description Scope 1 and Scope 3 values relating to liming
   * @inventory2018 3G_1
   * @reference Mudahar, M.S., Hignett, T.P., 1982. Energy and Fertilizer-- Policy Implications and Options for Developing Countries. International Fertilizer Development Center, Muscle Shoals, Alabama
   */
  LIMING: {
    /** @type Proportion */
    LIMESTONE_PURITY: realNumber(0.9),
    LIMESTONE_EF: massPerMass('CO2', 'Lime', 0.12),
    /** @type Proportion */
    DOLOMITE_PURITY: realNumber(0.95),
    DOLOMITE_EF: massPerMass('CO2', 'Lime', 0.13),
  },

  // Taken from AusLCI CEF V47 2026
  SERVICE_EMISSIONS_BY_AREA: {
    'Air blast spraying, orchards': massPerArea('CO2e', 37.88),
    'Bed forming, cotton': massPerArea('CO2e', 26.58),
    'Bed forming, horticulture': massPerArea('CO2e', 38.55),
    'Boom spraying, cotton': massPerArea('CO2e', 2.33),
    'Boom spraying, horticulture': massPerArea('CO2e', 8.31),
    'Control of brigalow suckers, graslan aerial application': massPerArea(
      'CO2e',
      35.78,
    ),
    'Cultivating, broadacre crop, controlled traffic': massPerArea(
      'CO2e',
      28.92,
    ),
    'Cultivating, broadacre crop, conventional': massPerArea('CO2e', 45.19),
    'Cultivating, cotton': massPerArea('CO2e', 16.62),
    'Cultivating, large implement, horticulture': massPerArea('CO2e', 61.48),
    'Cultivating, medium implement, horticulture': massPerArea('CO2e', 32.9),
    'Disc ploughing, broadacre crop, controlled traffic': massPerArea(
      'CO2e',
      29.12,
    ),
    'Disc ploughing, broadacre crop, conventional': massPerArea('CO2e', 45.49),
    'Discing, cotton': massPerArea('CO2e', 31.57),
    'Fertiliser application, cotton': massPerArea('CO2e', 19.61),
    'Fertiliser side dressing, horticulture': massPerArea('CO2e', 13.96),
    'Fertiliser spreading, cotton': massPerArea('CO2e', 7.64),
    'Fertiliser spreading, horticulture': massPerArea('CO2e', 6.65),
    'Fertilizing, broadacre crop, pre & post-emergence, controlled traffic':
      massPerArea('CO2e', 1.74),
    'Fertilizing, broadacre crop, pre & post-emergence, conventional':
      massPerArea('CO2e', 2.33),
    'Grader operation, broadacre crop, medium load factor, controlled traffic':
      massPerArea('CO2e', 52.36),
    'Grader operation, broadacre crop, medium load factor, conventional':
      massPerArea('CO2e', 67.73),
    'Grain collection, broadacre, in-field with tractor and bin, controlled traffic':
      massPerArea('CO2e', 5.23),
    'Grain collection, broadacre, in-field with tractor and bin, conventional':
      massPerArea('CO2e', 6.98),
    'Harrowing, horticulture': massPerArea('CO2e', 9.3),
    'Harvesting, broadacre crop, combine less than 200kW, controlled traffic':
      massPerArea('CO2e', 26.72),
    'Harvesting, broadacre crop, combine less than 200kW, conventional':
      massPerArea('CO2e', 39.88),
    'Harvesting, cotton': massPerArea('CO2e', 132.92),
    'Harvesting, specialised machine, horticulture, 150 kW combine':
      massPerArea('CO2e', 365.54),
    'Hay baling, large square bales, broadacre crop, controlled traffic':
      massPerArea('CO2e', 5.78),
    'Hay baling, large square bales, broadacre crop, conventional': massPerArea(
      'CO2e',
      7.71,
    ),
    'Hay baling, round bales, broadacre crop, controlled traffic': massPerArea(
      'CO2e',
      6.31,
    ),
    'Hay baling, round bales, broadacre crop, conventional': massPerArea(
      'CO2e',
      8.41,
    ),
    'Hay baling, small square bales, broadacre crop, controlled traffic':
      massPerArea('CO2e', 5.26),
    'Hay baling, small square bales, broadacre crop, conventional': massPerArea(
      'CO2e',
      7.01,
    ),
    'Hay mowing, broadacre crop, controlled traffic': massPerArea(
      'CO2e',
      11.41,
    ),
    'Hay mowing, broadacre crop, conventional': massPerArea('CO2e', 15.22),
    'Hay raking, broadacre crop, controlled traffic': massPerArea('CO2e', 1.02),
    'Hay raking, broadacre crop, conventional': massPerArea('CO2e', 1.36),
    'Inter-row cultivation, horticulture': massPerArea('CO2e', 29.91),
    'Inter-row tractor, horticulture': massPerArea('CO2e', 29.91),
    'Irrigation, centre pivot irrigation system': massPerArea('CO2e', 0.14),
    'Irrigation, hose move sprinkler system': massPerArea('CO2e', 0.14),
    'Irrigation, pipe irrigation system': massPerArea('CO2e', 0.14),
    'Irrigation, solid set irrigation system': massPerArea('CO2e', 0.14),
    'Irrigation, travel spray boom irrigation system': massPerArea(
      'CO2e',
      0.14,
    ),
    'Irrigation, under tree irrigation system': massPerArea('CO2e', 0.14),
    'Irrigation,flood or furrow irrigation': massPerArea('CO2e', 0.04),
    'Irrigation,travelling gun irrigation system': massPerArea('CO2e', 0.14),
    'Levelling, cotton': massPerArea('CO2e', 146.21),
    'Liming, broadacre crop, pre & post-emergence, controlled traffic':
      massPerArea('CO2e', 2.87),
    'Liming, broadacre crop, pre & post-emergence, conventional': massPerArea(
      'CO2e',
      3.82,
    ),
    'Mulching, cotton': massPerArea('CO2e', 25.59),
    'Offset disc harrowing, horticulture': massPerArea('CO2e', 57.16),
    'Picking, cotton': massPerArea('CO2e', 72.44),
    'Planting, broadacre crop, soil clay content 0 to 10%, controlled traffic':
      massPerArea('CO2e', 8.47),
    'Planting, broadacre crop, soil clay content 0 to 10%, conventional':
      massPerArea('CO2e', 11.3),
    'Planting, broadacre crop, soil clay content 10 to 20%, controlled traffic':
      massPerArea('CO2e', 7.9),
    'Planting, broadacre crop, soil clay content 10 to 20%, conventional':
      massPerArea('CO2e', 14.62),
    'Planting, broadacre crop, soil clay content greater than 20%, controlled traffic':
      massPerArea('CO2e', 11.13),
    'Planting, broadacre crop, soil clay content greater than 20%, conventional':
      massPerArea('CO2e', 20.6),
    'Planting, cotton': massPerArea('CO2e', 11.63),
    'Precision planting, horticulture': massPerArea('CO2e', 69.12),
    'Ripping, large implement, horticulture': massPerArea('CO2e', 112.98),
    'Ripping, medium implement, horticulture': massPerArea('CO2e', 69.78),
    'Rolling, cotton': massPerArea('CO2e', 10.3),
    'Root cutting, cotton': massPerArea('CO2e', 11.3),
    'Rotary hoeing, medium implement, horticulture': massPerArea(
      'CO2e',
      154.85,
    ),
    'Savanna burning, northern Australia woodland, Qld & NT': massPerArea(
      'CO2e',
      418.58,
    ),
    'Savanna burning, open eucalypt woodland, late dry season, Qld & NT':
      massPerArea('CO2e', 335.32),
    'Scarifiying, broadacre crop, controlled traffic': massPerArea(
      'CO2e',
      17.0,
    ),
    'Scarifiying, broadacre crop, conventional': massPerArea('CO2e', 22.66),
    'Seedling transplanting, horticulture': massPerArea('CO2e', 54.17),
    'Spraying, aerial, broadacre crop': massPerArea('CO2e', 5.84),
    'Spraying, aerial, cotton': massPerArea('CO2e', 4.86),
    'Spraying, aerial, rice': massPerArea('CO2e', 30.61),
    'Spraying, broadacre crop, pre & post-emergence, controlled traffic':
      massPerArea('CO2e', 1.74),
    'Spraying, broadacre crop, pre & post-emergence, conventional': massPerArea(
      'CO2e',
      2.33,
    ),
    'Windrowing, broadacre crop, controlled traffic': massPerArea(
      'CO2e',
      11.96,
    ),
    'Windrowing, broadacre crop, conventional': massPerArea('CO2e', 15.95),
  },
  SERVICE_EMISSIONS_BY_HOUR: {
    'Bulldozer operation, medium load factor': massPerTime('CO2e', 96.74),
  },

  // Appendix A1 Table A.4.1.1
  SOLID_WASTE_LANDFILL_EF: {
    'Food waste': massPerMass('CO2e', 'Solid Waste', 2.1),
    'Paper and cardboard': massPerMass('CO2e', 'Solid Waste', 3.3),
    'Green waste': massPerMass('CO2e', 'Solid Waste', 1.6),
    Wood: massPerMass('CO2e', 'Solid Waste', 0.7),
    Textiles: massPerMass('CO2e', 'Solid Waste', 2.0),
    Sludge: massPerMass('CO2e', 'Solid Waste', 0.4),
    'Rubber and leather': massPerMass('CO2e', 'Solid Waste', 3.3),
    'Inert waste': massPerMass('CO2e', 'Solid Waste', 0),
    'Municipal solid waste': massPerMass('CO2e', 'Solid Waste', 1.6),
    'Commercial waste': massPerMass('CO2e', 'Solid Waste', 1.3),
    'Industrial waste': massPerMass('CO2e', 'Solid Waste', 1.3),
    'Construction and demolition waste': massPerMass(
      'CO2e',
      'Solid Waste',
      0.2,
    ),
  },

  // Appendix A1 Table A.4.1.1
  SOLID_WASTE_INCINERATION_EF: {
    'Food waste': massPerMass('CO2e', 'Solid Waste', 0),
    'Green waste': massPerMass('CO2e', 'Solid Waste', 0),
    Wood: massPerMass('CO2e', 'Solid Waste', 0),
    Sludge: massPerMass('CO2e', 'Solid Waste', 0),
    'Paper and cardboard': massPerMass('CO2e', 'Solid Waste', 0.0169),
    Textiles: massPerMass('CO2e', 'Solid Waste', 0.3667),
    'Rubber and leather': massPerMass('CO2e', 'Solid Waste', 0.4919),
    'Inert waste': massPerMass('CO2e', 'Solid Waste', 0.11),
    'Municipal solid waste': massPerMass('CO2e', 'Solid Waste', 0.0537),
    'Industrial waste': massPerMass('CO2e', 'Solid Waste', 1.649),
  },
  SOLID_WASTE_COMPOSTING_EF: massPerMass('CO2e', 'Solid Waste', 0.046),
  SOLID_WASTE_ANAEROBIC_DIGESTION_EF: massPerMass('CO2e', 'Solid Waste', 0.028),

  // Appendix A1 Table A.4.1.2
  SOLID_WASTE_BY_VOLUME_TO_MASS: {
    'Food waste': massPerVolume('Solid Waste', 'Solid Waste', 0.5),
    'Paper and cardboard': massPerVolume('Solid Waste', 'Solid Waste', 0.09),
    'Green waste': massPerVolume('Solid Waste', 'Solid Waste', 0.24),
    Wood: massPerVolume('Solid Waste', 'Solid Waste', 0.15),
    Textiles: massPerVolume('Solid Waste', 'Solid Waste', 0.14),
    Sludge: massPerVolume('Solid Waste', 'Solid Waste', 0.72),
    'Rubber and leather': massPerVolume('Solid Waste', 'Solid Waste', 0.14),
    'Inert waste': massPerVolume('Solid Waste', 'Solid Waste', 0.42),
    'Municipal solid waste': massPerVolume('Solid Waste', 'Solid Waste', 0.36),
    'Commercial waste': massPerVolume('Solid Waste', 'Solid Waste', 0.33),
    'Industrial waste': massPerVolume('Solid Waste', 'Solid Waste', 0.33),
    'Construction and demolition waste': massPerVolume(
      'Solid Waste',
      'Solid Waste',
      0.39,
    ),
  },
};

const cropResidueRemovedOtherCropTypes: Record<State, RealNumber> = {
  nsw: realNumber(0.05),
  vic: realNumber(0.07),
  qld: realNumber(0.04),
  sa: realNumber(0.09),
  wa_nw: realNumber(0.11),
  wa_sw: realNumber(0.11),
  tas: realNumber(0.16),
  nt: realNumber(0.01),
  act: realNumber(0),
};

const allStatesWithValue = (rawValue: number): Record<State, RealNumber> => {
  const value = realNumber(rawValue);
  return {
    nsw: value,
    vic: value,
    qld: value,
    sa: value,
    wa_nw: value,
    wa_sw: value,
    tas: value,
    nt: value,
    act: value,
  };
};

export const cropConstants: CropConstants = {
  name: 'CROP',

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
    'Monoammonium Phosphate (MAP)': {
      N: massPerMass('N', 'Inorganic Fertiliser', 0.1),
      Urea: massPerMass('Urea', 'Inorganic Fertiliser', 0),
      Volatilises: massPerMass('Volatilised N', 'N', 0.08),
      Scope3EF: massPerMass('CO2e', 'Inorganic Fertiliser', 0.83),
    },
    'Diammonium Phosphate (DAP)': {
      N: massPerMass('N', 'Inorganic Fertiliser', 0.18),
      Urea: massPerMass('Urea', 'Inorganic Fertiliser', 0),
      Volatilises: massPerMass('Volatilised N', 'N', 0.08),
      Scope3EF: massPerMass('CO2e', 'Inorganic Fertiliser', 1.0),
    },
    Urea: {
      N: massPerMass('N', 'Inorganic Fertiliser', 0.46),
      Urea: massPerMass('Urea', 'Inorganic Fertiliser', 1),
      Volatilises: massPerMass('Volatilised N', 'N', 0.15),
      Scope3EF: massPerMass('CO2e', 'Inorganic Fertiliser', 1.5),
    },
    'Sulphate of Ammonia (SOA)': {
      N: massPerMass('N', 'Inorganic Fertiliser', 0.21),
      Urea: massPerMass('Urea', 'Inorganic Fertiliser', 0),
      Volatilises: massPerMass('Volatilised N', 'N', 0.08),
      Scope3EF: massPerMass('CO2e', 'Inorganic Fertiliser', 0.75),
    },
    'Urea-Ammonium Nitrate (UAN)': {
      N: massPerMass('N', 'Inorganic Fertiliser', 0.32),
      Urea: massPerMass('Urea', 'Inorganic Fertiliser', 0.35),
      Volatilises: massPerMass('Volatilised N', 'N', 0.05),
      Scope3EF: massPerMass('CO2e', 'Inorganic Fertiliser', 1.09),
    },
    'Ammonium Nitrate (AN)': {
      N: massPerMass('N', 'Inorganic Fertiliser', 0.337),
      Urea: massPerMass('Urea', 'Inorganic Fertiliser', 0),
      Volatilises: massPerMass('Volatilised N', 'N', 0.05),
      Scope3EF: massPerMass('CO2e', 'Inorganic Fertiliser', 1.09),
    },
    'Calcium Ammonium Nitrate (CAN)': {
      N: massPerMass('N', 'Inorganic Fertiliser', 0.27),
      Urea: massPerMass('Urea', 'Inorganic Fertiliser', 0),
      Volatilises: massPerMass('Volatilised N', 'N', 0.05),
      Scope3EF: massPerMass('CO2e', 'Inorganic Fertiliser', 0.88),
    },
  },

  // TODO: Waiting on data from CRC
  INORGANIC_FERTILISER_FRACTIONS_BY_REGION: {
    Ammonia: {
      China: massPerMass('CO2e', 'Inorganic Fertiliser', 0.0),
      Yemen: massPerMass('CO2e', 'Inorganic Fertiliser', 0.0),
      Canada: massPerMass('CO2e', 'Inorganic Fertiliser', 0.0),
      Unspecified: massPerMass('CO2e', 'Inorganic Fertiliser', 0.0),
    },
    Urea: {
      China: massPerMass('CO2e', 'Inorganic Fertiliser', 0.0),
      Yemen: massPerMass('CO2e', 'Inorganic Fertiliser', 0.0),
      Canada: massPerMass('CO2e', 'Inorganic Fertiliser', 0.0),
      Unspecified: massPerMass('CO2e', 'Inorganic Fertiliser', 0.0),
    },
  },
  INORGANIC_FERTILISER_FRACTIONS_BY_NON_REGIONAL: {
    // TODO: Waiting on data from CRC
    'Monoammonium phosphate': massPerMass('CO2e', 'Inorganic Fertiliser', 0.0),
    'Diammonium Phosphate': massPerMass('CO2e', 'Inorganic Fertiliser', 0.0),
    'Urea-Ammonium Nitrate': massPerMass('CO2e', 'Inorganic Fertiliser', 0.0),
    'Ammonium Nitrate': massPerMass('CO2e', 'Inorganic Fertiliser', 0.0),
    'Calcium Ammonium Nitrate': massPerMass(
      'CO2e',
      'Inorganic Fertiliser',
      0.0,
    ),
    'Sulphate of Ammonia': massPerMass('CO2e', 'Inorganic Fertiliser', 0.0),
    'Nitrogen - Generic': massPerMass('CO2e', 'Inorganic Fertiliser', 0.0),
    'Nitrogen - Nitrate': massPerMass('CO2e', 'Inorganic Fertiliser', 0.0),
    'Nitrogen - Ammonia': massPerMass('CO2e', 'Inorganic Fertiliser', 0.0),
    'Muriate of Potash': massPerMass('CO2e', 'Inorganic Fertiliser', 0.0),
    'Single superphosphate': massPerMass('CO2e', 'Inorganic Fertiliser', 0.0),
    'Double Superphosphate': massPerMass('CO2e', 'Inorganic Fertiliser', 0.0),
    'Phosphorus - Generic': massPerMass('CO2e', 'Inorganic Fertiliser', 0.0),
    'Potassium - Generic': massPerMass('CO2e', 'Inorganic Fertiliser', 0.0),
    'Sulfur - Generic': massPerMass('CO2e', 'Inorganic Fertiliser', 0.0),
    'Zinc - Generic': massPerMass('CO2e', 'Inorganic Fertiliser', 0.0),
    'Calcium - Generic lime as proxy': massPerMass(
      'CO2e',
      'Inorganic Fertiliser',
      0.0,
    ),
  },

  ORGANIC_FERTILISER_FRACTIONS: {
    'Dairy cattle': { N: massPerMass('N', 'Organic Fertiliser', 0.029) },
    'Beef cattle': { N: massPerMass('N', 'Organic Fertiliser', 0.023) },
    Poultry: { N: massPerMass('N', 'Organic Fertiliser', 0.51) },
    Swine: { N: massPerMass('N', 'Organic Fertiliser', 0.41) },
    Sheep: { N: massPerMass('N', 'Organic Fertiliser', 0.033) },
    'Horses/Mules': { N: massPerMass('N', 'Organic Fertiliser', 0.013) },
  },

  /**
   * @description Methane emissions factor for savannah burning
   * @inventory2022 Table 5.31
   * @units Gg element / Gg burnt
   */
  BURNING_METHANE_EF: massPerMass('CH4', 'DryMatter', 0.0035),

  /**
   * @description N2O emissions factor for savannah burning
   * @inventory2022 Table 5.31
   * @units Gg element / Gg burnt
   */
  BURNING_N2O_EF: massPerMass('N2O', 'N', 0.0076),

  // A.2.1.4
  EF_RESIDUES_RETURNED_TO_SOIL: {
    wet: massPerMass('N2O', 'N', 0.006),
    dry: massPerMass('N2O', 'N', 0.005),
  },

  FRACTION_CROP_RESIDUE_REMOVED: {
    Rice: allStatesWithValue(0.06),
    'Tubers and Roots': allStatesWithValue(1),
    Cotton: allStatesWithValue(0),
    Hops: allStatesWithValue(0),
    'Forage Crops': allStatesWithValue(0.8),
    'Sugar Cane': {
      nsw: realNumber(0),
      qld: realNumber(0.03),
      wa_nw: realNumber(0),
      wa_sw: realNumber(0),
      sa: realNumber(0), // N/A
      vic: realNumber(0), // N/A
      act: realNumber(0), // N/A
      tas: realNumber(0), // N/A
      nt: realNumber(0), // N/A
    },
    Wheat: cropResidueRemovedOtherCropTypes,
    'Other Cereals': cropResidueRemovedOtherCropTypes,
    Barley: cropResidueRemovedOtherCropTypes,
    Oilseeds: cropResidueRemovedOtherCropTypes,
    Maize: cropResidueRemovedOtherCropTypes,
    Oats: cropResidueRemovedOtherCropTypes,
    Sorghum: cropResidueRemovedOtherCropTypes,
    Triticale: cropResidueRemovedOtherCropTypes,
    Peanuts: cropResidueRemovedOtherCropTypes,
    Pulses: cropResidueRemovedOtherCropTypes,
    'Other Annual Crops': cropResidueRemovedOtherCropTypes,
    'Other Perennial Crops': cropResidueRemovedOtherCropTypes,
  },

  /**
   * @description Crop residue parameters for major crop types
   * @inventory2022 A5.5.9.1
   */

  CROPRESIDUE: {
    Wheat: {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.5),
      belowAboveResidueRatio: realNumber(0.29),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.88),
      carbonMassFraction: realNumber(0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.006),
      belowGroundN: massPerMass('N', 'DryMatter', 0.01),
      fractionOfResidueAtBurning: realNumber(0.5),
      fractionBurnt: realNumber(0.9),
    },
    Barley: {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.24),
      belowAboveResidueRatio: realNumber(0.32),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.88),
      carbonMassFraction: realNumber(0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.007),
      belowGroundN: massPerMass('N', 'DryMatter', 0.01),
      fractionOfResidueAtBurning: realNumber(0.5),
      fractionBurnt: realNumber(0.85),
    },
    Maize: {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 0.81),
      belowAboveResidueRatio: realNumber(0.39),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.85),
      carbonMassFraction: realNumber(0.42),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.005),
      belowGroundN: massPerMass('N', 'DryMatter', 0.007),
      fractionOfResidueAtBurning: realNumber(1),
      fractionBurnt: realNumber(0.8),
    },
    Oats: {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.42),
      belowAboveResidueRatio: realNumber(0.43),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.88),
      carbonMassFraction: realNumber(0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.006),
      belowGroundN: massPerMass('N', 'DryMatter', 0.01),
      fractionOfResidueAtBurning: realNumber(0.5),
      fractionBurnt: realNumber(0.85),
    },
    Rice: {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.31),
      belowAboveResidueRatio: realNumber(0.16),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.8),
      carbonMassFraction: realNumber(0.42),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.007),
      belowGroundN: massPerMass('N', 'DryMatter', 0.01),
      fractionOfResidueAtBurning: realNumber(1),
      fractionBurnt: realNumber(0.8),
    },
    Sorghum: {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.5),
      belowAboveResidueRatio: realNumber(0.22),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.8),
      carbonMassFraction: realNumber(0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.008),
      belowGroundN: massPerMass('N', 'DryMatter', 0.007),
      fractionOfResidueAtBurning: realNumber(0.5),
      fractionBurnt: realNumber(0.85),
    },
    Triticale: {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.5),
      belowAboveResidueRatio: realNumber(0.42),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.88),
      carbonMassFraction: realNumber(0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.006),
      belowGroundN: massPerMass('N', 'DryMatter', 0.01),
      fractionOfResidueAtBurning: realNumber(0.5),
      fractionBurnt: realNumber(0.85),
    },
    'Other Cereals': {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.46),
      belowAboveResidueRatio: realNumber(0.36),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.88),
      carbonMassFraction: realNumber(0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.006),
      belowGroundN: massPerMass('N', 'DryMatter', 0.01),
      fractionOfResidueAtBurning: realNumber(0.5),
      fractionBurnt: realNumber(0.85),
    },
    Pulses: {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.37),
      belowAboveResidueRatio: realNumber(0.51),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.87),
      carbonMassFraction: realNumber(0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.009),
      belowGroundN: massPerMass('N', 'DryMatter', 0.01),
      fractionOfResidueAtBurning: realNumber(0.5),
      fractionBurnt: realNumber(0.85),
    },
    'Tubers and Roots': {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 0.34),
      belowAboveResidueRatio: realNumber(0.43),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.25),
      carbonMassFraction: realNumber(0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.02),
      belowGroundN: massPerMass('N', 'DryMatter', 0.01),
      fractionOfResidueAtBurning: realNumber(0),
      fractionBurnt: realNumber(0.85),
    },
    Peanuts: {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.07),
      belowAboveResidueRatio: realNumber(0.2),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.8),
      carbonMassFraction: realNumber(0.42),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.016),
      belowGroundN: massPerMass('N', 'DryMatter', 0.014),
      fractionOfResidueAtBurning: realNumber(0.5),
      fractionBurnt: realNumber(0.85),
    },
    'Sugar Cane': {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 0.25),
      belowAboveResidueRatio: realNumber(0.45),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.2),
      carbonMassFraction: realNumber(0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.005),
      belowGroundN: massPerMass('N', 'DryMatter', 0.007),
      fractionOfResidueAtBurning: realNumber(1),
      fractionBurnt: realNumber(0.8),
    },
    Cotton: {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.9),
      belowAboveResidueRatio: realNumber(0.3),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.9),
      carbonMassFraction: realNumber(0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.01),
      belowGroundN: massPerMass('N', 'DryMatter', 0.01),
      fractionOfResidueAtBurning: realNumber(0),
      fractionBurnt: realNumber(0.85),
    },
    Hops: {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.5),
      belowAboveResidueRatio: realNumber(0.29),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.88),
      carbonMassFraction: realNumber(0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.006),
      belowGroundN: massPerMass('N', 'DryMatter', 0),
      fractionOfResidueAtBurning: realNumber(0),
      fractionBurnt: realNumber(0.85),
    },
    Oilseeds: {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 2.08),
      belowAboveResidueRatio: realNumber(0.33),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.96),
      carbonMassFraction: realNumber(0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.009),
      belowGroundN: massPerMass('N', 'DryMatter', 0.01),
      fractionOfResidueAtBurning: realNumber(0.5),
      fractionBurnt: realNumber(0.85),
    },
    'Forage Crops': {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.34),
      belowAboveResidueRatio: realNumber(0.37),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.88),
      carbonMassFraction: realNumber(0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.006),
      belowGroundN: massPerMass('N', 'DryMatter', 0.01),
      fractionOfResidueAtBurning: realNumber(0),
      fractionBurnt: realNumber(0.85),
    },
    'Other Annual Crops': {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.0),
      belowAboveResidueRatio: realNumber(0.22),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.85),
      carbonMassFraction: realNumber(0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.008),
      belowGroundN: massPerMass('N', 'DryMatter', 0.009),
      fractionOfResidueAtBurning: realNumber(0),
      fractionBurnt: realNumber(0),
    },
    'Other Perennial Crops': {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.5),
      belowAboveResidueRatio: realNumber(0.29),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.88),
      carbonMassFraction: realNumber(0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.06),
      belowGroundN: massPerMass('N', 'DryMatter', 0),
      fractionOfResidueAtBurning: realNumber(0),
      fractionBurnt: realNumber(0),
    },
  },

  // Table A.2.1.3
  PASTURERESIDUE: {
    'Annual grass': {
      // averageYield: 4.41,
      belowAboveResidueRatio: realNumber(0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.015),
      belowGroundN: massPerMass('N', 'DryMatter', 0.012),
      fractionRemoved: realNumber(0.8),
    },
    'Grass clover mixture': {
      // averageYield: 8.34,
      belowAboveResidueRatio: realNumber(0.8),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.025),
      belowGroundN: massPerMass('N', 'DryMatter', 0.016),
      fractionRemoved: realNumber(0.8),
    },
    Lucerne: {
      // averageYield: 8.62,
      belowAboveResidueRatio: realNumber(0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.027),
      belowGroundN: massPerMass('N', 'DryMatter', 0.019),
      fractionRemoved: realNumber(0.8),
    },
    'Other legume': {
      // averageYield: 5.62,
      belowAboveResidueRatio: realNumber(0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.027),
      belowGroundN: massPerMass('N', 'DryMatter', 0.022),
      fractionRemoved: realNumber(0.8),
    },
    'Perennial pasture': {
      // averageYield: 8.35,
      belowAboveResidueRatio: realNumber(0.8),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.015),
      belowGroundN: massPerMass('N', 'DryMatter', 0.012),
      fractionRemoved: realNumber(0.8),
    },
  },

  EF_N2O_PRODUCTION_SYSTEM: {
    'Irrigated pasture': massPerMass('N2O', 'Volatilised N', 0.0059),
    'Irrigated crop (low rainfall)': massPerMass(
      'N2O',
      'Volatilised N',
      0.0029,
    ),
    'Irrigated crop (high rainfall)': massPerMass(
      'N2O',
      'Volatilised N',
      0.008,
    ),
    'Irrigated crop': massPerMass('N2O', 'Volatilised N', 0.007),
    'Non-irrigated pasture': massPerMass('N2O', 'Volatilised N', 0.0018),
    'Non-irrigated crops': massPerMass('N2O', 'Volatilised N', 0.0041),
    Sugar: massPerMass('N2O', 'Volatilised N', 0.0199),
    Cotton: massPerMass('N2O', 'Volatilised N', 0.0053),
    'Horticultural crops': massPerMass('N2O', 'Volatilised N', 0.0064),
    'Rice (continuous flooding)': massPerMass('N2O', 'Volatilised N', 0.003),
    'Rice (single and multiple drainage, or alternate wetting and drying)':
      massPerMass('N2O', 'Volatilised N', 0.005),
    Aquaculture: massPerMass('N2O', 'Volatilised N', 0.0026),
    Forestry: massPerMass('N2O', 'Volatilised N', 0.0018),
  },

  // FracGASMsoil
  FRACTION_N_VOLATILISED_ORGANIC_FERTILISER: massPerMass(
    'Volatilised N',
    'N',
    0.21,
  ),

  // FracLeach
  FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF: realNumber(0.24),

  // EF leach
  EF_N2O_LEACHING_AND_RUNOFF: massPerMass('N2O', 'N', 0.011),
};

export const swineConstants: SwineConstants = {
  name: 'SWINE',

  // A.1.6.2
  // A.1.6.3
  MMS: {
    'Outdoor (Dry lot)': {
      N_VOLATISED_EF: realNumber(0.3),
      N2O_EF: realNumber(0.02),
    },
    'Deep litter': {
      N_VOLATISED_EF: realNumber(0.125),
      N2O_EF: realNumber(0.01),
    },
    'Stockpile (Solid storage)': {
      N_VOLATISED_EF: realNumber(0.2),
      N2O_EF: realNumber(0.005),
    },
    'Effluent pond (Uncovered anaerobic lagoon)': {
      N_VOLATISED_EF: realNumber(0.55),
      N2O_EF: realNumber(0),
    },
    'Anaerobic digester / Covered lagoon': {
      N_VOLATISED_EF: realNumber(0),
      N2O_EF: realNumber(0),
    },
    'Short HRT tank storage < 1 month (pit storage)': {
      N_VOLATISED_EF: realNumber(0.25),
      N2O_EF: realNumber(0.002),
    },
  },
};
