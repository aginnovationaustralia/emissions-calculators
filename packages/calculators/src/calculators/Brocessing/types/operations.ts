import { HasValue } from './constants';
import { NumberUnit } from './values';

export interface HasOperation<
  L extends NumberUnit,
  K extends keyof L & string,
  R extends NumberUnit,
  O extends NumberUnit & MethodReturnType<L, K, R>,
> {
  // eslint-disable-next-line no-use-before-define
  operation: Operation<L, K, R, O>;
}

export type BinaryMethodReturnType<L, K extends keyof L, R> = L[K] extends (
  other: R,
) => infer O
  ? O extends NumberUnit
    ? O
    : never
  : never;

export type BinaryOperation<
  L extends NumberUnit,
  K extends keyof L,
  R extends NumberUnit,
  O extends BinaryMethodReturnType<L, K, R>,
> = {
  left: HasValue<
    L & { [key in K]: (other: R) => BinaryMethodReturnType<L, K, R> }
  >;
  right: HasValue<R>;
  key: K;
  value: O;
};

export type TransformMethodReturnType<
  L,
  K extends keyof L,
> = L[K] extends () => infer O ? (O extends NumberUnit ? O : never) : never;

export type TransformOperation<
  L extends NumberUnit,
  K extends keyof L & string,
  O extends TransformMethodReturnType<L, K>,
> = {
  left: HasValue<L & { [key in K]: () => TransformMethodReturnType<L, K> }>;
  key: K;
  value: O;
};

export type MethodReturnType<L, K extends keyof L, R> =
  | BinaryMethodReturnType<L, K, R>
  | TransformMethodReturnType<L, K>;

export type Operation<
  L extends NumberUnit,
  K extends keyof L & string,
  R extends NumberUnit,
  O extends NumberUnit & MethodReturnType<L, K, R>,
> = BinaryOperation<L, K, R, O> | TransformOperation<L, K, O>;

export const operationIsBinary = <
  L extends NumberUnit,
  K extends keyof L & string,
  R extends NumberUnit,
  O extends NumberUnit & MethodReturnType<L, K, R>,
>(
  operation: Operation<L, K, R, O>,
): operation is BinaryOperation<L, K, R, O> => {
  return 'right' in operation;
};

export const binaryOperation = <
  L extends NumberUnit,
  K extends keyof L & string,
  R extends NumberUnit,
>(
  left: HasValue<
    L & { [key in K]: (other: R) => BinaryMethodReturnType<L, K, R> }
  >,
  right: HasValue<R>,
  key: K,
): BinaryOperation<L, K, R, BinaryMethodReturnType<L, K, R>> => {
  const val = left.value[key](right.value);
  return {
    left,
    right,
    key,
    value: val,
  };
};

export const transformOperation = <
  L extends NumberUnit,
  K extends keyof L & string,
>(
  left: HasValue<L & { [key in K]: () => TransformMethodReturnType<L, K> }>,
  key: K,
): TransformOperation<L, K, TransformMethodReturnType<L, K>> => {
  const val = left.value[key]();
  return {
    left,
    key,
    value: val,
  };
};
