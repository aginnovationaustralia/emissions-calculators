import { ValueStore } from '@/tools/value-store';
import Decimal from 'decimal.js-light';

const d = (n: number) => new Decimal(n);
const store = (n: number) => new ValueStore(n);

describe('ValueStore', () => {
  it('accepts a number or a Decimal', () => {
    expect(store(3).value.toNumber()).toBe(3);
    expect(new ValueStore(d(4)).toNumber()).toBe(4);
  });

  it.each([
    {
      name: 'multiply',
      op: (a: ValueStore, b: ValueStore) => a.multiply(b),
      expected: 16,
    },
    {
      name: 'divide',
      op: (a: ValueStore, b: ValueStore) => a.divide(b),
      expected: 4,
    },
    {
      name: 'plus',
      op: (a: ValueStore, b: ValueStore) => a.plus(b),
      expected: 10,
    },
    {
      name: 'minus',
      op: (a: ValueStore, b: ValueStore) => a.minus(b),
      expected: 6,
    },
    {
      name: 'power',
      op: (a: ValueStore, b: ValueStore) => a.power(b),
      expected: 64,
    },
  ])(
    '$name keeps operand order and returns a plain store',
    ({ op, expected }) => {
      const result = op(store(8), store(2));

      expect(result.toNumber()).toBe(expected);
      expect(result.constructor).toBe(ValueStore);
    },
  );

  it('does not change either operand', () => {
    const left = store(8);
    const right = store(2);
    left.multiply(right);

    expect(left.toNumber()).toBe(8);
    expect(right.toNumber()).toBe(2);
  });

  it('squares the value', () => {
    expect(store(3).squared().toNumber()).toBe(9);
  });

  describe('min', () => {
    it('caps the value at the limit', () => {
      expect(store(10).min(d(5)).toNumber()).toBe(5);
    });

    it('leaves a value at or below the limit unchanged', () => {
      expect(store(3).min(d(5)).toNumber()).toBe(3);
    });
  });

  describe('max', () => {
    it('floors the value at the limit', () => {
      expect(store(3).max(d(5)).toNumber()).toBe(5);
    });

    it('leaves a value at or above the limit unchanged', () => {
      expect(store(10).max(d(5)).toNumber()).toBe(10);
    });
  });
});
