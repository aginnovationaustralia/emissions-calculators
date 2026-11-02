import { RootContainer, root } from './containers';
import { input } from './inputs';
import { zero, zeroCH4, zeroCO2, zeroN2O } from './sentinels';
import { sum } from './sum';
import {
  Area,
  area,
  mass,
  Mass,
  realNumber,
  Substance,
  voidUnit,
} from './units';

// `sum` underlies every aggregation across seasons/classes/herds in the calculators. Its
// unit-inference for the empty-array case, and its choice of unit across the items, are easy to
// get subtly wrong.

// A void item, which the calculators no longer produce, typed as the Mass it stands in for
const voidMass = <S extends Substance>() =>
  root(voidUnit()) as unknown as RootContainer<Mass<S>>;

describe('sum', () => {
  it('returns the fallback unit, zero-valued, for an empty array', () => {
    // The generic can't be inferred from an empty array literal, so pin it
    const result = sum<RootContainer<Mass<'N2O'>>>([], zeroN2O);
    expect(result.unit).toMatchObject({ __unitType: 'Mass', substance: 'N2O' });
    expect(result.unit.store.toNumber()).toBe(0);
    expect(result.from).toEqual([]);
  });

  it('returns the single item unchanged in value and unit for a one-item array', () => {
    const item = root(mass('CO2', 7));
    const result = sum([item], zeroCO2);
    expect(result.unit.__unitType).toBe('Mass');
    expect(result.unit.substance).toBe('CO2');
    expect(result.unit.store.toNumber()).toBe(7);
  });

  it('adds every item in the array, preserving the unit of the first item', () => {
    const items = [
      root(mass('CO2', 1)),
      root(mass('CO2', 2)),
      root(mass('CO2', 3)),
    ];
    const result = sum(items, zeroCO2);
    expect(result.unit.substance).toBe('CO2');
    expect(result.unit.store.toNumber()).toBe(6);
    expect(result.from).toBe(items);
    expect(result.originType).toBe('sum');
  });

  it('carries a dual-track (method 1/2) value through correctly', () => {
    const method1Only = root(mass('CH4', 2));
    const dualTrack = input(mass('CH4', 5), {
      name: 'method2',
      method: '2',
      modules: [],
    });
    const result = sum([method1Only, dualTrack], zeroCH4);
    expect(result.unit.store.toNumber()).toBe(7);
  });
  it('takes the unit from a later item when the first item is void', () => {
    const result = sum([voidMass<'N2O'>(), root(mass('N2O', 15.6))], zeroN2O);
    expect(result.unit.__unitType).toBe('Mass');
    expect(result.unit.substance).toBe('N2O');
    expect(result.unit.store.toNumber()).toBe(15.6);
  });

  it('keeps every item when void items are interleaved', () => {
    const empty = voidMass<'CO2'>();
    const result = sum(
      [empty, root(mass('CO2', 2)), empty, root(mass('CO2', 3))],
      zeroCO2,
    );
    expect(result.unit.substance).toBe('CO2');
    expect(result.unit.store.toNumber()).toBe(5);
  });

  it('takes the fallback unit when every item is void', () => {
    const empty = voidMass<'CO2'>();
    const result = sum([empty, empty], zeroCO2);
    expect(result.unit).toMatchObject({ __unitType: 'Mass', substance: 'CO2' });
    expect(result.unit.store.toNumber()).toBe(0);
  });

  it('keeps the fallback unit out of a sum of plain numbers', () => {
    const result = sum([root(realNumber(1)), root(realNumber(2))], zero);
    expect(result.unit.__unitType).toBe('RealNumber');
    expect(result.unit.store.toNumber()).toBe(3);
  });

  // The tests below sum mixed units, which the types reject, to pin down what happens at runtime
  // if a mix gets through anyway, e.g. via a cast

  it('takes the unit from a later item when the first item is a plain number', () => {
    // @ts-expect-error: mixed units
    const result = sum([root(realNumber(0)), root(mass('CH4', 4))], zeroCH4);
    expect(result.unit).toMatchObject({ __unitType: 'Mass', substance: 'CH4' });
    expect(result.unit.store.toNumber()).toBe(4);
  });

  it('takes the substance of the first item', () => {
    const result = sum<RootContainer<Mass<'CO2'> | Mass<'CH4'>>>(
      [root(mass('CO2', 1)), root(mass('CH4', 2))],
      // @ts-expect-error: mixed units
      zeroCH4,
    );
    expect(result.unit.substance).toBe('CO2');
  });

  it('reports mismatched units the same way `plus` does', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    try {
      const result = sum<RootContainer<Mass<'CO2'> | Area>>(
        [root(mass('CO2', 1)), root(area(2))],
        // @ts-expect-error: mixed units
        zeroCO2,
      );
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('add does not support'),
      );
      expect(result.unit.__unitType).toBe('RealNumber');
      expect(result.unit.store.toNumber()).toBe(3);
    } finally {
      consoleError.mockRestore();
    }
  });
});
