import { rootOrigin, RootOrigin } from './origins';
import { AnyUnit } from './values';

// export interface Input<T extends AnyUnit> extends HasValue<T>, HasMetadata {
//   valueType: 'input';
// }
// export const input = <T extends AnyUnit>(
//   name: string,
//   value: T,
//   metadata?: ValueMetadata,
// ): Input<T> => {
//   return { valueType: 'input', name, value, metadata };
// };

// export interface Input<T extends AnyUnit> extends HasValue<T>, HasMetadata {
//   valueType: 'input';
// }
export const input = <T extends AnyUnit>(
  name: string,
  value: T,
  //   metadata?: ValueMetadata,
): RootOrigin<T> => {
  return rootOrigin({ valueType: 'input', name, unit: value });
};
