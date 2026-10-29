import { Metadata, NumberContainer, SummedContainer } from './containers';
import { VoidUnit, voidUnit } from './units';
import { AnyNumberUnit } from './generic';

// Extract the unit type from an origin (for preserving unit when summing)
export type ExtractOriginUnit<T> = T extends {
  unit: VoidUnit | (infer U extends AnyNumberUnit);
}
  ? U
  : never;

// Sum function with type inference to preserve specific unit types.
// NOTE: an empty array sums to a void unit at runtime, which this signature does not reflect.
// Anything that consumes a sum must therefore handle void, as `plus`, `minus` and `output` do.
export function sum<U extends NumberContainer<AnyNumberUnit>>(
  array: U[],
  baseOrigin?: Metadata,
): SummedContainer<ExtractOriginUnit<U>>;

export function sum(
  array: NumberContainer<AnyNumberUnit>[],
  baseOrigin?: Metadata,
): SummedContainer<AnyNumberUnit> {
  const [first, ...rest] = array;
  const rootUnit: AnyNumberUnit = first ? first.unit : voidUnit();
  const unit: AnyNumberUnit = {
    ...rootUnit,
    store: rest.reduce(
      (acc, curr) => acc.plus(curr.unit.store),
      rootUnit.store,
    ),
  };
  return new SummedContainer(unit, array, baseOrigin);
}
