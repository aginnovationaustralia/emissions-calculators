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
} from './rules';
import { NumberUnit, RealNumber, realNumber } from './units';

export type Metadata = {
  name?: string;
  references?: string[];
};

export type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

export type Origin =
  | { kind: 'root' }
  | { kind: 'binary'; operation: Operation; left: Container; right: Container };

/**
 * The type calculation code depends on. It is an interface with one signature per operation, so it
 * does not grow as units and rules are added: the allowed combinations live in the rule tables in
 * rules.ts and are looked up through `MultiplyRight`/`MultiplyResult`.
 *
 * `R extends MultiplyRight<U, R>` is an F-bounded constraint: `R` is inferred from the argument, then
 * checked against the union of right units that some rule accepts for `U`. A mismatch reports as
 * "Argument of type 'Container<Mass<"Fuel">>' is not assignable to parameter of type
 * 'Container<Mass<"Refrigerant"> | RealNumber>'", which names exactly what would have been allowed.
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
}

/**
 * The runtime implementation. It is deliberately untyped with respect to units: all the unit
 * checking is done by the `Container` interface at compile time and by the runtime rule tables when
 * running. Calculation code never needs to import this class.
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
      { kind: 'binary', operation, left: this as never, right: right as never },
      meta,
    );
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
    return new ContainerNode(this.unit, this.value, this.origin, {
      ...this.meta,
      name,
    });
  }

  reference(reference: string): ContainerNode {
    return new ContainerNode(this.unit, this.value, this.origin, {
      ...this.meta,
      references: [...(this.meta.references ?? []), reference],
    });
  }
}

export const root = <U extends NumberUnit>(
  unit: U,
  value: number | Decimal,
  meta?: Metadata,
): Container<U> =>
  new ContainerNode(unit, new Decimal(value), { kind: 'root' }, meta) as never;

export const num = (value: number | Decimal): Container<RealNumber> =>
  root(realNumber(), value);
