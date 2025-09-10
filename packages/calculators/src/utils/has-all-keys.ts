/* eslint-disable @typescript-eslint/no-explicit-any */
type UnionToParm<U> = U extends any ? (k: U) => void : never;
type UnionToSect<U> = UnionToParm<U> extends (k: infer I) => void ? I : never;
type ExtractParm<F> = F extends { (a: infer A): void } ? A : never;

type ExtractOne<Union> = ExtractParm<UnionToSect<UnionToParm<Union>>>;
type SpliceOne<Union> = Exclude<Union, ExtractOne<Union>>;

type SortTuple<T extends readonly any[]> = T extends []
  ? []
  : T extends [infer F, ...infer R]
  ? [F, ...SortTuple<Extract<R, readonly any[]>>]
  : never;

type ToTupleRec<Union, Rslt extends any[]> = SpliceOne<Union> extends never
  ? SortTuple<[ExtractOne<Union>, ...Rslt]>
  : ToTupleRec<SpliceOne<Union>, [ExtractOne<Union>, ...Rslt]>;

/**
 * Extract the keys from a class type and ensure every key is present in an array of strings.
 * NOTE: The ordering is sometimes unstable and may give false TS errors.
 */
export type HasAllKeys<Union> = ToTupleRec<keyof Union, []>;
