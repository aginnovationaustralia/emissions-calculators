import Decimal from 'decimal.js-light';
import { Metadata, SummedContainer, TypedContainer } from './containers';
import { NumberUnit, VoidUnit, voidUnit } from './units';

// Extract the unit type from an origin (for preserving unit when summing)
export type ExtractOriginUnit<T> = T extends {
  unit: VoidUnit | (infer U extends NumberUnit);
}
  ? U
  : never;

// Sum function with type inference to preserve specific unit types
export function sum<U extends TypedContainer<NumberUnit>>(
  array: U[],
  baseOrigin?: Metadata,
): SummedContainer<ExtractOriginUnit<U>>;

export function sum<N extends NumberUnit, O extends TypedContainer<N>>(
  array: O[],
  baseOrigin?: Metadata,
): SummedContainer<N> {
  const inheritedUnit = array.length > 0 ? array[0].unit : voidUnit();
  const unit = {
    ...inheritedUnit,
    value: array.reduce(
      (acc, curr) => acc.add(curr.unit.value),
      new Decimal(0),
    ),
  } as N;
  return new SummedContainer(unit, array, baseOrigin);
}
