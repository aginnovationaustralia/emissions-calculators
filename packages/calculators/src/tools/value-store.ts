import Decimal from 'decimal.js-light';

type Combine = (a: Decimal, b: Decimal) => Decimal;

/**
 * Holds the numeric value of a unit. Arithmetic always returns a new store.
 *
 * Subclasses can track more than one value. `combine`, `combineAsRight` and `map` are the
 * extension points: a binary operation asks the right hand operand to combine itself with the
 * left, so a subclass on either side of an operation takes over, and operand order is kept.
 */
export class ValueStore {
  readonly value: Decimal;

  constructor(value: Decimal | number) {
    this.value = new Decimal(value);
  }

  /** Combine this store (left) with `other` (right). */
  combine(other: ValueStore, fn: Combine): ValueStore {
    return other.combineAsRight(this, fn);
  }

  /** Combine `left` with this store, as the right hand operand. */
  combineAsRight(left: ValueStore, fn: Combine): ValueStore {
    return new ValueStore(fn(left.value, this.value));
  }

  map(fn: (value: Decimal) => Decimal): ValueStore {
    return new ValueStore(fn(this.value));
  }

  multiply(other: ValueStore) {
    return this.combine(other, (a, b) => a.mul(b));
  }

  divide(other: ValueStore) {
    return this.combine(other, (a, b) => a.div(b));
  }

  plus(other: ValueStore) {
    return this.combine(other, (a, b) => a.add(b));
  }

  minus(other: ValueStore) {
    return this.combine(other, (a, b) => a.sub(b));
  }

  power(other: ValueStore) {
    return this.combine(other, (a, b) => a.pow(b));
  }

  squared() {
    return this.map((a) => a.pow(2));
  }

  /** Cap the value at `limit` */
  min(limit: Decimal) {
    return this.map((a) => (a.gt(limit) ? limit : a));
  }

  /** Floor the value at `limit` */
  max(limit: Decimal) {
    return this.map((a) => (a.lt(limit) ? limit : a));
  }

  toNumber(): number {
    return this.value.toNumber();
  }
}

/**
 * Build or pass through a {@link ValueStore}.
 */
export function values(
  value: Decimal | number | ValueStore | undefined = undefined,
): ValueStore {
  if (value instanceof ValueStore) {
    return value;
  }
  return new ValueStore(value ?? 0);
}
