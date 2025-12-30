import Decimal from 'decimal.js-light';
import { IntermediateOrNamedOrigin, Origin, SummedOrigin } from './origins';

export type Substance = 'CO2' | 'CH4' | 'N2O' | 'CO2e' | 'Refrigerant' | 'Fuel';

export type MassPerMass<
  SNum extends Substance,
  SDenom extends Substance,
> = NumberUnitBase & {
  __unitType: 'MassPerMass';
  snum: SNum;
  sdenom: SDenom;
};
export const massPerMass = <SNum extends Substance, SDenom extends Substance>(
  snum: SNum,
  sdenom: SDenom,
  initialValue?: Decimal,
): MassPerMass<SNum, SDenom> => {
  return {
    __unitType: 'MassPerMass',
    snum,
    sdenom,
    initialValue: initialValue ?? new Decimal(0),
  };
};

export type MassCO2ePerMassRefrigerant = MassPerMass<'CO2e', 'Refrigerant'>;
export const massCO2ePerMassRefrigerant = (
  initialValue?: Decimal,
): MassCO2ePerMassRefrigerant => {
  return massPerMass('CO2e', 'Refrigerant', initialValue);
};

export const isMassPerMass = (
  unit: NumberUnit,
): unit is MassPerMass<Substance, Substance> => {
  return unit.__unitType === 'MassPerMass';
};

export type Mass<T extends Substance> = NumberUnitBase & {
  __unitType: 'Mass';
  substance: T;
};
export const mass = <S extends Substance>(
  substance: S,
  initialValue?: Decimal,
): Mass<S> => {
  return {
    __unitType: 'Mass',
    substance,
    initialValue: initialValue ?? new Decimal(0),
  };
};
export const isMass = (unit: NumberUnit): unit is Mass<Substance> => {
  return unit.__unitType === 'Mass';
};
export type Volume<S extends Substance> = NumberUnitBase & {
  __unitType: 'Volume';
  substance: S;
  initialValue: Decimal;
};
export const volume = <S extends Substance>(
  substance: S,
  initialValue?: Decimal,
): Volume<S> => {
  return {
    __unitType: 'Volume',
    substance,
    initialValue: initialValue ?? new Decimal(0),
  };
};

export type Energy = NumberUnitBase & {
  __unitType: 'Energy';
  initialValue: Decimal;
};
export const energy = (initialValue?: Decimal): Energy => {
  return {
    __unitType: 'Energy',
    initialValue: initialValue ?? new Decimal(0),
  };
};

export type MassPerEnergy<T extends Substance> = NumberUnitBase & {
  __unitType: 'MassPerEnergy';
  substance: T;
};
export const massPerEnergy = <S extends Substance>(
  substance: S,
  initialValue?: Decimal,
): MassPerEnergy<S> => {
  return {
    __unitType: 'MassPerEnergy',
    substance,
    initialValue: initialValue ?? new Decimal(0),
  };
};
export type EnergyPerVolume<S extends Substance> = NumberUnitBase & {
  __unitType: 'EnergyPerVolume';
  substance: S;
  initialValue: Decimal;
};
export const energyPerVolume = <S extends Substance>(
  substance: S,
  initialValue?: Decimal,
): EnergyPerVolume<S> => {
  return {
    __unitType: 'EnergyPerVolume',
    substance,
    initialValue: initialValue ?? new Decimal(0),
  };
};

type NumberUnitBase = { initialValue: Decimal };

type RealNumber = NumberUnitBase & {
  __unitType: 'RealNumber';
};
export const realNumber = (initialValue?: Decimal): RealNumber => {
  return {
    __unitType: 'RealNumber',
    initialValue: initialValue ?? new Decimal(0),
  };
};

type VoidUnit = {
  __unitType: 'Void';
  initialValue: Decimal;
};

export const voidUnit = () => ({
  __unitType: 'Void' as const,
  initialValue: new Decimal(0),
});

export type NumberUnit =
  | MassPerMass<Substance, Substance>
  | Mass<Substance>
  | MassPerEnergy<Substance>
  | EnergyPerVolume
  | VoidUnit
  | RealNumber;

export type StringUnit<V extends string = string> = V;

export const stringUnit = <V extends string = string>(
  value: V,
): StringUnit<V> => {
  return value;
};

export type AnyUnit = NumberUnit | StringUnit;

// Use function overloading to define different units that can be multiplied
// For example, MassPerMass<SNum extends Substance, SDenom extends Substance> can be multiplied by Mass<SDenom>

export type UnitArray<U extends AnyUnit, O extends Origin<U> = Origin<U>> = {
  unit: U;
  items: O[];
};

export const sum = <N extends NumberUnit>(
  array: UnitArray<N>,
  baseOrigin?: IntermediateOrNamedOrigin,
): SummedOrigin<N> => {
  const baseOrDefault = baseOrigin || { valueType: 'intermediate' };
  return {
    originType: 'sum',
    from: array,
    unit: array.unit,
    ...baseOrDefault,
  };
};
