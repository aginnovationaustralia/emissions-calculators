import Decimal from 'decimal.js-light';
import {
  additiveUnit,
  AdditiveResult,
  AdditiveRight,
  divideUnits,
  DivideResult,
  DivideRight,
  multiplyUnits,
  MultiplyResult,
  MultiplyRight,
} from './rules.js';
import { NumberUnit, RealNumber, realNumber } from './units.js';

export type Metadata = {
  name?: string;
  references?: string[];
};

export type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

export type Origin =
  | { kind: 'root' }
  | { kind: 'binary'; operation: Operation; left: Container; right: Container };

/**
 * A value in unit `U`, together with how it was calculated.
 *
 * Each operation has a single signature. The allowed combinations live in the global rule tables
 * in rules.ts and are looked up through `MultiplyRight`/`MultiplyResult`. `R extends
 * MultiplyRight<U, R>` is an F-bounded constraint: `R` is inferred from the argument, then checked
 * against the union of right units that some rule accepts for `U`.
 */
export interface Container<U = NumberUnit> {
  readonly unit: U;
  readonly value: Decimal;
  readonly origin: Origin;
  readonly meta: Metadata;

  multiply<R extends MultiplyRight<U, R>>(
    right: Container<R>,
    meta?: Metadata,
  ): Container<MultiplyResult<U, R>>;

  divide<R extends DivideRight<U, R>>(
    right: Container<R>,
    meta?: Metadata,
  ): Container<DivideResult<U, R>>;

  plus<R extends AdditiveRight<U>>(
    right: Container<R>,
    meta?: Metadata,
  ): Container<AdditiveResult<U, R>>;

  minus<R extends AdditiveRight<U>>(
    right: Container<R>,
    meta?: Metadata,
  ): Container<AdditiveResult<U, R>>;

  named(name: string): Container<U>;
  reference(reference: string): Container<U>;
  attach(meta: Metadata): Container<U>;
}

/**
 * The runtime implementation behind `Container`. Not typed by unit: the `Container` interface does
 * the compile-time checking and the global rule registry does the runtime checking.
 */
class ContainerNode {
  constructor(
    readonly unit: NumberUnit,
    readonly value: Decimal,
    readonly origin: Origin,
    readonly meta: Metadata = {},
  ) {}

  private binary(
    operation: Operation,
    right: ContainerNode,
    unit: NumberUnit,
    value: Decimal,
    meta?: Metadata,
  ): ContainerNode {
    return new ContainerNode(
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
    return new ContainerNode(this.unit, this.value, this.origin, meta);
  }

  multiply(right: ContainerNode, meta?: Metadata): ContainerNode {
    const unit = multiplyUnits(this.unit, right.unit);
    return this.binary(
      'multiply',
      right,
      unit,
      this.value.mul(right.value),
      meta,
    );
  }

  divide(right: ContainerNode, meta?: Metadata): ContainerNode {
    const unit = divideUnits(this.unit, right.unit);
    return this.binary(
      'divide',
      right,
      unit,
      this.value.div(right.value),
      meta,
    );
  }

  plus(right: ContainerNode, meta?: Metadata): ContainerNode {
    const unit = additiveUnit(this.unit, right.unit);
    return this.binary('add', right, unit, this.value.plus(right.value), meta);
  }

  minus(right: ContainerNode, meta?: Metadata): ContainerNode {
    const unit = additiveUnit(this.unit, right.unit);
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

/** A container holding `value` in `unit`, with no history. */
export const root = <U extends NumberUnit>(
  unit: U,
  value: number | Decimal,
  meta?: Metadata,
): Container<U> =>
  new ContainerNode(
    unit,
    new Decimal(value),
    { kind: 'root' },
    meta,
  ) as unknown as Container<U>;

/** A dimensionless container. */
export const num = (
  value: number | Decimal,
  meta?: Metadata,
): Container<RealNumber> => root(realNumber(), value, meta);
