import {
  cubicMetresToLitres,
  gjPerCubicMetreToJPerLitre,
  megaJoulesToJoules,
  perCubicMetresToPerLitres,
  perGjToPerJ,
  perHectareToPerSqMetre,
  perKilometreToPerMetre,
  perTonneToPerKg,
  tonnesPerHectareToKgPerSquareMetres,
} from '@/tools/unit-conversion';
import {
  countPerArea,
  energyPerMass,
  energyPerVolume,
  mass,
  massPerArea,
  massPerAreaPerDay,
  massPerAreaPerYear,
  massPerElectricity,
  massPerEnergy,
  massPerHead,
  massPerHeadPerDay,
  massPerMass,
  massPerMassDistance,
  massPerTime,
  massPerVolume,
  percentage,
  RealNumber,
  realNumber,
  volumePerMass,
  years,
} from '@/tools/units';
import { MeanAnnualTemperature, PureState, State } from './enums';
import {
  BeefPastureConstants,
  CommonConstants,
  CropConstants,
  DairyConstants,
  FeedlotConstants,
  LivestockConstants,
  LULUCFConstants,
  PoultryConstants,
  RiceConstants,
  SheepConstants,
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
  GWP_FACTORSC6: massPerMass('CO2e', 'N2O', 265),

  /**
   * @description Conversion factor for elemental to molecular CO2
   */
  GWP_FACTORSC13: massPerMass('CO2', 'CO2e', 44 / 12),
  /**
   * @description Conversion factor for elemental to molecular CH4
   */
  GWP_FACTORSC14: realNumber(16 / 12),

  // Factor to convert elemental mass of nitrous oxide to molecular mass.
  GWP_FACTORSC15: realNumber(44 / 28),

  /**
   * @description Conversion factor for elemental to molecular CO2 from lime
   */
  GWP_FACTORSC18: realNumber(44 / 12),

  GWP_CH4: massPerMass('CO2e', 'CH4', 28),

  CG_CO2: massPerMass('CO2', 'Carbon', 44 / 12),

  DENSITY_OF_METHANE: massPerVolume(
    'CH4',
    'CH4',
    perCubicMetresToPerLitres(0.6784),
  ),

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
    // AusLCI Lifecycles GHG Emission Intensities for Material Inputs to AUS Ag Fisheries Forestry V48 (March 2026)
    '2,4-D': massPerMass('CO2e', 'Chemical', 5.2),
    Atrazine: massPerMass('CO2e', 'Chemical', 8.38),
    Diuron: massPerMass('CO2e', 'Chemical', 8.8),
    // Glyphosate: massPerMass('CO2e', 'Chemical', 10.3),
    Mancozeb: massPerMass('CO2e', 'Chemical', 4.55),
    MCPA: massPerMass('CO2e', 'Chemical', 5.6),
    Metolachlor: massPerMass('CO2e', 'Chemical', 8.06),
    'Metsulfuron-methyl': massPerMass('CO2e', 'Chemical', 8.8),
    'Pesticides (generic)': massPerMass('CO2e', 'Chemical', 9.16),
    'Tri-allate': massPerMass('CO2e', 'Chemical', 8.57),
    'Tribenuron methyl': massPerMass('CO2e', 'Chemical', 8.8),
    Trifluralin: massPerMass('CO2e', 'Chemical', 6.16),
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
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(27)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 90),
          CH4: massPerEnergy('CH4', 0.04),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 3),
      },
      'Sub-bituminous coal': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(21)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 90),
          CH4: massPerEnergy('CH4', 0.04),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 2.5),
      },
      Anthracite: {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(29)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 90),
          CH4: massPerEnergy('CH4', 0.04),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Brown coal (lignite)': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(10.2)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 93.5),
          CH4: massPerEnergy('CH4', 0.02),
          N2O: massPerEnergy('N2O', 0.3),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0.4),
      },
      'Coking coal': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(30)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 91.8),
          CH4: massPerEnergy('CH4', 0.03),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 6.4),
      },
      'Coal briquettes': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(22.1)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 95),
          CH4: massPerEnergy('CH4', 0.08),
          N2O: massPerEnergy('N2O', 0.3),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Coal coke': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(27)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 107),
          CH4: massPerEnergy('CH4', 0.03),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Coal tar': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(37.5)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 81.8),
          CH4: massPerEnergy('CH4', 0.03),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Other solid fossil fuels': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(22.1)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 95),
          CH4: massPerEnergy('CH4', 0.08),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Industrial materials derived from fossil fuels': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(26.3)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 81.6),
          CH4: massPerEnergy('CH4', 0.03),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Passenger car tyres': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(32)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 62.8),
          CH4: massPerEnergy('CH4', 0.03),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Truck and off-road tyres': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(27.1)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 55.9),
          CH4: massPerEnergy('CH4', 0.03),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Non-biomass municipal materials': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(10.5)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 87.1),
          CH4: massPerEnergy('CH4', 0.8),
          N2O: massPerEnergy('N2O', 1),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Dry wood': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(16.2)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 0),
          CH4: massPerEnergy('CH4', 0.1),
          N2O: massPerEnergy('N2O', 1.1),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Green and air dried wood': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(10.4)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 0),
          CH4: massPerEnergy('CH4', 0.1),
          N2O: massPerEnergy('N2O', 1.1),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Sulphite lyes': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(12.4)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 0),
          CH4: massPerEnergy('CH4', 0.08),
          N2O: massPerEnergy('N2O', 0.5),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      Bagasse: {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(9.6)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 0),
          CH4: massPerEnergy('CH4', 0.3),
          N2O: massPerEnergy('N2O', 1.1),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Biomass,  municipal and industrial materials': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(12.2)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 0),
          CH4: massPerEnergy('CH4', 0.8),
          N2O: massPerEnergy('N2O', 1),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      Charcoal: {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(31.1)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 0),
          CH4: massPerEnergy('CH4', 5.3),
          N2O: massPerEnergy('N2O', 1),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0),
      },
      'Other primary solid biomass fuels': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(12.2)),
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
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(45.3)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 69.6),
          CH4: massPerEnergy('CH4', 0.08),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0), // N)E
      },
      'Other natural gas liquids': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(46.5)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 61.0),
          CH4: massPerEnergy('CH4', 0.08),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 0), // N)E
      },

      'Petroleum coke': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(34.2)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 92.6),
          CH4: massPerEnergy('CH4', 0.08),
          N2O: massPerEnergy('N2O', 0.2),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
      'Refinery gas and liquids': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(42.9)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2', 54.7),
          CH4: massPerEnergy('CH4', 0.03),
          N2O: massPerEnergy('N2O', 0.03),
        },
        SCOPE3_EF: massPerEnergy('CO2e', 18.0),
      },
      'Refinery coke': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', perTonneToPerKg(34.2)),
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

  /**
   * Temporary placeholder values taken (loosely!) from AusLCI V47
   */
  FREIGHT_EMISSIONS: {
    PLACEHOLDER_TRAIN: massPerMassDistance(
      'CO2e',
      'Freight Goods',
      perKilometreToPerMetre(0.27),
    ),
    PLACEHOLDER_TRUCK: massPerMassDistance(
      'CO2e',
      'Freight Goods',
      perKilometreToPerMetre(0.09),
    ),
    PLACEHOLDER_AVIATION: massPerMassDistance(
      'CO2e',
      'Freight Goods',
      perKilometreToPerMetre(1.96),
    ),
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

  WASTEWATER_TREATMENT: {
    // A.4.1.3
    WASTEWATER_METHANE_CORRECTION_FACTORS: {
      'Managed aerobic treatment': realNumber(0),
      'Unmanaged aerobic treatment': realNumber(0.3),
      'Anaerobic digestor/reactor': realNumber(0.8),
      'Shallow anaerobic lagoon': realNumber(0.2),
      'Deep anaerobic lagoon': realNumber(0.8),
    },
    // A.4.1.4
    SLUDGE_METHANE_CORRECTION_FACTORS: {
      'Managed aerobic treatment': realNumber(0),
      'Unmanaged aerobic treatment': realNumber(0.3),
      'Anaerobic digestor/reactor': realNumber(0.8),
      'Shallow anaerobic lagoon': realNumber(0.2),
      'Deep anaerobic lagoon': realNumber(0.8),
    },
    // Chapter 11.2.3, line 217
    WASTEWATER_EF: massPerMass('CH4', 'COD', 0.25),
    // Chapter 11.2.3, line 218
    SLUDGE_EF: massPerMass('CH4', 'COD', 0.25),
    /**
     * Chapter 11.2.3 line 221
     * Originally expressed in GJ/m^3
     */
    SLUDGE_BIOGAS_ENERGY_CONTENT: energyPerVolume(
      'CH4',
      gjPerCubicMetreToJPerLitre(0.0377),
    ),
    /**
     * Chapter 11.2.3 line 222
     * Originally expressed in kg CH4/GJ
     */
    SLUDGE_BIOGAS_CH4_EF: massPerEnergy('CH4', perGjToPerJ(0.2289)),
    /**
     * Chapter 11.2.3 line 223
     * Originally expressed in kg N2O/GJ
     */
    SLUDGE_BIOGAS_N2O_EF: massPerEnergy('N2O', perGjToPerJ(1.132e-4)),
  },

  /**
   * Appendix A.3.1.6 (except for "Plastic crate polypropylene", which comes from AusLCI)
   * REVISIT: There are more packaging emissions factors in the AusLCI set, but they're
   * expressed in kg packaging/kg CO2-e, could we include them if we accepted packaging
   * input by weight?
   */
  PURCHASED_PACKAGING_FACTORS: {
    '1 tonne polypropylene bag': mass('CO2e', 6.04),
    '25 kg polypropylene bag': mass('CO2e', 0.9),
    '20L high density polyethylene (HDPE) container': mass('CO2e', 3.41),
    '1000L intermediate bulk containers': mass('CO2e', 190.15),
    'Plastic crate polypropylene': mass('CO2e', 3.99),
  },

  PURCHASED_GROW_MEDIA_FACTORS: {
    byMass: {
      PLACEHOLDER_MASS_TYPE: massPerMass('CO2e', 'Grow Media', 1),
    },
    byVolume: {
      PLACEHOLDER_VOLUME_TYPE: massPerVolume(
        'CO2e',
        'Grow Media',
        perCubicMetresToPerLitres(1),
      ),
    },
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

  // Lifecycles GHG Emission Intensities for Material Inputs to AUS Ag Fisheries Forestry V48 (March 2026)
  INORGANIC_FERTILISER_FRACTIONS_BY_REGION: {
    Ammonia: {
      China: massPerMass('CO2e', 'Inorganic Fertiliser', 4.17),
      Yemen: massPerMass('CO2e', 'Inorganic Fertiliser', 2.26),
      Canada: massPerMass('CO2e', 'Inorganic Fertiliser', 2.12),
      Unspecified: massPerMass('CO2e', 'Inorganic Fertiliser', 2.32),
    },
    Urea: {
      China: massPerMass('CO2e', 'Inorganic Fertiliser', 2.09),
      Yemen: massPerMass('CO2e', 'Inorganic Fertiliser', 0.963),
      Canada: massPerMass('CO2e', 'Inorganic Fertiliser', 0.823),
      Unspecified: massPerMass('CO2e', 'Inorganic Fertiliser', 0.968),
    },
  },
  INORGANIC_FERTILISER_FRACTIONS_BY_NON_REGIONAL: {
    // Lifecycles GHG Emission Intensities for Material Inputs to AUS Ag Fisheries Forestry V48 (March 2026)
    'Monoammonium phosphate': massPerMass(
      'CO2e',
      'Inorganic Fertiliser',
      0.827,
    ),
    'Diammonium Phosphate': massPerMass('CO2e', 'Inorganic Fertiliser', 1.34),
    'Urea-Ammonium Nitrate': massPerMass('CO2e', 'Inorganic Fertiliser', 1.75),
    'Ammonium Nitrate': massPerMass('CO2e', 'Inorganic Fertiliser', 2.21),
    'Calcium Ammonium Nitrate': massPerMass(
      'CO2e',
      'Inorganic Fertiliser',
      1.15,
    ),
    'Sulphate of Ammonia': massPerMass('CO2e', 'Inorganic Fertiliser', 0.865),
    'Nitrogen - Generic': massPerMass('CO2e', 'Inorganic Fertiliser', 4.2),
    'Nitrogen - Nitrate': massPerMass('CO2e', 'Inorganic Fertiliser', 5.47),
    'Nitrogen - Ammonia': massPerMass('CO2e', 'Inorganic Fertiliser', 2.83),
    'Muriate of Potash': massPerMass('CO2e', 'Inorganic Fertiliser', 0.549),
    'Single superphosphate': massPerMass('CO2e', 'Inorganic Fertiliser', 0.227),
    'Double Superphosphate': massPerMass('CO2e', 'Inorganic Fertiliser', 0.392),
    'Phosphorus - Generic': massPerMass('CO2e', 'Inorganic Fertiliser', 3.96),
    'Potassium - Generic': massPerMass('CO2e', 'Inorganic Fertiliser', 0.909),
    'Sulfur - Generic': massPerMass('CO2e', 'Inorganic Fertiliser', 2.5),
    'Zinc - Generic': massPerMass('CO2e', 'Inorganic Fertiliser', 4.82),
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

  ENERGY_PER_MASS_METHANE: energyPerMass('CH4', megaJoulesToJoules(55.22)),

  GROSS_ENERGY_CONTENT_OF_FEED: energyPerMass(
    'DryMatter',
    megaJoulesToJoules(18.6),
  ),

  FRACTION_INTAKE_CONVERTED_TO_METHANE: realNumber(0.007),

  SWINE_CLASS_FACTORS: {
    boars: {
      FEED_INTAKE: massPerHeadPerDay('DryMatter', 2.62),
    },
    sows: {
      FEED_INTAKE: massPerHeadPerDay('DryMatter', 2.3),
    },
    gilts: {
      FEED_INTAKE: massPerHeadPerDay('DryMatter', 2.5),
    },
    slaughterPigs: {
      FEED_INTAKE: massPerHeadPerDay('DryMatter', 1.71),
    },
  },
};

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
      NEUTRAL_DETERGENT_FIBRE_PERCENTAGE: percentage(22),
      ETHER_EXTRACT_PERCENTAGE: percentage(4.8),
    },
    '81-200 days': {
      DRY_MATTER_INTAKE: massPerHeadPerDay('DryMatter', 10.8),
      CRUDE_PROTEIN_CONTENT: massPerMass('CrudeProtein', 'DryMatter', 0.12),
      NITROGEN_RETENTION_FRACTION: realNumber(0.127),
      NEUTRAL_DETERGENT_FIBRE_PERCENTAGE: percentage(22),
      ETHER_EXTRACT_PERCENTAGE: percentage(5),
    },
    '201+ days': {
      DRY_MATTER_INTAKE: massPerHeadPerDay('DryMatter', 8.2),
      CRUDE_PROTEIN_CONTENT: massPerMass('CrudeProtein', 'DryMatter', 0.12),
      NITROGEN_RETENTION_FRACTION: realNumber(0.07),
      NEUTRAL_DETERGENT_FIBRE_PERCENTAGE: percentage(24),
      ETHER_EXTRACT_PERCENTAGE: percentage(5.5),
    },
  },
};

export const dairyConstants: DairyConstants = {
  name: 'DAIRY',

  DAIRY_CLASS_FACTORS: {
    milkingCows: {
      liveweightGain: massPerHeadPerDay('Liveweight', 0.016),
      referenceWeight: mass('Liveweight', 590),
    },
    heifersGt1: {
      liveweightGain: massPerHeadPerDay('Liveweight', 0.6),
      referenceWeight: mass('Liveweight', 590),
    },
    heifersLt1: {
      liveweightGain: massPerHeadPerDay('Liveweight', 0.57),
      referenceWeight: mass('Liveweight', 590),
    },
    bullsGt1: {
      liveweightGain: massPerHeadPerDay('Liveweight', 0.1),
      referenceWeight: mass('Liveweight', 770),
    },
    bullsLt1: {
      liveweightGain: massPerHeadPerDay('Liveweight', 0.8),
      referenceWeight: mass('Liveweight', 770),
    },
  },

  LIVEWEIGHTS_BY_BREED: {
    'Medium Friesian': {
      milkingCows: mass('Liveweight', 550),
      heifersGt1: mass('Liveweight', 380),
      heifersLt1: mass('Liveweight', 155),
      bullsGt1: mass('Liveweight', 600),
      bullsLt1: mass('Liveweight', 225),
    },
    'Large Friesian': {
      milkingCows: mass('Liveweight', 600),
      heifersGt1: mass('Liveweight', 415),
      heifersLt1: mass('Liveweight', 170),
      bullsGt1: mass('Liveweight', 600),
      bullsLt1: mass('Liveweight', 225),
    },
    'Holstein-Friesian': {
      milkingCows: mass('Liveweight', 650),
      heifersGt1: mass('Liveweight', 450),
      heifersLt1: mass('Liveweight', 185),
      bullsGt1: mass('Liveweight', 600),
      bullsLt1: mass('Liveweight', 225),
    },
    'Friesian crossbred': {
      milkingCows: mass('Liveweight', 500),
      heifersGt1: mass('Liveweight', 350),
      heifersLt1: mass('Liveweight', 145),
      bullsGt1: mass('Liveweight', 600),
      bullsLt1: mass('Liveweight', 225),
    },
    Jersey: {
      milkingCows: mass('Liveweight', 400),
      heifersGt1: mass('Liveweight', 275),
      heifersLt1: mass('Liveweight', 115),
      bullsGt1: mass('Liveweight', 600),
      bullsLt1: mass('Liveweight', 225),
    },
    'Jersey crossbred': {
      milkingCows: mass('Liveweight', 450),
      heifersGt1: mass('Liveweight', 315),
      heifersLt1: mass('Liveweight', 130),
      bullsGt1: mass('Liveweight', 600),
      bullsLt1: mass('Liveweight', 225),
    },
    Ayrshire: {
      milkingCows: mass('Liveweight', 540),
      heifersGt1: mass('Liveweight', 375),
      heifersLt1: mass('Liveweight', 150),
      bullsGt1: mass('Liveweight', 600),
      bullsLt1: mass('Liveweight', 225),
    },
    Guernsey: {
      milkingCows: mass('Liveweight', 480),
      heifersGt1: mass('Liveweight', 335),
      heifersLt1: mass('Liveweight', 140),
      bullsGt1: mass('Liveweight', 600),
      bullsLt1: mass('Liveweight', 225),
    },
    'Brown Swiss': {
      milkingCows: mass('Liveweight', 600),
      heifersGt1: mass('Liveweight', 415),
      heifersLt1: mass('Liveweight', 170),
      bullsGt1: mass('Liveweight', 600),
      bullsLt1: mass('Liveweight', 225),
    },
    'Illawarra/Aussie Red': {
      milkingCows: mass('Liveweight', 550),
      heifersGt1: mass('Liveweight', 375),
      heifersLt1: mass('Liveweight', 150),
      bullsGt1: mass('Liveweight', 600),
      bullsLt1: mass('Liveweight', 225),
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
      methaneProduction: massPerHeadPerDay('CH4', 0.0204),
    },
    heifersLt1: {
      urinaryN: massPerHeadPerDay('N', 0.0082),
      faecalN: massPerHeadPerDay('N', 0.0055),
      methaneProduction: massPerHeadPerDay('CH4', 0.0176),
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

  // PURCHASED_LIVESTOCK_FACTORS: {
  //   milkingCows: undefined,
  //   heifersGt1: undefined,
  //   heifersLt1: undefined,
  //   bullsGt1: undefined,
  //   bullsLt1: undefined
  // }
};

const allPureStatesWithValue = (
  rawValue: number,
): Record<PureState, RealNumber> => {
  const value = realNumber(rawValue);
  return {
    ACT: value,
    NSW: value,
    VIC: value,
    QLD: value,
    SA: value,
    TAS: value,
    NT: value,
    WA: value,
  };
};

const allTemperaturesWithValues = (
  rawValues: number | { cool: number; temperate: number; warm: number },
): Record<MeanAnnualTemperature, RealNumber> => {
  const cool = typeof rawValues === 'number' ? rawValues : rawValues.cool;
  const temperate =
    typeof rawValues === 'number' ? rawValues : rawValues.temperate;
  const warm = typeof rawValues === 'number' ? rawValues : rawValues.warm;

  return {
    '10 or below': realNumber(cool),
    11: realNumber(cool),
    12: realNumber(cool),
    13: realNumber(cool),
    14: realNumber(cool),
    15: realNumber(temperate),
    16: realNumber(temperate),
    17: realNumber(temperate),
    18: realNumber(temperate),
    19: realNumber(temperate),
    20: realNumber(temperate),
    21: realNumber(temperate),
    22: realNumber(temperate),
    23: realNumber(temperate),
    24: realNumber(temperate),
    25: realNumber(temperate),
    26: realNumber(warm),
    27: realNumber(warm),
    '28 or above': realNumber(warm),
  };
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
      emissionsPotential: volumePerMass(
        'CH4',
        'Volatile Solids',
        cubicMetresToLitres(0.39),
      ),
    },
    meatChickenGrowers: {
      dryMatterIntake: massPerHeadPerDay('DryMatter', 0.093),
      dryMatterDigestibility: realNumber(0.8),
      crudeProtein: massPerMass('CrudeProtein', 'DryMatter', 0.23),
      nitrogenRetentionRate: realNumber(0.47),
      manureAsh: realNumber(0.15),
      emissionsPotential: volumePerMass(
        'CH4',
        'Volatile Solids',
        cubicMetresToLitres(0.36),
      ),
    },
    meatChickenBreeder: {
      dryMatterIntake: massPerHeadPerDay('DryMatter', 0.103),
      dryMatterDigestibility: realNumber(0.8),
      crudeProtein: massPerMass('CrudeProtein', 'DryMatter', 0.19),
      nitrogenRetentionRate: realNumber(0.32),
      manureAsh: realNumber(0.18),
      emissionsPotential: volumePerMass(
        'CH4',
        'Volatile Solids',
        cubicMetresToLitres(0.36),
      ),
    },
    meatOther: {
      dryMatterIntake: massPerHeadPerDay('DryMatter', 0.093),
      dryMatterDigestibility: realNumber(0.8),
      crudeProtein: massPerMass('CrudeProtein', 'DryMatter', 0.23),
      nitrogenRetentionRate: realNumber(0.47),
      manureAsh: realNumber(0.15),
      emissionsPotential: volumePerMass(
        'CH4',
        'Volatile Solids',
        cubicMetresToLitres(0.36),
      ),
    },
  },

  MMS: {
    manureWithLitter: {
      FracGASM: massPerMass('Volatilised N', 'N', 0.3),
      EFm: massPerMass('N2O', 'N', 0.001),
      fractionSolidsLost: realNumber(0.15),
      METHANE_CONVERSION_FACTOR_BY_STATE: allPureStatesWithValue(0.015),
    },
    beltManureRemoval: {
      FracGASM: massPerMass('Volatilised N', 'N', 0.05),
      EFm: massPerMass('N2O', 'N', 0.001),
      fractionSolidsLost: realNumber(0),
      METHANE_CONVERSION_FACTOR_BY_STATE: allPureStatesWithValue(0.015),
    },
    manureStoredInHouse: {
      FracGASM: massPerMass('Volatilised N', 'N', 0.4),
      EFm: massPerMass('N2O', 'N', 0.001),
      fractionSolidsLost: realNumber(0.2),
      METHANE_CONVERSION_FACTOR_BY_STATE: allPureStatesWithValue(0.015),
    },
    solidStorage: {
      FracGASM: massPerMass('Volatilised N', 'N', 0.2),
      EFm: massPerMass('N2O', 'N', 0.005),
      METHANE_CONVERSION_FACTOR_BY_STATE: allPureStatesWithValue(0.02),
    },
    composting: {
      FracGASM: massPerMass('Volatilised N', 'N', 0.2),
      EFm: massPerMass('N2O', 'N', 0.01),
      METHANE_CONVERSION_FACTOR_BY_STATE: {
        ...allPureStatesWithValue(0.01),
        TAS: realNumber(0.005),
      },
    },
    directProcessing: {
      FracGASM: massPerMass('Volatilised N', 'N', 0),
      EFm: massPerMass('N2O', 'N', 0),
      METHANE_CONVERSION_FACTOR_BY_STATE: allPureStatesWithValue(0),
    },
    digester: {
      FracGASM: massPerMass('Volatilised N', 'N', 0),
      EFm: massPerMass('N2O', 'N', 0),
      METHANE_CONVERSION_FACTOR_BY_STATE: allPureStatesWithValue(0.1),
    },
    pastureRangeAndPaddock: {
      EFm: massPerMass('N2O', 'N', 0.02),
      METHANE_CONVERSION_FACTOR_BY_STATE: {
        ...allPureStatesWithValue(0.01),
        // REVISIT: This might actually be 0.2, implied by a footnote on table A.1.8.1 - or that footnote might hold the typo and this is correct.
        QLD: realNumber(0.03),
        NT: realNumber(0.03),
      },
    },
    directApplication: {
      // NOTE: There is no row for this in table A.1.7.4, but in table A.1.8.1 this value is 0 across all mean annual temperatures, so this is implied.
      METHANE_CONVERSION_FACTOR_BY_STATE: allPureStatesWithValue(0),
    },
  },
};

export const livestockConstants: LivestockConstants = {
  name: 'LIVESTOCK',
  /**
   * Appendix A1 Table A.3.1.2 & AusLCI
   */
  PURCHASED_FEED_FACTORS: {
    /**
     * Appendix A1 Table A.3.1.2 (except for `Bentonite`, which comes from AusLCI)
     */
    regionless: {
      'Meat Meal': massPerMass('CO2e', 'Purchased Feed', 0.386),
      'Blood Meal': massPerMass('CO2e', 'Purchased Feed', 1.9),
      Millrun: massPerMass('CO2e', 'Purchased Feed', 0.3),
      'Whole Sardines': massPerMass('CO2e', 'Purchased Feed', 0.3),
      'Low Animal Protein Formulated Feed': massPerMass(
        'CO2e',
        'Purchased Feed',
        2.2,
      ),
      Squid: massPerMass('CO2e', 'Purchased Feed', 0.3),
      'Whole Fish': massPerMass('CO2e', 'Purchased Feed', 0.3),
      'Custom Bait': massPerMass('CO2e', 'Purchased Feed', 0.08),
      Bentonite: massPerMass('CO2e', 'Purchased Feed', 0.0652),
    },
    /**
     * AusLCI
     */
    regional: {
      Australia: {
        'Barley grain': massPerMass('CO2e', 'Purchased Feed', 0.239),
        'Maize grain': massPerMass('CO2e', 'Purchased Feed', 0.181),
        'Sorghum grain': massPerMass('CO2e', 'Purchased Feed', 0.232),
        'Wheat grain': massPerMass('CO2e', 'Purchased Feed', 0.268),
        'Cereal hay': massPerMass('CO2e', 'Purchased Feed', 0.117),
        'Cereal silage': massPerMass('CO2e', 'Purchased Feed', 0.0744),
        'Lucerne hay': massPerMass('CO2e', 'Purchased Feed', 0.117),
        'Oaten hay': massPerMass('CO2e', 'Purchased Feed', 0.12),
        'Pasture hay': massPerMass('CO2e', 'Purchased Feed', 0.339),
        'Wheat bran': massPerMass('CO2e', 'Purchased Feed', 0.196),
        'Canola meal': massPerMass('CO2e', 'Purchased Feed', 0.244),
        'Feed for chickens': massPerMass('CO2e', 'Purchased Feed', 0.594),
        'Feed for pigs': massPerMass('CO2e', 'Purchased Feed', 0.403),
        'Feed for dairy calves': massPerMass('CO2e', 'Purchased Feed', 0.419),
        'Feed for dairy cows': massPerMass('CO2e', 'Purchased Feed', 0.333),
        'Canola oil': massPerMass('CO2e', 'Purchased Feed', 0.87),
        'Cotton seed': massPerMass('CO2e', 'Purchased Feed', 0.197),
      },
      NSW: {
        'Barley grain': massPerMass('CO2e', 'Purchased Feed', 0.256),
        'Maize grain': massPerMass('CO2e', 'Purchased Feed', 0.169),
        'Sorghum grain': massPerMass('CO2e', 'Purchased Feed', 0.232),
        'Wheat grain': massPerMass('CO2e', 'Purchased Feed', 0.282),
        'Cereal hay': massPerMass('CO2e', 'Purchased Feed', 0.116),
        'Cereal silage': massPerMass('CO2e', 'Purchased Feed', 0.0744),
        'Lucerne hay': massPerMass('CO2e', 'Purchased Feed', 0.113),
        'Oaten hay': massPerMass('CO2e', 'Purchased Feed', 0.119),
        'Pasture hay': massPerMass('CO2e', 'Purchased Feed', 0.311),
      },
      NT: {
        'Barley grain': massPerMass('CO2e', 'Purchased Feed', 0.332),
        'Maize grain': massPerMass('CO2e', 'Purchased Feed', 0.256),
        'Wheat grain': massPerMass('CO2e', 'Purchased Feed', 0.385),
      },
      QLD: {
        'Barley grain': massPerMass('CO2e', 'Purchased Feed', 0.269),
        'Maize grain': massPerMass('CO2e', 'Purchased Feed', 0.186),
        'Sorghum grain': massPerMass('CO2e', 'Purchased Feed', 0.231),
        'Wheat grain': massPerMass('CO2e', 'Purchased Feed', 0.296),
        'Cereal hay': massPerMass('CO2e', 'Purchased Feed', 0.118),
        'Cereal silage': massPerMass('CO2e', 'Purchased Feed', 0.079),
        'Lucerne hay': massPerMass('CO2e', 'Purchased Feed', 0.143),
        'Oaten hay': massPerMass('CO2e', 'Purchased Feed', 0.117),
        'Pasture hay': massPerMass('CO2e', 'Purchased Feed', 0.254),
        Molasses: massPerMass('CO2e', 'Purchased Feed', 0.184),
      },
      SA: {
        'Barley grain': massPerMass('CO2e', 'Purchased Feed', 0.223),
        'Maize grain': massPerMass('CO2e', 'Purchased Feed', 0.176),
        'Sorghum grain': massPerMass('CO2e', 'Purchased Feed', 0.218),
        'Wheat grain': massPerMass('CO2e', 'Purchased Feed', 0.241),
        'Cereal hay': massPerMass('CO2e', 'Purchased Feed', 0.111),
        'Cereal silage': massPerMass('CO2e', 'Purchased Feed', 0.0706),
        'Lucerne hay': massPerMass('CO2e', 'Purchased Feed', 0.106),
        'Oaten hay': massPerMass('CO2e', 'Purchased Feed', 0.114),
        'Pasture hay': massPerMass('CO2e', 'Purchased Feed', 0.313),
      },
      TAS: {
        'Barley grain': massPerMass('CO2e', 'Purchased Feed', 0.307),
        'Wheat grain': massPerMass('CO2e', 'Purchased Feed', 0.338),
        'Cereal hay': massPerMass('CO2e', 'Purchased Feed', 0.139),
        'Cereal silage': massPerMass('CO2e', 'Purchased Feed', 0.0808),
        'Lucerne hay': massPerMass('CO2e', 'Purchased Feed', 0.113),
        'Pasture hay': massPerMass('CO2e', 'Purchased Feed', 0.398),
      },
      VIC: {
        'Barley grain': massPerMass('CO2e', 'Purchased Feed', 0.241),
        'Maize grain': massPerMass('CO2e', 'Purchased Feed', 0.159),
        'Sorghum grain': massPerMass('CO2e', 'Purchased Feed', 0.246),
        'Wheat grain': massPerMass('CO2e', 'Purchased Feed', 0.266),
        'Cereal hay': massPerMass('CO2e', 'Purchased Feed', 0.116),
        'Cereal silage': massPerMass('CO2e', 'Purchased Feed', 0.0736),
        'Lucerne hay': massPerMass('CO2e', 'Purchased Feed', 0.106),
        'Maize silage': massPerMass('CO2e', 'Purchased Feed', 0.163),
        'Oaten hay': massPerMass('CO2e', 'Purchased Feed', 0.118),
        'Pasture hay': massPerMass('CO2e', 'Purchased Feed', 0.345),
      },
      WA: {
        'Barley grain': massPerMass('CO2e', 'Purchased Feed', 0.236),
        'Maize grain': massPerMass('CO2e', 'Purchased Feed', 0.285),
        'Wheat grain': massPerMass('CO2e', 'Purchased Feed', 0.261),
        'Cereal hay': massPerMass('CO2e', 'Purchased Feed', 0.122),
        'Oaten hay': massPerMass('CO2e', 'Purchased Feed', 0.124),
        'Pasture hay': massPerMass('CO2e', 'Purchased Feed', 0.368),
      },
      Brazil: {
        'Soybean meal': massPerMass('CO2e', 'Purchased Feed', 1.23),
      },
    },
  },
  /**
   * AusLCI
   */
  PURCHASED_MINERAL_SUPPLEMENT_FACTORS: {
    'Lick block, dry season mix': massPerMass(
      'CO2e',
      'Purchased Mineral Supplement',
      0.881,
    ),
    'Lick block, weaner': massPerMass(
      'CO2e',
      'Purchased Mineral Supplement',
      0.231,
    ),
    'Lick block, mineral': massPerMass(
      'CO2e',
      'Purchased Mineral Supplement',
      0.677,
    ),
  },

  // Appendix A.1.5.1
  OTHER_LIVESTOCK_EMISSION_FACTORS: {
    'Emus/ostriches': {
      ENTERIC: massPerHead('CH4', 5),
      VOLATILE_SOLIDS: massPerHeadPerDay('Volatile Solids', 0.34),
      NITROGEN_EXCRETED: massPerHeadPerDay('N', 7),
    },
    'Mules/asses': {
      ENTERIC: massPerHead('CH4', 10),
      VOLATILE_SOLIDS: massPerHeadPerDay('Volatile Solids', 0.91),
      NITROGEN_EXCRETED: massPerHeadPerDay('N', 13.2),
    },
    Alpacas: {
      ENTERIC: massPerHead('CH4', 8),
      VOLATILE_SOLIDS: massPerHeadPerDay('Volatile Solids', 0.34),
      NITROGEN_EXCRETED: massPerHeadPerDay('N', 7),
    },
    Horses: {
      ENTERIC: massPerHead('CH4', 18),
      VOLATILE_SOLIDS: massPerHeadPerDay('Volatile Solids', 2.73),
      NITROGEN_EXCRETED: massPerHeadPerDay('N', 39.5),
    },
    Camels: {
      ENTERIC: massPerHead('CH4', 46),
      VOLATILE_SOLIDS: massPerHeadPerDay('Volatile Solids', 2.73),
      NITROGEN_EXCRETED: massPerHeadPerDay('N', 39.5),
    },
    Buffalo: {
      ENTERIC: massPerHead('CH4', 68),
      VOLATILE_SOLIDS: massPerHeadPerDay('Volatile Solids', 2.73),
      NITROGEN_EXCRETED: massPerHeadPerDay('N', 39.5),
    },
    Goats: {
      ENTERIC: massPerHead('CH4', 5),
      VOLATILE_SOLIDS: massPerHeadPerDay('Volatile Solids', 0.34),
      NITROGEN_EXCRETED: massPerHeadPerDay('N', 7),
    },
    Deer: {
      ENTERIC: massPerHead('CH4', 20),
      VOLATILE_SOLIDS: massPerHeadPerDay('Volatile Solids', 0.91),
      NITROGEN_EXCRETED: massPerHeadPerDay('N', 13.2),
    },
  },

  METHANE_CONVERSION_BY_MEAN_ANNUAL_TEMPERATURE: {
    '10 or below': realNumber(0.66),
    '11': realNumber(0.68),
    '12': realNumber(0.7),
    '13': realNumber(0.71),
    '14': realNumber(0.73),
    '15': realNumber(0.74),
    '16': realNumber(0.75),
    '17': realNumber(0.76),
    '18': realNumber(0.77),
    '19': realNumber(0.77),
    '20': realNumber(0.78),
    '21': realNumber(0.78),
    '22': realNumber(0.78),
    '23': realNumber(0.79),
    '24': realNumber(0.79),
    '25': realNumber(0.79),
    '26': realNumber(0.79),
    '27': realNumber(0.8),
    '28 or above': realNumber(0.8),
  },
  MANURE_MANAGEMENT_METHANE_CONVERSION_FACTORS: {
    anaerobicLagoon: {
      '10 or below': realNumber(0.66),
      '11': realNumber(0.68),
      '12': realNumber(0.7),
      '13': realNumber(0.71),
      '14': realNumber(0.73),
      '15': realNumber(0.74),
      '16': realNumber(0.75),
      '17': realNumber(0.76),
      '18': realNumber(0.77),
      '19': realNumber(0.77),
      '20': realNumber(0.78),
      '21': realNumber(0.78),
      '22': realNumber(0.78),
      '23': realNumber(0.79),
      '24': realNumber(0.79),
      '25': realNumber(0.79),
      '26': realNumber(0.79),
      '27': realNumber(0.8),
      '28 or above': realNumber(0.8),
    },
    manureWithLitter: allTemperaturesWithValues(0.015),
    beltManureRemoval: allTemperaturesWithValues(0.015),
    manureStoredInHouse: allTemperaturesWithValues(0.015),
    solidStorage: allTemperaturesWithValues(0.02),
    composting: allTemperaturesWithValues({
      cool: 0.005,
      temperate: 0.01,
      warm: 0.015,
    }),
    digester: allTemperaturesWithValues(0.1),
    directProcessing: allTemperaturesWithValues(0),
    directApplication: allTemperaturesWithValues(0),
    pastureRangeAndPaddock: allTemperaturesWithValues(0.0047),
  },

  OTHER_LIVESTOCK_METHANE_CONVERSION_BY_STATE: {
    ACT: realNumber(0.71),
    NSW: realNumber(0.75),
    NT: realNumber(0.8),
    QLD: realNumber(0.78),
    SA: realNumber(0.74),
    TAS: realNumber(0.7),
    VIC: realNumber(0.74),
    WA: realNumber(0.76),
  },

  OTHER_LIVESTOCK_METHANE_CONVERSION_PASTURE: realNumber(0.0047),

  EF_DEPOSITED_URINE_AND_DUNG_PRP: {
    wet: massPerMass('N2O', 'N', 0.006),
    dry: massPerMass('N2O', 'N', 0.002),
  },

  EF_ATMOSPHERIC_DEPOSITION: {
    'Non-irrigated pasture': massPerMass('N2O', 'Volatilised N', 0.0018),
    'Irrigated pasture': massPerMass('N2O', 'Volatilised N', 0.0059),
    'Irrigated crop': massPerMass('N2O', 'Volatilised N', 0.007),
    'Non-irrigated crop (low rainfall)': massPerMass(
      'N2O',
      'Volatilised N',
      0.0029,
    ),
    'Non-irrigated crop (high rainfall)': massPerMass(
      'N2O',
      'Volatilised N',
      0.008,
    ),
  },

  /**
   * Values are taken from the national averages for sheep and beef,
   * depending on which of the two the guidelines advises is the most similar
   * for each livestock type.
   */
  OTHER_PURCHASED_LIVESTOCK_FACTORS: {
    Buffalo: massPerMass('CO2e', 'Liveweight', 12.4),
    Goats: massPerMass('CO2e', 'Liveweight', 5.44),
    Deer: massPerMass('CO2e', 'Liveweight', 5.44),
    Camels: massPerMass('CO2e', 'Liveweight', 12.4),
    Alpacas: massPerMass('CO2e', 'Liveweight', 5.44),
    Horses: massPerMass('CO2e', 'Liveweight', 12.4),
    'Mules/asses': massPerMass('CO2e', 'Liveweight', 5.44),
    'Emus/ostriches': massPerMass('CO2e', 'Liveweight', 5.44),
  },
  /**
   * REVISIT: The table given in A.1.5.4 is not formatted very well; some of these
   * numbers may need to be revised later.
   */
  OTHER_PURCHASED_LIVESTOCK_AVERAGE_LIVEWEIGHTS: {
    Buffalo: massPerHead('Liveweight', 336),
    Goats: massPerHead('Liveweight', 50),
    Deer: massPerHead('Liveweight', 120),
    Camels: massPerHead('Liveweight', 570),
    Alpacas: massPerHead('Liveweight', 65),
    Horses: massPerHead('Liveweight', 550),
    'Mules/asses': massPerHead('Liveweight', 245),
    'Emus/ostriches': massPerHead('Liveweight', 120),
  },

  EMISSIONS_POTENTIAL_VOLATILE_SOLIDS_TO_CH4: {
    general: volumePerMass('CH4', 'Volatile Solids', cubicMetresToLitres(0.19)),
    dairy: volumePerMass('CH4', 'Volatile Solids', cubicMetresToLitres(0.24)),
    // REVISIT: Tranche 2 docs have a value of 0.24, but source IPCC (2019), Chapter 10 [3] appears to have 0.19 for sheep
    sheep: volumePerMass('CH4', 'Volatile Solids', cubicMetresToLitres(0.19)),
  },
};

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

  CP: {
    'ACT/NSW': {
      spring: realNumber(0.07),
      summer: realNumber(0.13),
      autumn: realNumber(0.1),
      winter: realNumber(0.06),
    },
    NT: {
      spring: realNumber(0.058),
      summer: realNumber(0.092),
      autumn: realNumber(0.075),
      winter: realNumber(0.053),
    },
    QLD: {
      spring: realNumber(0.072),
      summer: realNumber(0.099),
      autumn: realNumber(0.078),
      winter: realNumber(0.059),
    },
    SA: {
      spring: realNumber(0.16),
      summer: realNumber(0.07),
      autumn: realNumber(0.09),
      winter: realNumber(0.2),
    },
    TAS: {
      spring: realNumber(0.2),
      summer: realNumber(0.1),
      autumn: realNumber(0.16),
      winter: realNumber(0.2),
    },
    VIC: {
      spring: realNumber(0.25),
      summer: realNumber(0.07),
      autumn: realNumber(0.1),
      winter: realNumber(0.21),
    },
    'WA - South West': {
      spring: realNumber(0.2),
      summer: realNumber(0.09),
      autumn: realNumber(0.06),
      winter: realNumber(0.2),
    },
    'WA - Pilbara': {
      spring: realNumber(0.04),
      summer: realNumber(0.12),
      autumn: realNumber(0.09),
      winter: realNumber(0.06),
    },
    'WA - Kimberley': {
      spring: realNumber(0.04),
      summer: realNumber(0.12),
      autumn: realNumber(0.09),
      winter: realNumber(0.06),
    },
  },

  REFERENCE_WEIGHT: {
    ACT: {
      bullsLt1: mass('Liveweight', 700),
      bullsGt1: mass('Liveweight', 700),
      cowsLt1: mass('Liveweight', 600),
      cows1To2Years: mass('Liveweight', 500),
      cows2To3Years: mass('Liveweight', 500),
      cowsGt3Years: mass('Liveweight', 500),
      steersLt1: mass('Liveweight', 500),
      steers1To2Years: mass('Liveweight', 600),
      steers2To3Years: mass('Liveweight', 600),
      steersGt3Years: mass('Liveweight', 600),
    },
    NSW: {
      // duplicate of ACT
      bullsLt1: mass('Liveweight', 700),
      bullsGt1: mass('Liveweight', 700),
      cowsLt1: mass('Liveweight', 600),
      cows1To2Years: mass('Liveweight', 500),
      cows2To3Years: mass('Liveweight', 500),
      cowsGt3Years: mass('Liveweight', 500),
      steersLt1: mass('Liveweight', 500),
      steers1To2Years: mass('Liveweight', 600),
      steers2To3Years: mass('Liveweight', 600),
      steersGt3Years: mass('Liveweight', 600),
    },
    NT: {
      bullsLt1: mass('Liveweight', 770),
      bullsGt1: mass('Liveweight', 770),
      cowsLt1: mass('Liveweight', 660),
      cows1To2Years: mass('Liveweight', 550),
      cows2To3Years: mass('Liveweight', 550),
      cowsGt3Years: mass('Liveweight', 550),
      steersLt1: mass('Liveweight', 550),
      steers1To2Years: mass('Liveweight', 660),
      steers2To3Years: mass('Liveweight', 660),
      steersGt3Years: mass('Liveweight', 660),
    },
    QLD: {
      bullsLt1: mass('Liveweight', 770),
      bullsGt1: mass('Liveweight', 770),
      cowsLt1: mass('Liveweight', 660),
      cows1To2Years: mass('Liveweight', 550),
      cows2To3Years: mass('Liveweight', 550),
      cowsGt3Years: mass('Liveweight', 550),
      steersLt1: mass('Liveweight', 550),
      steers1To2Years: mass('Liveweight', 660),
      steers2To3Years: mass('Liveweight', 660),
      steersGt3Years: mass('Liveweight', 660),
    },
    SA: {
      bullsLt1: mass('Liveweight', 770),
      bullsGt1: mass('Liveweight', 770),
      cowsLt1: mass('Liveweight', 660),
      cows1To2Years: mass('Liveweight', 550),
      cows2To3Years: mass('Liveweight', 550),
      cowsGt3Years: mass('Liveweight', 550),
      steersLt1: mass('Liveweight', 550),
      steers1To2Years: mass('Liveweight', 660),
      steers2To3Years: mass('Liveweight', 660),
      steersGt3Years: mass('Liveweight', 660),
    },
    TAS: {
      bullsLt1: mass('Liveweight', 770),
      bullsGt1: mass('Liveweight', 770),
      cowsLt1: mass('Liveweight', 660),
      cows1To2Years: mass('Liveweight', 550),
      cows2To3Years: mass('Liveweight', 550),
      cowsGt3Years: mass('Liveweight', 550),
      steersLt1: mass('Liveweight', 550),
      steers1To2Years: mass('Liveweight', 660),
      steers2To3Years: mass('Liveweight', 660),
      steersGt3Years: mass('Liveweight', 660),
    },
    VIC: {
      bullsLt1: mass('Liveweight', 770),
      bullsGt1: mass('Liveweight', 770),
      cowsLt1: mass('Liveweight', 660),
      cows1To2Years: mass('Liveweight', 550),
      cows2To3Years: mass('Liveweight', 550),
      cowsGt3Years: mass('Liveweight', 550),
      steersLt1: mass('Liveweight', 550),
      steers1To2Years: mass('Liveweight', 660),
      steers2To3Years: mass('Liveweight', 660),
      steersGt3Years: mass('Liveweight', 660),
    },
    WA: {
      bullsLt1: mass('Liveweight', 770),
      bullsGt1: mass('Liveweight', 770),
      cowsLt1: mass('Liveweight', 660),
      cows1To2Years: mass('Liveweight', 550),
      cows2To3Years: mass('Liveweight', 550),
      cowsGt3Years: mass('Liveweight', 550),
      steersLt1: mass('Liveweight', 550),
      steers1To2Years: mass('Liveweight', 660),
      steers2To3Years: mass('Liveweight', 660),
      steersGt3Years: mass('Liveweight', 660),
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

  MILK_INTAKE: {
    'ACT/NSW': {
      calving: massPerHeadPerDay('Milk', 6),
      afterCalving: massPerHeadPerDay('Milk', 4),
    },
    NT: {
      calving: massPerHeadPerDay('Milk', 4),
      afterCalving: massPerHeadPerDay('Milk', 3),
    },
    QLD: {
      calving: massPerHeadPerDay('Milk', 4),
      afterCalving: massPerHeadPerDay('Milk', 3),
    },
    SA: {
      calving: massPerHeadPerDay('Milk', 6),
      afterCalving: massPerHeadPerDay('Milk', 4),
    },
    TAS: {
      calving: massPerHeadPerDay('Milk', 6),
      afterCalving: massPerHeadPerDay('Milk', 4),
    },
    VIC: {
      calving: massPerHeadPerDay('Milk', 6),
      afterCalving: massPerHeadPerDay('Milk', 4),
    },
    'WA - South West': {
      calving: massPerHeadPerDay('Milk', 6),
      afterCalving: massPerHeadPerDay('Milk', 4),
    },
    'WA - Pilbara': {
      calving: massPerHeadPerDay('Milk', 4),
      afterCalving: massPerHeadPerDay('Milk', 3),
    },
    'WA - Kimberley': {
      calving: massPerHeadPerDay('Milk', 4),
      afterCalving: massPerHeadPerDay('Milk', 3),
    },
  },

  FRAC_WET_SOIL: {
    ACT: realNumber(0.87),
    NSW: realNumber(0.54),
    'NT - Alice Springs': realNumber(0.03),
    'NT - Barkly': realNumber(0.07),
    'NT - Northern': realNumber(0.92),
    'QLD - High': realNumber(0.18),
    'QLD - Moderate/High': realNumber(0.64),
    'QLD - Moderate/Low': realNumber(0.07),
    'QLD - Low': realNumber(0.18),
    SA: realNumber(0.22),
    TAS: realNumber(0.71),
    VIC: realNumber(0.56),
    'WA - South West': realNumber(0.89),
    'WA - Pilbara': realNumber(0.28),
    'WA - Kimberley': realNumber(0.3),
  },
};

export const riceConstants: RiceConstants = {
  name: 'RICE',
  WATER_REGIME_SCALING_FACTORS: {
    'Paddy rotation': realNumber(0),
    'Fallow without flooding in previous year': realNumber(0),
    'Continuously flooded': realNumber(1),
    'Single drainage period': realNumber(0.71),
    'Multiple drainage periods': realNumber(0.55),
    'Regular rainfed': realNumber(0.54),
    'Drought prone': realNumber(0.16),
    'Deep water': realNumber(0.06),
  },
  PRE_SEASON_WATER_REGIME_SCALING_FACTORS: {
    'Non flooded pre-season <180 days': realNumber(1),
    'Non flooded pre-season >180 days': realNumber(0.89),
    'Non-flooded pre-season >365 days': realNumber(0.59),
    'Flooded pre-season >30 days': realNumber(2.41),
  },
  ORGANIC_AMENDMENT_SCALING_FACTORS: {
    'Straw incorporated shortly (<30 days) before cultivation': realNumber(1),
    'Straw incorporated long (>30 days) before cultivation': realNumber(0.19),
    Compost: realNumber(0.17),
    'Farm yard manure': realNumber(0.21),
    'Green manure': realNumber(0.45),
  },
  BASELINE_CONTINUOUSLY_FLOODED_EF: massPerAreaPerDay(
    'CH4',
    perHectareToPerSqMetre(1.19),
  ),
};
const tonnesCarbonPerHectare = (tonnes: number) =>
  massPerArea('Carbon', tonnesPerHectareToKgPerSquareMetres(tonnes));

const tonnesCarbonPerHectarePerYear = (tonnes: number) =>
  massPerAreaPerYear('Carbon', tonnesPerHectareToKgPerSquareMetres(tonnes));

export const sheepConstants: SheepConstants = {
  name: 'SHEEP',
  SEASONAL_FACTORS: {
    'ACT/NSW': {
      rams: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea('DryMatter', 2.9),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: mass('Liveweight', 75),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.07),
          standardReferenceWeight: mass('Liveweight', 78),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.61),
          liveweight: mass('Liveweight', 75),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 78),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.12),
          dryMatterAvailability: massPerArea('DryMatter', 1.6),
          dryMatterDigestibility: realNumber(0.64),
          liveweight: mass('Liveweight', 69),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.07),
          standardReferenceWeight: mass('Liveweight', 78),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
          dryMatterAvailability: massPerArea('DryMatter', 1.7),
          dryMatterDigestibility: realNumber(0.72),
          liveweight: mass('Liveweight', 69),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 78),
        },
      },
      wethers: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea('DryMatter', 2.9),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: mass('Liveweight', 62),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.08),
          standardReferenceWeight: mass('Liveweight', 62),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.61),
          liveweight: mass('Liveweight', 55),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.08),
          standardReferenceWeight: mass('Liveweight', 62),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.12),
          dryMatterAvailability: massPerArea('DryMatter', 1.6),
          dryMatterDigestibility: realNumber(0.64),
          liveweight: mass('Liveweight', 55),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 62),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
          dryMatterAvailability: massPerArea('DryMatter', 1.7),
          dryMatterDigestibility: realNumber(0.72),
          liveweight: mass('Liveweight', 55),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 62),
        },
      },
      maidenEwes: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea('DryMatter', 2.9),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: mass('Liveweight', 44),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.07),
          standardReferenceWeight: mass('Liveweight', 57),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.61),
          liveweight: mass('Liveweight', 42),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 57),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.12),
          dryMatterAvailability: massPerArea('DryMatter', 1.6),
          dryMatterDigestibility: realNumber(0.64),
          liveweight: mass('Liveweight', 43),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 57),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
          dryMatterAvailability: massPerArea('DryMatter', 1.7),
          dryMatterDigestibility: realNumber(0.72),
          liveweight: mass('Liveweight', 45),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.02),
          standardReferenceWeight: mass('Liveweight', 57),
        },
      },
      breedingEwes: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea('DryMatter', 2.9),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: mass('Liveweight', 54),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.04),
          standardReferenceWeight: mass('Liveweight', 57),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.61),
          liveweight: mass('Liveweight', 49),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.05),
          standardReferenceWeight: mass('Liveweight', 57),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.12),
          dryMatterAvailability: massPerArea('DryMatter', 1.6),
          dryMatterDigestibility: realNumber(0.64),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.01),
          standardReferenceWeight: mass('Liveweight', 57),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
          dryMatterAvailability: massPerArea('DryMatter', 1.7),
          dryMatterDigestibility: realNumber(0.72),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 57),
        },
      },
      otherEwes: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea('DryMatter', 2.9),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: mass('Liveweight', 56),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.05),
          standardReferenceWeight: mass('Liveweight', 57),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.61),
          liveweight: mass('Liveweight', 51),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.05),
          standardReferenceWeight: mass('Liveweight', 57),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.12),
          dryMatterAvailability: massPerArea('DryMatter', 1.6),
          dryMatterDigestibility: realNumber(0.64),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.01),
          standardReferenceWeight: mass('Liveweight', 57),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
          dryMatterAvailability: massPerArea('DryMatter', 1.7),
          dryMatterDigestibility: realNumber(0.72),
          liveweight: mass('Liveweight', 51),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.01),
          standardReferenceWeight: mass('Liveweight', 57),
        },
      },
      lambsHoggets: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea('DryMatter', 2.9),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: mass('Liveweight', 20),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.16),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.61),
          liveweight: mass('Liveweight', 27),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.08),
          standardReferenceWeight: mass('Liveweight', 61),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.12),
          dryMatterAvailability: massPerArea('DryMatter', 1.6),
          dryMatterDigestibility: realNumber(0.64),
          liveweight: mass('Liveweight', 32),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.05),
          standardReferenceWeight: mass('Liveweight', 62),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
          dryMatterAvailability: massPerArea('DryMatter', 1.7),
          dryMatterDigestibility: realNumber(0.72),
          liveweight: mass('Liveweight', 34),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.04),
          standardReferenceWeight: mass('Liveweight', 63),
        },
      },
    },
    QLD: {
      rams: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.08),
          dryMatterAvailability: massPerArea('DryMatter', 1.5),
          dryMatterDigestibility: realNumber(0.51),
          liveweight: mass('Liveweight', 58),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.02),
          standardReferenceWeight: mass('Liveweight', 70),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea('DryMatter', 2),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 61),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.03),
          standardReferenceWeight: mass('Liveweight', 70),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
          dryMatterAvailability: massPerArea('DryMatter', 2.2),
          dryMatterDigestibility: realNumber(0.59),
          liveweight: mass('Liveweight', 63),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.02),
          standardReferenceWeight: mass('Liveweight', 70),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 1.7),
          dryMatterDigestibility: realNumber(0.58),
          liveweight: mass('Liveweight', 60),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.03),
          standardReferenceWeight: mass('Liveweight', 70),
        },
      },
      wethers: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.08),
          dryMatterAvailability: massPerArea('DryMatter', 1.5),
          dryMatterDigestibility: realNumber(0.51),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea('DryMatter', 2),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 55),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.05),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
          dryMatterAvailability: massPerArea('DryMatter', 2.2),
          dryMatterDigestibility: realNumber(0.59),
          liveweight: mass('Liveweight', 55),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 1.7),
          dryMatterDigestibility: realNumber(0.58),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.05),
          standardReferenceWeight: mass('Liveweight', 60),
        },
      },
      maidenEwes: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.08),
          dryMatterAvailability: massPerArea('DryMatter', 1.5),
          dryMatterDigestibility: realNumber(0.51),
          liveweight: mass('Liveweight', 35),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 50),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea('DryMatter', 2),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 40),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.05),
          standardReferenceWeight: mass('Liveweight', 50),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
          dryMatterAvailability: massPerArea('DryMatter', 2.2),
          dryMatterDigestibility: realNumber(0.59),
          liveweight: mass('Liveweight', 40),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 50),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 1.7),
          dryMatterDigestibility: realNumber(0.58),
          liveweight: mass('Liveweight', 35),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.05),
          standardReferenceWeight: mass('Liveweight', 50),
        },
      },
      breedingEwes: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.08),
          dryMatterAvailability: massPerArea('DryMatter', 1.5),
          dryMatterDigestibility: realNumber(0.51),
          liveweight: mass('Liveweight', 40),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.02),
          standardReferenceWeight: mass('Liveweight', 50),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea('DryMatter', 2),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 45),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.05),
          standardReferenceWeight: mass('Liveweight', 50),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
          dryMatterAvailability: massPerArea('DryMatter', 2.2),
          dryMatterDigestibility: realNumber(0.59),
          liveweight: mass('Liveweight', 45),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 50),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 1.7),
          dryMatterDigestibility: realNumber(0.58),
          liveweight: mass('Liveweight', 42),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.03),
          standardReferenceWeight: mass('Liveweight', 50),
        },
      },
      otherEwes: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.08),
          dryMatterAvailability: massPerArea('DryMatter', 1.5),
          dryMatterDigestibility: realNumber(0.51),
          liveweight: mass('Liveweight', 45),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.03),
          standardReferenceWeight: mass('Liveweight', 50),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea('DryMatter', 2),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.05),
          standardReferenceWeight: mass('Liveweight', 50),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
          dryMatterAvailability: massPerArea('DryMatter', 2.2),
          dryMatterDigestibility: realNumber(0.59),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 50),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 1.7),
          dryMatterDigestibility: realNumber(0.58),
          liveweight: mass('Liveweight', 48),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.02),
          standardReferenceWeight: mass('Liveweight', 50),
        },
      },
      lambsHoggets: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.08),
          dryMatterAvailability: massPerArea('DryMatter', 1.5),
          dryMatterDigestibility: realNumber(0.51),
          liveweight: mass('Liveweight', 20),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.2),
          standardReferenceWeight: mass('Liveweight', 55),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea('DryMatter', 2),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 25),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.05),
          standardReferenceWeight: mass('Liveweight', 56),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
          dryMatterAvailability: massPerArea('DryMatter', 2.2),
          dryMatterDigestibility: realNumber(0.59),
          liveweight: mass('Liveweight', 20),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.2),
          standardReferenceWeight: mass('Liveweight', 57),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 1.7),
          dryMatterDigestibility: realNumber(0.58),
          liveweight: mass('Liveweight', 25),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.05),
          standardReferenceWeight: mass('Liveweight', 58),
        },
      },
    },
    SA: {
      rams: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea('DryMatter', 4),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: mass('Liveweight', 80),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
          standardReferenceWeight: mass('Liveweight', 84),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 70),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.1),
          standardReferenceWeight: mass('Liveweight', 84),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
          dryMatterAvailability: massPerArea('DryMatter', 0.7),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 70),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 84),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea('DryMatter', 0.9),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: mass('Liveweight', 70),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 84),
        },
      },
      wethers: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea('DryMatter', 4),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: mass('Liveweight', 70),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
          standardReferenceWeight: mass('Liveweight', 72),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 65),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.1),
          standardReferenceWeight: mass('Liveweight', 72),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
          dryMatterAvailability: massPerArea('DryMatter', 0.7),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 60),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.1),
          standardReferenceWeight: mass('Liveweight', 72),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea('DryMatter', 0.9),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: mass('Liveweight', 60),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 72),
        },
      },
      maidenEwes: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea('DryMatter', 4),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: mass('Liveweight', 52),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 52),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
          dryMatterAvailability: massPerArea('DryMatter', 0.7),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 52),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea('DryMatter', 0.9),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: mass('Liveweight', 52),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 60),
        },
      },
      breedingEwes: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea('DryMatter', 4),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: mass('Liveweight', 55),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 55),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
          dryMatterAvailability: massPerArea('DryMatter', 0.7),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 55),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea('DryMatter', 0.9),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: mass('Liveweight', 55),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 60),
        },
      },
      otherEwes: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea('DryMatter', 4),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: mass('Liveweight', 55),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 55),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
          dryMatterAvailability: massPerArea('DryMatter', 0.7),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 55),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea('DryMatter', 0.9),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: mass('Liveweight', 55),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 60),
        },
      },
      lambsHoggets: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea('DryMatter', 4),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: mass('Liveweight', 40),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
          standardReferenceWeight: mass('Liveweight', 66),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 45),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.05),
          standardReferenceWeight: mass('Liveweight', 67),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
          dryMatterAvailability: massPerArea('DryMatter', 0.7),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 20),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.16),
          standardReferenceWeight: mass('Liveweight', 68),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea('DryMatter', 0.9),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: mass('Liveweight', 30),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.16),
          standardReferenceWeight: mass('Liveweight', 69),
        },
      },
    },
    TAS: {
      rams: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: mass('Liveweight', 90),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.16),
          standardReferenceWeight: mass('Liveweight', 77),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 90),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 77),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.14),
          dryMatterAvailability: massPerArea('DryMatter', 1.3),
          dryMatterDigestibility: realNumber(0.67),
          liveweight: mass('Liveweight', 75),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.2),
          standardReferenceWeight: mass('Liveweight', 77),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea('DryMatter', 0.8),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: mass('Liveweight', 75),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 77),
        },
      },
      wethers: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: mass('Liveweight', 55),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
          standardReferenceWeight: mass('Liveweight', 66),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 55),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 66),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.14),
          dryMatterAvailability: massPerArea('DryMatter', 1.3),
          dryMatterDigestibility: realNumber(0.67),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.1),
          standardReferenceWeight: mass('Liveweight', 66),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea('DryMatter', 0.8),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: mass('Liveweight', 45),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.1),
          standardReferenceWeight: mass('Liveweight', 66),
        },
      },
      maidenEwes: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: mass('Liveweight', 45),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.03),
          standardReferenceWeight: mass('Liveweight', 55),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 45),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 55),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.14),
          dryMatterAvailability: massPerArea('DryMatter', 1.3),
          dryMatterDigestibility: realNumber(0.67),
          liveweight: mass('Liveweight', 45),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 55),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea('DryMatter', 0.8),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.5),
          standardReferenceWeight: mass('Liveweight', 55),
        },
      },
      breedingEwes: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.02),
          standardReferenceWeight: mass('Liveweight', 55),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 55),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.14),
          dryMatterAvailability: massPerArea('DryMatter', 1.3),
          dryMatterDigestibility: realNumber(0.67),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 55),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea('DryMatter', 0.8),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: mass('Liveweight', 55),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.02),
          standardReferenceWeight: mass('Liveweight', 55),
        },
      },
      otherEwes: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 55),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 55),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.14),
          dryMatterAvailability: massPerArea('DryMatter', 1.3),
          dryMatterDigestibility: realNumber(0.67),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 55),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea('DryMatter', 0.8),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 55),
        },
      },
      lambsHoggets: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: mass('Liveweight', 14),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.15),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 2.5),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 24),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
          standardReferenceWeight: mass('Liveweight', 61),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.14),
          dryMatterAvailability: massPerArea('DryMatter', 1.3),
          dryMatterDigestibility: realNumber(0.67),
          liveweight: mass('Liveweight', 36),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.13),
          standardReferenceWeight: mass('Liveweight', 62),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea('DryMatter', 0.8),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: mass('Liveweight', 42),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.07),
          standardReferenceWeight: mass('Liveweight', 63),
        },
      },
    },
    VIC: {
      rams: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea('DryMatter', 3.2),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: mass('Liveweight', 70),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
          standardReferenceWeight: mass('Liveweight', 70),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 3),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 65),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.05),
          standardReferenceWeight: mass('Liveweight', 70),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.13),
          dryMatterAvailability: massPerArea('DryMatter', 1.8),
          dryMatterDigestibility: realNumber(0.65),
          liveweight: mass('Liveweight', 65),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 70),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea('DryMatter', 1),
          dryMatterDigestibility: realNumber(0.6),
          liveweight: mass('Liveweight', 60),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.05),
          standardReferenceWeight: mass('Liveweight', 70),
        },
      },
      wethers: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea('DryMatter', 3.2),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: mass('Liveweight', 60),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 3),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 55),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.05),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.13),
          dryMatterAvailability: massPerArea('DryMatter', 1.8),
          dryMatterDigestibility: realNumber(0.65),
          liveweight: mass('Liveweight', 52),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.03),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea('DryMatter', 1),
          dryMatterDigestibility: realNumber(0.6),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.02),
          standardReferenceWeight: mass('Liveweight', 60),
        },
      },
      maidenEwes: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea('DryMatter', 3.2),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.16),
          standardReferenceWeight: mass('Liveweight', 50),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 3),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 45),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.05),
          standardReferenceWeight: mass('Liveweight', 50),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.13),
          dryMatterAvailability: massPerArea('DryMatter', 1.8),
          dryMatterDigestibility: realNumber(0.65),
          liveweight: mass('Liveweight', 43),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.02),
          standardReferenceWeight: mass('Liveweight', 50),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea('DryMatter', 1),
          dryMatterDigestibility: realNumber(0.6),
          liveweight: mass('Liveweight', 40),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.03),
          standardReferenceWeight: mass('Liveweight', 50),
        },
      },
      breedingEwes: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea('DryMatter', 3.2),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: mass('Liveweight', 55),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
          standardReferenceWeight: mass('Liveweight', 50),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 3),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.05),
          standardReferenceWeight: mass('Liveweight', 50),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.13),
          dryMatterAvailability: massPerArea('DryMatter', 1.8),
          dryMatterDigestibility: realNumber(0.65),
          liveweight: mass('Liveweight', 48),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.02),
          standardReferenceWeight: mass('Liveweight', 50),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea('DryMatter', 1),
          dryMatterDigestibility: realNumber(0.6),
          liveweight: mass('Liveweight', 45),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.03),
          standardReferenceWeight: mass('Liveweight', 50),
        },
      },
      otherEwes: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea('DryMatter', 3.2),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 50),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 3),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 50),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.13),
          dryMatterAvailability: massPerArea('DryMatter', 1.8),
          dryMatterDigestibility: realNumber(0.65),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 50),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea('DryMatter', 1),
          dryMatterDigestibility: realNumber(0.6),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 50),
        },
      },
      lambsHoggets: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea('DryMatter', 3.2),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: mass('Liveweight', 22),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.15),
          standardReferenceWeight: mass('Liveweight', 55),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea('DryMatter', 3),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 28),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.07),
          standardReferenceWeight: mass('Liveweight', 56),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.13),
          dryMatterAvailability: massPerArea('DryMatter', 1.8),
          dryMatterDigestibility: realNumber(0.65),
          liveweight: mass('Liveweight', 33),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.05),
          standardReferenceWeight: mass('Liveweight', 57),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea('DryMatter', 1),
          dryMatterDigestibility: realNumber(0.6),
          liveweight: mass('Liveweight', 35),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.02),
          standardReferenceWeight: mass('Liveweight', 58),
        },
      },
    },
    WA: {
      rams: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
          dryMatterAvailability: massPerArea('DryMatter', 3.5),
          dryMatterDigestibility: realNumber(0.73),
          liveweight: mass('Liveweight', 75),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
          standardReferenceWeight: mass('Liveweight', 84),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.06),
          dryMatterAvailability: massPerArea('DryMatter', 1.5),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 65),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.11),
          standardReferenceWeight: mass('Liveweight', 84),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.06),
          dryMatterAvailability: massPerArea('DryMatter', 0.7),
          dryMatterDigestibility: realNumber(0.5),
          liveweight: mass('Liveweight', 65),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 84),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.21),
          dryMatterAvailability: massPerArea('DryMatter', 1.2),
          dryMatterDigestibility: realNumber(0.76),
          liveweight: mass('Liveweight', 65),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 84),
        },
      },
      wethers: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
          dryMatterAvailability: massPerArea('DryMatter', 3.5),
          dryMatterDigestibility: realNumber(0.73),
          liveweight: mass('Liveweight', 60),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.13),
          standardReferenceWeight: mass('Liveweight', 72),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.06),
          dryMatterAvailability: massPerArea('DryMatter', 1.5),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 55),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.05),
          standardReferenceWeight: mass('Liveweight', 72),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.06),
          dryMatterAvailability: massPerArea('DryMatter', 0.7),
          dryMatterDigestibility: realNumber(0.5),
          liveweight: mass('Liveweight', 48),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.08),
          standardReferenceWeight: mass('Liveweight', 72),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.21),
          dryMatterAvailability: massPerArea('DryMatter', 1.2),
          dryMatterDigestibility: realNumber(0.76),
          liveweight: mass('Liveweight', 48),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 72),
        },
      },
      maidenEwes: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
          dryMatterAvailability: massPerArea('DryMatter', 3.5),
          dryMatterDigestibility: realNumber(0.73),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.05),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.06),
          dryMatterAvailability: massPerArea('DryMatter', 1.5),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 45),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.05),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea('DryMatter', 0.7),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: mass('Liveweight', 40),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.21),
          dryMatterAvailability: massPerArea('DryMatter', 1.2),
          dryMatterDigestibility: realNumber(0.76),
          liveweight: mass('Liveweight', 45),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.05),
          standardReferenceWeight: mass('Liveweight', 60),
        },
      },
      breedingEwes: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
          dryMatterAvailability: massPerArea('DryMatter', 3.5),
          dryMatterDigestibility: realNumber(0.73),
          liveweight: mass('Liveweight', 55),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.05),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.06),
          dryMatterAvailability: massPerArea('DryMatter', 1.5),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.05),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea('DryMatter', 0.7),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: mass('Liveweight', 45),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.05),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.21),
          dryMatterAvailability: massPerArea('DryMatter', 1.2),
          dryMatterDigestibility: realNumber(0.76),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.05),
          standardReferenceWeight: mass('Liveweight', 60),
        },
      },
      otherEwes: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
          dryMatterAvailability: massPerArea('DryMatter', 3.5),
          dryMatterDigestibility: realNumber(0.73),
          liveweight: mass('Liveweight', 55),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.05),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.06),
          dryMatterAvailability: massPerArea('DryMatter', 1.5),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.05),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.06),
          dryMatterAvailability: massPerArea('DryMatter', 0.7),
          dryMatterDigestibility: realNumber(0.5),
          liveweight: mass('Liveweight', 45),
          liveweightGain: massPerHeadPerDay('Liveweight', -0.05),
          standardReferenceWeight: mass('Liveweight', 60),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.21),
          dryMatterAvailability: massPerArea('DryMatter', 1.2),
          dryMatterDigestibility: realNumber(0.76),
          liveweight: mass('Liveweight', 50),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.05),
          standardReferenceWeight: mass('Liveweight', 60),
        },
      },
      lambsHoggets: {
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
          dryMatterAvailability: massPerArea('DryMatter', 3.5),
          dryMatterDigestibility: realNumber(0.73),
          liveweight: mass('Liveweight', 30),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
          standardReferenceWeight: mass('Liveweight', 66),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.06),
          dryMatterAvailability: massPerArea('DryMatter', 1.5),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: mass('Liveweight', 30),
          liveweightGain: massPerHeadPerDay('Liveweight', 0),
          standardReferenceWeight: mass('Liveweight', 67),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea('DryMatter', 0.7),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: mass('Liveweight', 10),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
          standardReferenceWeight: mass('Liveweight', 68),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.21),
          dryMatterAvailability: massPerArea('DryMatter', 1.2),
          dryMatterDigestibility: realNumber(0.76),
          liveweight: mass('Liveweight', 20),
          liveweightGain: massPerHeadPerDay('Liveweight', 0.11),
          standardReferenceWeight: mass('Liveweight', 69),
        },
      },
    },
  },

  FEED_ADJUSTMENT: realNumber(1.3),

  ASH_CONTENT_OF_MANURE: realNumber(0.08),

  MMS: {
    ACT: {
      PRP: percentage(99.25),
      Lagoon: percentage(0.75),
    },
    NSW: {
      PRP: percentage(99.55),
      Lagoon: percentage(0.45),
    },
    QLD: {
      PRP: percentage(99.91),
      Lagoon: percentage(0.09),
    },
    SA: {
      PRP: percentage(99.74),
      Lagoon: percentage(0.26),
    },
    TAS: {
      PRP: percentage(99.5),
      Lagoon: percentage(0.5),
    },
    VIC: {
      PRP: percentage(99.17),
      Lagoon: percentage(0.83),
    },
    WA: {
      PRP: percentage(99.59),
      Lagoon: percentage(0.41),
    },
  },

  MCF_PRP: realNumber(0.0047),
  MCF_LAGOON: {
    ACT: realNumber(0.72),
    NSW: realNumber(0.75),
    QLD: realNumber(0.78),
    SA: realNumber(0.74),
    TAS: realNumber(0.69),
    VIC: realNumber(0.73),
    WA: realNumber(0.76),
  },
};

export const lulucfConstants: LULUCFConstants = {
  name: 'LULUCF',

  ORGANIC_STOCK_LOSS_FACTORS: {
    'Arnhem Coast': tonnesCarbonPerHectare(-0.12),
    'Arnhem Plateau': tonnesCarbonPerHectare(-0.39),
    'Australian Alps': tonnesCarbonPerHectare(-0.09),
    'Avon Wheatbelt': tonnesCarbonPerHectare(-0.09),
    'Brigalow Belt North': tonnesCarbonPerHectare(-0.13),
    'Brigalow Belt South': tonnesCarbonPerHectare(-0.13),
    'Ben Lomond': tonnesCarbonPerHectare(-0.55),
    'Broken Hill Complex': tonnesCarbonPerHectare(-0.01),
    'Burt Plain': tonnesCarbonPerHectare(-0.07),
    Carnarvon: tonnesCarbonPerHectare(-0.06),
    'Central Arnhem': tonnesCarbonPerHectare(-0.09),
    'Central Kimberley': tonnesCarbonPerHectare(-0.19),
    'Central Ranges': tonnesCarbonPerHectare(-0.13),
    'Channel Country': tonnesCarbonPerHectare(-0.04),
    'Central Mackay Coast': tonnesCarbonPerHectare(-0.4),
    Coolgardie: tonnesCarbonPerHectare(-0.09),
    'Cobar Peneplain': tonnesCarbonPerHectare(0),
    'Cape York Peninsula': tonnesCarbonPerHectare(-0.44),
    'Daly Basin': tonnesCarbonPerHectare(-0.21),
    'Darwin Coastal': tonnesCarbonPerHectare(-0.21),
    Dampierland: tonnesCarbonPerHectare(0),
    'Desert Uplands': tonnesCarbonPerHectare(-0.04),
    'Davenport Murchison Ranges': tonnesCarbonPerHectare(-0.07),
    'Darling Riverine Plains': tonnesCarbonPerHectare(-0.04),
    'Einasleigh Uplands': tonnesCarbonPerHectare(-0.24),
    'Esperance Plains': tonnesCarbonPerHectare(-0.17),
    'Eyre Yorke Block': tonnesCarbonPerHectare(-0.03),
    Finke: tonnesCarbonPerHectare(-0.06),
    'Flinders Lofty Block': tonnesCarbonPerHectare(-0.02),
    Furneaux: tonnesCarbonPerHectare(-0.43),
    Gascoyne: tonnesCarbonPerHectare(-0.14),
    Gawler: tonnesCarbonPerHectare(0),
    'Geraldton Sandplains': tonnesCarbonPerHectare(-0.12),
    'Gulf Fall and Uplands': tonnesCarbonPerHectare(-0.13),
    'Gibson Desert': tonnesCarbonPerHectare(-0.16),
    'Great Sandy Desert': tonnesCarbonPerHectare(-0.09),
    'Gulf Coastal': tonnesCarbonPerHectare(0),
    'Gulf Plains': tonnesCarbonPerHectare(-0.04),
    'Great Victoria Desert': tonnesCarbonPerHectare(-0.03),
    Hampton: tonnesCarbonPerHectare(-0.14),
    'Jarrah Forest': tonnesCarbonPerHectare(-0.31),
    Kanmantoo: tonnesCarbonPerHectare(-0.23),
    King: tonnesCarbonPerHectare(-0.17),
    'Little Sandy Desert': tonnesCarbonPerHectare(-0.17),
    'MacDonnell Ranges': tonnesCarbonPerHectare(-0.08),
    Mallee: tonnesCarbonPerHectare(-0.11),
    'Murray Darling Depression': tonnesCarbonPerHectare(0),
    'Mitchell Grass Downs': tonnesCarbonPerHectare(-0.02),
    'Mount Isa Inlier': tonnesCarbonPerHectare(-0.08),
    'Mulga Lands': tonnesCarbonPerHectare(-0.06),
    Murchison: tonnesCarbonPerHectare(-0.12),
    Nandewar: tonnesCarbonPerHectare(-0.07),
    'Naracoorte Coastal Plain': tonnesCarbonPerHectare(-0.13),
    'New England Tablelands': tonnesCarbonPerHectare(0),
    'NSW North Coast': tonnesCarbonPerHectare(-0.24),
    'Northern Kimberley': tonnesCarbonPerHectare(-0.32),
    'NSW South Western Slopes': tonnesCarbonPerHectare(0),
    Nullarbor: tonnesCarbonPerHectare(0),
    'Ord Victoria Plain': tonnesCarbonPerHectare(-0.1),
    'Pine Creek': tonnesCarbonPerHectare(-0.33),
    Pilbara: tonnesCarbonPerHectare(0),
    Riverina: tonnesCarbonPerHectare(-0.05),
    'South East Coastal Plain': tonnesCarbonPerHectare(-0.26),
    'South East Corner': tonnesCarbonPerHectare(-0.26),
    'South Eastern Highlands': tonnesCarbonPerHectare(-0.03),
    'South Eastern Queensland': tonnesCarbonPerHectare(-0.37),
    'Simpson Strzelecki Dunefields': tonnesCarbonPerHectare(-0.01),
    'Stony Plains': tonnesCarbonPerHectare(-0.03),
    'Sturt Plateau': tonnesCarbonPerHectare(-0.1),
    'Southern Volcanic Plain': tonnesCarbonPerHectare(-0.25),
    'Swan Coastal Plain': tonnesCarbonPerHectare(-0.27),
    'Sydney Basin': tonnesCarbonPerHectare(-0.18),
    Tanami: tonnesCarbonPerHectare(-0.12),
    'Tasmanian Central Highlands': tonnesCarbonPerHectare(-0.22),
    'Tiwi Cobourg': tonnesCarbonPerHectare(-0.2),
    'Tasmanian Northern Midlands': tonnesCarbonPerHectare(-0.18),
    'Tasmanian Northern Slopes': tonnesCarbonPerHectare(-0.4),
    'Tasmanian South East': tonnesCarbonPerHectare(-0.21),
    'Tasmanian Southern Ranges': tonnesCarbonPerHectare(-0.39),
    'Tasmanian West': tonnesCarbonPerHectare(-0.69),
    'Victoria Bonaparte': tonnesCarbonPerHectare(0),
    'Victorian Midlands': tonnesCarbonPerHectare(-0.07),
    Warren: tonnesCarbonPerHectare(-0.57),
    'Wet Tropics': tonnesCarbonPerHectare(-0.67),
    Yalgoo: tonnesCarbonPerHectare(-0.05),
  },

  CARBON_TO_NITROGEN_RATIO: massPerMass('Carbon', 'N', 18),

  EF_CROP: {
    high: massPerMass('N2O', 'N', 0.008),
    low: massPerMass('N2O', 'N', 0.0029),
  },
  EF_PASTURE: massPerMass('N2O', 'N', 0.0018),

  WOODY_PERENNIAL_CROPS_FULL: {
    Oranges: {
      BAMc: tonnesCarbonPerHectare(5),
      Mc: years(10),
      BARc: tonnesCarbonPerHectarePerYear(0.5),
      STEM_DENSITY: countPerArea('Trees', perHectareToPerSqMetre(417)),
    },
    Macadamias: {
      BAMc: tonnesCarbonPerHectare(12.3),
      Mc: years(15),
      BARc: tonnesCarbonPerHectarePerYear(0.82),
      STEM_DENSITY: countPerArea('Trees', perHectareToPerSqMetre(312)),
    },
    Almonds: {
      BAMc: tonnesCarbonPerHectare(9.6),
      Mc: years(8),
      BARc: tonnesCarbonPerHectarePerYear(1.2),
      STEM_DENSITY: countPerArea('Trees', perHectareToPerSqMetre(222)),
    },
    Apples: {
      BAMc: tonnesCarbonPerHectare(4.9),
      Mc: years(7),
      BARc: tonnesCarbonPerHectarePerYear(0.7),
      STEM_DENSITY: countPerArea('Trees', perHectareToPerSqMetre(1500)),
    },
    Peaches: {
      BAMc: tonnesCarbonPerHectare(5.2),
      Mc: years(4),
      BARc: tonnesCarbonPerHectarePerYear(1.3),
      STEM_DENSITY: countPerArea('Trees', perHectareToPerSqMetre(740)),
    },
    Olives: {
      BAMc: tonnesCarbonPerHectare(6.7),
      Mc: years(10),
      BARc: tonnesCarbonPerHectarePerYear(0.67),
      STEM_DENSITY: countPerArea('Trees', perHectareToPerSqMetre(250)),
    },
    Avocados: {
      BAMc: tonnesCarbonPerHectare(6.0),
      Mc: years(10),
      BARc: tonnesCarbonPerHectarePerYear(0.6),
      STEM_DENSITY: countPerArea('Trees', perHectareToPerSqMetre(210)),
    },
    Mangoes: {
      BAMc: tonnesCarbonPerHectare(13.0),
      Mc: years(10),
      BARc: tonnesCarbonPerHectarePerYear(1.3),
      STEM_DENSITY: countPerArea('Trees', perHectareToPerSqMetre(185)),
    },
  },
  WOODY_PERENNIAL_CROPS_PARTIAL: {
    Grapes: {
      BAMc: tonnesCarbonPerHectare(1.2),
      Mc: years(4),
      BARc: tonnesCarbonPerHectarePerYear(0.3),
    },
    Kiwifruits: {
      BAMc: tonnesCarbonPerHectare(1.5),
      Mc: years(5),
      BARc: tonnesCarbonPerHectarePerYear(0.3),
    },
  },
};
