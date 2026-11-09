import { ValueStore, values } from '@/tools/value-store';
import Decimal from 'decimal.js-light';

const d = (n: number) => new Decimal(n);

/** A dual track store, or a method 1 only store when method 2 is omitted. */
const dualTrack = (method1: number, method2?: number) =>
  new ValueStore({
    valueMethod1: d(method1),
    valueMethod2: method2 === undefined ? undefined : d(method2),
  });

const method2Only = (method2: number) =>
  new ValueStore({ valueMethod2: d(method2) });

const expectStore = (store: ValueStore, method1: number, method2?: number) => {
  expect(store.hasMethod1()).toBe(true);
  expect(store.valueMethod1?.toNumber()).toBe(method1);
  if (method2 === undefined) {
    expect(store.valueMethod2).toBeUndefined();
    expect(store.hasMethod2()).toBe(false);
    expect(store.value.toNumber()).toBe(method1);
  } else {
    expect(store.valueMethod2?.toNumber()).toBe(method2);
    expect(store.hasMethod2()).toBe(true);
    expect(store.value.toNumber()).toBe(method2);
  }
};

describe('values', () => {
  it('defaults to zero when value is omitted', () => {
    expectStore(values(), 0);
  });

  it('accepts a number for method 1', () => {
    expectStore(values(3), 3);
  });

  it('accepts a Decimal for method 1 and optional method 2', () => {
    expectStore(values(d(4), d(7)), 4, 7);
  });

  it('passes through an existing ValueStore', () => {
    const existing = dualTrack(1, 2);
    expect(values(existing)).toBe(existing);
  });
});

describe('ValueStore', () => {
  describe('value and hasMethod2', () => {
    it('exposes method 1 when method 2 is absent', () => {
      expectStore(dualTrack(5), 5);
    });

    it('prefers method 2 when present', () => {
      expectStore(dualTrack(5, 9), 5, 9);
    });
  });

  describe.each([
    {
      name: 'multiply',
      op: (a: ValueStore, b: ValueStore) => a.multiply(b),
      neither: [16, undefined] as const,
      onlyThis: [16, 32] as const,
      onlyOther: [16, 32] as const,
      both: [16, 64] as const,
    },
    {
      name: 'divide',
      op: (a: ValueStore, b: ValueStore) => a.divide(b),
      neither: [4, undefined] as const,
      onlyThis: [4, 8] as const,
      onlyOther: [4, 2] as const,
      both: [4, 4] as const,
    },
    {
      name: 'plus',
      op: (a: ValueStore, b: ValueStore) => a.plus(b),
      neither: [10, undefined] as const,
      onlyThis: [10, 18] as const,
      onlyOther: [10, 12] as const,
      both: [10, 20] as const,
    },
    {
      name: 'minus',
      op: (a: ValueStore, b: ValueStore) => a.minus(b),
      neither: [6, undefined] as const,
      onlyThis: [6, 14] as const,
      onlyOther: [6, 4] as const,
      both: [6, 12] as const,
    },
    {
      name: 'power',
      op: (a: ValueStore, b: ValueStore) => a.power(b),
      neither: [64, undefined] as const,
      onlyThis: [64, 256] as const,
      onlyOther: [64, 4096] as const,
      both: [64, 65536] as const,
    },
  ])('$name', ({ op, neither, onlyThis, onlyOther, both }) => {
    // left: method1=8, method2=16; right: method1=2, method2=4
    const leftBoth = () => dualTrack(8, 16);
    const leftOne = () => dualTrack(8);
    const rightBoth = () => dualTrack(2, 4);
    const rightOne = () => dualTrack(2);

    it('combines method 1 only when neither has method 2', () => {
      const [method1, method2] = neither;
      expectStore(op(leftOne(), rightOne()), method1, method2);
    });

    it('uses this method 2 with other method 1', () => {
      const [method1, method2] = onlyThis;
      expectStore(op(leftBoth(), rightOne()), method1, method2);
    });

    it('uses this method 1 with other method 2', () => {
      const [method1, method2] = onlyOther;
      expectStore(op(leftOne(), rightBoth()), method1, method2);
    });

    it('combines both method 2 values when present', () => {
      const [method1, method2] = both;
      expectStore(op(leftBoth(), rightBoth()), method1, method2);
    });
  });

  describe('squared', () => {
    it('squares method 1 only', () => {
      expectStore(dualTrack(3).squared(), 9);
    });

    it('squares both methods', () => {
      expectStore(dualTrack(3, 4).squared(), 9, 16);
    });
  });

  describe('min', () => {
    it('leaves values at or below the limit unchanged', () => {
      expectStore(dualTrack(3, 4).min(d(5)), 3, 4);
    });

    it('clamps method 1 and method 2 independently', () => {
      expectStore(dualTrack(10, 3).min(d(5)), 5, 3);
    });

    it('clamps method 1 when method 2 is absent', () => {
      expectStore(dualTrack(10).min(d(5)), 5);
    });
  });

  describe('applyMethod2', () => {
    it('promotes the method 1 value over any existing method 2 value', () => {
      const store = dualTrack(3, 4);
      store.applyMethod2();
      expectStore(store, 3, 3);
    });
  });
});

describe('method 2 only ValueStore', () => {
  const expectMethod2Only = (store: ValueStore, method2: number) => {
    expect(store.hasMethod1()).toBe(false);
    expect(store.valueMethod1).toBeUndefined();
    expect(store.hasMethod2()).toBe(true);
    expect(store.valueMethod2?.toNumber()).toBe(method2);
    expect(store.value.toNumber()).toBe(method2);
  };

  it('holds a method 2 value with no method 1 track', () => {
    expectMethod2Only(method2Only(8), 8);
  });

  it('passes through values() unchanged', () => {
    const existing = method2Only(8);
    expect(values(existing)).toBe(existing);
  });

  describe.each([
    { name: 'multiply', op: 'multiply', expected: 16 },
    { name: 'divide', op: 'divide', expected: 4 },
    { name: 'plus', op: 'plus', expected: 10 },
    { name: 'minus', op: 'minus', expected: 6 },
    { name: 'power', op: 'power', expected: 64 },
  ] as const)('$name', ({ op, expected }) => {
    it('stays method 2 only when the method-2-only store is on the left', () => {
      const result = method2Only(8)[op](dualTrack(2));
      expectMethod2Only(result, expected);
    });

    it('stays method 2 only when the method-2-only store is on the right', () => {
      // Matters for sum(), where a method 1 value can be the left operand
      const result = dualTrack(8)[op](method2Only(2));
      expectMethod2Only(result, expected);
    });

    it('combines against the best value of a dual track store', () => {
      const result = method2Only(8)[op](dualTrack(100, 2));
      expectMethod2Only(result, expected);
    });
  });

  describe('squared', () => {
    it('squares the method 2 value only', () => {
      expectMethod2Only(method2Only(3).squared(), 9);
    });
  });

  describe('min', () => {
    it('clamps the method 2 value', () => {
      expectMethod2Only(method2Only(10).min(d(5)), 5);
    });

    it('leaves a value below the limit unchanged', () => {
      expectMethod2Only(method2Only(3).min(d(5)), 3);
    });
  });

  it('ignores applyMethod2 because there is no method 1 value to promote', () => {
    const store = method2Only(8);
    store.applyMethod2();
    expectMethod2Only(store, 8);
  });
});
