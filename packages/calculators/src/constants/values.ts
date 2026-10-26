import { daysInYear } from '@/tools/sentinels';
import {
  cubicMetresToLitres,
  gjPerCubicMetreToJPerLitre,
  gjPerKlToJPerLitre,
  gjPerTonneToJPerKg,
  gramsToKg,
  megaJoulesToJoules,
  perCubicMetresToPerLitres,
  perGjToPerJ,
  perHectareToPerSqMetre,
  perKilometreToPerMetre,
  tonnesPerHectareToKgPerSquareMetres,
} from '@/tools/unit-conversion';
import {
  countPerArea,
  days,
  energyPerMass,
  energyPerVolume,
  liveweight,
  liveweightGain,
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
  massPerVolume,
  percentage,
  RealNumber,
  realNumber,
  volumePerMass,
  years,
} from '@/tools/units';
import { MeanAnnualTemperature, State } from './enums';
import * as ngaf from './ngaf/2026.json';
import {
  AquacultureConstants,
  BeefPastureConstants,
  CommonConstants,
  CropConstants,
  DairyConstants,
  FeedlotConstants,
  LivestockConstants,
  LULUCFConstants,
  PigsConstants,
  PoultryConstants,
  RiceConstants,
  SheepConstants,
} from './types';

const ngaf2026 = ngaf.tables;
const ngafElectricityData = ngaf2026['Table 1'].table;
const ngafTransportFuelData = ngaf2026['Table 9'].table;

const allStatesWithValue = (rawValue: number): Record<State, RealNumber> => {
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

const freightEmissions = (tCO2ePerTKm: number) =>
  massPerMassDistance(
    'CO2e',
    'Freight Goods',
    perKilometreToPerMetre(tCO2ePerTKm),
  );

export const commonConstants: CommonConstants = {
  name: 'COMMON',

  /**
   * @description The percentage of total charge leaked from appliance each year
   * @ngaf2024 Table 10
   * @units percentage
   */
  REFRIGERATION_LEAKAGE_RATES: {
    'Domestic refrigerators': percentage(1.7),
    'Transport refrigeration': percentage(15.7),
    'Domestic A/C portable': percentage(2.5),
    'Domestic A/C split': percentage(3.5),
    'Domestic A/C packaged': percentage(2.5),
    'Light vehicle A/C': percentage(6.7),
    'Heavy vehicle A/C': percentage(10.8),
  },

  /**
   * See GWP sheet of workbook 9-refrigerant-use.xlsx for details of how these were calculated.
   * Some blends from table 24 were not included if some components had GWP values that could not be found in other references.
   *
   * @description Global warming potential of refrigerants, in kg CO2-e/kg refrigerant
   * @ngaf2024 Table 23 and 24
   * @units kg CO2-e/kg
   */
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
   * @description Carbon emission factor for urea-based fertilisers - converted to CO2 via
   * ELEMENTAL_TO_MOLECULAR_CO2 by the consuming calculation, not applied directly as CO2-e.
   * @units kg C/kg urea
   * @nir2024Vol1 Chapter 5.9.2
   */
  EF_CONVERSION_UREA_TO_CO2: massPerMass('Carbon', 'Urea', 0.2),

  /**
   * @description Conversion factor for elemental to molecular CO2
   * @nir2024Vol2 Annex VII Conversion factors
   */
  ELEMENTAL_TO_MOLECULAR_CO2: massPerMass('CO2', 'Carbon', 44 / 12),
  /**
   * @description Conversion factor for elemental to molecular CH4
   * @nir2024Vol2 Annex VII Conversion factors
   */
  ELEMENTAL_TO_MOLECULAR_CH4: massPerMass('CH4', 'Carbon', 16 / 12),

  /**
   * @description Conversion factor for elemental to molecular N2O
   * @nir2024Vol2 Annex VII Conversion factors
   */
  ELEMENTAL_TO_MOLECULAR_N2O: massPerMass('N2O', 'N2O', 44 / 28),

  /**
   * @description Density of methane
   * @units kg/m3
   * @reference National Greenhouse and Energy Reporting (Measurement) Determination 2008 [7]
   */
  DENSITY_OF_METHANE: massPerVolume(
    'CH4',
    'CH4',
    perCubicMetresToPerLitres(0.6784),
  ),

  /**
   * @description Scope 3 emission factor for soil ameliorants. Taken from AusLCI V48 March 2026
   */
  LIME_SCOPE3_EF: {
    Limestone: massPerMass('CO2e', 'Lime', 0.0485),
    Dolomite: massPerMass('CO2e', 'Lime', 0.0652),
    Gypsum: massPerMass('CO2e', 'Lime', 0.0652),
  },

  /**
   * @description Scope 1 values relating to liming
   * @nir2024Vol1 5.8.2
   * @reference Mudahar, M.S., Hignett, T.P., 1982. Energy and Fertilizer-- Policy Implications and Options for Developing Countries. International Fertilizer Development Center, Muscle Shoals, Alabama
   */
  LIMING: {
    /** @type Proportion */
    LIMESTONE_PURITY: realNumber(0.9),
    LIMESTONE_EF: massPerMass('Carbon', 'Lime', 0.12),
    /** @type Proportion */
    DOLOMITE_PURITY: realNumber(0.95),
    DOLOMITE_EF: massPerMass('Carbon', 'Lime', 0.13),
  },

  /**
   * @description Emission factors from the production of components in agrichemicals
   * @units kg CO2-e/kg input
   * @appendixA A.3.1.4
   * @reference AusLCI Lifecycles GHG Emission Intensities for Material Inputs to AUS Ag Fisheries Forestry V48 (March 2026)
   */
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
   * @ngaf2024 Table 1
   * @units kg CO2-e/kWh
   */
  ELECTRICITY: {
    NSW: {
      SCOPE2_EF: massPerElectricity(
        'CO2e',
        ngafElectricityData['New South Wales and Australian Capital Territory']
          .SCOPE_2,
      ),
      SCOPE3_EF: massPerElectricity(
        'CO2e',
        ngafElectricityData['New South Wales and Australian Capital Territory']
          .SCOPE_3,
      ),
    },
    ACT: {
      SCOPE2_EF: massPerElectricity(
        'CO2e',
        ngafElectricityData['New South Wales and Australian Capital Territory']
          .SCOPE_2,
      ),
      SCOPE3_EF: massPerElectricity(
        'CO2e',
        ngafElectricityData['New South Wales and Australian Capital Territory']
          .SCOPE_3,
      ),
    },
    VIC: {
      SCOPE2_EF: massPerElectricity(
        'CO2e',
        ngafElectricityData.Victoria.SCOPE_2,
      ),
      SCOPE3_EF: massPerElectricity(
        'CO2e',
        ngafElectricityData.Victoria.SCOPE_3,
      ),
    },
    QLD: {
      SCOPE2_EF: massPerElectricity(
        'CO2e',
        ngafElectricityData.Queensland.SCOPE_2,
      ),
      SCOPE3_EF: massPerElectricity(
        'CO2e',
        ngafElectricityData.Queensland.SCOPE_3,
      ),
    },
    SA: {
      SCOPE2_EF: massPerElectricity(
        'CO2e',
        ngafElectricityData['South Australia'].SCOPE_2,
      ),
      SCOPE3_EF: massPerElectricity(
        'CO2e',
        ngafElectricityData['South Australia'].SCOPE_3,
      ),
    },
    WA_SW: {
      SCOPE2_EF: massPerElectricity(
        'CO2e',
        ngafElectricityData[
          'Western Australia - South West Interconnected System (SWIS)'
        ].SCOPE_2,
      ),
      SCOPE3_EF: massPerElectricity(
        'CO2e',
        ngafElectricityData[
          'Western Australia - South West Interconnected System (SWIS)'
        ].SCOPE_3,
      ),
    },
    WA_NW: {
      SCOPE2_EF: massPerElectricity(
        'CO2e',
        ngafElectricityData[
          'Western Australia - North Western Interconnected System (NWIS)'
        ].SCOPE_2,
      ),
      SCOPE3_EF: massPerElectricity(
        'CO2e',
        ngafElectricityData[
          'Western Australia - North Western Interconnected System (NWIS)'
        ].SCOPE_3,
      ),
    },
    TAS: {
      SCOPE2_EF: massPerElectricity(
        'CO2e',
        ngafElectricityData.Tasmania.SCOPE_2,
      ),
      SCOPE3_EF: massPerElectricity(
        'CO2e',
        ngafElectricityData.Tasmania.SCOPE_3,
      ),
    },
    NT: {
      SCOPE2_EF: massPerElectricity(
        'CO2e',
        ngafElectricityData[
          'Northern territory - Darwin Katherine Interconnected System (DKIS)'
        ].SCOPE_2,
      ),
      SCOPE3_EF: massPerElectricity(
        'CO2e',
        ngafElectricityData[
          'Northern territory - Darwin Katherine Interconnected System (DKIS)'
        ].SCOPE_3,
      ),
    },
    National: {
      SCOPE2_EF: massPerElectricity(
        'CO2e',
        ngaf2026['Table 1'].table.National.SCOPE_2,
      ),
      SCOPE3_EF: massPerElectricity(
        'CO2e',
        ngaf2026['Table 1'].table.National.SCOPE_3,
      ),
    },
  },

  /**
   * @description Electricity scope 2 emission factors for Renewable Energy Market Framework (RMF) in kg CO2-e/kWh
   * @ngaf2024 Table 2
   * @units kg CO2-e/kWh
   */
  ELECTRICITY_RMF_SCOPE2_EF: massPerElectricity(
    'CO2e',
    ngaf2026['Table 2'].table.National.SCOPE_2,
  ),
  /**
   * @description Electricity scope 3 emission factors for Renewable Energy Market Framework (RMF) in kg CO2-e/kWh
   * @ngaf2024 Table 2
   * @units kg CO2-e/kWh
   */
  ELECTRICITY_RMF_SCOPE3_EF: massPerElectricity(
    'CO2e',
    ngaf2026['Table 2'].table.National.SCOPE_3,
  ),

  /**
   * @description Renewable power percentage for the Renewable Energy Target (RET) in Australia (value for 2026)
   * @link https://cer.gov.au/schemes/renewable-energy-target/renewable-energy-target-liability-and-exemptions/renewable-power-percentage
   */
  RENEWABLE_POWER_PERCENTAGE: percentage(16.67),

  /**
   * @description Jurisdictional renewable power percentage for the Renewable Energy Target (RET) in Australia
   * @ngaf2024 Calculating emissions from electricity purchased or acquired using the market-based method
   */
  JURISDICTIONAL_RENEWABLE_POWER_PERCENTAGE: percentage(79.51), // 2024

  /**
   * @description Transport fuel emission factors for each fuel type, in kg CO2-e/GJ
   * @ngaf2024 Table 9
   * @appendixA Table A.4.2.1 (Off-road equipment & vessels)
   * @units ENERGY_CONTENT is in J/m^3, other values are in kg CO2-e/GJ
   */
  TRANSPORT_FUEL_FACTORS: {
    /**
     * NOTE:
     * The pre-2004 figures for cars/light commercial vehicles are the usual figures for
     * these vehicles, with some deviations applied.
     *
     * These deviations are detailed under Table 9, but aren't available in the excel
     * extracts:
     *
     * "For vehicles manufactured prior to 2004, the following scope 1 emission factors
     * (in kg CO2-e/GJ) should be used instead of those presented in Table 9:
     * - Gasoline CH4 =0.6, N2O = 1.6,
     * - Diesel oil CH4 =0.1, N2O = 0.4,
     * - LPG CH4 =0.7, N2O = 0.6,
     * - Ethanol CH4= 0.8, N2O = 1.7,
     * - Renewable diesel CH4 = 0.1, N2O = 0.4."
     */
    'Cars and light commercial vehicles (pre 2004)': {
      Gasoline: {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData[
              'Cars and light commercial vehicles, Gasoline'
            ].ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Gasoline'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.6)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(1.6)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(69.6)),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData[
              'Cars and light commercial vehicles, Gasoline'
            ].SCOPE_3,
          ),
        ),
      },
      'Diesel oil': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData[
              'Cars and light commercial vehicles, Diesel oil'
            ].ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Diesel oil'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.1)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.4)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(70.4)),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData[
              'Cars and light commercial vehicles, Diesel oil'
            ].SCOPE_3,
          ),
        ),
      },
      'Liquefied petroleum gas (LPG)': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData[
              'Cars and light commercial vehicles, Liquefied petroleum gas (LPG)'
            ].ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Liquefied petroleum gas (LPG)'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.7)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.6)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(61.5)),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData[
              'Cars and light commercial vehicles, Liquefied petroleum gas (LPG)'
            ].SCOPE_3,
          ),
        ),
      },
      Ethanol: {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData['Cars and light commercial vehicles, Ethanol']
              .ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Ethanol'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.8)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(1.7)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(2.5)),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData['Cars and light commercial vehicles, Ethanol']
              .SCOPE_3,
          ),
        ),
      },
      'Renewable diesel': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData[
              'Cars and light commercial vehicles, Renewable diesel'
            ].ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Renewable diesel'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.01)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.5)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(0.51)),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData[
              'Cars and light commercial vehicles, Renewable diesel'
            ].SCOPE_3,
          ),
        ),
      },
    },
    'Cars and light commercial vehicles': {
      Gasoline: {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData[
              'Cars and light commercial vehicles, Gasoline'
            ].ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Gasoline'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Gasoline'
              ].CH4,
            ),
          ),
          N2O: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Gasoline'
              ].N2O,
            ),
          ),
          CO2e: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Gasoline'
              ].COMBINED,
            ),
          ),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(17.2)),
      },
      'Diesel oil': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData[
              'Cars and light commercial vehicles, Diesel oil'
            ].ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Diesel oil'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Diesel oil'
              ].CH4,
            ),
          ),
          N2O: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Diesel oil'
              ].N2O,
            ),
          ),
          CO2e: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Diesel oil'
              ].COMBINED,
            ),
          ),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData[
              'Cars and light commercial vehicles, Diesel oil'
            ].SCOPE_3,
          ),
        ),
      },
      'Liquefied petroleum gas (LPG)': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData[
              'Cars and light commercial vehicles, Liquefied petroleum gas (LPG)'
            ].ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Liquefied petroleum gas (LPG)'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Liquefied petroleum gas (LPG)'
              ].CH4,
            ),
          ),
          N2O: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Liquefied petroleum gas (LPG)'
              ].N2O,
            ),
          ),
          CO2e: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Liquefied petroleum gas (LPG)'
              ].COMBINED,
            ),
          ),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData[
              'Cars and light commercial vehicles, Liquefied petroleum gas (LPG)'
            ].SCOPE_3,
          ),
        ),
      },
      'Fuel oil': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData[
              'Cars and light commercial vehicles, Fuel oil'
            ].ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Fuel oil'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Fuel oil'
              ].CH4,
            ),
          ),
          N2O: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Fuel oil'
              ].N2O,
            ),
          ),
          CO2e: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Fuel oil'
              ].COMBINED,
            ),
          ),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData[
              'Cars and light commercial vehicles, Fuel oil'
            ].SCOPE_3,
          ),
        ),
      },
      Ethanol: {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData['Cars and light commercial vehicles, Ethanol']
              .ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Ethanol'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Ethanol'
              ].CH4,
            ),
          ),
          N2O: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Ethanol'
              ].N2O,
            ),
          ),
          CO2e: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Ethanol'
              ].COMBINED,
            ),
          ),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData['Cars and light commercial vehicles, Ethanol']
              .SCOPE_3,
          ),
        ),
      },
      Biodiesel: {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData[
              'Cars and light commercial vehicles, Biodiesel'
            ].ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Biodiesel'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Biodiesel'
              ].CH4,
            ),
          ),
          N2O: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Biodiesel'
              ].N2O,
            ),
          ),
          CO2e: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Biodiesel'
              ].COMBINED,
            ),
          ),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData[
              'Cars and light commercial vehicles, Biodiesel'
            ].SCOPE_3,
          ),
        ),
      },
      'Renewable diesel': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData[
              'Cars and light commercial vehicles, Renewable diesel'
            ].ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Renewable diesel'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Renewable diesel'
              ].CH4,
            ),
          ),
          N2O: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Renewable diesel'
              ].N2O,
            ),
          ),
          CO2e: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Renewable diesel'
              ].COMBINED,
            ),
          ),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData[
              'Cars and light commercial vehicles, Renewable diesel'
            ].SCOPE_3,
          ),
        ), // NE
      },
      'Other biofuels': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData[
              'Cars and light commercial vehicles, Other biofuels'
            ].ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Other biofuels'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Other biofuels'
              ].CH4,
            ),
          ),
          N2O: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Other biofuels'
              ].N2O,
            ),
          ),
          CO2e: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Cars and light commercial vehicles, Other biofuels'
              ].COMBINED,
            ),
          ),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData[
              'Cars and light commercial vehicles, Other biofuels'
            ].SCOPE_3,
          ),
        ),
      },
    },
    'Light duty vehicles': {
      'Compressed natural gas': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerCubicMetreToJPerLitre(
            ngafTransportFuelData['Light duty vehicles, Compressed natural gas']
              .ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Light duty vehicles, Compressed natural gas'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Light duty vehicles, Compressed natural gas'
              ].CH4,
            ),
          ),
          N2O: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Light duty vehicles, Compressed natural gas'
              ].N2O,
            ),
          ),
          CO2e: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Light duty vehicles, Compressed natural gas'
              ].COMBINED,
            ),
          ),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData['Light duty vehicles, Compressed natural gas']
              .SCOPE_3,
          ),
        ),
      },
      'Liquefied natural gas': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData['Light duty vehicles, Liquefied natural gas']
              .ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Light duty vehicles, Liquefied natural gas'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Light duty vehicles, Liquefied natural gas'
              ].CH4,
            ),
          ),
          N2O: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Light duty vehicles, Liquefied natural gas'
              ].N2O,
            ),
          ),
          CO2e: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Light duty vehicles, Liquefied natural gas'
              ].COMBINED,
            ),
          ),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData['Light duty vehicles, Liquefied natural gas']
              .SCOPE_3,
          ),
        ),
      },
    },
    'Heavy duty vehicles': {
      'Compressed natural gas': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerCubicMetreToJPerLitre(
            ngafTransportFuelData['Heavy duty vehicles, Compressed natural gas']
              .ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Compressed natural gas'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Compressed natural gas'
              ].CH4,
            ),
          ),
          N2O: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Compressed natural gas'
              ].N2O,
            ),
          ),
          CO2e: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Compressed natural gas'
              ].COMBINED,
            ),
          ),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData['Heavy duty vehicles, Compressed natural gas']
              .SCOPE_3,
          ),
        ),
      },
      'Liquefied natural gas': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData['Heavy duty vehicles, Liquefied natural gas']
              .ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Liquefied natural gas'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Liquefied natural gas'
              ].CH4,
            ),
          ),
          N2O: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Liquefied natural gas'
              ].N2O,
            ),
          ),
          CO2e: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Liquefied natural gas'
              ].COMBINED,
            ),
          ),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData['Heavy duty vehicles, Liquefied natural gas']
              .SCOPE_3,
          ),
        ),
      },
      'Diesel oil - Euro iv or higher': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData[
              'Heavy duty vehicles, Diesel oil - Euro iv or higher'
            ].ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Diesel oil - Euro iv or higher'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Diesel oil - Euro iv or higher'
              ].CH4,
            ),
          ),
          N2O: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Diesel oil - Euro iv or higher'
              ].N2O,
            ),
          ),
          CO2e: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Diesel oil - Euro iv or higher'
              ].COMBINED,
            ),
          ),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData[
              'Heavy duty vehicles, Diesel oil - Euro iv or higher'
            ].SCOPE_3,
          ),
        ),
      },
      'Diesel oil - Euro iii': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData['Heavy duty vehicles, Diesel oil - Euro iii']
              .ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Diesel oil - Euro iii'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Diesel oil - Euro iii'
              ].CH4,
            ),
          ),
          N2O: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Diesel oil - Euro iii'
              ].N2O,
            ),
          ),
          CO2e: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Diesel oil - Euro iii'
              ].COMBINED,
            ),
          ),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData['Heavy duty vehicles, Diesel oil - Euro iii']
              .SCOPE_3,
          ),
        ),
      },
      'Diesel oil - Euro i': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData['Heavy duty vehicles, Diesel oil - Euro i']
              .ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData['Heavy duty vehicles, Diesel oil - Euro i']
                .CO2,
            ),
          ),
          CH4: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData['Heavy duty vehicles, Diesel oil - Euro i']
                .CH4,
            ),
          ),
          N2O: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData['Heavy duty vehicles, Diesel oil - Euro i']
                .N2O,
            ),
          ),
          CO2e: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData['Heavy duty vehicles, Diesel oil - Euro i']
                .COMBINED,
            ),
          ),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData['Heavy duty vehicles, Diesel oil - Euro i']
              .SCOPE_3,
          ),
        ),
      },
      'Renewable diesel - Euro iv or higher': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData[
              'Heavy duty vehicles, Renewable diesel - Euro iv or higher'
            ].ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Renewable diesel - Euro iv or higher'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Renewable diesel - Euro iv or higher'
              ].CH4,
            ),
          ),
          N2O: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Renewable diesel - Euro iv or higher'
              ].N2O,
            ),
          ),
          CO2e: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Renewable diesel - Euro iv or higher'
              ].COMBINED,
            ),
          ),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData[
              'Heavy duty vehicles, Renewable diesel - Euro iv or higher'
            ].SCOPE_3,
          ),
        ),
      },
      'Renewable diesel - Euro iii': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData[
              'Heavy duty vehicles, Renewable diesel - Euro iii'
            ].ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Renewable diesel - Euro iii'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Renewable diesel - Euro iii'
              ].CH4,
            ),
          ),
          N2O: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Renewable diesel - Euro iii'
              ].N2O,
            ),
          ),
          CO2e: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Renewable diesel - Euro iii'
              ].COMBINED,
            ),
          ),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData[
              'Heavy duty vehicles, Renewable diesel - Euro iii'
            ].SCOPE_3,
          ),
        ),
      },
      'Renewable diesel - Euro i': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData[
              'Heavy duty vehicles, Renewable diesel - Euro i'
            ].ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Renewable diesel - Euro i'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Renewable diesel - Euro i'
              ].CH4,
            ),
          ),
          N2O: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Renewable diesel - Euro i'
              ].N2O,
            ),
          ),
          CO2e: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Heavy duty vehicles, Renewable diesel - Euro i'
              ].COMBINED,
            ),
          ),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData[
              'Heavy duty vehicles, Renewable diesel - Euro i'
            ].SCOPE_3,
          ),
        ),
      },
    },
    Aviation: {
      'Gasoline for use as fuel in an aircraft': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData[
              'Aviation, Gasoline for use as fuel in an aircraft'
            ].ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Aviation, Gasoline for use as fuel in an aircraft'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Aviation, Gasoline for use as fuel in an aircraft'
              ].CH4,
            ),
          ),
          N2O: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Aviation, Gasoline for use as fuel in an aircraft'
              ].N2O,
            ),
          ),
          CO2e: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Aviation, Gasoline for use as fuel in an aircraft'
              ].COMBINED,
            ),
          ),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData[
              'Aviation, Gasoline for use as fuel in an aircraft'
            ].SCOPE_3,
          ),
        ),
      },
      'Kerosene for use as fuel in an aircraft': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData[
              'Aviation, Kerosene for use as fuel in an aircraft'
            ].ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Aviation, Kerosene for use as fuel in an aircraft'
              ].CO2,
            ),
          ),
          CH4: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Aviation, Kerosene for use as fuel in an aircraft'
              ].CH4,
            ),
          ),
          N2O: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Aviation, Kerosene for use as fuel in an aircraft'
              ].N2O,
            ),
          ),
          CO2e: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData[
                'Aviation, Kerosene for use as fuel in an aircraft'
              ].COMBINED,
            ),
          ),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData[
              'Aviation, Kerosene for use as fuel in an aircraft'
            ].SCOPE_3,
          ),
        ),
      },
      'Renewable aviation kerosene': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(
            ngafTransportFuelData['Aviation, Renewable aviation kerosene']
              .ENERGY_CONTENT,
          ),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData['Aviation, Renewable aviation kerosene']
                .CO2,
            ),
          ),
          CH4: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData['Aviation, Renewable aviation kerosene']
                .CH4,
            ),
          ),
          N2O: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData['Aviation, Renewable aviation kerosene']
                .N2O,
            ),
          ),
          CO2e: massPerEnergy(
            'CO2e',
            perGjToPerJ(
              ngafTransportFuelData['Aviation, Renewable aviation kerosene']
                .COMBINED,
            ),
          ),
        },
        SCOPE3_EF: massPerEnergy(
          'CO2e',
          perGjToPerJ(
            ngafTransportFuelData['Aviation, Renewable aviation kerosene']
              .SCOPE_3,
          ),
        ),
      },
    },
    Vessel: {
      Petrol: {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(34.2),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(67.4)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(10.1)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.3)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(77.8)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(17.2)),
      },
      Diesel: {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(38.6),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(69.9)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.5)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(70.6)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(17.3)),
      },
      'Fuel Oil': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(39.7),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(73.6)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.5)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(74.3)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(18.0)),
      },
    },
    'Off-road Agriculture and forestry equipment': {
      Diesel: {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(38.6),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(69.9)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.3)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.5)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(70.7)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(17.3)),
      },
    },
  },

  /**
   * @description Stationary fuel emission factors for each solid fuel type by mass, in kg CO2-e/GJ
   * @ngaf2024 Table 4
   * @units kg CO2-e/GJ
   */
  STATIONARY_FUEL_FACTORS_BY_MASS: {
    // NGAF table 4
    'Solid fuels': {
      'Bituminous coal': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(27)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(90)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.04)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(90.24)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(3)),
      },
      'Sub-bituminous coal': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(21)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(90)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.04)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(90.24)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(2.5)),
      },
      Anthracite: {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(29)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(90)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.04)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(90.24)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(0)),
      },
      'Brown coal (lignite)': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(10.2)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(93.5)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.02)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.3)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(93.82)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(0.4)),
      },
      'Coking coal': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(30)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(91.8)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.03)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(92.03)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(6.4)),
      },
      'Coal briquettes': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(22.1)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(95)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.08)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.3)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(95.38)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(0)),
      },
      'Coal coke': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(27)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(107)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.03)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(107.23)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(0)),
      },
      'Coal tar': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(37.5)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(81.8)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.03)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(82.03)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(0)),
      },
      'Other solid fossil fuels': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(22.1)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(95)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.08)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(95.28)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(0)),
      },
      'Industrial materials derived from fossil fuels': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(26.3)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(81.6)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.03)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(81.83)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(0)),
      },
      'Passenger car tyres': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(32)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(62.8)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.03)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(63.03)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(0)),
      },
      'Truck and off-road tyres': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(27.1)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(55.9)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.03)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(56.13)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(0)),
      },
      'Non-biomass municipal materials': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(10.5)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(87.1)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.8)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(1)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(88.9)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(0)),
      },
      'Dry wood': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(16.2)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(0)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.1)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(1.1)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(1.2)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(0)),
      },
      'Green and air dried wood': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(10.4)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(0)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.1)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(1.1)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(1.2)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(0)),
      },
      'Sulphite lyes': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(12.4)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(0)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.08)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.5)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(0.58)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(0)),
      },
      Bagasse: {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(9.6)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(0)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.3)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(1.1)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(1.4)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(0)),
      },
      'Biomass,  municipal and industrial materials': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(12.2)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(0)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.8)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(1)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(1.8)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(0)),
      },
      Charcoal: {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(31.1)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(0)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(5.3)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(1)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(6.3)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(0)),
      },
      'Other primary solid biomass fuels': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(12.2)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(0)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.8)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(1)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(1.8)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(0)),
      },
    },

    // NGAF Table 8
    'Liquid fuels': {
      'Crude oil and condensates': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(45.3)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(69.6)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.08)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(69.88)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(0)), // N)E
      },
      'Other natural gas liquids': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(46.5)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(61.0)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.08)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(61.28)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(0)), // N)E
      },

      'Petroleum coke': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(34.2)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(92.6)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.08)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(92.88)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(18.0)),
      },
      'Refinery gas and liquids': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(42.9)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(54.7)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.03)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.03)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(54.76)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(18.0)),
      },
      'Refinery coke': {
        ENERGY_CONTENT_FACTOR: energyPerMass('Fuel', gjPerTonneToJPerKg(34.2)),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(92.6)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.08)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(92.88)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(18.0)),
      },
    },
  },

  /**
   * @description Stationary fuel emission factors for each liquid fuel type by volume, in kg CO2-e/GJ
   * @ngaf2024 Table 8
   * @units kg CO2-e/GJ
   */
  STATIONARY_FUEL_FACTORS_BY_VOLUME: {
    'Liquid fuels': {
      Naphtha: {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(31.4),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(69.8)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.01)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.01)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(69.82)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(18.0)),
      },
      'Other petroleum products': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(34.4),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(69.8)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.02)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.1)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(69.92)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(18.0)),
      },
      'Petroleum based oils other than fuels': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(38.8),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(13.9)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.0)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.0)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(13.9)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(18.0)),
      },
      'Petroleum based greases': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(38.8),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(3.5)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.0)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.0)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(3.5)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(18.0)),
      },
      'Automotive gasoline/petrol': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(34.2),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(67.4)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(67.8)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(17.2)),
      },
      'Aviation gasoline': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(33.1),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(67.0)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(67.4)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(18.0)),
      },
      Kerosene: {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(37.5),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(68.9)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.01)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(69.11)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(18.0)),
      },
      'Aviation turbine fuel/kerosene': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(36.8),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(69.6)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.02)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(69.82)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(18.0)),
      },
      'Heating oil': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(37.3),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(69.5)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.03)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(69.73)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(18.0)),
      },
      'Diesel oil': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(38.6),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(69.9)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.1)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(70.2)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(17.3)),
      },
      'Fuel oil': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(39.7),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(73.6)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.04)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(73.84)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(18.0)),
      },
      'Liquefied aromatic hydrocarbons': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(34.4),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(69.7)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.03)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(69.93)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(18.0)),
      },
      'Solvents: mineral turpentine or white spirits': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(34.4),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(69.7)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.03)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(69.93)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(18.0)),
      },
      'Liquefied petroleum gas': {
        ENERGY_CONTENT_FACTOR: energyPerVolume(
          'Fuel',
          gjPerKlToJPerLitre(25.7),
        ),
        SCOPE1_EF: {
          CO2: massPerEnergy('CO2e', perGjToPerJ(60.2)),
          CH4: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          N2O: massPerEnergy('CO2e', perGjToPerJ(0.2)),
          CO2e: massPerEnergy('CO2e', perGjToPerJ(60.6)),
        },
        SCOPE3_EF: massPerEnergy('CO2e', perGjToPerJ(20.2)),
      },
    },
  },

  /**
   * @description Emissions factor for freighting of goods by land, sea or air. Sourced from the UK Government "Greenhouse gas reporting: conversion factors 2026" (Freighting goods)
   * @reference https://assets.publishing.service.gov.uk/media/6a29392bade52dc0882218a8/ghg-conversion-factors-2026-full-set.xlsx
   */
  FREIGHT_EMISSIONS: {
    'Van < 3.5 tonnes (diesel)': freightEmissions(0.63511),
    'Van < 3.5 tonnes (petrol)': freightEmissions(0.8381),
    'Van < 3.5 tonnes (CNG)': freightEmissions(0.62503),
    'Van < 3.5 tonnes (LPG)': freightEmissions(0.68715),
    'Van < 3.5 tonnes (PHEV)': freightEmissions(0.39716),
    'Van < 3.5 tonnes (BEV)': freightEmissions(0.14699),
    'Truck > 3.5 tonnes non-refrigerated (diesel)': freightEmissions(0.10356),
    'Truck > 3.5 tonnes refrigerated (diesel)': freightEmissions(0.12122),
    'Freight flight (domestic)': freightEmissions(4.60397),
    'Freight flight (short haul)': freightEmissions(1.27835),
    'Freight flight (international)': freightEmissions(0.89939),
    Rail: freightEmissions(0.02583),
    'Cargo ship (bulk carrier)': freightEmissions(0.00353),
    'Cargo ship (general cargo)': freightEmissions(0.01321),
    'Cargo ship (container)': freightEmissions(0.01612),
    'Cargo ship (refrigerated)': freightEmissions(0.01306),
  },

  /**
   * @description Stationary fuel emission factors for natural gas by volume, in kg CO2-e/GJ
   * @ngaf2024 Table 5 and 6
   * @units kg CO2-e/GJ
   */
  NATURAL_GAS_FACTORS: {
    ENERGY_CONTENT_FACTOR: energyPerVolume('Fuel', gjPerKlToJPerLitre(25.3)), // GJ/kL
    SCOPE1_EF: {
      CO2: massPerEnergy('CO2e', perGjToPerJ(51.4)),
      CH4: massPerEnergy('CO2e', perGjToPerJ(0.1)),
      N2O: massPerEnergy('CO2e', perGjToPerJ(0.03)),
      CO2e: massPerEnergy('CO2e', perGjToPerJ(51.53)),
    },
    // Uses NGAF Table 6 non-metro values
    SCOPE3_EF: {
      NSW: massPerEnergy('CO2e', perGjToPerJ(14.0)),
      ACT: massPerEnergy('CO2e', perGjToPerJ(14.0)),
      VIC: massPerEnergy('CO2e', perGjToPerJ(4)),
      QLD: massPerEnergy('CO2e', perGjToPerJ(7.9)),
      SA: massPerEnergy('CO2e', perGjToPerJ(10.6)),
      WA: massPerEnergy('CO2e', perGjToPerJ(4.0)),
      TAS: massPerEnergy('CO2e', perGjToPerJ(4)), // based on victoria
      NT: massPerEnergy('CO2e', perGjToPerJ(4.0)), // based on WA
    },
  },

  SOLID_WASTE_TREATMENT: {
    SCOPE_1: {
      /**
       * @description Emission factors for solid waste treatment
       * @appendixA A.4.1.3, A.4.1.4
       * @ngaf2024 Table 19, Table 29
       *
       * Anaerobic digestion & composting factors come from NGAF 2024 Table 19, and are
       * converted to CH4 and N2O factors respectively by dividing by AR5 GWP values.
       */
      FACILITY_FACTORS: {
        Composting: {
          CH4: massPerMass('CH4', 'Solid Waste', 0.00075),
          N2O: massPerMass('N2O', 'Solid Waste', 0.0000943),
        },
        'Anaerobic Digestion': {
          CH4: massPerMass('CH4', 'Solid Waste', 0.0001),
          N2O: massPerMass('N2O', 'Solid Waste', 0),
        },
        Incineration: massPerMass('Carbon', 'Solid Waste', 0.0505),
        'Unmanaged - deep': {
          METHANE_EF: massPerMass('CH4', 'Solid Waste', 0.0502),
          METHANE_CONVERSION_FACTOR: realNumber(0.8),
          OXIDATION_FACTOR: realNumber(0),
        },
        'Unmanaged - shallow': {
          METHANE_EF: massPerMass('CH4', 'Solid Waste', 0.0251),
          METHANE_CONVERSION_FACTOR: realNumber(0.4),
          OXIDATION_FACTOR: realNumber(0),
        },
        Burial: {
          METHANE_EF: massPerMass('CH4', 'Solid Waste', 0.0395),
          METHANE_CONVERSION_FACTOR: realNumber(0.7),
          OXIDATION_FACTOR: realNumber(0.1),
        },
      },
      /**
       * @description Scope 1 factors for specific solid waste types
       * @appendixA A.4.1.3, A.4.1.4
       * @ngaf2024 Table 28, Table 30
       */
      WASTE_FACTORS: {
        'Food waste': {
          CARBON_CONTENT: massPerMass('Carbon', 'Solid Waste', 0.38),
          FOSSIL_ORIGIN: realNumber(0),
          OXIDATION_FACTOR: realNumber(0.71),
          DRY_MATTER_CONTENT: realNumber(0.4),
          DEGRADABLE_ORGANIC_CONTENT: massPerMass(
            'Carbon',
            'Solid Waste',
            0.15,
          ),
          FRAC_DOC_DECOMPOSES: realNumber(0.84),
        },
        'Paper and cardboard': {
          CARBON_CONTENT: massPerMass('Carbon', 'Solid Waste', 0.46),
          FOSSIL_ORIGIN: realNumber(0.01),
          OXIDATION_FACTOR: realNumber(0.71),
          DRY_MATTER_CONTENT: realNumber(0.9),
          DEGRADABLE_ORGANIC_CONTENT: massPerMass('Carbon', 'Solid Waste', 0.4),
          FRAC_DOC_DECOMPOSES: realNumber(0.49),
        },
        'Green waste': {
          CARBON_CONTENT: massPerMass('Carbon', 'Solid Waste', 0.49),
          FOSSIL_ORIGIN: realNumber(0),
          OXIDATION_FACTOR: realNumber(0.71),
          DRY_MATTER_CONTENT: realNumber(0.4),
          DEGRADABLE_ORGANIC_CONTENT: massPerMass('Carbon', 'Solid Waste', 0.2),
          FRAC_DOC_DECOMPOSES: realNumber(0.47),
        },
        'Wood products (at time of harvest)': {
          CARBON_CONTENT: massPerMass('Carbon', 'Solid Waste', 0.5),
          FOSSIL_ORIGIN: realNumber(0),
          OXIDATION_FACTOR: realNumber(0.71),
          DRY_MATTER_CONTENT: realNumber(0.4),
          DEGRADABLE_ORGANIC_CONTENT: massPerMass(
            'Carbon',
            'Solid Waste',
            0.43,
          ),
          FRAC_DOC_DECOMPOSES: realNumber(0.1),
        },
        'Wood products (at end of life)': {
          CARBON_CONTENT: massPerMass('Carbon', 'Solid Waste', 0.5),
          FOSSIL_ORIGIN: realNumber(0),
          OXIDATION_FACTOR: realNumber(0.71),
          DRY_MATTER_CONTENT: realNumber(0.9),
          DEGRADABLE_ORGANIC_CONTENT: massPerMass(
            'Carbon',
            'Solid Waste',
            0.43,
          ),
          FRAC_DOC_DECOMPOSES: realNumber(0.1),
        },
        Textiles: {
          CARBON_CONTENT: massPerMass('Carbon', 'Solid Waste', 0.5),
          FOSSIL_ORIGIN: realNumber(0.2),
          OXIDATION_FACTOR: realNumber(0.71),
          DRY_MATTER_CONTENT: realNumber(0.8),
          DEGRADABLE_ORGANIC_CONTENT: massPerMass(
            'Carbon',
            'Solid Waste',
            0.24,
          ),
          FRAC_DOC_DECOMPOSES: realNumber(0.5),
        },
        Sludge: {
          CARBON_CONTENT: massPerMass('Carbon', 'Solid Waste', 0.5),
          FOSSIL_ORIGIN: realNumber(0),
          OXIDATION_FACTOR: realNumber(0.71),
          DRY_MATTER_CONTENT: realNumber(0),
          DEGRADABLE_ORGANIC_CONTENT: massPerMass(
            'Carbon',
            'Solid Waste',
            0.05,
          ),
          FRAC_DOC_DECOMPOSES: realNumber(0.5),
        },
        Nappies: {
          CARBON_CONTENT: massPerMass('Carbon', 'Solid Waste', 0.7),
          FOSSIL_ORIGIN: realNumber(0.1),
          OXIDATION_FACTOR: realNumber(0.71),
          DRY_MATTER_CONTENT: realNumber(0.4),
          DEGRADABLE_ORGANIC_CONTENT: massPerMass(
            'Carbon',
            'Solid Waste',
            0.24,
          ),
          FRAC_DOC_DECOMPOSES: realNumber(0.5),
        },
        'Rubber and leather': {
          CARBON_CONTENT: massPerMass('Carbon', 'Solid Waste', 0.67),
          FOSSIL_ORIGIN: realNumber(0.2),
          OXIDATION_FACTOR: realNumber(0.71),
          DRY_MATTER_CONTENT: realNumber(0.84),
          DEGRADABLE_ORGANIC_CONTENT: massPerMass(
            'Carbon',
            'Solid Waste',
            0.39,
          ),
          FRAC_DOC_DECOMPOSES: realNumber(0.5),
        },
        'Inert waste': {
          CARBON_CONTENT: massPerMass('Carbon', 'Solid Waste', 0.03),
          FOSSIL_ORIGIN: realNumber(1),
          OXIDATION_FACTOR: realNumber(0.71),
          DRY_MATTER_CONTENT: realNumber(0.9),
          DEGRADABLE_ORGANIC_CONTENT: massPerMass('Carbon', 'Solid Waste', 0),
          FRAC_DOC_DECOMPOSES: realNumber(0),
        },
      },
      UNMANAGED_METHANE_FRACTION: realNumber(0.5),
    },
    /**
     * @description Emission factors for scope 3 solid waste treatment, by treatment type and waste type
     * @appendixA A.3.2.1, A.3.2.2,
     */
    SCOPE_3: {
      'Landfill (with gas recovery)': {
        WASTE_TYPES: {
          'Food waste': massPerMass('CO2e', 'Solid Waste', 2.1),
          'Paper and cardboard': massPerMass('CO2e', 'Solid Waste', 3.3),
          'Green waste': massPerMass('CO2e', 'Solid Waste', 1.6),
          'Wood products (at time of harvest)': massPerMass(
            'CO2e',
            'Solid Waste',
            1.6,
          ),
          'Wood products (at end of life)': massPerMass(
            'CO2e',
            'Solid Waste',
            0.7,
          ),
          Textiles: massPerMass('CO2e', 'Solid Waste', 2.0),
          Sludge: massPerMass('CO2e', 'Solid Waste', 0.4),
          'Rubber and leather': massPerMass('CO2e', 'Solid Waste', 3.3),
          'Inert waste': massPerMass('CO2e', 'Solid Waste', 0),
          'Municipal solid waste': massPerMass('CO2e', 'Solid Waste', 1.6),
          'Commercial and industrial waste': massPerMass(
            'CO2e',
            'Solid Waste',
            1.3,
          ),
          'Construction and demolition waste': massPerMass(
            'CO2e',
            'Solid Waste',
            0.2,
          ),
        },
        RECOVERY_FRACTION: realNumber(0.45),
      },
      'Landfill (without gas recovery)': {
        WASTE_TYPES: {
          'Food waste': massPerMass('CO2e', 'Solid Waste', 2.1),
          'Paper and cardboard': massPerMass('CO2e', 'Solid Waste', 3.3),
          'Green waste': massPerMass('CO2e', 'Solid Waste', 1.6),
          'Wood products (at time of harvest)': massPerMass(
            'CO2e',
            'Solid Waste',
            1.6,
          ),
          'Wood products (at end of life)': massPerMass(
            'CO2e',
            'Solid Waste',
            0.7,
          ),
          Textiles: massPerMass('CO2e', 'Solid Waste', 2.0),
          Sludge: massPerMass('CO2e', 'Solid Waste', 0.4),
          'Rubber and leather': massPerMass('CO2e', 'Solid Waste', 3.3),
          'Inert waste': massPerMass('CO2e', 'Solid Waste', 0),
          'Municipal solid waste': massPerMass('CO2e', 'Solid Waste', 1.6),
          'Commercial and industrial waste': massPerMass(
            'CO2e',
            'Solid Waste',
            1.3,
          ),
          'Construction and demolition waste': massPerMass(
            'CO2e',
            'Solid Waste',
            0.2,
          ),
        },
        RECOVERY_FRACTION: realNumber(0),
      },
      Incineration: {
        WASTE_TYPES: {
          'Food waste': massPerMass('CO2e', 'Solid Waste', 0),
          'Green waste': massPerMass('CO2e', 'Solid Waste', 0),
          'Wood products (at time of harvest)': massPerMass(
            'CO2e',
            'Solid Waste',
            0,
          ),
          'Wood products (at end of life)': massPerMass(
            'CO2e',
            'Solid Waste',
            0,
          ),
          Sludge: massPerMass('CO2e', 'Solid Waste', 0),
          'Paper and cardboard': massPerMass('CO2e', 'Solid Waste', 0.0169),
          Textiles: massPerMass('CO2e', 'Solid Waste', 0.3667),
          'Rubber and leather': massPerMass('CO2e', 'Solid Waste', 0.4919),
          'Inert waste': massPerMass('CO2e', 'Solid Waste', 0.11),
          'Municipal solid waste': massPerMass('CO2e', 'Solid Waste', 0.0537),
          'Commercial and industrial waste': massPerMass(
            'CO2e',
            'Solid Waste',
            1.649,
          ),
        },
        RECOVERY_FRACTION: realNumber(0),
      },
      Composting: {
        EF: massPerMass('CO2e', 'Solid Waste', 0.046),
        RECOVERY_FRACTION: realNumber(0),
      },
      'Anaerobic Digestion': {
        EF: massPerMass('CO2e', 'Solid Waste', 0.028),
        RECOVERY_FRACTION: realNumber(0),
      },
    },
    /**
     * NOTE: tonnes per cubic metre is equal to kilograms per litre, so none of these
     * need extra conversion.
     *
     * @description Factors for converting volumes of solid waste to mass
     * @ngaf2024 4.2, Table 15 & Table 16
     * @units t/m^3
     */
    WASTE_TYPES_VOLUME_TO_MASS: {
      'Food waste': massPerVolume('Solid Waste', 'Solid Waste', 0.5),
      'Paper and cardboard': massPerVolume('Solid Waste', 'Solid Waste', 0.09),
      'Green waste': massPerVolume('Solid Waste', 'Solid Waste', 0.24),
      'Wood products (at end of life)': massPerVolume(
        'Solid Waste',
        'Solid Waste',
        0.15,
      ),
      'Wood products (at time of harvest)': massPerVolume(
        'Solid Waste',
        'Solid Waste',
        0.15,
      ),
      Textiles: massPerVolume('Solid Waste', 'Solid Waste', 0.14),
      Sludge: massPerVolume('Solid Waste', 'Solid Waste', 0.72),
      'Rubber and leather': massPerVolume('Solid Waste', 'Solid Waste', 0.14),
      'Inert waste': massPerVolume('Solid Waste', 'Solid Waste', 0.42),
      Nappies: massPerVolume('Solid Waste', 'Solid Waste', 0.39),
      'Municipal solid waste': massPerVolume(
        'Solid Waste',
        'Solid Waste',
        0.36,
      ),
      'Commercial and industrial waste': massPerVolume(
        'Solid Waste',
        'Solid Waste',
        0.33,
      ),
      'Construction and demolition waste': massPerVolume(
        'Solid Waste',
        'Solid Waste',
        0.39,
      ),
    },
  },

  /**
   * Not cited as a specific factor anywhere, but used as a raw figure across chapter 4 especially.
   * Other sources that the guidance references define this factor accordingly.
   * 6.25 is the commonly used factor for nitrogen to protein.
   * @description The commonly used factor for converting nitrogen to protein
   */
  NITROGEN_TO_PROTEIN: massPerMass('CrudeProtein', 'N', 6.25),

  /**
   * @description Wastewater treatment and sludge treatment methane emissions factors
   * @reference National Greenhouse and Energy Reporting (Measurement) Determination 2008, (Schedule 1, Part 2)
   * @appendixA A.4.1.5, A.4.1.6, A.4.1.7
   */
  WASTEWATER_TREATMENT: {
    // A.4.1.6
    WASTEWATER_METHANE_CORRECTION_FACTORS: {
      'Managed aerobic treatment': realNumber(0),
      'Unmanaged aerobic treatment': realNumber(0.3),
      'Anaerobic digestor/reactor': realNumber(0.8),
      'Shallow anaerobic lagoon': realNumber(0.2),
      'Deep anaerobic lagoon': realNumber(0.8),
    },
    // A.4.1.7
    SLUDGE_METHANE_CORRECTION_FACTORS: {
      'Managed aerobic treatment': realNumber(0),
      'Unmanaged aerobic treatment': realNumber(0.3),
      'Anaerobic digestor/reactor': realNumber(0.8),
      'Shallow anaerobic lagoon': realNumber(0.2),
      'Deep anaerobic lagoon': realNumber(0.8),
    },
    // A.4.1.5
    COD_BY_COMMODITY: {
      'Dairy products': {
        inletCOD: massPerVolume(
          'COD',
          'FluidWaste',
          perCubicMetresToPerLitres(0.9),
        ),
        fracRecovered: realNumber(0.398),
      },
      'Pulp, paper and paperboard': {
        inletCOD: massPerVolume(
          'COD',
          'FluidWaste',
          perCubicMetresToPerLitres(0.4),
        ),
        fracRecovered: realNumber(0.547),
      },
      'Meat and poultry': {
        inletCOD: massPerVolume(
          'COD',
          'FluidWaste',
          perCubicMetresToPerLitres(6.1),
        ),
        fracRecovered: realNumber(0.348),
      },
      'Raw sugar': {
        inletCOD: massPerVolume(
          'COD',
          'FluidWaste',
          perCubicMetresToPerLitres(3.8),
        ),
        fracRecovered: realNumber(0),
      },
      Beer: {
        inletCOD: massPerVolume(
          'COD',
          'FluidWaste',
          perCubicMetresToPerLitres(6),
        ),
        fracRecovered: realNumber(0.723),
      },
      'Wine and other alcoholic beverages': {
        inletCOD: massPerVolume(
          'COD',
          'FluidWaste',
          perCubicMetresToPerLitres(1.5),
        ),
        fracRecovered: realNumber(0.796),
      },
      Fruit: {
        inletCOD: massPerVolume(
          'COD',
          'FluidWaste',
          perCubicMetresToPerLitres(0.2),
        ),
        fracRecovered: realNumber(0.005),
      },
      Vegetables: {
        inletCOD: massPerVolume(
          'COD',
          'FluidWaste',
          perCubicMetresToPerLitres(0.2),
        ),
        fracRecovered: realNumber(0.06),
      },
    },
    /**
     * Chapter 11.2.3
     */
    FRAC_SLUDGE: realNumber(0.15),
    WASTEWATER_EF: massPerMass('CH4', 'COD', 0.25),
    SLUDGE_EF: massPerMass('CH4', 'COD', 0.25),
    SLUDGE_BIOGAS_ENERGY_CONTENT: energyPerVolume(
      'CH4',
      gjPerCubicMetreToJPerLitre(0.0377),
    ),
    SLUDGE_BIOGAS_CH4_EF: massPerEnergy('CH4', perGjToPerJ(0.2286)),
    SLUDGE_BIOGAS_N2O_EF: massPerEnergy('N2O', perGjToPerJ(1.132e-4)),
  },

  /**
   * @description Purchased packaging emission factors by unit. Value for "Plastic crate polypropylene" is sourced from AusLCI V48 (March 2026)
   * @appendixA A.3.1.5
   */
  PURCHASED_PACKAGING_FACTORS_BY_UNITS: {
    '1 tonne polypropylene bag': mass('CO2e', 6.04),
    '25 kg polypropylene bag': mass('CO2e', 0.9),
    '20L high density polyethylene (HDPE) container': mass('CO2e', 3.41),
    '1000L intermediate bulk containers': mass('CO2e', 190.15),
    'Plastic crate polypropylene': mass('CO2e', 3.99),
  },

  /**
   * @description Purchased packaging emission factors by mass. Values sourced from AusLCI V48 (March 2026)
   */
  PURCHASED_PACKAGING_FACTORS_BY_MASS: {
    'Corrugated board': massPerMass('CO2e', 'Packaging', 1.050716),
    'Plastic film LDPE': massPerMass('CO2e', 'Packaging', 3.4411615),
    'Plastic sheet HDPE': massPerMass('CO2e', 'Packaging', 3.7225687),
  },
};

const cropResidueRemovedOtherCropTypes: Record<State, RealNumber> = {
  NSW: realNumber(0.05),
  VIC: realNumber(0.07),
  QLD: realNumber(0.04),
  SA: realNumber(0.09),
  WA: realNumber(0.11),
  TAS: realNumber(0.16),
  NT: realNumber(0.01),
  ACT: realNumber(0),
};

// fracGasf values taken from A.2.2.6
const fracGasfUreaBased = massPerMass('Volatilised N', 'N', 0.15);
const fracGasfAmmoniumBased = massPerMass('Volatilised N', 'N', 0.08);
const fracGasfNitrateBased = massPerMass('Volatilised N', 'N', 0.01);
const fracGasfAmmoniumNitrateBased = massPerMass('Volatilised N', 'N', 0.05);
const fracGasfOtherFertilisers = massPerMass('Volatilised N', 'N', 0.11);

export const cropConstants: CropConstants = {
  name: 'CROP',

  /**
   * @description Fraction of inorganic fertiliser f type 'Other Fertilisers' that volatilises
   * @appendixA A.2.2.6
   */
  INORGANIC_FERTILISER_OTHER_VOLATILISES: fracGasfOtherFertilisers,

  /**
   * @description Fraction of N in inorganic fertiliser types. Appendix Tables A.2.2.3, A.2.2.4, A.2.2.6. Scope 3 values taken from AusLCI v46 May 2026
   * @appendixA A.2.2.3, A.2.2.4, A.2.2.6
   */
  INORGANIC_FERTILISER_FRACTIONS: {
    'Monoammonium Phosphate (MAP)': {
      N: massPerMass('N', 'Inorganic Fertiliser', 0.1),
      Urea: massPerMass('Urea', 'Inorganic Fertiliser', 0),
      Volatilises: fracGasfAmmoniumBased,
      Scope3EF: massPerMass('CO2e', 'Inorganic Fertiliser', 0.83),
    },
    'Diammonium Phosphate (DAP)': {
      N: massPerMass('N', 'Inorganic Fertiliser', 0.18),
      Urea: massPerMass('Urea', 'Inorganic Fertiliser', 0),
      Volatilises: fracGasfAmmoniumBased,
      Scope3EF: massPerMass('CO2e', 'Inorganic Fertiliser', 1.34),
    },
    Urea: {
      N: massPerMass('N', 'Inorganic Fertiliser', 0.46),
      Urea: massPerMass('Urea', 'Inorganic Fertiliser', 1),
      Volatilises: fracGasfUreaBased,
      Scope3EF: massPerMass('CO2e', 'Inorganic Fertiliser', 1.5),
    },
    'Sulphate of Ammonia (SOA)': {
      N: massPerMass('N', 'Inorganic Fertiliser', 0.21),
      Urea: massPerMass('Urea', 'Inorganic Fertiliser', 0),
      Volatilises: fracGasfAmmoniumBased,
      Scope3EF: massPerMass('CO2e', 'Inorganic Fertiliser', 0.47), // AusLCI entry for "Ammonium sulfate"
    },
    'Urea-Ammonium Nitrate (UAN)': {
      N: massPerMass('N', 'Inorganic Fertiliser', 0.32),
      Urea: massPerMass('Urea', 'Inorganic Fertiliser', 0.35),
      Volatilises: fracGasfUreaBased,
      Scope3EF: massPerMass('CO2e', 'Inorganic Fertiliser', 1.46),
    },
    'Ammonium Nitrate (AN)': {
      N: massPerMass('N', 'Inorganic Fertiliser', 0.337),
      Urea: massPerMass('Urea', 'Inorganic Fertiliser', 0),
      Volatilises: fracGasfAmmoniumNitrateBased,
      Scope3EF: massPerMass('CO2e', 'Inorganic Fertiliser', 2.12),
    },
    'Calcium Ammonium Nitrate (CAN)': {
      N: massPerMass('N', 'Inorganic Fertiliser', 0.27),
      Urea: massPerMass('Urea', 'Inorganic Fertiliser', 0),
      Volatilises: fracGasfAmmoniumNitrateBased,
      Scope3EF: massPerMass('CO2e', 'Inorganic Fertiliser', 1.25),
    },
    'Calcium Nitrate': {
      N: massPerMass('N', 'Inorganic Fertiliser', 0.155),
      Urea: massPerMass('Urea', 'Inorganic Fertiliser', 0),
      Volatilises: fracGasfNitrateBased,
      Scope3EF: massPerMass('CO2e', 'Inorganic Fertiliser', 0.53),
    },
    'Single Super Phosphate': {
      N: massPerMass('N', 'Inorganic Fertiliser', 0),
      Urea: massPerMass('Urea', 'Inorganic Fertiliser', 0),
      Volatilises: massPerMass('Volatilised N', 'N', 0),
      Scope3EF: massPerMass('CO2e', 'Inorganic Fertiliser', 0.45),
    },
  },

  // Lifecycles GHG Emission Intensities for Material Inputs to AUS Ag Fisheries Forestry V48 (March 2026)
  /**
   * @description Inorganic fertiliser emission factors by region. Values from AusLCI
   */
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
  /**
   * @description Inorganic fertiliser emission factors that are not regional. Values from AusLCI V48 (March 2026)
   */
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

  /**
   * @description Fraction of N in organic fertiliser types.
   * @appendixA A.2.2.5
   */
  ORGANIC_FERTILISER_FRACTIONS: {
    'Dairy cattle': { N: massPerMass('N', 'Organic Fertiliser', 0.029) },
    'Beef cattle': { N: massPerMass('N', 'Organic Fertiliser', 0.023) },
    Poultry: { N: massPerMass('N', 'Organic Fertiliser', 0.51) },
    Pigs: { N: massPerMass('N', 'Organic Fertiliser', 0.41) },
    Sheep: { N: massPerMass('N', 'Organic Fertiliser', 0.033) },
    'Horses/Mules': { N: massPerMass('N', 'Organic Fertiliser', 0.013) },
  },

  /**
   * @description Methane emissions factor for savannah burning
   * @inventory2022 Table 5.31
   * @nir2024Vol1 Table 5.31
   * @units Gg element / Gg burnt
   */
  BURNING_METHANE_EF: massPerMass('CH4', 'CH4', 0.0035),

  /**
   * @description N2O emissions factor for savannah burning
   * @inventory2022 Table 5.31
   * @nir2024Vol1 Table 5.31
   * @units Gg element / Gg burnt
   */
  BURNING_N2O_EF: massPerMass('N2O', 'N', 0.0076),

  /**
   * @description Emission factor for organic fertiliser and crop residues returned to the soil
   * @appendixA A.2.1.4
   */
  EF_RESIDUES_RETURNED_TO_SOIL: {
    wet: massPerMass('N2O', 'N', 0.006),
    dry: massPerMass('N2O', 'N', 0.005),
  },

  /**
   * @description Fraction of crop residue removed for major crop types
   * @appendixA A.2.1.2
   */
  FRACTION_CROP_RESIDUE_REMOVED: {
    Rice: allStatesWithValue(0.06),
    'Tubers and Roots': allStatesWithValue(1),
    Cotton: allStatesWithValue(0),
    'Hops and grape vines': allStatesWithValue(0),
    'Forage Crops': allStatesWithValue(0.8),
    'Sugar Cane': {
      NSW: realNumber(0),
      QLD: realNumber(0.03),
      WA: realNumber(0),
      SA: realNumber(0), // N/A
      VIC: realNumber(0), // N/A
      ACT: realNumber(0), // N/A
      TAS: realNumber(0), // N/A
      NT: realNumber(0), // N/A
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
   * @appendixA A.2.1.1
   */
  CROPRESIDUE: {
    Wheat: {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.5),
      belowAboveResidueRatio: realNumber(0.29),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.88),
      carbonMassFraction: massPerMass('Carbon', 'DryMatter', 0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.006),
      belowGroundN: massPerMass('N', 'DryMatter', 0.01),
      fractionOfResidueAtBurning: realNumber(0.5),
      fractionBurnt: realNumber(0.9),
    },
    Barley: {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.24),
      belowAboveResidueRatio: realNumber(0.32),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.88),
      carbonMassFraction: massPerMass('Carbon', 'DryMatter', 0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.007),
      belowGroundN: massPerMass('N', 'DryMatter', 0.01),
      fractionOfResidueAtBurning: realNumber(0.5),
      fractionBurnt: realNumber(0.85),
    },
    Maize: {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 0.81),
      belowAboveResidueRatio: realNumber(0.39),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.85),
      carbonMassFraction: massPerMass('Carbon', 'DryMatter', 0.42),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.005),
      belowGroundN: massPerMass('N', 'DryMatter', 0.007),
      fractionOfResidueAtBurning: realNumber(1),
      fractionBurnt: realNumber(0.8),
    },
    Oats: {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.42),
      belowAboveResidueRatio: realNumber(0.43),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.88),
      carbonMassFraction: massPerMass('Carbon', 'DryMatter', 0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.006),
      belowGroundN: massPerMass('N', 'DryMatter', 0.01),
      fractionOfResidueAtBurning: realNumber(0.5),
      fractionBurnt: realNumber(0.85),
    },
    Rice: {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.31),
      belowAboveResidueRatio: realNumber(0.16),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.8),
      carbonMassFraction: massPerMass('Carbon', 'DryMatter', 0.42),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.007),
      belowGroundN: massPerMass('N', 'DryMatter', 0.01),
      fractionOfResidueAtBurning: realNumber(1),
      fractionBurnt: realNumber(0.8),
    },
    Sorghum: {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.5),
      belowAboveResidueRatio: realNumber(0.22),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.8),
      carbonMassFraction: massPerMass('Carbon', 'DryMatter', 0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.008),
      belowGroundN: massPerMass('N', 'DryMatter', 0.007),
      fractionOfResidueAtBurning: realNumber(0.5),
      fractionBurnt: realNumber(0.85),
    },
    Triticale: {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.5),
      belowAboveResidueRatio: realNumber(0.42),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.88),
      carbonMassFraction: massPerMass('Carbon', 'DryMatter', 0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.006),
      belowGroundN: massPerMass('N', 'DryMatter', 0.01),
      fractionOfResidueAtBurning: realNumber(0.5),
      fractionBurnt: realNumber(0.85),
    },
    'Other Cereals': {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.46),
      belowAboveResidueRatio: realNumber(0.36),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.88),
      carbonMassFraction: massPerMass('Carbon', 'DryMatter', 0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.006),
      belowGroundN: massPerMass('N', 'DryMatter', 0.01),
      fractionOfResidueAtBurning: realNumber(0.5),
      fractionBurnt: realNumber(0.85),
    },
    Pulses: {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.37),
      belowAboveResidueRatio: realNumber(0.51),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.87),
      carbonMassFraction: massPerMass('Carbon', 'DryMatter', 0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.009),
      belowGroundN: massPerMass('N', 'DryMatter', 0.01),
      fractionOfResidueAtBurning: realNumber(0.5),
      fractionBurnt: realNumber(0.85),
    },
    'Tubers and Roots': {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 0.34),
      belowAboveResidueRatio: realNumber(0.43),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.25),
      carbonMassFraction: massPerMass('Carbon', 'DryMatter', 0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.02),
      belowGroundN: massPerMass('N', 'DryMatter', 0.01),
      fractionOfResidueAtBurning: realNumber(0),
      fractionBurnt: realNumber(0.85),
    },
    Peanuts: {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.07),
      belowAboveResidueRatio: realNumber(0.2),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.8),
      carbonMassFraction: massPerMass('Carbon', 'DryMatter', 0.42),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.016),
      belowGroundN: massPerMass('N', 'DryMatter', 0.014),
      fractionOfResidueAtBurning: realNumber(0.5),
      fractionBurnt: realNumber(0.85),
    },
    'Sugar Cane': {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 0.25),
      belowAboveResidueRatio: realNumber(0.45),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.2),
      carbonMassFraction: massPerMass('Carbon', 'DryMatter', 0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.005),
      belowGroundN: massPerMass('N', 'DryMatter', 0.007),
      fractionOfResidueAtBurning: realNumber(1),
      fractionBurnt: realNumber(0.8),
    },
    Cotton: {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.9),
      belowAboveResidueRatio: realNumber(0.3),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.9),
      carbonMassFraction: massPerMass('Carbon', 'DryMatter', 0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.01),
      belowGroundN: massPerMass('N', 'DryMatter', 0.01),
      fractionOfResidueAtBurning: realNumber(0),
      fractionBurnt: realNumber(0.85),
    },
    'Hops and grape vines': {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.5),
      belowAboveResidueRatio: realNumber(0.29),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.88),
      carbonMassFraction: massPerMass('Carbon', 'DryMatter', 0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.006),
      belowGroundN: massPerMass('N', 'DryMatter', 0),
      fractionOfResidueAtBurning: realNumber(0),
      fractionBurnt: realNumber(0.85),
    },
    Oilseeds: {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 2.08),
      belowAboveResidueRatio: realNumber(0.33),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.96),
      carbonMassFraction: massPerMass('Carbon', 'DryMatter', 0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.009),
      belowGroundN: massPerMass('N', 'DryMatter', 0.01),
      fractionOfResidueAtBurning: realNumber(0.5),
      fractionBurnt: realNumber(0.85),
    },
    'Forage Crops': {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.34),
      belowAboveResidueRatio: realNumber(0.37),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.88),
      carbonMassFraction: massPerMass('Carbon', 'DryMatter', 0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.006),
      belowGroundN: massPerMass('N', 'DryMatter', 0.01),
      fractionOfResidueAtBurning: realNumber(0),
      fractionBurnt: realNumber(0.85),
    },
    'Other Annual Crops': {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.0),
      belowAboveResidueRatio: realNumber(0.22),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.85),
      carbonMassFraction: massPerMass('Carbon', 'DryMatter', 0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.008),
      belowGroundN: massPerMass('N', 'DryMatter', 0.009),
      fractionOfResidueAtBurning: realNumber(0),
      fractionBurnt: realNumber(0),
    },
    'Other Perennial Crops': {
      residueCropRatio: massPerMass('CropResidue', 'DryMatter', 1.5),
      belowAboveResidueRatio: realNumber(0.29),
      dryMatterContent: massPerMass('DryMatter', 'CropResidue', 0.88),
      carbonMassFraction: massPerMass('Carbon', 'DryMatter', 0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.06),
      belowGroundN: massPerMass('N', 'DryMatter', 0),
      fractionOfResidueAtBurning: realNumber(0),
      fractionBurnt: realNumber(0),
    },
  },

  /**
   * @description Pasture residue parameters for major pasture types
   * @appendixA A.2.1.3
   */
  PASTURERESIDUE: {
    'Annual grass': {
      averageYield: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(4.41),
      ),
      belowAboveResidueRatio: realNumber(0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.015),
      belowGroundN: massPerMass('N', 'DryMatter', 0.012),
      fractionRemoved: realNumber(0.8),
    },
    'Grass clover mixture': {
      averageYield: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(8.34),
      ),
      belowAboveResidueRatio: realNumber(0.8),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.025),
      belowGroundN: massPerMass('N', 'DryMatter', 0.016),
      fractionRemoved: realNumber(0.8),
    },
    Lucerne: {
      averageYield: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(8.62),
      ),
      belowAboveResidueRatio: realNumber(0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.027),
      belowGroundN: massPerMass('N', 'DryMatter', 0.019),
      fractionRemoved: realNumber(0.8),
    },
    'Other legume': {
      averageYield: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(5.62),
      ),
      belowAboveResidueRatio: realNumber(0.4),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.027),
      belowGroundN: massPerMass('N', 'DryMatter', 0.022),
      fractionRemoved: realNumber(0.8),
    },
    'Perennial pasture': {
      averageYield: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(8.35),
      ),
      belowAboveResidueRatio: realNumber(0.8),
      aboveGroundN: massPerMass('N', 'DryMatter', 0.015),
      belowGroundN: massPerMass('N', 'DryMatter', 0.012),
      fractionRemoved: realNumber(0.8),
    },
  },

  /**
   * @description Atmospheric deposition nitrous oxide emission factors for inorganic fertiliser application
   * @appendixA A.2.2.1
   */
  EF_N2O_ATMOSPHERIC_DEPOSITION_PRODUCTION_SYSTEM: {
    'Irrigated pasture': massPerMass('N2O', 'Volatilised N', 0.0059),
    'Irrigated crop': massPerMass('N2O', 'Volatilised N', 0.007),
    'Non-irrigated pasture': massPerMass('N2O', 'Volatilised N', 0.0018),
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
    Sugar: massPerMass('N2O', 'Volatilised N', 0.0199),
    Cotton: massPerMass('N2O', 'Volatilised N', 0.0053),
    'Horticultural crops': massPerMass('N2O', 'Volatilised N', 0.0064),
    'Rice (continuous flooding)': massPerMass('N2O', 'Volatilised N', 0.003),
    'Rice (single and multiple drainage, or alternate wetting and drying)':
      massPerMass('N2O', 'Volatilised N', 0.005),
    Aquaculture: massPerMass('N2O', 'Volatilised N', 0.0026),
    Forestry: massPerMass('N2O', 'Volatilised N', 0.0018),
  },

  /**
   * @description Fraction of nitrogen volatilised from urine and faeces deposited on pasture (FracGASMSoil)
   * @reference IPCC 2019, Volume 4, Chapter 11, Table 11.3
   */
  FRACTION_N_VOLATILISED_ORGANIC_FERTILISER: massPerMass(
    'Volatilised N',
    'N',
    0.21,
  ),

  /**
   * @description Default fraction of N that is lost through leaching and runoff (FracLEACH)
   * @reference National Greenhouse Gas Inventory Volume 1
   */
  FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF: realNumber(0.24),

  /**
   * @description Fraction of nitrogen lost through leaching and runoff for solid storage MMS only (FracLEACH_MS)
   * @nir2024Vol1 Indirect nitrous oxide emissions - Leaching and Runoff
   */
  FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF_SOLID_STORAGE: realNumber(0.02),

  /**
   * @description Emission factor for leaching and runoff (EFleach)
   * @nir2024Vol1 Indirect nitrous oxide emissions - Leaching and Runoff
   */
  EF_N2O_LEACHING_AND_RUNOFF: massPerMass('N2O', 'N', 0.011),

  /**
   * @description The Australian cotton industry applies an economic allocation of 83% to lint. This is not materially different from the internationally agreed allocation of 82.7%.
   * @reference Common requirements framework
   */
  COTTON_ECONOMIC_LINT_ALLOCATION: percentage(83),
};

export const pigsConstants: PigsConstants = {
  name: 'PIGS',

  /**
   * @description Emission factors for different manure management systems (MMS) for pigs
   * @appendixA A.1.6.2, A.1.6.3, A.1.6.4
   * @nir2024Vol2 A.5.5.6 footnote
   */
  MMS: {
    outdoorAndFreeRange: {
      N_VOLATISED_EF: realNumber(0.3),
      N2O_EF: realNumber(0.02),
      VOLATILE_SOLIDS_LOST: realNumber(0),
      METHANE_CONVERSION_FACTOR_BY_STATE: {
        ...allStatesWithValue(0.01),
        QLD: realNumber(0.03),
        NT: realNumber(0.03),
      },
      FracGASM: massPerMass('Volatilised N', 'N', 0.3),
      EFm: massPerMass('N2O', 'N', 0.02),
    },
    deepLitter: {
      N_VOLATISED_EF: realNumber(0.125),
      N2O_EF: realNumber(0.01),
      VOLATILE_SOLIDS_LOST: realNumber(0.05),
      METHANE_CONVERSION_FACTOR_BY_STATE: allStatesWithValue(0.04),
      FracGASM: massPerMass('Volatilised N', 'N', 0.125),
      EFm: massPerMass('N2O', 'N', 0.01),
    },
    solidStorage: {
      N_VOLATISED_EF: realNumber(0.2),
      N2O_EF: realNumber(0.005),
      VOLATILE_SOLIDS_LOST: realNumber(0),
      METHANE_CONVERSION_FACTOR_BY_STATE: allStatesWithValue(0.02),
      FracGASM: massPerMass('Volatilised N', 'N', 0.2),
      EFm: massPerMass('N2O', 'N', 0.005),
    },
    anaerobicLagoon: {
      N_VOLATISED_EF: realNumber(0.55),
      N2O_EF: realNumber(0),
      VOLATILE_SOLIDS_LOST: realNumber(0),
      METHANE_CONVERSION_FACTOR_BY_STATE: {
        ACT: realNumber(0.75),
        NSW: realNumber(0.75),
        QLD: realNumber(0.78),
        NT: realNumber(0.78),
        SA: realNumber(0.75),
        TAS: realNumber(0.7),
        VIC: realNumber(0.74),
        WA: realNumber(0.76),
      },
      FracGASM: massPerMass('Volatilised N', 'N', 0.55),
      EFm: massPerMass('N2O', 'N', 0),
    },
    digester: {
      N_VOLATISED_EF: realNumber(0),
      N2O_EF: realNumber(0),
      VOLATILE_SOLIDS_LOST: realNumber(0.75),
      METHANE_CONVERSION_FACTOR_BY_STATE: allStatesWithValue(0.1),
      FracGASM: massPerMass('Volatilised N', 'N', 0),
      EFm: massPerMass('N2O', 'N', 0),
    },
    pitStorage: {
      N_VOLATISED_EF: realNumber(0.25),
      N2O_EF: realNumber(0.002),
      VOLATILE_SOLIDS_LOST: realNumber(0),
      METHANE_CONVERSION_FACTOR_BY_STATE: allStatesWithValue(0.03),
      FracGASM: massPerMass('Volatilised N', 'N', 0.25),
      EFm: massPerMass('N2O', 'N', 0.002),
    },
    directApplication: {
      N_VOLATISED_EF: realNumber(0),
      N2O_EF: realNumber(0),
      VOLATILE_SOLIDS_LOST: realNumber(0),
      METHANE_CONVERSION_FACTOR_BY_STATE: allStatesWithValue(0),
    },
  },

  /**
   * @description Energy content of methane per unit mass
   * @nir2024Vol1 3.A.3_1
   */
  ENERGY_PER_MASS_METHANE: energyPerMass('CH4', megaJoulesToJoules(55.22)),

  /**
   * @description gross energy (GE) content of feed (MJ GE/kg feed)
   * @nir2024Vol1 3.A.3_1
   */
  GROSS_ENERGY_CONTENT_OF_FEED: energyPerMass(
    'DryMatter',
    megaJoulesToJoules(18.6),
  ),

  /**
   * @description fraction of GE intake converted to methane by pigs
   * @nir2024Vol1 3.A.3_1
   */
  FRACTION_INTAKE_CONVERTED_TO_METHANE: realNumber(0.007),

  /**
   * @description Pigs class factors for feed intake, volatile solids, and nitrogen in waste
   * @appendixA A.1.6.1 (2020-2024)
   */
  PIGS_CLASS_FACTORS: {
    boars: {
      FEED_INTAKE: massPerHeadPerDay('DryMatter', 2.3),
      VOLATILE_SOLIDS: massPerHeadPerDay('Volatile Solids', 0.4),
      NITROGEN_IN_WASTE: massPerHeadPerDay('N', 0.046),
    },
    sows: {
      FEED_INTAKE: massPerHeadPerDay('DryMatter', 2.62),
      VOLATILE_SOLIDS: massPerHeadPerDay('Volatile Solids', 0.46),
      NITROGEN_IN_WASTE: massPerHeadPerDay('N', 0.049),
    },
    gilts: {
      FEED_INTAKE: massPerHeadPerDay('DryMatter', 2.5),
      VOLATILE_SOLIDS: massPerHeadPerDay('Volatile Solids', 0.55),
      NITROGEN_IN_WASTE: massPerHeadPerDay('N', 0.046),
    },
    slaughterPigs: {
      FEED_INTAKE: massPerHeadPerDay('DryMatter', 1.71),
      VOLATILE_SOLIDS: massPerHeadPerDay('Volatile Solids', 0.39),
      NITROGEN_IN_WASTE: massPerHeadPerDay('N', 0.031),
    },
  },

  /**
   * @description Fraction of volatile solids separated by pre-treatment of manure
   * @reference Guidelines chapter 4.5.2.2 SSj
   */
  DEFAULT_FRACTION_SOLIDS_SEPARATED: realNumber(0.25),
  /**
   * @description Fraction of nitrogen separated by pre-treatment of manure
   * @reference Guidelines chapter 4.5.2.2 SNj
   */
  DEFAULT_FRACTION_NITROGEN_SEPARATED: realNumber(0.25),

  /**
   * @description Average liveweights by class
   * @appendixA A.1.6.5
   */
  LIVEWEIGHT: {
    sows: liveweight(188),
    boars: liveweight(206),
    gilts: liveweight(125),
    slaughterPigs: liveweight(39),
    slaughterPigsAtTurnoff: liveweight(97),
  },
};

export const feedlotConstants: FeedlotConstants = {
  name: 'FEEDLOT',

  /**
   * @description Factors for feedlot MMS. Values for ACT derived from NSW, TAS derived from VIC and NT derived from QLD
   * @appendixA A.1.1.4, A.1.1.5, A.1.1.6
   */
  MMS: {
    drylot: {
      EFm: massPerMass('N2O', 'N', 0.0054),
      METHANE_CONVERSION_FACTOR_BY_STATE: {
        NSW: realNumber(0.01),
        ACT: realNumber(0.01),
        VIC: realNumber(0.01),
        TAS: realNumber(0.01),
        QLD: realNumber(0.03),
        NT: realNumber(0.03),
        SA: realNumber(0.01),
        WA: realNumber(0.01),
      },
      FracGASM: massPerMass('Volatilised N', 'N', 0.6),
      FRACTION_SOLIDS_LOST: realNumber(0.5),
    },
    solidStorage: {
      EFm: massPerMass('N2O', 'N', 0.005),
      METHANE_CONVERSION_FACTOR_BY_STATE: {
        NSW: realNumber(0.02),
        ACT: realNumber(0.02),
        VIC: realNumber(0.02),
        TAS: realNumber(0.02),
        QLD: realNumber(0.02),
        NT: realNumber(0.02),
        SA: realNumber(0.02),
        WA: realNumber(0.02),
      },
      FracGASM: massPerMass('Volatilised N', 'N', 0.25),
    },
    composting: {
      EFm: massPerMass('N2O', 'N', 0.01),
      METHANE_CONVERSION_FACTOR_BY_STATE: {
        NSW: realNumber(0.01),
        ACT: realNumber(0.01),
        VIC: realNumber(0.01),
        TAS: realNumber(0.01),
        QLD: realNumber(0.01),
        NT: realNumber(0.01),
        SA: realNumber(0.01),
        WA: realNumber(0.01),
      },
      FracGASM: massPerMass('Volatilised N', 'N', 0.4),
    },
    anaerobicLagoon: {
      EFm: massPerMass('N2O', 'N', 0),
      METHANE_CONVERSION_FACTOR_BY_STATE: {
        NSW: realNumber(0.75),
        ACT: realNumber(0.75),
        VIC: realNumber(0.75),
        TAS: realNumber(0.75),
        QLD: realNumber(0.77),
        NT: realNumber(0.77),
        SA: realNumber(0.75),
        WA: realNumber(0.77),
      },
      FracGASM: massPerMass('Volatilised N', 'N', 0.35),
      FRACTION_SOLIDS_RUNOFF: realNumber(0.02),
    },
    directApplication: {
      EFm: massPerMass('N2O', 'N', 0),
      METHANE_CONVERSION_FACTOR_BY_STATE: {
        NSW: realNumber(0),
        ACT: realNumber(0),
        VIC: realNumber(0),
        TAS: realNumber(0),
        QLD: realNumber(0),
        NT: realNumber(0),
        SA: realNumber(0),
        WA: realNumber(0),
      },
      FracGASM: massPerMass('Volatilised N', 'N', 0),
    },
  },

  // Table A5.5.3.1 National Inventory Report Volume 2 [4]
  /**
   * @description Feedlot feed and diet properties
   * @appendixA A.1.1.3
   * @nir2024Vol2 A5.5.3.1, A5.3.3.2
   */
  FEED: {
    '0-80 days': {
      dryMatterIntake: massPerHeadPerDay('DryMatter', 10.4),
      dryMatterDigestibility: realNumber(0.81),
      crudeProtein: massPerMass('CrudeProtein', 'DryMatter', 0.14),
      nitrogenRetentionRate: realNumber(0.204),
      neutralDetergentFibrePercentage: percentage(22),
      etherExtractPercentage: percentage(4.8),
    },
    '81-200 days': {
      dryMatterIntake: massPerHeadPerDay('DryMatter', 10.8),
      dryMatterDigestibility: realNumber(0.81),
      crudeProtein: massPerMass('CrudeProtein', 'DryMatter', 0.12),
      nitrogenRetentionRate: realNumber(0.127),
      neutralDetergentFibrePercentage: percentage(22),
      etherExtractPercentage: percentage(5),
    },
    '201+ days': {
      dryMatterIntake: massPerHeadPerDay('DryMatter', 8.2),
      dryMatterDigestibility: realNumber(0.81),
      crudeProtein: massPerMass('CrudeProtein', 'DryMatter', 0.12),
      nitrogenRetentionRate: realNumber(0.07),
      neutralDetergentFibrePercentage: percentage(24),
      etherExtractPercentage: percentage(5.5),
    },
  },
};

export const dairyConstants: DairyConstants = {
  name: 'DAIRY',

  /**
   * @description Factors for dairy by class
   * @appendixA A.1.3.3, A.1.3.4
   * @nir2024Vol1 3.A.1a_4
   */
  CLASSES: {
    milkingCows: {
      liveweightGain: liveweightGain(0.016),
      referenceWeight: liveweight(590),
      averageStay: daysInYear.unit,
      netEnergyForGrowth: energyPerMass('Liveweight', megaJoulesToJoules(15)),
    },
    heifersGt1: {
      liveweightGain: liveweightGain(0.6),
      referenceWeight: liveweight(590),
      averageStay: daysInYear.unit,
      netEnergyForGrowth: energyPerMass('Liveweight', megaJoulesToJoules(15)),
    },
    bullsGt1: {
      liveweightGain: liveweightGain(0.1),
      referenceWeight: liveweight(770),
      averageStay: daysInYear.unit,
      netEnergyForGrowth: energyPerMass('Liveweight', megaJoulesToJoules(15)),
    },
    heifersLt1: {
      liveweightGain: liveweightGain(0.57),
      referenceWeight: liveweight(590),
      methaneProduction: massPerHeadPerDay('CH4', 0.0176),
      nitrogenExcreted: massPerHeadPerDay('N', 0.0137),
      volatileSolids: massPerHeadPerDay('Volatile Solids', 0.2685),
      averageStay: {
        preWeaned: days(84),
        weaned: days(281),
      },
      netEnergyForGrowth: {
        preWeaned: energyPerMass('Liveweight', megaJoulesToJoules(27.5)),
        weaned: energyPerMass('Liveweight', megaJoulesToJoules(11)),
      },
    },
    bullsLt1: {
      liveweightGain: liveweightGain(0.8),
      referenceWeight: liveweight(770),
      methaneProduction: massPerHeadPerDay('CH4', 0.0204),
      nitrogenExcreted: massPerHeadPerDay('N', 0.0092),
      volatileSolids: massPerHeadPerDay('Volatile Solids', 0.3003),
      averageStay: {
        preWeaned: days(84),
        weaned: days(281),
      },
      netEnergyForGrowth: {
        preWeaned: energyPerMass('Liveweight', megaJoulesToJoules(27.5)),
        weaned: energyPerMass('Liveweight', megaJoulesToJoules(11)),
      },
    },
  },

  /**
   * @description Constants for dairy feed and diet
   * @nir2024Vol2 A5.5.1.4
   */
  DIETARY_CONSTANTS: {
    dryMatterDigestibility: realNumber(0.75),
    crudeProtein: massPerMass('CrudeProtein', 'DryMatter', 0.2),
  },

  /**
   * @description Constants relating ot milk production in dairy cattle
   * @appendixA A.1.3.9
   * @nir2024Vol1 3.A.1a_2
   * @reference Australian Dairy Carbon Calculator
   */
  MILK_CONSTANTS: {
    // Ch 3.3.2.3 k
    EFFICIENCY_OF_MILK_PRODUCTION: realNumber(0.6),

    // Ch 3.3.2.3 FCj
    FAT_CONTENT: realNumber(4.0),
    // Ch 3.3.2.3 PCj
    PROTEIN_CONTENT: realNumber(3.3),

    // Ch 3.3.2.3 NE
    NET_ENERGY: energyPerMass('Milk', megaJoulesToJoules(3.054)),

    // Common Requirements Framework, 10.3.
    NET_ENERGY_FOR_INTENSITY_ALLOCATION: energyPerMass(
      'Milk',
      megaJoulesToJoules(3.1),
    ),
    // Ch 3.3.2.3 GEC
    GROSS_ENERGY_CONTENT: energyPerMass('DryMatter', megaJoulesToJoules(18.4)),
    // Ch 3.3.2.3 MRj
    INCREASE_METABOLIC_RATE_FOR_MILK: {
      milkingCows: realNumber(1.1),
      others: realNumber(1.0),
    },

    DENSITY_OF_MILK: massPerVolume('Milk', 'Milk', 1.03),
  },

  /**
   * @description Dairy liveweights by class and breed
   * @appendixA A.1.3.1
   */
  LIVEWEIGHTS_BY_BREED: {
    'Medium Friesian': {
      milkingCows: liveweight(550),
      heifersGt1: liveweight(380),
      heifersLt1: liveweight(155),
      bullsGt1: liveweight(600),
      bullsLt1: liveweight(225),
    },
    'Large Friesian': {
      milkingCows: liveweight(600),
      heifersGt1: liveweight(415),
      heifersLt1: liveweight(170),
      bullsGt1: liveweight(600),
      bullsLt1: liveweight(225),
    },
    'Holstein-Friesian': {
      milkingCows: liveweight(650),
      heifersGt1: liveweight(450),
      heifersLt1: liveweight(185),
      bullsGt1: liveweight(600),
      bullsLt1: liveweight(225),
    },
    'Friesian crossbred': {
      milkingCows: liveweight(500),
      heifersGt1: liveweight(350),
      heifersLt1: liveweight(145),
      bullsGt1: liveweight(600),
      bullsLt1: liveweight(225),
    },
    Jersey: {
      milkingCows: liveweight(400),
      heifersGt1: liveweight(275),
      heifersLt1: liveweight(115),
      bullsGt1: liveweight(600),
      bullsLt1: liveweight(225),
    },
    'Jersey crossbred': {
      milkingCows: liveweight(450),
      heifersGt1: liveweight(315),
      heifersLt1: liveweight(130),
      bullsGt1: liveweight(600),
      bullsLt1: liveweight(225),
    },
    Ayrshire: {
      milkingCows: liveweight(540),
      heifersGt1: liveweight(375),
      heifersLt1: liveweight(150),
      bullsGt1: liveweight(600),
      bullsLt1: liveweight(225),
    },
    Guernsey: {
      milkingCows: liveweight(480),
      heifersGt1: liveweight(335),
      heifersLt1: liveweight(140),
      bullsGt1: liveweight(600),
      bullsLt1: liveweight(225),
    },
    'Brown Swiss': {
      milkingCows: liveweight(600),
      heifersGt1: liveweight(415),
      heifersLt1: liveweight(170),
      bullsGt1: liveweight(600),
      bullsLt1: liveweight(225),
    },
    'Illawarra/Aussie Red': {
      milkingCows: liveweight(550),
      heifersGt1: liveweight(375),
      heifersLt1: liveweight(150),
      bullsGt1: liveweight(600),
      bullsLt1: liveweight(225),
    },
  },

  /**
   * @description Emissions factors for each of the MMS options for Dairy
   * @appendixA A.1.3.7, A.1.3.6
   */
  MMS: {
    anaerobicLagoon: {
      EFm: massPerMass('N2O', 'N', 0),
      FracGASM: massPerMass('Volatilised N', 'N', 0.35),
      METHANE_CONVERSION_FACTOR_BY_STATE: {
        ACT: realNumber(0.72),
        NSW: realNumber(0.76),
        NT: realNumber(0.8),
        QLD: realNumber(0.78),
        SA: realNumber(0.74),
        TAS: realNumber(0.69),
        VIC: realNumber(0.73),
        WA: realNumber(0.76),
      },
    },
    sumpDispersal: {
      EFm: massPerMass('N2O', 'N', 0),
      FracGASM: massPerMass('Volatilised N', 'N', 0.07),
      METHANE_CONVERSION_FACTOR_BY_STATE: {
        ...allStatesWithValue(0.005),
        NT: realNumber(0.01),
        TAS: realNumber(0.001),
      },
    },
    drainToPaddock: {
      EFm: massPerMass('N2O', 'N', 0),
      FracGASM: massPerMass('Volatilised N', 'N', 0.2),
      METHANE_CONVERSION_FACTOR_BY_STATE: {
        ACT: realNumber(0.15),
        NSW: realNumber(0.18),
        NT: realNumber(0.5),
        QLD: realNumber(0.24),
        SA: realNumber(0.17),
        TAS: realNumber(0.13),
        VIC: realNumber(0.17),
        WA: realNumber(0.18),
      },
    },
    solidStorage: {
      EFm: massPerMass('N2O', 'N', 0.005),
      FracGASM: massPerMass('Volatilised N', 'N', 0.3),
      METHANE_CONVERSION_FACTOR_BY_STATE: allStatesWithValue(0.02),
    },
    pastureRangeAndPaddock: {
      EFm: massPerMass('N2O', 'N', 0),
      FracGASM: massPerMass('Volatilised N', 'N', 0),
      METHANE_CONVERSION_FACTOR_BY_STATE: {
        ...allStatesWithValue(0.01),
        NT: realNumber(0.02),
      },
    },
  },
  /**
   * @description Fraction of waste separated by pre-treatment of manure
   * @reference Guidelines chapter 4.3.2.3 SSj (derived from NIR vol 2)
   */
  DEFAULT_SOLID_SEPARATION_RATE: realNumber(0.2),

  /**
   * @description Fraction of volatile solids voided to each manure management system
   * @appendixA A.1.3.10
   */
  TIME_IN_LOCATIONS: {
    'Grazed only': {
      feedpad: realNumber(0),
      milkingShed: realNumber(0.11),
      pasture: realNumber(0.89),
    },
    'Limited feedpad': {
      feedpad: realNumber(0.1),
      milkingShed: realNumber(0.11),
      pasture: realNumber(0.79),
    },
    'Limited grazing': {
      feedpad: realNumber(0.356),
      milkingShed: realNumber(0.11),
      pasture: realNumber(0.534),
    },
    'Zero grazing': {
      feedpad: realNumber(0.89),
      milkingShed: realNumber(0.11),
      pasture: realNumber(0),
    },
  },
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
  /**
   * @description Per class factors for poultry
   * @appendixA A.1.7.1
   * @reference IPCC Chapter 10 Table 10.16A
   */
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
    meatChickenBreeders: {
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

  /**
   * @description Factors for each type of poultry MMS
   * @appendixA A.1.7.2, A.1.7.3, A.1.7.4
   * @nir2024Vol2 A5.5.6.3, A5.5.6.4 footnotes
   */
  MMS: {
    manureWithLitter: {
      FracGASM: massPerMass('Volatilised N', 'N', 0.3),
      EFm: massPerMass('N2O', 'N', 0.001),
      fractionSolidsLost: realNumber(0.15),
      METHANE_CONVERSION_FACTOR_BY_STATE: allStatesWithValue(0.015),
    },
    beltManureRemoval: {
      FracGASM: massPerMass('Volatilised N', 'N', 0.05),
      EFm: massPerMass('N2O', 'N', 0.001),
      fractionSolidsLost: realNumber(0),
      METHANE_CONVERSION_FACTOR_BY_STATE: allStatesWithValue(0.015),
    },
    manureStoredInHouse: {
      FracGASM: massPerMass('Volatilised N', 'N', 0.4),
      EFm: massPerMass('N2O', 'N', 0.001),
      fractionSolidsLost: realNumber(0.2),
      METHANE_CONVERSION_FACTOR_BY_STATE: allStatesWithValue(0.015),
    },
    solidStorage: {
      FracGASM: massPerMass('Volatilised N', 'N', 0.2),
      EFm: massPerMass('N2O', 'N', 0.005),
      METHANE_CONVERSION_FACTOR_BY_STATE: allStatesWithValue(0.02),
    },
    composting: {
      FracGASM: massPerMass('Volatilised N', 'N', 0.2),
      EFm: massPerMass('N2O', 'N', 0.01),
      METHANE_CONVERSION_FACTOR_BY_STATE: {
        ...allStatesWithValue(0.01),
        TAS: realNumber(0.005),
      },
    },
    directProcessing: {
      FracGASM: massPerMass('Volatilised N', 'N', 0),
      EFm: massPerMass('N2O', 'N', 0),
      METHANE_CONVERSION_FACTOR_BY_STATE: allStatesWithValue(0),
    },
    digester: {
      FracGASM: massPerMass('Volatilised N', 'N', 0),
      EFm: massPerMass('N2O', 'N', 0),
      METHANE_CONVERSION_FACTOR_BY_STATE: allStatesWithValue(0.1),
    },
    pastureRangeAndPaddock: {
      EFm: massPerMass('N2O', 'N', 0),
      FracGASM: massPerMass('Volatilised N', 'N', 0),
      METHANE_CONVERSION_FACTOR_BY_STATE: {
        ...allStatesWithValue(0.01),
        // Status: waiting for response
        QLD: realNumber(0.03),
        NT: realNumber(0.03),
      },
    },
    directApplication: {
      METHANE_CONVERSION_FACTOR_BY_STATE: allStatesWithValue(0),
      EFm: massPerMass('N2O', 'N', 0),
      FracGASM: massPerMass('Volatilised N', 'N', 0),
    },
  },

  /*
   * @description Emission factor for 'Chicken for slaughtering, conventional rearing system'
   * @reference AusLCI V48
   */
  PURCHASED_LIVESTOCK_EF: massPerMass('CO2e', 'Liveweight', 1.03),

  /*
   * @description Poultry liveweights
   * @appendixA A.1.7.5
   */
  LIVEWEIGHT: {
    broilers: liveweight(1.2),
    chickens: liveweight(1.3),
    chicks: liveweight(0.04),
    hensGte1: liveweight(2),
    pullets: liveweight(1.4),
  },
};

export const livestockConstants: LivestockConstants = {
  name: 'LIVESTOCK',
  /**
   * Appendix A1 Table A.3.1.1 & AusLCI
   * @description Emissions factors for purchased feed, both regionless and by state. Factors are taken from Blueshift and AusLCI
   * @appendixA A.3.1.1
   */
  PURCHASED_FEED_FACTORS: {
    /**
     * Appendix A1 Table A.3.1.1, AusLCI V48 March 2026
     */
    regionless: {
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
      // AusLCI
      Bentonite: massPerMass('CO2e', 'Purchased Feed', 0.0652),
      'Blood Meal': massPerMass('CO2e', 'Purchased Feed', 0.41),
      'Meat Meal': massPerMass('CO2e', 'Purchased Feed', 0.41),
    },
    /**
     * AusLCI V48 March 2026
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
   * @description Emissions factors for purchased mineral supplements, taken from AusLCI V48 March 2026
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

  /**
   * @description Emissions factors for "Other livestock" types
   * @appendixA A.1.5.1, A.1.5.2, A.1.5.3
   */
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

  /**
   * @description Methane conversion factor for common MMS types, based on mean annual temperature (MAT)
   * @appendix A.1.8.1
   */
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
    deepLitter: allTemperaturesWithValues(0.04),
    pitStorage: allTemperaturesWithValues(0.03),
    // Labelled 'Daily spread'
    sumpDispersal: allTemperaturesWithValues({
      cool: 0.001,
      temperate: 0.005,
      warm: 0.01,
    }),
    // Liquid Slurry
    drainToPaddock: {
      '10 or below': realNumber(0.1),
      '11': realNumber(0.11),
      '12': realNumber(0.13),
      '13': realNumber(0.14),
      '14': realNumber(0.15),
      '15': realNumber(0.17),
      '16': realNumber(0.18),
      '17': realNumber(0.2),
      '18': realNumber(0.22),
      '19': realNumber(0.24),
      '20': realNumber(0.26),
      '21': realNumber(0.29),
      '22': realNumber(0.31),
      '23': realNumber(0.34),
      '24': realNumber(0.37),
      '25': realNumber(0.41),
      '26': realNumber(0.44),
      '27': realNumber(0.48),
      '28 or above': realNumber(0.5),
    },
  },

  OTHER_LIVESTOCK_MMS_FACTORS: {
    anaerobicLagoon: {
      /**
       * @description Methane conversion factor for "Other livestock" for uncovered anaerobic lagoon
       * @appendixA A.1.5.6
       */
      METHANE_CONVERSION_FACTOR_BY_STATE: {
        ACT: realNumber(0.71),
        NSW: realNumber(0.75),
        NT: realNumber(0.8),
        QLD: realNumber(0.78),
        SA: realNumber(0.74),
        TAS: realNumber(0.7),
        VIC: realNumber(0.74),
        WA: realNumber(0.76),
      },
      // NIR 2024 volume 2 Table A5.5.7.4
      ALLOCATION_TO_MMS_WITH_NATURAL_WATER: percentage(0.34),
    },
    pastureRangeAndPaddock: {
      /**
       * @description Methane conversion factor for "Other livestock" for pasture
       * @appendixA A.1.5.6
       */
      METHANE_CONVERSION_FACTOR_BY_STATE: allStatesWithValue(0.0047),
      // NIR 2024 volume 2 Table A5.5.7.4
      ALLOCATION_TO_MMS_WITH_NATURAL_WATER: percentage(99.66),
    },
  },

  /**
   * @description Emission factor for urine and dung posited on pasture, range or paddock
   * @appendixA A.2.2.2
   */
  EF_DEPOSITED_URINE_AND_DUNG_PRP: {
    wet: massPerMass('N2O', 'N', 0.006),
    dry: massPerMass('N2O', 'N', 0.002),
  },

  /**
   * Values are taken from the AusLCI draft national averages for sheep and beef,
   * depending on which of the two the guidelines advises is the most similar
   * for each livestock type.
   * @description Emissions factors for purchased "Other livestock" types, taken from AusLCI
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
   * @description Other livestock average liveweights
   * @appendixA A.1.5.4
   * @reference IPCC Chapter 10 Table 10.10 & Table 10A.5 (for Buffalo)
   */
  OTHER_PURCHASED_LIVESTOCK_AVERAGE_LIVEWEIGHTS: {
    Buffalo: liveweight(336),
    Goats: liveweight(50),
    Deer: liveweight(120),
    Camels: liveweight(570),
    Alpacas: liveweight(65),
    Horses: liveweight(550),
    'Mules/asses': liveweight(245),
    'Emus/ostriches': liveweight(120),
  },

  /**
   * @description The emissions potential of volatile solids to methane (CH4)
   * @reference IPCC Chapter 10 Table 10.16A
   */
  EMISSIONS_POTENTIAL_VOLATILE_SOLIDS_TO_CH4: {
    beef: volumePerMass('CH4', 'Volatile Solids', cubicMetresToLitres(0.19)),
    dairy: volumePerMass('CH4', 'Volatile Solids', cubicMetresToLitres(0.24)),
    sheep: volumePerMass('CH4', 'Volatile Solids', cubicMetresToLitres(0.19)),
    feedlot: volumePerMass('CH4', 'Volatile Solids', cubicMetresToLitres(0.19)),
    pigs: volumePerMass('CH4', 'Volatile Solids', cubicMetresToLitres(0.45)),
    other: volumePerMass('CH4', 'Volatile Solids', cubicMetresToLitres(0.19)),
  },

  /**
   * @description Ash content of feed intake expressed as a fraction
   * @nir2024Vol1 3.B.1a_1, 3.B.1b_1, 3.B.1c_1, 3.B.2_1
   */
  ASH_CONTENT_OF_MANURE: {
    feedlot: realNumber(0.16),
    beef: realNumber(0.08),
    sheep: realNumber(0.08),
    dairy: realNumber(0.08),
  },

  /**
   * @description Ratio of milk to nitrogen. For milk, a factor of 6.38 is used rather than 6.25.
   * @nir2024Vol1 3.B.1a_5
   */
  NITROGEN_TO_MILK_PROTEIN: massPerMass('Milk', 'N', 6.38),

  /**
   * @description Scope 3 emission factors for purchased livestock
   * @reference AusLCI V48
   */
  PURCHASED_EF: {
    // Dairy
    dairySpent: massPerMass('CO2e', 'Liveweight', 3.98),
    // Dairy and beef
    beefPrime: massPerMass('CO2e', 'Liveweight', 12.4),
    beefWeaned: massPerMass('CO2e', 'Liveweight', 13.29),
    // Sheep
    sheepMutton: massPerMass('CO2e', 'Liveweight', 6.03),
    sheepPrimeLamb: massPerMass('CO2e', 'Liveweight', 6.08),
    // Pigs
    pigsDefault: massPerMass('CO2e', 'Liveweight', 3.11),
    pigsConventionalRearingCoveredPond: massPerMass('CO2e', 'Liveweight', 2.05),
    pigsConventionalRearingUncoveredEffluentPond: massPerMass(
      'CO2e',
      'Liveweight',
      4.95,
    ),
    pigsDeepLitterRearing: massPerMass('CO2e', 'Liveweight', 1.66),
    pigsOutdoorRearing: massPerMass('CO2e', 'Liveweight', 2.06),
  },

  /**
   * @description Percentages to scale known average beef or sheep emission factors, to create a representative value for other livestock types
   */
  OTHER_LIVESTOCK_EF_PROPORTION: {
    'Emus/ostriches': percentage(56),
    'Mules/asses': percentage(16),
    Alpacas: percentage(89),
    Buffalo: percentage(100),
    Camels: percentage(73),
    Deer: percentage(32),
    Goats: percentage(56),
    Horses: percentage(29),
  },
};

export const beefPastureConstants: BeefPastureConstants = {
  name: 'BEEF_PASTURE',

  /**
   * @description Dry matter digestibility of feed intake
   * @units proportion
   * @appendixA A.1.2.5
   */
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

  /**
   * @description Crude protein content of feed intake
   * @appendixA A.1.2.6
   * @units proportion
   */
  CP: {
    'ACT/NSW': {
      spring: massPerMass('CrudeProtein', 'DryMatter', 0.07),
      summer: massPerMass('CrudeProtein', 'DryMatter', 0.13),
      autumn: massPerMass('CrudeProtein', 'DryMatter', 0.1),
      winter: massPerMass('CrudeProtein', 'DryMatter', 0.06),
    },
    NT: {
      spring: massPerMass('CrudeProtein', 'DryMatter', 0.058),
      summer: massPerMass('CrudeProtein', 'DryMatter', 0.092),
      autumn: massPerMass('CrudeProtein', 'DryMatter', 0.075),
      winter: massPerMass('CrudeProtein', 'DryMatter', 0.053),
    },
    QLD: {
      spring: massPerMass('CrudeProtein', 'DryMatter', 0.072),
      summer: massPerMass('CrudeProtein', 'DryMatter', 0.099),
      autumn: massPerMass('CrudeProtein', 'DryMatter', 0.078),
      winter: massPerMass('CrudeProtein', 'DryMatter', 0.059),
    },
    SA: {
      spring: massPerMass('CrudeProtein', 'DryMatter', 0.16),
      summer: massPerMass('CrudeProtein', 'DryMatter', 0.07),
      autumn: massPerMass('CrudeProtein', 'DryMatter', 0.09),
      winter: massPerMass('CrudeProtein', 'DryMatter', 0.2),
    },
    TAS: {
      spring: massPerMass('CrudeProtein', 'DryMatter', 0.2),
      summer: massPerMass('CrudeProtein', 'DryMatter', 0.1),
      autumn: massPerMass('CrudeProtein', 'DryMatter', 0.16),
      winter: massPerMass('CrudeProtein', 'DryMatter', 0.2),
    },
    VIC: {
      spring: massPerMass('CrudeProtein', 'DryMatter', 0.25),
      summer: massPerMass('CrudeProtein', 'DryMatter', 0.07),
      autumn: massPerMass('CrudeProtein', 'DryMatter', 0.1),
      winter: massPerMass('CrudeProtein', 'DryMatter', 0.21),
    },
    'WA - South West': {
      spring: massPerMass('CrudeProtein', 'DryMatter', 0.2),
      summer: massPerMass('CrudeProtein', 'DryMatter', 0.09),
      autumn: massPerMass('CrudeProtein', 'DryMatter', 0.06),
      winter: massPerMass('CrudeProtein', 'DryMatter', 0.2),
    },
    'WA - Pilbara': {
      spring: massPerMass('CrudeProtein', 'DryMatter', 0.04),
      summer: massPerMass('CrudeProtein', 'DryMatter', 0.12),
      autumn: massPerMass('CrudeProtein', 'DryMatter', 0.09),
      winter: massPerMass('CrudeProtein', 'DryMatter', 0.06),
    },
    'WA - Kimberley': {
      spring: massPerMass('CrudeProtein', 'DryMatter', 0.04),
      summer: massPerMass('CrudeProtein', 'DryMatter', 0.12),
      autumn: massPerMass('CrudeProtein', 'DryMatter', 0.09),
      winter: massPerMass('CrudeProtein', 'DryMatter', 0.06),
    },
  },

  /**
   * @description Standard reference weights
   * @units mass in kg
   * @appendixA A.1.2.8
   */
  REFERENCE_WEIGHT: {
    ACT: {
      bullsLt1: liveweight(700),
      bullsGt1: liveweight(700),
      cowsLt1: liveweight(500),
      cows1To2Years: liveweight(500),
      cows2To3Years: liveweight(500),
      cowsGt3Years: liveweight(500),
      steersLt1: liveweight(600),
      steers1To2Years: liveweight(600),
      steers2To3Years: liveweight(600),
      steersGt3Years: liveweight(600),
    },
    NSW: {
      // duplicate of ACT
      bullsLt1: liveweight(700),
      bullsGt1: liveweight(700),
      cowsLt1: liveweight(500),
      cows1To2Years: liveweight(500),
      cows2To3Years: liveweight(500),
      cowsGt3Years: liveweight(500),
      steersLt1: liveweight(600),
      steers1To2Years: liveweight(600),
      steers2To3Years: liveweight(600),
      steersGt3Years: liveweight(600),
    },
    NT: {
      bullsLt1: liveweight(770),
      bullsGt1: liveweight(770),
      cowsLt1: liveweight(550),
      cows1To2Years: liveweight(550),
      cows2To3Years: liveweight(550),
      cowsGt3Years: liveweight(550),
      steersLt1: liveweight(660),
      steers1To2Years: liveweight(660),
      steers2To3Years: liveweight(660),
      steersGt3Years: liveweight(660),
    },
    QLD: {
      bullsLt1: liveweight(770),
      bullsGt1: liveweight(770),
      cowsLt1: liveweight(550),
      cows1To2Years: liveweight(550),
      cows2To3Years: liveweight(550),
      cowsGt3Years: liveweight(550),
      steersLt1: liveweight(660),
      steers1To2Years: liveweight(660),
      steers2To3Years: liveweight(660),
      steersGt3Years: liveweight(660),
    },
    SA: {
      bullsLt1: liveweight(770),
      bullsGt1: liveweight(770),
      cowsLt1: liveweight(550),
      cows1To2Years: liveweight(550),
      cows2To3Years: liveweight(550),
      cowsGt3Years: liveweight(550),
      steersLt1: liveweight(660),
      steers1To2Years: liveweight(660),
      steers2To3Years: liveweight(660),
      steersGt3Years: liveweight(660),
    },
    TAS: {
      bullsLt1: liveweight(770),
      bullsGt1: liveweight(770),
      cowsLt1: liveweight(550),
      cows1To2Years: liveweight(550),
      cows2To3Years: liveweight(550),
      cowsGt3Years: liveweight(550),
      steersLt1: liveweight(660),
      steers1To2Years: liveweight(660),
      steers2To3Years: liveweight(660),
      steersGt3Years: liveweight(660),
    },
    VIC: {
      bullsLt1: liveweight(770),
      bullsGt1: liveweight(770),
      cowsLt1: liveweight(550),
      cows1To2Years: liveweight(550),
      cows2To3Years: liveweight(550),
      cowsGt3Years: liveweight(550),
      steersLt1: liveweight(660),
      steers1To2Years: liveweight(660),
      steers2To3Years: liveweight(660),
      steersGt3Years: liveweight(660),
    },
    WA: {
      bullsLt1: liveweight(770),
      bullsGt1: liveweight(770),
      cowsLt1: liveweight(550),
      cows1To2Years: liveweight(550),
      cows2To3Years: liveweight(550),
      cowsGt3Years: liveweight(550),
      steersLt1: liveweight(660),
      steers1To2Years: liveweight(660),
      steers2To3Years: liveweight(660),
      steersGt3Years: liveweight(660),
    },
  },

  /**
   * @description Methane conversion factor for pasture
   * @units proportion
   * @appendixA A.1.2.10
   */
  MCF_PASTURE: realNumber(0.0047),

  /**
   * @description Methane conversion factor per region for lagoons
   * @units proportion
   * @appendixA A.1.2.10
   */
  MCF_LAGOON: {
    ACT: realNumber(0.71),
    NSW: realNumber(0.75),
    SA: realNumber(0.74),
    TAS: realNumber(0.7),
    VIC: realNumber(0.74),
    'WA - South West': realNumber(0.76),
    'WA - Pilbara': realNumber(0.76),
    'WA - Kimberley': realNumber(0.76),
    'NT - Alice Springs': realNumber(0.8),
    'NT - Barkly': realNumber(0.8),
    'NT - Northern': realNumber(0.8),
    'QLD - High': realNumber(0.78),
    'QLD - Moderate/High': realNumber(0.78),
    'QLD - Moderate/Low': realNumber(0.78),
    'QLD - Low': realNumber(0.78),
  },

  /**
   * @description Liveweight of beef pasture cattle, by state/region
   * @units kg
   * @appendixA A.1.2.1
   */
  LIVEWEIGHT: {
    'ACT/NSW': {
      bullsLt1: {
        spring: {
          liveweight: liveweight(80),
          liveweightGain: liveweightGain(0.5),
        },
        summer: {
          liveweight: liveweight(170),
          liveweightGain: liveweightGain(1),
        },
        autumn: {
          liveweight: liveweight(240),
          liveweightGain: liveweightGain(0.8),
        },
        winter: {
          liveweight: liveweight(280),
          liveweightGain: liveweightGain(0.4),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: liveweight(480),
          liveweightGain: liveweightGain(0.2),
        },
        summer: {
          liveweight: liveweight(520),
          liveweightGain: liveweightGain(0.4),
        },
        autumn: {
          liveweight: liveweight(550),
          liveweightGain: liveweightGain(0.3),
        },
        winter: {
          liveweight: liveweight(560),
          liveweightGain: liveweightGain(0.1),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: liveweight(75),
          liveweightGain: liveweightGain(0.5),
        },
        summer: {
          liveweight: liveweight(160),
          liveweightGain: liveweightGain(0.9),
        },
        autumn: {
          liveweight: liveweight(220),
          liveweightGain: liveweightGain(0.7),
        },
        winter: {
          liveweight: liveweight(260),
          liveweightGain: liveweightGain(0.4),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: liveweight(300),
          liveweightGain: liveweightGain(0.4),
        },
        summer: {
          liveweight: liveweight(360),
          liveweightGain: liveweightGain(0.7),
        },
        autumn: {
          liveweight: liveweight(390),
          liveweightGain: liveweightGain(0.3),
        },
        winter: {
          liveweight: liveweight(410),
          liveweightGain: liveweightGain(0.2),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: liveweight(440),
          liveweightGain: liveweightGain(0.3),
        },
        summer: {
          liveweight: liveweight(470),
          liveweightGain: liveweightGain(0.3),
        },
        autumn: {
          liveweight: liveweight(490),
          liveweightGain: liveweightGain(0.2),
        },
        winter: {
          liveweight: liveweight(500),
          liveweightGain: liveweightGain(0.1),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: liveweight(440),
          liveweightGain: liveweightGain(0.3),
        },
        summer: {
          liveweight: liveweight(470),
          liveweightGain: liveweightGain(0.3),
        },
        autumn: {
          liveweight: liveweight(490),
          liveweightGain: liveweightGain(0.2),
        },
        winter: {
          liveweight: liveweight(500),
          liveweightGain: liveweightGain(0.1),
        },
      },
      steersLt1: {
        spring: {
          liveweight: liveweight(75),
          liveweightGain: liveweightGain(0.5),
        },
        summer: {
          liveweight: liveweight(160),
          liveweightGain: liveweightGain(0.9),
        },
        autumn: {
          liveweight: liveweight(220),
          liveweightGain: liveweightGain(0.7),
        },
        winter: {
          liveweight: liveweight(260),
          liveweightGain: liveweightGain(0.4),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: liveweight(380),
          liveweightGain: liveweightGain(0.4),
        },
        summer: {
          liveweight: liveweight(420),
          liveweightGain: liveweightGain(0.4),
        },
        autumn: {
          liveweight: liveweight(450),
          liveweightGain: liveweightGain(0.3),
        },
        winter: {
          liveweight: liveweight(460),
          liveweightGain: liveweightGain(0.1),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: liveweight(380),
          liveweightGain: liveweightGain(0.4),
        },
        summer: {
          liveweight: liveweight(420),
          liveweightGain: liveweightGain(0.4),
        },
        autumn: {
          liveweight: liveweight(450),
          liveweightGain: liveweightGain(0.3),
        },
        winter: {
          liveweight: liveweight(460),
          liveweightGain: liveweightGain(0.1),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: liveweight(380),
          liveweightGain: liveweightGain(0.4),
        },
        summer: {
          liveweight: liveweight(420),
          liveweightGain: liveweightGain(0.4),
        },
        autumn: {
          liveweight: liveweight(450),
          liveweightGain: liveweightGain(0.3),
        },
        winter: {
          liveweight: liveweight(460),
          liveweightGain: liveweightGain(0.1),
        },
      },
    },
    SA: {
      bullsLt1: {
        spring: {
          liveweight: liveweight(250),
          liveweightGain: liveweightGain(0.99),
        },
        summer: {
          liveweight: liveweight(320),
          liveweightGain: liveweightGain(0.77),
        },
        autumn: {
          liveweight: liveweight(80),
          liveweightGain: liveweightGain(0.9),
        },
        winter: {
          liveweight: liveweight(160),
          liveweightGain: liveweightGain(0.88),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: liveweight(800),
          liveweightGain: liveweightGain(1.1),
        },
        summer: {
          liveweight: liveweight(800),
          liveweightGain: liveweightGain(0),
        },
        autumn: {
          liveweight: liveweight(700),
          liveweightGain: liveweightGain(-1.1),
        },
        winter: {
          liveweight: liveweight(700),
          liveweightGain: liveweightGain(0),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: liveweight(220),
          liveweightGain: liveweightGain(0.88),
        },
        summer: {
          liveweight: liveweight(280),
          liveweightGain: liveweightGain(0.66),
        },
        autumn: {
          liveweight: liveweight(70),
          liveweightGain: liveweightGain(0.7),
        },
        winter: {
          liveweight: liveweight(140),
          liveweightGain: liveweightGain(0.77),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: liveweight(400),
          liveweightGain: liveweightGain(0.55),
        },
        summer: {
          liveweight: liveweight(420),
          liveweightGain: liveweightGain(0.22),
        },
        autumn: {
          liveweight: liveweight(300),
          liveweightGain: liveweightGain(0.22),
        },
        winter: {
          liveweight: liveweight(350),
          liveweightGain: liveweightGain(0.55),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: liveweight(500),
          liveweightGain: liveweightGain(0.55),
        },
        summer: {
          liveweight: liveweight(500),
          liveweightGain: liveweightGain(0),
        },
        autumn: {
          liveweight: liveweight(450),
          liveweightGain: liveweightGain(-0.55),
        },
        winter: {
          liveweight: liveweight(450),
          liveweightGain: liveweightGain(0),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: liveweight(500),
          liveweightGain: liveweightGain(0.55),
        },
        summer: {
          liveweight: liveweight(500),
          liveweightGain: liveweightGain(0),
        },
        autumn: {
          liveweight: liveweight(450),
          liveweightGain: liveweightGain(-0.55),
        },
        winter: {
          liveweight: liveweight(450),
          liveweightGain: liveweightGain(0),
        },
      },
      steersLt1: {
        spring: {
          liveweight: liveweight(230),
          liveweightGain: liveweightGain(0.88),
        },
        summer: {
          liveweight: liveweight(290),
          liveweightGain: liveweightGain(0.66),
        },
        autumn: {
          liveweight: liveweight(75),
          liveweightGain: liveweightGain(0.8),
        },
        winter: {
          liveweight: liveweight(150),
          liveweightGain: liveweightGain(0.82),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: liveweight(420),
          liveweightGain: liveweightGain(0.22),
        },
        summer: {
          liveweight: liveweight(420),
          liveweightGain: liveweightGain(0),
        },
        autumn: {
          liveweight: liveweight(400),
          liveweightGain: liveweightGain(-0.22),
        },
        winter: {
          liveweight: liveweight(400),
          liveweightGain: liveweightGain(0),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: liveweight(420),
          liveweightGain: liveweightGain(0.22),
        },
        summer: {
          liveweight: liveweight(420),
          liveweightGain: liveweightGain(0),
        },
        autumn: {
          liveweight: liveweight(400),
          liveweightGain: liveweightGain(-0.22),
        },
        winter: {
          liveweight: liveweight(400),
          liveweightGain: liveweightGain(0),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: liveweight(420),
          liveweightGain: liveweightGain(0.22),
        },
        summer: {
          liveweight: liveweight(420),
          liveweightGain: liveweightGain(0),
        },
        autumn: {
          liveweight: liveweight(400),
          liveweightGain: liveweightGain(-0.22),
        },
        winter: {
          liveweight: liveweight(400),
          liveweightGain: liveweightGain(0),
        },
      },
    },
    TAS: {
      bullsLt1: {
        spring: {
          liveweight: liveweight(105),
          liveweightGain: liveweightGain(1),
        },
        summer: {
          liveweight: liveweight(480),
          liveweightGain: liveweightGain(0.82),
        },
        autumn: {
          liveweight: liveweight(250),
          liveweightGain: liveweightGain(0.77),
        },
        winter: {
          liveweight: liveweight(260),
          liveweightGain: liveweightGain(0.11),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: liveweight(700),
          liveweightGain: liveweightGain(0.5),
        },
        summer: {
          liveweight: liveweight(750),
          liveweightGain: liveweightGain(0.55),
        },
        autumn: {
          liveweight: liveweight(725),
          liveweightGain: liveweightGain(0.5),
        },
        winter: {
          liveweight: liveweight(700),
          liveweightGain: liveweightGain(-0.27),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: liveweight(85),
          liveweightGain: liveweightGain(1),
        },
        summer: {
          liveweight: liveweight(150),
          liveweightGain: liveweightGain(0.71),
        },
        autumn: {
          liveweight: liveweight(200),
          liveweightGain: liveweightGain(0.55),
        },
        winter: {
          liveweight: liveweight(210),
          liveweightGain: liveweightGain(0.11),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: liveweight(300),
          liveweightGain: liveweightGain(1),
        },
        summer: {
          liveweight: liveweight(350),
          liveweightGain: liveweightGain(0.55),
        },
        autumn: {
          liveweight: liveweight(360),
          liveweightGain: liveweightGain(0.11),
        },
        winter: {
          liveweight: liveweight(380),
          liveweightGain: liveweightGain(0.22),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: liveweight(490),
          liveweightGain: liveweightGain(0.55),
        },
        summer: {
          liveweight: liveweight(530),
          liveweightGain: liveweightGain(0.44),
        },
        autumn: {
          liveweight: liveweight(500),
          liveweightGain: liveweightGain(-0.33),
        },
        winter: {
          liveweight: liveweight(460),
          liveweightGain: liveweightGain(-0.44),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: liveweight(490),
          liveweightGain: liveweightGain(0.55),
        },
        summer: {
          liveweight: liveweight(530),
          liveweightGain: liveweightGain(0.44),
        },
        autumn: {
          liveweight: liveweight(500),
          liveweightGain: liveweightGain(-0.33),
        },
        winter: {
          liveweight: liveweight(460),
          liveweightGain: liveweightGain(-0.44),
        },
      },
      steersLt1: {
        spring: {
          liveweight: liveweight(90),
          liveweightGain: liveweightGain(1),
        },
        summer: {
          liveweight: liveweight(160),
          liveweightGain: liveweightGain(0.77),
        },
        autumn: {
          liveweight: liveweight(215),
          liveweightGain: liveweightGain(0.6),
        },
        winter: {
          liveweight: liveweight(230),
          liveweightGain: liveweightGain(0.16),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: liveweight(480),
          liveweightGain: liveweightGain(0.5),
        },
        summer: {
          liveweight: liveweight(460),
          liveweightGain: liveweightGain(0.5),
        },
        autumn: {
          liveweight: liveweight(490),
          liveweightGain: liveweightGain(0.33),
        },
        winter: {
          liveweight: liveweight(470),
          liveweightGain: liveweightGain(-0.22),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: liveweight(480),
          liveweightGain: liveweightGain(0.5),
        },
        summer: {
          liveweight: liveweight(460),
          liveweightGain: liveweightGain(0.5),
        },
        autumn: {
          liveweight: liveweight(490),
          liveweightGain: liveweightGain(0.33),
        },
        winter: {
          liveweight: liveweight(470),
          liveweightGain: liveweightGain(-0.22),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: liveweight(480),
          liveweightGain: liveweightGain(0.5),
        },
        summer: {
          liveweight: liveweight(460),
          liveweightGain: liveweightGain(0.5),
        },
        autumn: {
          liveweight: liveweight(490),
          liveweightGain: liveweightGain(0.33),
        },
        winter: {
          liveweight: liveweight(470),
          liveweightGain: liveweightGain(-0.22),
        },
      },
    },
    VIC: {
      bullsLt1: {
        spring: {
          liveweight: liveweight(250),
          liveweightGain: liveweightGain(1.1),
        },
        summer: {
          liveweight: liveweight(280),
          liveweightGain: liveweightGain(0.33),
        },
        autumn: {
          liveweight: liveweight(100),
          liveweightGain: liveweightGain(0.5),
        },
        winter: {
          liveweight: liveweight(150),
          liveweightGain: liveweightGain(0.55),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: liveweight(820),
          liveweightGain: liveweightGain(1.1),
        },
        summer: {
          liveweight: liveweight(850),
          liveweightGain: liveweightGain(0.33),
        },
        autumn: {
          liveweight: liveweight(700),
          liveweightGain: liveweightGain(0.2),
        },
        winter: {
          liveweight: liveweight(720),
          liveweightGain: liveweightGain(0.22),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: liveweight(240),
          liveweightGain: liveweightGain(1.1),
        },
        summer: {
          liveweight: liveweight(260),
          liveweightGain: liveweightGain(0.22),
        },
        autumn: {
          liveweight: liveweight(95),
          liveweightGain: liveweightGain(0.55),
        },
        winter: {
          liveweight: liveweight(140),
          liveweightGain: liveweightGain(0.49),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: liveweight(410),
          liveweightGain: liveweightGain(0.99),
        },
        summer: {
          liveweight: liveweight(440),
          liveweightGain: liveweightGain(0.33),
        },
        autumn: {
          liveweight: liveweight(300),
          liveweightGain: liveweightGain(0.44),
        },
        winter: {
          liveweight: liveweight(320),
          liveweightGain: liveweightGain(0.22),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: liveweight(560),
          liveweightGain: liveweightGain(0.99),
        },
        summer: {
          liveweight: liveweight(550),
          liveweightGain: liveweightGain(-0.1),
        },
        autumn: {
          liveweight: liveweight(450),
          liveweightGain: liveweightGain(0.2),
        },
        winter: {
          liveweight: liveweight(470),
          liveweightGain: liveweightGain(0.22),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: liveweight(560),
          liveweightGain: liveweightGain(0.99),
        },
        summer: {
          liveweight: liveweight(550),
          liveweightGain: liveweightGain(-0.1),
        },
        autumn: {
          liveweight: liveweight(450),
          liveweightGain: liveweightGain(0.2),
        },
        winter: {
          liveweight: liveweight(470),
          liveweightGain: liveweightGain(0.22),
        },
      },
      steersLt1: {
        spring: {
          liveweight: liveweight(240),
          liveweightGain: liveweightGain(1.1),
        },
        summer: {
          liveweight: liveweight(270),
          liveweightGain: liveweightGain(0.33),
        },
        autumn: {
          liveweight: liveweight(95),
          liveweightGain: liveweightGain(0.55),
        },
        winter: {
          liveweight: liveweight(140),
          liveweightGain: liveweightGain(0.49),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: liveweight(510),
          liveweightGain: liveweightGain(0.77),
        },
        summer: {
          liveweight: liveweight(520),
          liveweightGain: liveweightGain(0.11),
        },
        autumn: {
          liveweight: liveweight(410),
          liveweightGain: liveweightGain(0.2),
        },
        winter: {
          liveweight: liveweight(440),
          liveweightGain: liveweightGain(0.33),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: liveweight(510),
          liveweightGain: liveweightGain(0.77),
        },
        summer: {
          liveweight: liveweight(520),
          liveweightGain: liveweightGain(0.11),
        },
        autumn: {
          liveweight: liveweight(410),
          liveweightGain: liveweightGain(0.2),
        },
        winter: {
          liveweight: liveweight(440),
          liveweightGain: liveweightGain(0.33),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: liveweight(510),
          liveweightGain: liveweightGain(0.77),
        },
        summer: {
          liveweight: liveweight(520),
          liveweightGain: liveweightGain(0.11),
        },
        autumn: {
          liveweight: liveweight(410),
          liveweightGain: liveweightGain(0.2),
        },
        winter: {
          liveweight: liveweight(440),
          liveweightGain: liveweightGain(0.33),
        },
      },
    },
    'WA - South West': {
      bullsLt1: {
        spring: {
          liveweight: liveweight(340),
          liveweightGain: liveweightGain(1.64),
        },
        summer: {
          liveweight: liveweight(380),
          liveweightGain: liveweightGain(0.44),
        },
        autumn: {
          liveweight: liveweight(100),
          liveweightGain: liveweightGain(0.6),
        },
        winter: {
          liveweight: liveweight(190),
          liveweightGain: liveweightGain(0.99),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: liveweight(800),
          liveweightGain: liveweightGain(1.1),
        },
        summer: {
          liveweight: liveweight(780),
          liveweightGain: liveweightGain(-0.22),
        },
        autumn: {
          liveweight: liveweight(680),
          liveweightGain: liveweightGain(0),
        },
        winter: {
          liveweight: liveweight(700),
          liveweightGain: liveweightGain(0.22),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: liveweight(260),
          liveweightGain: liveweightGain(1.21),
        },
        summer: {
          liveweight: liveweight(300),
          liveweightGain: liveweightGain(0.44),
        },
        autumn: {
          liveweight: liveweight(80),
          liveweightGain: liveweightGain(0.6),
        },
        winter: {
          liveweight: liveweight(150),
          liveweightGain: liveweightGain(0.77),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: liveweight(420),
          liveweightGain: liveweightGain(0.99),
        },
        summer: {
          liveweight: liveweight(450),
          liveweightGain: liveweightGain(0.33),
        },
        autumn: {
          liveweight: liveweight(320),
          liveweightGain: liveweightGain(0.22),
        },
        winter: {
          liveweight: liveweight(330),
          liveweightGain: liveweightGain(0.11),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: liveweight(550),
          liveweightGain: liveweightGain(0.66),
        },
        summer: {
          liveweight: liveweight(530),
          liveweightGain: liveweightGain(-0.22),
        },
        autumn: {
          liveweight: liveweight(480),
          liveweightGain: liveweightGain(-0.55),
        },
        winter: {
          liveweight: liveweight(490),
          liveweightGain: liveweightGain(0.11),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: liveweight(550),
          liveweightGain: liveweightGain(0.66),
        },
        summer: {
          liveweight: liveweight(530),
          liveweightGain: liveweightGain(-0.22),
        },
        autumn: {
          liveweight: liveweight(480),
          liveweightGain: liveweightGain(-0.55),
        },
        winter: {
          liveweight: liveweight(490),
          liveweightGain: liveweightGain(0.11),
        },
      },
      steersLt1: {
        spring: {
          liveweight: liveweight(300),
          liveweightGain: liveweightGain(1.42),
        },
        summer: {
          liveweight: liveweight(340),
          liveweightGain: liveweightGain(0.44),
        },
        autumn: {
          liveweight: liveweight(100),
          liveweightGain: liveweightGain(0.6),
        },
        winter: {
          liveweight: liveweight(170),
          liveweightGain: liveweightGain(0.77),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: liveweight(480),
          liveweightGain: liveweightGain(1.1),
        },
        summer: {
          liveweight: liveweight(470),
          liveweightGain: liveweightGain(-0.11),
        },
        autumn: {
          liveweight: liveweight(340),
          liveweightGain: liveweightGain(0),
        },
        winter: {
          liveweight: liveweight(360),
          liveweightGain: liveweightGain(0.44),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: liveweight(480),
          liveweightGain: liveweightGain(1.1),
        },
        summer: {
          liveweight: liveweight(470),
          liveweightGain: liveweightGain(-0.11),
        },
        autumn: {
          liveweight: liveweight(340),
          liveweightGain: liveweightGain(0),
        },
        winter: {
          liveweight: liveweight(360),
          liveweightGain: liveweightGain(0.44),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: liveweight(480),
          liveweightGain: liveweightGain(1.1),
        },
        summer: {
          liveweight: liveweight(470),
          liveweightGain: liveweightGain(-0.11),
        },
        autumn: {
          liveweight: liveweight(340),
          liveweightGain: liveweightGain(0),
        },
        winter: {
          liveweight: liveweight(360),
          liveweightGain: liveweightGain(0.44),
        },
      },
    },
    'WA - Pilbara': {
      bullsLt1: {
        spring: {
          liveweight: liveweight(80),
          liveweightGain: liveweightGain(0.7),
        },
        summer: {
          liveweight: liveweight(150),
          liveweightGain: liveweightGain(0.77),
        },
        autumn: {
          liveweight: liveweight(230),
          liveweightGain: liveweightGain(0.88),
        },
        winter: {
          liveweight: liveweight(250),
          liveweightGain: liveweightGain(0.22),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: liveweight(450),
          liveweightGain: liveweightGain(-0.55),
        },
        summer: {
          liveweight: liveweight(500),
          liveweightGain: liveweightGain(0.55),
        },
        autumn: {
          liveweight: liveweight(550),
          liveweightGain: liveweightGain(0.55),
        },
        winter: {
          liveweight: liveweight(500),
          liveweightGain: liveweightGain(-0.55),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: liveweight(70),
          liveweightGain: liveweightGain(0.7),
        },
        summer: {
          liveweight: liveweight(140),
          liveweightGain: liveweightGain(0.77),
        },
        autumn: {
          liveweight: liveweight(220),
          liveweightGain: liveweightGain(0.88),
        },
        winter: {
          liveweight: liveweight(240),
          liveweightGain: liveweightGain(0.22),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: liveweight(260),
          liveweightGain: liveweightGain(0.22),
        },
        summer: {
          liveweight: liveweight(310),
          liveweightGain: liveweightGain(0.66),
        },
        autumn: {
          liveweight: liveweight(330),
          liveweightGain: liveweightGain(0.22),
        },
        winter: {
          liveweight: liveweight(340),
          liveweightGain: liveweightGain(0.11),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: liveweight(340),
          liveweightGain: liveweightGain(-0.22),
        },
        summer: {
          liveweight: liveweight(360),
          liveweightGain: liveweightGain(0.55),
        },
        autumn: {
          liveweight: liveweight(380),
          liveweightGain: liveweightGain(0.22),
        },
        winter: {
          liveweight: liveweight(360),
          liveweightGain: liveweightGain(-0.22),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: liveweight(340),
          liveweightGain: liveweightGain(-0.22),
        },
        summer: {
          liveweight: liveweight(360),
          liveweightGain: liveweightGain(0.55),
        },
        autumn: {
          liveweight: liveweight(380),
          liveweightGain: liveweightGain(0.22),
        },
        winter: {
          liveweight: liveweight(360),
          liveweightGain: liveweightGain(-0.22),
        },
      },
      steersLt1: {
        spring: {
          liveweight: liveweight(80),
          liveweightGain: liveweightGain(0.7),
        },
        summer: {
          liveweight: liveweight(150),
          liveweightGain: liveweightGain(0.77),
        },
        autumn: {
          liveweight: liveweight(230),
          liveweightGain: liveweightGain(0.88),
        },
        winter: {
          liveweight: liveweight(250),
          liveweightGain: liveweightGain(0.22),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: liveweight(370),
          liveweightGain: liveweightGain(-0.22),
        },
        summer: {
          liveweight: liveweight(400),
          liveweightGain: liveweightGain(0.33),
        },
        autumn: {
          liveweight: liveweight(420),
          liveweightGain: liveweightGain(0.22),
        },
        winter: {
          liveweight: liveweight(390),
          liveweightGain: liveweightGain(-0.33),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: liveweight(370),
          liveweightGain: liveweightGain(-0.22),
        },
        summer: {
          liveweight: liveweight(400),
          liveweightGain: liveweightGain(0.33),
        },
        autumn: {
          liveweight: liveweight(420),
          liveweightGain: liveweightGain(0.22),
        },
        winter: {
          liveweight: liveweight(390),
          liveweightGain: liveweightGain(-0.33),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: liveweight(370),
          liveweightGain: liveweightGain(-0.22),
        },
        summer: {
          liveweight: liveweight(400),
          liveweightGain: liveweightGain(0.33),
        },
        autumn: {
          liveweight: liveweight(420),
          liveweightGain: liveweightGain(0.22),
        },
        winter: {
          liveweight: liveweight(390),
          liveweightGain: liveweightGain(-0.33),
        },
      },
    },
    'WA - Kimberley': {
      bullsLt1: {
        spring: {
          liveweight: liveweight(220),
          liveweightGain: liveweightGain(0.22),
        },
        summer: {
          liveweight: liveweight(110),
          liveweightGain: liveweightGain(0.8),
        },
        autumn: {
          liveweight: liveweight(170),
          liveweightGain: liveweightGain(0.66),
        },
        winter: {
          liveweight: liveweight(200),
          liveweightGain: liveweightGain(0.33),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: liveweight(500),
          liveweightGain: liveweightGain(-0.55),
        },
        summer: {
          liveweight: liveweight(550),
          liveweightGain: liveweightGain(0.55),
        },
        autumn: {
          liveweight: liveweight(600),
          liveweightGain: liveweightGain(0.55),
        },
        winter: {
          liveweight: liveweight(550),
          liveweightGain: liveweightGain(-0.55),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: liveweight(180),
          liveweightGain: liveweightGain(0.33),
        },
        summer: {
          liveweight: liveweight(90),
          liveweightGain: liveweightGain(0.7),
        },
        autumn: {
          liveweight: liveweight(140),
          liveweightGain: liveweightGain(0.55),
        },
        winter: {
          liveweight: liveweight(150),
          liveweightGain: liveweightGain(0.11),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: liveweight(300),
          liveweightGain: liveweightGain(0.22),
        },
        summer: {
          liveweight: liveweight(220),
          liveweightGain: liveweightGain(0.44),
        },
        autumn: {
          liveweight: liveweight(270),
          liveweightGain: liveweightGain(0.55),
        },
        winter: {
          liveweight: liveweight(280),
          liveweightGain: liveweightGain(0.11),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: liveweight(320),
          liveweightGain: liveweightGain(-0.33),
        },
        summer: {
          liveweight: liveweight(380),
          liveweightGain: liveweightGain(0.66),
        },
        autumn: {
          liveweight: liveweight(390),
          liveweightGain: liveweightGain(0.11),
        },
        winter: {
          liveweight: liveweight(350),
          liveweightGain: liveweightGain(-0.44),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: liveweight(320),
          liveweightGain: liveweightGain(-0.33),
        },
        summer: {
          liveweight: liveweight(380),
          liveweightGain: liveweightGain(0.66),
        },
        autumn: {
          liveweight: liveweight(390),
          liveweightGain: liveweightGain(0.11),
        },
        winter: {
          liveweight: liveweight(350),
          liveweightGain: liveweightGain(-0.44),
        },
      },
      steersLt1: {
        spring: {
          liveweight: liveweight(210),
          liveweightGain: liveweightGain(0.22),
        },
        summer: {
          liveweight: liveweight(100),
          liveweightGain: liveweightGain(0.8),
        },
        autumn: {
          liveweight: liveweight(160),
          liveweightGain: liveweightGain(0.66),
        },
        winter: {
          liveweight: liveweight(190),
          liveweightGain: liveweightGain(0.33),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: liveweight(340),
          liveweightGain: liveweightGain(-0.66),
        },
        summer: {
          liveweight: liveweight(390),
          liveweightGain: liveweightGain(0.55),
        },
        autumn: {
          liveweight: liveweight(430),
          liveweightGain: liveweightGain(0.44),
        },
        winter: {
          liveweight: liveweight(400),
          liveweightGain: liveweightGain(-0.33),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: liveweight(340),
          liveweightGain: liveweightGain(-0.66),
        },
        summer: {
          liveweight: liveweight(390),
          liveweightGain: liveweightGain(0.55),
        },
        autumn: {
          liveweight: liveweight(430),
          liveweightGain: liveweightGain(0.44),
        },
        winter: {
          liveweight: liveweight(400),
          liveweightGain: liveweightGain(-0.33),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: liveweight(340),
          liveweightGain: liveweightGain(-0.66),
        },
        summer: {
          liveweight: liveweight(390),
          liveweightGain: liveweightGain(0.55),
        },
        autumn: {
          liveweight: liveweight(430),
          liveweightGain: liveweightGain(0.44),
        },
        winter: {
          liveweight: liveweight(400),
          liveweightGain: liveweightGain(-0.33),
        },
      },
    },
    'NT - Alice Springs': {
      bullsLt1: {
        spring: {
          liveweight: liveweight(220),
          liveweightGain: liveweightGain(0.22),
        },
        summer: {
          liveweight: liveweight(110),
          liveweightGain: liveweightGain(0.66),
        },
        autumn: {
          liveweight: liveweight(170),
          liveweightGain: liveweightGain(0.49),
        },
        winter: {
          liveweight: liveweight(200),
          liveweightGain: liveweightGain(0.27),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: liveweight(706),
          liveweightGain: liveweightGain(-0.23),
        },
        summer: {
          liveweight: liveweight(703),
          liveweightGain: liveweightGain(0.2),
        },
        autumn: {
          liveweight: liveweight(721),
          liveweightGain: liveweightGain(0.13),
        },
        winter: {
          liveweight: liveweight(727),
          liveweightGain: liveweightGain(-0.8),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: liveweight(208),
          liveweightGain: liveweightGain(0.25),
        },
        summer: {
          liveweight: liveweight(112),
          liveweightGain: liveweightGain(0.62),
        },
        autumn: {
          liveweight: liveweight(169),
          liveweightGain: liveweightGain(0.54),
        },
        winter: {
          liveweight: liveweight(211),
          liveweightGain: liveweightGain(0.22),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: liveweight(323),
          liveweightGain: liveweightGain(0.17),
        },
        summer: {
          liveweight: liveweight(256),
          liveweightGain: liveweightGain(0.54),
        },
        autumn: {
          liveweight: liveweight(306),
          liveweightGain: liveweightGain(0.45),
        },
        winter: {
          liveweight: liveweight(338),
          liveweightGain: liveweightGain(0.09),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: liveweight(415),
          liveweightGain: liveweightGain(0.18),
        },
        summer: {
          liveweight: liveweight(368),
          liveweightGain: liveweightGain(0.38),
        },
        autumn: {
          liveweight: liveweight(392),
          liveweightGain: liveweightGain(0.35),
        },
        winter: {
          liveweight: liveweight(432),
          liveweightGain: liveweightGain(0.12),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: liveweight(467),
          liveweightGain: liveweightGain(-0.28),
        },
        summer: {
          liveweight: liveweight(465),
          liveweightGain: liveweightGain(0.27),
        },
        autumn: {
          liveweight: liveweight(464),
          liveweightGain: liveweightGain(0.15),
        },
        winter: {
          liveweight: liveweight(492),
          liveweightGain: liveweightGain(0.02),
        },
      },
      steersLt1: {
        spring: {
          liveweight: liveweight(223),
          liveweightGain: liveweightGain(0.32),
        },
        summer: {
          liveweight: liveweight(108),
          liveweightGain: liveweightGain(0.75),
        },
        autumn: {
          liveweight: liveweight(176),
          liveweightGain: liveweightGain(0.63),
        },
        winter: {
          liveweight: liveweight(222),
          liveweightGain: liveweightGain(0.25),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: liveweight(371),
          liveweightGain: liveweightGain(0.24),
        },
        summer: {
          liveweight: liveweight(280),
          liveweightGain: liveweightGain(0.64),
        },
        autumn: {
          liveweight: liveweight(339),
          liveweightGain: liveweightGain(0.54),
        },
        winter: {
          liveweight: liveweight(377),
          liveweightGain: liveweightGain(0.18),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: liveweight(493),
          liveweightGain: liveweightGain(0.25),
        },
        summer: {
          liveweight: liveweight(421),
          liveweightGain: liveweightGain(0.55),
        },
        autumn: {
          liveweight: liveweight(470),
          liveweightGain: liveweightGain(0.42),
        },
        winter: {
          liveweight: liveweight(498),
          liveweightGain: liveweightGain(0.12),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: liveweight(585),
          liveweightGain: liveweightGain(-0.05),
        },
        summer: {
          liveweight: liveweight(543),
          liveweightGain: liveweightGain(0.48),
        },
        autumn: {
          liveweight: liveweight(580),
          liveweightGain: liveweightGain(0.26),
        },
        winter: {
          liveweight: liveweight(590),
          liveweightGain: liveweightGain(0.03),
        },
      },
    },
    'NT - Barkly': {
      bullsLt1: {
        spring: {
          liveweight: liveweight(220),
          liveweightGain: liveweightGain(0.22),
        },
        summer: {
          liveweight: liveweight(110),
          liveweightGain: liveweightGain(0.66),
        },
        autumn: {
          liveweight: liveweight(170),
          liveweightGain: liveweightGain(0.49),
        },
        winter: {
          liveweight: liveweight(200),
          liveweightGain: liveweightGain(0.27),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: liveweight(620),
          liveweightGain: liveweightGain(-0.44),
        },
        summer: {
          liveweight: liveweight(650),
          liveweightGain: liveweightGain(0.22),
        },
        autumn: {
          liveweight: liveweight(670),
          liveweightGain: liveweightGain(0.05),
        },
        winter: {
          liveweight: liveweight(660),
          liveweightGain: liveweightGain(-0.27),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: liveweight(227),
          liveweightGain: liveweightGain(0.2),
        },
        summer: {
          liveweight: liveweight(108),
          liveweightGain: liveweightGain(0.68),
        },
        autumn: {
          liveweight: liveweight(170),
          liveweightGain: liveweightGain(0.64),
        },
        winter: {
          liveweight: liveweight(225),
          liveweightGain: liveweightGain(0.31),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: liveweight(319),
          liveweightGain: liveweightGain(0.21),
        },
        summer: {
          liveweight: liveweight(262),
          liveweightGain: liveweightGain(0.22),
        },
        autumn: {
          liveweight: liveweight(266),
          liveweightGain: liveweightGain(0.25),
        },
        winter: {
          liveweight: liveweight(307),
          liveweightGain: liveweightGain(0.29),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: liveweight(398),
          liveweightGain: liveweightGain(0.18),
        },
        summer: {
          liveweight: liveweight(346),
          liveweightGain: liveweightGain(0.24),
        },
        autumn: {
          liveweight: liveweight(363),
          liveweightGain: liveweightGain(0.29),
        },
        winter: {
          liveweight: liveweight(398),
          liveweightGain: liveweightGain(0.19),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: liveweight(452),
          liveweightGain: liveweightGain(0.01),
        },
        summer: {
          liveweight: liveweight(430),
          liveweightGain: liveweightGain(0.25),
        },
        autumn: {
          liveweight: liveweight(444),
          liveweightGain: liveweightGain(0.12),
        },
        winter: {
          liveweight: liveweight(452),
          liveweightGain: liveweightGain(0.04),
        },
      },
      steersLt1: {
        spring: {
          liveweight: liveweight(216),
          liveweightGain: liveweightGain(0.12),
        },
        summer: {
          liveweight: liveweight(111),
          liveweightGain: liveweightGain(0.64),
        },
        autumn: {
          liveweight: liveweight(169),
          liveweightGain: liveweightGain(0.57),
        },
        winter: {
          liveweight: liveweight(214),
          liveweightGain: liveweightGain(0.26),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: liveweight(334),
          liveweightGain: liveweightGain(0.09),
        },
        summer: {
          liveweight: liveweight(236),
          liveweightGain: liveweightGain(0.37),
        },
        autumn: {
          liveweight: liveweight(282),
          liveweightGain: liveweightGain(0.49),
        },
        winter: {
          liveweight: liveweight(326),
          liveweightGain: liveweightGain(0.28),
        },
      },
      // NOT VALID
      steers2To3Years: {
        spring: {
          liveweight: liveweight(0),
          liveweightGain: liveweightGain(0),
        },
        summer: {
          liveweight: liveweight(0),
          liveweightGain: liveweightGain(0),
        },
        autumn: {
          liveweight: liveweight(0),
          liveweightGain: liveweightGain(0),
        },
        winter: {
          liveweight: liveweight(0),
          liveweightGain: liveweightGain(0),
        },
      },
      // NOT VALID
      steersGt3Years: {
        spring: {
          liveweight: liveweight(0),
          liveweightGain: liveweightGain(0),
        },
        summer: {
          liveweight: liveweight(0),
          liveweightGain: liveweightGain(0),
        },
        autumn: {
          liveweight: liveweight(0),
          liveweightGain: liveweightGain(0),
        },
        winter: {
          liveweight: liveweight(0),
          liveweightGain: liveweightGain(0),
        },
      },
    },
    'NT - Northern': {
      bullsLt1: {
        spring: {
          liveweight: liveweight(220),
          liveweightGain: liveweightGain(0.22),
        },
        summer: {
          liveweight: liveweight(110),
          liveweightGain: liveweightGain(0.66),
        },
        autumn: {
          liveweight: liveweight(170),
          liveweightGain: liveweightGain(0.49),
        },
        winter: {
          liveweight: liveweight(200),
          liveweightGain: liveweightGain(0.27),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: liveweight(620),
          liveweightGain: liveweightGain(-0.44),
        },
        summer: {
          liveweight: liveweight(650),
          liveweightGain: liveweightGain(0.22),
        },
        autumn: {
          liveweight: liveweight(670),
          liveweightGain: liveweightGain(0.05),
        },
        winter: {
          liveweight: liveweight(660),
          liveweightGain: liveweightGain(-0.27),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: liveweight(177),
          liveweightGain: liveweightGain(0),
        },
        summer: {
          liveweight: liveweight(102),
          liveweightGain: liveweightGain(0.79),
        },
        autumn: {
          liveweight: liveweight(173),
          liveweightGain: liveweightGain(0.55),
        },
        winter: {
          liveweight: liveweight(202),
          liveweightGain: liveweightGain(0.02),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: liveweight(267),
          liveweightGain: liveweightGain(0.15),
        },
        summer: {
          liveweight: liveweight(203),
          liveweightGain: liveweightGain(0.4),
        },
        autumn: {
          liveweight: liveweight(250),
          liveweightGain: liveweightGain(0.38),
        },
        winter: {
          liveweight: liveweight(272),
          liveweightGain: liveweightGain(0.09),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: liveweight(365),
          liveweightGain: liveweightGain(0.08),
        },
        summer: {
          liveweight: liveweight(299),
          liveweightGain: liveweightGain(0.38),
        },
        autumn: {
          liveweight: liveweight(336),
          liveweightGain: liveweightGain(0.36),
        },
        winter: {
          liveweight: liveweight(365),
          liveweightGain: liveweightGain(0.16),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: liveweight(406),
          liveweightGain: liveweightGain(0.17),
        },
        summer: {
          liveweight: liveweight(380),
          liveweightGain: liveweightGain(0.27),
        },
        autumn: {
          liveweight: liveweight(414),
          liveweightGain: liveweightGain(0.06),
        },
        winter: {
          liveweight: liveweight(390),
          liveweightGain: liveweightGain(-0.04),
        },
      },
      steersLt1: {
        spring: {
          liveweight: liveweight(231),
          liveweightGain: liveweightGain(0.06),
        },
        summer: {
          liveweight: liveweight(102),
          liveweightGain: liveweightGain(0.8),
        },
        autumn: {
          liveweight: liveweight(175),
          liveweightGain: liveweightGain(0.58),
        },
        winter: {
          liveweight: liveweight(208),
          liveweightGain: liveweightGain(0.21),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: liveweight(249),
          liveweightGain: liveweightGain(0.02),
        },
        summer: {
          liveweight: liveweight(218),
          liveweightGain: liveweightGain(0.16),
        },
        autumn: {
          liveweight: liveweight(243),
          liveweightGain: liveweightGain(0.23),
        },
        winter: {
          liveweight: liveweight(260),
          liveweightGain: liveweightGain(0.03),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: liveweight(324),
          liveweightGain: liveweightGain(-0.14),
        },
        summer: {
          liveweight: liveweight(263),
          liveweightGain: liveweightGain(0.3),
        },
        autumn: {
          liveweight: liveweight(304),
          liveweightGain: liveweightGain(0.4),
        },
        winter: {
          liveweight: liveweight(337),
          liveweightGain: liveweightGain(0.11),
        },
      },
      // NOT VALID
      steersGt3Years: {
        spring: {
          liveweight: liveweight(0),
          liveweightGain: liveweightGain(0),
        },
        summer: {
          liveweight: liveweight(0),
          liveweightGain: liveweightGain(0),
        },
        autumn: {
          liveweight: liveweight(0),
          liveweightGain: liveweightGain(0),
        },
        winter: {
          liveweight: liveweight(0),
          liveweightGain: liveweightGain(0),
        },
      },
    },
    'QLD - High': {
      bullsLt1: {
        spring: {
          liveweight: liveweight(260),
          liveweightGain: liveweightGain(0.27),
        },
        summer: {
          liveweight: liveweight(153),
          liveweightGain: liveweightGain(0.16),
        },
        autumn: {
          liveweight: liveweight(168),
          liveweightGain: liveweightGain(0.45),
        },
        winter: {
          liveweight: liveweight(235),
          liveweightGain: liveweightGain(0.51),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: liveweight(705),
          liveweightGain: liveweightGain(-0.19),
        },
        summer: {
          liveweight: liveweight(703),
          liveweightGain: liveweightGain(0.16),
        },
        autumn: {
          liveweight: liveweight(718),
          liveweightGain: liveweightGain(0.1),
        },
        winter: {
          liveweight: liveweight(722),
          liveweightGain: liveweightGain(-0.07),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: liveweight(215),
          liveweightGain: liveweightGain(0.38),
        },
        summer: {
          liveweight: liveweight(118),
          liveweightGain: liveweightGain(0.8),
        },
        autumn: {
          liveweight: liveweight(191),
          liveweightGain: liveweightGain(0.49),
        },
        winter: {
          liveweight: liveweight(207),
          liveweightGain: liveweightGain(0.13),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: liveweight(302),
          liveweightGain: liveweightGain(0.25),
        },
        summer: {
          liveweight: liveweight(277),
          liveweightGain: liveweightGain(0.57),
        },
        autumn: {
          liveweight: liveweight(319),
          liveweightGain: liveweightGain(0.41),
        },
        winter: {
          liveweight: liveweight(352),
          liveweightGain: liveweightGain(-0.09),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: liveweight(416),
          liveweightGain: liveweightGain(0.07),
        },
        summer: {
          liveweight: liveweight(397),
          liveweightGain: liveweightGain(0.76),
        },
        autumn: {
          liveweight: liveweight(440),
          liveweightGain: liveweightGain(0.4),
        },
        winter: {
          liveweight: liveweight(470),
          liveweightGain: liveweightGain(-0.13),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: liveweight(519),
          liveweightGain: liveweightGain(0.05),
        },
        summer: {
          liveweight: liveweight(483),
          liveweightGain: liveweightGain(0.49),
        },
        autumn: {
          liveweight: liveweight(506),
          liveweightGain: liveweightGain(0.17),
        },
        winter: {
          liveweight: liveweight(514),
          liveweightGain: liveweightGain(0.07),
        },
      },
      steersLt1: {
        spring: {
          liveweight: liveweight(234),
          liveweightGain: liveweightGain(0.52),
        },
        summer: {
          liveweight: liveweight(111),
          liveweightGain: liveweightGain(0.84),
        },
        autumn: {
          liveweight: liveweight(188),
          liveweightGain: liveweightGain(0.54),
        },
        winter: {
          liveweight: liveweight(209),
          liveweightGain: liveweightGain(0.25),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: liveweight(455),
          liveweightGain: liveweightGain(0.55),
        },
        summer: {
          liveweight: liveweight(304),
          liveweightGain: liveweightGain(0.51),
        },
        autumn: {
          liveweight: liveweight(326),
          liveweightGain: liveweightGain(0.64),
        },
        winter: {
          liveweight: liveweight(421),
          liveweightGain: liveweightGain(0.71),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: liveweight(551),
          liveweightGain: liveweightGain(0.19),
        },
        summer: {
          liveweight: liveweight(521),
          liveweightGain: liveweightGain(0.36),
        },
        autumn: {
          liveweight: liveweight(520),
          liveweightGain: liveweightGain(-0.05),
        },
        winter: {
          liveweight: liveweight(512),
          liveweightGain: liveweightGain(0.17),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: liveweight(660),
          liveweightGain: liveweightGain(0.6),
        },
        summer: {
          liveweight: liveweight(547),
          liveweightGain: liveweightGain(0.17),
        },
        autumn: {
          liveweight: liveweight(582),
          liveweightGain: liveweightGain(0.32),
        },
        winter: {
          liveweight: liveweight(605),
          liveweightGain: liveweightGain(0.43),
        },
      },
    },
    'QLD - Moderate/High': {
      bullsLt1: {
        spring: {
          liveweight: liveweight(230),
          liveweightGain: liveweightGain(-0.12),
        },
        summer: {
          liveweight: liveweight(113),
          liveweightGain: liveweightGain(0.65),
        },
        autumn: {
          liveweight: liveweight(172),
          liveweightGain: liveweightGain(0.7),
        },
        winter: {
          liveweight: liveweight(241),
          liveweightGain: liveweightGain(0.32),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: liveweight(674),
          liveweightGain: liveweightGain(-0.19),
        },
        summer: {
          liveweight: liveweight(669),
          liveweightGain: liveweightGain(0.19),
        },
        autumn: {
          liveweight: liveweight(685),
          liveweightGain: liveweightGain(0.13),
        },
        winter: {
          liveweight: liveweight(692),
          liveweightGain: liveweightGain(-0.06),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: liveweight(217),
          liveweightGain: liveweightGain(0.41),
        },
        summer: {
          liveweight: liveweight(113),
          liveweightGain: liveweightGain(0.65),
        },
        autumn: {
          liveweight: liveweight(172),
          liveweightGain: liveweightGain(0.52),
        },
        winter: {
          liveweight: liveweight(208),
          liveweightGain: liveweightGain(0.25),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: liveweight(344),
          liveweightGain: liveweightGain(0.09),
        },
        summer: {
          liveweight: liveweight(283),
          liveweightGain: liveweightGain(0.51),
        },
        autumn: {
          liveweight: liveweight(309),
          liveweightGain: liveweightGain(0.34),
        },
        winter: {
          liveweight: liveweight(344),
          liveweightGain: liveweightGain(0.19),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: liveweight(357),
          liveweightGain: liveweightGain(0.41),
        },
        summer: {
          liveweight: liveweight(361),
          liveweightGain: liveweightGain(0.18),
        },
        autumn: {
          liveweight: liveweight(376),
          liveweightGain: liveweightGain(0.02),
        },
        winter: {
          liveweight: liveweight(364),
          liveweightGain: liveweightGain(-0.1),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: liveweight(467),
          liveweightGain: liveweightGain(-0.19),
        },
        summer: {
          liveweight: liveweight(477),
          liveweightGain: liveweightGain(0.63),
        },
        autumn: {
          liveweight: liveweight(471),
          liveweightGain: liveweightGain(0.04),
        },
        winter: {
          liveweight: liveweight(484),
          liveweightGain: liveweightGain(-0.02),
        },
      },
      steersLt1: {
        spring: {
          liveweight: liveweight(242),
          liveweightGain: liveweightGain(0.07),
        },
        summer: {
          liveweight: liveweight(120),
          liveweightGain: liveweightGain(1.3),
        },
        autumn: {
          liveweight: liveweight(238),
          liveweightGain: liveweightGain(0.77),
        },
        winter: {
          liveweight: liveweight(260),
          liveweightGain: liveweightGain(0.02),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: liveweight(370),
          liveweightGain: liveweightGain(1.07),
        },
        summer: {
          liveweight: liveweight(273),
          liveweightGain: liveweightGain(0.48),
        },
        autumn: {
          liveweight: liveweight(329),
          liveweightGain: liveweightGain(0.42),
        },
        winter: {
          liveweight: liveweight(350),
          liveweightGain: liveweightGain(0.23),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: liveweight(550),
          liveweightGain: liveweightGain(-0.08),
        },
        summer: {
          liveweight: liveweight(545),
          liveweightGain: liveweightGain(1.12),
        },
        autumn: {
          liveweight: liveweight(573),
          liveweightGain: liveweightGain(0.12),
        },
        winter: {
          liveweight: liveweight(567),
          liveweightGain: liveweightGain(-0.13),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: liveweight(620),
          liveweightGain: liveweightGain(0),
        },
        summer: {
          liveweight: liveweight(553),
          liveweightGain: liveweightGain(0.38),
        },
        autumn: {
          liveweight: liveweight(620),
          liveweightGain: liveweightGain(0.74),
        },
        winter: {
          liveweight: liveweight(620),
          liveweightGain: liveweightGain(0),
        },
      },
    },
    'QLD - Moderate/Low': {
      bullsLt1: {
        spring: {
          liveweight: liveweight(236),
          liveweightGain: liveweightGain(0.62),
        },
        summer: {
          liveweight: liveweight(120),
          liveweightGain: liveweightGain(0.05),
        },
        autumn: {
          liveweight: liveweight(125),
          liveweightGain: liveweightGain(0.33),
        },
        winter: {
          liveweight: liveweight(180),
          liveweightGain: liveweightGain(0.61),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: liveweight(674),
          liveweightGain: liveweightGain(-0.19),
        },
        summer: {
          liveweight: liveweight(669),
          liveweightGain: liveweightGain(0.19),
        },
        autumn: {
          liveweight: liveweight(685),
          liveweightGain: liveweightGain(0.13),
        },
        winter: {
          liveweight: liveweight(692),
          liveweightGain: liveweightGain(-0.06),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: liveweight(178),
          liveweightGain: liveweightGain(0.37),
        },
        summer: {
          liveweight: liveweight(112),
          liveweightGain: liveweightGain(0.31),
        },
        autumn: {
          liveweight: liveweight(140),
          liveweightGain: liveweightGain(0.39),
        },
        winter: {
          liveweight: liveweight(183),
          liveweightGain: liveweightGain(0.21),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: liveweight(310),
          liveweightGain: liveweightGain(0.41),
        },
        summer: {
          liveweight: liveweight(250),
          liveweightGain: liveweightGain(0.54),
        },
        autumn: {
          liveweight: liveweight(277),
          liveweightGain: liveweightGain(0.36),
        },
        winter: {
          liveweight: liveweight(316),
          liveweightGain: liveweightGain(0.18),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: liveweight(428),
          liveweightGain: liveweightGain(0.06),
        },
        summer: {
          liveweight: liveweight(390),
          liveweightGain: liveweightGain(0.53),
        },
        autumn: {
          liveweight: liveweight(407),
          liveweightGain: liveweightGain(0.26),
        },
        winter: {
          liveweight: liveweight(438),
          liveweightGain: liveweightGain(0.12),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: liveweight(466),
          liveweightGain: liveweightGain(-0.02),
        },
        summer: {
          liveweight: liveweight(448),
          liveweightGain: liveweightGain(0.15),
        },
        autumn: {
          liveweight: liveweight(455),
          liveweightGain: liveweightGain(0.11),
        },
        winter: {
          liveweight: liveweight(468),
          liveweightGain: liveweightGain(0.06),
        },
      },
      steersLt1: {
        spring: {
          liveweight: liveweight(193),
          liveweightGain: liveweightGain(0.47),
        },
        summer: {
          liveweight: liveweight(115),
          liveweightGain: liveweightGain(0.28),
        },
        autumn: {
          liveweight: liveweight(141),
          liveweightGain: liveweightGain(0.4),
        },
        winter: {
          liveweight: liveweight(189),
          liveweightGain: liveweightGain(0.29),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: liveweight(370),
          liveweightGain: liveweightGain(0.44),
        },
        summer: {
          liveweight: liveweight(273),
          liveweightGain: liveweightGain(0.57),
        },
        autumn: {
          liveweight: liveweight(296),
          liveweightGain: liveweightGain(0.44),
        },
        winter: {
          liveweight: liveweight(354),
          liveweightGain: liveweightGain(0.41),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: liveweight(519),
          liveweightGain: liveweightGain(0.3),
        },
        summer: {
          liveweight: liveweight(433),
          liveweightGain: liveweightGain(0.42),
        },
        autumn: {
          liveweight: liveweight(445),
          liveweightGain: liveweightGain(0.37),
        },
        winter: {
          liveweight: liveweight(500),
          liveweightGain: liveweightGain(0.41),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: liveweight(565),
          liveweightGain: liveweightGain(0.13),
        },
        summer: {
          liveweight: liveweight(556),
          liveweightGain: liveweightGain(0.4),
        },
        autumn: {
          liveweight: liveweight(593),
          liveweightGain: liveweightGain(-0.01),
        },
        winter: {
          liveweight: liveweight(553),
          liveweightGain: liveweightGain(-0.15),
        },
      },
    },
    'QLD - Low': {
      bullsLt1: {
        spring: {
          liveweight: liveweight(190),
          liveweightGain: liveweightGain(-0.2),
        },
        summer: {
          liveweight: liveweight(119),
          liveweightGain: liveweightGain(0.62),
        },
        autumn: {
          liveweight: liveweight(175),
          liveweightGain: liveweightGain(0.4),
        },
        winter: {
          liveweight: liveweight(192),
          liveweightGain: liveweightGain(0.08),
        },
      },
      bullsGt1: {
        spring: {
          liveweight: liveweight(617),
          liveweightGain: liveweightGain(0.02),
        },
        summer: {
          liveweight: liveweight(591),
          liveweightGain: liveweightGain(0.21),
        },
        autumn: {
          liveweight: liveweight(610),
          liveweightGain: liveweightGain(0.13),
        },
        winter: {
          liveweight: liveweight(615),
          liveweightGain: liveweightGain(0.04),
        },
      },
      cowsLt1: {
        spring: {
          liveweight: liveweight(174),
          liveweightGain: liveweightGain(0.24),
        },
        summer: {
          liveweight: liveweight(140),
          liveweightGain: liveweightGain(0.25),
        },
        autumn: {
          liveweight: liveweight(163),
          liveweightGain: liveweightGain(0.12),
        },
        winter: {
          liveweight: liveweight(162),
          liveweightGain: liveweightGain(0.06),
        },
      },
      cows1To2Years: {
        spring: {
          liveweight: liveweight(265),
          liveweightGain: liveweightGain(0.3),
        },
        summer: {
          liveweight: liveweight(205),
          liveweightGain: liveweightGain(0.32),
        },
        autumn: {
          liveweight: liveweight(232),
          liveweightGain: liveweightGain(0.27),
        },
        winter: {
          liveweight: liveweight(255),
          liveweightGain: liveweightGain(0.18),
        },
      },
      cows2To3Years: {
        spring: {
          liveweight: liveweight(371),
          liveweightGain: liveweightGain(0.23),
        },
        summer: {
          liveweight: liveweight(310),
          liveweightGain: liveweightGain(0.47),
        },
        autumn: {
          liveweight: liveweight(351),
          liveweightGain: liveweightGain(0.3),
        },
        winter: {
          liveweight: liveweight(364),
          liveweightGain: liveweightGain(0.11),
        },
      },
      cowsGt3Years: {
        spring: {
          liveweight: liveweight(415),
          liveweightGain: liveweightGain(-0.05),
        },
        summer: {
          liveweight: liveweight(405),
          liveweightGain: liveweightGain(0.31),
        },
        autumn: {
          liveweight: liveweight(427),
          liveweightGain: liveweightGain(0.08),
        },
        winter: {
          liveweight: liveweight(420),
          liveweightGain: liveweightGain(-0.07),
        },
      },
      steersLt1: {
        spring: {
          liveweight: liveweight(170),
          liveweightGain: liveweightGain(0.34),
        },
        summer: {
          liveweight: liveweight(133),
          liveweightGain: liveweightGain(0.14),
        },
        autumn: {
          liveweight: liveweight(146),
          liveweightGain: liveweightGain(0.13),
        },
        winter: {
          liveweight: liveweight(157),
          liveweightGain: liveweightGain(0.13),
        },
      },
      steers1To2Years: {
        spring: {
          liveweight: liveweight(272),
          liveweightGain: liveweightGain(0.3),
        },
        summer: {
          liveweight: liveweight(218),
          liveweightGain: liveweightGain(0.4),
        },
        autumn: {
          liveweight: liveweight(242),
          liveweightGain: liveweightGain(0.24),
        },
        winter: {
          liveweight: liveweight(261),
          liveweightGain: liveweightGain(0.16),
        },
      },
      steers2To3Years: {
        spring: {
          liveweight: liveweight(392),
          liveweightGain: liveweightGain(0.57),
        },
        summer: {
          liveweight: liveweight(315),
          liveweightGain: liveweightGain(0.26),
        },
        autumn: {
          liveweight: liveweight(320),
          liveweightGain: liveweightGain(0.15),
        },
        winter: {
          liveweight: liveweight(342),
          liveweightGain: liveweightGain(0.4),
        },
      },
      steersGt3Years: {
        spring: {
          liveweight: liveweight(531),
          liveweightGain: liveweightGain(0.52),
        },
        summer: {
          liveweight: liveweight(445),
          liveweightGain: liveweightGain(0.43),
        },
        autumn: {
          liveweight: liveweight(471),
          liveweightGain: liveweightGain(0.21),
        },
        winter: {
          liveweight: liveweight(484),
          liveweightGain: liveweightGain(0.33),
        },
      },
    },
  },

  /**
   * @description Dry matter to methane conversion factor
   * @reference Charmley et al. (2015)
   * @link https://www.researchgate.net/publication/286511461_A_universal_equation_to_predict_methane_production_of_forage-fed_cattle_in_Australia
   */
  DRY_MATTER_TO_METHANE_CONVERSION_FACTOR: massPerMass(
    'CH4',
    'DryMatter',
    gramsToKg(20.7),
  ),

  /**
   * @description Fraction of manure to each manure management system
   * @appendixA A.1.2.9
   */
  MMS: {
    ACT: {
      PRP: percentage(99.192),
      Lagoon: percentage(0.808),
    },
    NSW: {
      PRP: percentage(99.452),
      Lagoon: percentage(0.548),
    },
    SA: {
      PRP: percentage(99.759),
      Lagoon: percentage(0.241),
    },
    TAS: {
      PRP: percentage(99.122),
      Lagoon: percentage(0.878),
    },
    VIC: {
      PRP: percentage(98.894),
      Lagoon: percentage(1.106),
    },
    'WA - South West': {
      PRP: percentage(99.622),
      Lagoon: percentage(0.378),
    },
    'WA - Pilbara': {
      PRP: percentage(99.999),
      Lagoon: percentage(0.001),
    },
    'WA - Kimberley': {
      PRP: percentage(99.999),
      Lagoon: percentage(0.001),
    },
    'NT - Alice Springs': {
      PRP: percentage(99.999),
      Lagoon: percentage(0.001),
    },
    'NT - Barkly': {
      PRP: percentage(99.994),
      Lagoon: percentage(0.006),
    },
    'NT - Northern': {
      PRP: percentage(99.999),
      Lagoon: percentage(0.001),
    },
    'QLD - High': {
      PRP: percentage(99.773),
      Lagoon: percentage(0.227),
    },
    'QLD - Moderate/High': {
      PRP: percentage(99.898),
      Lagoon: percentage(0.102),
    },
    'QLD - Moderate/Low': {
      PRP: percentage(99.979),
      Lagoon: percentage(0.021),
    },
    'QLD - Low': {
      PRP: percentage(99.977),
      Lagoon: percentage(0.023),
    },
  },

  /**
   * @description Milk production factors by breed
   * @appendixA A.1.2.7
   */
  MILK_FACTORS: {
    DAILY_MILK_PRODUCTION_BY_BREED: {
      'Hereford or Shorthorn': {
        calving: massPerHeadPerDay('Milk', 6),
        postCalving: massPerHeadPerDay('Milk', 4),
      },
      'Northern Brahman cross breed': {
        calving: massPerHeadPerDay('Milk', 4),
        postCalving: massPerHeadPerDay('Milk', 3),
      },
    },
    FEED_ADJUSTMENTS: {
      calving: realNumber(1.3),
      postCalving: realNumber(1.1),
    },
  },
};

export const riceConstants: RiceConstants = {
  name: 'RICE',
  /**
   * @description Scaling factor based on the water regime employed during the growing season cultivation period
   * @appendixA A.2.3.1
   */
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
  /**
   * @description Scaling factor based on the water regime employed in the pre-season before the growing period
   * @appendixA A.2.3.2
   */
  PRE_SEASON_WATER_REGIME_SCALING_FACTORS: {
    'Non flooded pre-season <180 days': realNumber(1),
    'Non flooded pre-season >180 days': realNumber(0.89),
    'Non-flooded pre-season >365 days': realNumber(0.59),
    'Flooded pre-season >30 days': realNumber(2.41),
  },
  /**
   * @description Conversion factor for organic amendment
   * @appendixA A.2.3.3
   */
  ORGANIC_AMENDMENT_SCALING_FACTORS: {
    'Straw incorporated shortly (<30 days) before cultivation': realNumber(1),
    'Straw incorporated long (>30 days) before cultivation': realNumber(0.19),
    Compost: realNumber(0.17),
    'Farm yard manure': realNumber(0.21),
    'Green manure': realNumber(0.45),
  },
  /**
   * @description Baseline emission factor for continuously flooded fields without organic amendments
   * @reference IPCC 2019 Refinement Volume 4 Table 5.11
   */
  BASELINE_CONTINUOUSLY_FLOODED_EF: massPerAreaPerDay(
    'CH4',
    perHectareToPerSqMetre(1.19),
  ),
};
const tonnesCarbonPerHectare = (tonnes: number) =>
  massPerArea('Carbon', tonnesPerHectareToKgPerSquareMetres(tonnes));

const tonnesCarbonPerHectarePerYear = (tonnes: number) =>
  massPerAreaPerYear('Carbon', tonnesPerHectareToKgPerSquareMetres(tonnes));

const seasonalSheepFactorsForACT_NSW = {
  rams: {
    standardReferenceWeight: liveweight(78),
    spring: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2.9),
      ),
      dryMatterDigestibility: realNumber(0.75),
      liveweight: liveweight(75),
      liveweightGain: liveweightGain(0.07),
    },
    summer: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2.5),
      ),
      dryMatterDigestibility: realNumber(0.61),
      liveweight: liveweight(75),
      liveweightGain: liveweightGain(0),
    },
    autumn: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.12),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.6),
      ),
      dryMatterDigestibility: realNumber(0.64),
      liveweight: liveweight(69),
      liveweightGain: liveweightGain(-0.07),
    },
    winter: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.7),
      ),
      dryMatterDigestibility: realNumber(0.72),
      liveweight: liveweight(69),
      liveweightGain: liveweightGain(0),
    },
  },
  wethers: {
    standardReferenceWeight: liveweight(62),
    spring: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2.9),
      ),
      dryMatterDigestibility: realNumber(0.75),
      liveweight: liveweight(62),
      liveweightGain: liveweightGain(0.08),
    },
    summer: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2.5),
      ),
      dryMatterDigestibility: realNumber(0.61),
      liveweight: liveweight(55),
      liveweightGain: liveweightGain(-0.08),
    },
    autumn: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.12),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.6),
      ),
      dryMatterDigestibility: realNumber(0.64),
      liveweight: liveweight(55),
      liveweightGain: liveweightGain(0),
    },
    winter: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.7),
      ),
      dryMatterDigestibility: realNumber(0.72),
      liveweight: liveweight(55),
      liveweightGain: liveweightGain(0),
    },
  },
  maidenEwes: {
    standardReferenceWeight: liveweight(57),
    spring: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2.9),
      ),
      dryMatterDigestibility: realNumber(0.75),
      liveweight: liveweight(44),
      liveweightGain: liveweightGain(0.07),
    },
    summer: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2.5),
      ),
      dryMatterDigestibility: realNumber(0.61),
      liveweight: liveweight(42),
      liveweightGain: liveweightGain(0),
    },
    autumn: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.12),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.6),
      ),
      dryMatterDigestibility: realNumber(0.64),
      liveweight: liveweight(43),
      liveweightGain: liveweightGain(0),
    },
    winter: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.7),
      ),
      dryMatterDigestibility: realNumber(0.72),
      liveweight: liveweight(45),
      liveweightGain: liveweightGain(0.02),
    },
  },
  breedingEwes: {
    standardReferenceWeight: liveweight(57),
    spring: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2.9),
      ),
      dryMatterDigestibility: realNumber(0.75),
      liveweight: liveweight(54),
      liveweightGain: liveweightGain(0.04),
    },
    summer: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2.5),
      ),
      dryMatterDigestibility: realNumber(0.61),
      liveweight: liveweight(49),
      liveweightGain: liveweightGain(-0.05),
    },
    autumn: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.12),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.6),
      ),
      dryMatterDigestibility: realNumber(0.64),
      liveweight: liveweight(50),
      liveweightGain: liveweightGain(0.01),
    },
    winter: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.7),
      ),
      dryMatterDigestibility: realNumber(0.72),
      liveweight: liveweight(50),
      liveweightGain: liveweightGain(0),
    },
  },
  otherEwes: {
    standardReferenceWeight: liveweight(57),
    spring: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2.9),
      ),
      dryMatterDigestibility: realNumber(0.75),
      liveweight: liveweight(56),
      liveweightGain: liveweightGain(0.05),
    },
    summer: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2.5),
      ),
      dryMatterDigestibility: realNumber(0.61),
      liveweight: liveweight(51),
      liveweightGain: liveweightGain(-0.05),
    },
    autumn: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.12),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.6),
      ),
      dryMatterDigestibility: realNumber(0.64),
      liveweight: liveweight(50),
      liveweightGain: liveweightGain(-0.01),
    },
    winter: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.7),
      ),
      dryMatterDigestibility: realNumber(0.72),
      liveweight: liveweight(51),
      liveweightGain: liveweightGain(0.01),
    },
  },
  lambsHoggets: {
    standardReferenceWeight: liveweight(60),
    spring: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2.9),
      ),
      dryMatterDigestibility: realNumber(0.75),
      liveweight: liveweight(20),
      liveweightGain: liveweightGain(0.16),
    },
    summer: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2.5),
      ),
      dryMatterDigestibility: realNumber(0.61),
      liveweight: liveweight(27),
      liveweightGain: liveweightGain(0.08),
    },
    autumn: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.12),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.6),
      ),
      dryMatterDigestibility: realNumber(0.64),
      liveweight: liveweight(32),
      liveweightGain: liveweightGain(0.05),
    },
    winter: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.7),
      ),
      dryMatterDigestibility: realNumber(0.72),
      liveweight: liveweight(34),
      liveweightGain: liveweightGain(0.04),
    },
  },
};

// NOTE: Values for NT cloned from QLD
const seasonalSheepFactorsForQLD_NT = {
  rams: {
    standardReferenceWeight: liveweight(70),
    spring: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.08),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.5),
      ),
      dryMatterDigestibility: realNumber(0.51),
      liveweight: liveweight(58),
      liveweightGain: liveweightGain(-0.02),
    },
    summer: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2),
      ),
      dryMatterDigestibility: realNumber(0.55),
      liveweight: liveweight(61),
      liveweightGain: liveweightGain(0.03),
    },
    autumn: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2.2),
      ),
      dryMatterDigestibility: realNumber(0.59),
      liveweight: liveweight(63),
      liveweightGain: liveweightGain(0.02),
    },
    winter: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.7),
      ),
      dryMatterDigestibility: realNumber(0.58),
      liveweight: liveweight(60),
      liveweightGain: liveweightGain(-0.03),
    },
  },
  wethers: {
    standardReferenceWeight: liveweight(60),
    spring: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.08),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.5),
      ),
      dryMatterDigestibility: realNumber(0.51),
      liveweight: liveweight(50),
      liveweightGain: liveweightGain(0),
    },
    summer: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2),
      ),
      dryMatterDigestibility: realNumber(0.55),
      liveweight: liveweight(55),
      liveweightGain: liveweightGain(0.05),
    },
    autumn: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2.2),
      ),
      dryMatterDigestibility: realNumber(0.59),
      liveweight: liveweight(55),
      liveweightGain: liveweightGain(0),
    },
    winter: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.7),
      ),
      dryMatterDigestibility: realNumber(0.58),
      liveweight: liveweight(50),
      liveweightGain: liveweightGain(-0.05),
    },
  },
  maidenEwes: {
    standardReferenceWeight: liveweight(50),
    spring: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.08),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.5),
      ),
      dryMatterDigestibility: realNumber(0.51),
      liveweight: liveweight(35),
      liveweightGain: liveweightGain(0),
    },
    summer: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2),
      ),
      dryMatterDigestibility: realNumber(0.55),
      liveweight: liveweight(40),
      liveweightGain: liveweightGain(0.05),
    },
    autumn: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2.2),
      ),
      dryMatterDigestibility: realNumber(0.59),
      liveweight: liveweight(40),
      liveweightGain: liveweightGain(0),
    },
    winter: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.7),
      ),
      dryMatterDigestibility: realNumber(0.58),
      liveweight: liveweight(35),
      liveweightGain: liveweightGain(-0.05),
    },
  },
  breedingEwes: {
    standardReferenceWeight: liveweight(50),
    spring: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.08),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.5),
      ),
      dryMatterDigestibility: realNumber(0.51),
      liveweight: liveweight(40),
      liveweightGain: liveweightGain(-0.02),
    },
    summer: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2),
      ),
      dryMatterDigestibility: realNumber(0.55),
      liveweight: liveweight(45),
      liveweightGain: liveweightGain(0.05),
    },
    autumn: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2.2),
      ),
      dryMatterDigestibility: realNumber(0.59),
      liveweight: liveweight(45),
      liveweightGain: liveweightGain(0),
    },
    winter: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.7),
      ),
      dryMatterDigestibility: realNumber(0.58),
      liveweight: liveweight(42),
      liveweightGain: liveweightGain(-0.03),
    },
  },
  otherEwes: {
    standardReferenceWeight: liveweight(50),
    spring: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.08),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.5),
      ),
      dryMatterDigestibility: realNumber(0.51),
      liveweight: liveweight(45),
      liveweightGain: liveweightGain(-0.03),
    },
    summer: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2),
      ),
      dryMatterDigestibility: realNumber(0.55),
      liveweight: liveweight(50),
      liveweightGain: liveweightGain(0.05),
    },
    autumn: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2.2),
      ),
      dryMatterDigestibility: realNumber(0.59),
      liveweight: liveweight(50),
      liveweightGain: liveweightGain(0),
    },
    winter: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.7),
      ),
      dryMatterDigestibility: realNumber(0.58),
      liveweight: liveweight(48),
      liveweightGain: liveweightGain(-0.02),
    },
  },
  lambsHoggets: {
    standardReferenceWeight: liveweight(55),
    spring: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.08),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.5),
      ),
      dryMatterDigestibility: realNumber(0.51),
      liveweight: liveweight(20),
      liveweightGain: liveweightGain(0.2),
    },
    summer: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2),
      ),
      dryMatterDigestibility: realNumber(0.55),
      liveweight: liveweight(25),
      liveweightGain: liveweightGain(0.05),
    },
    autumn: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(2.2),
      ),
      dryMatterDigestibility: realNumber(0.59),
      liveweight: liveweight(20),
      liveweightGain: liveweightGain(0.2),
    },
    winter: {
      crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
      dryMatterAvailability: massPerArea(
        'DryMatter',
        tonnesPerHectareToKgPerSquareMetres(1.7),
      ),
      dryMatterDigestibility: realNumber(0.58),
      liveweight: liveweight(25),
      liveweightGain: liveweightGain(0.05),
    },
  },
};

export const sheepConstants: SheepConstants = {
  name: 'SHEEP',
  /**
   * @description Seasonal factors for sheep, by state and class. Values for NT cloned from QLD
   * @appendixA A.1.4.1, A.1.4.2, A.1.4.3, A.1.4.4, A.1.4.5, A.1.4.6
   */
  SEASONAL_FACTORS: {
    ACT: seasonalSheepFactorsForACT_NSW,
    NSW: seasonalSheepFactorsForACT_NSW,
    QLD: seasonalSheepFactorsForQLD_NT,
    NT: seasonalSheepFactorsForQLD_NT,
    SA: {
      rams: {
        standardReferenceWeight: liveweight(84),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(4),
          ),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: liveweight(80),
          liveweightGain: liveweightGain(0.11),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(2.5),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(70),
          liveweightGain: liveweightGain(-0.1),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.7),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(70),
          liveweightGain: liveweightGain(0),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.9),
          ),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: liveweight(70),
          liveweightGain: liveweightGain(0),
        },
      },
      wethers: {
        standardReferenceWeight: liveweight(72),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(4),
          ),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: liveweight(70),
          liveweightGain: liveweightGain(0.11),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(2.5),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(65),
          liveweightGain: liveweightGain(-0.1),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.7),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(60),
          liveweightGain: liveweightGain(-0.1),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.9),
          ),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: liveweight(60),
          liveweightGain: liveweightGain(0),
        },
      },
      maidenEwes: {
        standardReferenceWeight: liveweight(60),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(4),
          ),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: liveweight(52),
          liveweightGain: liveweightGain(0),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(2.5),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(52),
          liveweightGain: liveweightGain(0),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.7),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(52),
          liveweightGain: liveweightGain(0),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.9),
          ),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: liveweight(52),
          liveweightGain: liveweightGain(0),
        },
      },
      breedingEwes: {
        standardReferenceWeight: liveweight(60),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(4),
          ),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: liveweight(55),
          liveweightGain: liveweightGain(0),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(2.5),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(55),
          liveweightGain: liveweightGain(0),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.7),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(55),
          liveweightGain: liveweightGain(0),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.9),
          ),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: liveweight(55),
          liveweightGain: liveweightGain(0),
        },
      },
      otherEwes: {
        standardReferenceWeight: liveweight(60),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(4),
          ),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: liveweight(55),
          liveweightGain: liveweightGain(0),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(2.5),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(55),
          liveweightGain: liveweightGain(0),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.7),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(55),
          liveweightGain: liveweightGain(0),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.9),
          ),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: liveweight(55),
          liveweightGain: liveweightGain(0),
        },
      },
      lambsHoggets: {
        standardReferenceWeight: liveweight(66),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(4),
          ),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: liveweight(40),
          liveweightGain: liveweightGain(0.11),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(2.5),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(45),
          liveweightGain: liveweightGain(0.05),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.09),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.7),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(20),
          liveweightGain: liveweightGain(0.16),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.9),
          ),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: liveweight(30),
          liveweightGain: liveweightGain(0.16),
        },
      },
    },
    TAS: {
      rams: {
        standardReferenceWeight: liveweight(77),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(2.5),
          ),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: liveweight(90),
          liveweightGain: liveweightGain(0.16),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(2.5),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(90),
          liveweightGain: liveweightGain(0),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.14),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.3),
          ),
          dryMatterDigestibility: realNumber(0.67),
          liveweight: liveweight(75),
          liveweightGain: liveweightGain(-0.2),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.8),
          ),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: liveweight(75),
          liveweightGain: liveweightGain(0),
        },
      },
      wethers: {
        standardReferenceWeight: liveweight(66),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(2.5),
          ),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: liveweight(55),
          liveweightGain: liveweightGain(0.11),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(2.5),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(55),
          liveweightGain: liveweightGain(0),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.14),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.3),
          ),
          dryMatterDigestibility: realNumber(0.67),
          liveweight: liveweight(50),
          liveweightGain: liveweightGain(-0.1),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.8),
          ),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: liveweight(45),
          liveweightGain: liveweightGain(-0.1),
        },
      },
      maidenEwes: {
        standardReferenceWeight: liveweight(55),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(2.5),
          ),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: liveweight(45),
          liveweightGain: liveweightGain(0.03),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(2.5),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(45),
          liveweightGain: liveweightGain(0),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.14),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.3),
          ),
          dryMatterDigestibility: realNumber(0.67),
          liveweight: liveweight(45),
          liveweightGain: liveweightGain(0),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.8),
          ),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: liveweight(50),
          liveweightGain: liveweightGain(0.5),
        },
      },
      breedingEwes: {
        standardReferenceWeight: liveweight(55),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(2.5),
          ),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: liveweight(50),
          liveweightGain: liveweightGain(-0.02),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(2.5),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(50),
          liveweightGain: liveweightGain(0),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.14),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.3),
          ),
          dryMatterDigestibility: realNumber(0.67),
          liveweight: liveweight(50),
          liveweightGain: liveweightGain(0),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.8),
          ),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: liveweight(55),
          liveweightGain: liveweightGain(0.02),
        },
      },
      otherEwes: {
        standardReferenceWeight: liveweight(55),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(2.5),
          ),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: liveweight(50),
          liveweightGain: liveweightGain(0),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(2.5),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(50),
          liveweightGain: liveweightGain(0),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.14),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.3),
          ),
          dryMatterDigestibility: realNumber(0.67),
          liveweight: liveweight(50),
          liveweightGain: liveweightGain(0),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.8),
          ),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: liveweight(50),
          liveweightGain: liveweightGain(0),
        },
      },
      lambsHoggets: {
        standardReferenceWeight: liveweight(60),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.2),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(2.5),
          ),
          dryMatterDigestibility: realNumber(0.75),
          liveweight: liveweight(14),
          liveweightGain: liveweightGain(0.15),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(2.5),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(24),
          liveweightGain: liveweightGain(0.11),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.14),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.3),
          ),
          dryMatterDigestibility: realNumber(0.67),
          liveweight: liveweight(36),
          liveweightGain: liveweightGain(0.13),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.8),
          ),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: liveweight(42),
          liveweightGain: liveweightGain(0.07),
        },
      },
    },
    VIC: {
      rams: {
        standardReferenceWeight: liveweight(70),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(3.2),
          ),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: liveweight(70),
          liveweightGain: liveweightGain(0.11),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(3),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(65),
          liveweightGain: liveweightGain(-0.05),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.13),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.8),
          ),
          dryMatterDigestibility: realNumber(0.65),
          liveweight: liveweight(65),
          liveweightGain: liveweightGain(0),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1),
          ),
          dryMatterDigestibility: realNumber(0.6),
          liveweight: liveweight(60),
          liveweightGain: liveweightGain(-0.05),
        },
      },
      wethers: {
        standardReferenceWeight: liveweight(60),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(3.2),
          ),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: liveweight(60),
          liveweightGain: liveweightGain(0.11),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(3),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(55),
          liveweightGain: liveweightGain(-0.05),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.13),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.8),
          ),
          dryMatterDigestibility: realNumber(0.65),
          liveweight: liveweight(52),
          liveweightGain: liveweightGain(-0.03),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1),
          ),
          dryMatterDigestibility: realNumber(0.6),
          liveweight: liveweight(50),
          liveweightGain: liveweightGain(-0.02),
        },
      },
      maidenEwes: {
        standardReferenceWeight: liveweight(50),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(3.2),
          ),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: liveweight(50),
          liveweightGain: liveweightGain(0.16),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(3),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(45),
          liveweightGain: liveweightGain(-0.05),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.13),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.8),
          ),
          dryMatterDigestibility: realNumber(0.65),
          liveweight: liveweight(43),
          liveweightGain: liveweightGain(-0.02),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1),
          ),
          dryMatterDigestibility: realNumber(0.6),
          liveweight: liveweight(40),
          liveweightGain: liveweightGain(-0.03),
        },
      },
      breedingEwes: {
        standardReferenceWeight: liveweight(50),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(3.2),
          ),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: liveweight(55),
          liveweightGain: liveweightGain(0.11),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(3),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(50),
          liveweightGain: liveweightGain(-0.05),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.13),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.8),
          ),
          dryMatterDigestibility: realNumber(0.65),
          liveweight: liveweight(48),
          liveweightGain: liveweightGain(-0.02),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1),
          ),
          dryMatterDigestibility: realNumber(0.6),
          liveweight: liveweight(45),
          liveweightGain: liveweightGain(-0.03),
        },
      },
      otherEwes: {
        standardReferenceWeight: liveweight(50),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(3.2),
          ),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: liveweight(50),
          liveweightGain: liveweightGain(0),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(3),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(50),
          liveweightGain: liveweightGain(0),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.13),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.8),
          ),
          dryMatterDigestibility: realNumber(0.65),
          liveweight: liveweight(50),
          liveweightGain: liveweightGain(0),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1),
          ),
          dryMatterDigestibility: realNumber(0.6),
          liveweight: liveweight(50),
          liveweightGain: liveweightGain(0),
        },
      },
      lambsHoggets: {
        standardReferenceWeight: liveweight(55),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(3.2),
          ),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: liveweight(22),
          liveweightGain: liveweightGain(0.15),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.07),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(3),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(28),
          liveweightGain: liveweightGain(0.07),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.13),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.8),
          ),
          dryMatterDigestibility: realNumber(0.65),
          liveweight: liveweight(33),
          liveweightGain: liveweightGain(0.05),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.1),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1),
          ),
          dryMatterDigestibility: realNumber(0.6),
          liveweight: liveweight(35),
          liveweightGain: liveweightGain(0.02),
        },
      },
    },
    WA: {
      rams: {
        standardReferenceWeight: liveweight(84),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(3.5),
          ),
          dryMatterDigestibility: realNumber(0.73),
          liveweight: liveweight(75),
          liveweightGain: liveweightGain(0.11),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.06),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.5),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(65),
          liveweightGain: liveweightGain(-0.11),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.06),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.7),
          ),
          dryMatterDigestibility: realNumber(0.5),
          liveweight: liveweight(65),
          liveweightGain: liveweightGain(0),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.21),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.2),
          ),
          dryMatterDigestibility: realNumber(0.76),
          liveweight: liveweight(65),
          liveweightGain: liveweightGain(0),
        },
      },
      wethers: {
        standardReferenceWeight: liveweight(72),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(3.5),
          ),
          dryMatterDigestibility: realNumber(0.73),
          liveweight: liveweight(60),
          liveweightGain: liveweightGain(0.13),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.06),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.5),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(55),
          liveweightGain: liveweightGain(-0.05),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.06),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.7),
          ),
          dryMatterDigestibility: realNumber(0.5),
          liveweight: liveweight(48),
          liveweightGain: liveweightGain(-0.08),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.21),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.2),
          ),
          dryMatterDigestibility: realNumber(0.76),
          liveweight: liveweight(48),
          liveweightGain: liveweightGain(0),
        },
      },
      maidenEwes: {
        standardReferenceWeight: liveweight(60),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(3.5),
          ),
          dryMatterDigestibility: realNumber(0.73),
          liveweight: liveweight(50),
          liveweightGain: liveweightGain(0.05),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.06),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.5),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(45),
          liveweightGain: liveweightGain(-0.05),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.7),
          ),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: liveweight(40),
          liveweightGain: liveweightGain(0.11),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.21),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.2),
          ),
          dryMatterDigestibility: realNumber(0.76),
          liveweight: liveweight(45),
          liveweightGain: liveweightGain(0.05),
        },
      },
      breedingEwes: {
        standardReferenceWeight: liveweight(60),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(3.5),
          ),
          dryMatterDigestibility: realNumber(0.73),
          liveweight: liveweight(55),
          liveweightGain: liveweightGain(0.05),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.06),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.5),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(50),
          liveweightGain: liveweightGain(-0.05),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.7),
          ),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: liveweight(45),
          liveweightGain: liveweightGain(-0.05),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.21),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.2),
          ),
          dryMatterDigestibility: realNumber(0.76),
          liveweight: liveweight(50),
          liveweightGain: liveweightGain(0.05),
        },
      },
      otherEwes: {
        standardReferenceWeight: liveweight(60),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(3.5),
          ),
          dryMatterDigestibility: realNumber(0.73),
          liveweight: liveweight(55),
          liveweightGain: liveweightGain(0.05),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.06),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.5),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(50),
          liveweightGain: liveweightGain(-0.05),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.06),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.7),
          ),
          dryMatterDigestibility: realNumber(0.5),
          liveweight: liveweight(45),
          liveweightGain: liveweightGain(-0.05),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.21),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.2),
          ),
          dryMatterDigestibility: realNumber(0.76),
          liveweight: liveweight(50),
          liveweightGain: liveweightGain(0.05),
        },
      },
      lambsHoggets: {
        standardReferenceWeight: liveweight(66),
        spring: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.18),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(3.5),
          ),
          dryMatterDigestibility: realNumber(0.73),
          liveweight: liveweight(30),
          liveweightGain: liveweightGain(0.11),
        },
        summer: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.06),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.5),
          ),
          dryMatterDigestibility: realNumber(0.55),
          liveweight: liveweight(30),
          liveweightGain: liveweightGain(0),
        },
        autumn: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.16),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(0.7),
          ),
          dryMatterDigestibility: realNumber(0.7),
          liveweight: liveweight(10),
          liveweightGain: liveweightGain(0.11),
        },
        winter: {
          crudeProteinContent: massPerMass('CrudeProtein', 'DryMatter', 0.21),
          dryMatterAvailability: massPerArea(
            'DryMatter',
            tonnesPerHectareToKgPerSquareMetres(1.2),
          ),
          dryMatterDigestibility: realNumber(0.76),
          liveweight: liveweight(20),
          liveweightGain: liveweightGain(0.11),
        },
      },
    },
  },

  /**
   * @description Feed adjustment value
   * @nir2024Vol1 3.A.2_4
   */
  FEED_ADJUSTMENT: realNumber(1.3),

  /**
   * @description Fraction of waste in each manure management system. Values for NT cloned from QLD
   * @appendixA A.1.4.7
   */
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
    // NT cloned from QLD values
    NT: {
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

  /**
   * @description Milk production for time-period lambs are born
   * @reference Guidelines chapter 4.4.1.3 (5)
   */
  MILK_PRODUCTION: massPerHeadPerDay('Milk', 1.6),

  /**
   * @description Proportion of crude protein in a mass of ewe milk
   * @reference From page 93 of Nutrient Requirements of Domesticated Ruminants (2007) > It is suggested that 45 g protein/kg ewe milk be assumed when actual values are not available.
   * @link https://www.rexresearch1.com/CattleLibrary/NutrientRequirementsDomesticatedRuminants.pdf
   */
  MILK_PROTEIN: massPerMass('CrudeProtein', 'Milk', 0.045),
  /**
   * @description Proportion of crude protein in a mass of clean wool. This is also the dry matter content of wool - 100% of dry matter content in clean wool is assumed to be protein. 'CrudeProtein' is used below because quantity of protein is the desired value in every context this constant is used in.
   * @nir2024Vol1 3.B.2_4: It is assumed that clean wool consists of 16 per cent water and 84 per cent protein.
   */
  WOOL_PROTEIN: massPerMass('CrudeProtein', 'Clean Wool', 0.84),
  /**
   * @description Proportion of crude protein in a mass of liveweight of sheep
   * @reference Common Requirements Framework: This assumes 18% of liveweight and 100% of clean fleece dry matter is protein.
   */
  LIVEWEIGHT_PROTEIN: massPerMass('CrudeProtein', 'Liveweight', 0.18),

  /**
   * @description Methane conversion factor for "Pasture, range and paddock"
   * @appendixA A.1.4.8
   */
  MCF_PRP: realNumber(0.0047),

  /**
   * @description Methane conversion factor for "Uncovered anaerobic lagoon". Value for NT cloned from QLD
   * @appendixA A.1.4.8
   */
  MCF_LAGOON: {
    ACT: realNumber(0.72),
    NSW: realNumber(0.75),
    QLD: realNumber(0.78),
    NT: realNumber(0.78), // NT value cloned from QLD
    SA: realNumber(0.74),
    TAS: realNumber(0.69),
    VIC: realNumber(0.73),
    WA: realNumber(0.76),
  },
};

export const lulucfConstants: LULUCFConstants = {
  name: 'LULUCF',

  /**
   * @description Annual soil organic carbon stock loss for region
   * @reference Guidelines chapter 16.2.1.5 Table 4
   */
  ORGANIC_STOCK_LOSS_FACTORS: {
    'Arnhem Coast': tonnesCarbonPerHectare(-0.12),
    'Arnhem Plateau': tonnesCarbonPerHectare(-0.43),
    'Australian Alps': tonnesCarbonPerHectare(-0.09),
    'Avon Wheatbelt': tonnesCarbonPerHectare(-0.09),
    'Brigalow Belt North': tonnesCarbonPerHectare(-0.14),
    'Brigalow Belt South': tonnesCarbonPerHectare(-0.13),
    'Ben Lomond': tonnesCarbonPerHectare(-0.31),
    'Broken Hill Complex': tonnesCarbonPerHectare(-0.01),
    'Burt Plain': tonnesCarbonPerHectare(-0.07),
    Carnarvon: tonnesCarbonPerHectare(-0.06),
    'Central Arnhem': tonnesCarbonPerHectare(-0.09),
    'Central Kimberley': tonnesCarbonPerHectare(-0.19),
    'Central Ranges': tonnesCarbonPerHectare(-0.13),
    'Channel Country': tonnesCarbonPerHectare(-0.04),
    'Central Mackay Coast': tonnesCarbonPerHectare(-0.4),
    Coolgardie: tonnesCarbonPerHectare(-0.09),
    'Cobar Peneplain': tonnesCarbonPerHectare(-0.04),
    'Cape York Peninsula': tonnesCarbonPerHectare(-0.44),
    'Daly Basin': tonnesCarbonPerHectare(-0.21),
    'Darwin Coastal': tonnesCarbonPerHectare(-0.21),
    Dampierland: tonnesCarbonPerHectare(-0.19),
    'Desert Uplands': tonnesCarbonPerHectare(-0.04),
    'Davenport Murchison Ranges': tonnesCarbonPerHectare(-0.07),
    'Darling Riverine Plains': tonnesCarbonPerHectare(-0.04),
    'Einasleigh Uplands': tonnesCarbonPerHectare(-0.25),
    'Esperance Plains': tonnesCarbonPerHectare(-0.17),
    'Eyre Yorke Block': tonnesCarbonPerHectare(-0.03),
    Finke: tonnesCarbonPerHectare(-0.06),
    'Flinders Lofty Block': tonnesCarbonPerHectare(-0.02),
    Furneaux: tonnesCarbonPerHectare(-0.43),
    Gascoyne: tonnesCarbonPerHectare(-0.14),
    Gawler: tonnesCarbonPerHectare(-0.03),
    'Geraldton Sandplains': tonnesCarbonPerHectare(-0.12),
    'Gulf Fall and Uplands': tonnesCarbonPerHectare(-0.13),
    'Gibson Desert': tonnesCarbonPerHectare(-0.16),
    'Great Sandy Desert': tonnesCarbonPerHectare(-0.09),
    'Gulf Coastal': tonnesCarbonPerHectare(-0.09),
    'Gulf Plains': tonnesCarbonPerHectare(-0.04),
    'Great Victoria Desert': tonnesCarbonPerHectare(-0.03),
    Hampton: tonnesCarbonPerHectare(-0.14),
    'Jarrah Forest': tonnesCarbonPerHectare(-0.31),
    Kanmantoo: tonnesCarbonPerHectare(-0.23),
    King: tonnesCarbonPerHectare(-0.17),
    'Little Sandy Desert': tonnesCarbonPerHectare(-0.11),
    'MacDonnell Ranges': tonnesCarbonPerHectare(-0.06),
    Mallee: tonnesCarbonPerHectare(-0.11),
    'Murray Darling Depression': tonnesCarbonPerHectare(-0.08),
    'Mitchell Grass Downs': tonnesCarbonPerHectare(-0.02),
    'Mount Isa Inlier': tonnesCarbonPerHectare(-0.08),
    'Mulga Lands': tonnesCarbonPerHectare(-0.06),
    Murchison: tonnesCarbonPerHectare(-0.12),
    Nandewar: tonnesCarbonPerHectare(-0.07),
    'Naracoorte Coastal Plain': tonnesCarbonPerHectare(-0.13),
    'New England Tablelands': tonnesCarbonPerHectare(-0.15),
    'NSW North Coast': tonnesCarbonPerHectare(-0.24),
    'Northern Kimberley': tonnesCarbonPerHectare(-0.32),
    'NSW South Western Slopes': tonnesCarbonPerHectare(-0.08),
    Nullarbor: tonnesCarbonPerHectare(0.0),
    'Ord Victoria Plain': tonnesCarbonPerHectare(-0.16),
    'Pine Creek': tonnesCarbonPerHectare(-0.33),
    Pilbara: tonnesCarbonPerHectare(-0.1),
    Riverina: tonnesCarbonPerHectare(-0.05),
    'South East Coastal Plain': tonnesCarbonPerHectare(-0.26),
    'South East Corner': tonnesCarbonPerHectare(-0.26),
    'South Eastern Highlands': tonnesCarbonPerHectare(-0.03),
    'South Eastern Queensland': tonnesCarbonPerHectare(-0.37),
    'Simpson Strzelecki Dunefields': tonnesCarbonPerHectare(-0.03),
    'Stony Plains': tonnesCarbonPerHectare(-0.03),
    'Sturt Plateau': tonnesCarbonPerHectare(-0.1),
    'Southern Volcanic Plain': tonnesCarbonPerHectare(-0.25),
    'Swan Coastal Plain': tonnesCarbonPerHectare(-0.27),
    'Sydney Basin': tonnesCarbonPerHectare(-0.18),
    Tanami: tonnesCarbonPerHectare(-0.12),
    'Tasmanian Central Highlands': tonnesCarbonPerHectare(-0.32),
    'Tiwi Cobourg': tonnesCarbonPerHectare(-0.2),
    'Tasmanian Northern Midlands': tonnesCarbonPerHectare(-0.18),
    'Tasmanian Northern Slopes': tonnesCarbonPerHectare(-0.4),
    'Tasmanian South East': tonnesCarbonPerHectare(-0.21),
    'Tasmanian Southern Ranges': tonnesCarbonPerHectare(-0.42),
    'Tasmanian West': tonnesCarbonPerHectare(-0.33),
    'Victoria Bonaparte': tonnesCarbonPerHectare(-0.22),
    'Victorian Midlands': tonnesCarbonPerHectare(-0.07),
    Warren: tonnesCarbonPerHectare(-0.31),
    'Wet Tropics': tonnesCarbonPerHectare(-0.27),
    Yalgoo: tonnesCarbonPerHectare(-0.05),
  },

  /**
   * @description Carbon to nitrogen ratio of the soil organic matter for land-use change from forestland to cropland or grassland
   * @nir2024Vol1 Section 6.13
   */
  CARBON_TO_NITROGEN_RATIO: massPerMass('Carbon', 'N', 18),

  /**
   * @description Emission factor for N mineralisation when forestland is cleared for cropland
   * @nir2024Vol1 Table 6.5.3
   */
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
  /**
   * @description Emission factor for N mineralisation when forestland is cleared for cropland
   * @nir2024Vol1 Table 6.5.3
   */
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

const aquacultureEF = massPerMass('N2O', 'Fish', 0.00169);
export const aquacultureConstants: AquacultureConstants = {
  name: 'AQUACULTURE',
  /**
   * @description Emissions factor for aquaculture. There is only one defined factor - emissions
   * are only counted for coastal wetland habitats and offshore cages in seagrass meadows. '0'
   * is used for all other cases.
   * @reference https://www.researchgate.net/publication/224976439_Nitrous_Oxide_N2O_Emission_from_Aquaculture_A_Review
   */
  AQUACULTURE_EF: {
    'Coastal wetland habitat': aquacultureEF,
    'Offshore cages in seagrass meadows': aquacultureEF,
    Other: massPerMass('N2O', 'Fish', 0),
  },
};
