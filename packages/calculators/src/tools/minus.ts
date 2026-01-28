import { TypedOrigin } from './origins';
import { NumberUnit } from './units';

export function minus<T extends NumberUnit, O extends TypedOrigin<T>>(
  origin: O,
): O {
  return {
    ...origin,
    unit: {
      ...origin.unit,
      value: origin.unit.value.negated(),
    },
  };
}
