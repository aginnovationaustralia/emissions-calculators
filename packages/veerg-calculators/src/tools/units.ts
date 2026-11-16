/*
 * Units for the emissions calculators: the defaults from @aginnovationaustralia/calculator-units,
 * plus aliases and type guards used by the calculators. Import units from here rather than from the
 * package, so they can be extended in one place.
 */
import {
  BooleanUnit,
  InitialValue,
  isNumberUnit,
  RealNumber,
  StringUnit,
  Substance,
  ValueStore,
  VoidUnit,
} from '@aginnovationaustralia/calculator-units';
import * as Units from '@aginnovationaustralia/calculator-units/defaults';
import Decimal from 'decimal.js-light';

export {
  isBooleanUnit,
  isRealNumber,
  isStringUnit,
  isVoid,
  percentage,
  realNumber,
  voidUnit,
} from '@aginnovationaustralia/calculator-units';
export type {
  BooleanUnit,
  RealNumber,
  StringUnit,
  Substance,
  VoidUnit,
} from '@aginnovationaustralia/calculator-units';

/*
 * The default units, declared again here so that types elsewhere refer to them as `@/tools/units`
 * types. Declaration files would otherwise spell out the package path for every unit, which takes
 * some large input schemas past the size TypeScript will serialise.
 */
export type Energy = Units.Energy;
export type Area = Units.Area;
export type Time = Units.Time;
export type Electricity = Units.Electricity;
export type EnergyPerHeadPerDay = Units.EnergyPerHeadPerDay;
export type Days = Units.Days;
export type Years = Units.Years;
export type Head = Units.Head;
export type Distance = Units.Distance;
export type Mass<S extends Substance = Substance> = Units.Mass<S>;
export type Volume<S extends Substance = Substance> = Units.Volume<S>;
export type MassPerEnergy<S extends Substance = Substance> =
  Units.MassPerEnergy<S>;
export type MassPerElectricity<S extends Substance = Substance> =
  Units.MassPerElectricity<S>;
export type EnergyPerVolume<S extends Substance = Substance> =
  Units.EnergyPerVolume<S>;
export type EnergyPerMass<S extends Substance = Substance> =
  Units.EnergyPerMass<S>;
export type MassPerArea<S extends Substance = Substance> = Units.MassPerArea<S>;
export type MassPerAreaPerDay<S extends Substance = Substance> =
  Units.MassPerAreaPerDay<S>;
export type MassPerAreaPerYear<S extends Substance = Substance> =
  Units.MassPerAreaPerYear<S>;
export type MassPerYear<S extends Substance = Substance> = Units.MassPerYear<S>;
export type MassPerTime<S extends Substance = Substance> = Units.MassPerTime<S>;
export type MassPerDay<S extends Substance = Substance> = Units.MassPerDay<S>;
export type MassPerHead<S extends Substance = Substance> = Units.MassPerHead<S>;
export type MassPerHeadPerDay<S extends Substance = Substance> =
  Units.MassPerHeadPerDay<S>;
export type MassPerHeadPerYear<S extends Substance = Substance> =
  Units.MassPerHeadPerYear<S>;
export type VolumePerHeadPerDay<S extends Substance = Substance> =
  Units.VolumePerHeadPerDay<S>;
export type CountPerArea<S extends Substance = Substance> =
  Units.CountPerArea<S>;
export type MassDistance<S extends Substance = Substance> =
  Units.MassDistance<S>;
export type MassPerMass<
  N extends Substance = Substance,
  D extends Substance = Substance,
> = Units.MassPerMass<N, D>;
export type MassPerMassDistance<
  N extends Substance = Substance,
  D extends Substance = Substance,
> = Units.MassPerMassDistance<N, D>;
export type MassPerVolume<
  M extends Substance = Substance,
  V extends Substance = Substance,
> = Units.MassPerVolume<M, V>;
export type VolumePerMass<
  V extends Substance = Substance,
  M extends Substance = Substance,
> = Units.VolumePerMass<V, M>;

export const energy: (initialValue?: InitialValue) => Energy = Units.energy;
export const area: (initialValue?: InitialValue) => Area = Units.area;
export const time: (initialValue?: InitialValue) => Time = Units.time;
export const electricity: (initialValue?: InitialValue) => Electricity =
  Units.electricity;
export const energyPerHeadPerDay: (
  initialValue?: InitialValue,
) => EnergyPerHeadPerDay = Units.energyPerHeadPerDay;
export const days: (initialValue?: InitialValue) => Days = Units.days;
export const years: (initialValue?: InitialValue) => Years = Units.years;
export const head: (initialValue?: InitialValue) => Head = Units.head;
export const distance: (initialValue?: InitialValue) => Distance =
  Units.distance;
export const mass: <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
) => Mass<S> = Units.mass;
export const volume: <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
) => Volume<S> = Units.volume;
export const massPerEnergy: <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
) => MassPerEnergy<S> = Units.massPerEnergy;
export const massPerElectricity: <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
) => MassPerElectricity<S> = Units.massPerElectricity;
export const energyPerVolume: <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
) => EnergyPerVolume<S> = Units.energyPerVolume;
export const energyPerMass: <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
) => EnergyPerMass<S> = Units.energyPerMass;
export const massPerArea: <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
) => MassPerArea<S> = Units.massPerArea;
export const massPerAreaPerDay: <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
) => MassPerAreaPerDay<S> = Units.massPerAreaPerDay;
export const massPerAreaPerYear: <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
) => MassPerAreaPerYear<S> = Units.massPerAreaPerYear;
export const massPerYear: <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
) => MassPerYear<S> = Units.massPerYear;
export const massPerTime: <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
) => MassPerTime<S> = Units.massPerTime;
export const massPerDay: <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
) => MassPerDay<S> = Units.massPerDay;
export const massPerHead: <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
) => MassPerHead<S> = Units.massPerHead;
export const massPerHeadPerDay: <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
) => MassPerHeadPerDay<S> = Units.massPerHeadPerDay;
export const massPerHeadPerYear: <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
) => MassPerHeadPerYear<S> = Units.massPerHeadPerYear;
export const volumePerHeadPerDay: <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
) => VolumePerHeadPerDay<S> = Units.volumePerHeadPerDay;
export const countPerArea: <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
) => CountPerArea<S> = Units.countPerArea;
export const massDistance: <S extends Substance>(
  substance: S,
  initialValue?: InitialValue,
) => MassDistance<S> = Units.massDistance;
export const massPerMass: <N extends Substance, D extends Substance>(
  snum: N,
  sdenom: D,
  initialValue?: InitialValue,
) => MassPerMass<N, D> = Units.massPerMass;
export const massPerMassDistance: <N extends Substance, D extends Substance>(
  snum: N,
  sdenom: D,
  initialValue?: InitialValue,
) => MassPerMassDistance<N, D> = Units.massPerMassDistance;
export const massPerVolume: <M extends Substance, V extends Substance>(
  massSubstance: M,
  volumeSubstance: V,
  initialValue?: InitialValue,
) => MassPerVolume<M, V> = Units.massPerVolume;
export const volumePerMass: <V extends Substance, M extends Substance>(
  volumeSubstance: V,
  massSubstance: M,
  initialValue?: InitialValue,
) => VolumePerMass<V, M> = Units.volumePerMass;

/** Every number unit the calculators use, as a union that narrows on `__unitType`. */
export type NumberUnit = Units.DefaultNumberUnit | RealNumber | VoidUnit;

export type AnyUnit = NumberUnit | StringUnit | BooleanUnit;

export type NumberUnitBase = {
  store: ValueStore;
};

export const isEnergy = (unit: AnyUnit): unit is Energy =>
  isNumberUnit(unit) && unit.__unitType === 'Energy';
export const isArea = (unit: AnyUnit): unit is Area =>
  isNumberUnit(unit) && unit.__unitType === 'Area';
export const isTime = (unit: AnyUnit): unit is Time =>
  isNumberUnit(unit) && unit.__unitType === 'Time';
export const isElectricity = (unit: AnyUnit): unit is Electricity =>
  isNumberUnit(unit) && unit.__unitType === 'Electricity';
export const isEnergyPerHeadPerDay = (
  unit: AnyUnit,
): unit is EnergyPerHeadPerDay =>
  isNumberUnit(unit) && unit.__unitType === 'EnergyPerHeadPerDay';
export const isDays = (unit: AnyUnit): unit is Days =>
  isNumberUnit(unit) && unit.__unitType === 'Days';
export const isYears = (unit: AnyUnit): unit is Years =>
  isNumberUnit(unit) && unit.__unitType === 'Years';
export const isHead = (unit: AnyUnit): unit is Head =>
  isNumberUnit(unit) && unit.__unitType === 'Head';
export const isDistance = (unit: AnyUnit): unit is Distance =>
  isNumberUnit(unit) && unit.__unitType === 'Distance';
export const isMass = (unit: AnyUnit): unit is Mass =>
  isNumberUnit(unit) && unit.__unitType === 'Mass';
export const isVolume = (unit: AnyUnit): unit is Volume =>
  isNumberUnit(unit) && unit.__unitType === 'Volume';
export const isMassPerEnergy = (unit: AnyUnit): unit is MassPerEnergy =>
  isNumberUnit(unit) && unit.__unitType === 'MassPerEnergy';
export const isMassPerElectricity = (
  unit: AnyUnit,
): unit is MassPerElectricity =>
  isNumberUnit(unit) && unit.__unitType === 'MassPerElectricity';
export const isEnergyPerVolume = (unit: AnyUnit): unit is EnergyPerVolume =>
  isNumberUnit(unit) && unit.__unitType === 'EnergyPerVolume';
export const isEnergyPerMass = (unit: AnyUnit): unit is EnergyPerMass =>
  isNumberUnit(unit) && unit.__unitType === 'EnergyPerMass';
export const isMassPerArea = (unit: AnyUnit): unit is MassPerArea =>
  isNumberUnit(unit) && unit.__unitType === 'MassPerArea';
export const isMassPerAreaPerDay = (unit: AnyUnit): unit is MassPerAreaPerDay =>
  isNumberUnit(unit) && unit.__unitType === 'MassPerAreaPerDay';
export const isMassPerAreaPerYear = (
  unit: AnyUnit,
): unit is MassPerAreaPerYear =>
  isNumberUnit(unit) && unit.__unitType === 'MassPerAreaPerYear';
export const isMassPerYear = (unit: AnyUnit): unit is MassPerYear =>
  isNumberUnit(unit) && unit.__unitType === 'MassPerYear';
export const isMassPerTime = (unit: AnyUnit): unit is MassPerTime =>
  isNumberUnit(unit) && unit.__unitType === 'MassPerTime';
export const isMassPerDay = (unit: AnyUnit): unit is MassPerDay =>
  isNumberUnit(unit) && unit.__unitType === 'MassPerDay';
export const isMassPerHead = (unit: AnyUnit): unit is MassPerHead =>
  isNumberUnit(unit) && unit.__unitType === 'MassPerHead';
export const isMassPerHeadPerDay = (unit: AnyUnit): unit is MassPerHeadPerDay =>
  isNumberUnit(unit) && unit.__unitType === 'MassPerHeadPerDay';
export const isMassPerHeadPerYear = (
  unit: AnyUnit,
): unit is MassPerHeadPerYear =>
  isNumberUnit(unit) && unit.__unitType === 'MassPerHeadPerYear';
export const isVolumePerHeadPerDay = (
  unit: AnyUnit,
): unit is VolumePerHeadPerDay =>
  isNumberUnit(unit) && unit.__unitType === 'VolumePerHeadPerDay';
export const isCountPerArea = (unit: AnyUnit): unit is CountPerArea =>
  isNumberUnit(unit) && unit.__unitType === 'CountPerArea';
export const isMassDistance = (unit: AnyUnit): unit is MassDistance =>
  isNumberUnit(unit) && unit.__unitType === 'MassDistance';
export const isMassPerMass = (unit: AnyUnit): unit is MassPerMass =>
  isNumberUnit(unit) && unit.__unitType === 'MassPerMass';
export const isMassPerMassDistance = (
  unit: AnyUnit,
): unit is MassPerMassDistance =>
  isNumberUnit(unit) && unit.__unitType === 'MassPerMassDistance';
export const isMassPerVolume = (unit: AnyUnit): unit is MassPerVolume =>
  isNumberUnit(unit) && unit.__unitType === 'MassPerVolume';
export const isVolumePerMass = (unit: AnyUnit): unit is VolumePerMass =>
  isNumberUnit(unit) && unit.__unitType === 'VolumePerMass';

export type MassCO2ePerMassRefrigerant = MassPerMass<'CO2e', 'Refrigerant'>;
export const massCO2ePerMassRefrigerant = (
  initialValueRatio?: number | Decimal,
): MassCO2ePerMassRefrigerant =>
  massPerMass('CO2e', 'Refrigerant', initialValueRatio);

export type LiveweightGain = MassPerHeadPerDay<'Liveweight'>;
export const liveweightGain = (
  initialValueKgPerHeadPerDay?: number | Decimal | ValueStore,
): LiveweightGain =>
  massPerHeadPerDay('Liveweight', initialValueKgPerHeadPerDay);
export const isLiveweightGain = (unit: AnyUnit): unit is LiveweightGain =>
  isMassPerHeadPerDay(unit) && unit.substance === 'Liveweight';

export type Liveweight = MassPerHead<'Liveweight'>;
export const liveweight = (
  initialValueKgPerHead?: number | Decimal,
): Liveweight => massPerHead('Liveweight', initialValueKgPerHead);
export const isLiveweight = (unit: AnyUnit): unit is Liveweight =>
  isMassPerHead(unit) && unit.substance === 'Liveweight';

export const stringUnit = <V extends string = string>(
  value: V,
): StringUnit<V> => value;

export const booleanUnit = (value: boolean): BooleanUnit => value;
