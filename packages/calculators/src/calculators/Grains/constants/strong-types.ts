import { objectFromEntries } from '@/calculators/common/tools/object';
import { constant } from '@/tools/constants';
import { ConstantSelectionContainer } from '@/tools/containers';
import {
  EnergyPerMass,
  EnergyPerVolume,
  MassPerArea,
  MassPerElectricity,
  MassPerEnergy,
  massPerMass,
  MassPerMass,
  MassPerTime,
  MassPerVolume,
  NumberUnit,
  NumberUnitBase,
  RealNumber,
} from '@/tools/units';
import { PartialDeep } from 'type-fest';
import {
  AviationFuelType,
  CarsLightCommercialFuelType,
  CarsLightCommercialPre2004FuelType,
  FuelStationaryMassBasedLiquidType,
  FuelStationarySolidType,
  FuelStationaryVolumeBasedLiquidType,
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
import { commonConstantsWithNumbers } from './strong-values';
import {
  AgrochemicalTypes,
  CropConstants,
  NamedConstants,
  States,
  SwineConstants,
} from './types';

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

export type CommonConstantsWithUnits = {
  AGROCHEMICAL_FACTORS: Record<
    AgrochemicalTypes,
    MassPerMass<'CO2e', 'Chemical'>
  >;

  EF_UREA_CO2: MassPerMass<'CO2e', 'Urea'>;
  GWP_FACTORSC6: MassPerMass<'N2O', 'CO2e'>;
  GWP_FACTORSC13: MassPerMass<'CO2', 'CO2e'>;
  GWP_FACTORSC14: RealNumber;

  GWP_FACTORSC15: RealNumber;
  GWP_FACTORSC18: RealNumber;

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
};

// type LeafType<T> = T extends NumberUnitBase
//   ? T
//   : T extends object
//     ? LeafType<T[keyof T]>
//     : never;

// type IsUnion<T, U = T> = T extends unknown
//   ? [U] extends [T]
//     ? false
//     : true
//   : never;

type ReplaceWithBuilder<T> = T extends NumberUnitBase
  ? (n: number) => T
  : T extends object
    ? { [K in keyof T]: ReplaceWithBuilder<T[K]> }
    : never;

type CommonConstantsUnits = ReplaceWithBuilder<CommonConstantsWithUnits>;

/** Recursively wraps every leaf type T that extends NumberUnit as ConstantSelectionContainer<T>. */
type WrapAsConstant<T> = T extends NumberUnit
  ? ConstantSelectionContainer<T>
  : T extends object
    ? { [K in keyof T]: WrapAsConstant<T[K]> }
    : T;

export type CommonConstants = NamedConstants & CommonConstantsWithUnits;

// const commonConstantsUnits: CommonConstantsUnits = {
//   AGROCHEMICAL_FACTORS: (n) => massPerMass('CO2e', 'Chemical', n),
//   EF_UREA_CO2: (n) => massPerMass('CO2e', 'Urea', n),
//   GWP_FACTORSC6: (n) => massPerMass('N2O', 'CO2e', n),
//   GWP_FACTORSC13: (n) => massPerMass('CO2', 'CO2e', n),
//   GWP_FACTORSC14: (n) => realNumber(n),
//   GWP_FACTORSC15: (n) => realNumber(n),
//   GWP_FACTORSC18: (n) => realNumber(n),
//   LIME_SCOPE3_EF: (n) => massPerMass('CO2e', 'Lime', n),
//   ELECTRICITY_RMF_SCOPE2_EF: (n) => massPerElectricity('CO2e', n),
//   ELECTRICITY_RMF_SCOPE3_EF: (n) => massPerElectricity('CO2e', n),
//   RENEWABLE_POWER_PERCENTAGE: (n) => realNumber(n),
//   JURISDICTIONAL_RENEWABLE_POWER_PERCENTAGE: (n) => realNumber(n),
//   STATIONARY_FUEL_FACTORS_BY_MASS: {
//     'Solid fuels': (n) => massPerEnergy('CO2', n),
//     'Liquid fuels': (n) => massPerEnergy('CO2', n),
//   },
//   STATIONARY_FUEL_FACTORS_BY_VOLUME: {
//     'Liquid fuels': (n) => massPerVolume('CO2', n),
//   },
//   TRANSPORT_FUEL_FACTORS: {
//     'Cars and light commercial vehicles': (n) => massPerEnergy('CO2', n),
//     'Cars and light commercial vehicles (pre 2004)': (n) =>
//       massPerEnergy('CO2', n),
//     'Light duty vehicles': (n) => massPerEnergy('CO2', n),
//     'Heavy duty vehicles': (n) => massPerEnergy('CO2', n),
//     Aviation: (n) => massPerEnergy('CO2', n),
//     Vessel: (n) => massPerEnergy('CO2', n),
//     'Off-road Agriculture and forestry equipment': (n) =>
//       massPerEnergy('CO2', n),
//   },
//   NATURAL_GAS_FACTORS: {
//     ENERGY_CONTENT_FACTOR: (n) => energyPerVolume('Fuel', n),
//     SCOPE1_EF: {
//       CO2: (n) => massPerEnergy('CO2', n),
//       CH4: (n) => massPerEnergy('CH4', n),
//       N2O: (n) => massPerEnergy('N2O', n),
//     },
//     SCOPE3_EF: (n) => massPerEnergy('CO2e', n),
//   },
//   LIMING: {
//     LIMESTONE_PURITY: (n) => realNumber(n),
//     LIMESTONE_EF: (n) => massPerMass('CO2', 'Lime', n),
//     DOLOMITE_PURITY: (n) => realNumber(n),
//     DOLOMITE_EF: (n) => massPerMass('CO2', 'Lime', n),
//   },
//   ELECTRICITY: (n) => massPerElectricity('CO2e', n),
//   REFRIGERATION_LEAKAGE_RATES: (n) => realNumber(n),
//   REFRIGERANT_GWP: (n) => massPerMass('CO2e', 'Refrigerant', n),
//   SERVICE_EMISSIONS_BY_AREA: (n) => massPerArea('CO2e', n),
//   SERVICE_EMISSIONS_BY_HOUR: (n) => massPerTime('CO2e', n),
//   SOLID_WASTE_LANDFILL_EF: (n) => massPerMass('CO2e', 'Solid Waste', n),
//   SOLID_WASTE_INCINERATION_EF: (n) => massPerMass('CO2e', 'Solid Waste', n),
//   SOLID_WASTE_COMPOSTING_EF: (n) => massPerMass('CO2e', 'Solid Waste', n),
//   SOLID_WASTE_ANAEROBIC_DIGESTION_EF: (n) =>
//     massPerMass('CO2e', 'Solid Waste', n),
//   SOLID_WASTE_BY_VOLUME_TO_MASS: (n) =>
//     massPerVolume('Solid Waste', 'Solid Waste', n),
// };

type ReplaceNumberUnits<T> = T extends NumberUnitBase
  ? number
  : {
      [K in keyof T]: ReplaceNumberUnits<T[K]>;
    };

export type CommonConstantsWithNumbers =
  ReplaceNumberUnits<CommonConstantsWithUnits>;

const commonConstantsBuilder = (
  defaultConstants: CommonConstantsWithNumbers,
  customConstants: PartialDeep<CommonConstantsWithNumbers>[],
): CommonConstants => {
  // const inputEntries = entriesFromObject(defaultConstants)
  // const outputEntries = inputEntries.map(([key, _value]) => [key, builderRecursive(defaultConstants, commonConstants, [key])])

  // return objectFromEntries(outputEntries)
  return {
    AGROCHEMICAL_FACTORS: objectFromEntries(
      AgrochemicalTypes.map((type) => [
        type,
        constant(type, massPerMass('CO2e', 'Chemical', 0)),
      ]),
    ),
  };
};

export const commonConstants: CommonConstants = commonConstantsBuilder(
  commonConstantsWithNumbers,
  {},
  commonConstantsUnits,
);

export const commonConstantsWithUnits: CommonConstantsWithUnits &
  NamedConstants = {};

export type AllConstants = {
  COMMON: CommonConstants;
  CROP: CropConstants;
  SWINE: SwineConstants;
};
