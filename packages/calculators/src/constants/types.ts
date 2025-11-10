import {
  AquacultureBait,
  BeefClassesAPI,
  FeedlotPurchaseSourceLocation,
  FluidWasteTreatmentType,
  FreightTypes,
  Refrigerant,
  RicePreseasonFloodingPeriod,
  SheepClassesAPI,
  StationaryFuelTypes,
  TransportFuelTypes,
  WaterRegimeSubType,
} from '@/types/enums';

export const STATES = {
  NSW: 'nsw',
  VIC: 'vic',
  QLD: 'qld',
  SA: 'sa',
  WA_NW: 'wa_nw',
  WA_SW: 'wa_sw',
  TAS: 'tas',
  NT: 'nt',
  ACT: 'act',
} as const;

export const LIVESTOCK_SOURCE_LOCATION = {
  'Dairy origin': 'Dairy origin',
  'nth/sth/central QLD': 'nth/sth/central QLD',
  'nth/sth NSW/VIC/sth SA': 'nth/sth NSW/VIC/sth SA',
  'NSW/SA pastoral zone': 'NSW/SA pastoral zone',
  'sw WA': 'sw WA',
  'WA pastoral': 'WA pastoral',
  TAS: 'TAS',
  NT: 'NT',
};

export type TreeRegions =
  | 'South West'
  | 'Pilbara'
  | 'Kimberley'
  | 'Central West'
  | 'South Coastal'
  | 'Goldfields/Eucla'
  | 'Gascoyne'
  | 'Central Wheat Belt'
  | 'Interior'
  | 'North Coast'
  | 'South Coast'
  | 'Northern Tablelands'
  | 'Southern Tablelands'
  | 'Northern Wheat/Sheep'
  | 'Southern Wheat/Sheep'
  | 'Western'
  | 'North East'
  | 'East Coast'
  | 'Central North/Midlands/South East'
  | 'Central Plateau/Derwent Valley'
  | 'West/South Coast'
  | 'North West'
  | 'South East'
  | 'Murray'
  | 'Mid-North/Flinders'
  | 'Pastoral'
  | 'West Coast/Eyre'
  | 'Mallee'
  | 'Wimmera'
  | 'Northern Country'
  | 'North East Vic'
  | 'East Gippsland'
  | 'West/South Gippsland'
  | 'Central'
  | 'South West Vic'
  | 'Central Highlands/Northern'
  | 'Central West/Flinders'
  | 'Channel Country'
  | 'Maranoa/Warrego'
  | 'Darling Downs/Burnett'
  | 'North West/Gulf'
  | 'Darwin-Daly'
  | 'Arnhem-Roper'
  | 'Victoria River-TennantCreek'
  | 'Alice Springs';

export type SavannahRegions =
  | 'Qld1'
  | 'Qld2'
  | 'Qld3'
  | 'Qld4'
  | 'Qld5'
  | 'Qld6'
  | 'Qld7'
  | 'Qld8'
  | 'Qld9'
  | 'Qld10'
  | 'NT1'
  | 'NT2'
  | 'NT3'
  | 'NT4'
  | 'NT5'
  | 'NT6'
  | 'NT7'
  | 'NT8'
  | 'NT9'
  | 'NT10'
  | 'Kimberley1'
  | 'Kimberley2'
  | 'Kimberley3'
  | 'Kimberley4'
  | 'Kimberley5'
  | 'Kimberley6'
  | 'Kimberley7'
  | 'Kimberley8'
  | 'Kimberley9'
  | 'Kimberley10'
  | 'Pilbara1'
  | 'Pilbara2'
  | 'Pilbara3'
  | 'Pilbara4'
  | 'Pilbara5'
  | 'Pilbara6'
  | 'Pilbara7'
  | 'Pilbara8'
  | 'Pilbara9'
  | 'Pilbara10';

export type VegetationTypes =
  | 'Shrubland hummock'
  | 'Woodland Hummock'
  | 'Melaleuca woodland'
  | 'Woodland Mixed'
  | 'Open forest mixed'
  | 'Shrubland (heath) with hummock grass'
  | 'Woodland with hummock grass'
  | 'Open woodland with mixed grass'
  | 'Woodland with mixed grass'
  | 'Woodland with tussock grass';

export type Seasons = 'spring' | 'summer' | 'autumn' | 'winter';
export type States = (typeof STATES)[keyof typeof STATES];
export type SheepTypes = (typeof SheepClassesAPI)[number];
export type LivestockSourceLocations =
  (typeof LIVESTOCK_SOURCE_LOCATION)[keyof typeof LIVESTOCK_SOURCE_LOCATION];

type BySeasonAndState = {
  [season in Seasons]: {
    [state in States]: number;
  };
};

type ByChemical = {
  CO2: number;
  CH4: number;
  N2O: number;
};

type FuelFactor = {
  ENERGY_CONTENT_FACTOR: number;
  SCOPE1_EF: {
    CO2: number;
    CH4: number;
    N2O: number;
  };
  SCOPE3_EF: number;
};

type FisheriesFuelFactor = {
  CO2: number;
  CH4: number;
  N2O: number;
  SCOPE3: number;
};

type PastureAttributes = {
  FRACRENEWED_INTENSIVE: number;
  FRACRENEWED_OTHER: number;
  AVERAGE_YIELD: number;
  BELOW_ABOVE_RATIO: number;
  NCONTENT_ABOVEGROUND: number;
  NCONTENT_BELOWGROUND: number;
  NCONTENT_ABOVEGROUND_RESIDUE_REMOVED: number;
};

type FertiliserBreakdown = {
  N: number;
  P: number;
  K: number;
  S: number;
};

type CropResidueFactors = {
  residueCropRatio: number;
  belowAboveResidueRatio: number;
  dryMatterContent: number;
  carbonMassFraction: number;
  aboveGroundN: number;
  belowGroundN: number;
  fractionOfResidueAtBurning: number;
  fractionBurnt: number;
  fractionRemoved: number;
};

export type SheepConstants = {
  FEEDAVAILABILITY: BySeasonAndState;

  CRUDEPROTEIN: BySeasonAndState;

  DRYMATTERDIGESTIBILITY: BySeasonAndState;

  EMISSIONFACTOR: {
    MERINO: number;
    CROSSBRED: number;
  };

  STANDARDWEIGHT: Record<SheepTypes, Record<States, number>>;

  EF_URINEDUNGDEPOSITED: number;
};

export type BeefConstants = {
  DRYMATTERDIGESTIBILITY: BySeasonAndState;

  CRUDEPROTEIN: BySeasonAndState;

  NITROGENEXCRETEDNUMBER: Record<
    (typeof BeefClassesAPI)[number],
    Record<States, number>
  >;

  EF_URINEDUNGDEPOSITED: number;

  LIVESTOCK_SOURCE_EMISSIONFACTOR: {
    [location in LivestockSourceLocations]: number;
  };

  MILK_INTAKE: {
    NORTHOFTROPIC: {
      CALVING_SEASON: number;
      SEASON_AFTER_CALVING: number;
    };
    SOUTHOFTROPIC: {
      CALVING_SEASON: number;
      SEASON_AFTER_CALVING: number;
    };
  };

  FEED_ADJUSTMENT: {
    CALVING_SEASON: number;
    SEASON_AFTER_CALVING: number;
  };
};

export type SavannaConstants = {
  FUELCOARSE: {
    'Combined Ref': { [region in SavannahRegions]: string };
    Yo: { [region in SavannahRegions]: number };
    L: { [region in SavannahRegions]: number };
    D: { [region in SavannahRegions]: number };
  };

  FUELFINE: {
    'Combined Ref': { [region in SavannahRegions]: string };
    Yo: { [region in SavannahRegions]: number };
    L: { [region in SavannahRegions]: number };
    D: { [region in SavannahRegions]: number };
    Gc: { [region in SavannahRegions]: number };
  };

  BURN_PATCHINESS: {
    'early dry season': { high: number; low: number };
    'late dry season': { high: number; low: number };
  };

  BURN_COMPLETENESSOFCOMBUSTION: {
    low: {
      fine: { 'early dry season': number; 'late dry season': number };
      coarse: { 'early dry season': number; 'late dry season': number };
    };
    high: {
      fine: { 'early dry season': number; 'late dry season': number };
      coarse: { 'early dry season': number; 'late dry season': number };
    };
  };

  FUELBURNT_VEGETATION_CARBONFRACTION: {
    fine: { [vegetationType in VegetationTypes]: number };
    coarse: { [vegetationType in VegetationTypes]: number };
  };

  FUELBURNT_VEGETATION_EF_CH4: {
    fine: { [vegetationType in VegetationTypes]: number };
    coarse: { [vegetationType in VegetationTypes]: number };
  };

  FUELBURNT_VEGETATION_NITROGENCARBONRATIO: {
    fine: { [vegetationType in VegetationTypes]: number };
    coarse: { [vegetationType in VegetationTypes]: number };
  };

  FUELBURNT_VEGETATION_N2O: {
    fine: { [vegetationType in VegetationTypes]: number };
    coarse: { [vegetationType in VegetationTypes]: number };
  };

  FUEL_STATEREF: {
    wa_nw: number;
    act: number;
    nsw: number;
    tas: number;
    wa_sw: number;
    sa: number;
    vic: number;
    qld: number;
    nt: number;
    kimberley: number;
    pilbara: number;
  };
};

export type FeedlotConstants = {
  MANURE_EF: {
    Drylot: { EF: number; FracGASM: number };
    'Solid Storage': { EF: number; FracGASM: number };
    Composting: { EF: number; FracGASM: number };
    'Uncovered anaerobic lagoon': { EF: number; FracGASM: number };
  };

  INTEGRATED_EF: {
    [state in States]: number;
  };

  PURCHASELIVESTOCK_EF: {
    [location in FeedlotPurchaseSourceLocation]: number;
  };

  MN_LEACH: number;
  UN_SOIL: number;
  FN_SOIL: number;
  AG_SOILS: number;
  ANNUAL_N2O_EF: number;
  I_NOF: number;
  I_FRACGASM: number;
  INDIRECT_EF: number;
  ASH_CONTENT: number;
  EMISSION_POTENTIAL: number;
};

export type PoultryConstants = {
  DIET_PROPERTIES: {
    [type in
      | 'layers'
      | 'meat_chicken_growers'
      | 'meat_chicken_layers'
      | 'meat_other']: {
      dryMatterIntake: number;
      dryMatterDigestibility: number;
      crudeProtein: number;
      nitrogenRetentionRate: number;
      manureAsh: number;
    };
  };

  WASTE_MMS: {
    [state in States]: number;
  };

  MEATLAYER_EF_IMCF: {
    meat_chickens: {
      [state in States]: number;
    };
    layer_chickens: {
      [state in States]: number;
    };
  };

  MEATLAYER_EF: {
    meat_chickens: {
      iFracGASM: number;
      iNOF: number;
    };
    layer_chickens: {
      iFracGASM: number;
      iNOF: number;
    };
  };

  FEED_INGREDIENTS_GHG: {
    wheat: number;
    barley: number;
    soybean: number;
    sorghum: number;
    millrun: number;
  };
};

export type PorkConstants = {
  MANURE_NITROGEN: {
    [type in 'boars' | 'sows' | 'gilts' | 'slaughter_pigs']: number;
  };

  MANURE_CHARACTERISTICS: {
    [type in 'boars' | 'sows' | 'gilts' | 'slaughter_pigs']: number;
  };

  HERD_FEEDINTAKE: {
    [type in 'boars' | 'sows' | 'gilts' | 'slaughter_pigs']: number;
  };

  INTEGRATED_EF: {
    [state in States]: {
      iMCF: number;
      iFracGasm: number;
      iNOF: number;
    };
  };

  FRACWET: {
    [state in States]: number;
  };

  WASTE_MMS: {
    [state in States]: number;
  };

  FEED_INGREDIENT_EF: {
    wheat: number;
    barley: number;
    wheyPowder: number;
    canolaMeal: number;
    soybeanMeal: number;
    meatMeal: number;
    bloodMeal: number;
    fishmeal: number;
    tallow: number;
    wheatBran: number;
    beetPulp: number;
    millMix: number;
  };

  METHANE_EMISSION_POTENTIAL: number;
  EF_BEDDING: number;

  MMS: {
    outdoorSystems: {
      MCF: number;
      FracGASM: number;
      NOF: number;
    };
    coveredAnaerobicPond: {
      MCF: number;
      FracGASM: number;
      NOF: number;
    };
    uncoveredAnaerobicPond: {
      MCF: number;
      FracGASM: number;
      NOF: number;
    };
    deepLitter: {
      MCF: number;
      FracGASM: number;
      NOF: number;
    };
  };
};

export type DairyConstants = {
  MANURE_MANAGEMENT: {
    PASTURE_EF: number;
    ANAEROBIC_EF: number;
    SUMP_EF: number;
    DRAIN_EF: number;
    SOLID_EF: number;
    PASTURE_FRACGASM: number;
    ANAEROBIC_FRACGASM: number;
    SUMP_FRACGASM: number;
    DRAIN_FRACGASM: number;
    SOLID_FRACGASM: number;
  };

  CATTLE_STANDARD_REFERENCE_WEIGHTS: {
    milkingCows: number;
    heifersLt1: number;
    heifersGt1: number;
    dairyBullsLt1: number;
    dairyBullsGt1: number;
  };

  CATTLE_N2O_MMS: {
    void_at_pasture: { EF: number; FracGASM: number };
    anaerobic_lagoon: { EF: number; FracGASM: number };
    daily_spread: { EF: number; FracGASM: number };
    solid_storage: { EF: number; FracGASM: number };
  };

  MASS_N_VOLATISED_EF: number;
  MMS_EF: number;

  METHANE_MPW: {
    milkingCows: number;
    heifersLt1: number;
    heifersGt1: number;
    dairyBullsLt1: number;
    dairyBullsGt1: number;
  };

  PRODUCTIONSYSTEM_EF: {
    RAINFALL_LT_600: {
      'Non-irrigated Crop': number;
      'Irrigated Crop': number;
      'Irrigated Pasture': number;
      'Non-irrigated Pasture': number;
    };
    RAINFALL_GT_600: {
      'Non-irrigated Crop': number;
      'Irrigated Crop': number;
      'Irrigated Pasture': number;
      'Non-irrigated Pasture': number;
    };
  };

  METHANE_CONVERSION_FACTOR: {
    [state in States]: {
      Pasture: number;
      'Anaerobic lagoon': number;
      'Sump and dispersal systems': number;
      'Drains to paddock': number;
      'Solid Storage': number;
    };
  };

  ASH_CONTENT: number;
};

export type GoatConstants = {
  EF: number;
  MANUREPRODUCTION: number;
};

export type BuffaloConstants = {
  NITROGEN_EXCRETED_FACTOR: number;
  FAECALN_PMF: number;
  SEASONALURINE_PMU: number;
  MANUREPRODUCTION: number;
  ENTERIC_EF: number;
};

export type DeerConstants = {
  MANUREPRODUCTION: number;
  ENTERIC_EF: number;
  NITROGEN_EXCRETED_FACTOR: number;
  FAECALN_PMF: number;
};

export type FisheriesConstants = {
  TRANSPORT_FUEL_USAGE: {
    None: number;
    'Small Car': number;
    'Medium Car': number;
    'Large Car': number;
    'Courier Van-Utility': number;
    '4WD Mid Size': number;
    'Light Rigid': number;
    'Medium Rigid': number;
    'Heavy Rigid': number;
    'Heavy Bus': number;
  };

  TRANSPORT_FUEL_EF: {
    Gasoline: FisheriesFuelFactor;
    'Diesel oil': FisheriesFuelFactor;
    'Liquefied petroleum gas (LPG)': FisheriesFuelFactor;
    'Fuel oil': FisheriesFuelFactor;
    Ethanol: FisheriesFuelFactor;
    Biodiesel: FisheriesFuelFactor;
    'Renewable diesel': FisheriesFuelFactor;
    'Other biofuels': FisheriesFuelFactor;
    'Liquified natural gas': FisheriesFuelFactor;
  };

  BAIT_EF: {
    'Fish Frames': number;
    'Fish Heads': number;
    Sardines: number;
    Squid: number;
    'Whole Fish': number;
  };
};

export type LivestockConstants = {
  PURCHASED_LIVESTOCK_EF: {
    BUFFALO: number;
    DEER: number;
    GOAT: number;
    PORK: number;
    POULTRY_CONVENTIONAL: number;
    POULTRY_FREE_RANGE: number;
  };

  // Emission factor (EF) (Gg N2O-N/GgN)
  AGRICULTURAL_SOILS: {
    EF_IRRIGATEDPASTURE: number;
    EF_IRRIGATEDCROP: number;
    EF_NONIRRIGATEDCROP: number;
    EF_NONIRRIGATEDPASTURE: number;
  };

  // Methane

  METHANE_WARM_EF: number;
  METHANE_TEMPERATE_EF: number;
  METHANE_EMISSION_POTENTIAL: number;
  METHANE_DENSITY: number;

  OTHERLIVESTOCK_ALLOCATION_CLIMATEREGIONS: {
    [state in States]: {
      warm: number;
      temperate: number;
    };
  };

  URINEDUNG_EF: number;

  CARBON_FRACTION_OF_UREA: number;

  FRAC_GASM: number;

  INOGRANICFERTILISER_ATMOSPHERIC_N: number;
  LEECHING_AND_RUNOFF: number;

  ENERGY_TO_MANUFACTURE: {
    HERBICIDE_ENERGY: number; // MJ/kg
    HERBICIDEGENERAL_ENERGY: number;
    INSECTICIDE_ENERGY: number;
    HERBICIDE_EF: number; // kg CO2-e/MJ
    HERBICIDEGENERAL_EF: number;
    INSECTICIDE_EF: number;
  };

  EMISSION_BREAKDOWN: {
    HERBICIDE: {
      CO2: number;
      CH4: number;
      N2O: number;
    };
  };
};

export type SugarConstants = {
  SUGAR_ANNUAL_N2O_PRODUCTION_EF: number;

  SUGAR_YIELD: number;
};

export type CottonConstants = {
  COTTON_INTENSITY_ECONOMIC_ALLOCATION: {
    LINT: number;
    SEED: number;
  };
};

export type AquacultureConstants = {
  AQUACULTURE_BAIT_EF: Record<AquacultureBait, number>;
};

export type CropConstants = {
  FERTILISER_FRACTION_RUNOFF_STATIC: number;

  COMPONENTS_ENERGY_EF: {
    N: { TOTAL_ENERGY: number; EF: number };
    P: { TOTAL_ENERGY: number; EF: number };
    K: { TOTAL_ENERGY: number; EF: number };
    S: { TOTAL_ENERGY: number; EF: number };
  };

  PRODUCTIONSYSTEM_EF: {
    RAINFALL_LT_600: {
      'Non-irrigated crop': number;
      'Irrigated crop': number;
      'Sugar cane': number;
      Cotton: number;
      Horticulture: number;
    };
    RAINFALL_GT_600: {
      'Non-irrigated crop': number;
      'Irrigated crop': number;
      'Sugar cane': number;
      Cotton: number;
      Horticulture: number;
    };
  };

  PASTURE_ATTRIBUTES: {
    'Annual grass': PastureAttributes;
    'Grass clover mixture': PastureAttributes;
    Lucerne: PastureAttributes;
    'Other legume': PastureAttributes;
    'Perennial pasture': PastureAttributes;
  };

  CROPRESIDUE_PROPORTIONBURNT: {
    [state in States]: {
      burnt: number;
      removed: number;
    };
  };

  CROPRESIDUE_FRACTIONSUGARCANEBURNT: {
    [state in States]: {
      burnt: number;
      removed: number;
    };
  };

  CROPRESIDUE: {
    Wheat: CropResidueFactors;
    Barley: CropResidueFactors;
    Maize: CropResidueFactors;
    Oats: CropResidueFactors;
    Rice: CropResidueFactors;
    Sorghum: CropResidueFactors;
    Triticale: CropResidueFactors;
    'Other Cereals': CropResidueFactors;
    Pulses: CropResidueFactors;
    'Tuber and Roots': CropResidueFactors;
    Peanuts: CropResidueFactors;
    'Sugar Cane': CropResidueFactors;
    Cotton: CropResidueFactors;
    Hops: CropResidueFactors;
    Oilseeds: CropResidueFactors;
    'Forage Crops': CropResidueFactors;
    Lucerne: CropResidueFactors;
    'Other legume': CropResidueFactors;
    'Annual grass': CropResidueFactors;
    'Grass clover mixture': CropResidueFactors;
    'Perennial pasture': CropResidueFactors;
    'Perennial Hort': CropResidueFactors;
    'Annual Hort': CropResidueFactors;
  };

  CROP_RESIDUE_N2O_EF: number;

  BURNING_EFFICIENCY_RESIDUE: number;
  BURNING_N2O_EF: number;
  BURNING_METHANE_EF: number;
};

export type RiceConstants = {
  EF_FLOODED_FIELDS: number;
  SF_CULTIVATION_WATER_REGIME: Record<WaterRegimeSubType, number>;
  SF_PRESEASON_WATER_REGIME: Record<RicePreseasonFloodingPeriod, number>;
};

export type CommonConstants = {
  FEED_PURCHASED: {
    grain: { TotalGHG: number };
    cottonseed: { TotalGHG: number };
    hay: { TotalGHG: number };
  };

  FERTILISER_CONTENT: {
    MAP: FertiliserBreakdown;
    DAP: FertiliserBreakdown;
    SSP: FertiliserBreakdown;
    UREA: FertiliserBreakdown;
    TSP: FertiliserBreakdown;
    UAN: FertiliserBreakdown;
    SP11: FertiliserBreakdown;
    SP21: FertiliserBreakdown;
    SP31: FertiliserBreakdown;
    SP41: FertiliserBreakdown;
    SP51: FertiliserBreakdown;
    MURIATE_OF_POTASH: FertiliserBreakdown;
    SULPHATE_OF_POTASH: FertiliserBreakdown;
    SULPHATE_OF_AMMONIA: FertiliserBreakdown;
    AN: FertiliserBreakdown;
    CAN: FertiliserBreakdown;
  };

  COMMERCIALFLIGHT_EF: number;

  REFRIGERANT_GWP: Record<Refrigerant, number>;

  WASTEWATER: {
    TREATMENT_EF: Record<FluidWasteTreatmentType, number>;
    F_SLUDGE_FRACTION: number;
    EF_COD: number;
    METHANE_PRODUCTION: number;
    FLARE_EF: number;
  };

  COMPOSTING_EF: number;

  MUNICIPAL_SOLID_WASTE_EF: number;

  ELECTRICITY: {
    [state in States | 'Australia']: {
      SCOPE2_EF: number;
      SCOPE3_EF: number;
    };
  };

  UREA_FERTILISER_GHG: number;
  SUPERPHOSPHATE_GHG: number;

  MATERIAL_BREAKDOWN_SUPPLEMENTATION: {
    mineralblock: ByChemical & { KG_CO2: number; FRACTION_OF_UREA: number };
    weanerblock: ByChemical & { KG_CO2: number; FRACTION_OF_UREA: number };
    dryseasonmix: ByChemical & { KG_CO2: number; FRACTION_OF_UREA: number };
  };

  CUSTOMIZED_FERTILIZER: {
    'Monoammonium phosphate (MAP)': { TotalGHG: number };
    'Diammonium Phosphate (DAP)': { TotalGHG: number };
    'Urea-Ammonium Nitrate (UAN)': { TotalGHG: number };
    'Ammonium Nitrate (AN)': { TotalGHG: number };
    'Calcium Ammonium Nitrate (CAN)': { TotalGHG: number };
    'Triple Superphosphate (TSP)': { TotalGHG: number };
    'Super Potash 1:1': { TotalGHG: number };
    'Super Potash 2:1': { TotalGHG: number };
    'Super Potash 3:1': { TotalGHG: number };
    'Super Potash 4:1': { TotalGHG: number };
    'Super Potash 5:1': { TotalGHG: number };
    'Muriate of Potash': { TotalGHG: number };
    'Sulphate of Potash': { TotalGHG: number };
    'Sulphate of Ammonia': { TotalGHG: number };
  };

  FERTILISER_EF: number;

  AGROCHEMICAL_ENERGY_MANUFACTURE: {
    HERBICIDE_GLYPHOSATE: { TOTAL_ENERGY: number; EF: number };
    HERBICIDE_GENERAL: { TOTAL_ENERGY: number; EF: number };
    INSECTICIDE: { TOTAL_ENERGY: number; EF: number };
  };

  FUEL_ENERGYGJ: {
    STATIONARY: Record<keyof typeof StationaryFuelTypes, FuelFactor>;
    TRANSPORT: Record<keyof typeof TransportFuelTypes, FuelFactor>;
    NATURAL_GAS: {
      ENERGY_CONTENT_FACTOR: number;
      SCOPE1_EF: {
        CO2: number;
        CH4: number;
        N2O: number;
      };
      SCOPE3_EF: {
        [state in States]: number;
      };
    };
  };

  TRANSPORT_FUEL_USAGE: {
    '4 Deck Trailer': number;
    '6 Deck Trailer': number;
    'B-Double': number;
  };

  TRANSPORT_ECF: {
    CO2: number;
    CH4: number;
    N2O: number;
  };

  LIMING: {
    SCOPE1: {
      LIMESTONE_FRACTIONPURITY: number;
      LIMESTONE_EF: number;
      DOLOMITE_FRACTIONPURITY: number;
      DOLOMITE_EF: number;
    };
    SCOPE3: {
      FUEL_SCOPE3_PRODUCTION_NATURAL_GAS: number;
      FUEL_SCOPE3_PRODUCTION_ELECTRICITY: number;
      FUEL_SCOPE3_PRODUCTION_DISTILLATE_FUEL: number;
      FUEL_SCOPE3_PRODUCTION_COAL: number;
      FUEL_SCOPE3_PRODUCTION_GASOLINE: number;
      FUEL_SCOPE3_POST_PRODUCTION_DISTILLATE_FUEL: number;
    };
  };

  // Trees
  TREE_REGIONS: {
    RegionNo: { [treeRegion in TreeRegions]: number };
    SoilType1: { [treeRegion in TreeRegions]: string };
    SoilType2: { [treeRegion in TreeRegions]: string };
    TreeSpecies1: { [treeRegion in TreeRegions]: string };
    TreeSpecies2: { [treeRegion in TreeRegions]: string };
    TreeSpecies3: { [treeRegion in TreeRegions]: string };
    TreeSpecies4: { [treeRegion in TreeRegions]: string };
    TreeSpecies5: { [treeRegion in TreeRegions]: string };
    TreeSpecies6: { [treeRegion in TreeRegions]: string };
  };

  LEACHING: {
    FRACLEACH: number;
    FRACLEACH_MMS: number;
    FRACLEACH_FERTILISER_SOILS: number;
    FRACLEACH_BROILER: number;
    FRACWET: number;
    FERT_N_FRACLEACH: number;
    FERT_N_FRACWET: number;
    STORAGE_FRACLEACH: number;
    STORAGE_FRACWET: number;
    STORAGE_EF: number;
    N2O_EF: number;
  };

  // Extras

  EF_TEMPERATURE: number;

  GWP_FACTORSC5: number;
  GWP_FACTORSC6: number;
  GWP_FACTORSC13: number;
  GWP_FACTORSC14: number;
  GWP_FACTORSC15: number;
  GWP_FACTORSC16: number;
  GWP_FACTORSC18: number;
  GWP_FACTORSC22: number;

  FRAC_GASF: number;

  // Atmospheric N deposition inorganic fertiliser

  FREIGHT_KG_TONNE_EF: Record<FreightTypes, number>;
};

export type AllConstants = {
  COMMON: CommonConstants;
  CROP: CropConstants;
  FISHERIES: FisheriesConstants;
  RICE: RiceConstants;
  AQUACULTURE: AquacultureConstants;
  BEEF: BeefConstants;
  BUFFALO: BuffaloConstants;
  COTTON: CottonConstants;
  DAIRY: DairyConstants;
  DEER: DeerConstants;
  FEEDLOT: FeedlotConstants;
  GOAT: GoatConstants;
  LIVESTOCK: LivestockConstants;
  PORK: PorkConstants;
  POULTRY: PoultryConstants;
  SAVANNA: SavannaConstants;
  SHEEP: SheepConstants;
  SUGAR: SugarConstants;
};
