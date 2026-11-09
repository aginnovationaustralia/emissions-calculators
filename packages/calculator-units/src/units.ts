import Decimal from 'decimal.js-light';
import { values, ValueStore } from './value-store.js';

/**
 * Any number unit: a descriptor whose `__unitType` names it, plus the value it holds in `store`.
 * Other fields (usually substances) distinguish units of the same type, e.g.
 * `{ __unitType: 'Mass', substance: 'CO2', store }`.
 *
 * Rules only look at the descriptor fields. Operations compute the store of the result themselves,
 * so a rule never has to deal with values.
 */
export type NumberUnit = { __unitType: string; store: ValueStore };

/** A string value, e.g. a selected fertiliser type. The unit is the string itself. */
export type StringUnit<V extends string = string> = V;

/** A boolean value, e.g. whether an option applies. The unit is the boolean itself. */
export type BooleanUnit = boolean;

export type AnyUnit = NumberUnit | StringUnit | BooleanUnit;

/** A value that can be given to a unit constructor. */
export type InitialValue = number | Decimal | ValueStore;

/** The dimensionless unit. Always available: the built-in scaling rules depend on it. */
export type RealNumber = { __unitType: 'RealNumber'; store: ValueStore };

export const realNumber = (initialValue?: InitialValue): RealNumber => ({
  __unitType: 'RealNumber',
  store: values(initialValue),
});

/** A RealNumber from a percentage, e.g. `percentage(15)` holds 0.15. */
export const percentage = (initialValue?: number | Decimal): RealNumber =>
  realNumber(initialValue ? new Decimal(initialValue).div(100) : 0);

/**
 * Marks a value that can't be calculated, e.g. the method 1 value of something only method 2 can
 * calculate. See `captureMethod1Or2Value`. Arithmetic involving a void value is void.
 */
export type VoidUnit = { __unitType: 'Void'; store: ValueStore };

export const voidUnit = (): VoidUnit => ({
  __unitType: 'Void',
  store: values(0),
});

export const isNumberUnit = (unit: AnyUnit): unit is NumberUnit =>
  typeof unit === 'object' && '__unitType' in unit;

export const isStringUnit = (unit: AnyUnit): unit is StringUnit =>
  typeof unit === 'string';

export const isBooleanUnit = (unit: AnyUnit): unit is BooleanUnit =>
  typeof unit === 'boolean';

export const isRealNumber = (unit: AnyUnit): unit is RealNumber =>
  isNumberUnit(unit) && unit.__unitType === 'RealNumber';

export const isVoid = (unit: AnyUnit): unit is VoidUnit =>
  isNumberUnit(unit) && unit.__unitType === 'Void';

/** True when both units have the same type and descriptor fields. Values are not compared. */
export const sameUnit = (left: NumberUnit, right: NumberUnit) => {
  const l = left as Record<string, unknown>;
  const r = right as Record<string, unknown>;
  const keys = Object.keys(l).filter((k) => k !== 'store');
  return (
    keys.length === Object.keys(r).filter((k) => k !== 'store').length &&
    keys.every((k) => l[k] === r[k])
  );
};

/** The unit's descriptor as JSON, without its value. */
export const describeUnit = (unit: AnyUnit) => {
  if (!isNumberUnit(unit)) {
    return JSON.stringify(unit);
  }
  const { store: _store, ...descriptor } = unit;
  return JSON.stringify(descriptor);
};
