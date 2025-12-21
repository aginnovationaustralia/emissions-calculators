import { HasValue } from './constants';
import { ValueMetadata } from './metadata';
import { BinaryMethodReturnType, binaryOperation } from './operations';
import { CanMultiply, NumberUnit } from './values';
import { variable, Variable } from './variable';

export function multiply<
  R extends NumberUnit,
  // eslint-disable-next-line no-use-before-define
  L extends CanMultiply<R, O> & NumberUnit,
  O extends BinaryMethodReturnType<L, 'multiply', R>,
>(
  left: HasValue<L>,
  right: HasValue<R>,
  name: string,
  metadata?: ValueMetadata,
): Variable<L, 'multiply', R, O> {
  return variable(name, binaryOperation(left, right, 'multiply'), metadata);
}
