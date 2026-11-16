/** Curried helper for Zod `.optional().transform(...)` so `undefined` is never passed to `fn`. */
export const mapOptional =
  <T, U>(fn: (value: T) => U) =>
  (value: T | undefined): U | undefined =>
    value === undefined ? undefined : fn(value);
