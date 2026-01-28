import Decimal from 'decimal.js-light';
import {
  IntermediateOrNamedOrigin,
  Origin,
  populateBaseOrigin,
  SummedOrigin,
  TypedOrigin,
} from './origins';
import { AnyUnit, NumberUnit, VoidUnit, voidUnit } from './units';

export type UnitArray<U extends AnyUnit, O extends Origin<U> = Origin<U>> = {
  unit: U;
  items: O[];
};

// Extract the unit type from an origin (for preserving unit when summing)
type ExtractOriginUnit<T> = T extends {
  unit: VoidUnit | (infer U extends NumberUnit);
}
  ? U
  : never;

// Sum function with type inference to preserve specific unit types
export function sum<U extends TypedOrigin<NumberUnit>>(
  array: U[],
  baseOrigin?: Partial<IntermediateOrNamedOrigin>,
): SummedOrigin<ExtractOriginUnit<U>>;

export function sum<N extends NumberUnit, O extends Origin<N>>(
  array: O[],
  baseOrigin?: Partial<IntermediateOrNamedOrigin>,
): SummedOrigin<N> {
  const baseOrDefault = populateBaseOrigin(baseOrigin);
  const inheritedUnit = array.length > 0 ? array[0].unit : voidUnit();
  const unit = {
    ...inheritedUnit,
    value: array.reduce(
      (acc, curr) => acc.add(curr.unit.value),
      new Decimal(0),
    ),
  };
  return {
    originType: 'sum',
    from: array,
    unit,
    ...baseOrDefault,
  };
}
