import Decimal from 'decimal.js-light';
import { ValueStore } from './value-store';

type Combine = (a: Decimal, b: Decimal) => Decimal;

type ValueSeed1And2 = {
  valueMethod1: Decimal;
  valueMethod2?: Decimal | undefined;
};
type ValueSeedOnly2 = {
  valueMethod2: Decimal;
};

/**
 * A ValueSeed defines the possible values that can be stored in a MethodValueStore.
 * ValueSeed1And2: a method 1 value must always be defined, and a method 2 value may be defined.
 * ValueSeedOnly2: a method 2 value is the only one defined.
 */
export type MultiValueSeed = ValueSeed1And2 | ValueSeedOnly2;

export const isValueSeed1And2 = (
  value: ValueSeed1And2 | ValueSeedOnly2,
): value is ValueSeed1And2 => 'valueMethod1' in value;

export const isValueSeedMethod2 = (
  value: ValueSeed1And2 | ValueSeedOnly2,
): value is ValueSeedOnly2 => !('valueMethod1' in value);

/** The value of a seed: method 2 when present, otherwise method 1 */
const seedValue = (seed: MultiValueSeed): Decimal =>
  isValueSeedMethod2(seed)
    ? seed.valueMethod2
    : (seed.valueMethod2 ?? seed.valueMethod1);

const applyBinary = (
  self: MultiValueSeed,
  other: MultiValueSeed,
  combine: Combine,
): MultiValueSeed => {
  // A method-2-only value has no method 1 track to combine, so anything derived from it
  // stays method-2-only. Checking both sides covers either operand order.
  if (!isValueSeed1And2(self) || !isValueSeed1And2(other)) {
    return { valueMethod2: combine(seedValue(self), seedValue(other)) };
  }
  const thisMethod1 = self.valueMethod1;
  const otherMethod1 = other.valueMethod1;
  const thisMethod2 = self.valueMethod2;
  const otherMethod2 = other.valueMethod2;

  const newMethod1 = combine(thisMethod1, otherMethod1);
  if (thisMethod2 === undefined) {
    if (otherMethod2 === undefined) {
      // Only method 1 values
      return { valueMethod1: newMethod1 };
    } else {
      // This only has method 1, other has method 2
      return {
        valueMethod1: newMethod1,
        valueMethod2: combine(thisMethod1, otherMethod2),
      };
    }
  } else {
    if (otherMethod2 === undefined) {
      // This has method 2, other only has method 1
      return {
        valueMethod1: newMethod1,
        valueMethod2: combine(thisMethod2, otherMethod1),
      };
    } else {
      // Both have method 2
      return {
        valueMethod1: newMethod1,
        valueMethod2: combine(thisMethod2, otherMethod2),
      };
    }
  }
};

const mapSeed = (
  seed: MultiValueSeed,
  fn: (a: Decimal) => Decimal,
): MultiValueSeed =>
  isValueSeedMethod2(seed)
    ? { valueMethod2: fn(seed.valueMethod2) }
    : {
        valueMethod1: fn(seed.valueMethod1),
        valueMethod2:
          seed.valueMethod2 === undefined ? undefined : fn(seed.valueMethod2),
      };

/**
 * A store that tracks a method 1 value and a method 2 value side by side. Arithmetic with a
 * plain {@link ValueStore} treats it as method 1 only.
 */
export class MethodValueStore extends ValueStore {
  readonly seed: MultiValueSeed;

  constructor(seed: MultiValueSeed) {
    super(seedValue(seed));
    this.seed = seed;
  }

  /**
   * The store for a method 2 input: the supplied value is used for both methods, so that
   * results derived from it can be compared against the method 1 calculation.
   */
  static fromMethod2Input(store: ValueStore): MethodValueStore {
    return new MethodValueStore({
      valueMethod1: store.value,
      valueMethod2: store.value,
    });
  }

  get valueMethod1(): Decimal | undefined {
    return isValueSeed1And2(this.seed) ? this.seed.valueMethod1 : undefined;
  }

  get valueMethod2(): Decimal | undefined {
    return this.seed.valueMethod2;
  }

  hasMethod1() {
    return isValueSeed1And2(this.seed);
  }

  hasMethod2() {
    return this.seed.valueMethod2 !== undefined;
  }

  combine(other: ValueStore, fn: Combine): ValueStore {
    return storeFromSeed(applyBinary(this.seed, seedOf(other), fn));
  }

  combineAsRight(left: ValueStore, fn: Combine): ValueStore {
    return storeFromSeed(applyBinary(seedOf(left), this.seed, fn));
  }

  map(fn: (value: Decimal) => Decimal): ValueStore {
    return storeFromSeed(mapSeed(this.seed, fn));
  }
}

/** The method 1 and 2 values of any store. A plain store only has a method 1 value. */
export const seedOf = (store: ValueStore): MultiValueSeed =>
  store instanceof MethodValueStore
    ? store.seed
    : { valueMethod1: store.value };

/** Build a store from a seed, using a plain store when there is only a method 1 value. */
export const storeFromSeed = (seed: MultiValueSeed): ValueStore =>
  isValueSeed1And2(seed) && seed.valueMethod2 === undefined
    ? new ValueStore(seed.valueMethod1)
    : new MethodValueStore(seed);

export const mergeSeeds = (
  method1: ValueStore,
  method2: ValueStore | undefined,
): MultiValueSeed => {
  const seedM1 = seedOf(method1);
  // NOTE: There are technically 4 values to choose from, when you consider stored method 1 and 2 values from both branches.
  // We have to make some logical assumptions here. A method 2 container is always going to be an input from the user, with no
  // upstream history, so take value instead of valueMethod2.
  const valueMethod2 = method2?.value;

  if (isValueSeed1And2(seedM1)) {
    return { valueMethod1: seedM1.valueMethod1, valueMethod2 };
  }
  // The method 1 branch has no method 1 track of its own, so nothing derived from it can have one
  return { valueMethod2: valueMethod2 ?? seedM1.valueMethod2 };
};
