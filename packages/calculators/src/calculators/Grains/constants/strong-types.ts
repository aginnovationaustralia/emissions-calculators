import {
  energyPerVolume,
  EnergyPerVolume,
  massPerArea,
  MassPerArea,
  massPerElectricity,
  MassPerElectricity,
  massPerEnergy,
  MassPerEnergy,
  massPerMass,
  MassPerMass,
  massPerTime,
  MassPerTime,
  massPerVolume,
  MassPerVolume,
  NumberUnitBase,
  realNumber,
  RealNumber,
} from '@/tools/units';
import { PartialDeep } from 'type-fest';
import {
  AviationFuelType,
  CarsLightCommercialFuelType,
  CarsLightCommercialPre2004FuelType,
  FuelStationaryLiquidType,
  FuelStationarySolidType,
  HeavyDutyFuelType,
  LightDutyFuelType,
  OffRoadAgricultureAndForestryEquipmentFuelType,
  RefrigerantType,
  RefrigerationType,
  ServiceByAreaType,
  ServiceByHourType,
  SolidWasteByVolumeType,
  SolidWasteIncinerationType,
  SolidWasteLandfillType,
  VesselFuelType,
} from './enums';
import { commonConstants } from './strong-values';
import { AgrochemicalTypes, States } from './types';

type FuelFactor = {
  ENERGY_CONTENT_FACTOR: EnergyPerVolume<'Fuel'>;
  SCOPE1_EF: {
    CO2: MassPerEnergy<'CO2'>;
    CH4: MassPerEnergy<'CH4'>;
    N2O: MassPerEnergy<'N2O'>;
  };
  SCOPE3_EF: MassPerEnergy<'CO2e'>;
};

export type CommonConstants = {
  EF_UREA_CO2: MassPerMass<'CO2e', 'Urea'>;
  GWP_FACTORSC6: MassPerMass<'N2O', 'CO2e'>;
  GWP_FACTORSC13: MassPerMass<'CO2', 'CO2e'>;
  GWP_FACTORSC14: RealNumber;

  GWP_FACTORSC15: RealNumber;
  GWP_FACTORSC18: RealNumber;

  LIME_SCOPE3_EF: MassPerMass<'CO2e', 'Lime'>;

  AGROCHEMICAL_FACTORS: Record<
    AgrochemicalTypes,
    MassPerMass<'CO2e', 'Chemical'>
  >;

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
    ENERGY_CONTENT_FACTOR: EnergyPerVolume<'Fuel'>;
    SCOPE1_EF: {
      CO2: MassPerEnergy<'CO2'>;
      CH4: MassPerEnergy<'CH4'>;
      N2O: MassPerEnergy<'N2O'>;
    };
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
};

type LeafType<T> = T extends NumberUnitBase
  ? T
  : T extends object
    ? LeafType<T[keyof T]>
    : never;

type IsUnion<T, U = T> = T extends unknown
  ? [U] extends [T]
    ? false
    : true
  : never;

type ReplaceWithBuilder<T> = T extends NumberUnitBase
  ? (n: number) => T
  : T extends object
    ? IsUnion<T[keyof T]> extends true
      ? { [K in keyof T]: ReplaceWithBuilder<T[K]> }
      : (n: number) => LeafType<T>
    : never;

type CommonConstantsUnits = ReplaceWithBuilder<CommonConstants>;

const commonConstantsUnits: CommonConstantsUnits = {
  AGROCHEMICAL_FACTORS: (n) => massPerMass('CO2e', 'Chemical', n),
  EF_UREA_CO2: (n) => massPerMass('CO2e', 'Urea', n),
  GWP_FACTORSC6: (n) => massPerMass('N2O', 'CO2e', n),
  GWP_FACTORSC13: (n) => massPerMass('CO2', 'CO2e', n),
  GWP_FACTORSC14: (n) => realNumber(n),
  GWP_FACTORSC15: (n) => realNumber(n),
  GWP_FACTORSC18: (n) => realNumber(n),
  LIME_SCOPE3_EF: (n) => massPerMass('CO2e', 'Lime', n),
  ELECTRICITY_RMF_SCOPE2_EF: (n) => massPerElectricity('CO2e', n),
  ELECTRICITY_RMF_SCOPE3_EF: (n) => massPerElectricity('CO2e', n),
  RENEWABLE_POWER_PERCENTAGE: (n) => realNumber(n),
  JURISDICTIONAL_RENEWABLE_POWER_PERCENTAGE: (n) => realNumber(n),
  STATIONARY_FUEL_FACTORS: {
    'Solid fuels': (n) => massPerEnergy('CO2', n),
    'Liquid fuels': (n) => massPerEnergy('CO2', n),
  },
  TRANSPORT_FUEL_FACTORS: {
    'Cars and light commercial vehicles': (n) => massPerEnergy('CO2', n),
    'Cars and light commercial vehicles (pre 2004)': (n) =>
      massPerEnergy('CO2', n),
    'Light duty vehicles': (n) => massPerEnergy('CO2', n),
    'Heavy duty vehicles': (n) => massPerEnergy('CO2', n),
    Aviation: (n) => massPerEnergy('CO2', n),
    Vessel: (n) => massPerEnergy('CO2', n),
    'Off-road Agriculture and forestry equipment': (n) =>
      massPerEnergy('CO2', n),
  },
  NATURAL_GAS_FACTORS: {
    ENERGY_CONTENT_FACTOR: (n) => energyPerVolume('Fuel', n),
    SCOPE1_EF: {
      CO2: (n) => massPerEnergy('CO2', n),
      CH4: (n) => massPerEnergy('CH4', n),
      N2O: (n) => massPerEnergy('N2O', n),
    },
    SCOPE3_EF: (n) => massPerEnergy('CO2e', n),
  },
  LIMING: {
    LIMESTONE_PURITY: (n) => realNumber(n),
    LIMESTONE_EF: (n) => massPerMass('CO2', 'Lime', n),
    DOLOMITE_PURITY: (n) => realNumber(n),
    DOLOMITE_EF: (n) => massPerMass('CO2', 'Lime', n),
  },
  ELECTRICITY: (n) => massPerElectricity('CO2e', n),
  REFRIGERATION_LEAKAGE_RATES: (n) => realNumber(n),
  REFRIGERANT_GWP: (n) => massPerMass('CO2e', 'Refrigerant', n),
  SERVICE_EMISSIONS_BY_AREA: (n) => massPerArea('CO2e', n),
  SERVICE_EMISSIONS_BY_HOUR: (n) => massPerTime('CO2e', n),
  SOLID_WASTE_LANDFILL_EF: (n) => massPerMass('CO2e', 'Solid Waste', n),
  SOLID_WASTE_INCINERATION_EF: (n) => massPerMass('CO2e', 'Solid Waste', n),
  SOLID_WASTE_COMPOSTING_EF: (n) => massPerMass('CO2e', 'Solid Waste', n),
  SOLID_WASTE_ANAEROBIC_DIGESTION_EF: (n) =>
    massPerMass('CO2e', 'Solid Waste', n),
  SOLID_WASTE_BY_VOLUME_TO_MASS: (n) =>
    massPerVolume('Solid Waste', 'Solid Waste', n),
};

type ReplaceNumberUnits<T> = T extends NumberUnitBase
  ? number
  : {
      [K in keyof T]: ReplaceNumberUnits<T[K]>;
    };

export type CommonConstantsWithNumbers = ReplaceNumberUnits<CommonConstants>;

const commonConstantsBuilder = (
  _defaultConstants: CommonConstantsWithNumbers,
  _customConstants: PartialDeep<CommonConstantsWithNumbers>,
  _units: CommonConstantsUnits,
): CommonConstantsWithNumbers => {
  return {} as CommonConstantsWithNumbers;
};

commonConstantsBuilder(commonConstants, {}, commonConstantsUnits);
