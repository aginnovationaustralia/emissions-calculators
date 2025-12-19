import { entriesFromObject } from '@/calculators/common/tools/object';
import Decimal from 'decimal.js-light';
import { Output } from './output';
import { DecimalValue } from './values';

export const addTotals = <T extends Record<string, Output<1 | 2 | 3>>>(
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
    .map(([_, value]) => value.value())
    .reduce((a, b) => a.add(b), new Decimal(0));
  const totalCO2 = scopeEntries
    .filter(([key]) => typeof key === 'string' && key.endsWith('CO2'))
    .map(([_, value]) => value.value())
    .reduce((a, b) => a.add(b), new Decimal(0));
  const totalN2O = scopeEntries
    .filter(([key]) => typeof key === 'string' && key.endsWith('N2O'))
    .map(([_, value]) => value.value())
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
): { total: DecimalValue } => {
  return {
    total: totals.scope1.total
      .value()
      .add(totals.scope2.total.value())
      .add(totals.scope3.total.value())
      .sub(reductions.reduce((a, b) => a.add(new Decimal(b)), new Decimal(0))),
  };
};
