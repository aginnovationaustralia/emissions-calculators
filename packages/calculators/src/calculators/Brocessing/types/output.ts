import { entriesFromObject } from '@/calculators/common/tools/object';
import { HasMetadata, ValueMetadata } from './metadata';
import { DecimalValue } from './values';

export interface Output<
  Scope extends 1 | 2 | 3,
  //   L extends NumberUnit,
  //   K extends keyof L & string,
  //   R extends NumberUnit,
> extends HasMetadata,
    DecimalValue {
  name: string;
  scope: Scope;
  //   value: MassKg<'CO2'>;
  from: DecimalValue; // Variable<L, K, R, MethodReturnType<L, K, MassKg<'CO2'>>>;
}

export const output = <
  Scope extends 2 | 3,
  //   L extends NumberUnit,
  //   K extends keyof L & string,
  //   R extends NumberUnit,
>(
  name: string,
  scope: Scope,
  from: DecimalValue, // Variable<L, K, R, MethodReturnType<L, K, MassKg<'CO2'>>>,
  metadata?: ValueMetadata,
): Output<Scope> => {
  return { name, scope, value: from.value, from, metadata };
};

export interface Scope1Output<
  //   L extends NumberUnit,
  //   K extends keyof L & string,
  //   R extends NumberUnit,
  S = 'CO2' | 'CH4' | 'N2O',
> extends Output<1> {
  gas: S;
}
export const scope1Output = <
  //   O extends MassKg<'CO2'>,
  //   L extends NumberUnit,
  //   K extends keyof L & string,
  //   R extends NumberUnit,
  S = 'CO2' | 'CH4' | 'N2O',
>(
  name: string,
  from: DecimalValue,
  gas: S,
): Scope1Output<S> => {
  return {
    name,
    scope: 1,
    gas,
    value: from.value,
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
