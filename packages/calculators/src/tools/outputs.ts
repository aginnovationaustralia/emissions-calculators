import { entriesFromObject } from '@/calculators/common/tools/object';
import Decimal from 'decimal.js-light';
import { HasMetadata, ValueMetadata } from './metadata';
import { Origin } from './origins';
import { AnyUnit, isVoid, mass, Mass, VoidUnit } from './units';
import { DecimalValue } from './values';

export const makeUnique = <T>(a: T[]): T[] => {
  return [...new Set(a)];
};

type HasDecimalValue = {
  value: Decimal;
};

const convertToCO2e = (
  gasAmountKg: Decimal,
  gas: 'CO2' | 'CH4' | 'N2O' | 'CO2e',
) => {
  if (gas === 'CH4') {
    return gasAmountKg.mul(new Decimal(28));
  } else if (gas === 'N2O') {
    return gasAmountKg.mul(new Decimal(265));
  }
  return gasAmountKg;
};

export interface Output<
  Scope extends 1 | 2 | 3,
  S extends 'CO2' | 'CH4' | 'N2O' | 'CO2e' = 'CO2' | 'CH4' | 'N2O' | 'CO2e',
>
  extends HasMetadata, HasDecimalValue {
  amountCO2e: Decimal;
  name: string;
  unit: Mass<S>;
  scope: Scope;
  from: Origin<Mass<S> | VoidUnit>;
  valueType: 'output';
  originType: 'unary';
  references: string[];
}

// TODO: Unify these 2 functions
export const output = <Scope extends 2 | 3, S extends 'CO2' | 'CO2e'>(
  name: string,
  scope: Scope,
  from: Origin<Mass<S> | VoidUnit>,
  metadata?: ValueMetadata,
): Output<Scope, S> => {
  const gasAmountKg = isVoid(from.unit) ? new Decimal(0) : from.unit.value;
  const gas = isVoid(from.unit) ? ('CO2' as S) : from.unit.substance;
  const amountCO2e = convertToCO2e(gasAmountKg, gas);
  return {
    valueType: 'output',
    originType: 'unary',
    name,
    scope,
    value: gasAmountKg,
    amountCO2e,
    from,
    metadata,
    unit: mass(gas),
    references: makeUnique(collectReferences(from)),
  };
};

export interface Scope1Output<
  S extends 'CO2' | 'CH4' | 'N2O' | 'CO2e',
> extends Output<1, S> {
  gas: S;
}
export const scope1Output = <S extends 'CO2' | 'CH4' | 'N2O' | 'CO2e'>(
  name: string,
  from: Origin<Mass<S> | VoidUnit>,
): Scope1Output<S> => {
  const gasAmountKg = isVoid(from.unit) ? new Decimal(0) : from.unit.value;
  const gas = isVoid(from.unit) ? ('CO2' as S) : from.unit.substance;
  const amountCO2e = convertToCO2e(gasAmountKg, gas);
  return {
    valueType: 'output',
    originType: 'unary',
    name,
    scope: 1,
    gas,
    value: gasAmountKg,
    amountCO2e,
    from,
    unit: mass(gas),
    references: makeUnique(collectReferences(from)),
  };
};

export const outputsToNumbers = <
  T extends Record<K, DecimalValue>,
  K extends keyof T & string,
>(
  t: T,
): Record<K, number> => {
  return entriesFromObject(t).map(([key, value]): [K, number] => [
    key as K,
    value.value().toNumber(),
  ]) as Record<K, number>;
};

export const collectReferences = <O extends Origin<AnyUnit>>(
  origin: O,
): string[] => {
  const baseResults =
    origin.valueType === 'intermediate' ? [] : (origin.references ?? []);
  switch (origin.originType) {
    case 'unary':
      return baseResults.concat(collectReferences(origin.from));
    case 'binary':
      return baseResults.concat(
        collectReferences(origin.left),
        collectReferences(origin.right),
      );
    case 'empty':
      return baseResults;
    case 'root':
      return baseResults;
    case 'sum':
      return baseResults.concat(origin.from.flatMap(collectReferences));
    case 'constant_selection':
      return baseResults.concat(
        origin.selectors
          .filter((s) => typeof s !== 'string')
          .flatMap(collectReferences),
      );
  }
};
