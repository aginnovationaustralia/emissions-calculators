type Ok<T> = { readonly isOk: true; readonly isErr: false; readonly value: T };
type Err<E> = { readonly isOk: false; readonly isErr: true; readonly error: E };

export type Result<T, E> = Ok<T> | Err<E>;

// A simplified Result type for the FullCAM package. Based on the true-myth package.
export const Result = {
  ok<T>(value: T): Ok<T> {
    return { isOk: true, isErr: false, value };
  },

  err<E>(error: E): Err<E> {
    return { isOk: false, isErr: true, error };
  },
};
