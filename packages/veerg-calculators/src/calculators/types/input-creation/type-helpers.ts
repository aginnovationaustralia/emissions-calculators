// Type helpers for deriving the external input types from their parent types.

/** The type of key `K` on each member of `T` that has it, without `undefined`. */
export type Prop<T, K extends PropertyKey> = T extends unknown
  ? K extends keyof T
    ? Exclude<T[K], undefined>
    : never
  : never;

/** The element type of an array type. */
export type Item<T> = T extends readonly (infer U)[] ? U : never;
