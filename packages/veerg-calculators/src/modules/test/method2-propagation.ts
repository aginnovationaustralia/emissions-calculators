import { ValueStore } from '@/tools/value-store';

export type Method2Case<TInput> = {
  name: string;
  /** Apply exactly one optional method-2 leaf (or a small related set). */
  apply: (base: TInput) => TInput;
};

type HasValueStore = {
  unit: { store: ValueStore };
};

type DescribeMethod2PropagationOptions<
  TRaw,
  TParsed,
  TResult extends HasValueStore,
> = {
  name: string;
  buildBase: () => TRaw;
  parse: (raw: TRaw) => TParsed;
  run: (parsed: TParsed) => TResult;
  cases: Method2Case<TRaw>[];
};

const method1Value = (store: ValueStore) => {
  const valueMethod1 = store.valueMethod1;
  expect(store.hasMethod1()).toBe(true);
  expect(valueMethod1).toBeDefined();
  return valueMethod1!.toNumber();
};

const assertMethod1Only = (store: ValueStore) => {
  expect(store.hasMethod2()).toBe(false);
  expect(store.valueMethod2).toBeUndefined();
  expect(store.value.toNumber()).toBe(method1Value(store));
};

const assertMethod2Propagated = (
  store: ValueStore,
  method1OnlyStore: ValueStore,
) => {
  expect(store.hasMethod2()).toBe(true);
  expect(store.valueMethod2).toBeDefined();
  expect(method1Value(store)).toBe(method1Value(method1OnlyStore));
  expect(store.value.toNumber()).toBe(store.valueMethod2!.toNumber());
  expect(store.valueMethod2!.toNumber()).not.toBe(method1Value(store));
};

/**
 * Table-driven blackbox checks that each optional method-2 input flips the
 * module result's ValueStore to a dual track while preserving method 1.
 */
export const describeMethod2Propagation = <
  TRaw,
  TParsed,
  TResult extends HasValueStore,
>({
  name,
  buildBase,
  parse,
  run,
  cases,
}: DescribeMethod2PropagationOptions<TRaw, TParsed, TResult>) => {
  describe(name, () => {
    const baseRaw = buildBase();
    const method1Only = run(parse(baseRaw));
    const method1Store = method1Only.unit.store;

    it('method-1-only inputs leave the result on method 1', () => {
      assertMethod1Only(method1Store);
    });

    for (const method2Case of cases) {
      it(`${method2Case.name} populates a distinct method-2 track`, () => {
        const withMethod2 = run(parse(method2Case.apply(baseRaw)));
        assertMethod2Propagated(withMethod2.unit.store, method1Store);
      });
    }
  });
};
