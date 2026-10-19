import Decimal from 'decimal.js-light';
import { NumberContainer } from './containers';
import { NumberUnit } from './units';

const applyBinary = (
  self: ValueStore,
  other: ValueStore,
  combine: (a: Decimal, b: Decimal) => Decimal,
): ValueStore => {
  const thisMethod1 = self.valueMethod1;
  const otherMethod1 = other.valueMethod1;
  // A method-2-only value has no method 1 track to combine, so anything derived from it
  // stays method-2-only. Checking both sides covers either operand order.
  if (thisMethod1 === undefined || otherMethod1 === undefined) {
    return new ValueStore({ valueMethod2: combine(self.value, other.value) });
  }
  const thisMethod2 = self.valueMethod2;

  const newMethod1 = combine(thisMethod1, otherMethod1);
  const otherMethod2 = other.valueMethod2;
  if (thisMethod2 === undefined) {
    if (otherMethod2 === undefined) {
      // Only method 1 values
      return new ValueStore({ valueMethod1: newMethod1 });
    } else {
      // This only has method 1, other has method 2
      return new ValueStore({
        valueMethod1: newMethod1,
        valueMethod2: combine(thisMethod1, otherMethod2),
      });
    }
  } else {
    if (otherMethod2 === undefined) {
      // This has method 2, other only has method 1
      return new ValueStore({
        valueMethod1: newMethod1,
        valueMethod2: combine(thisMethod2, otherMethod1),
      });
    } else {
      // Both have method 2
      return new ValueStore({
        valueMethod1: newMethod1,
        valueMethod2: combine(thisMethod2, otherMethod2),
      });
    }
  }
};

type ValueSeed1And2 = {
  valueMethod1: Decimal;
  valueMethod2?: Decimal | undefined;
};
type ValueSeedOnly2 = {
  valueMethod2: Decimal;
};

/**
 * A ValueSeed defines the possible values that can be stored in a ValueStore.
 * ValueSeed1And2: a method 1 value must always be defined, and a method 2 value may be defined.
 * ValueSeedOnly2: a method 2 value is the only one defined.
 */
export type ValueSeed = ValueSeed1And2 | ValueSeedOnly2;

export const isValueSeed1And2 = (
  value: ValueSeed1And2 | ValueSeedOnly2,
): value is ValueSeed1And2 => 'valueMethod1' in value;

export const isValueSeedMethod2 = (
  value: ValueSeed1And2 | ValueSeedOnly2,
): value is ValueSeedOnly2 => !('valueMethod1' in value);

export const mergeSeeds = <U extends NumberUnit>(
  m1: NumberContainer<U>,
  m2: NumberContainer<U> | undefined,
): ValueSeed => {
  const seedM1 = m1.unit.store.seed;
  // NOTE: There are technically 4 values to choose from, when you consider stored method 1 and 2 values from both branches.
  // We have to make some logical assumptions here. A method 2 container is always going to be an input from the user, with no
  // upstream history, so take value instead of valueMethod2.
  const valueMethod2 = m2?.unit.store.value;

  if (isValueSeed1And2(seedM1)) {
    return { valueMethod1: seedM1.valueMethod1, valueMethod2 };
  }
  // The method 1 branch has no method 1 track of its own, so nothing derived from it can have one
  return { valueMethod2: valueMethod2 ?? seedM1.valueMethod2 };
};

export class ValueStore {
  seed: ValueSeed;

  constructor(seed: ValueSeed) {
    this.seed = seed;
  }

  get valueMethod1(): Decimal | undefined {
    return isValueSeed1And2(this.seed) ? this.seed.valueMethod1 : undefined;
  }

  get valueMethod2(): Decimal | undefined {
    return isValueSeedMethod2(this.seed)
      ? this.seed.valueMethod2
      : this.seed.valueMethod2;
  }

  get value(): Decimal {
    return isValueSeedMethod2(this.seed)
      ? this.seed.valueMethod2
      : (this.seed.valueMethod2 ?? this.seed.valueMethod1);
  }

  hasMethod1() {
    return isValueSeed1And2(this.seed);
  }

  hasMethod2() {
    return isValueSeedMethod2(this.seed)
      ? true
      : this.seed.valueMethod2 !== undefined;
  }

  multiply(other: ValueStore) {
    return applyBinary(this, other, (a, b) => a.mul(b));
  }

  divide(other: ValueStore) {
    return applyBinary(this, other, (a, b) => a.div(b));
  }

  plus(other: ValueStore) {
    return applyBinary(this, other, (a, b) => a.add(b));
  }

  minus(other: ValueStore) {
    return applyBinary(this, other, (a, b) => a.sub(b));
  }

  squared() {
    if (isValueSeedMethod2(this.seed)) {
      return new ValueStore({ valueMethod2: this.seed.valueMethod2.pow(2) });
    } else {
      return new ValueStore({
        valueMethod1: this.seed.valueMethod1.pow(2),
        valueMethod2: this.seed.valueMethod2?.pow(2),
      });
    }
  }

  power(other: ValueStore) {
    return applyBinary(this, other, (a, b) => a.pow(b));
  }

  min(limit: Decimal) {
    if (isValueSeed1And2(this.seed)) {
      return new ValueStore({
        valueMethod1: this.seed.valueMethod1.gt(limit)
          ? limit
          : this.seed.valueMethod1,
        valueMethod2: this.seed.valueMethod2?.gt(limit)
          ? limit
          : this.seed.valueMethod2,
      });
    } else {
      return new ValueStore({
        valueMethod2: this.seed.valueMethod2.gt(limit)
          ? limit
          : this.seed.valueMethod2,
      });
    }
  }

  max(max: Decimal) {
    if (isValueSeed1And2(this.seed)) {
      return new ValueStore({
        valueMethod1: this.seed.valueMethod1.lt(max)
          ? max
          : this.seed.valueMethod1,
        valueMethod2: this.seed.valueMethod2?.lt(max)
          ? max
          : this.seed.valueMethod2,
      });
    } else {
      return new ValueStore({
        valueMethod2: this.seed.valueMethod2.lt(max)
          ? max
          : this.seed.valueMethod2,
      });
    }
  }

  toNumber(): number {
    return this.value.toNumber();
  }

  // Ignore what value was passed initially for method 2, assign the method 1 value to method 2
  applyMethod2() {
    if (isValueSeed1And2(this.seed)) {
      this.seed = {
        valueMethod1: this.seed.valueMethod1,
        valueMethod2: this.seed.valueMethod1,
      };
    }
  }
}

/**
 * Build or pass through a {@link ValueStore}.
 *
 */
export function values(
  valueMethod1: Decimal | number | ValueStore | undefined = undefined,
  valueMethod2?: Decimal | undefined,
): ValueStore {
  if (valueMethod1 instanceof ValueStore) {
    return valueMethod1;
  }
  return new ValueStore({
    valueMethod1: new Decimal(valueMethod1 ?? 0),
    valueMethod2,
  });
}
