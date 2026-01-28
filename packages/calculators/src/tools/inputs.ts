import { RootContainer } from './origins';
import { AnyUnit } from './units';

export const input = <T extends AnyUnit>(
  name: string,
  value: T,
): RootContainer<T> => {
  return new RootContainer(value, { valueType: 'input', name });
};
