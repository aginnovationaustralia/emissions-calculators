import { State } from '@/types/enums';
import {
  AviationFuelType,
  BasicCropProductionSystem,
  CarsLightCommercialFuelType,
  CarsLightCommercialPre2004FuelType,
  CropType,
  FuelStationaryLiquidType,
  FuelStationarySolidType,
  HeavyDutyFuelType,
  InorganicFertiliserComponentOrigin,
  InorganicFertiliserComponentTypeNonRegional,
  InorganicFertiliserComponentTypeRegional,
  InorganicFertiliserType,
  LightDutyFuelType,
  OffRoadAgricultureAndForestryEquipmentFuelType,
  OrganicFertiliserType,
  PastureType,
  RefrigerantType,
  RefrigerationType,
  ServiceByAreaType,
  ServiceByHourType,
  SolidWasteByVolumeType,
  SolidWasteIncinerationType,
  SolidWasteLandfillType,
  StationaryFuelType,
  SwineMMSType,
  VesselFuelType,
} from './enums';

export type NamedConstants = {
  name: string;
};

export const AgrochemicalTypeNames = [
  'Herbicide',
  'HerbicideOther',
  'Insecticide',
  'Fungicide',
  'PlantGrowthRegulator',
];

export type AgrochemicalTypes = (typeof AgrochemicalTypeNames)[number];

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

type FuelFactor = {
  ENERGY_CONTENT_FACTOR: number;
  SCOPE1_EF: {
    CO2: number;
    CH4: number;
    N2O: number;
  };
  SCOPE3_EF: number;
};

export type CommonConstants = NamedConstants & {
  EF_UREA_CO2: number;
  GWP_FACTORSC6: number;
  GWP_FACTORSC13: number;
  GWP_FACTORSC14: number;

  GWP_FACTORSC15: number;
  GWP_FACTORSC18: number;

  LIME_SCOPE3_EF: number;

  AGROCHEMICAL_FACTORS: Record<AgrochemicalTypes, number>;

  ELECTRICITY: {
    [state in States | 'Australia']: {
      SCOPE2_EF: number;
      SCOPE3_EF: number;
    };
  };

  ELECTRICITY_RMF_SCOPE2_EF: number;
  ELECTRICITY_RMF_SCOPE3_EF: number;

  RENEWABLE_POWER_PERCENTAGE: number;

  JURISDICTIONAL_RENEWABLE_POWER_PERCENTAGE: number;

  STATIONARY_FUEL_FACTORS: {
    'Solid fuels': Record<FuelStationarySolidType, FuelFactor>;
    'Liquid fuels': Record<FuelStationaryLiquidType, FuelFactor>;
  };

  TRANSPORT_FUEL_FACTORS: {
    'Cars and light commercial vehicles': Record<
      CarsLightCommercialFuelType,
      FuelFactor
    >;
    'Cars and light commercial vehicles (pre 2004)': Record<
      CarsLightCommercialPre2004FuelType,
      FuelFactor
    >;
    'Light duty vehicles': Record<LightDutyFuelType, FuelFactor>;
    'Heavy duty vehicles': Record<HeavyDutyFuelType, FuelFactor>;
    Aviation: Record<AviationFuelType, FuelFactor>;
    Vessel: Record<VesselFuelType, FuelFactor>;
    'Off-road Agriculture and forestry equipment': Record<
      OffRoadAgricultureAndForestryEquipmentFuelType,
      FuelFactor
    >;
  };

  NATURAL_GAS_FACTORS: {
    ENERGY_CONTENT_FACTOR: number;
    SCOPE1_EF: {
      CO2: number;
      CH4: number;
      N2O: number;
    };
    SCOPE3_EF: Record<States, number>;
  };

  FUEL_ENERGYGJ: {
    STATIONARY: Record<StationaryFuelType, FuelFactor>;

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

  // NGAF 2023 Table 10
  REFRIGERATION_LEAKAGE_RATES: Record<RefrigerationType, number>;
  REFRIGERANT_GWP: Record<RefrigerantType, number>;

  SERVICE_EMISSIONS_BY_AREA: Record<ServiceByAreaType, number>;
  SERVICE_EMISSIONS_BY_HOUR: Record<ServiceByHourType, number>;

  SOLID_WASTE_LANDFILL_EF: Record<SolidWasteLandfillType, number>;
  SOLID_WASTE_INCINERATION_EF: Record<SolidWasteIncinerationType, number>;

  SOLID_WASTE_COMPOSTING_EF: number;
  SOLID_WASTE_ANAEROBIC_DIGESTION_EF: number;

  SOLID_WASTE_BY_VOLUME_TO_MASS: Record<SolidWasteByVolumeType, number>;
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
};

type PastureResidueFactors = {
  averageYield: number;
  belowAboveResidueRatio: number;
  aboveGroundN: number;
  belowGroundN: number;
  fractionRemoved: number;
};

type InorganicFertiliserFractions = {
  N: number;
  Urea: number;
  Volatilises: number;
  Scope3EF: number;
};

type InorganicFertiliserFractionRegions = Record<
  InorganicFertiliserComponentOrigin,
  number
>;

type InorganicFertiliserFractionsByRegion = Record<
  InorganicFertiliserComponentTypeRegional,
  InorganicFertiliserFractionRegions
>;

type InorganicFertiliserFractionNonRegional = Record<
  InorganicFertiliserComponentTypeNonRegional,
  number
>;

type OrganicFertiliserFractions = {
  N: number;
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

  FRACTION_CROP_RESIDUE_REMOVED: Record<CropType, Record<State, number>>;

  BURNING_METHANE_EF: number;
  BURNING_N2O_EF: number;
  EF_RESIDUES_RETURNED_TO_SOIL: Record<'wet' | 'dry', number>;

  EF_N2O_PRODUCTION_SYSTEM: Record<BasicCropProductionSystem, number>;

  FRACTION_N_VOLATILISED_ORGANIC_FERTILISER: number;
  FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF: number;
  EF_N2O_LEACHING_AND_RUNOFF: number;
};

type MMSFactors = {
  N_VOLATISED_EF: number;
  N2O_EF: number;
};

export type SwineConstants = NamedConstants & {
  MMS: Record<SwineMMSType, MMSFactors>;
};

export type AllConstants = {
  COMMON: CommonConstants;
  CROP: CropConstants;
  SWINE: SwineConstants;
};

export type HasCommonConstants = {
  COMMON: CommonConstants;
};
