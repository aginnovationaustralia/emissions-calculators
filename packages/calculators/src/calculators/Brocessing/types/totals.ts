import { entriesFromObject } from '@/calculators/common/tools/object';
import Decimal from 'decimal.js-light';
import { Output } from './output';
import { DecimalValue } from './values';

export const addScope1Totals = <T extends Record<string, Output<1>>>(
  totals: T,
): T & {
  totalCH4: DecimalValue;
  totalCO2: DecimalValue;
  totalN2O: DecimalValue;
  total: DecimalValue;
} => {
  const scopeEntries = entriesFromObject(totals);

  // TODO should be filtering by substance type
  const totalCH4 = scopeEntries
    .filter(([key]) => typeof key === 'string' && key.endsWith('CH4'))
    .map(([_, value]) => value.value)
    .reduce((a, b) => a.add(b), new Decimal(0));
  const totalCO2 = scopeEntries
    .filter(([key]) => typeof key === 'string' && key.endsWith('CO2'))
    .map(([_, value]) => value.value)
    .reduce((a, b) => a.add(b), new Decimal(0));
  const totalN2O = scopeEntries
    .filter(([key]) => typeof key === 'string' && key.endsWith('N2O'))
    .map(([_, value]) => value.value)
    .reduce((a, b) => a.add(b), new Decimal(0));
  const total = totalCH4.add(totalCO2).add(totalN2O);

  return {
    ...totals,
    totalCH4: { value: () => totalCH4 },
    totalCO2: { value: () => totalCO2 },
    totalN2O: { value: () => totalN2O },
    total: { value: () => total },
  };
};

export const addScope23Totals = <T extends Record<string, Output<2 | 3>>>(
  totals: T,
): T & {
  total: DecimalValue;
} => {
  const scopeEntries = entriesFromObject(totals);

  const total = scopeEntries
    .map(([_, value]) => value.value)
    .reduce((a, b) => a.add(b), new Decimal(0));

  return {
    ...totals,
    total: { value: () => total },
  };
};

type ScopeTotals = {
  scope1: {
    total: DecimalValue;
  };
  scope2: {
    total: DecimalValue;
  };
  scope3: {
    total: DecimalValue;
  };
};

export const calculateNet = <T extends ScopeTotals>(
  totals: T,
  reductions: number[],
): { total: Decimal } => {
  return {
    total: totals.scope1.total
      .value()
      .add(totals.scope2.total.value())
      .add(totals.scope3.total.value())
      .sub(reductions.reduce((a, b) => a.add(new Decimal(b)), new Decimal(0))),
  };
};

type SummableOutputs<
  K1 extends string,
  K2 extends string,
  K3 extends string,
> = {
  scope1: Record<K1, Output<1>> & { total: DecimalValue };
  scope2: Record<K2, Output<2>> & { total: DecimalValue };
  scope3: Record<K3, Output<3>> & { total: DecimalValue };
};

export function addAcrossAllKeys<
  K extends string,
  T extends Record<K, Output<1 | 2 | 3>>,
>(obj1: T, obj2: T): T {
  return entriesFromObject(obj2).reduce(
    (acc, [k, v]) => ({ ...acc, [k]: v.value.add(acc[k].value) }),
    obj1,
  );
}
export const sumIntermediateResults = <
  K1 extends string,
  K2 extends string,
  K3 extends string,
  T extends SummableOutputs<K1, K2, K3>,
>(
  results: T[],
): T & { net: { total: Decimal } } => {
  const summed = results.reduce(
    (acc, curr) => {
      return {
        scope1: addAcrossAllKeys(acc.scope1, curr.scope1),
        scope2: addAcrossAllKeys(acc.scope2, curr.scope2),
        scope3: addAcrossAllKeys(acc.scope3, curr.scope3),
      };
    },
    {
      scope1: {} as Record<K1, Output<1>>,
      scope2: {} as Record<K2, Output<2>>,
      scope3: {} as Record<K3, Output<3>>,
    },
  ) as T;
  return {
    ...summed,
    net: {
      total: summed.scope1.total
        .value()
        .add(summed.scope2.total.value())
        .add(summed.scope3.total.value()),
    },
  };
};
