import { gjPerTonneTogjPerKg } from '@/tools/unit-conversion';
import {
  energyPerMass,
  energyPerVolume,
  mass,
  massPerArea,
  massPerElectricity,
  massPerEnergy,
  massPerHeadPerDay,
  massPerMass,
  massPerTime,
  massPerVolume,
  percentage,
  RealNumber,
  realNumber,
} from '@/tools/units';
import { State } from './enums';
import {
  CommonConstants,
  CropConstants,
  DairyConstants,
  FeedlotConstants,
  PoultryConstants,
  STATES,
  SwineConstants,
} from './types';

export const commonConstants: CommonConstants = {
  name: 'COMMON',

  // NGAF 2023 Table 10
  REFRIGERATION_LEAKAGE_RATES: {
    'Domestic refrigerators': percentage(1.7),
    'Transport refrigeration': percentage(15.7),
    'Domestic A/C portable': percentage(2.5),
    'Domestic A/C split': percentage(3.5),
    'Domestic A/C packaged': percentage(2.5),
    'Light vehicle A/C': percentage(6.7),
    'Heavy vehicle A/C': percentage(10.8),
  },

  // NGAF 2023 Table 23 and 24. See GWP sheet of workbook 9-refrigerant-use.xlsx for details of how these were calculated.
  // Some blends from table 24 were not included if some components had GWP values that could not be found in other references.
  REFRIGERANT_GWP: {
    'R-400 50/50': massPerMass('CO2e', 'Refrigerant', 9395),
    'R-400 60/40': massPerMass('CO2e', 'Refrigerant', 9556),
    'R-400 80/20': massPerMass('CO2e', 'Refrigerant', 9878),
    'HFC-23 (R-23)': massPerMass('CO2e', 'Refrigerant', 12400),
    'HFC-32 (R-32)': massPerMass('CO2e', 'Refrigerant', 677),
    'HFC-41 (R-41)': massPerMass('CO2e', 'Refrigerant', 116),
    'HFC-43-10mee (R-4310mee)': massPerMass('CO2e', 'Refrigerant', 1650),
    'HFC-125 (R-125)': massPerMass('CO2e', 'Refrigerant', 3170),
    'HFC-134 (R-134)': massPerMass('CO2e', 'Refrigerant', 1120),
    'HFC-134a (R-134a)': massPerMass('CO2e', 'Refrigerant', 1300),
    'HFC-143 (R-143)': massPerMass('CO2e', 'Refrigerant', 328),
    'HFC-143a (R-143a)': massPerMass('CO2e', 'Refrigerant', 4800),
    'HFC-152a (R-152a)': massPerMass('CO2e', 'Refrigerant', 138),
    'HFC-227ea (R-227ea)': massPerMass('CO2e', 'Refrigerant', 3350),
    'HFC-236fa (R-236fa)': massPerMass('CO2e', 'Refrigerant', 8060),
    'HFC-245ca (R-245ca)': massPerMass('CO2e', 'Refrigerant', 716),
    'HFC-245fa (R-245fa)': massPerMass('CO2e', 'Refrigerant', 858),
    'HFC-365mfc (R-365mfc)': massPerMass('CO2e', 'Refrigerant', 804),
    'HCFC-22 (R-22)': massPerMass('CO2e', 'Refrigerant', 1760),
    'HCFC-123 (R-123)': massPerMass('CO2e', 'Refrigerant', 79),
    'HCFC-124 (R-124)': massPerMass('CO2e', 'Refrigerant', 527),
    'HCFC-141b (R-141b)': massPerMass('CO2e', 'Refrigerant', 782),
    'HCFC-142b (R-142b)': massPerMass('CO2e', 'Refrigerant', 1980),
    'HCFC-225ca (R-225ca)': massPerMass('CO2e', 'Refrigerant', 127),
    'HCFC-225cb (R-225cb)': massPerMass('CO2e', 'Refrigerant', 525),
    'PFC-14 Perfluoromethane (tetrafluoromethane)': massPerMass(
      'CO2e',
      'Refrigerant',
      6630,
    ),
    'PFC-116 Perfluoroethane (hexafluoroethane)': massPerMass(
      'CO2e',
      'Refrigerant',
      11100,
    ),
    'PFC-218 Perfluoropropane': massPerMass('CO2e', 'Refrigerant', 8900),
    'PFC-31-10 Perfluorobutane': massPerMass('CO2e', 'Refrigerant', 9200),
    'PFC-318 Perfluorocyclobutane': massPerMass('CO2e', 'Refrigerant', 9540),
    'PFC-41-12 Perfluoropentane': massPerMass('CO2e', 'Refrigerant', 8550),
    'PFC-51-14 Perfluorohexane': massPerMass('CO2e', 'Refrigerant', 7910),
    'PFC-91-18 Perflunafene': massPerMass('CO2e', 'Refrigerant', 7190),
    'R-401A': massPerMass('CO2e', 'Refrigerant', 1129.92),
    'R-401B': massPerMass('CO2e', 'Refrigerant', 1236.34),
    'R-401C': massPerMass('CO2e', 'Refrigerant', 875.54),
    'R-404A': massPerMass('CO2e', 'Refrigerant', 3942.8),
    'R-405A': massPerMass('CO2e', 'Refrigerant', 4965.06),
    'R-407A': massPerMass('CO2e', 'Refrigerant', 1923.4),
    'R-407B': massPerMass('CO2e', 'Refrigerant', 2546.7),
    'R-407C': massPerMass('CO2e', 'Refrigerant', 1624.21),
    'R-407D': massPerMass('CO2e', 'Refrigerant', 1487.05),
    'R-407E': massPerMass('CO2e', 'Refrigerant', 1424.75),
    'R-408A': massPerMass('CO2e', 'Refrigerant', 3257.1),
    'R-409A': massPerMass('CO2e', 'Refrigerant', 1484.75),
    'R-409B': massPerMass('CO2e', 'Refrigerant', 1473.75),
    'R-410A': massPerMass('CO2e', 'Refrigerant', 1923.5),
    'R-410B': massPerMass('CO2e', 'Refrigerant', 2048.15),
    'R-412A': massPerMass('CO2e', 'Refrigerant', 2172),
    'R-415A': massPerMass('CO2e', 'Refrigerant', 1468.04),
    'R-415B': massPerMass('CO2e', 'Refrigerant', 543.5),
    'R-420A': massPerMass('CO2e', 'Refrigerant', 1381.6),
    'R-421A': massPerMass('CO2e', 'Refrigerant', 2384.6),
    'R-422A': massPerMass('CO2e', 'Refrigerant', 2847.17),
    'R-422B': massPerMass('CO2e', 'Refrigerant', 2289.5),
    'R-422C': massPerMass('CO2e', 'Refrigerant', 2794.4),
    'R-500': massPerMass('CO2e', 'Refrigerant', 7563.756),
    'R-501': massPerMass('CO2e', 'Refrigerant', 3870),
    'R-502': massPerMass('CO2e', 'Refrigerant', 4785.92),
    'R-503': massPerMass('CO2e', 'Refrigerant', 13298.5),
    'R-504': massPerMass('CO2e', 'Refrigerant', 4299.374),
    'R-507A': massPerMass('CO2e', 'Refrigerant', 3985),
    'R-508A': massPerMass('CO2e', 'Refrigerant', 11607),
    'R-508B': massPerMass('CO2e', 'Refrigerant', 11698),
    'R-509A': massPerMass('CO2e', 'Refrigerant', 5758.4),
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
    'Air blast spraying, orchards': massPerArea('CO2e', 37.882938),
    'Bed forming, cotton': massPerArea('CO2e', 26.584518),
    'Bed forming, horticulture': massPerArea('CO2e', 38.547551),
    'Boom spraying, cotton': massPerArea('CO2e', 2.3261453),
    'Boom spraying, horticulture': massPerArea('CO2e', 8.3076618),
    'Control of brigalow suckers, graslan aerial application': massPerArea(
      'CO2e',
      35.456609,
    ),
    'Cultivating, broadacre crop, controlled traffic': massPerArea(
      'CO2e',
      28.923955,
    ),
    'Cultivating, broadacre crop, conventional': massPerArea('CO2e', 45.19368),
    'Cultivating, cotton': massPerArea('CO2e', 16.615324),
    'Cultivating, large implement, horticulture': massPerArea(
      'CO2e',
      61.476697,
    ),
    'Cultivating, medium implement, horticulture': massPerArea(
      'CO2e',
      32.898341,
    ),
    'Disc ploughing, broadacre crop, controlled traffic': massPerArea(
      'CO2e',
      29.115364,
    ),
    'Disc ploughing, broadacre crop, conventional': massPerArea(
      'CO2e',
      45.492756,
    ),
    'Discing, cotton': massPerArea('CO2e', 31.569115),
    'Fertiliser application, cotton': massPerArea('CO2e', 19.606082),
    'Fertiliser side dressing, horticulture': massPerArea('CO2e', 13.956872),
    'Fertiliser spreading, cotton': massPerArea('CO2e', 7.6430488),
    'Fertiliser spreading, horticulture': massPerArea('CO2e', 6.6461294),
    'Fertilizing, broadacre crop, pre & post-emergence, controlled traffic':
      massPerArea('CO2e', 1.744609),
    'Fertilizing, broadacre crop, pre & post-emergence, conventional':
      massPerArea('CO2e', 2.3261453),
    'Grader operation, broadacre crop, medium load factor, controlled traffic':
      massPerArea('CO2e', 52.362173),
    'Grader operation, broadacre crop, medium load factor, conventional':
      massPerArea('CO2e', 67.731347),
    'Grain collection, broadacre, in-field with tractor and bin, controlled traffic':
      massPerArea('CO2e', 5.2338269),
    'Grain collection, broadacre, in-field with tractor and bin, conventional':
      massPerArea('CO2e', 6.9784359),
    'Harrowing, horticulture': massPerArea('CO2e', 9.3045812),
    'Harvesting, broadacre crop, combine less than 200kW, controlled traffic':
      massPerArea('CO2e', 26.71744),
    'Harvesting, broadacre crop, combine less than 200kW, conventional':
      massPerArea('CO2e', 39.876776),
    'Harvesting, cotton': massPerArea('CO2e', 132.92259),
    'Harvesting, specialised machine, horticulture, 150 kW combine':
      massPerArea('CO2e', 365.53712),
    'Hay baling, large square bales, broadacre crop, controlled traffic':
      massPerArea('CO2e', 5.7821326),
    'Hay baling, large square bales, broadacre crop, conventional': massPerArea(
      'CO2e',
      7.7095101,
    ),
    'Hay baling, round bales, broadacre crop, controlled traffic': massPerArea(
      'CO2e',
      6.3055153,
    ),
    'Hay baling, round bales, broadacre crop, conventional': massPerArea(
      'CO2e',
      8.4073537,
    ),
    'Hay baling, small square bales, broadacre crop, controlled traffic':
      massPerArea('CO2e', 5.2587499),
    'Hay baling, small square bales, broadacre crop, conventional': massPerArea(
      'CO2e',
      7.0116665,
    ),
    'Hay mowing, broadacre crop, controlled traffic': massPerArea(
      'CO2e',
      11.414727,
    ),
    'Hay mowing, broadacre crop, conventional': massPerArea('CO2e', 15.219636),
    'Hay raking, broadacre crop, controlled traffic': massPerArea(
      'CO2e',
      1.0218424,
    ),
    'Hay raking, broadacre crop, conventional': massPerArea('CO2e', 1.3624565),
    // 'Hose move sprinkler irrigation syster, production,': massPerArea('CO2e', per ha 	x),
    'Inter-row cultivation, horticulture': massPerArea('CO2e', 29.907582),
    'Inter-row tractor, horticulture': massPerArea('CO2e', 29.907582),
    'Irrigation, centre pivot irrigation system': massPerArea(
      'CO2e',
      0.14106261,
    ),
    'Irrigation, hose move sprinkler system': massPerArea('CO2e', 0.14106261),
    'Irrigation, pipe irrigation system': massPerArea('CO2e', 0.14106261),
    'Irrigation, solid set irrigation system': massPerArea('CO2e', 0.14106261),
    'Irrigation, travel spray boom irrigation system': massPerArea(
      'CO2e',
      0.14106264,
    ),
    'Irrigation, under tree irrigation system': massPerArea('CO2e', 0.14106261),
    'Irrigation,flood or furrow irrigation': massPerArea('CO2e', 0.04220012),
    'Irrigation,travelling gun irrigation system': massPerArea(
      'CO2e',
      0.14106261,
    ),
    'Levelling, cotton': massPerArea('CO2e', 146.21485),
    'Liming, broadacre crop, pre & post-emergence, controlled traffic':
      massPerArea('CO2e', 2.8661433),
    'Liming, broadacre crop, pre & post-emergence, conventional': massPerArea(
      'CO2e',
      3.8215244,
    ),
    'Mulching, cotton': massPerArea('CO2e', 25.587598),
    'Offset disc harrowing, horticulture': massPerArea('CO2e', 57.156713),
    'Pasture establishment, SE Qld': massPerArea('CO2e', 430.78824),
    'Pasture establishment, top end, NT': massPerArea('CO2e', 50.27388),
    'Picking, cotton': massPerArea('CO2e', 72.442811),
    'Planting, broadacre crop, soil clay content 0 to 10%, controlled traffic':
      massPerArea('CO2e', 8.473815),
    'Planting, broadacre crop, soil clay content 0 to 10%, conventional':
      massPerArea('CO2e', 11.29842),
    'Planting, broadacre crop, soil clay content 10 to 20%, controlled traffic':
      massPerArea('CO2e', 7.8956017),
    'Planting, broadacre crop, soil clay content 10 to 20%, conventional':
      massPerArea('CO2e', 14.621485),
    'Planting, broadacre crop, soil clay content greater than 20%, controlled traffic':
      massPerArea('CO2e', 11.125621),
    'Planting, broadacre crop, soil clay content greater than 20%, conventional':
      massPerArea('CO2e', 20.603001),
    'Planting, cotton': massPerArea('CO2e', 11.630726),
    'Precision planting, horticulture': massPerArea('CO2e', 69.119746),
    'Ripping, large implement, horticulture': massPerArea('CO2e', 112.9842),
    'Ripping, medium implement, horticulture': massPerArea('CO2e', 69.784359),
    'Rolling, cotton': massPerArea('CO2e', 10.301501),
    'Root cutting, cotton': massPerArea('CO2e', 11.29842),
    'Rotary hoeing, medium implement, horticulture': massPerArea(
      'CO2e',
      154.85482,
    ),
    'Savanna burning, northern Australia woodland, Qld & NT': massPerArea(
      'CO2e',
      418.58351,
    ),
    'Savanna burning, open eucalypt woodland, late dry season, Qld & NT':
      massPerArea('CO2e', 335.32068),
    'Scarifiying, broadacre crop, controlled traffic': massPerArea(
      'CO2e',
      16.997476,
    ),
    'Scarifiying, broadacre crop, conventional': massPerArea('CO2e', 22.663301),
    'Seedling transplanting, horticulture': massPerArea('CO2e', 54.165955),
    'Spraying, aerial, broadacre crop': massPerArea('CO2e', 5.8381701),
    'Spraying, aerial, cotton': massPerArea('CO2e', 4.8580474),
    'Spraying, aerial, rice': massPerArea('CO2e', 30.610946),
    'Spraying, broadacre crop, pre & post-emergence, controlled traffic':
      massPerArea('CO2e', 1.744609),
    'Spraying, broadacre crop, pre & post-emergence, conventional': massPerArea(
      'CO2e',
      2.3261453,
    ),
    'Windrowing, broadacre crop, controlled traffic': massPerArea(
      'CO2e',
      11.963033,
    ),
    'Windrowing, broadacre crop, conventional': massPerArea('CO2e', 15.950711),
  },
  SERVICE_EMISSIONS_BY_HOUR: {
    'Bulldozer operation, medium load factor': massPerTime('CO2e', 96.742751),
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
    'Inert waste (including concrete, metal, plastic or glass)': massPerMass(
      'CO2e',
      'Solid Waste',
      0,
    ),
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
    'Inert waste (including concrete, metal, plastic or glass)': massPerMass(
      'CO2e',
      'Solid Waste',
      0.11,
    ),
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
    'Inert waste (including concrete, metal, plastic or glass)': massPerVolume(
      'Solid Waste',
      'Solid Waste',
      0.42,
    ),
    'Municipal solid waste': massPerVolume('Solid Waste', 'Solid Waste', 0.36),
    'Commercial waste': massPerVolume('Solid Waste', 'Solid Waste', 0.33),
    'Industrial waste': massPerVolume('Solid Waste', 'Solid Waste', 0.33),
    'Construction and demolition waste': massPerVolume(
      'Solid Waste',
      'Solid Waste',
      0.39,
    ),
  },

  CRUDE_PROTEIN_TO_NITROGEN_CONVERSION: massPerMass('CrudeProtein', 'N', 6.25),

  // Appendix A1 Table A.3.1.2
  PURCHASED_FEED_FACTORS: {
    'Meat Meal': massPerMass('CO2e', 'Purchased Feed', 0.386),
    'Blood Meal': massPerMass('CO2e', 'Purchased Feed', 1.9),
    Millrun: massPerMass('CO2e', 'Purchased Feed', 0.3),
    'Whole Sardines': massPerMass('CO2e', 'Purchased Feed', 0.3),
    'Low Animal Protein': massPerMass('CO2e', 'Purchased Feed', 2.2),
    'Formulated Feed': massPerMass('CO2e', 'Purchased Feed', 2.2),
    Squid: massPerMass('CO2e', 'Purchased Feed', 0.3),
    'Whole Fish': massPerMass('CO2e', 'Purchased Feed', 0.3),
    'Custom Bait': massPerMass('CO2e', 'Purchased Feed', 0.08),
    'Almond hulls and shells, at huller and sheller ': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.016265082,
    ),
    'Animal feed, meat chickens , meat chicken feed production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.59376877,
    ),
    'Animal feed, pigs , pig feed production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.40287848,
    ),
    'Animal protein meal , dry rendering': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.39104334,
    ),
    'Animal protein meal , market for meat meal': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.40808088,
    ),
    'Bagasse, surplus at mill gate , AU-QLD, sugarcane milling': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.034101696,
    ),
    'Barley straw , AU-NSW, market for barley straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.043891082,
    ),
    'Barley straw , AU-NT, market for barley straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.050814396,
    ),
    'Barley straw , AU-QLD, market for barley straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.04540232,
    ),
    'Barley straw , AU-SA, market for barley straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.04015343,
    ),
    'Barley straw , AU-TAS, market for barley straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.052039382,
    ),
    'Barley straw , AU-VIC, market for barley straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.04161249,
    ),
    'Barley straw , AU-WA, market for barley straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.041766341,
    ),
    'Barley straw , market for barley straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.042029926,
    ),
    'Barley straw, dryland, Brisbane , AU-QLD, barley grain production':
      massPerMass('CO2e', 'Purchased Feed', 0.046331353),
    'Barley straw, dryland, C Highlands , AU-QLD, barley grain production':
      massPerMass('CO2e', 'Purchased Feed', 0.039602821),
    'Barley straw, dryland, Central Plains , AU-NSW, barley grain production':
      massPerMass('CO2e', 'Purchased Feed', 0.036197421),
    'Barley straw, dryland, Darling D , AU-QLD, barley grain production':
      massPerMass('CO2e', 'Purchased Feed', 0.036930181),
    'Barley straw, dryland, Dawson , AU-QLD, barley grain production':
      massPerMass('CO2e', 'Purchased Feed', 0.033795412),
    'Barley straw, dryland, Desserts , AU-SA, barley grain production':
      massPerMass('CO2e', 'Purchased Feed', 0.042549304),
    'Barley straw, dryland, Goldfields , AU-SA, barley grain production':
      massPerMass('CO2e', 'Purchased Feed', 0.042988877),
    'Barley straw, dryland, Granite Belt , AU-NSW, barley grain production':
      massPerMass('CO2e', 'Purchased Feed', 0.048758852),
    'Barley straw, dryland, Lower SW , AU-WA, barley grain production':
      massPerMass('CO2e', 'Purchased Feed', 0.054133878),
    'Barley straw, dryland, Mallee , AU-SA, barley grain production':
      massPerMass('CO2e', 'Purchased Feed', 0.031827994),
    'Barley straw, dryland, Maranoa , AU-QLD, barley grain production':
      massPerMass('CO2e', 'Purchased Feed', 0.039390732),
    'Barley straw, dryland, Melbourne , AU-VIC, barley grain production':
      massPerMass('CO2e', 'Purchased Feed', 0.044963459),
    'Barley straw, dryland, N Central , AU-TAS, barley grain production':
      massPerMass('CO2e', 'Purchased Feed', 0.04377429),
    'Barley straw, dryland, Riverina , AU-VIC, barley grain production':
      massPerMass('CO2e', 'Purchased Feed', 0.031079262),
    'Barley straw, dryland, S Coast , AU-SA, barley grain production':
      massPerMass('CO2e', 'Purchased Feed', 0.030706476),
    'Barley straw, dryland, S Highland and Gippsland , AU-NSW, barley grain production':
      massPerMass('CO2e', 'Purchased Feed', 0.045634808),
    'Barley straw, dryland, SE Vic Coast , AU-VIC, barley grain production':
      massPerMass('CO2e', 'Purchased Feed', 0.040108979),
    'Barley straw, dryland, South West , AU-WA, barley grain production':
      massPerMass('CO2e', 'Purchased Feed', 0.033342735),
    'Barley straw, dryland, W Downs , AU-NSW, barley grain production':
      massPerMass('CO2e', 'Purchased Feed', 0.036363837),
    'Barley straw, dryland, W Wheatbelt , AU-WA, barley grain production':
      massPerMass('CO2e', 'Purchased Feed', 0.033436965),
    'Barley straw, dryland, WB Burnett , AU-QLD, barley grain production':
      massPerMass('CO2e', 'Purchased Feed', 0.043990047),
    'Beef pet food, hot standard carcase weight , cattle processing':
      massPerMass('CO2e', 'Purchased Feed', 5.5488189),
    'Blood meal , dry rendering': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.39104334,
    ),
    'Blood meal , market for meat meal': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.40808088,
    ),
    'Canola straw , AU-NSW, market for canola straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.037257415,
    ),
    'Canola straw , AU-NT, market for canola straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.046843625,
    ),
    'Canola straw , AU-QLD, market for canola straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.037712368,
    ),
    'Canola straw , AU-SA, market for canola straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.033060852,
    ),
    'Canola straw , AU-TAS, market for canola straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.045624885,
    ),
    'Canola straw , AU-VIC, market for canola straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.036704736,
    ),
    'Canola straw , AU-WA, market for canola straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.036844846,
    ),
    'Canola straw , market for canola straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.036557904,
    ),
    'Canola straw, dryland, Central Plains , AU-NSW, canola seed production':
      massPerMass('CO2e', 'Purchased Feed', 0.029209237),
    'Canola straw, dryland, Desserts , AU-SA, canola seed production':
      massPerMass('CO2e', 'Purchased Feed', 0.038578533),
    'Canola straw, dryland, Goldfields , AU-SA, canola seed production':
      massPerMass('CO2e', 'Purchased Feed', 0.031788102),
    'Canola straw, dryland, Granite Belt , AU-NSW, canola seed production':
      massPerMass('CO2e', 'Purchased Feed', 0.038162133),
    'Canola straw, dryland, Mallee , AU-SA, canola seed production':
      massPerMass('CO2e', 'Purchased Feed', 0.024185029),
    'Canola straw, dryland, Melbourne , AU-VIC, canola seed production':
      massPerMass('CO2e', 'Purchased Feed', 0.03598532),
    'Canola straw, dryland, N Central , AU-TAS, canola seed production':
      massPerMass('CO2e', 'Purchased Feed', 0.037359792),
    'Canola straw, dryland, Riverina , AU-VIC, canola seed production':
      massPerMass('CO2e', 'Purchased Feed', 0.024992554),
    'Canola straw, dryland, S Coast , AU-SA, canola seed production':
      massPerMass('CO2e', 'Purchased Feed', 0.025540921),
    'Canola straw, dryland, S Highland and Gippsland , AU-NSW, canola seed production':
      massPerMass('CO2e', 'Purchased Feed', 0.037261456),
    'Canola straw, dryland, SE Vic Coast , AU-VIC, canola seed production':
      massPerMass('CO2e', 'Purchased Feed', 0.035046524),
    'Canola straw, dryland, South West , AU-WA, canola seed production':
      massPerMass('CO2e', 'Purchased Feed', 0.028806464),
    'Canola straw, dryland, W Downs , AU-NSW, canola seed production':
      massPerMass('CO2e', 'Purchased Feed', 0.028269153),
    'Canola straw, dryland, W Wheatbelt , AU-WA, canola seed production':
      massPerMass('CO2e', 'Purchased Feed', 0.028454205),
    'Cereal hay , AU-NSW, market for cereal hay': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.19339005,
    ),
    'Cereal hay , AU-QLD, market for cereal hay': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.18856305,
    ),
    'Cereal hay , AU-SA, market for cereal hay': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.1949643,
    ),
    'Cereal hay , AU-TAS, market for cereal hay': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.2674033,
    ),
    'Cereal hay , AU-VIC, market for cereal hay': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.20422468,
    ),
    'Cereal hay , AU-WA, market for cereal hay': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.21914021,
    ),
    'Cereal hay , market for cereal hay': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.20352754,
    ),
    'Cereal hay and silage, dryland, Central, NSW, at farm ': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.27247982,
    ),
    'Cereal hay and silage, dryland, Northern Rivers and Mid-north Coast, NSW, at farm ':
      massPerMass('CO2e', 'Purchased Feed', 0.30001686),
    'Cereal hay, dryland, Brisbane , AU-QLD, cereal hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.22629807),
    'Cereal hay, dryland, Central Plains , AU-NSW, cereal hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.1720438),
    'Cereal hay, dryland, Darling D , AU-QLD, cereal hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.17916052),
    'Cereal hay, dryland, Dawson , AU-QLD, cereal hay production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.17139496,
    ),
    'Cereal hay, dryland, Goldfields , AU-SA, cereal hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.17595092),
    'Cereal hay, dryland, Granite Belt , AU-NSW, cereal hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.20587695),
    'Cereal hay, dryland, Lower SW , AU-WA, cereal hay production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.25687063,
    ),
    'Cereal hay, dryland, Mallee , AU-SA, cereal hay production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.16842486,
    ),
    'Cereal hay, dryland, Maranoa , AU-QLD, cereal hay production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.15776704,
    ),
    'Cereal hay, dryland, Melbourne , AU-VIC, cereal hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.21953066),
    'Cereal hay, dryland, N Central , AU-TAS, cereal hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.2615926),
    'Cereal hay, dryland, Riverina , AU-VIC, cereal hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.178704),
    'Cereal hay, dryland, S Coast , AU-SA, cereal hay production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.20352552,
    ),
    'Cereal hay, dryland, S Highland and Gippsland , AU-NSW, cereal hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.23161237),
    'Cereal hay, dryland, SE Vic Coast , AU-VIC, cereal hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.23491504),
    'Cereal hay, dryland, South West , AU-WA, cereal hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.20018474),
    'Cereal hay, dryland, Tas Forest , AU-TAS, cereal hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.26026109),
    'Cereal hay, dryland, W Downs , AU-NSW, cereal hay production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.16708157,
    ),
    'Cereal hay, dryland, W Wheatbelt , AU-WA, cereal hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.16449494),
    'Cereal hay, dryland, WB Burnett , AU-QLD, cereal hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.1962563),
    'Cereal silage , AU-NSW, market for cereal silage': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.19797507,
    ),
    'Cereal silage , AU-QLD, market for cereal silage': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.19579885,
    ),
    'Cereal silage , AU-SA, market for cereal silage': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.1950142,
    ),
    'Cereal silage , AU-TAS, market for cereal silage': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.27684085,
    ),
    'Cereal silage , AU-VIC, market for cereal silage': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.2139011,
    ),
    'Cereal silage , market for cereal silage': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.20709738,
    ),
    'Cereal silage, dryland, Central Plains , AU-NSW, cereal silage production':
      massPerMass('CO2e', 'Purchased Feed', 0.17506255),
    'Cereal silage, dryland, Dawson , AU-QLD, cereal silage production':
      massPerMass('CO2e', 'Purchased Feed', 0.17207212),
    'Cereal silage, dryland, Melbourne , AU-VIC, cereal silage production':
      massPerMass('CO2e', 'Purchased Feed', 0.22662455),
    'Cereal silage, dryland, Riverina , AU-VIC, cereal silage production':
      massPerMass('CO2e', 'Purchased Feed', 0.18227025),
    'Cereal silage, dryland, S Highland and Gippsland , AU-NSW, cereal silage production':
      massPerMass('CO2e', 'Purchased Feed', 0.2397376),
    'Cereal silage, dryland, SE Vic Coast , AU-VIC, cereal silage production':
      massPerMass('CO2e', 'Purchased Feed', 0.24371749),
    'Cereal silage, dryland, Tas Forest , AU-TAS, cereal silage production':
      massPerMass('CO2e', 'Purchased Feed', 0.27100198),
    'Cereal silage, dryland, WB Burnett , AU-QLD, cereal silage production':
      massPerMass('CO2e', 'Purchased Feed', 0.19955813),
    'Chicken feed , market for chicken feed': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.59376877,
    ),
    'Chicken pet food , chicken meat processing': massPerMass(
      'CO2e',
      'Purchased Feed',
      1.6100318,
    ),
    'Chickpea straw, dryland, Brisbane , AU-QLD, chickpea production':
      massPerMass('CO2e', 'Purchased Feed', 0.016321379),
    'Chickpea straw, dryland, Burdekin , AU-QLD, chickpea production':
      massPerMass('CO2e', 'Purchased Feed', 0.0087918569),
    'Chickpea straw, dryland, Burnett , AU-QLD, chickpea production':
      massPerMass('CO2e', 'Purchased Feed', 0.0093616269),
    'Chickpea straw, dryland, C Highlands , AU-QLD, chickpea production':
      massPerMass('CO2e', 'Purchased Feed', 0.013585483),
    'Chickpea straw, dryland, C QLD Coast , AU-QLD, chickpea production':
      massPerMass('CO2e', 'Purchased Feed', 0.011472937),
    'Chickpea straw, dryland, Central Plains , AU-NSW, chickpea production':
      massPerMass('CO2e', 'Purchased Feed', 0.011138223),
    'Chickpea straw, dryland, Darling D , AU-QLD, chickpea production':
      massPerMass('CO2e', 'Purchased Feed', 0.012828125),
    'Chickpea straw, dryland, Dawson , AU-QLD, chickpea production':
      massPerMass('CO2e', 'Purchased Feed', 0.010702237),
    'Chickpea straw, dryland, Desserts , AU-SA, chickpea production':
      massPerMass('CO2e', 'Purchased Feed', 0.017403924),
    'Chickpea straw, dryland, Goldfields , AU-SA, chickpea production':
      massPerMass('CO2e', 'Purchased Feed', 0.014377397),
    'Chickpea straw, dryland, Granite Belt , AU-NSW, chickpea production':
      massPerMass('CO2e', 'Purchased Feed', 0.014479326),
    'Chickpea straw, dryland, Mallee , AU-SA, chickpea production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.016976816,
    ),
    'Chickpea straw, dryland, Maranoa , AU-QLD, chickpea production':
      massPerMass('CO2e', 'Purchased Feed', 0.013687657),
    'Chickpea straw, dryland, Riverina , AU-VIC, chickpea production':
      massPerMass('CO2e', 'Purchased Feed', 0.013313506),
    'Chickpea straw, dryland, S Coast , AU-SA, chickpea production':
      massPerMass('CO2e', 'Purchased Feed', 0.0092447063),
    'Chickpea straw, dryland, South West , AU-WA, chickpea production':
      massPerMass('CO2e', 'Purchased Feed', 0.021067416),
    'Chickpea straw, dryland, W Downs , AU-NSW, chickpea production':
      massPerMass('CO2e', 'Purchased Feed', 0.011095756),
    'Chickpea straw, dryland, W Wheatbelt , AU-WA, chickpea production':
      massPerMass('CO2e', 'Purchased Feed', 0.02452217),
    'Chickpea straw, dryland, WB Burnett , AU-QLD, chickpea production':
      massPerMass('CO2e', 'Purchased Feed', 0.019509207),
    'Cottonseed hulls, at mill ': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.12595695,
    ),
    'Dairy calf feed , market for dairy calf feed': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.41923505,
    ),
    'Dairy calf feed, concentrate meal , AU-VIC, Production of dairy calf feed':
      massPerMass('CO2e', 'Purchased Feed', 0.41923505),
    'Dairy cow feed , market for dairy cow feed': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.33263165,
    ),
    'Dairy cow feed, concentrate meal , AU-VIC, Production of dairy cow feed':
      massPerMass('CO2e', 'Purchased Feed', 0.33263165),
    'Dry season mix, 30% urea, 5,4% P, with protein meal, at production ':
      massPerMass('CO2e', 'Purchased Feed', 0.85514885),
    'Dry season mix, 30% urea, 5.5% P, at production ': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.85514885,
    ),
    'Dry season mix, 8% urea, 2,8% P, with protein meal, at production ':
      massPerMass('CO2e', 'Purchased Feed', 0.43866332),
    'Faba bean straw, dryland, Brisbane , AU-QLD, faba bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.0063836382),
    'Faba bean straw, dryland, Burdekin , AU-QLD, faba bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.0061290691),
    'Faba bean straw, dryland, Burnett , AU-QLD, faba bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.0059221243),
    'Faba bean straw, dryland, C Highlands , AU-QLD, faba bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.007268761),
    'Faba bean straw, dryland, C QLD Coast , AU-QLD, faba bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.0075941246),
    'Faba bean straw, dryland, Darling D , AU-QLD, faba bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.0068457017),
    'Faba bean straw, dryland, Dawson , AU-QLD, faba bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.0075503452),
    'Faba bean straw, dryland, Desserts , AU-SA, faba bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.017665864),
    'Faba bean straw, dryland, Goldfields , AU-SA, faba bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.01769888),
    'Faba bean straw, dryland, Granite Belt , AU-NSW, faba bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.012924077),
    'Faba bean straw, dryland, Mallee , AU-SA, faba bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.01071914),
    'Faba bean straw, dryland, Maranoa , AU-QLD, faba bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.0076199661),
    'Faba bean straw, dryland, Riverina , AU-VIC, faba bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.0073062099),
    'Faba bean straw, dryland, S Coast , AU-SA, faba bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.0072188529),
    'Faba bean straw, dryland, SE Vic Coast , AU-VIC, faba bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.0081912732),
    'Faba bean straw, dryland, South West , AU-WA, faba bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.0069915251),
    'Faba bean straw, dryland, W Wheatbelt , AU-WA, faba bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.010415913),
    'Faba bean straw, dryland, WB Burnett , AU-QLD, faba bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.0067654442),
    'Field bean straw, dryland, S Coast , AU-SA, field bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.011605078),
    'Field pea straw, dryland, Central Plains , AU-NSW, field pea production':
      massPerMass('CO2e', 'Purchased Feed', 0.0096415249),
    'Field pea straw, dryland, Desserts , AU-SA, field pea production':
      massPerMass('CO2e', 'Purchased Feed', 0.017864322),
    'Field pea straw, dryland, Goldfields , AU-SA, field pea production':
      massPerMass('CO2e', 'Purchased Feed', 0.01789773),
    'Field pea straw, dryland, Mallee , AU-SA, field pea production':
      massPerMass('CO2e', 'Purchased Feed', 0.011699957),
    'Field pea straw, dryland, Riverina , AU-VIC, field pea production':
      massPerMass('CO2e', 'Purchased Feed', 0.0094605215),
    'Field pea straw, dryland, S Highland and Gippsland , AU-NSW, field pea production':
      massPerMass('CO2e', 'Purchased Feed', 0.010069627),
    'Field pea straw, dryland, SE Vic Coast , AU-VIC, field pea production':
      massPerMass('CO2e', 'Purchased Feed', 0.010751629),
    'Field pea straw, dryland, South West , AU-WA, field pea production':
      massPerMass('CO2e', 'Purchased Feed', 0.0090271893),
    'Field pea straw, dryland, W Downs , AU-NSW, field pea production':
      massPerMass('CO2e', 'Purchased Feed', 0.012389435),
    'Field pea straw, dryland, W Wheatbelt , AU-WA, field pea production':
      massPerMass('CO2e', 'Purchased Feed', 0.011321718),

    'Forage sorghum , market for forage sorghum': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.0065451362,
    ),
    'Forage sorghum, dryland, Darling D , AU-QLD, forage sorghum production':
      massPerMass('CO2e', 'Purchased Feed', 0.16100172),
    'Forage sorghum, dryland, Maranoa , AU-QLD, forage sorghum production':
      massPerMass('CO2e', 'Purchased Feed', 0.14039598),
    'Forage sorghum, dryland, Riverina , AU-VIC, forage sorghum production':
      massPerMass('CO2e', 'Purchased Feed', 0.14214559),
    'Forage sorghum, irrigated, Darling Downs QLD ': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.35826409,
    ),
    'Forage sorghum, irrigated, northern Victoria ': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.28511728,
    ),
    'Health treatment and growth promotant, per feeder steer, NT ': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.0075847023,
    ),
    'Lamb pet food, hot standard carcase weight , lamb processing': massPerMass(
      'CO2e',
      'Purchased Feed',
      2.3749148,
    ),
    'Lentil straw, dryland, Brisbane , AU-QLD, lentils production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.0072995421,
    ),
    'Lentil straw, dryland, Central Plains , AU-NSW, lentils production':
      massPerMass('CO2e', 'Purchased Feed', 0.0087664923),
    'Lentil straw, dryland, Goldfields , AU-SA, lentils production':
      massPerMass('CO2e', 'Purchased Feed', 0.014830761),
    'Lentil straw, dryland, Granite Belt , AU-NSW, lentils production':
      massPerMass('CO2e', 'Purchased Feed', 0.043073211),
    'Lentil straw, dryland, Mallee , AU-SA, lentils production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.0075259506,
    ),
    'Lentil straw, dryland, Riverina , AU-VIC, lentils production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.0074192446,
    ),
    'Lentil straw, dryland, S Coast , AU-SA, lentils production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.0068024323,
    ),
    'Lentil straw, dryland, South West , AU-WA, lentils production':
      massPerMass('CO2e', 'Purchased Feed', 0.014403723),
    'Lentil straw, dryland, W Downs , AU-NSW, lentils production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.026547032,
    ),
    'Lentil straw, dryland, W Wheatbelt , AU-WA, lentils production':
      massPerMass('CO2e', 'Purchased Feed', 0.015988999),
    'Lucerne hay, dryland, Brisbane , AU-QLD, lucerne production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.13766596,
    ),
    'Lucerne hay, dryland, Granite Belt , AU-NSW, lucerne production':
      massPerMass('CO2e', 'Purchased Feed', 0.10077933),
    'Lucerne hay, dryland, Melbourne , AU-VIC, lucerne production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.098619417,
    ),
    'Lucerne hay, dryland, N Central , AU-TAS, lucerne production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.10503604,
    ),
    'Lucerne hay, dryland, Riverina , AU-VIC, lucerne production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.096325272,
    ),
    'Lucerne hay, dryland, SE Vic Coast , AU-VIC, lucerne production':
      massPerMass('CO2e', 'Purchased Feed', 0.10097292),
    'Lucerne hay, dryland, Sydney , AU-NSW, lucerne production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.11145957,
    ),
    'Lucerne hay, dryland, WB Burnett , AU-QLD, lucerne production':
      massPerMass('CO2e', 'Purchased Feed', 0.14612827),
    'Lucerne hay, irrigated, Brisbane , AU-QLD, lucerne production':
      massPerMass('CO2e', 'Purchased Feed', 0.22997643),
    'Lucerne hay, irrigated, Granite Belt , AU-NSW, lucerne production':
      massPerMass('CO2e', 'Purchased Feed', 0.16731529),
    'Lucerne hay, irrigated, Melbourne , AU-VIC, lucerne production':
      massPerMass('CO2e', 'Purchased Feed', 0.16666902),
    'Lucerne hay, irrigated, N Central , AU-TAS, lucerne production':
      massPerMass('CO2e', 'Purchased Feed', 0.17087221),
    'Lucerne hay, irrigated, Riverina , AU-VIC, lucerne production':
      massPerMass('CO2e', 'Purchased Feed', 0.1626109),
    'Lucerne hay, irrigated, SE Vic Coast , AU-VIC, lucerne production':
      massPerMass('CO2e', 'Purchased Feed', 0.1641657),
    'Lucerne hay, irrigated, Sydney , AU-NSW, lucerne production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.18075626,
    ),
    'Lucerne hay, irrigated, WB Burnett , AU-QLD, lucerne production':
      massPerMass('CO2e', 'Purchased Feed', 0.23211696),
    'Lupin straw, dryland, Central Plains , AU-NSW, lupin production':
      massPerMass('CO2e', 'Purchased Feed', 0.015883415),
    'Lupin straw, dryland, Darling D , AU-QLD, lupin production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.056500774,
    ),
    'Lupin straw, dryland, Dawson , AU-QLD, lupin production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.015382481,
    ),
    'Lupin straw, dryland, Goldfields , AU-SA, lupin production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.040509822,
    ),
    'Lupin straw, dryland, Granite Belt , AU-NSW, lupin production':
      massPerMass('CO2e', 'Purchased Feed', 0.020400654),
    'Lupin straw, dryland, Mallee , AU-SA, lupin production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.019675356,
    ),
    'Lupin straw, dryland, Riverina , AU-VIC, lupin production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.015937191,
    ),
    'Lupin straw, dryland, S Coast , AU-SA, lupin production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.012832636,
    ),
    'Lupin straw, dryland, S Highland and Gippsland , AU-NSW, lupin production':
      massPerMass('CO2e', 'Purchased Feed', 0.013753236),
    'Lupin straw, dryland, SE Vic Coast , AU-VIC, lupin production':
      massPerMass('CO2e', 'Purchased Feed', 0.011462087),
    'Lupin straw, dryland, South West , AU-WA, lupin production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.015423703,
    ),
    'Lupin straw, dryland, W Downs , AU-NSW, lupin production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.023541146,
    ),
    'Lupin straw, dryland, W Wheatbelt , AU-WA, lupin production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.017475024,
    ),
    'Maize silage , AU-VIC, market for maize silage': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.32773087,
    ),
    'Maize silage, irrigated, Central Plains , AU-NSW, maize silage production':
      massPerMass('CO2e', 'Purchased Feed', 0.28911074),
    'Maize silage, irrigated, Darling D , AU-QLD, maize silage production':
      massPerMass('CO2e', 'Purchased Feed', 0.26529526),
    'Maize silage, irrigated, Dawson , AU-QLD, maize silage production':
      massPerMass('CO2e', 'Purchased Feed', 0.25619788),
    'Maize silage, irrigated, Granite Belt , AU-NSW, maize silage production':
      massPerMass('CO2e', 'Purchased Feed', 0.31724664),
    'Maize silage, irrigated, N Rivers , AU-NSW, maize silage production':
      massPerMass('CO2e', 'Purchased Feed', 0.34362881),
    'Maize silage, irrigated, Riverina , AU-VIC, maize silage production':
      massPerMass('CO2e', 'Purchased Feed', 0.29758874),
    'Maize silage, irrigated, S Highland and Gippsland , AU-NSW, maize silage production':
      massPerMass('CO2e', 'Purchased Feed', 0.35193313),
    'Maize silage, irrigated, W Downs , AU-NSW, maize silage production':
      massPerMass('CO2e', 'Purchased Feed', 0.2695911),
    'Maize silage, irrigated, WB Burnett , AU-QLD, maize silage production':
      massPerMass('CO2e', 'Purchased Feed', 0.28709365),
    'Maize straw , AU-NSW, market for maize straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.032210199,
    ),
    'Maize straw , AU-NT, market for maize straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.04488673,
    ),
    'Maize straw , AU-QLD, market for maize straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.035320471,
    ),
    'Maize straw , AU-SA, market for maize straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.033834682,
    ),
    'Maize straw , AU-VIC, market for maize straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.031185489,
    ),
    'Maize straw , AU-WA, market for maize straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.045456878,
    ),
    'Maize straw , market for maize straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.034020681,
    ),
    'Maize straw, dryland, Brisbane , AU-QLD, maize production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.031986897,
    ),
    'Maize straw, dryland, Burnett , AU-QLD, maize production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.031958901,
    ),
    'Maize straw, dryland, Central Plains , AU-NSW, maize production':
      massPerMass('CO2e', 'Purchased Feed', 0.022895401),
    'Maize straw, dryland, Darling D , AU-QLD, maize production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.026119354,
    ),
    'Maize straw, dryland, Dawson , AU-QLD, maize production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.022183951,
    ),
    'Maize straw, dryland, Goldfields , AU-SA, maize production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.056209095,
    ),
    'Maize straw, dryland, Granite Belt , AU-NSW, maize production':
      massPerMass('CO2e', 'Purchased Feed', 0.034201222),
    'Maize straw, dryland, Kimberly , AU-WA, maize production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.036621638,
    ),
    'Maize straw, dryland, Riverina , AU-VIC, maize production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.019265152,
    ),
    'Maize straw, dryland, S Highland and Gippsland , AU-NSW, maize production':
      massPerMass('CO2e', 'Purchased Feed', 0.031257509),
    'Maize straw, dryland, W Downs , AU-NSW, maize production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.022853425,
    ),
    'Maize straw, dryland, WB Burnett , AU-QLD, maize production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.034394157,
    ),
    'Maize, silage irrigated, northern Victoria ': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.47817094,
    ),
    'Mineral block, 30% urea 3,6% P, at production ': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.65186503,
    ),
    'Molasses, C-grade, at mill gate, , AU-QLD, sugarcane milling': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.17050848,
    ),
    'Mung bean straw, dryland, Brisbane , AU-QLD, mung bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.034990386),
    'Mung bean straw, dryland, Burdekin , AU-QLD, mung bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.033606869),
    'Mung bean straw, dryland, Burnett , AU-QLD, mung bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.034149533),
    'Mung bean straw, dryland, C Highlands , AU-QLD, mung bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.039008201),
    'Mung bean straw, dryland, C QLD Coast , AU-QLD, mung bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.041747978),
    'Mung bean straw, dryland, Darling D , AU-QLD, mung bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.040006249),
    'Mung bean straw, dryland, Dawson , AU-QLD, mung bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.041407234),
    'Mung bean straw, dryland, Granite Belt , AU-NSW, mung bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.014378951),
    'Mung bean straw, dryland, Maranoa , AU-QLD, mung bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.034871107),
    'Mung bean straw, dryland, WB Burnett , AU-QLD, mung bean production':
      massPerMass('CO2e', 'Purchased Feed', 0.042196094),
    'Native Pasture hay, Northern Australia ': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.035076163,
    ),
    'Oat hay , AU-NSW, market for oat hay': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.20239497,
    ),
    'Oat hay , AU-QLD, market for oat hay': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.19079891,
    ),
    'Oat hay , AU-SA, market for oat hay': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.20261497,
    ),
    'Oat hay , AU-VIC, market for oat hay': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.21470326,
    ),
    'Oat hay , AU-WA, market for oat hay': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.22816499,
    ),
    'Oat hay , market for oat hay': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.21383072,
    ),
    'Oat straw , AU-NSW, market for oat straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.057090096,
    ),
    'Oat straw , AU-QLD, market for oat straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.076714067,
    ),
    'Oat straw , AU-SA, market for oat straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.043877018,
    ),
    'Oat straw , AU-TAS, market for oat straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.053194282,
    ),
    'Oat straw , AU-VIC, market for oat straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.049221442,
    ),
    'Oat straw , AU-WA, market for oat straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.043368094,
    ),
    'Oat straw , market for oat straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.048253579,
    ),
    'Oat straw, dryland, Central Plains , AU-NSW, oats production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.046025941,
    ),
    'Oat straw, dryland, Chanel , AU-QLD, oats production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.062788837,
    ),
    'Oat straw, dryland, Darling D , AU-QLD, oats production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.09748197,
    ),
    'Oat straw, dryland, Dawson , AU-QLD, oats production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.060293159,
    ),
    'Oat straw, dryland, Goldfields , AU-SA, oats production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.070717142,
    ),
    'Oat straw, dryland, Granite Belt , AU-NSW, oats production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.079776521,
    ),
    'Oat straw, dryland, Lower SW , AU-WA, oats production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.049296666,
    ),
    'Oat straw, dryland, Mallee , AU-SA, oats production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.034542714,
    ),
    'Oat straw, dryland, Maranoa , AU-QLD, oats production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.06054084,
    ),
    'Oat straw, dryland, N Central , AU-TAS, oats production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.04492919,
    ),
    'Oat straw, dryland, N Rivers , AU-NSW, oats production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.053472525,
    ),
    'Oat straw, dryland, Riverina , AU-VIC, oats production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.033510931,
    ),
    'Oat straw, dryland, S Coast , AU-SA, oats production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.032231334,
    ),
    'Oat straw, dryland, S Highland and Gippsland , AU-NSW, oats production':
      massPerMass('CO2e', 'Purchased Feed', 0.053039409),
    'Oat straw, dryland, SE Vic Coast , AU-VIC, oats production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.044150607,
    ),
    'Oat straw, dryland, South West , AU-WA, oats production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.034070438,
    ),
    'Oat straw, dryland, W Downs , AU-NSW, oats production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.066998169,
    ),
    'Oat straw, dryland, W Wheatbelt , AU-WA, oats production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.035931076,
    ),
    'Oaten hay for export, dryland, Central Plains , AU-NSW, oat hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.17904521),
    'Oaten hay for export, dryland, Goldfields , AU-SA, oat hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.18530001),
    'Oaten hay for export, dryland, Granite Belt , AU-NSW, oat hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.21967506),
    'Oaten hay for export, dryland, Lower SW , AU-WA, oat hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.2696275),
    'Oaten hay for export, dryland, Mallee , AU-SA, oat hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.17377555),
    'Oaten hay for export, dryland, Melbourne , AU-VIC, oat hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.23125476),
    'Oaten hay for export, dryland, Riverina , AU-VIC, oat hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.18566637),
    'Oaten hay for export, dryland, S Coast , AU-SA, oat hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.21241556),
    'Oaten hay for export, dryland, S Highland and Gippsland , AU-NSW, oat hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.24405757),
    'Oaten hay for export, dryland, SE Vic Coast , AU-VIC, oat hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.2508174),
    'Oaten hay for export, dryland, South West , AU-WA, oat hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.2089084),
    'Oaten hay for export, dryland, W Downs , AU-NSW, oat hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.17268604),
    'Oaten hay for export, dryland, W Wheatbelt , AU-WA, oat hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.16956969),
    'Oaten hay, export, medium rainfall zone SA ': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.079559326,
    ),
    'Pasture establishment, SE Qld ': massPerMass(
      'CO2e',
      'Purchased Feed',
      430.78824,
    ),
    'Pasture establishment, top end, NT ': massPerMass(
      'CO2e',
      'Purchased Feed',
      50.27388,
    ),
    'Pasture hay , AU-NSW, market for pasture hay': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.31127977,
    ),
    'Pasture hay , AU-QLD, market for pasture hay': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.25416992,
    ),
    'Pasture hay , AU-SA, market for pasture hay': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.31312471,
    ),
    'Pasture hay , AU-TAS, market for pasture hay': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.39818974,
    ),
    'Pasture hay , AU-VIC, market for pasture hay': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.34480165,
    ),
    'Pasture hay , AU-WA, market for pasture hay': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.36828613,
    ),
    'Pasture hay , market for pasture hay': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.33910067,
    ),
    'Pasture hay, dryland, Central Plains , AU-NSW, pasture hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.25832582),
    'Pasture hay, dryland, Dawson , AU-QLD, pasture hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.25274291),
    'Pasture hay, dryland, Lower SW , AU-WA, pasture hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.39082938),
    'Pasture hay, dryland, Maranoa , AU-QLD, pasture hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.22827874),
    'Pasture hay, dryland, Melbourne , AU-VIC, pasture hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.33466773),
    'Pasture hay, dryland, N Central , AU-TAS, pasture hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.3856249),
    'Pasture hay, dryland, N Rivers , AU-NSW, pasture hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.3879855),
    'Pasture hay, dryland, Riverina , AU-VIC, pasture hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.26805701),
    'Pasture hay, dryland, S Highland and Gippsland , AU-NSW, pasture hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.35439228),
    'Pasture hay, dryland, SE Vic Coast , AU-VIC, pasture hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.36200106),
    'Pasture hay, dryland, South West , AU-WA, pasture hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.30139181),
    'Pasture hay, dryland, Sydney , AU-NSW, pasture hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.38437977),
    'Pasture hay, dryland, Tas Forest , AU-TAS, pasture hay production':
      massPerMass('CO2e', 'Purchased Feed', 0.39556733),
    'Pet food, beef , market for pet food from beef processing': massPerMass(
      'CO2e',
      'Purchased Feed',
      5.5658564,
    ),
    'Pet food, lamb , market for pet food from lamb processing': massPerMass(
      'CO2e',
      'Purchased Feed',
      2.3919523,
    ),
    'Pet food, pork , market for pet food from pork processing': massPerMass(
      'CO2e',
      'Purchased Feed',
      1.6441321,
    ),
    'Pig feed , market for pig feed': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.40287848,
    ),
    'Pork pet food, hot standard carcase weight , pork processing': massPerMass(
      'CO2e',
      'Purchased Feed',
      1.6270946,
    ),
    'Rice husk, Riverina , AU-NSW, rice processing': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.25530631,
    ),
    'Sorghum straw , AU-NSW, market for sorghum straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.038105811,
    ),
    'Sorghum straw , AU-QLD, market for sorghum straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.037776189,
    ),
    'Sorghum straw , AU-SA, market for sorghum straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.036441867,
    ),
    'Sorghum straw , AU-VIC, market for sorghum straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.04010387,
    ),
    'Sorghum straw , market for sorghum straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.037895283,
    ),
    'Sorghum straw, dryland, Brisbane , AU-QLD, sorghum production':
      massPerMass('CO2e', 'Purchased Feed', 0.035624365),
    'Sorghum straw, dryland, Burdekin , AU-QLD, sorghum production':
      massPerMass('CO2e', 'Purchased Feed', 0.033863382),
    'Sorghum straw, dryland, Burnett , AU-QLD, sorghum production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.045125321,
    ),
    'Sorghum straw, dryland, C Highlands , AU-QLD, sorghum production':
      massPerMass('CO2e', 'Purchased Feed', 0.029723718),
    'Sorghum straw, dryland, C QLD Coast , AU-QLD, sorghum production':
      massPerMass('CO2e', 'Purchased Feed', 0.040306661),
    'Sorghum straw, dryland, Cape York , AU-QLD, sorghum production':
      massPerMass('CO2e', 'Purchased Feed', 0.087330811),
    'Sorghum straw, dryland, Central Plains , AU-NSW, sorghum production':
      massPerMass('CO2e', 'Purchased Feed', 0.030648266),
    'Sorghum straw, dryland, Darling D , AU-QLD, sorghum production':
      massPerMass('CO2e', 'Purchased Feed', 0.028141457),
    'Sorghum straw, dryland, Dawson , AU-QLD, sorghum production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.030137735,
    ),
    'Sorghum straw, dryland, Granite Belt , AU-NSW, sorghum production':
      massPerMass('CO2e', 'Purchased Feed', 0.040895676),
    'Sorghum straw, dryland, Maranoa , AU-QLD, sorghum production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.031901226,
    ),
    'Sorghum straw, dryland, Riverina , AU-VIC, sorghum production':
      massPerMass('CO2e', 'Purchased Feed', 0.028176775),
    'Sorghum straw, dryland, S Highland and Gippsland , AU-NSW, sorghum production':
      massPerMass('CO2e', 'Purchased Feed', 0.045352666),
    'Sorghum straw, dryland, W Downs , AU-NSW, sorghum production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.028037204,
    ),
    'Sorghum straw, dryland, WB Burnett , AU-QLD, sorghum production':
      massPerMass('CO2e', 'Purchased Feed', 0.032225268),
    'Sunflower straw, dryland, Burdekin , AU-QLD, sunflower production':
      massPerMass('CO2e', 'Purchased Feed', 0.01974335),
    'Sunflower straw, dryland, C QLD Coast , AU-QLD, sunflower production':
      massPerMass('CO2e', 'Purchased Feed', 0.026444845),
    'Sunflower straw, dryland, Central Plains , AU-NSW, sunflower production':
      massPerMass('CO2e', 'Purchased Feed', 0.019437443),
    'Sunflower straw, dryland, Darling D , AU-QLD, sunflower production':
      massPerMass('CO2e', 'Purchased Feed', 0.019601403),
    'Sunflower straw, dryland, Dawson , AU-QLD, sunflower production':
      massPerMass('CO2e', 'Purchased Feed', 0.026351749),
    'Sunflower straw, dryland, Granite Belt , AU-NSW, sunflower production':
      massPerMass('CO2e', 'Purchased Feed', 0.024930742),
    'Sunflower straw, dryland, N Rivers , AU-NSW, sunflower production':
      massPerMass('CO2e', 'Purchased Feed', 0.030460417),
    'Sunflower straw, dryland, Riverina , AU-VIC, sunflower production':
      massPerMass('CO2e', 'Purchased Feed', 0.016551909),
    'Sunflower straw, dryland, W Downs , AU-NSW, sunflower production':
      massPerMass('CO2e', 'Purchased Feed', 0.022622555),
    'Sunflower straw, dryland, WB Burnett , AU-QLD, sunflower production':
      massPerMass('CO2e', 'Purchased Feed', 0.022623357),
    'Tallow , dry rendering': massPerMass('CO2e', 'Purchased Feed', 0.8156093),
    'Tallow , market for tallow': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.83264684,
    ),
    'Vaccination and anthelmintic, herd requirement per breeder, northern cattle ':
      massPerMass('CO2e', 'Purchased Feed', 0.019906016),
    'Weaner Block, 7,1% Urea 0,5% P, at production ': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.21043393,
    ),
    'Wet season mix, 0% N 21% P, at production ': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.77953974,
    ),
    'Wet season mix, 20% GranAm, 40% Kynofos, 40% Salt, at production ':
      massPerMass('CO2e', 'Purchased Feed', 0.77953974),
    'Wheat straw , AU-NSW, market for wheat straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.041040352,
    ),
    'Wheat straw , AU-NT, market for wheat straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.050001029,
    ),
    'Wheat straw , AU-QLD, market for wheat straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.042966983,
    ),
    'Wheat straw , AU-SA, market for wheat straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.036850359,
    ),
    'Wheat straw , AU-TAS, market for wheat straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.048527048,
    ),
    'Wheat straw , AU-VIC, market for wheat straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.039159202,
    ),
    'Wheat straw , AU-WA, market for wheat straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.039089168,
    ),
    'Wheat straw , market for wheat straw': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.039614762,
    ),
    'Wheat straw, dryland, Brisbane , AU-QLD, wheat production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.043914012,
    ),
    'Wheat straw, dryland, Burnett , AU-QLD, wheat production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.043691546,
    ),
    'Wheat straw, dryland, C Highlands , AU-QLD, wheat production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.038713879,
    ),
    'Wheat straw, dryland, C QLD Coast , AU-QLD, wheat production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.058629047,
    ),
    'Wheat straw, dryland, Central Plains , AU-NSW, wheat production':
      massPerMass('CO2e', 'Purchased Feed', 0.032731287),
    'Wheat straw, dryland, Chanel , AU-QLD, wheat production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.038114289,
    ),
    'Wheat straw, dryland, Darling D , AU-QLD, wheat production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.035018461,
    ),
    'Wheat straw, dryland, Dawson , AU-QLD, wheat production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.035543037,
    ),
    'Wheat straw, dryland, Desserts , AU-SA, wheat production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.041735936,
    ),
    'Wheat straw, dryland, Gascoyne , AU-WA, wheat production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.048141547,
    ),
    'Wheat straw, dryland, Goldfields , AU-SA, wheat production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.041613707,
    ),
    'Wheat straw, dryland, Granite Belt , AU-NSW, wheat production':
      massPerMass('CO2e', 'Purchased Feed', 0.043445104),
    'Wheat straw, dryland, Lower SW , AU-WA, wheat production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.053665693,
    ),
    'Wheat straw, dryland, Mallee , AU-SA, wheat production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.027900226,
    ),
    'Wheat straw, dryland, Maranoa , AU-QLD, wheat production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.034215409,
    ),
    'Wheat straw, dryland, Melbourne , AU-VIC, wheat production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.03910777,
    ),
    'Wheat straw, dryland, N Central , AU-TAS, wheat production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.039739969,
    ),
    'Wheat straw, dryland, N Rivers , AU-NSW, wheat production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.060144081,
    ),
    'Wheat straw, dryland, Riverina , AU-VIC, wheat production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.028105828,
    ),
    'Wheat straw, dryland, S Coast , AU-SA, wheat production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.028165819,
    ),
    'Wheat straw, dryland, S Highland and Gippsland , AU-NSW, wheat production':
      massPerMass('CO2e', 'Purchased Feed', 0.041293643),
    'Wheat straw, dryland, SE Vic Coast , AU-VIC, wheat production':
      massPerMass('CO2e', 'Purchased Feed', 0.036837202),
    'Wheat straw, dryland, South West , AU-WA, wheat production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.031424098,
    ),
    'Wheat straw, dryland, Tas Forest , AU-TAS, wheat production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.041388943,
    ),
    'Wheat straw, dryland, W Downs , AU-NSW, wheat production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.033669156,
    ),
    'Wheat straw, dryland, W Wheatbelt , AU-WA, wheat production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.030459715,
    ),
    'Wheat straw, dryland, WB Burnett , AU-QLD, wheat production': massPerMass(
      'CO2e',
      'Purchased Feed',
      0.045029242,
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

  // FracLEACHms
  FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF_SOLID_STORAGE: realNumber(0.02),

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
    'Anaerobic digestor / Covered lagoon': {
      N_VOLATISED_EF: realNumber(0),
      N2O_EF: realNumber(0),
    },
    'Short HRT tank storage < 1 month (pit storage)': {
      N_VOLATISED_EF: realNumber(0.25),
      N2O_EF: realNumber(0.002),
    },
    'Direct application': {
      N_VOLATISED_EF: realNumber(0),
      N2O_EF: realNumber(0),
    },
  },
};
/*
Dry lot (Feedpad)	0.0054	0.6
Solid Storage (Stockpile)	0.005	0.25
Composting (Passive Windrow)	0.01	0.4
Uncovered anaerobic lagoon (Effluent pond)	0	0.35
*/

export const feedlotConstants: FeedlotConstants = {
  name: 'FEEDLOT',

  // A5.5.3.6,7 NIR vol 2
  MMS: {
    'Dry lot (Feedpad)': {
      N_VOLATISED_EF: realNumber(0.6),
      N2O_EF: realNumber(0.0054),
    },
    'Solid Storage (Stockpile)': {
      N_VOLATISED_EF: realNumber(0.25),
      N2O_EF: realNumber(0.005),
    },
    'Composting (Passive Windrow)': {
      N_VOLATISED_EF: realNumber(0.4),
      N2O_EF: realNumber(0.01),
    },
    'Uncovered anaerobic lagoon (Effluent Pond)': {
      N_VOLATISED_EF: realNumber(0.35),
      N2O_EF: realNumber(0),
    },
    'Direct application': {
      N_VOLATISED_EF: realNumber(0),
      N2O_EF: realNumber(0),
    },
  },

  // Table A5.5.3.1 National Inventory Report Volume 2 [4]
  FEED: {
    '0-80 days': {
      DRY_MATTER_INTAKE: massPerHeadPerDay('DryMatter', 10.4),
      CRUDE_PROTEIN_CONTENT: massPerMass('CrudeProtein', 'DryMatter', 0.14),
      NITROGEN_RETENTION_FRACTION: realNumber(0.204),
    },
    '81-200 days': {
      DRY_MATTER_INTAKE: massPerHeadPerDay('DryMatter', 10.8),
      CRUDE_PROTEIN_CONTENT: massPerMass('CrudeProtein', 'DryMatter', 0.12),
      NITROGEN_RETENTION_FRACTION: realNumber(0.127),
    },
    '201+ days': {
      DRY_MATTER_INTAKE: massPerHeadPerDay('DryMatter', 8.2),
      CRUDE_PROTEIN_CONTENT: massPerMass('CrudeProtein', 'DryMatter', 0.12),
      NITROGEN_RETENTION_FRACTION: realNumber(0.07),
    },
  },

  CRUDE_PROTEIN_TO_NITROGEN_CONVERSION: massPerMass('CrudeProtein', 'N', 6.25),
};

export const dairyConstants: DairyConstants = {
  name: 'DAIRY',

  CLASS_WEIGHTS: {
    milkingCows: {
      liveweight: mass('Liveweight', 550),
      liveweightGain: massPerHeadPerDay('Liveweight', 0.016),
      referenceWeight: mass('Liveweight', 590),
    },
    heifersGt1: {
      liveweight: mass('Liveweight', 370),
      liveweightGain: massPerHeadPerDay('Liveweight', 0.6),
      referenceWeight: mass('Liveweight', 590),
    },
    heifersLt1: {
      liveweight: mass('Liveweight', 179),
      liveweightGain: massPerHeadPerDay('Liveweight', 0.57),
      referenceWeight: mass('Liveweight', 590),
    },
    bullsGt1: {
      liveweight: mass('Liveweight', 600),
      liveweightGain: massPerHeadPerDay('Liveweight', 0.1),
      referenceWeight: mass('Liveweight', 770),
    },
    bullsLt1: {
      liveweight: mass('Liveweight', 225),
      liveweightGain: massPerHeadPerDay('Liveweight', 0.8),
      referenceWeight: mass('Liveweight', 770),
    },
  },

  CRUDE_PROTEIN_CONTENT_OF_FEED: realNumber(0.2),

  DRY_MATTER_DIGESTIBILITY: realNumber(0.75),

  // Ch 3.3 line 281
  EFFICIENCY_OF_MILK_PRODUCTION: realNumber(0.6),

  // Ch 3.3 line 270
  FAT_CONTENT: percentage(4.0),

  // Ch 4.2 line 952
  FracLEACH: realNumber(0.02),

  // Ch 3 line 279
  GROSS_ENERGY_CONTENT: energyPerMass('DryMatter', 18.4),

  // Ch 3.3 line 276
  INCREASE_METABOLIC_RATE_FOR_MILK: {
    milkingCows: massPerHeadPerDay('DryMatter', 1.1),
    others: massPerHeadPerDay('DryMatter', 1.0),
  },

  // Ch 4.2 line 950
  MMS: {
    anaerobicLagoon: {
      EFm: realNumber(0),
      FracGASM: realNumber(0.35),
    },
    sumpDispersal: {
      EFm: realNumber(0),
      FracGASM: realNumber(0.07),
    },
    drainToPaddock: {
      EFm: realNumber(0),
      FracGASM: realNumber(0.2),
    },
    solidStorage: {
      EFm: realNumber(0.005),
      FracGASM: realNumber(0.3),
    },
    pastureRangeAndPaddock: {
      EFm: realNumber(0),
      FracGASM: realNumber(0),
    },
  },

  // Ch 3.3 line 278
  NET_ENERGY_FOR_MILK_PRODUCTION: energyPerMass('Milk', 3.054),

  // Ch 4.2 line 930, 931
  PRE_WEANED_CLASSES: {
    bullsLt1: {
      urinaryN: massPerHeadPerDay('N', 0.0042),
      faecalN: massPerHeadPerDay('N', 0.005),
    },
    heifersLt1: {
      urinaryN: massPerHeadPerDay('N', 0.0082),
      faecalN: massPerHeadPerDay('N', 0.0055),
    },
  },

  // Ch 3.3 line 270
  PROTEIN_CONTENT: percentage(3.3),

  // Ch 4.2 line 902
  TIME_IN_LOCATIONS: {
    'Grazed only': {
      feedPad: realNumber(0),
      milkingShed: realNumber(0.11),
      pasture: realNumber(0.89),
    },
    'Limited feedpad': {
      feedPad: realNumber(0.1),
      milkingShed: realNumber(0.11),
      pasture: realNumber(0.79),
    },
    'Limited grazing': {
      feedPad: realNumber(0.356),
      milkingShed: realNumber(0.11),
      pasture: realNumber(0.534),
    },
    'Zero grazing': {
      feedPad: realNumber(0.89),
      milkingShed: realNumber(0.11),
      pasture: realNumber(0),
    },
  },
};

export const poultryConstants: PoultryConstants = {
  name: 'POULTRY',
  CLASSES: {
    layers: {
      dryMatterIntake: massPerHeadPerDay('DryMatter', 0.086),
      dryMatterDigestibility: realNumber(0.8),
      crudeProtein: massPerMass('CrudeProtein', 'DryMatter', 0.19),
      nitrogenRetentionRate: realNumber(0.35),
      manureAsh: realNumber(0.18),
    },
    meatChickenGrowers: {
      dryMatterIntake: massPerHeadPerDay('DryMatter', 0.093),
      dryMatterDigestibility: realNumber(0.8),
      crudeProtein: massPerMass('CrudeProtein', 'DryMatter', 0.23),
      nitrogenRetentionRate: realNumber(0.47),
      manureAsh: realNumber(0.15),
    },
    meatChickenBreeder: {
      dryMatterIntake: massPerHeadPerDay('DryMatter', 0.103),
      dryMatterDigestibility: realNumber(0.8),
      crudeProtein: massPerMass('CrudeProtein', 'DryMatter', 0.19),
      nitrogenRetentionRate: realNumber(0.32),
      manureAsh: realNumber(0.18),
    },
    meatOther: {
      dryMatterIntake: massPerHeadPerDay('DryMatter', 0.093),
      dryMatterDigestibility: realNumber(0.8),
      crudeProtein: massPerMass('CrudeProtein', 'DryMatter', 0.23),
      nitrogenRetentionRate: realNumber(0.47),
      manureAsh: realNumber(0.15),
    },
  },

  MMS: {
    manureWithLitter: {
      FracGASM: realNumber(0.3),
      EFm: realNumber(0.001),
    },
    beltManureRemoval: {
      FracGASM: realNumber(0.05),
      EFm: realNumber(0.001),
    },
    manureStoredInHouse: {
      FracGASM: realNumber(0.4),
      EFm: realNumber(0.02),
    },
    solidStorage: {
      FracGASM: realNumber(0.2),
      EFm: realNumber(0.005),
    },
    composting: {
      FracGASM: realNumber(0.2),
      EFm: realNumber(0.01),
    },
    directProcessing: {
      FracGASM: realNumber(0),
      EFm: realNumber(0),
    },
    digester: {
      FracGASM: realNumber(0),
      EFm: realNumber(0),
    },
  },
};
