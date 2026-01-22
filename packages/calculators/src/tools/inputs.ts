import { rootOrigin, RootOrigin } from './origins';
import { AnyUnit } from './units';

export const input = <T extends AnyUnit>(
  name: string,
  value: T,
  //   metadata?: ValueMetadata,
): RootOrigin<T> => {
  return rootOrigin(value, { valueType: 'input', name });
};
