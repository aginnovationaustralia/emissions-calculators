import Decimal from 'decimal.js-light';
import {
  IntermediateOrNamedOrigin,
  SummedContainer,
  TypedContainer,
} from './origins';
import { NumberUnit, VoidUnit, voidUnit } from './units';

// Extract the unit type from an origin (for preserving unit when summing)
type ExtractOriginUnit<T> = T extends {
  unit: VoidUnit | (infer U extends NumberUnit);
}
  ? U
  : never;

// Sum function with type inference to preserve specific unit types
export function sum<U extends TypedContainer<NumberUnit>>(
  array: U[],
  baseOrigin?: Partial<IntermediateOrNamedOrigin>,
): SummedContainer<ExtractOriginUnit<U>>;

export function sum<N extends NumberUnit, O extends TypedContainer<N>>(
  array: O[],
  baseOrigin?: Partial<IntermediateOrNamedOrigin>,
): SummedContainer<N> {
  // const baseOrDefault = populateBaseOrigin(baseOrigin);
  const inheritedUnit = array.length > 0 ? array[0].unit : voidUnit();
  const unit = {
    ...inheritedUnit,
    value: array.reduce(
      (acc, curr) => acc.add(curr.unit.value),
      new Decimal(0),
    ),
  };
  return new SummedContainer(unit, array, baseOrigin);
}
