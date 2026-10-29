import Decimal from 'decimal.js-light';
import type {
  AnyNumberUnit,
  AnySubstance,
  AnyUnit,
  GenericNumberUnit,
} from './generic';
import { values, ValueStore } from './value-store';

export type Substance =
  | 'Carbon'
  | 'Chemical'
  | 'Inorganic Fertiliser'
  | 'Organic Fertiliser'
  | 'CO2'
  | 'CH4'
  | 'N2O'
  | 'N'
  | 'Volatilised N'
  | 'CO2e'
  | 'Refrigerant'
  | 'Fuel'
  | 'Greasy Wool'
  | 'Clean Wool'
  | 'FluidWaste'
  | 'Oxygen'
  | 'Urea'
  | 'DryMatter'
  | 'CrudeProtein'
  | 'CropResidue'
  | 'Yield'
  | 'Lime'
  | 'Solid Waste'
  | 'Milk'
  | 'Milk Solids'
  | 'Liveweight'
  | 'Purchased Feed'
  | 'Purchased Mineral Supplement'
  | 'Volatile Solids'
  | 'COD'
  | 'Packaging'
  | 'Organic Amendment'
  | 'Trees'
  | 'Freight Goods'
  | 'Eggs'
  | 'Fish';

export type NumberUnitBase = {
  store: ValueStore;
};

/* SI unit definitions

Selected base units for storage of values:
Mass: kilograms (kg)
Time: hours (h)
Distance: metres (m)
Area: square metres (m2)
Volume: litres (L)
Energy: joules (J)
Electricity: kilowatt hours (kWh)

See https://en.wikipedia.org/wiki/International_System_of_Units#SI_base_units
*/

export type MassPerMass<
  SNum extends AnySubstance,
  SDenom extends AnySubstance,
> = NumberUnitBase & {
  __unitType: 'MassPerMass';
  snum: SNum;
  sdenom: SDenom;
};
export const massPerMass = <
  SNum extends AnySubstance,
  SDenom extends AnySubstance,
>(
  snum: SNum,
  sdenom: SDenom,
  initialValueRatio?: number | Decimal | ValueStore,
): MassPerMass<SNum, SDenom> => {
  return {
    __unitType: 'MassPerMass',
    snum,
    sdenom,
    store: values(initialValueRatio),
  };
};

export type MassCO2ePerMassRefrigerant = MassPerMass<'CO2e', 'Refrigerant'>;
export const massCO2ePerMassRefrigerant = (
  initialValueRatio?: number | Decimal,
): MassCO2ePerMassRefrigerant => {
  return massPerMass('CO2e', 'Refrigerant', initialValueRatio);
};

export const isMassPerMass = (
  unit: AnyNumberUnit,
): unit is MassPerMass<AnySubstance, AnySubstance> => {
  return unit.__unitType === 'MassPerMass';
};

export type Mass<T extends AnySubstance> = NumberUnitBase & {
  __unitType: 'Mass';
  substance: T;
};
export const mass = <S extends AnySubstance>(
  substance: S,
  initialValueKg?: number | Decimal,
): Mass<S> => {
  return {
    __unitType: 'Mass',
    substance,
    store: values(initialValueKg),
  };
};
export const isMass = (unit: AnyNumberUnit): unit is Mass<AnySubstance> => {
  return unit.__unitType === 'Mass';
};
export type Volume<S extends AnySubstance> = NumberUnitBase & {
  __unitType: 'Volume';
  substance: S;
};
export const volume = <S extends AnySubstance>(
  substance: S,
  initialValueLitres?: number | Decimal,
): Volume<S> => {
  return {
    __unitType: 'Volume',
    substance,
    store: values(initialValueLitres),
  };
};
export const isVolume = (unit: AnyNumberUnit): unit is Volume<AnySubstance> => {
  return unit.__unitType === 'Volume';
};

export type Energy = NumberUnitBase & {
  __unitType: 'Energy';
};
export const energy = (initialValueJoules?: number | Decimal): Energy => {
  return {
    __unitType: 'Energy',
    store: values(initialValueJoules),
  };
};
export const isEnergy = (unit: AnyNumberUnit): unit is Energy => {
  return unit.__unitType === 'Energy';
};
export type Area = NumberUnitBase & {
  __unitType: 'Area';
};
export const area = (initialValueMetresSquared?: number | Decimal): Area => {
  return {
    __unitType: 'Area',
    store: values(initialValueMetresSquared),
  };
};
export const isArea = (unit: AnyNumberUnit): unit is Area => {
  return unit.__unitType === 'Area';
};

export type Time = NumberUnitBase & {
  __unitType: 'Time';
};
export const time = (initialValueSeconds?: number | Decimal): Time => {
  return {
    __unitType: 'Time',
    store: values(initialValueSeconds),
  };
};
export const isTime = (unit: AnyNumberUnit): unit is Time => {
  return unit.__unitType === 'Time';
};

export type Electricity = NumberUnitBase & {
  __unitType: 'Electricity';
};
export const electricity = (
  initialValueKWh?: number | Decimal,
): Electricity => {
  return {
    __unitType: 'Electricity',
    store: values(initialValueKWh),
  };
};
export const isElectricity = (unit: AnyNumberUnit): unit is Electricity => {
  return unit.__unitType === 'Electricity';
};

export type MassPerEnergy<T extends AnySubstance> = NumberUnitBase & {
  __unitType: 'MassPerEnergy';
  substance: T;
};
export const massPerEnergy = <S extends AnySubstance>(
  substance: S,
  initialValueKgPerJoules?: number | Decimal,
): MassPerEnergy<S> => {
  return {
    __unitType: 'MassPerEnergy',
    substance,
    store: values(initialValueKgPerJoules),
  };
};
export const isMassPerEnergy = (
  unit: AnyNumberUnit,
): unit is MassPerEnergy<AnySubstance> => {
  return unit.__unitType === 'MassPerEnergy';
};

export type MassPerElectricity<S extends AnySubstance> = NumberUnitBase & {
  __unitType: 'MassPerElectricity';
  substance: S;
};
export const massPerElectricity = <S extends AnySubstance>(
  substance: S,
  initialValueKgPerKWh?: number | Decimal,
): MassPerElectricity<S> => {
  return {
    __unitType: 'MassPerElectricity',
    substance,
    store: values(initialValueKgPerKWh),
  };
};

export const isMassPerElectricity = (
  unit: AnyNumberUnit,
): unit is MassPerElectricity<AnySubstance> => {
  return unit.__unitType === 'MassPerElectricity';
};
export type EnergyPerVolume<S extends AnySubstance> = NumberUnitBase & {
  __unitType: 'EnergyPerVolume';
  substance: S;
};
export const energyPerVolume = <S extends AnySubstance>(
  substance: S,
  initialValueJoulesPerLitre?: number | Decimal,
): EnergyPerVolume<S> => {
  return {
    __unitType: 'EnergyPerVolume',
    substance,
    store: values(initialValueJoulesPerLitre),
  };
};
export const isEnergyPerVolume = (
  unit: AnyNumberUnit,
): unit is EnergyPerVolume<AnySubstance> => {
  return unit.__unitType === 'EnergyPerVolume';
};

export type EnergyPerMass<S extends AnySubstance> = NumberUnitBase & {
  __unitType: 'EnergyPerMass';
  substance: S;
};
export const energyPerMass = <S extends AnySubstance>(
  substance: S,
  initialValueJoulesPerKg?: number | Decimal,
): EnergyPerMass<S> => {
  return {
    __unitType: 'EnergyPerMass',
    substance,
    store: values(initialValueJoulesPerKg),
  };
};
export const isEnergyPerMass = (
  unit: AnyNumberUnit,
): unit is EnergyPerMass<AnySubstance> => {
  return unit.__unitType === 'EnergyPerMass';
};

export type EnergyPerHeadPerDay = NumberUnitBase & {
  __unitType: 'EnergyPerHeadPerDay';
};
export const energyPerHeadPerDay = (
  initialValueJoulesPerHeadPerDay?: number | Decimal,
): EnergyPerHeadPerDay => {
  return {
    __unitType: 'EnergyPerHeadPerDay',
    store: values(initialValueJoulesPerHeadPerDay),
  };
};
export const isEnergyPerHeadPerDay = (
  unit: AnyNumberUnit,
): unit is EnergyPerHeadPerDay => {
  return unit.__unitType === 'EnergyPerHeadPerDay';
};

export type MassPerVolume<
  SMass extends AnySubstance,
  SVolume extends AnySubstance,
> = NumberUnitBase & {
  __unitType: 'MassPerVolume';
  mass: SMass;
  volume: SVolume;
};
export const massPerVolume = <
  SMass extends AnySubstance,
  SVolume extends AnySubstance,
>(
  mass: SMass,
  volume: SVolume,
  initialValueKgPerLitre?: number | Decimal,
): MassPerVolume<SMass, SVolume> => {
  return {
    __unitType: 'MassPerVolume',
    mass,
    volume,
    store: values(initialValueKgPerLitre),
  };
};
export const isMassPerVolume = (
  unit: AnyNumberUnit,
): unit is MassPerVolume<AnySubstance, AnySubstance> => {
  return unit.__unitType === 'MassPerVolume';
};

export type MassPerArea<S extends AnySubstance> = NumberUnitBase & {
  __unitType: 'MassPerArea';
  substance: S;
};
export const massPerArea = <S extends AnySubstance>(
  substance: S,
  initialValueKgPerSquareMetre?: number | Decimal,
): MassPerArea<S> => {
  return {
    __unitType: 'MassPerArea',
    substance,
    store: values(initialValueKgPerSquareMetre),
  };
};
export const isMassPerArea = (
  unit: AnyNumberUnit,
): unit is MassPerArea<AnySubstance> => {
  return unit.__unitType === 'MassPerArea';
};

export type MassPerAreaPerYear<S extends AnySubstance> = NumberUnitBase & {
  __unitType: 'MassPerAreaPerYear';
  substance: S;
};
export const massPerAreaPerYear = <S extends AnySubstance>(
  substance: S,
  initialValueKgPerSquareMetrePerYear?: number | Decimal,
): MassPerAreaPerYear<S> => {
  return {
    __unitType: 'MassPerAreaPerYear',
    substance,
    store: values(initialValueKgPerSquareMetrePerYear),
  };
};
export const isMassPerAreaPerYear = (
  unit: AnyNumberUnit,
): unit is MassPerAreaPerYear<AnySubstance> => {
  return unit.__unitType === 'MassPerAreaPerYear';
};

// NOTE: Technically this overlaps with MassPerTime, but tracking Years as their own unit helps to simplify things
export type MassPerYear<S extends AnySubstance> = NumberUnitBase & {
  __unitType: 'MassPerYear';
  substance: S;
};
export const massPerYear = <S extends AnySubstance>(
  substance: S,
  initialValueKgPerYear?: number | Decimal,
): MassPerYear<S> => {
  return {
    __unitType: 'MassPerYear',
    substance,
    store: values(initialValueKgPerYear),
  };
};
export const isMassPerYear = (
  unit: AnyNumberUnit,
): unit is MassPerYear<AnySubstance> => {
  return unit.__unitType === 'MassPerYear';
};

export type MassPerTime<S extends AnySubstance> = NumberUnitBase & {
  __unitType: 'MassPerTime';
  substance: S;
};
export const massPerTime = <S extends AnySubstance>(
  substance: S,
  initialValueKgPerSecond?: number | Decimal,
): MassPerTime<S> => {
  return {
    __unitType: 'MassPerTime',
    substance,
    store: values(initialValueKgPerSecond),
  };
};
export const isMassPerTime = (
  unit: AnyNumberUnit,
): unit is MassPerTime<AnySubstance> => {
  return unit.__unitType === 'MassPerTime';
};

export type MassPerHeadPerDay<S extends AnySubstance> = NumberUnitBase & {
  __unitType: 'MassPerHeadPerDay';
  substance: S;
};
export const massPerHeadPerDay = <S extends AnySubstance>(
  substance: S,
  initialValueKgPerHeadPerDay?: number | Decimal | ValueStore,
): MassPerHeadPerDay<S> => {
  return {
    __unitType: 'MassPerHeadPerDay',
    substance,
    store: values(initialValueKgPerHeadPerDay),
  };
};
export const isMassPerHeadPerDay = (
  unit: AnyNumberUnit,
): unit is MassPerHeadPerDay<AnySubstance> => {
  return unit.__unitType === 'MassPerHeadPerDay';
};

export type MassPerHeadPerYear<S extends AnySubstance> = NumberUnitBase & {
  __unitType: 'MassPerHeadPerYear';
  substance: S;
};
export const massPerHeadPerYear = <S extends AnySubstance>(
  substance: S,
  initialValueKgPerHeadPerYear?: number | Decimal | ValueStore,
): MassPerHeadPerYear<S> => {
  return {
    __unitType: 'MassPerHeadPerYear',
    substance,
    store: values(initialValueKgPerHeadPerYear),
  };
};
export const isMassPerHeadPerYear = (
  unit: AnyNumberUnit,
): unit is MassPerHeadPerYear<AnySubstance> => {
  return unit.__unitType === 'MassPerHeadPerYear';
};

export type LiveweightGain = MassPerHeadPerDay<'Liveweight'>;

export const liveweightGain = (
  initialValueKgPerHeadPerDay?: number | Decimal | ValueStore,
): LiveweightGain =>
  massPerHeadPerDay('Liveweight', initialValueKgPerHeadPerDay);

export const isLiveweightGain = (
  unit: AnyNumberUnit,
): unit is LiveweightGain => {
  return (
    unit.__unitType === 'MassPerHeadPerDay' && unit.substance === 'Liveweight'
  );
};

export type VolumePerHeadPerDay<S extends AnySubstance> = NumberUnitBase & {
  __unitType: 'VolumePerHeadPerDay';
  substance: S;
};
export const volumePerHeadPerDay = <S extends AnySubstance>(
  substance: S,
  initialValueLitresPerHeadPerDay?: number | Decimal | ValueStore,
): VolumePerHeadPerDay<S> => {
  return {
    __unitType: 'VolumePerHeadPerDay',
    substance,
    store: values(initialValueLitresPerHeadPerDay),
  };
};
export const isVolumePerHeadPerDay = (
  unit: AnyNumberUnit,
): unit is VolumePerHeadPerDay<AnySubstance> => {
  return unit.__unitType === 'VolumePerHeadPerDay';
};

export type MassPerHead<S extends AnySubstance> = NumberUnitBase & {
  __unitType: 'MassPerHead';
  substance: S;
};
export const massPerHead = <S extends AnySubstance>(
  substance: S,
  initialValueKgPerHead?: number | Decimal,
): MassPerHead<S> => {
  return {
    __unitType: 'MassPerHead',
    substance,
    store: values(initialValueKgPerHead),
  };
};
export const isMassPerHead = (
  unit: AnyNumberUnit,
): unit is MassPerHead<AnySubstance> => {
  return unit.__unitType === 'MassPerHead';
};

export type Liveweight = MassPerHead<'Liveweight'>;

export const liveweight = (
  initialValueKgPerHead?: number | Decimal,
): Liveweight => massPerHead('Liveweight', initialValueKgPerHead);

export const isLiveweight = (unit: AnyNumberUnit): unit is Liveweight => {
  return unit.__unitType === 'MassPerHead' && unit.substance === 'Liveweight';
};

export type VolumePerMass<
  SV extends AnySubstance,
  SM extends AnySubstance,
> = NumberUnitBase & {
  __unitType: 'VolumePerMass';
  volume: SV;
  mass: SM;
};
export const volumePerMass = <SV extends AnySubstance, SM extends AnySubstance>(
  volume: SV,
  mass: SM,
  initialValueLitresPerKg?: number | Decimal,
): VolumePerMass<SV, SM> => {
  return {
    __unitType: 'VolumePerMass',
    volume,
    mass,
    store: values(initialValueLitresPerKg),
  };
};
export const isVolumePerMass = (
  unit: AnyNumberUnit,
): unit is VolumePerMass<AnySubstance, AnySubstance> => {
  return unit.__unitType === 'VolumePerMass';
};

export type MassPerDay<S extends AnySubstance> = NumberUnitBase & {
  __unitType: 'MassPerDay';
  substance: S;
};
export const massPerDay = <S extends AnySubstance>(
  substance: S,
  initialValueKgPerDays?: number | Decimal,
): MassPerDay<S> => {
  return {
    __unitType: 'MassPerDay',
    substance,
    store: values(initialValueKgPerDays),
  };
};
export const isMassPerDay = (
  unit: AnyNumberUnit,
): unit is MassPerDay<AnySubstance> => {
  return unit.__unitType === 'MassPerDay';
};

export type Days = NumberUnitBase & {
  __unitType: 'Days';
};
export const days = (initialValueDays?: number | Decimal): Days => {
  return {
    __unitType: 'Days',
    store: values(initialValueDays),
  };
};
export const isDays = (unit: AnyNumberUnit): unit is Days => {
  return unit.__unitType === 'Days';
};

export type Years = NumberUnitBase & {
  __unitType: 'Years';
};
export const years = (initialValueYears?: number | Decimal): Years => {
  return {
    __unitType: 'Years',
    store: values(initialValueYears),
  };
};
export const isYears = (unit: AnyNumberUnit): unit is Years => {
  return unit.__unitType === 'Years';
};

export type CountPerArea<S extends AnySubstance> = NumberUnitBase & {
  __unitType: 'CountPerArea';
  substance: S;
};
export const countPerArea = <S extends AnySubstance>(
  substance: S,
  initialValueCountPerSqMetre?: number | Decimal,
): CountPerArea<S> => {
  return {
    __unitType: 'CountPerArea',
    substance,
    store: values(initialValueCountPerSqMetre),
  };
};
export const isCountPerArea = (
  unit: AnyNumberUnit,
): unit is CountPerArea<AnySubstance> => {
  return unit.__unitType === 'CountPerArea';
};

export type Head = NumberUnitBase & {
  __unitType: 'Head';
};
export const head = (initialValueHeads?: number | Decimal): Head => {
  return {
    __unitType: 'Head',
    store: values(initialValueHeads),
  };
};
export const isHead = (unit: AnyNumberUnit): unit is Head => {
  return unit.__unitType === 'Head';
};

export type MassPerAreaPerDay<S extends AnySubstance> = NumberUnitBase & {
  __unitType: 'MassPerAreaPerDay';
  substance: S;
};
export const massPerAreaPerDay = <S extends AnySubstance>(
  substance: S,
  initialValueKgPerSquareMetrePerDay?: number | Decimal,
): MassPerAreaPerDay<S> => {
  return {
    __unitType: 'MassPerAreaPerDay',
    store: values(initialValueKgPerSquareMetrePerDay),
    substance,
  };
};
export const isMassPerAreaPerDay = (
  unit: AnyNumberUnit,
): unit is MassPerAreaPerDay<AnySubstance> => {
  return unit.__unitType === 'MassPerAreaPerDay';
};

export type Distance = NumberUnitBase & {
  __unitType: 'Distance';
};
export const distance = (initialValueMetres?: number | Decimal): Distance => {
  return {
    __unitType: 'Distance',
    store: values(initialValueMetres),
  };
};
export const isDistance = (unit: AnyNumberUnit): unit is Distance => {
  return unit.__unitType === 'Distance';
};

export type MassDistance<S extends AnySubstance> = NumberUnitBase & {
  __unitType: 'MassDistance';
  substance: S;
};
export const massDistance = <S extends AnySubstance>(
  substance: S,
  initialValueKgMetres?: number | Decimal,
): MassDistance<S> => {
  return {
    __unitType: 'MassDistance',
    substance,
    store: values(initialValueKgMetres),
  };
};
export const isMassDistance = (
  unit: AnyNumberUnit,
): unit is MassDistance<AnySubstance> => {
  return unit.__unitType === 'MassDistance';
};

export type MassPerMassDistance<
  SNum extends AnySubstance,
  SDenom extends AnySubstance,
> = NumberUnitBase & {
  __unitType: 'MassPerMassDistance';
  snum: SNum;
  sdenom: SDenom;
};
export const massPerMassDistance = <
  SNum extends AnySubstance,
  SDenom extends AnySubstance,
>(
  snum: SNum,
  sdenom: SDenom,
  initialValueKgPerKgMetres?: number | Decimal,
): MassPerMassDistance<SNum, SDenom> => {
  return {
    __unitType: 'MassPerMassDistance',
    snum,
    sdenom,
    store: values(initialValueKgPerKgMetres),
  };
};
export const isMassPerMassDistance = (
  unit: AnyNumberUnit,
): unit is MassPerMassDistance<AnySubstance, AnySubstance> => {
  return unit.__unitType === 'MassPerMassDistance';
};

export type RealNumber = NumberUnitBase & {
  __unitType: 'RealNumber';
};
export const realNumber = (
  initialValue?: number | Decimal | ValueStore,
): RealNumber => {
  return {
    __unitType: 'RealNumber',
    store: values(initialValue),
  };
};
export const isRealNumber = (unit: AnyNumberUnit): unit is RealNumber => {
  return unit.__unitType === 'RealNumber';
};
export const percentage = (initialValue?: number | Decimal): RealNumber => {
  return realNumber(initialValue ? new Decimal(initialValue).div(100) : 0);
};

export type VoidUnit = {
  __unitType: 'Void';
  store: ValueStore;
};

export const voidUnit = () => ({
  __unitType: 'Void' as const,
  store: values(0),
});

export const isVoid = (unit: AnyUnit): unit is VoidUnit => {
  return (
    typeof unit === 'object' &&
    '__unitType' in unit &&
    unit.__unitType === 'Void'
  );
};

/** VEERG's number units, restricted to the VEERG substance vocabulary. */
export type NumberUnit = GenericNumberUnit<Substance>;

export type StringUnit<V extends string = string> = V;

export const stringUnit = <V extends string = string>(
  value: V,
): StringUnit<V> => {
  return value;
};

export const isStringUnit = (unit: AnyUnit): unit is StringUnit => {
  return typeof unit === 'string';
};

export type BooleanUnit = boolean;

export const booleanUnit = (value: boolean): BooleanUnit => value;

export const isBooleanUnit = (unit: AnyUnit): unit is BooleanUnit => {
  return typeof unit === 'boolean';
};
