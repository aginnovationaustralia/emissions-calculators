import { entriesFromObject } from '@/calculators/common/tools/object';
import Decimal from 'decimal.js-light';
import { HasMetadata, ValueMetadata } from './metadata';
import { evaluate, Origin } from './origins';
import { Mass } from './overloads';
import { DecimalValue } from './values';

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
  S extends 'CO2' | 'CH4' | 'N2O' | 'CO2e',
> extends HasMetadata,
    HasDecimalValue {
  amountCO2e: Decimal;
  name: string;
  scope: Scope;
  from: Origin<Mass<S>>;
}

export const output = <Scope extends 2 | 3, S extends 'CO2' | 'CO2e'>(
  name: string,
  scope: Scope,
  from: Origin<Mass<S>>,
  metadata?: ValueMetadata,
): Output<Scope, S> => {
  const gasAmountKg = evaluate(from);
  const gas = from.unit.substance;
  const amountCO2e = convertToCO2e(gasAmountKg, gas);
  return { name, scope, value: gasAmountKg, amountCO2e, from, metadata };
};

export interface Scope1Output<S extends 'CO2' | 'CH4' | 'N2O' | 'CO2e'>
  extends Output<1, S> {
  gas: S;
}
export const scope1Output = <S extends 'CO2' | 'CH4' | 'N2O' | 'CO2e'>(
  name: string,
  from: Origin<Mass<S>>,
): Scope1Output<S> => {
  const gasAmountKg = evaluate(from);
  const gas = from.unit.substance;
  const amountCO2e = convertToCO2e(gasAmountKg, gas);
  return {
    name,
    scope: 1,
    gas,
    value: gasAmountKg,
    amountCO2e,
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
