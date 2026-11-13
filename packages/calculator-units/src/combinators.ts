/*
 * Functions that build containers from other containers. Each takes the unit system of the
 * containers it is given, so none of them needs a system passed in.
 */
import {
  algebraOf,
  AnyContainer,
  Container,
  createNode,
  Method,
  RuleSet,
} from './container.js';
import type { Metadata } from './metadata.js';
import {
  AnyUnit,
  BooleanUnit,
  isVoid,
  NumberUnit,
  RealNumber,
  StringUnit,
  VoidUnit,
} from './units.js';
import { mergeSeeds, ValueStore } from './value-store.js';

// True when T is a union, e.g. the unit inferred from an array of `Mass<'CO2'>` and `Mass<'CH4'>`
type IsUnion<T, All = T> = T extends unknown
  ? [All] extends [T]
    ? false
    : true
  : never;

/** Shown in place of the fallback's type when the items of a sum have different units. */
export type MixedUnitsError =
  'Error: every item in a sum must have the same unit';

type NumberContainer = AnyContainer & { unit: NumberUnit };

type UnitOf<C extends AnyContainer> = C['unit'];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RulesOf<C> = C extends Container<any, infer RS, any> ? RS : never;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MethodsOf<C> = C extends Container<any, any, infer M> ? M : never;

/**
 * Adds up containers of the same unit. `fallback` is the value of an empty sum and must be a zero
 * of the summed unit (e.g. a zero mass of CO2e), so an empty list still has a real unit.
 */
export function sum<C extends NumberContainer>(
  items: C[],
  fallback: true extends IsUnion<UnitOf<C>>
    ? MixedUnitsError
    : Container<NoInfer<UnitOf<C>>, RulesOf<C>, MethodsOf<C>>,
  meta?: Metadata,
): Container<UnitOf<C>, RulesOf<C>, MethodsOf<C>>;

/** For callers generic over the unit, where the item unit can't be resolved. */
export function sum<U extends NumberUnit, RS extends RuleSet, M extends Method>(
  items: Container<U, RS, M>[],
  fallback: Container<NoInfer<U>, NoInfer<RS>, NoInfer<M>>,
  meta?: Metadata,
): Container<U, RS, M>;

export function sum(
  items: AnyContainer[],
  fallback: AnyContainer | MixedUnitsError,
  meta?: Metadata,
): AnyContainer {
  // The overloads only let a MixedUnitsError through for a call that fails to compile, and only
  // let number containers through
  const zero = fallback as NumberContainer;
  const algebra = algebraOf(zero);
  // The unit comes from the items, so a fallback of a different substance can't relabel them. The
  // fallback's unit is only used when there are no items.
  const numbers = items as NumberContainer[];
  const real = numbers.filter((item) => !isVoid(item.unit));
  const unit = real.reduce<NumberUnit>(
    (acc, item) => algebra.additive(acc, item.unit),
    real[0]?.unit ?? zero.unit,
  );
  const store = numbers.reduce(
    (acc, item) => acc.plus(item.unit.store),
    zero.unit.store,
  );
  return createNode(
    algebra,
    { ...unit, store },
    { kind: 'sum', from: items },
    meta,
  );
}

/** Groups a value for display as `( inner )`. The value and unit are unchanged. */
export const br = <U extends AnyUnit, RS extends RuleSet, M extends Method>(
  inner: Container<U, RS, M>,
): Container<U, RS, M> =>
  createNode(algebraOf(inner), inner.unit, {
    kind: 'bracketed',
    inner,
  });

/**
 * A container holding `unit`, recorded as derived from `from`. Use it when a value is converted
 * in a way no rule describes, e.g. a string input mapped to a number.
 */
export const translate = <
  TOut extends AnyUnit,
  TIn extends AnyUnit,
  RS extends RuleSet,
  M extends Method,
>(
  unit: TOut,
  from: Container<TIn, RS, M>,
  meta?: Metadata,
): Container<TOut, RS, M> =>
  createNode(algebraOf(from), unit, { kind: 'translation', from }, meta);

/**
 * Combines a method 1 value with an optional method 2 value:
 *
 * - no method 2 value: the method 1 container, unchanged
 * - method 1 is void (only method 2 can calculate it): a method2 container
 * - both: a method1and2 container, whose store has method 1's method 1 track and method 2's value
 *   as its method 2 track. Both branches are kept for provenance.
 */
export function captureMethod1Or2Value<
  U extends NumberUnit,
  RS extends RuleSet,
  M extends Method,
>(method1: VoidUnit, method2: Container<U, RS, M>): Container<U, RS, M>;
export function captureMethod1Or2Value<
  U extends NumberUnit,
  RS extends RuleSet,
  M extends Method,
>(
  method1: Container<U, RS, M>,
  method2: Container<U, RS, M> | undefined,
): Container<U, RS, M>;
export function captureMethod1Or2Value<
  U extends NumberUnit,
  RS extends RuleSet,
  M extends Method,
>(
  method1: Container<U, RS, M> | VoidUnit,
  method2: Container<U, RS, M> | undefined,
): Container<U, RS, M> {
  if (method2 === undefined) {
    return method1 as Container<U, RS, M>;
  }
  if ('__unitType' in method1 && isVoid(method1)) {
    return createNode(
      algebraOf(method2),
      {
        ...method2.unit,
        store: new ValueStore({ valueMethod2: method2.unit.store.value }),
      },
      { kind: 'method2', method2 },
    );
  }
  const m1 = method1;
  return createNode(
    algebraOf(method2),
    {
      ...method2.unit,
      store: new ValueStore(mergeSeeds(m1.unit.store, method2.unit.store)),
    },
    { kind: 'method1and2', method1: m1, method2 },
  );
}

/** Picks one of `cases` by the value of a string container. */
export const selectSwitch = <
  S extends StringUnit,
  U extends NumberUnit,
  RS extends RuleSet,
  M extends Method,
>(
  subject: Container<S, RS, M>,
  cases: Record<S, Container<U, RS, M>>,
  meta?: Metadata,
): Container<U, RS, M> => {
  const selected = cases[subject.unit];
  return createNode(
    algebraOf(selected),
    selected.unit,
    { kind: 'switch', subject, selected },
    meta,
  );
};

/** Picks `whenTrue` or `whenFalse` by the value of a boolean container. */
export const ifTrueElse = <
  U extends NumberUnit,
  RS extends RuleSet,
  M extends Method,
>(
  condition: Container<BooleanUnit, RS, M>,
  whenTrue: Container<U, RS, M>,
  whenFalse: Container<U, RS, M>,
  meta?: Metadata,
): Container<U, RS, M> => {
  const selected = condition.unit ? whenTrue : whenFalse;
  return createNode(
    algebraOf(selected),
    selected.unit,
    { kind: 'if_else', condition, selected, whenTrue, whenFalse },
    meta,
  );
};

/** The smaller of two values. A thin wrapper around `Container.min` that reads better inline. */
export const min = <U extends NumberUnit, RS extends RuleSet, M extends Method>(
  value: Container<U, RS, M>,
  limit: Container<U | RealNumber, RS, M>,
): Container<U, RS, M> => value.min(limit as never);

/** The larger of two values. A thin wrapper around `Container.max` that reads better inline. */
export const max = <U extends NumberUnit, RS extends RuleSet, M extends Method>(
  value: Container<U, RS, M>,
  limit: Container<U | RealNumber, RS, M>,
): Container<U, RS, M> => value.max(limit as never);
