import { RootContainer, root } from './containers';
import { input } from './inputs';
import { sum } from './sum';
import { Area, area, isVoid, mass, Mass, realNumber } from './units';

// `sum` underlies every aggregation across seasons/classes/herds in the calculators. Its
// unit-inference for the empty-array case, and its use of the first item's unit as the "root"
// for the rest, are easy to get subtly wrong.

describe('sum', () => {
  it('returns a void, zero-valued container for an empty array', () => {
    // The generic can't be inferred from an empty array literal; pin it to any NumberContainer
    // so `result.unit` is typed, even though the runtime value is void regardless of the pin.
    const result = sum<RootContainer<Mass<'CO2'>>>([]);
    expect(isVoid(result.unit)).toBe(true);
    expect(result.unit.store.toNumber()).toBe(0);
    expect(result.from).toEqual([]);
  });

  it('returns the single item unchanged in value and unit for a one-item array', () => {
    const item = root(mass('CO2', 7));
    const result = sum([item]);
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
    const result = sum(items);
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
    const result = sum([method1Only, dualTrack]);
    expect(result.unit.store.toNumber()).toBe(7);
  });
  it('takes the unit from a later item when the first item is an empty sum', () => {
    // e.g. the first crop has no fertiliser applications, so its own figure is an empty sum
    const emptyFirst = sum<RootContainer<Mass<'N2O'>>>([]);
    const result = sum([emptyFirst, root(mass('N2O', 15.6))]);
    expect(result.unit.__unitType).toBe('Mass');
    expect(result.unit.substance).toBe('N2O');
    expect(result.unit.store.toNumber()).toBe(15.6);
  });

  it('keeps every item when void items are interleaved', () => {
    const empty = sum<RootContainer<Mass<'CO2'>>>([]);
    const result = sum([
      empty,
      root(mass('CO2', 2)),
      empty,
      root(mass('CO2', 3)),
    ]);
    expect(result.unit.substance).toBe('CO2');
    expect(result.unit.store.toNumber()).toBe(5);
  });

  it('stays void when every item is void', () => {
    const empty = sum<RootContainer<Mass<'CO2'>>>([]);
    const result = sum([empty, empty]);
    expect(isVoid(result.unit)).toBe(true);
    expect(result.unit.store.toNumber()).toBe(0);
  });

  it('takes the unit from a later item when the first item is a plain number', () => {
    const result = sum([root(realNumber(0)), root(mass('CH4', 4))]);
    expect(result.unit).toMatchObject({ __unitType: 'Mass', substance: 'CH4' });
    expect(result.unit.store.toNumber()).toBe(4);
  });

  it('reports mismatched units the same way `plus` does', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    try {
      const result = sum<RootContainer<Mass<'CO2'> | Area>>([
        root(mass('CO2', 1)),
        root(area(2)),
      ]);
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
