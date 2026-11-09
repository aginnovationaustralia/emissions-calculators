/** Compile-time type equality, for tests. `check:types` enforces these; jest only transpiles. */
export type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

export const expectType = <T extends true>(_: T) => _;
