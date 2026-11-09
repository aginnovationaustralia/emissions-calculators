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

export type BinaryOperation =
  'add' | 'subtract' | 'multiply' | 'divide' | 'power' | 'min' | 'max';

/**
 * Any container, seen only as a record of how its value was calculated. Use this for code that
 * walks or reports on calculations (see `childrenOf`), which doesn't need to do arithmetic.
 */
export interface AnyContainer {
  readonly unit: AnyUnit;
  readonly origin: Origin;
  readonly meta: Metadata;
}

/** How a container's value was produced, and from which other containers. */
export type Origin =
  /** A value given directly, e.g. a constant. */
  | { kind: 'root' }
  /** A value supplied by the user, for method 1 or method 2. */
  | { kind: 'input'; method: '1' | '2' }
  | {
      kind: 'binary';
      operation: BinaryOperation;
      left: AnyContainer;
      right: AnyContainer;
    }
  | { kind: 'sum'; from: AnyContainer[] }
  /** A value looked up from a table, by literal keys or by string containers. */
  | { kind: 'selection'; selectors: (AnyContainer | string)[] }
  /** The same value, grouped for display as `( inner )`. */
  | { kind: 'bracketed'; inner: AnyContainer }
  /** A value in a different unit, derived from another, e.g. a mass relabelled to a new substance. */
  | { kind: 'translation'; from: AnyContainer }
  /** A method 1 value, and the method 2 value that overrides it if one was supplied. */
  | {
      kind: 'method1and2';
      method1: AnyContainer;
      method2: AnyContainer | undefined;
    }
  /** A value only method 2 can calculate. */
  | { kind: 'method2'; method2: AnyContainer }
  /** One of several cases, chosen by a string value. */
  | { kind: 'switch'; subject: AnyContainer; selected: AnyContainer }
  /** One of two values, chosen by a boolean. */
  | {
      kind: 'if_else';
      condition: AnyContainer;
      selected: AnyContainer;
      whenTrue: AnyContainer;
      whenFalse: AnyContainer;
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
 */
export interface Container<U, RS extends RuleSet> {
  readonly unit: U;
  readonly origin: Origin;
  readonly meta: Metadata;

  multiply<R extends RightOf<RS['multiply'], U, R>>(
    right: Container<R, RS>,
    meta?: Metadata,
  ): Container<ResultOf<RS['multiply'], U, R>, RS>;

  divide<R extends RightOf<RS['divide'], U, R>>(
    right: Container<R, RS>,
    meta?: Metadata,
  ): Container<ResultOf<RS['divide'], U, R>, RS>;

  plus<R extends AdditiveRight<U>>(
    right: Container<R, RS>,
    meta?: Metadata,
  ): Container<AdditiveResult<U, R>, RS>;

  minus<R extends AdditiveRight<U>>(
    right: Container<R, RS>,
    meta?: Metadata,
  ): Container<AdditiveResult<U, R>, RS>;

  /** Raises this value to a power. The units of the result can't be tracked, so it is a RealNumber. */
  power(
    right: IfNumber<U, Container<RealNumber, RS>>,
    meta?: Metadata,
  ): Container<RealNumber, RS>;

  /**
   * Squares this value. The unit is kept as it is (not squared), matching how squared terms are
   * used in the existing calculations; use `switchUnit` to give the result its real unit.
   */
  squared(
    this: IfNumber<U, Container<U, RS>>,
    meta?: Metadata,
  ): Container<U, RS>;

  /** The smaller of this value and `limit`, on each method track. */
  min<R extends LimitRight<U>>(
    limit: Container<R, RS>,
    meta?: Metadata,
  ): Container<U, RS>;

  /** The larger of this value and `limit`, on each method track. */
  max<R extends LimitRight<U>>(
    limit: Container<R, RS>,
    meta?: Metadata,
  ): Container<U, RS>;

  /**
   * The same value and history in a different unit. An escape hatch for relationships no rule
   * describes, e.g. `x.squared().switchUnit((u) => massPerHead('Liveweight', u.store))`.
   */
  switchUnit<V extends AnyUnit>(converter: (from: U) => V): Container<V, RS>;

  named(name: string): Container<U, RS>;
  reference(reference: string): Container<U, RS>;
  attach(meta: Metadata): Container<U, RS>;
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
    if (isVoid(l) || isVoid(r)) {
      return this.binary(operation, right, voidUnit(), meta);
    }
    const resolve =
      operation === 'multiply'
        ? this.algebra.multiply
        : operation === 'divide'
          ? this.algebra.divide
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
    const store = unit.store.min(numberUnit(limit.unit, 'min').store.value);
    return this.binary('min', limit, { ...unit, store }, meta);
  }

  max(limit: ContainerNode, meta?: Metadata) {
    const unit = numberUnit(this.unit, 'max');
    const store = unit.store.max(numberUnit(limit.unit, 'max').store.value);
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
export const createNode = <U, RS extends RuleSet>(
  algebra: Algebra,
  unit: AnyUnit,
  origin: Origin,
  meta?: Metadata,
): Container<U, RS> =>
  new ContainerNode(algebra, unit, origin, meta) as unknown as Container<U, RS>;

/** The algebra of the system that created a container. Internal. */
export const algebraOf = (container: AnyContainer): Algebra =>
  (container as ContainerNode).algebra;

/**
 * The containers a container was calculated from, in order. A method1and2 node returns both
 * branches; a selection node returns only its string-container selectors.
 */
export const childrenOf = (container: AnyContainer): AnyContainer[] => {
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
        (s): s is AnyContainer => typeof s !== 'string',
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
