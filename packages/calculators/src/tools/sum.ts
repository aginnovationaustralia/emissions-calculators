import {
  additiveUnit,
  Container,
  Metadata,
  NumberContainer,
  SummedContainer,
} from './containers';
import { NumberUnit, VoidUnit } from './units';

// Extract the unit type from an origin (for preserving unit when summing)
export type ExtractOriginUnit<T> = T extends {
  unit: VoidUnit | (infer U extends NumberUnit);
}
  ? U
  : never;

// Sum function with type inference to preserve specific unit types.
// `fallback` is the value of an empty sum, and must be a zero of the summed unit, e.g. `zeroN2O`,
// since it is the base case every item is added to. It is required so that an empty list
// still carries a real unit (and e.g. the gas of a Mass), rather than a void unit that would
// otherwise reach an output and be reported under the wrong gas.
export function sum<U extends NumberContainer<NumberUnit>>(
  array: U[],
  fallback: Container<NoInfer<ExtractOriginUnit<U>>>,
  baseOrigin?: Metadata,
): SummedContainer<ExtractOriginUnit<U>>;

// For callers generic over the unit, where `ExtractOriginUnit` cannot be resolved
export function sum<N extends NumberUnit>(
  array: Container<N>[],
  fallback: Container<NoInfer<N>>,
  baseOrigin?: Metadata,
): SummedContainer<N>;

export function sum(
  array: NumberContainer<NumberUnit>[],
  fallback: Container<NumberUnit>,
  baseOrigin?: Metadata,
): SummedContainer<NumberUnit> {
  // The unit is chosen across every item with the same rule as `plus`, so a void item cannot erase
  // it. Each item is the left side, so the fallback only decides the unit when no item has a real
  // one of its own: `additiveUnit` does not compare substances, and a mismatched fallback must not
  // relabel the items' gas.
  const unit = array.reduce<NumberUnit>(
    (acc, curr) => ({
      ...additiveUnit(curr.unit, acc, 'add'),
      store: acc.store.plus(curr.unit.store),
    }),
    fallback.unit,
  );
  return new SummedContainer(unit, array, baseOrigin);
}
