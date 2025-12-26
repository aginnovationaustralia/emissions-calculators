import { entriesFromObject } from '@/calculators/common/tools/object';
import Decimal from 'decimal.js-light';
import { HasMetadata, ValueMetadata } from './metadata';
import { evaluate, Origin } from './origins';
import { NumberUnit } from './overloads';
import { DecimalValue } from './values';

type HasDecimalValue = {
  value: Decimal;
};
export interface Output<Scope extends 1 | 2 | 3>
  extends HasMetadata,
    HasDecimalValue {
  name: string;
  scope: Scope;
  from: Origin<NumberUnit>;
}

export const output = <Scope extends 2 | 3>(
  name: string,
  scope: Scope,
  from: Origin<NumberUnit>,
  metadata?: ValueMetadata,
): Output<Scope> => {
  return { name, scope, value: evaluate(from), from, metadata };
};

export interface Scope1Output<S = 'CO2' | 'CH4' | 'N2O'> extends Output<1> {
  gas: S;
}
export const scope1Output = <S = 'CO2' | 'CH4' | 'N2O'>(
  name: string,
  from: Origin<NumberUnit>,
  gas: S,
): Scope1Output<S> => {
  return {
    name,
    scope: 1,
    gas,
    value: evaluate(from),
    from,
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
