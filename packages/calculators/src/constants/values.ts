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
  volumePerMass,
} from '@/tools/units';
import { State } from './enums';
import {
  BeefPastureConstants,
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

  GWP_CH4: massPerMass('CO2e', 'CH4', 28),

  EMISSIONS_POTENTIAL_VOLATILE_SOLIDS_TO_CH4: volumePerMass(
    'CH4',
    'Volatile Solids',
    0.19,
  ),

  DENSITY_OF_METHANE: massPerVolume('CH4', 'CH4', 0.6784),

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

  ASH_CONTENT_OF_MANURE: realNumber(0.16),
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

/*

*/

export const beefPastureConstants: BeefPastureConstants = {
  name: 'BEEF_PASTURE',

  DMD: {
    'ACT/NSW': {
      spring: realNumber(0.55),
      summer: realNumber(0.65),
      autumn: realNumber(0.6),
      winter: realNumber(0.5),
    },
    NT: {
      spring: realNumber(0.55),
      summer: realNumber(0.61),
      autumn: realNumber(0.57),
      winter: realNumber(0.54),
    },
    QLD: {
      spring: realNumber(0.53),
      summer: realNumber(0.57),
      autumn: realNumber(0.55),
      winter: realNumber(0.51),
    },
    SA: {
      spring: realNumber(0.7),
      summer: realNumber(0.55),
      autumn: realNumber(0.55),
      winter: realNumber(0.75),
    },
    TAS: {
      spring: realNumber(0.75),
      summer: realNumber(0.6),
      autumn: realNumber(0.7),
      winter: realNumber(0.75),
    },
    VIC: {
      spring: realNumber(0.8),
      summer: realNumber(0.55),
      autumn: realNumber(0.6),
      winter: realNumber(0.76),
    },
    'WA - South West': {
      spring: realNumber(0.8),
      summer: realNumber(0.58),
      autumn: realNumber(0.5),
      winter: realNumber(0.75),
    },
    'WA - Pilbara': {
      spring: realNumber(0.4),
      summer: realNumber(0.65),
      autumn: realNumber(0.55),
      winter: realNumber(0.45),
    },
    'WA - Kimberley': {
      spring: realNumber(0.4),
      summer: realNumber(0.65),
      autumn: realNumber(0.55),
      winter: realNumber(0.45),
    },
  },

  MCF_PASTURE: realNumber(0.0046),
  MCF_LAGOON: {
    'Cool temperate moist': realNumber(0.006),
    'Cool temperate dry': realNumber(0.0067),
    'Boreal moist': realNumber(0.005),
    'Boreal dry': realNumber(0.0049),
    'Warm temperate moist': realNumber(0.0073),
    'Warm temperate dry': realNumber(0.0076),
    'Tropical montane': realNumber(0.0076),
    'Tropical wet': realNumber(0.008),
    'Tropical moist': realNumber(0.008),
    'Tropical dry': realNumber(0.008),
  },
  LIVEWEIGHT: {
    'ACT/NSW': {
      bullsLt1: {
        spring: {
          liveweight: mass('Liveweight', 80),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.5),
        },
        summer: {
          liveweight: mass('Liveweight', 170),
          liveweightGain: massPerHeadPerDay('Liveweight', 1),
        },
        autumn: {
          liveweight: mass('Liveweight', 240),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.8),
        },
        winter: {
          liveweight: mass('Liveweight', 280),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.4),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: mass('Liveweight', 480),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.2),
        },
        summer: {
          liveweight: mass('Liveweight', 520),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.4),
        },
        autumn: {
          liveweight: mass('Liveweight', 550),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.3),
        },
        winter: {
          liveweight: mass('Liveweight', 560),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.1),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: mass('Liveweight', 75),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.5),
        },
        summer: {
          liveweight: mass('Liveweight', 160),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.9),
        },
        autumn: {
          liveweight: mass('Liveweight', 220),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.7),
        },
        winter: {
          liveweight: mass('Liveweight', 260),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.4),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 300),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.4),
        },
        summer: {
          liveweight: mass('Liveweight', 360),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.7),
        },
        autumn: {
          liveweight: mass('Liveweight', 390),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.3),
        },
        winter: {
          liveweight: mass('Liveweight', 410),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.2),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 440),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.3),
        },
        summer: {
          liveweight: mass('Liveweight', 470),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.3),
        },
        autumn: {
          liveweight: mass('Liveweight', 490),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.2),
        },
        winter: {
          liveweight: mass('Liveweight', 500),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.1),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 440),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.3),
        },
        summer: {
          liveweight: mass('Liveweight', 470),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.3),
        },
        autumn: {
          liveweight: mass('Liveweight', 490),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.2),
        },
        winter: {
          liveweight: mass('Liveweight', 500),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.1),
        },
      },
      steersLt1: {
        spring: {
          liveweight: mass('Liveweight', 75),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.5),
        },
        summer: {
          liveweight: mass('Liveweight', 160),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.9),
        },
        autumn: {
          liveweight: mass('Liveweight', 220),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.7),
        },
        winter: {
          liveweight: mass('Liveweight', 260),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.4),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 380),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.4),
        },
        summer: {
          liveweight: mass('Liveweight', 420),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.4),
        },
        autumn: {
          liveweight: mass('Liveweight', 450),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.3),
        },
        winter: {
          liveweight: mass('Liveweight', 460),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.1),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 380),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.4),
        },
        summer: {
          liveweight: mass('Liveweight', 420),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.4),
        },
        autumn: {
          liveweight: mass('Liveweight', 450),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.3),
        },
        winter: {
          liveweight: mass('Liveweight', 460),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.1),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 380),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.4),
        },
        summer: {
          liveweight: mass('Liveweight', 420),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.4),
        },
        autumn: {
          liveweight: mass('Liveweight', 450),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.3),
        },
        winter: {
          liveweight: mass('Liveweight', 460),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.1),
        },
      },
    },
    SA: {
      bullsLt1: {
        spring: {
          liveweight: mass('Liveweight', 250),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.99),
        },
        summer: {
          liveweight: mass('Liveweight', 320),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.77),
        },
        autumn: {
          liveweight: mass('Liveweight', 80),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.9),
        },
        winter: {
          liveweight: mass('Liveweight', 160),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.88),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: mass('Liveweight', 800),
          liveweightGain: massPerHeadPerDay('Liveweight', 1.1),
        },
        summer: {
          liveweight: mass('Liveweight', 800),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
        autumn: {
          liveweight: mass('Liveweight', 700),
          liveweightGain: massPerHeadPerDay('Liveweight', -1.1),
        },
        winter: {
          liveweight: mass('Liveweight', 700),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: mass('Liveweight', 220),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.88),
        },
        summer: {
          liveweight: mass('Liveweight', 280),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.66),
        },
        autumn: {
          liveweight: mass('Liveweight', 70),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.7),
        },
        winter: {
          liveweight: mass('Liveweight', 140),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.77),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 400),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        summer: {
          liveweight: mass('Liveweight', 420),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
        autumn: {
          liveweight: mass('Liveweight', 300),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
        winter: {
          liveweight: mass('Liveweight', 350),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 500),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        summer: {
          liveweight: mass('Liveweight', 500),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
        autumn: {
          liveweight: mass('Liveweight', 450),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.55),
        },
        winter: {
          liveweight: mass('Liveweight', 450),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 500),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        summer: {
          liveweight: mass('Liveweight', 500),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
        autumn: {
          liveweight: mass('Liveweight', 450),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.55),
        },
        winter: {
          liveweight: mass('Liveweight', 450),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
      },
      steersLt1: {
        spring: {
          liveweight: mass('Liveweight', 230),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.88),
        },
        summer: {
          liveweight: mass('Liveweight', 290),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.66),
        },
        autumn: {
          liveweight: mass('Liveweight', 75),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.8),
        },
        winter: {
          liveweight: mass('Liveweight', 150),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.82),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 420),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
        summer: {
          liveweight: mass('Liveweight', 420),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
        autumn: {
          liveweight: mass('Liveweight', 400),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.22),
        },
        winter: {
          liveweight: mass('Liveweight', 400),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 420),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
        summer: {
          liveweight: mass('Liveweight', 420),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
        autumn: {
          liveweight: mass('Liveweight', 400),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.22),
        },
        winter: {
          liveweight: mass('Liveweight', 400),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 420),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
        summer: {
          liveweight: mass('Liveweight', 420),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
        autumn: {
          liveweight: mass('Liveweight', 400),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.22),
        },
        winter: {
          liveweight: mass('Liveweight', 400),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
      },
    },
    TAS: {
      bullsLt1: {
        spring: {
          liveweight: mass('Liveweight', 105),
          liveweightGain: massPerHeadPerDay('Liveweight', 1),
        },
        summer: {
          liveweight: mass('Liveweight', 480),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.82),
        },
        autumn: {
          liveweight: mass('Liveweight', 250),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.77),
        },
        winter: {
          liveweight: mass('Liveweight', 260),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: mass('Liveweight', 700),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.5),
        },
        summer: {
          liveweight: mass('Liveweight', 750),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        autumn: {
          liveweight: mass('Liveweight', 725),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.5),
        },
        winter: {
          liveweight: mass('Liveweight', 700),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.27),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: mass('Liveweight', 85),
          liveweightGain: massPerHeadPerDay('Liveweight', 1),
        },
        summer: {
          liveweight: mass('Liveweight', 150),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.71),
        },
        autumn: {
          liveweight: mass('Liveweight', 200),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        winter: {
          liveweight: mass('Liveweight', 210),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 300),
          liveweightGain: massPerHeadPerDay('Liveweight', 1),
        },
        summer: {
          liveweight: mass('Liveweight', 350),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        autumn: {
          liveweight: mass('Liveweight', 360),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
        },
        winter: {
          liveweight: mass('Liveweight', 380),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 490),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.44),
        },
        summer: {
          liveweight: mass('Liveweight', 530),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.99),
        },
        autumn: {
          liveweight: mass('Liveweight', 500),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.33),
        },
        winter: {
          liveweight: mass('Liveweight', 460),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.44),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 490),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.44),
        },
        summer: {
          liveweight: mass('Liveweight', 530),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.99),
        },
        autumn: {
          liveweight: mass('Liveweight', 500),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.33),
        },
        winter: {
          liveweight: mass('Liveweight', 460),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.44),
        },
      },
      steersLt1: {
        spring: {
          liveweight: mass('Liveweight', 90),
          liveweightGain: massPerHeadPerDay('Liveweight', 1),
        },
        summer: {
          liveweight: mass('Liveweight', 160),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.77),
        },
        autumn: {
          liveweight: mass('Liveweight', 215),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.6),
        },
        winter: {
          liveweight: mass('Liveweight', 230),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.16),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 480),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.5),
        },
        summer: {
          liveweight: mass('Liveweight', 460),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.5),
        },
        autumn: {
          liveweight: mass('Liveweight', 490),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.33),
        },
        winter: {
          liveweight: mass('Liveweight', 470),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.22),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 480),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.5),
        },
        summer: {
          liveweight: mass('Liveweight', 460),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.5),
        },
        autumn: {
          liveweight: mass('Liveweight', 490),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.33),
        },
        winter: {
          liveweight: mass('Liveweight', 470),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.22),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 480),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.5),
        },
        summer: {
          liveweight: mass('Liveweight', 460),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.5),
        },
        autumn: {
          liveweight: mass('Liveweight', 490),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.33),
        },
        winter: {
          liveweight: mass('Liveweight', 470),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.22),
        },
      },
    },
    VIC: {
      bullsLt1: {
        spring: {
          liveweight: mass('Liveweight', 250),
          liveweightGain: massPerHeadPerDay('Liveweight', 1.1),
        },
        summer: {
          liveweight: mass('Liveweight', 280),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.33),
        },
        autumn: {
          liveweight: mass('Liveweight', 100),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.5),
        },
        winter: {
          liveweight: mass('Liveweight', 150),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: mass('Liveweight', 820),
          liveweightGain: massPerHeadPerDay('Liveweight', 1.1),
        },
        summer: {
          liveweight: mass('Liveweight', 850),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.33),
        },
        autumn: {
          liveweight: mass('Liveweight', 700),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.2),
        },
        winter: {
          liveweight: mass('Liveweight', 720),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: mass('Liveweight', 240),
          liveweightGain: massPerHeadPerDay('Liveweight', 1.1),
        },
        summer: {
          liveweight: mass('Liveweight', 260),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
        autumn: {
          liveweight: mass('Liveweight', 95),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        winter: {
          liveweight: mass('Liveweight', 140),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.49),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 410),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.99),
        },
        summer: {
          liveweight: mass('Liveweight', 440),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.33),
        },
        autumn: {
          liveweight: mass('Liveweight', 300),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.44),
        },
        winter: {
          liveweight: mass('Liveweight', 320),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 560),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.99),
        },
        summer: {
          liveweight: mass('Liveweight', 550),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.1),
        },
        autumn: {
          liveweight: mass('Liveweight', 450),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.2),
        },
        winter: {
          liveweight: mass('Liveweight', 470),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 560),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.99),
        },
        summer: {
          liveweight: mass('Liveweight', 550),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.1),
        },
        autumn: {
          liveweight: mass('Liveweight', 450),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.2),
        },
        winter: {
          liveweight: mass('Liveweight', 470),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
      },
      steersLt1: {
        spring: {
          liveweight: mass('Liveweight', 240),
          liveweightGain: massPerHeadPerDay('Liveweight', 1.1),
        },
        summer: {
          liveweight: mass('Liveweight', 270),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.33),
        },
        autumn: {
          liveweight: mass('Liveweight', 95),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        winter: {
          liveweight: mass('Liveweight', 140),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.49),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 510),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.77),
        },
        summer: {
          liveweight: mass('Liveweight', 520),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
        },
        autumn: {
          liveweight: mass('Liveweight', 410),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.2),
        },
        winter: {
          liveweight: mass('Liveweight', 440),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.33),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 510),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.77),
        },
        summer: {
          liveweight: mass('Liveweight', 520),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
        },
        autumn: {
          liveweight: mass('Liveweight', 410),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.2),
        },
        winter: {
          liveweight: mass('Liveweight', 440),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.33),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 510),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.77),
        },
        summer: {
          liveweight: mass('Liveweight', 520),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
        },
        autumn: {
          liveweight: mass('Liveweight', 410),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.2),
        },
        winter: {
          liveweight: mass('Liveweight', 440),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.33),
        },
      },
    },
    'WA - South West': {
      bullsLt1: {
        spring: {
          liveweight: mass('Liveweight', 340),
          liveweightGain: massPerHeadPerDay('Liveweight', 1.64),
        },
        summer: {
          liveweight: mass('Liveweight', 380),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.44),
        },
        autumn: {
          liveweight: mass('Liveweight', 100),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.6),
        },
        winter: {
          liveweight: mass('Liveweight', 190),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.99),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: mass('Liveweight', 800),
          liveweightGain: massPerHeadPerDay('Liveweight', 1.1),
        },
        summer: {
          liveweight: mass('Liveweight', 780),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.22),
        },
        autumn: {
          liveweight: mass('Liveweight', 680),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
        winter: {
          liveweight: mass('Liveweight', 700),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: mass('Liveweight', 260),
          liveweightGain: massPerHeadPerDay('Liveweight', 1.21),
        },
        summer: {
          liveweight: mass('Liveweight', 300),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.44),
        },
        autumn: {
          liveweight: mass('Liveweight', 80),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.6),
        },
        winter: {
          liveweight: mass('Liveweight', 150),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.77),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 420),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.99),
        },
        summer: {
          liveweight: mass('Liveweight', 450),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.33),
        },
        autumn: {
          liveweight: mass('Liveweight', 320),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
        winter: {
          liveweight: mass('Liveweight', 330),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 550),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.66),
        },
        summer: {
          liveweight: mass('Liveweight', 530),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.22),
        },
        autumn: {
          liveweight: mass('Liveweight', 480),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.55),
        },
        winter: {
          liveweight: mass('Liveweight', 490),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 550),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.66),
        },
        summer: {
          liveweight: mass('Liveweight', 530),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.22),
        },
        autumn: {
          liveweight: mass('Liveweight', 480),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.55),
        },
        winter: {
          liveweight: mass('Liveweight', 490),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
        },
      },
      steersLt1: {
        spring: {
          liveweight: mass('Liveweight', 300),
          liveweightGain: massPerHeadPerDay('Liveweight', 1.42),
        },
        summer: {
          liveweight: mass('Liveweight', 340),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.44),
        },
        autumn: {
          liveweight: mass('Liveweight', 100),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.6),
        },
        winter: {
          liveweight: mass('Liveweight', 170),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.77),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 480),
          liveweightGain: massPerHeadPerDay('Liveweight', 1.1),
        },
        summer: {
          liveweight: mass('Liveweight', 470),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.11),
        },
        autumn: {
          liveweight: mass('Liveweight', 340),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
        winter: {
          liveweight: mass('Liveweight', 360),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.44),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 480),
          liveweightGain: massPerHeadPerDay('Liveweight', 1.1),
        },
        summer: {
          liveweight: mass('Liveweight', 470),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.11),
        },
        autumn: {
          liveweight: mass('Liveweight', 340),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
        winter: {
          liveweight: mass('Liveweight', 360),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.44),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 480),
          liveweightGain: massPerHeadPerDay('Liveweight', 1.1),
        },
        summer: {
          liveweight: mass('Liveweight', 470),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.11),
        },
        autumn: {
          liveweight: mass('Liveweight', 340),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
        winter: {
          liveweight: mass('Liveweight', 360),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.44),
        },
      },
    },
    'WA - Pilbara': {
      bullsLt1: {
        spring: {
          liveweight: mass('Liveweight', 80),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.7),
        },
        summer: {
          liveweight: mass('Liveweight', 150),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.77),
        },
        autumn: {
          liveweight: mass('Liveweight', 230),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.88),
        },
        winter: {
          liveweight: mass('Liveweight', 250),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: mass('Liveweight', 450),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.55),
        },
        summer: {
          liveweight: mass('Liveweight', 500),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        autumn: {
          liveweight: mass('Liveweight', 550),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        winter: {
          liveweight: mass('Liveweight', 500),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.55),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: mass('Liveweight', 70),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.7),
        },
        summer: {
          liveweight: mass('Liveweight', 140),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.77),
        },
        autumn: {
          liveweight: mass('Liveweight', 220),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.88),
        },
        winter: {
          liveweight: mass('Liveweight', 240),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 260),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
        summer: {
          liveweight: mass('Liveweight', 310),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.66),
        },
        autumn: {
          liveweight: mass('Liveweight', 330),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
        winter: {
          liveweight: mass('Liveweight', 340),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 340),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.22),
        },
        summer: {
          liveweight: mass('Liveweight', 360),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        autumn: {
          liveweight: mass('Liveweight', 380),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
        winter: {
          liveweight: mass('Liveweight', 360),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.22),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 340),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.22),
        },
        summer: {
          liveweight: mass('Liveweight', 360),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        autumn: {
          liveweight: mass('Liveweight', 380),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
        winter: {
          liveweight: mass('Liveweight', 360),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.22),
        },
      },
      steersLt1: {
        spring: {
          liveweight: mass('Liveweight', 80),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.7),
        },
        summer: {
          liveweight: mass('Liveweight', 150),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.77),
        },
        autumn: {
          liveweight: mass('Liveweight', 230),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.88),
        },
        winter: {
          liveweight: mass('Liveweight', 250),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 370),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.22),
        },
        summer: {
          liveweight: mass('Liveweight', 400),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.33),
        },
        autumn: {
          liveweight: mass('Liveweight', 420),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
        winter: {
          liveweight: mass('Liveweight', 390),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.33),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 370),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.22),
        },
        summer: {
          liveweight: mass('Liveweight', 400),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.33),
        },
        autumn: {
          liveweight: mass('Liveweight', 420),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
        winter: {
          liveweight: mass('Liveweight', 390),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.33),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 370),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.22),
        },
        summer: {
          liveweight: mass('Liveweight', 400),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.33),
        },
        autumn: {
          liveweight: mass('Liveweight', 420),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
        winter: {
          liveweight: mass('Liveweight', 390),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.33),
        },
      },
    },
    'WA - Kimberley': {
      bullsLt1: {
        spring: {
          liveweight: mass('Liveweight', 220),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
        summer: {
          liveweight: mass('Liveweight', 110),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.8),
        },
        autumn: {
          liveweight: mass('Liveweight', 170),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.66),
        },
        winter: {
          liveweight: mass('Liveweight', 200),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.33),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: mass('Liveweight', 500),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.55),
        },
        summer: {
          liveweight: mass('Liveweight', 550),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        autumn: {
          liveweight: mass('Liveweight', 600),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        winter: {
          liveweight: mass('Liveweight', 550),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.55),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: mass('Liveweight', 180),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.33),
        },
        summer: {
          liveweight: mass('Liveweight', 90),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.7),
        },
        autumn: {
          liveweight: mass('Liveweight', 140),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        winter: {
          liveweight: mass('Liveweight', 150),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 300),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
        summer: {
          liveweight: mass('Liveweight', 220),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.44),
        },
        autumn: {
          liveweight: mass('Liveweight', 270),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        winter: {
          liveweight: mass('Liveweight', 280),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 320),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.33),
        },
        summer: {
          liveweight: mass('Liveweight', 380),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.66),
        },
        autumn: {
          liveweight: mass('Liveweight', 390),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
        },
        winter: {
          liveweight: mass('Liveweight', 350),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.44),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 320),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.33),
        },
        summer: {
          liveweight: mass('Liveweight', 380),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.66),
        },
        autumn: {
          liveweight: mass('Liveweight', 390),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
        },
        winter: {
          liveweight: mass('Liveweight', 350),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.44),
        },
      },
      steersLt1: {
        spring: {
          liveweight: mass('Liveweight', 210),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
        summer: {
          liveweight: mass('Liveweight', 100),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.8),
        },
        autumn: {
          liveweight: mass('Liveweight', 160),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.66),
        },
        winter: {
          liveweight: mass('Liveweight', 190),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.33),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 340),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.55),
        },
        summer: {
          liveweight: mass('Liveweight', 390),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        autumn: {
          liveweight: mass('Liveweight', 430),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        winter: {
          liveweight: mass('Liveweight', 400),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.55),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 340),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.55),
        },
        summer: {
          liveweight: mass('Liveweight', 390),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        autumn: {
          liveweight: mass('Liveweight', 430),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        winter: {
          liveweight: mass('Liveweight', 400),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.55),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 340),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.55),
        },
        summer: {
          liveweight: mass('Liveweight', 390),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        autumn: {
          liveweight: mass('Liveweight', 430),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        winter: {
          liveweight: mass('Liveweight', 400),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.55),
        },
      },
    },
    'NT - Alice Springs': {
      bullsLt1: {
        spring: {
          liveweight: mass('Liveweight', 220),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
        summer: {
          liveweight: mass('Liveweight', 110),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.66),
        },
        autumn: {
          liveweight: mass('Liveweight', 170),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.49),
        },
        winter: {
          liveweight: mass('Liveweight', 200),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.27),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: mass('Liveweight', 706),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.23),
        },
        summer: {
          liveweight: mass('Liveweight', 703),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.2),
        },
        autumn: {
          liveweight: mass('Liveweight', 721),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.13),
        },
        winter: {
          liveweight: mass('Liveweight', 727),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.8),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: mass('Liveweight', 208),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.25),
        },
        summer: {
          liveweight: mass('Liveweight', 112),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.62),
        },
        autumn: {
          liveweight: mass('Liveweight', 169),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.54),
        },
        winter: {
          liveweight: mass('Liveweight', 211),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 323),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.17),
        },
        summer: {
          liveweight: mass('Liveweight', 256),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.54),
        },
        autumn: {
          liveweight: mass('Liveweight', 306),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.45),
        },
        winter: {
          liveweight: mass('Liveweight', 338),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.09),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 415),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.18),
        },
        summer: {
          liveweight: mass('Liveweight', 368),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.38),
        },
        autumn: {
          liveweight: mass('Liveweight', 392),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.35),
        },
        winter: {
          liveweight: mass('Liveweight', 432),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.12),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 467),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.28),
        },
        summer: {
          liveweight: mass('Liveweight', 465),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.27),
        },
        autumn: {
          liveweight: mass('Liveweight', 464),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.15),
        },
        winter: {
          liveweight: mass('Liveweight', 492),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.02),
        },
      },
      steersLt1: {
        spring: {
          liveweight: mass('Liveweight', 223),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.32),
        },
        summer: {
          liveweight: mass('Liveweight', 108),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.75),
        },
        autumn: {
          liveweight: mass('Liveweight', 176),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.63),
        },
        winter: {
          liveweight: mass('Liveweight', 222),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.25),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 371),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.24),
        },
        summer: {
          liveweight: mass('Liveweight', 280),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.64),
        },
        autumn: {
          liveweight: mass('Liveweight', 339),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.54),
        },
        winter: {
          liveweight: mass('Liveweight', 377),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.18),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 493),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.25),
        },
        summer: {
          liveweight: mass('Liveweight', 421),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        autumn: {
          liveweight: mass('Liveweight', 470),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.42),
        },
        winter: {
          liveweight: mass('Liveweight', 498),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.12),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 585),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.05),
        },
        summer: {
          liveweight: mass('Liveweight', 543),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.48),
        },
        autumn: {
          liveweight: mass('Liveweight', 580),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.26),
        },
        winter: {
          liveweight: mass('Liveweight', 590),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.03),
        },
      },
    },
    'NT - Barkly': {
      bullsLt1: {
        spring: {
          liveweight: mass('Liveweight', 220),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
        summer: {
          liveweight: mass('Liveweight', 110),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.66),
        },
        autumn: {
          liveweight: mass('Liveweight', 170),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.49),
        },
        winter: {
          liveweight: mass('Liveweight', 200),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.27),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: mass('Liveweight', 620),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.44),
        },
        summer: {
          liveweight: mass('Liveweight', 650),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
        autumn: {
          liveweight: mass('Liveweight', 670),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.05),
        },
        winter: {
          liveweight: mass('Liveweight', 660),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.27),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: mass('Liveweight', 227),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.2),
        },
        summer: {
          liveweight: mass('Liveweight', 108),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.68),
        },
        autumn: {
          liveweight: mass('Liveweight', 170),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.64),
        },
        winter: {
          liveweight: mass('Liveweight', 225),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.31),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 319),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.21),
        },
        summer: {
          liveweight: mass('Liveweight', 262),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
        autumn: {
          liveweight: mass('Liveweight', 266),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.25),
        },
        winter: {
          liveweight: mass('Liveweight', 307),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.29),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 398),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.18),
        },
        summer: {
          liveweight: mass('Liveweight', 346),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.24),
        },
        autumn: {
          liveweight: mass('Liveweight', 363),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.29),
        },
        winter: {
          liveweight: mass('Liveweight', 398),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.19),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 452),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.01),
        },
        summer: {
          liveweight: mass('Liveweight', 430),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.25),
        },
        autumn: {
          liveweight: mass('Liveweight', 444),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.12),
        },
        winter: {
          liveweight: mass('Liveweight', 452),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.04),
        },
      },
      steersLt1: {
        spring: {
          liveweight: mass('Liveweight', 216),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.12),
        },
        summer: {
          liveweight: mass('Liveweight', 111),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.64),
        },
        autumn: {
          liveweight: mass('Liveweight', 169),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.57),
        },
        winter: {
          liveweight: mass('Liveweight', 214),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.26),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 334),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.09),
        },
        summer: {
          liveweight: mass('Liveweight', 236),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.37),
        },
        autumn: {
          liveweight: mass('Liveweight', 282),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.49),
        },
        winter: {
          liveweight: mass('Liveweight', 326),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.28),
        },
      },
      // NOT VALID
      steers2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 0),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
        summer: {
          liveweight: mass('Liveweight', 0),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
        autumn: {
          liveweight: mass('Liveweight', 0),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
        winter: {
          liveweight: mass('Liveweight', 0),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
      },
      // NOT VALID
      steersGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 0),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
        summer: {
          liveweight: mass('Liveweight', 0),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
        autumn: {
          liveweight: mass('Liveweight', 0),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
        winter: {
          liveweight: mass('Liveweight', 0),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
      },
    },
    'NT - Northern': {
      bullsLt1: {
        spring: {
          liveweight: mass('Liveweight', 220),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
        summer: {
          liveweight: mass('Liveweight', 110),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.66),
        },
        autumn: {
          liveweight: mass('Liveweight', 170),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.49),
        },
        winter: {
          liveweight: mass('Liveweight', 200),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.27),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: mass('Liveweight', 620),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.44),
        },
        summer: {
          liveweight: mass('Liveweight', 650),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.22),
        },
        autumn: {
          liveweight: mass('Liveweight', 670),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.05),
        },
        winter: {
          liveweight: mass('Liveweight', 660),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.27),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: mass('Liveweight', 177),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
        summer: {
          liveweight: mass('Liveweight', 102),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.79),
        },
        autumn: {
          liveweight: mass('Liveweight', 173),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        winter: {
          liveweight: mass('Liveweight', 202),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.02),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 267),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.15),
        },
        summer: {
          liveweight: mass('Liveweight', 203),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.4),
        },
        autumn: {
          liveweight: mass('Liveweight', 250),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.38),
        },
        winter: {
          liveweight: mass('Liveweight', 272),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.09),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 365),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.08),
        },
        summer: {
          liveweight: mass('Liveweight', 299),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.38),
        },
        autumn: {
          liveweight: mass('Liveweight', 336),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.36),
        },
        winter: {
          liveweight: mass('Liveweight', 365),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.16),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 406),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.17),
        },
        summer: {
          liveweight: mass('Liveweight', 380),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.27),
        },
        autumn: {
          liveweight: mass('Liveweight', 414),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.06),
        },
        winter: {
          liveweight: mass('Liveweight', 390),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.04),
        },
      },
      steersLt1: {
        spring: {
          liveweight: mass('Liveweight', 231),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.06),
        },
        summer: {
          liveweight: mass('Liveweight', 102),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.8),
        },
        autumn: {
          liveweight: mass('Liveweight', 175),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.58),
        },
        winter: {
          liveweight: mass('Liveweight', 208),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.21),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 249),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.02),
        },
        summer: {
          liveweight: mass('Liveweight', 218),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.16),
        },
        autumn: {
          liveweight: mass('Liveweight', 243),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.23),
        },
        winter: {
          liveweight: mass('Liveweight', 260),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.03),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 324),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.14),
        },
        summer: {
          liveweight: mass('Liveweight', 263),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.3),
        },
        autumn: {
          liveweight: mass('Liveweight', 304),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.4),
        },
        winter: {
          liveweight: mass('Liveweight', 337),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
        },
      },
      // NOT VALID
      steersGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 0),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
        summer: {
          liveweight: mass('Liveweight', 0),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
        autumn: {
          liveweight: mass('Liveweight', 0),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
        winter: {
          liveweight: mass('Liveweight', 0),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
      },
    },
    'QLD - High': {
      bullsLt1: {
        spring: {
          liveweight: mass('Liveweight', 260),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.27),
        },
        summer: {
          liveweight: mass('Liveweight', 153),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.16),
        },
        autumn: {
          liveweight: mass('Liveweight', 168),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.45),
        },
        winter: {
          liveweight: mass('Liveweight', 235),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.51),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: mass('Liveweight', 705),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.19),
        },
        summer: {
          liveweight: mass('Liveweight', 703),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.16),
        },
        autumn: {
          liveweight: mass('Liveweight', 718),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.1),
        },
        winter: {
          liveweight: mass('Liveweight', 722),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.07),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: mass('Liveweight', 215),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.38),
        },
        summer: {
          liveweight: mass('Liveweight', 118),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.8),
        },
        autumn: {
          liveweight: mass('Liveweight', 191),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.49),
        },
        winter: {
          liveweight: mass('Liveweight', 207),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.13),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 302),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.3),
        },
        summer: {
          liveweight: mass('Liveweight', 277),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.57),
        },
        autumn: {
          liveweight: mass('Liveweight', 319),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.41),
        },
        winter: {
          liveweight: mass('Liveweight', 352),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.09),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 416),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.07),
        },
        summer: {
          liveweight: mass('Liveweight', 397),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.76),
        },
        autumn: {
          liveweight: mass('Liveweight', 440),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.4),
        },
        winter: {
          liveweight: mass('Liveweight', 470),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.13),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 519),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.05),
        },
        summer: {
          liveweight: mass('Liveweight', 483),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.49),
        },
        autumn: {
          liveweight: mass('Liveweight', 506),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.17),
        },
        winter: {
          liveweight: mass('Liveweight', 514),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.07),
        },
      },
      steersLt1: {
        spring: {
          liveweight: mass('Liveweight', 234),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.52),
        },
        summer: {
          liveweight: mass('Liveweight', 111),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.84),
        },
        autumn: {
          liveweight: mass('Liveweight', 188),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.54),
        },
        winter: {
          liveweight: mass('Liveweight', 209),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.25),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 455),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.55),
        },
        summer: {
          liveweight: mass('Liveweight', 304),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.51),
        },
        autumn: {
          liveweight: mass('Liveweight', 326),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.64),
        },
        winter: {
          liveweight: mass('Liveweight', 421),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.71),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 551),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.19),
        },
        summer: {
          liveweight: mass('Liveweight', 521),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.36),
        },
        autumn: {
          liveweight: mass('Liveweight', 520),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.05),
        },
        winter: {
          liveweight: mass('Liveweight', 512),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.17),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 660),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.6),
        },
        summer: {
          liveweight: mass('Liveweight', 547),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.17),
        },
        autumn: {
          liveweight: mass('Liveweight', 582),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.32),
        },
        winter: {
          liveweight: mass('Liveweight', 605),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.43),
        },
      },
    },
    'QLD - Moderate/High': {
      bullsLt1: {
        spring: {
          liveweight: mass('Liveweight', 230),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.12),
        },
        summer: {
          liveweight: mass('Liveweight', 113),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.65),
        },
        autumn: {
          liveweight: mass('Liveweight', 172),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.7),
        },
        winter: {
          liveweight: mass('Liveweight', 241),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.32),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: mass('Liveweight', 674),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.19),
        },
        summer: {
          liveweight: mass('Liveweight', 669),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.19),
        },
        autumn: {
          liveweight: mass('Liveweight', 685),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.13),
        },
        winter: {
          liveweight: mass('Liveweight', 692),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.06),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: mass('Liveweight', 217),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.41),
        },
        summer: {
          liveweight: mass('Liveweight', 113),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.65),
        },
        autumn: {
          liveweight: mass('Liveweight', 172),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.52),
        },
        winter: {
          liveweight: mass('Liveweight', 208),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.25),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 344),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.09),
        },
        summer: {
          liveweight: mass('Liveweight', 283),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.51),
        },
        autumn: {
          liveweight: mass('Liveweight', 309),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.34),
        },
        winter: {
          liveweight: mass('Liveweight', 344),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.19),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 357),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.41),
        },
        summer: {
          liveweight: mass('Liveweight', 361),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.18),
        },
        autumn: {
          liveweight: mass('Liveweight', 376),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.02),
        },
        winter: {
          liveweight: mass('Liveweight', 364),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.1),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 467),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.19),
        },
        summer: {
          liveweight: mass('Liveweight', 477),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.63),
        },
        autumn: {
          liveweight: mass('Liveweight', 471),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.04),
        },
        winter: {
          liveweight: mass('Liveweight', 484),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.02),
        },
      },
      steersLt1: {
        spring: {
          liveweight: mass('Liveweight', 242),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.07),
        },
        summer: {
          liveweight: mass('Liveweight', 120),
          liveweightGain: massPerHeadPerDay('Liveweight', 1.3),
        },
        autumn: {
          liveweight: mass('Liveweight', 238),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.77),
        },
        winter: {
          liveweight: mass('Liveweight', 260),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.02),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 370),
          liveweightGain: massPerHeadPerDay('Liveweight', 1.07),
        },
        summer: {
          liveweight: mass('Liveweight', 273),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.48),
        },
        autumn: {
          liveweight: mass('Liveweight', 329),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.42),
        },
        winter: {
          liveweight: mass('Liveweight', 350),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.23),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 550),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.08),
        },
        summer: {
          liveweight: mass('Liveweight', 545),
          liveweightGain: massPerHeadPerDay('Liveweight', 1.12),
        },
        autumn: {
          liveweight: mass('Liveweight', 573),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.12),
        },
        winter: {
          liveweight: mass('Liveweight', 567),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.13),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 620),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
        summer: {
          liveweight: mass('Liveweight', 553),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.38),
        },
        autumn: {
          liveweight: mass('Liveweight', 620),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.74),
        },
        winter: {
          liveweight: mass('Liveweight', 620),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
        },
      },
    },
    'QLD - Moderate/Low': {
      bullsLt1: {
        spring: {
          liveweight: mass('Liveweight', 236),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.62),
        },
        summer: {
          liveweight: mass('Liveweight', 120),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.05),
        },
        autumn: {
          liveweight: mass('Liveweight', 125),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.33),
        },
        winter: {
          liveweight: mass('Liveweight', 180),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.61),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: mass('Liveweight', 674),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.19),
        },
        summer: {
          liveweight: mass('Liveweight', 669),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.19),
        },
        autumn: {
          liveweight: mass('Liveweight', 685),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.13),
        },
        winter: {
          liveweight: mass('Liveweight', 692),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.06),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: mass('Liveweight', 178),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.37),
        },
        summer: {
          liveweight: mass('Liveweight', 112),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.31),
        },
        autumn: {
          liveweight: mass('Liveweight', 140),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.39),
        },
        winter: {
          liveweight: mass('Liveweight', 183),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.21),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 310),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.41),
        },
        summer: {
          liveweight: mass('Liveweight', 250),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.54),
        },
        autumn: {
          liveweight: mass('Liveweight', 277),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.36),
        },
        winter: {
          liveweight: mass('Liveweight', 316),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.18),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 428),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.06),
        },
        summer: {
          liveweight: mass('Liveweight', 390),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.53),
        },
        autumn: {
          liveweight: mass('Liveweight', 407),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.26),
        },
        winter: {
          liveweight: mass('Liveweight', 438),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.12),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 466),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.02),
        },
        summer: {
          liveweight: mass('Liveweight', 448),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.15),
        },
        autumn: {
          liveweight: mass('Liveweight', 455),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
        },
        winter: {
          liveweight: mass('Liveweight', 468),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.06),
        },
      },
      steersLt1: {
        spring: {
          liveweight: mass('Liveweight', 193),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.47),
        },
        summer: {
          liveweight: mass('Liveweight', 115),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.28),
        },
        autumn: {
          liveweight: mass('Liveweight', 141),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.4),
        },
        winter: {
          liveweight: mass('Liveweight', 189),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.29),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 370),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.44),
        },
        summer: {
          liveweight: mass('Liveweight', 273),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.57),
        },
        autumn: {
          liveweight: mass('Liveweight', 296),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.44),
        },
        winter: {
          liveweight: mass('Liveweight', 354),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.41),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 519),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.3),
        },
        summer: {
          liveweight: mass('Liveweight', 433),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.42),
        },
        autumn: {
          liveweight: mass('Liveweight', 445),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.37),
        },
        winter: {
          liveweight: mass('Liveweight', 500),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.41),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 565),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.13),
        },
        summer: {
          liveweight: mass('Liveweight', 556),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.4),
        },
        autumn: {
          liveweight: mass('Liveweight', 593),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.01),
        },
        winter: {
          liveweight: mass('Liveweight', 553),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.15),
        },
      },
    },
    'QLD - Low': {
      bullsLt1: {
        spring: {
          liveweight: mass('Liveweight', 190),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.2),
        },
        summer: {
          liveweight: mass('Liveweight', 119),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.62),
        },
        autumn: {
          liveweight: mass('Liveweight', 175),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.4),
        },
        winter: {
          liveweight: mass('Liveweight', 192),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.08),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: mass('Liveweight', 617),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.02),
        },
        summer: {
          liveweight: mass('Liveweight', 591),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.21),
        },
        autumn: {
          liveweight: mass('Liveweight', 610),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.13),
        },
        winter: {
          liveweight: mass('Liveweight', 615),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.04),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: mass('Liveweight', 174),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.24),
        },
        summer: {
          liveweight: mass('Liveweight', 140),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.25),
        },
        autumn: {
          liveweight: mass('Liveweight', 163),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.12),
        },
        winter: {
          liveweight: mass('Liveweight', 162),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.06),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 265),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.3),
        },
        summer: {
          liveweight: mass('Liveweight', 205),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.32),
        },
        autumn: {
          liveweight: mass('Liveweight', 232),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.27),
        },
        winter: {
          liveweight: mass('Liveweight', 255),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.18),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 371),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.23),
        },
        summer: {
          liveweight: mass('Liveweight', 310),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.47),
        },
        autumn: {
          liveweight: mass('Liveweight', 351),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.3),
        },
        winter: {
          liveweight: mass('Liveweight', 364),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 415),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.05),
        },
        summer: {
          liveweight: mass('Liveweight', 405),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.31),
        },
        autumn: {
          liveweight: mass('Liveweight', 427),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.08),
        },
        winter: {
          liveweight: mass('Liveweight', 420),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.07),
        },
      },
      steersLt1: {
        spring: {
          liveweight: mass('Liveweight', 170),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.34),
        },
        summer: {
          liveweight: mass('Liveweight', 133),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.14),
        },
        autumn: {
          liveweight: mass('Liveweight', 146),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.13),
        },
        winter: {
          liveweight: mass('Liveweight', 157),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.13),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: mass('Liveweight', 272),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.3),
        },
        summer: {
          liveweight: mass('Liveweight', 218),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.4),
        },
        autumn: {
          liveweight: mass('Liveweight', 242),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.24),
        },
        winter: {
          liveweight: mass('Liveweight', 261),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.16),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: mass('Liveweight', 392),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.57),
        },
        summer: {
          liveweight: mass('Liveweight', 315),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.26),
        },
        autumn: {
          liveweight: mass('Liveweight', 320),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.15),
        },
        winter: {
          liveweight: mass('Liveweight', 342),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.4),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: mass('Liveweight', 531),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.52),
        },
        summer: {
          liveweight: mass('Liveweight', 445),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.43),
        },
        autumn: {
          liveweight: mass('Liveweight', 471),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.21),
        },
        winter: {
          liveweight: mass('Liveweight', 484),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.33),
        },
      },
    },
  },
};
