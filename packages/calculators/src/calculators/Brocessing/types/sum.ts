import { BaseOrigin, SummedOrigin } from './origins';
import { NumberUnit, UnitArray } from './overloads';

export const sum = <N extends NumberUnit>(
  array: UnitArray<N>,
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
