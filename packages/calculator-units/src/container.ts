import Decimal from 'decimal.js-light';
import type {
  AdditiveResult,
  AdditiveRight,
  ResultOf,
  RightOf,
  RuleType,
} from './rules.js';
import type { UnitLike } from './units.js';

/** The type-level rules a unit system was built with. */
export type RuleSet = { multiply: RuleType; divide: RuleType };

export type Metadata = {
  name?: string;
  references?: string[];
};

export type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

export type Origin<RS extends RuleSet> =
  | { kind: 'root' }
  | {
      kind: 'binary';
      operation: Operation;
      left: Container<UnitLike, RS>;
      right: Container<UnitLike, RS>;
    };

/**
 * A value in unit `U`, created by a unit system whose rules are `RS`, together with how it was
 * calculated.
 *
 * Each operation has a single signature. `R extends RightOf<...>` is an F-bounded constraint: `R` is
 * inferred from the argument, then checked against the union of right units that some rule in `RS`
 * accepts for `U`. A mismatch reports exactly what was allowed, e.g.
 * `Type '"Fuel"' is not assignable to type '"Refrigerant"'`.
 *
 * Calculation code normally uses an alias that fixes `RS`, such as `DefaultContainer<U>` or
 * `ContainerOf<typeof mySystem, U>`.
 */
export interface Container<U, RS extends RuleSet> {
  readonly unit: U;
  readonly value: Decimal;
  readonly origin: Origin<RS>;
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

  named(name: string): Container<U, RS>;
  reference(reference: string): Container<U, RS>;
  attach(meta: Metadata): Container<U, RS>;
}

/** Computes the unit of a binary operation, or throws a `UnitError`. */
export type Algebra = {
  multiply: (left: UnitLike, right: UnitLike) => UnitLike;
  divide: (left: UnitLike, right: UnitLike) => UnitLike;
  additive: (left: UnitLike, right: UnitLike) => UnitLike;
};

/**
 * The runtime implementation behind `Container`. Not typed by unit: the `Container` interface does
 * the compile-time checking and the system's `Algebra` does the runtime checking.
 */
class ContainerNode {
  constructor(
    private readonly algebra: Algebra,
    readonly unit: UnitLike,
    readonly value: Decimal,
    readonly origin: Origin<RuleSet>,
    readonly meta: Metadata = {},
  ) {}

  private binary(
    operation: Operation,
    right: ContainerNode,
    unit: UnitLike,
    value: Decimal,
    meta?: Metadata,
  ): ContainerNode {
    return new ContainerNode(
      this.algebra,
      unit,
      value,
      {
        kind: 'binary',
        operation,
        left: this as never,
        right: right as never,
      },
      meta,
    );
  }

  private withMeta(meta: Metadata): ContainerNode {
    return new ContainerNode(
      this.algebra,
      this.unit,
      this.value,
      this.origin,
      meta,
    );
  }

  multiply(right: ContainerNode, meta?: Metadata): ContainerNode {
    const unit = this.algebra.multiply(this.unit, right.unit);
    return this.binary(
      'multiply',
      right,
      unit,
      this.value.mul(right.value),
      meta,
    );
  }

  divide(right: ContainerNode, meta?: Metadata): ContainerNode {
    const unit = this.algebra.divide(this.unit, right.unit);
    return this.binary(
      'divide',
      right,
      unit,
      this.value.div(right.value),
      meta,
    );
  }

  plus(right: ContainerNode, meta?: Metadata): ContainerNode {
    const unit = this.algebra.additive(this.unit, right.unit);
    return this.binary('add', right, unit, this.value.plus(right.value), meta);
  }

  minus(right: ContainerNode, meta?: Metadata): ContainerNode {
    const unit = this.algebra.additive(this.unit, right.unit);
    return this.binary(
      'subtract',
      right,
      unit,
      this.value.minus(right.value),
      meta,
    );
  }

  named(name: string): ContainerNode {
    return this.withMeta({ ...this.meta, name });
  }

  reference(reference: string): ContainerNode {
    return this.withMeta({
      ...this.meta,
      references: [...(this.meta.references ?? []), reference],
    });
  }

  attach(meta: Metadata): ContainerNode {
    return this.withMeta({ ...this.meta, ...meta });
  }
}

export const createRoot = <U extends UnitLike, RS extends RuleSet>(
  algebra: Algebra,
  unit: U,
  value: number | Decimal,
  meta?: Metadata,
): Container<U, RS> =>
  new ContainerNode(
    algebra,
    unit,
    new Decimal(value),
    { kind: 'root' },
    meta,
  ) as unknown as Container<U, RS>;
