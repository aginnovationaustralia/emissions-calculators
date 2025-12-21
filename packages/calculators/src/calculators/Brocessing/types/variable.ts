import { HasNumberValue } from './constants';
import { HasMetadata, ValueMetadata } from './metadata';
import { HasOperation, MethodReturnType, Operation } from './operations';
import { NumberUnit } from './values';

export interface Variable<
  L extends NumberUnit,
  K extends keyof L & string,
  R extends NumberUnit,
  O extends NumberUnit & MethodReturnType<L, K, R>,
> extends HasNumberValue<O>,
    HasOperation<L, K, R, O>,
    HasMetadata {
  valueType: 'variable';
}
export const variable = <
  L extends NumberUnit,
  K extends keyof L & string,
  R extends NumberUnit,
  O extends NumberUnit & MethodReturnType<L, K, R>,
>(
  name: string,
  op: Operation<L, K, R, O>,
  metadata?: ValueMetadata,
): Variable<L, K, R, O> => {
  return {
    valueType: 'variable',
    name,
    operation: op,
    value: op.value,
    metadata,
  };
};
