import { rootOrigin, RootOrigin } from './origins';
import { AnyUnit } from './overloads';

export const input = <T extends AnyUnit>(
  name: string,
  value: T,
  //   metadata?: ValueMetadata,
): RootOrigin<T> => {
  return rootOrigin({ valueType: 'input', name, unit: value });
};
