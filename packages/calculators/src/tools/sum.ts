import { Metadata, NumberContainer, SummedContainer } from './containers';
import { NumberUnit, VoidUnit, voidUnit } from './units';

// Extract the unit type from an origin (for preserving unit when summing)
export type ExtractOriginUnit<T> = T extends {
  unit: VoidUnit | (infer U extends NumberUnit);
}
  ? U
  : never;

// Sum function with type inference to preserve specific unit types
export function sum<U extends NumberContainer<NumberUnit>>(
  array: U[],
  baseOrigin?: Metadata,
): SummedContainer<ExtractOriginUnit<U>>;

export function sum<N extends NumberUnit, O extends NumberContainer<N>>(
  array: O[],
  baseOrigin?: Metadata,
): SummedContainer<N> {
  const rootUnit = array.length > 0 ? array[0].unit : voidUnit();
  const toAdd = array.length > 0 ? array.slice(1) : [];
  const unit = {
    ...rootUnit,
    store: toAdd.reduce(
      (acc, curr) => acc.plus(curr.unit.store),
      rootUnit.store,
    ),
  } as N;
  return new SummedContainer(unit, array, baseOrigin);
}
