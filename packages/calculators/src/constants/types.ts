import {
  EnergyPerMass,
  EnergyPerVolume,
  Mass,
  MassPerArea,
  MassPerElectricity,
  MassPerEnergy,
  MassPerHeadPerDay,
  MassPerMass,
  MassPerTime,
  MassPerVolume,
  NumberUnitBase,
  RealNumber,
  VolumePerMass,
} from '@/tools/units';
import {
  AgrochemicalType,
  AviationFuelType,
  BasicCropProductionSystem,
  BeefClass,
  CarsLightCommercialFuelType,
  CarsLightCommercialPre2004FuelType,
  ClimateZone,
  CropType,
  DairyClass,
  DairyMMSType,
  DairySystem,
  ExtendedRegion,
  FeedlotDurationType,
  FeedlotMMSType,
  FuelStationaryMassBasedLiquidType,
  FuelStationarySolidType,
  FuelStationaryVolumeBasedLiquidType,
  HeavyDutyFuelType,
  InorganicFertiliserComponentOrigin,
  InorganicFertiliserComponentTypeNonRegional,
  InorganicFertiliserComponentTypeRegional,
  InorganicFertiliserType,
  LightDutyFuelType,
  OffRoadAgricultureAndForestryEquipmentFuelType,
  OrganicFertiliserType,
  PastureType,
  PoultryClass,
  PoultryMMSType,
  PurchasedFeedAquacultureType,
  PurchasedFeedLivestockRegionalType,
  PurchasedFeedLivestockRegionlessType,
  PurchasedFeedRegion,
  RefrigerantType,
  RefrigerationType,
  Region,
  Season,
  ServiceByAreaType,
  ServiceByHourType,
  SolidWasteByVolumeType,
  SolidWasteIncinerationType,
  SolidWasteLandfillType,
  State,
  SwineMMSType,
  VesselFuelType,
} from './enums';

export type ReplaceNumberUnits<T> = T extends NumberUnitBase
  ? number
  : {
      [K in keyof T]: ReplaceNumberUnits<T[K]>;
    };

export type NamedConstants = {
  name: string;
};

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
export type States = (typeof STATES)[keyof typeof STATES];

export type GasType = 'CO2' | 'CH4' | 'N2O';
export type FuelFactorByVolume = {
  ENERGY_CONTENT_FACTOR: EnergyPerVolume<'Fuel'>;
  SCOPE1_EF: { [G in GasType]: MassPerEnergy<G> };
  SCOPE3_EF: MassPerEnergy<'CO2e'>;
};

export type FuelFactorByMass = {
  ENERGY_CONTENT_FACTOR: EnergyPerMass<'Fuel'>;
  SCOPE1_EF: { [G in GasType]: MassPerEnergy<G> };
  SCOPE3_EF: MassPerEnergy<'CO2e'>;
};
export type CommonConstants = NamedConstants & {
  AGROCHEMICAL_FACTORS: Record<
    AgrochemicalType,
    MassPerMass<'CO2e', 'Chemical'>
  >;

  EF_UREA_CO2: MassPerMass<'CO2e', 'Urea'>;
  GWP_FACTORSC6: MassPerMass<'N2O', 'CO2e'>;
  GWP_FACTORSC13: MassPerMass<'CO2', 'CO2e'>;
  GWP_FACTORSC14: RealNumber;

  GWP_FACTORSC15: RealNumber;
  GWP_FACTORSC18: RealNumber;

  GWP_CH4: MassPerMass<'CO2e', 'CH4'>;
  EMISSIONS_POTENTIAL_VOLATILE_SOLIDS_TO_CH4: VolumePerMass<
    'CH4',
    'Volatile Solids'
  >;

  DENSITY_OF_METHANE: MassPerVolume<'CH4', 'CH4'>;

  LIME_SCOPE3_EF: MassPerMass<'CO2e', 'Lime'>;

  ELECTRICITY: {
    [state in States | 'Australia']: {
      SCOPE2_EF: MassPerElectricity<'CO2e'>;
      SCOPE3_EF: MassPerElectricity<'CO2e'>;
    };
  };

  ELECTRICITY_RMF_SCOPE2_EF: MassPerElectricity<'CO2e'>;
  ELECTRICITY_RMF_SCOPE3_EF: MassPerElectricity<'CO2e'>;

  RENEWABLE_POWER_PERCENTAGE: RealNumber;

  JURISDICTIONAL_RENEWABLE_POWER_PERCENTAGE: RealNumber;

  STATIONARY_FUEL_FACTORS_BY_MASS: {
    'Solid fuels': Record<FuelStationarySolidType, FuelFactorByMass>;
    'Liquid fuels': Record<FuelStationaryMassBasedLiquidType, FuelFactorByMass>;
  };

  STATIONARY_FUEL_FACTORS_BY_VOLUME: {
    'Liquid fuels': Record<
      FuelStationaryVolumeBasedLiquidType,
      FuelFactorByVolume
    >;
  };

  TRANSPORT_FUEL_FACTORS: {
    'Cars and light commercial vehicles': Record<
      CarsLightCommercialFuelType,
      FuelFactorByVolume
    >;
    'Cars and light commercial vehicles (pre 2004)': Record<
      CarsLightCommercialPre2004FuelType,
      FuelFactorByVolume
    >;
    'Light duty vehicles': Record<LightDutyFuelType, FuelFactorByVolume>;
    'Heavy duty vehicles': Record<HeavyDutyFuelType, FuelFactorByVolume>;
    Aviation: Record<AviationFuelType, FuelFactorByVolume>;
    Vessel: Record<VesselFuelType, FuelFactorByVolume>;
    'Off-road Agriculture and forestry equipment': Record<
      OffRoadAgricultureAndForestryEquipmentFuelType,
      FuelFactorByVolume
    >;
  };

  NATURAL_GAS_FACTORS: {
    ENERGY_CONTENT_FACTOR: EnergyPerVolume<'Fuel'>;
    SCOPE1_EF: { [G in GasType]: MassPerEnergy<G> };
    SCOPE3_EF: Record<States, MassPerEnergy<'CO2e'>>;
  };

  LIMING: {
    LIMESTONE_PURITY: RealNumber;
    LIMESTONE_EF: MassPerMass<'CO2', 'Lime'>;
    DOLOMITE_PURITY: RealNumber;
    DOLOMITE_EF: MassPerMass<'CO2', 'Lime'>;
  };

  // NGAF 2023 Table 10
  REFRIGERATION_LEAKAGE_RATES: Record<RefrigerationType, RealNumber>;
  REFRIGERANT_GWP: Record<RefrigerantType, MassPerMass<'CO2e', 'Refrigerant'>>;

  SERVICE_EMISSIONS_BY_AREA: Record<ServiceByAreaType, MassPerArea<'CO2e'>>;
  SERVICE_EMISSIONS_BY_HOUR: Record<ServiceByHourType, MassPerTime<'CO2e'>>;

  SOLID_WASTE_LANDFILL_EF: Record<
    SolidWasteLandfillType,
    MassPerMass<'CO2e', 'Solid Waste'>
  >;
  SOLID_WASTE_INCINERATION_EF: Record<
    SolidWasteIncinerationType,
    MassPerMass<'CO2e', 'Solid Waste'>
  >;

  SOLID_WASTE_COMPOSTING_EF: MassPerMass<'CO2e', 'Solid Waste'>;
  SOLID_WASTE_ANAEROBIC_DIGESTION_EF: MassPerMass<'CO2e', 'Solid Waste'>;

  SOLID_WASTE_BY_VOLUME_TO_MASS: Record<
    SolidWasteByVolumeType,
    MassPerVolume<'Solid Waste', 'Solid Waste'>
  >;

  CRUDE_PROTEIN_TO_NITROGEN_CONVERSION: MassPerMass<'CrudeProtein', 'N'>;

  // REVISIT: Could move to the common livestock area
  ASH_CONTENT_OF_MANURE: RealNumber;
};

type CropResidueFactors = {
  residueCropRatio: MassPerMass<'CropResidue', 'DryMatter'>;
  belowAboveResidueRatio: RealNumber;
  dryMatterContent: MassPerMass<'DryMatter', 'CropResidue'>;
  carbonMassFraction: RealNumber;
  aboveGroundN: MassPerMass<'N', 'DryMatter'>;
  belowGroundN: MassPerMass<'N', 'DryMatter'>;
  fractionOfResidueAtBurning: RealNumber;
  fractionBurnt: RealNumber;
};

type PastureResidueFactors = {
  // averageYield: number;
  belowAboveResidueRatio: RealNumber;
  aboveGroundN: MassPerMass<'N', 'DryMatter'>;
  belowGroundN: MassPerMass<'N', 'DryMatter'>;
  fractionRemoved: RealNumber;
};

type InorganicFertiliserFractions = {
  N: MassPerMass<'N', 'Inorganic Fertiliser'>;
  Urea: MassPerMass<'Urea', 'Inorganic Fertiliser'>;
  Volatilises: MassPerMass<'Volatilised N', 'N'>;
  Scope3EF: MassPerMass<'CO2e', 'Inorganic Fertiliser'>;
};

type InorganicFertiliserFractionRegions = Record<
  InorganicFertiliserComponentOrigin,
  MassPerMass<'CO2e', 'Inorganic Fertiliser'>
>;

type InorganicFertiliserFractionsByRegion = Record<
  InorganicFertiliserComponentTypeRegional,
  InorganicFertiliserFractionRegions
>;

type InorganicFertiliserFractionNonRegional = Record<
  InorganicFertiliserComponentTypeNonRegional,
  MassPerMass<'CO2e', 'Inorganic Fertiliser'>
>;

type OrganicFertiliserFractions = {
  N: MassPerMass<'N', 'Organic Fertiliser'>;
};

export type CropConstants = NamedConstants & {
  INORGANIC_FERTILISER_FRACTIONS: Record<
    InorganicFertiliserType,
    InorganicFertiliserFractions
  >;

  INORGANIC_FERTILISER_FRACTIONS_BY_REGION: InorganicFertiliserFractionsByRegion;
  INORGANIC_FERTILISER_FRACTIONS_BY_NON_REGIONAL: InorganicFertiliserFractionNonRegional;

  ORGANIC_FERTILISER_FRACTIONS: Record<
    OrganicFertiliserType,
    OrganicFertiliserFractions
  >;

  CROPRESIDUE: Record<CropType, CropResidueFactors>;
  PASTURERESIDUE: Record<PastureType, PastureResidueFactors>;

  FRACTION_CROP_RESIDUE_REMOVED: Record<CropType, Record<State, RealNumber>>;

  BURNING_METHANE_EF: MassPerMass<'CH4', 'DryMatter'>;
  BURNING_N2O_EF: MassPerMass<'N2O', 'N'>;
  EF_RESIDUES_RETURNED_TO_SOIL: Record<'wet' | 'dry', MassPerMass<'N2O', 'N'>>;

  EF_N2O_PRODUCTION_SYSTEM: Record<
    BasicCropProductionSystem,
    // MassPerMass<'N2O', 'N'>
    MassPerMass<'N2O', 'Volatilised N'>
  >;

  FRACTION_N_VOLATILISED_ORGANIC_FERTILISER: MassPerMass<'Volatilised N', 'N'>;
  FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF: RealNumber;
  FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF_SOLID_STORAGE: RealNumber;
  EF_N2O_LEACHING_AND_RUNOFF: MassPerMass<'N2O', 'N'>;
};

type MMSFactors = {
  N_VOLATISED_EF: RealNumber;
  N2O_EF: RealNumber;
};

export type SwineConstants = NamedConstants & {
  MMS: Record<SwineMMSType, MMSFactors>;
};

type FeedlotFeedFactors = {
  DRY_MATTER_INTAKE: MassPerHeadPerDay<'DryMatter'>;
  CRUDE_PROTEIN_CONTENT: MassPerMass<'CrudeProtein', 'DryMatter'>;
  NITROGEN_RETENTION_FRACTION: RealNumber;
};

export type FeedlotConstants = NamedConstants & {
  MMS: Record<FeedlotMMSType, MMSFactors>;
  FEED: Record<FeedlotDurationType, FeedlotFeedFactors>;
  CRUDE_PROTEIN_TO_NITROGEN_CONVERSION: MassPerMass<'CrudeProtein', 'N'>;
};

type TimeInLocations = {
  pasture: RealNumber;
  milkingShed: RealNumber;
  feedPad: RealNumber;
};

type ClassWeights = {
  liveweight: Mass<'Liveweight'>;
  referenceWeight: Mass<'Liveweight'>;
  liveweightGain: MassPerHeadPerDay<'Liveweight'>;
};

type DairyMMSFactors = {
  EFm: RealNumber; // MassPerMass<'N2O', 'N'>;
  FracGASM: RealNumber; // MassPerMass<'Volatilised N', 'N'>;
};

type PreWeanedFactors = {
  urinaryN: MassPerHeadPerDay<'N'>;
  faecalN: MassPerHeadPerDay<'N'>;
};

export type DairyConstants = NamedConstants & {
  TIME_IN_LOCATIONS: Record<DairySystem, TimeInLocations>;
  FAT_CONTENT: RealNumber;
  PROTEIN_CONTENT: RealNumber;
  NET_ENERGY_FOR_MILK_PRODUCTION: EnergyPerMass<'Milk'>;
  GROSS_ENERGY_CONTENT: EnergyPerMass<'DryMatter'>;
  EFFICIENCY_OF_MILK_PRODUCTION: RealNumber;
  CRUDE_PROTEIN_CONTENT_OF_FEED: RealNumber;
  CLASS_WEIGHTS: Record<DairyClass, ClassWeights>;
  INCREASE_METABOLIC_RATE_FOR_MILK: {
    milkingCows: MassPerHeadPerDay<'DryMatter'>;
    others: MassPerHeadPerDay<'DryMatter'>;
  };
  DRY_MATTER_DIGESTIBILITY: RealNumber;
  PRE_WEANED_CLASSES: {
    heifersLt1: PreWeanedFactors;
    bullsLt1: PreWeanedFactors;
  };
  MMS: Record<DairyMMSType, DairyMMSFactors>;
  FracLEACH: RealNumber;
};

type PoultryClassFactors = {
  dryMatterIntake: MassPerHeadPerDay<'DryMatter'>;
  dryMatterDigestibility: RealNumber;
  crudeProtein: MassPerMass<'CrudeProtein', 'DryMatter'>;
  nitrogenRetentionRate: RealNumber;
  manureAsh: RealNumber;
};

type PoultryMMSFactors = {
  EFm: RealNumber; // MassPerMass<'N2O', 'N'>;
  FracGASM: RealNumber; // MassPerMass<'Volatilised N', 'N'>;
};

export type PoultryConstants = NamedConstants & {
  CLASSES: Record<PoultryClass, PoultryClassFactors>;
  MMS: Record<PoultryMMSType, PoultryMMSFactors>;
};

export type LivestockConstants = NamedConstants & {
  PURCHASED_FEED_FACTORS: {
    regionless: Record<
      PurchasedFeedAquacultureType | PurchasedFeedLivestockRegionlessType,
      MassPerMass<'CO2e', 'Purchased Feed'>
    >;
    regional: {
      [R in PurchasedFeedRegion]: {
        [T in PurchasedFeedLivestockRegionalType<R>]: MassPerMass<
          'CO2e',
          'Purchased Feed'
        >;
      };
    };
  };
};
type SeasonalFactors = Record<Season, RealNumber>;
type WeightFactorsByClass = Record<
  BeefClass,
  Record<
    Season,
    {
      liveweight: Mass<'Liveweight'>;
      liveweightGain: MassPerHeadPerDay<'Liveweight'>;
    }
  >
>;

export type BeefPastureConstants = NamedConstants & {
  DMD: Record<Region, SeasonalFactors>;
  MCF_PASTURE: RealNumber;
  MCF_LAGOON: Record<ClimateZone, RealNumber>;
  LIVEWEIGHT: Record<ExtendedRegion, WeightFactorsByClass>;
};

export type AllConstants = {
  COMMON: CommonConstants;
  CROP: CropConstants;
  SWINE: SwineConstants;
  FEEDLOT: FeedlotConstants;
  DAIRY: DairyConstants;
  POULTRY: PoultryConstants;
  LIVESTOCK: LivestockConstants;
  BEEF_PASTURE: BeefPastureConstants;
};

export type HasCommonConstants = {
  COMMON: CommonConstants;
};
