import {
  BinaryOrigin,
  IntermediateOrNamedOrigin,
  TypedOrigin,
} from './origins';
import { NumberUnit } from './units';

export const subtract = <U extends NumberUnit>(
  left: TypedOrigin<U>,
  right: TypedOrigin<U>,
  baseOrigin?: IntermediateOrNamedOrigin,
): BinaryOrigin<U> => {
  const baseOrDefault = baseOrigin || { valueType: 'intermediate' };
  return {
    originType: 'binary',

    type: 'subtract',
    unit: {
      ...left.unit,
      value: left.unit.value.sub(right.unit.value),
    },
    left,
    right,
    ...baseOrDefault,
  };
};
