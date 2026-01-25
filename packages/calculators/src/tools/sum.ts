import { BaseOrigin, Origin, SummedOrigin, TypedOrigin } from './origins';
import { AnyUnit, NumberUnit, voidUnit } from './units';

export type UnitArray<U extends AnyUnit, O extends Origin<U> = Origin<U>> = {
  unit: U;
  items: O[];
};

// Extract the unit type from an origin (for preserving unit when summing)
type ExtractOriginUnit<T> = T extends { unit: infer U extends NumberUnit }
  ? U
  : never;

// Sum function with type inference to preserve specific unit types
export function sum<U extends TypedOrigin<NumberUnit>>(
  array: U[],
  baseOrigin?: BaseOrigin<ExtractOriginUnit<U>>,
): SummedOrigin<ExtractOriginUnit<U>>;

export function sum<N extends NumberUnit, O extends Origin<N>>(
  array: O[],
  baseOrigin?: BaseOrigin<N>,
): SummedOrigin<N> {
  const baseOrDefault = baseOrigin || { valueType: 'intermediate' };
  const unit = array.length > 0 ? array[0].unit : voidUnit();
  return {
    originType: 'sum',
    from: array,
    unit,
    ...baseOrDefault,
  };
}
