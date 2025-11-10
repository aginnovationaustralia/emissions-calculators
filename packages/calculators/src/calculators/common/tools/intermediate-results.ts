import { addAcrossAllKeys } from './object';

export type SummableObject<V extends number | undefined = number | undefined> =
  Record<string, V>;

type SummableResult<
  V1 extends number | undefined,
  T1 extends SummableObject<V1>,
  V2 extends number | undefined,
  T2 extends SummableObject<V2>,
  V3 extends number | undefined,
  T3 extends SummableObject<V3>,
  VEx extends number | undefined,
  TEx extends SummableObject<VEx>,
> = {
  output: {
    scope1: T1;
    scope2: T2;
    scope3: T3;
  };
  extensions: TEx;
  meta?: {
    id: string;
  };
};

export function sumIntermediateResults<
  V1 extends number | undefined,
  T1 extends SummableObject<V1>,
  V2 extends number | undefined,
  T2 extends SummableObject<V2>,
  V3 extends number | undefined,
  T3 extends SummableObject<V3>,
  VEx extends number | undefined,
  TEx extends SummableObject<VEx>,
  T extends SummableResult<V1, T1, V2, T2, V3, T3, VEx, TEx>,
>(emptyInitial: T, results: T[]): T {
  return results.reduce<T>((acc, curr) => {
    const result: T = {
      ...acc,
      output: {
        scope1: addAcrossAllKeys(acc.output.scope1, curr.output.scope1),
        scope2: addAcrossAllKeys(acc.output.scope2, curr.output.scope2),
        scope3: addAcrossAllKeys(acc.output.scope3, curr.output.scope3),
      },
      extensions: addAcrossAllKeys(acc.extensions, curr.extensions),
    };
    return result;
  }, emptyInitial);
}
