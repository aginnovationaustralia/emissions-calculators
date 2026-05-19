import { TypedContainer } from './containers';
import { NumberUnit } from './units';

export function minus<T extends NumberUnit, O extends TypedContainer<T>>(
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
