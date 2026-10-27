import { WasteTypesForFacility } from '@/modules/scope1/10-solid-waste/solid-waste-units.input';
import {
  AnyUnit,
  CountPerArea,
  Days,
  EnergyPerMass,
  EnergyPerVolume,
  Liveweight,
  LiveweightGain,
  Mass,
  MassPerArea,
  MassPerAreaPerDay,
  MassPerAreaPerYear,
  MassPerElectricity,
  MassPerEnergy,
  MassPerHead,
  MassPerHeadPerDay,
  MassPerHeadPerYear,
  MassPerMass,
  MassPerMassDistance,
  MassPerVolume,
  NumberUnitBase,
  RealNumber,
  VolumePerMass,
  Years,
} from '@/tools/units';
import {
  AgrochemicalType,
  AquacultureSystemLocation,
  AviationFuelType,
  BasicCropProductionSystem,
  BeefBreed,
  BeefClass,
  CarsLightCommercialFuelType,
  CarsLightCommercialPre2004FuelType,
  ClimateZoneType,
  CropType,
  DairyCattleBreed,
  DairyClass,
  DairyMMSTypeWithPasture,
  DairySystem,
  DairyTimeInLocations,
  ElectricityRegion,
  ExtendedRegion,
  FeedlotDurationType,
  FreightType,
  FuelStationaryMassBasedLiquidType,
  FuelStationarySolidType,
  FuelStationaryVolumeBasedLiquidType,
  HeavyDutyFuelType,
  IBRA7Region,
  InorganicFertiliserComponentOrigin,
  InorganicFertiliserComponentTypeNonRegional,
  InorganicFertiliserComponentTypeRegional,
  InorganicFertiliserType,
  LightDutyFuelType,
  LimitedRegion,
  LivestockPurchaseCategory,
  MatureDairyClass,
  MeanAnnualTemperature,
  OffRoadAgricultureAndForestryEquipmentFuelType,
  OrganicFertiliserType,
  OtherLivestockType,
  PastureType,
  PerennialWoodyCropFull,
  PerennialWoodyCropPartial,
  PigsClass,
  PigsLiveweightClass,
  PoultryClass,
  PoultryMMS1Type,
  PoultryMMS1TypeWithPasture,
  PoultryMMS2Type,
  PoultryWeightClass,
  PreWeanedDairyClass,
  PrimaryFeedlotMMSType,
  PrimaryPigsMMSType,
  PurchasedFeedAquacultureType,
  PurchasedFeedLivestockRegionalType,
  PurchasedFeedLivestockRegionlessType,
  PurchasedFeedRegion,
  PurchasedMineralSupplementType,
  PurchasedPackagingByMassType,
  PurchasedPackagingByUnitsType,
  RefrigerantType,
  RefrigerationType,
  RiceCultivationOrganicAmendmentType,
  RiceCultivationPreSeasonWaterRegimeType,
  RiceCultivationSeasonWaterRegimeType,
  Season,
  SecondaryFeedlotMMSType,
  SheepClass,
  SoilAmeliorant,
  SolidWasteManagedTreatmentType,
  SolidWasteNonStreamType,
  SolidWasteOrganicManagedTreatmentType,
  SolidWasteType,
  SolidWasteUnmanagedTreatmentType,
  State,
  StateOrRegion,
  TertiaryFeedlotMMSType,
  VesselFuelType,
  WastewaterCommodity,
  WastewaterFacilityType,
} from './enums';

export type ReplaceNumberUnits<T> = T extends NumberUnitBase
  ? number
  : {
      [K in keyof T]: ReplaceNumberUnits<T[K]>;
    };

export type NamedConstants = {
  name: string;
};

export type GasType = 'CO2' | 'CH4' | 'N2O';
export type FuelEmissionsGasType = GasType | 'CO2e';
export type FuelFactorByVolume = {
  ENERGY_CONTENT_FACTOR: EnergyPerVolume<'Fuel'>;
  SCOPE1_EF: { [G in FuelEmissionsGasType]: MassPerEnergy<'CO2e'> };
  SCOPE3_EF: MassPerEnergy<'CO2e'>;
};

export type FuelFactorByMass = {
  ENERGY_CONTENT_FACTOR: EnergyPerMass<'Fuel'>;
  SCOPE1_EF: { [G in FuelEmissionsGasType]: MassPerEnergy<'CO2e'> };
  SCOPE3_EF: MassPerEnergy<'CO2e'>;
};

export type SolidWasteTypesFactors = {
  CARBON_CONTENT: MassPerMass<'Carbon', 'Solid Waste'>;
  FOSSIL_ORIGIN: RealNumber;
  OXIDATION_FACTOR: RealNumber;
  DRY_MATTER_CONTENT: RealNumber;
  DEGRADABLE_ORGANIC_CONTENT: MassPerMass<'Carbon', 'Solid Waste'>;
  FRAC_DOC_DECOMPOSES: RealNumber;
};

export type CommonConstants = NamedConstants & {
  AGROCHEMICAL_FACTORS: Record<
    AgrochemicalType,
    MassPerMass<'CO2e', 'Chemical'>
  >;

  EF_CONVERSION_UREA_TO_CO2: MassPerMass<'Carbon', 'Urea'>;

  /*
   * NOTE: These elemental conversion factors are not consistent across their denominator units, or what you might call the input unit.
   * The way the guidelines use subscripts and refer to the input material is most often a gas already converted (N2O or CH4). We have preferred
   * matching the guidelines over strict correctness of our unit tracking, which would probably suit a mass of C or N instead of CH4 or N2O.
   * */
  ELEMENTAL_TO_MOLECULAR_CO2: MassPerMass<'CO2', 'Carbon'>;
  ELEMENTAL_TO_MOLECULAR_CH4: MassPerMass<'CH4', 'Carbon'>;
  ELEMENTAL_TO_MOLECULAR_N2O: MassPerMass<'N2O', 'N2O'>;

  DENSITY_OF_METHANE: MassPerVolume<'CH4', 'CH4'>;

  LIME_SCOPE3_EF: Record<SoilAmeliorant, MassPerMass<'CO2e', 'Lime'>>;

  LIMING: {
    LIMESTONE_PURITY: RealNumber;
    LIMESTONE_EF: MassPerMass<'Carbon', 'Lime'>;
    DOLOMITE_PURITY: RealNumber;
    DOLOMITE_EF: MassPerMass<'Carbon', 'Lime'>;
  };

  ELECTRICITY: {
    [region in ElectricityRegion]: {
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
    SCOPE1_EF: { [G in FuelEmissionsGasType]: MassPerEnergy<'CO2e'> };
    SCOPE3_EF: Record<State, MassPerEnergy<'CO2e'>>;
  };

  FREIGHT_EMISSIONS: Record<
    FreightType,
    MassPerMassDistance<'CO2e', 'Freight Goods'>
  >;

  // NGAF 2023 Table 10
  REFRIGERATION_LEAKAGE_RATES: Record<RefrigerationType, RealNumber>;
  REFRIGERANT_GWP: Record<RefrigerantType, MassPerMass<'CO2e', 'Refrigerant'>>;

  SOLID_WASTE_TREATMENT: {
    SCOPE_1: {
      FACILITY_FACTORS: {
        Incineration: MassPerMass<'Carbon', 'Solid Waste'>;
      } & Record<
        SolidWasteOrganicManagedTreatmentType,
        {
          CH4: MassPerMass<'CH4', 'Solid Waste'>;
          N2O: MassPerMass<'N2O', 'Solid Waste'>;
        }
      > &
        Record<
          SolidWasteUnmanagedTreatmentType,
          {
            METHANE_EF: MassPerMass<'CH4', 'Solid Waste'>;
            METHANE_CONVERSION_FACTOR: RealNumber;
            OXIDATION_FACTOR: RealNumber;
          }
        >;
      WASTE_FACTORS: Record<SolidWasteNonStreamType, SolidWasteTypesFactors>;

      UNMANAGED_METHANE_FRACTION: RealNumber;
    };
    SCOPE_3: {
      [
        FType in Exclude<
          SolidWasteManagedTreatmentType,
          SolidWasteOrganicManagedTreatmentType
        >
      ]: {
        WASTE_TYPES: Record<
          WasteTypesForFacility<FType, 3>,
          MassPerMass<'CO2e', 'Solid Waste'>
        >;
        RECOVERY_FRACTION: RealNumber;
      };
    } & Record<
      SolidWasteOrganicManagedTreatmentType,
      {
        EF: MassPerMass<'CO2e', 'Solid Waste'>;
        RECOVERY_FRACTION: RealNumber;
      }
    >;

    WASTE_TYPES_VOLUME_TO_MASS: Record<
      SolidWasteType,
      MassPerVolume<'Solid Waste', 'Solid Waste'>
    >;
  };

  NITROGEN_TO_PROTEIN: MassPerMass<'CrudeProtein', 'N'>;

  WASTEWATER_TREATMENT: {
    WASTEWATER_METHANE_CORRECTION_FACTORS: Record<
      WastewaterFacilityType,
      RealNumber
    >;
    SLUDGE_METHANE_CORRECTION_FACTORS: Record<
      WastewaterFacilityType,
      RealNumber
    >;
    FRAC_SLUDGE: RealNumber;
    WASTEWATER_EF: MassPerMass<'CH4', 'COD'>;
    SLUDGE_EF: MassPerMass<'CH4', 'COD'>;
    SLUDGE_BIOGAS_ENERGY_CONTENT: EnergyPerVolume<'CH4'>;
    SLUDGE_BIOGAS_CH4_EF: MassPerEnergy<'CH4'>;
    SLUDGE_BIOGAS_N2O_EF: MassPerEnergy<'N2O'>;

    COD_BY_COMMODITY: Record<
      WastewaterCommodity,
      {
        inletCOD: MassPerVolume<'COD', 'FluidWaste'>;
        fracRecovered: RealNumber;
      }
    >;
  };

  PURCHASED_PACKAGING_FACTORS_BY_UNITS: Record<
    PurchasedPackagingByUnitsType,
    Mass<'CO2e'>
  >;
  PURCHASED_PACKAGING_FACTORS_BY_MASS: Record<
    PurchasedPackagingByMassType,
    MassPerMass<'CO2e', 'Packaging'>
  >;
};

type CropResidueFactors = {
  residueCropRatio: MassPerMass<'CropResidue', 'DryMatter'>;
  belowAboveResidueRatio: RealNumber;
  dryMatterContent: MassPerMass<'DryMatter', 'CropResidue'>;
  carbonMassFraction: MassPerMass<'Carbon', 'DryMatter'>;
  aboveGroundN: MassPerMass<'N', 'DryMatter'>;
  belowGroundN: MassPerMass<'N', 'DryMatter'>;
  fractionOfResidueAtBurning: RealNumber;
  fractionBurnt: RealNumber;
};

type PastureResidueFactors = {
  averageYield: MassPerArea<'DryMatter'>;
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
  INORGANIC_FERTILISER_OTHER_VOLATILISES: MassPerMass<'Volatilised N', 'N'>;
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

  BURNING_METHANE_EF: MassPerMass<'CH4', 'CH4'>;
  BURNING_N2O_EF: MassPerMass<'N2O', 'N'>;
  EF_RESIDUES_RETURNED_TO_SOIL: Record<
    ClimateZoneType,
    MassPerMass<'N2O', 'N'>
  >;

  EF_N2O_ATMOSPHERIC_DEPOSITION_PRODUCTION_SYSTEM: Record<
    BasicCropProductionSystem,
    MassPerMass<'N2O', 'Volatilised N'>
  >;

  FRACTION_N_VOLATILISED_ORGANIC_FERTILISER: MassPerMass<'Volatilised N', 'N'>;
  FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF: RealNumber;
  FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF_SOLID_STORAGE: RealNumber;
  EF_N2O_LEACHING_AND_RUNOFF: MassPerMass<'N2O', 'N'>;

  COTTON_ECONOMIC_LINT_ALLOCATION: RealNumber;
};

type MMSFactors = {
  N_VOLATISED_EF: RealNumber;
  N2O_EF: RealNumber;
};

type PigsClassFactors = {
  FEED_INTAKE: MassPerHeadPerDay<'DryMatter'>;
  VOLATILE_SOLIDS: MassPerHeadPerDay<'Volatile Solids'>;
  NITROGEN_IN_WASTE: MassPerHeadPerDay<'N'>;
};

export type PigsConstants = NamedConstants & {
  MMS: Record<
    PrimaryPigsMMSType,
    MMSFactors & {
      VOLATILE_SOLIDS_LOST: RealNumber;
      METHANE_CONVERSION_FACTOR_BY_STATE: Record<State, RealNumber>;
      EFm: MassPerMass<'N2O', 'N'>;
      FracGASM: MassPerMass<'Volatilised N', 'N'>;
    }
  > & {
    directApplication: MMSFactors & {
      VOLATILE_SOLIDS_LOST: RealNumber;
      METHANE_CONVERSION_FACTOR_BY_STATE: Record<State, RealNumber>;
    };
  };
  GROSS_ENERGY_CONTENT_OF_FEED: EnergyPerMass<'DryMatter'>;
  ENERGY_PER_MASS_METHANE: EnergyPerMass<'CH4'>;
  PIGS_CLASS_FACTORS: Record<PigsClass, PigsClassFactors>;
  FRACTION_INTAKE_CONVERTED_TO_METHANE: RealNumber;
  DEFAULT_FRACTION_SOLIDS_SEPARATED: RealNumber;
  DEFAULT_FRACTION_NITROGEN_SEPARATED: RealNumber;
  LIVEWEIGHT: Record<PigsLiveweightClass, Liveweight>;
};

type FeedlotFeedFactors = {
  dryMatterIntake: MassPerHeadPerDay<'DryMatter'>;
  crudeProtein: MassPerMass<'CrudeProtein', 'DryMatter'>;
  dryMatterDigestibility: RealNumber;
  nitrogenRetentionRate: RealNumber;
  neutralDetergentFibrePercentage: RealNumber;
  etherExtractPercentage: RealNumber;
};

type FeedlotMMSFactors = {
  METHANE_CONVERSION_FACTOR_BY_STATE: Record<State, RealNumber>;
  FracGASM: MassPerMass<'Volatilised N', 'N'>;
  EFm: MassPerMass<'N2O', 'N'>;
};

export type FeedlotConstants = NamedConstants & {
  MMS: Record<
    PrimaryFeedlotMMSType,
    FeedlotMMSFactors & { FRACTION_SOLIDS_LOST: RealNumber }
  > &
    Record<SecondaryFeedlotMMSType, FeedlotMMSFactors> &
    Record<
      TertiaryFeedlotMMSType,
      FeedlotMMSFactors & {
        FRACTION_SOLIDS_RUNOFF: RealNumber;
      }
    >;
  FEED: Record<FeedlotDurationType, FeedlotFeedFactors>;
};

export type TimeInLocations = Record<DairyTimeInLocations, RealNumber>;

type BaseDairyClassFactors = {
  referenceWeight: Liveweight;
  liveweightGain: LiveweightGain;
};

type MatureDairyClassFactors = BaseDairyClassFactors & {
  averageStay: Days;
  netEnergyForGrowth: EnergyPerMass<'Liveweight'>;
};

type PreWeanedDairyClassFactors = BaseDairyClassFactors & {
  methaneProduction: MassPerHeadPerDay<'CH4'>;
  nitrogenExcreted: MassPerHeadPerDay<'N'>;
  volatileSolids: MassPerHeadPerDay<'Volatile Solids'>;
  netEnergyForGrowth: {
    preWeaned: EnergyPerMass<'Liveweight'>;
    weaned: EnergyPerMass<'Liveweight'>;
  };
  averageStay: {
    preWeaned: Days;
    weaned: Days;
  };
};

type DairyMMSFactors = {
  EFm: MassPerMass<'N2O', 'N'>;
  FracGASM: MassPerMass<'Volatilised N', 'N'>;
  METHANE_CONVERSION_FACTOR_BY_STATE: Record<State, RealNumber>;
};

type BreedWeights = Record<DairyClass, Liveweight>;

export type DairyConstants = NamedConstants & {
  TIME_IN_LOCATIONS: Record<DairySystem, TimeInLocations>;

  CLASSES: Record<MatureDairyClass, MatureDairyClassFactors> &
    Record<PreWeanedDairyClass, PreWeanedDairyClassFactors>;

  DIETARY_CONSTANTS: {
    dryMatterDigestibility: RealNumber;
    crudeProtein: MassPerMass<'CrudeProtein', 'DryMatter'>;
  };

  MILK_CONSTANTS: {
    FAT_CONTENT: RealNumber;
    PROTEIN_CONTENT: RealNumber;
    NET_ENERGY: EnergyPerMass<'Milk'>;
    /**
     * Not to be confused with `NET_ENERGY`!
     *
     * While both factors describe the same thing (the net energy required for milk
     * production), The factor here should ONLY be used to calculate allocation of
     * emissions to milk production - consistent with the approach to calculating
     * intensities adopted by the International Dairy Foundation. The `NET_ENERGY` figure
     * should be used for the emissions estimate.
     */
    NET_ENERGY_FOR_INTENSITY_ALLOCATION: EnergyPerMass<'Milk'>;
    GROSS_ENERGY_CONTENT: EnergyPerMass<'DryMatter'>;
    EFFICIENCY_OF_MILK_PRODUCTION: RealNumber;
    DENSITY_OF_MILK: MassPerVolume<'Milk', 'Milk'>;

    INCREASE_METABOLIC_RATE_FOR_MILK: {
      milkingCows: RealNumber;
      others: RealNumber;
    };
  };
  MMS: Record<DairyMMSTypeWithPasture, DairyMMSFactors>;
  DEFAULT_SOLID_SEPARATION_RATE: RealNumber;
  LIVEWEIGHTS_BY_BREED: Record<DairyCattleBreed, BreedWeights>;
};

type PoultryClassFactors = {
  dryMatterIntake: MassPerHeadPerDay<'DryMatter'>;
  dryMatterDigestibility: RealNumber;
  crudeProtein: MassPerMass<'CrudeProtein', 'DryMatter'>;
  nitrogenRetentionRate: RealNumber;
  manureAsh: RealNumber;
  emissionsPotential: VolumePerMass<'CH4', 'Volatile Solids'>;
};

type PoultryMMSFactors = {
  EFm: MassPerMass<'N2O', 'N'>;
  FracGASM: MassPerMass<'Volatilised N', 'N'>;
  METHANE_CONVERSION_FACTOR_BY_STATE: Record<State, RealNumber>;
};

export type PoultryConstants = NamedConstants & {
  CLASSES: Record<PoultryClass, PoultryClassFactors>;
  MMS: Record<
    PoultryMMS1Type,
    PoultryMMSFactors & { fractionSolidsLost: RealNumber }
  > &
    Record<
      PoultryMMS2Type | Exclude<PoultryMMS1TypeWithPasture, PoultryMMS1Type>,
      PoultryMMSFactors
    >;

  PURCHASED_LIVESTOCK_EF: MassPerMass<'CO2e', 'Liveweight'>;
  LIVEWEIGHT: Record<PoultryWeightClass, Liveweight>;
};

type OtherLivestockFactors = {
  ENTERIC: MassPerHead<'CH4'>;
  VOLATILE_SOLIDS: MassPerHeadPerDay<'Volatile Solids'>;
  NITROGEN_EXCRETED: MassPerHeadPerYear<'N'>;
};

type OtherLivestockMMSFactors = {
  METHANE_CONVERSION_FACTOR_BY_STATE: Record<State, RealNumber>;
  ALLOCATION_TO_MMS_WITH_NATURAL_WATER: RealNumber;
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

  PURCHASED_MINERAL_SUPPLEMENT_FACTORS: Record<
    PurchasedMineralSupplementType,
    MassPerMass<'CO2e', 'Purchased Mineral Supplement'>
  >;

  OTHER_LIVESTOCK_EMISSION_FACTORS: Record<
    OtherLivestockType,
    OtherLivestockFactors
  >;

  OTHER_LIVESTOCK_MMS_FACTORS: {
    pastureRangeAndPaddock: OtherLivestockMMSFactors;
    anaerobicLagoon: OtherLivestockMMSFactors;
  };

  OTHER_PURCHASED_LIVESTOCK_FACTORS: Record<
    OtherLivestockType,
    MassPerMass<'CO2e', 'Liveweight'>
  >;
  OTHER_PURCHASED_LIVESTOCK_AVERAGE_LIVEWEIGHTS: Record<
    OtherLivestockType,
    Liveweight
  >;

  MANURE_MANAGEMENT_METHANE_CONVERSION_FACTORS: {
    manureWithLitter: Record<MeanAnnualTemperature, RealNumber>;
    beltManureRemoval: Record<MeanAnnualTemperature, RealNumber>;
    manureStoredInHouse: Record<MeanAnnualTemperature, RealNumber>;
    solidStorage: Record<MeanAnnualTemperature, RealNumber>;
    composting: Record<MeanAnnualTemperature, RealNumber>;
    digester: Record<MeanAnnualTemperature, RealNumber>;
    deepLitter: Record<MeanAnnualTemperature, RealNumber>;
    directProcessing: Record<MeanAnnualTemperature, RealNumber>;
    directApplication: Record<MeanAnnualTemperature, RealNumber>;
    pastureRangeAndPaddock: Record<MeanAnnualTemperature, RealNumber>;
    anaerobicLagoon: Record<MeanAnnualTemperature, RealNumber>;
    pitStorage: Record<MeanAnnualTemperature, RealNumber>;
    sumpDispersal: Record<MeanAnnualTemperature, RealNumber>;
    drainToPaddock: Record<MeanAnnualTemperature, RealNumber>;
  };

  EF_DEPOSITED_URINE_AND_DUNG_PRP: Record<
    'wet' | 'dry',
    MassPerMass<'N2O', 'N'>
  >;

  EMISSIONS_POTENTIAL_VOLATILE_SOLIDS_TO_CH4: Record<
    'beef' | 'sheep' | 'dairy' | 'feedlot' | 'pigs' | 'other',
    VolumePerMass<'CH4', 'Volatile Solids'>
  >;

  ASH_CONTENT_OF_MANURE: Record<
    'sheep' | 'feedlot' | 'beef' | 'dairy',
    RealNumber
  >;

  NITROGEN_TO_MILK_PROTEIN: MassPerMass<'Milk', 'N'>;

  PURCHASED_EF: Record<
    LivestockPurchaseCategory,
    MassPerMass<'CO2e', 'Liveweight'>
  >;

  OTHER_LIVESTOCK_EF_PROPORTION: Record<OtherLivestockType, RealNumber>;
};

type SeasonalFactors<F extends AnyUnit = RealNumber> = Record<Season, F>;

type WeightFactorsByClass = Record<
  BeefClass,
  Record<
    Season,
    {
      liveweight: Liveweight;
      liveweightGain: LiveweightGain;
    }
  >
>;

export type BeefPastureConstants = NamedConstants & {
  DMD: Record<LimitedRegion, SeasonalFactors>;
  CP: Record<
    LimitedRegion,
    SeasonalFactors<MassPerMass<'CrudeProtein', 'DryMatter'>>
  >;
  REFERENCE_WEIGHT: Record<State, Record<BeefClass, Liveweight>>;
  MCF_PASTURE: RealNumber;
  MCF_LAGOON: Record<StateOrRegion, RealNumber>;
  LIVEWEIGHT: Record<ExtendedRegion, WeightFactorsByClass>;

  DRY_MATTER_TO_METHANE_CONVERSION_FACTOR: MassPerMass<'CH4', 'DryMatter'>;

  MMS: Record<StateOrRegion, { PRP: RealNumber; Lagoon: RealNumber }>;

  MILK_FACTORS: {
    DAILY_MILK_PRODUCTION_BY_BREED: Record<
      BeefBreed,
      Record<'calving' | 'postCalving', MassPerHeadPerDay<'Milk'>>
    >;
    // These values don't vary by breed.
    FEED_ADJUSTMENTS: Record<'calving' | 'postCalving', RealNumber>;
  };
};

export type RiceConstants = NamedConstants & {
  WATER_REGIME_SCALING_FACTORS: Record<
    RiceCultivationSeasonWaterRegimeType,
    RealNumber
  >;
  PRE_SEASON_WATER_REGIME_SCALING_FACTORS: Record<
    RiceCultivationPreSeasonWaterRegimeType,
    RealNumber
  >;
  ORGANIC_AMENDMENT_SCALING_FACTORS: Record<
    RiceCultivationOrganicAmendmentType,
    RealNumber
  >;
  BASELINE_CONTINUOUSLY_FLOODED_EF: MassPerAreaPerDay<'CH4'>;
};
type WoodyPerennialCropsPartialConstants = {
  BAMc: MassPerArea<'Carbon'>;
  Mc: Years;
  BARc: MassPerAreaPerYear<'Carbon'>;
};

type WoodyPerennialCropsFullConstants = WoodyPerennialCropsPartialConstants & {
  STEM_DENSITY: CountPerArea<'Trees'>;
};

export type LULUCFConstants = NamedConstants & {
  ORGANIC_STOCK_LOSS_FACTORS: Record<IBRA7Region, MassPerArea<'Carbon'>>;
  CARBON_TO_NITROGEN_RATIO: MassPerMass<'Carbon', 'N'>;

  WOODY_PERENNIAL_CROPS_FULL: Record<
    PerennialWoodyCropFull,
    WoodyPerennialCropsFullConstants
  >;
  WOODY_PERENNIAL_CROPS_PARTIAL: Record<
    PerennialWoodyCropPartial,
    WoodyPerennialCropsPartialConstants
  >;
};

type SeasonalSheepFactors = {
  dryMatterAvailability: MassPerArea<'DryMatter'>;
  dryMatterDigestibility: RealNumber;
  liveweight: Liveweight;
  liveweightGain: LiveweightGain;

  crudeProteinContent: MassPerMass<'CrudeProtein', 'DryMatter'>;
};

export type SheepSeasonFactorsRecord = Record<
  SheepClass,
  {
    standardReferenceWeight: Liveweight;
  } & Record<Season, SeasonalSheepFactors>
>;

export type SheepConstants = NamedConstants & {
  SEASONAL_FACTORS: Record<State, SheepSeasonFactorsRecord>;

  MILK_PRODUCTION: MassPerHeadPerDay<'Milk'>;
  MILK_PROTEIN: MassPerMass<'CrudeProtein', 'Milk'>;
  WOOL_PROTEIN: MassPerMass<'CrudeProtein', 'Clean Wool'>;
  LIVEWEIGHT_PROTEIN: MassPerMass<'CrudeProtein', 'Liveweight'>;

  FEED_ADJUSTMENT: RealNumber;

  MMS: Record<State, Record<'PRP' | 'Lagoon', RealNumber>>;

  MCF_PRP: RealNumber;
  MCF_LAGOON: Record<State, RealNumber>;
};

export type AquacultureConstants = NamedConstants & {
  AQUACULTURE_EF: Record<AquacultureSystemLocation, MassPerMass<'N2O', 'Fish'>>;
};

export type AllConstants = {
  COMMON: CommonConstants;
  CROP: CropConstants;
  PIGS: PigsConstants;
  FEEDLOT: FeedlotConstants;
  DAIRY: DairyConstants;
  POULTRY: PoultryConstants;
  LIVESTOCK: LivestockConstants;
  BEEF_PASTURE: BeefPastureConstants;
  SHEEP: SheepConstants;
  RICE: RiceConstants;
  AQUACULTURE: AquacultureConstants;
  LULUCF: LULUCFConstants;
};

export type HasConstants<C extends keyof AllConstants> = Pick<AllConstants, C>;

export type HasCommonConstants = HasConstants<'COMMON'>;
