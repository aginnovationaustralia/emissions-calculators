import {
  additiveUnit,
  Metadata,
  NumberContainer,
  SummedContainer,
} from './containers';
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
  // The unit is chosen across every item with the same rule as `plus`, rather than taken from the
  // first item: the first item may itself be an empty (void) sum, e.g. an enterprise element with
  // no applications, and its void unit would otherwise make the whole total read as zero.
  const unit: NumberUnit = {
    ...array.reduce<NumberUnit>(
      (acc, curr) => additiveUnit(acc, curr.unit, 'add'),
      voidUnit(),
    ),
    store: rest.reduce(
      (acc, curr) => acc.plus(curr.unit.store),
      first ? first.unit.store : voidUnit().store,
    ),
  };
  return new SummedContainer(unit, array, baseOrigin);
}
