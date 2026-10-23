import { Metadata, NumberContainer, SummedContainer } from './containers';
import { NumberUnit, VoidUnit, voidUnit } from './units';

// Extract the unit type from an origin (for preserving unit when summing)
export type ExtractOriginUnit<T> = T extends {
  unit: VoidUnit | (infer U extends NumberUnit);
}
  ? U
  : never;

// Sum function with type inference to preserve specific unit types.
// NOTE: an empty array sums to a void unit at runtime, which this signature does not reflect.
// Anything that consumes a sum must therefore handle void, as `plus`, `minus` and `output` do.
export function sum<U extends NumberContainer<NumberUnit>>(
  array: U[],
  baseOrigin?: Metadata,
): SummedContainer<ExtractOriginUnit<U>>;

export function sum(
  array: NumberContainer<NumberUnit>[],
  baseOrigin?: Metadata,
): SummedContainer<NumberUnit> {
  const [first, ...rest] = array;
  const rootUnit: NumberUnit = first ? first.unit : voidUnit();
  const unit: NumberUnit = {
    ...rootUnit,
    store: rest.reduce(
      (acc, curr) => acc.plus(curr.unit.store),
      rootUnit.store,
    ),
  };
  return new SummedContainer(unit, array, baseOrigin);
}
