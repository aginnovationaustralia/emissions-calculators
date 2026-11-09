import {
  additiveUnit,
  Container,
  Metadata,
  NumberContainer,
  SummedContainer,
} from './containers';
import { isVoid, NumberUnit, VoidUnit, voidUnit } from './units';

// Extract the unit type from an origin (for preserving unit when summing)
export type ExtractOriginUnit<T> = T extends {
  unit: VoidUnit | (infer U extends NumberUnit);
}
  ? U
  : never;

// True when T is a union, e.g. the unit inferred from an array of `Mass<'CO2'>` and `Mass<'CH4'>`
type IsUnion<T, All = T> = T extends unknown
  ? [All] extends [T]
    ? false
    : true
  : never;

// Shown in place of the fallback's type when the items of a sum have different units
type MixedUnitsError = 'Error: every item in a sum must have the same unit';

// Sum function with type inference to preserve specific unit types. Every item must have the same
// unit, which is checked through `fallback`.
// `fallback` is the value of an empty sum, and must be a zero of the summed unit, e.g. `zeroN2O`,
// since it is the base case every item is added to. It is required so that an empty list
// still carries a real unit (and e.g. the gas of a Mass), rather than a void unit that would
// otherwise reach an output and be reported under the wrong gas.
export function sum<U extends NumberContainer<NumberUnit>>(
  array: U[],
  fallback: true extends IsUnion<ExtractOriginUnit<U>>
    ? MixedUnitsError
    : Container<NoInfer<ExtractOriginUnit<U>>>,
  baseOrigin?: Metadata,
): SummedContainer<ExtractOriginUnit<U>>;

// For callers generic over the unit, where `ExtractOriginUnit` cannot be resolved
export function sum<N extends NumberUnit>(
  array: (NumberContainer<N> | Container<N>)[],
  fallback: Container<NoInfer<N>>,
  baseOrigin?: Metadata,
): SummedContainer<N>;

export function sum(
  array: (NumberContainer<NumberUnit> | Container<NumberUnit>)[],
  fallback: Container<NumberUnit> | MixedUnitsError,
  baseOrigin?: Metadata,
): SummedContainer<NumberUnit> {
  // The overloads only let a MixedUnitsError through for a call that fails to compile
  const fallbackUnit = (fallback as Container<NumberUnit>).unit;
  // The unit is chosen across the items with the same rule as `plus`, so the first real unit wins
  // and a void item cannot erase it. The fallback's unit is only used when no item has one, e.g. an
  // empty array: `additiveUnit` does not compare substances, so a fallback of a different gas must
  // not relabel the items.
  const itemsUnit = array.reduce<NumberUnit>(
    (acc, curr) => additiveUnit(acc, curr.unit, 'add'),
    voidUnit(),
  );
  const store = array.reduce(
    (acc, curr) => acc.plus(curr.unit.store),
    fallbackUnit.store,
  );
  const unit = isVoid(itemsUnit) ? fallbackUnit : itemsUnit;
  return new SummedContainer({ ...unit, store }, array, baseOrigin);
}
