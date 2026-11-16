import type { Metadata } from './metadata.js';
import type {
  AdditiveResult,
  AdditiveRight,
  LimitRight,
  ResultOf,
  RightOf,
  RuleType,
} from './rules.js';
import { UnitError } from './errors.js';
import {
  AnyUnit,
  describeUnit,
  isNumberUnit,
  isVoid,
  NumberUnit,
  RealNumber,
  realNumber,
  voidUnit,
} from './units.js';

/** The type-level rules a unit system was built with. */
export type RuleSet = { multiply: RuleType; divide: RuleType };

/**
 * The calculation method a user supplied value is for. Method 1 is the default calculation; methods
 * 2 to 4 are alternatives, e.g. from more specific data. Consumers use the subset their domain has:
 * the VEERG calculators use methods 1 and 2, NGERS uses 1 to 4.
 */
export type Method = '1' | '2' | '3' | '4';

export type BinaryOperation =
  'add' | 'subtract' | 'multiply' | 'divide' | 'power' | 'min' | 'max';

/**
 * Any container, seen only as a record of how its value was calculated. Use this for code that
 * walks or reports on calculations (see `childrenOf`), which doesn't need to do arithmetic.
 */
export interface AnyContainer<M extends Method = Method> {
  readonly unit: AnyUnit;
  readonly origin: Origin<M>;
  readonly meta: Metadata;
}

/** How a container's value was produced, and from which other containers. */
export type Origin<M extends Method = Method> =
  /** A value given directly, e.g. a constant. */
  | { kind: 'root' }
  /** A value supplied by the user, and the method it is for. */
  | { kind: 'input'; method: M }
  | {
      kind: 'binary';
      operation: BinaryOperation;
      left: AnyContainer<M>;
      right: AnyContainer<M>;
    }
  | { kind: 'sum'; from: AnyContainer<M>[] }
  /** A value looked up from a table, by literal keys or by string containers. */
  | { kind: 'selection'; selectors: (AnyContainer<M> | string)[] }
  /** The same value, grouped for display as `( inner )`. */
  | { kind: 'bracketed'; inner: AnyContainer<M> }
  /** A value in a different unit, derived from another, e.g. a mass relabelled to a new substance. */
  | { kind: 'translation'; from: AnyContainer<M> }
  /** A method 1 value, and the method 2 value that overrides it if one was supplied. */
  | {
      kind: 'method1and2';
      method1: AnyContainer<M>;
      method2: AnyContainer<M> | undefined;
    }
  /** A value only method 2 can calculate. */
  | { kind: 'method2'; method2: AnyContainer<M> }
  /** One of several cases, chosen by a string value. */
  | { kind: 'switch'; subject: AnyContainer<M>; selected: AnyContainer<M> }
  /** One of two values, chosen by a boolean. */
  | {
      kind: 'if_else';
      condition: AnyContainer<M>;
      selected: AnyContainer<M>;
      whenTrue: AnyContainer<M>;
      whenFalse: AnyContainer<M>;
    };

/** Number-only operations accept `never` for non-number containers, so they can't be called. */
type IfNumber<U, T> = [U] extends [NumberUnit] ? T : never;

/**
 * A value in unit `U`, created by a unit system whose rules are `RS`, together with how it was
 * calculated. Number units hold the value in `unit.store`; string and boolean units are the value.
 *
 * Arithmetic has a single signature per operation. `R extends RightOf<...>` is an F-bounded
 * constraint: `R` is inferred from the argument, then checked against the union of right units
 * that some rule in `RS` accepts for `U`. A mismatch reports exactly what was allowed, e.g.
 * `Type '"Fuel"' is not assignable to type '"Refrigerant"'`.
 *
 * Calculation code normally uses an alias that fixes `RS`, such as `DefaultContainer<U>`.
 *
 * `M` is the calculation methods its inputs can be for (see `UnitSystem.withMethods`). Containers
 * only combine with containers of the same methods.
 */
export interface Container<U, RS extends RuleSet, M extends Method = Method> {
  readonly unit: U;
  readonly origin: Origin<M>;
  readonly meta: Metadata;

  multiply<R extends RightOf<RS['multiply'], U, R>>(
    right: Container<R, RS, M>,
    meta?: Metadata,
  ): Container<ResultOf<RS['multiply'], U, R>, RS, M>;

  divide<R extends RightOf<RS['divide'], U, R>>(
    right: Container<R, RS, M>,
    meta?: Metadata,
  ): Container<ResultOf<RS['divide'], U, R>, RS, M>;

  plus<R extends AdditiveRight<U>>(
    right: Container<R, RS, M>,
    meta?: Metadata,
  ): Container<AdditiveResult<U, R>, RS, M>;

  minus<R extends AdditiveRight<U>>(
    right: Container<R, RS, M>,
    meta?: Metadata,
  ): Container<AdditiveResult<U, R>, RS, M>;

  /** Raises this value to a power. The units of the result can't be tracked, so it is a RealNumber. */
  power(
    right: IfNumber<U, Container<RealNumber, RS, M>>,
    meta?: Metadata,
  ): Container<RealNumber, RS, M>;

  /**
   * Squares this value. The unit is kept as it is (not squared), matching how squared terms are
   * used in the existing calculations; use `switchUnit` to give the result its real unit.
   */
  squared(
    this: IfNumber<U, Container<U, RS, M>>,
    meta?: Metadata,
  ): Container<U, RS, M>;

  /** The smaller of this value and `limit`, on each method track. */
  min<R extends LimitRight<U>>(
    limit: Container<R, RS, M>,
    meta?: Metadata,
  ): Container<U, RS, M>;

  /** The larger of this value and `limit`, on each method track. */
  max<R extends LimitRight<U>>(
    limit: Container<R, RS, M>,
    meta?: Metadata,
  ): Container<U, RS, M>;

  /**
   * The same value and history in a different unit. An escape hatch for relationships no rule
   * describes, e.g. `x.squared().switchUnit((u) => massPerHead('Liveweight', u.store))`.
   */
  switchUnit<V extends AnyUnit>(converter: (from: U) => V): Container<V, RS, M>;

  named(name: string): Container<U, RS, M>;
  reference(reference: string): Container<U, RS, M>;
  attach(meta: Metadata): Container<U, RS, M>;
}

/** Computes the unit of a binary operation, or throws a `UnitError`. Stores are not computed here. */
export type Algebra = {
  multiply: (left: NumberUnit, right: NumberUnit) => NumberUnit;
  divide: (left: NumberUnit, right: NumberUnit) => NumberUnit;
  additive: (left: NumberUnit, right: NumberUnit) => NumberUnit;
};

/** The unit as a number unit, or a `UnitError` for string and boolean units (which the types prevent). */
const numberUnit = (unit: AnyUnit, operation: string): NumberUnit => {
  if (!isNumberUnit(unit)) {
    throw new UnitError(
      `${operation} needs number units, not ${describeUnit(unit)}`,
    );
  }
  return unit;
};

/**
 * The runtime implementation behind `Container`. Not typed by unit: the `Container` interface does
 * the compile-time checking and the system's `Algebra` does the runtime checking. Each node keeps
 * its system's algebra, so containers derived from it follow the same rules.
 */
export class ContainerNode implements AnyContainer {
  constructor(
    readonly algebra: Algebra,
    readonly unit: AnyUnit,
    readonly origin: Origin,
    readonly meta: Metadata = {},
  ) {}

  private binary(
    operation: BinaryOperation,
    right: ContainerNode,
    unit: NumberUnit,
    meta?: Metadata,
  ): ContainerNode {
    return new ContainerNode(
      this.algebra,
      unit,
      { kind: 'binary', operation, left: this, right },
      meta,
    );
  }

  private arithmetic(
    operation: 'add' | 'subtract' | 'multiply' | 'divide',
    right: ContainerNode,
    meta?: Metadata,
  ): ContainerNode {
    const l = numberUnit(this.unit, operation);
    const r = numberUnit(right.unit, operation);
    // Anything multiplied or divided by void is void. For add and subtract, void is the identity:
    // the result keeps the other side's unit (and the stores still combine, void's being 0).
    if (
      (isVoid(l) || isVoid(r)) &&
      (operation === 'multiply' || operation === 'divide')
    ) {
      return this.binary(operation, right, voidUnit(), meta);
    }
    const resolve =
      operation === 'multiply'
        ? this.algebra.multiply
        : operation === 'divide'
          ? this.algebra.divide
          : isVoid(l)
            ? () => r
            : isVoid(r)
              ? () => l
              : this.algebra.additive;
    const store =
      operation === 'multiply'
        ? l.store.multiply(r.store)
        : operation === 'divide'
          ? l.store.divide(r.store)
          : operation === 'add'
            ? l.store.plus(r.store)
            : l.store.minus(r.store);
    return this.binary(operation, right, { ...resolve(l, r), store }, meta);
  }

  private withUnit(unit: AnyUnit): ContainerNode {
    return new ContainerNode(this.algebra, unit, this.origin, this.meta);
  }

  private withMeta(meta: Metadata): ContainerNode {
    return new ContainerNode(this.algebra, this.unit, this.origin, meta);
  }

  multiply(right: ContainerNode, meta?: Metadata) {
    return this.arithmetic('multiply', right, meta);
  }

  divide(right: ContainerNode, meta?: Metadata) {
    return this.arithmetic('divide', right, meta);
  }

  plus(right: ContainerNode, meta?: Metadata) {
    return this.arithmetic('add', right, meta);
  }

  minus(right: ContainerNode, meta?: Metadata) {
    return this.arithmetic('subtract', right, meta);
  }

  power(right: ContainerNode, meta?: Metadata) {
    const store = numberUnit(this.unit, 'power').store.power(
      numberUnit(right.unit, 'power').store,
    );
    return this.binary('power', right, realNumber(store), meta);
  }

  squared(meta?: Metadata) {
    const unit = numberUnit(this.unit, 'squared');
    const two = new ContainerNode(this.algebra, realNumber(2), {
      kind: 'root',
    });
    return this.binary(
      'power',
      two,
      { ...unit, store: unit.store.squared() },
      meta,
    );
  }

  min(limit: ContainerNode, meta?: Metadata) {
    const unit = numberUnit(this.unit, 'min');
    const store = unit.store.min(numberUnit(limit.unit, 'min').store);
    return this.binary('min', limit, { ...unit, store }, meta);
  }

  max(limit: ContainerNode, meta?: Metadata) {
    const unit = numberUnit(this.unit, 'max');
    const store = unit.store.max(numberUnit(limit.unit, 'max').store);
    return this.binary('max', limit, { ...unit, store }, meta);
  }

  switchUnit(converter: (from: AnyUnit) => AnyUnit) {
    return this.withUnit(converter(this.unit));
  }

  named(name: string) {
    return this.withMeta({ ...this.meta, name });
  }

  reference(reference: string) {
    return this.withMeta({
      ...this.meta,
      references: [...(this.meta.references ?? []), reference],
    });
  }

  attach(meta: Metadata) {
    return this.withMeta({ ...this.meta, ...meta });
  }
}

/** Creates a node with the given algebra. Internal: consumers create containers through a system. */
export const createNode = <U, RS extends RuleSet, M extends Method = Method>(
  algebra: Algebra,
  unit: AnyUnit,
  origin: Origin<M>,
  meta?: Metadata,
): Container<U, RS, M> =>
  new ContainerNode(algebra, unit, origin, meta) as unknown as Container<
    U,
    RS,
    M
  >;

/** The algebra of the system that created a container. Internal. */
export const algebraOf = (container: AnyContainer): Algebra =>
  (container as ContainerNode).algebra;

/**
 * The containers a container was calculated from, in order. A method1and2 node returns both
 * branches; a selection node returns only its string-container selectors.
 */
export const childrenOf = <M extends Method>(
  container: AnyContainer<M>,
): AnyContainer<M>[] => {
  const origin = container.origin;
  switch (origin.kind) {
    case 'root':
    case 'input':
      return [];
    case 'binary':
      return [origin.left, origin.right];
    case 'sum':
      return origin.from;
    case 'selection':
      return origin.selectors.filter(
        (s): s is AnyContainer<M> => typeof s !== 'string',
      );
    case 'bracketed':
      return [origin.inner];
    case 'translation':
      return [origin.from];
    case 'method1and2':
      return origin.method2
        ? [origin.method1, origin.method2]
        : [origin.method1];
    case 'method2':
      return [origin.method2];
    case 'switch':
      return [origin.subject, origin.selected];
    case 'if_else':
      return [origin.condition, origin.whenTrue, origin.whenFalse];
  }
};
