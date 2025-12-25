import Decimal from 'decimal.js-light';
import {
  BaseOrigin,
  BinaryOrigin,
  Origin,
  rootOrigin,
  RootOrigin,
  SummedOrigin,
  TypedOrigin,
} from './origins';
// import { KgPerKg, MassKg } from './values';

export type Substance = 'CO2' | 'CH4' | 'N2O' | 'CO2e' | 'Refrigerant';

type HasNumber = {
  value: Decimal;
};

type KgPerKg<SNum extends Substance, SDenom extends Substance> = HasNumber & {
  __unitType: 'KgCO2ePerKg';
  snum: SNum;
  sdenom: SDenom;
};
const kgPerKg = <SNum extends Substance, SDenom extends Substance>(
  snum: SNum,
  sdenom: SDenom,
  value: Decimal,
): KgPerKg<SNum, SDenom> => {
  return {
    __unitType: 'KgCO2ePerKg',
    snum,
    sdenom,
    value,
  };
};

export type KgCO2ePerKgRefrigerant = KgPerKg<'CO2e', 'Refrigerant'>;
export const kgCO2ePerKgRefrigerant = (
  value: Decimal,
): KgCO2ePerKgRefrigerant => {
  return kgPerKg('CO2e', 'Refrigerant', value);
};

const isKgPerKg = (unit: NumberUnit): unit is KgPerKg<Substance, Substance> => {
  return unit.__unitType === 'KgCO2ePerKg';
};

type MassKg<T extends Substance> = HasNumber & {
  __unitType: 'MassKg';
  substance: T;
};
export const massKg = <S extends Substance>(
  substance: S,
  value: Decimal,
): MassKg<S> => {
  return {
    __unitType: 'MassKg',
    substance,
    value,
  };
};
const isMassKg = (unit: NumberUnit): unit is MassKg<Substance> => {
  return unit.__unitType === 'MassKg';
};

export type NumberUnit = KgPerKg<Substance, Substance> | MassKg<Substance>;

export type StringUnit<V extends string = string> = V;

export type AnyUnit = NumberUnit | StringUnit;

// Use function overloading to define different units that can be multiplied
// For example, KgPerKg<SNum extends Substance, SDenom extends Substance> can be multiplied by MassKg<SDenom>

export function multiply<
  SNum extends Substance,
  SDenom extends Substance,
  UL extends TypedOrigin<KgPerKg<SNum, SDenom>>,
  UR extends TypedOrigin<MassKg<SDenom>>,
>(left: UL, right: UR, baseOrigin?: BaseOrigin): BinaryOrigin<MassKg<SNum>>;
export function multiply<UL extends NumberUnit, UR extends NumberUnit>(
  left: TypedOrigin<UL>,
  right: TypedOrigin<UR>,
  baseOrigin?: BaseOrigin,
): BinaryOrigin<NumberUnit> {
  const baseOrDefault = baseOrigin || { valueType: 'intermediate' };
  let unit: NumberUnit; // = new RealNumber(0);
  if (isKgPerKg(left.unit) && isMassKg(right.unit)) {
    unit = massKg(left.unit.snum, left.unit.value.mul(right.unit.value));
  }

  return {
    type: 'multiply',
    originType: 'binary',
    left,
    right,
    ...baseOrDefault,
    unit,
  };
}

export const sum = <N extends NumberUnit>(
  values: Origin<N>[],
  baseOrigin?: BaseOrigin,
): SummedOrigin<N> => {
  const baseOrDefault = baseOrigin || { valueType: 'intermediate' };
  const [first, ...rest] = values; // this can only be avoided with class based units
  return {
    type: 'sum',
    from: values,
    unit: values.reduce(
      (acc, curr) => acc.unit.value.add(curr.unit.value),
      first,
    ),
    ...baseOrDefault,
  };
};

export const input = <T extends AnyUnit>(
  name: string,
  value: T,
  //   metadata?: ValueMetadata,
): RootOrigin<T> => {
  return rootOrigin({ valueType: 'input', name, unit: value });
};
