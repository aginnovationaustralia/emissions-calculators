import Decimal from 'decimal.js-light';
import { BaseOrigin, Origin, SummedOrigin } from './origins';
// import { KgPerKg, MassKg } from './values';

export type Substance = 'CO2' | 'CH4' | 'N2O' | 'CO2e' | 'Refrigerant';

export type KgPerKg<
  SNum extends Substance,
  SDenom extends Substance,
> = NumberUnitBase & {
  __unitType: 'KgCO2ePerKg';
  snum: SNum;
  sdenom: SDenom;
};
export const kgPerKg = <SNum extends Substance, SDenom extends Substance>(
  snum: SNum,
  sdenom: SDenom,
  initialValue?: Decimal,
): KgPerKg<SNum, SDenom> => {
  return {
    __unitType: 'KgCO2ePerKg',
    snum,
    sdenom,
    initialValue: initialValue ?? new Decimal(0),
  };
};

export type KgCO2ePerKgRefrigerant = KgPerKg<'CO2e', 'Refrigerant'>;
export const kgCO2ePerKgRefrigerant = (
  initialValue?: Decimal,
): KgCO2ePerKgRefrigerant => {
  return kgPerKg('CO2e', 'Refrigerant', initialValue);
};

export const isKgPerKg = (
  unit: NumberUnit,
): unit is KgPerKg<Substance, Substance> => {
  return unit.__unitType === 'KgCO2ePerKg';
};

export type MassKg<T extends Substance> = NumberUnitBase & {
  __unitType: 'MassKg';
  substance: T;
};
export const massKg = <S extends Substance>(
  substance: S,
  initialValue?: Decimal,
): MassKg<S> => {
  return {
    __unitType: 'MassKg',
    substance,
    initialValue: initialValue ?? new Decimal(0),
  };
};
export const isMassKg = (unit: NumberUnit): unit is MassKg<Substance> => {
  return unit.__unitType === 'MassKg';
};

type NumberUnitBase = { initialValue: Decimal };

export type NumberUnit = KgPerKg<Substance, Substance> | MassKg<Substance>;

export type StringUnit<V extends string = string> = V;

export type AnyUnit = NumberUnit | StringUnit;

// Use function overloading to define different units that can be multiplied
// For example, KgPerKg<SNum extends Substance, SDenom extends Substance> can be multiplied by MassKg<SDenom>

export type UnitArray<U extends AnyUnit, O extends Origin<U> = Origin<U>> = {
  unit: U;
  items: O[];
};

export const sum = <N extends NumberUnit>(
  values: UnitArray<N>,
  baseOrigin?: BaseOrigin<N>,
): SummedOrigin<N> => {
  const baseOrDefault = baseOrigin || { valueType: 'intermediate' };
  return {
    originType: 'sum',
    from: values,
    unit: values.unit,
    ...baseOrDefault,
  };
};
