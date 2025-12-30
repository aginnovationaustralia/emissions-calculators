import { BaseOrigin, Origin, SummedOrigin } from './origins';
import { AnyUnit, NumberUnit } from './units';

export type UnitArray<U extends AnyUnit, O extends Origin<U> = Origin<U>> = {
  unit: U;
  items: O[];
};

export const sum = <N extends NumberUnit, O extends Origin<N>>(
  array: UnitArray<N, O>,
  baseOrigin?: BaseOrigin<N>,
): SummedOrigin<N> => {
  const baseOrDefault = baseOrigin || { valueType: 'intermediate' };
  return {
    originType: 'sum',
    from: array,
    unit: array.unit,
    ...baseOrDefault,
  };
};
