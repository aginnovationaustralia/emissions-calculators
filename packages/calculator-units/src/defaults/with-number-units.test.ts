import { AnyContainer, childrenOf, realNumber, values } from '../index.js';
import { Equal, expectType } from '../test-helpers.js';
import {
  defaultUnitSystem,
  energy,
  formatUnit,
  KnownPackageNumberUnit,
  KnownPackageUnit,
  mass,
} from './index.js';

const units = defaultUnitSystem.withNumberUnits<KnownPackageNumberUnit>();

describe('withNumberUnits', () => {
  it('builds containers that work like the unlimited system', () => {
    const total = units
      .root(mass('CO2', 2))
      .multiply(units.num(3))
      .plus(units.root(mass('CO2', 1)));
    expect(total.unit.store.value.toNumber()).toBe(7);
  });

  it('types the history of a calculation with the system units', () => {
    const total = units.root(energy(2)).multiply(units.num(3));
    const children = childrenOf(total);
    expectType<
      Equal<
        (typeof children)[number],
        AnyContainer<'1' | '2' | '3' | '4', KnownPackageUnit>
      >
    >(true);
    // Every unit in the history can be formatted by the package, without narrowing
    expect(children.map((c) => formatUnit(c.unit))).toEqual([
      'J',
      'real number',
    ]);
  });

  it('only takes roots and inputs in the system units', () => {
    // @ts-expect-error: not a unit of this system
    units.root({ __unitType: 'Widget', store: values(1) });
    // @ts-expect-error: not a unit of this system
    units.input({ __unitType: 'Widget', store: values(1) }, { name: 'w' });
    expect(units.root(realNumber(1)).unit.__unitType).toBe('RealNumber');
  });

  it('keeps the units when methods are narrowed or rules extended', () => {
    const narrowed = units.withMethods('1', '2').extend({});
    // @ts-expect-error: not a unit of this system
    narrowed.root({ __unitType: 'Widget', store: values(1) });
    expect(narrowed.methods).toEqual(['1', '2']);
  });
});
