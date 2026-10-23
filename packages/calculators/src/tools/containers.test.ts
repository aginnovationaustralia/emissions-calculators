import Decimal from 'decimal.js-light';
import { BaseContainer, br, num, relabelMass, root } from './containers';
import { input } from './inputs';
import {
  area,
  days,
  distance,
  electricity,
  energyPerHeadPerDay,
  energyPerMass,
  head,
  isVoid,
  mass,
  massDistance,
  massPerArea,
  massPerElectricity,
  massPerHead,
  massPerHeadPerDay,
  massPerMass,
  massPerMassDistance,
  massPerTime,
  NumberUnit,
  time,
  voidUnit,
  volumePerMass,
  years,
} from './units';

/**
 * The dispatcher's fallback branches (console.error + left-unit passthrough for an unsupported
 * multiply/divide combo; RealNumber fallback for minus/plus across differing __unitTypes) exist
 * precisely for unit combinations with no declared overload, so exercising them means
 * deliberately going around the overload set. This gives back the runtime `multiply`/`divide`/
 * `minus`/`plus` API for an arbitrary `NumberUnit` pairing, without `any` leaking into the
 * assertions below.
 */
type UntypedArithmetic = {
  multiply: (right: BaseContainer<NumberUnit>) => BaseContainer<NumberUnit>;
  divide: (right: BaseContainer<NumberUnit>) => BaseContainer<NumberUnit>;
  minus: (right: BaseContainer<NumberUnit>) => BaseContainer<NumberUnit>;
  plus: (right: BaseContainer<NumberUnit>) => BaseContainer<NumberUnit>;
};
const bypassOverloads = (
  container: BaseContainer<NumberUnit>,
): UntypedArithmetic => container as unknown as UntypedArithmetic;

describe('BaseContainer.multiply', () => {
  it('void * real number => void', () => {
    const result = root(voidUnit()).multiply(num(5));
    expect(isVoid(result.unit)).toBe(true);
  });

  it('real number * void => void', () => {
    const result = num(5).multiply(root(voidUnit()));
    expect(isVoid(result.unit)).toBe(true);
  });

  it('RealNumber * Mass => Mass, preserving the right-hand substance', () => {
    const result = num(2).multiply(root(mass('CO2', 3)));
    expect(result.unit.__unitType).toBe('Mass');
    expect(result.unit.store.toNumber()).toBe(6);
  });

  it('Mass * RealNumber => Mass, preserving the left-hand substance', () => {
    const result = root(mass('CO2', 3)).multiply(num(2));
    expect(result.unit.__unitType).toBe('Mass');
    expect(result.unit.substance).toBe('CO2');
    expect(result.unit.store.toNumber()).toBe(6);
  });

  it('MassPerArea * Area => Mass(substance)', () => {
    const result = root(massPerArea('CO2', 2)).multiply(root(area(3)));
    expect(result.unit.__unitType).toBe('Mass');
    expect(result.unit.substance).toBe('CO2');
    expect(result.unit.store.toNumber()).toBe(6);
  });

  it('Head * MassPerHead => Mass(substance)', () => {
    const result = root(head(4)).multiply(root(massPerHead('CO2e', 1.5)));
    expect(result.unit.__unitType).toBe('Mass');
    expect(result.unit.substance).toBe('CO2e');
    expect(result.unit.store.toNumber()).toBe(6);
  });

  it('MassPerHeadPerDay * Head => MassPerDay(substance)', () => {
    const result = root(massPerHeadPerDay('CH4', 2)).multiply(root(head(5)));
    expect(result.unit.__unitType).toBe('MassPerDay');
    expect(result.unit.substance).toBe('CH4');
    expect(result.unit.store.toNumber()).toBe(10);
  });

  it('MassPerHeadPerDay * Days => MassPerHead(substance)', () => {
    const result = root(massPerHeadPerDay('CH4', 2)).multiply(root(days(3)));
    expect(result.unit.__unitType).toBe('MassPerHead');
    expect(result.unit.substance).toBe('CH4');
    expect(result.unit.store.toNumber()).toBe(6);
  });

  it('MassPerMass * Mass(denominator substance) => Mass(numerator substance)', () => {
    const result = root(massPerMass('CO2e', 'Refrigerant', 2)).multiply(
      root(mass('Refrigerant', 4)),
    );
    expect(result.unit.__unitType).toBe('Mass');
    expect(result.unit.substance).toBe('CO2e');
    expect(result.unit.store.toNumber()).toBe(8);
  });

  it('Mass * MassPerMass => Mass(numerator substance)', () => {
    const result = root(mass('Refrigerant', 4)).multiply(
      root(massPerMass('CO2e', 'Refrigerant', 2)),
    );
    expect(result.unit.__unitType).toBe('Mass');
    expect(result.unit.substance).toBe('CO2e');
    expect(result.unit.store.toNumber()).toBe(8);
  });

  it('EnergyPerMass * Mass => Energy', () => {
    const result = root(energyPerMass('Fuel', 2)).multiply(
      root(mass('Fuel', 3)),
    );
    expect(result.unit.__unitType).toBe('Energy');
    expect(result.unit.store.toNumber()).toBe(6);
  });

  it('Electricity * MassPerElectricity => Mass(substance)', () => {
    const result = root(electricity(10)).multiply(
      root(massPerElectricity('CO2e', 0.5)),
    );
    expect(result.unit.__unitType).toBe('Mass');
    expect(result.unit.substance).toBe('CO2e');
    expect(result.unit.store.toNumber()).toBe(5);
  });

  it('MassPerTime * Time => Mass(substance)', () => {
    const result = root(massPerTime('CO2', 2)).multiply(root(time(3)));
    expect(result.unit.__unitType).toBe('Mass');
    expect(result.unit.store.toNumber()).toBe(6);
  });

  it('Mass * Distance => MassDistance(substance)', () => {
    const result = root(mass('Freight Goods', 2)).multiply(root(distance(3)));
    expect(result.unit.__unitType).toBe('MassDistance');
    expect(result.unit.substance).toBe('Freight Goods');
    expect(result.unit.store.toNumber()).toBe(6);
  });

  it('MassPerMassDistance * Distance => MassPerMass(snum, sdenom)', () => {
    const result = root(
      massPerMassDistance('CO2e', 'Freight Goods', 2),
    ).multiply(root(distance(3)));
    expect(result.unit.__unitType).toBe('MassPerMass');
    expect(result.unit.snum).toBe('CO2e');
    expect(result.unit.sdenom).toBe('Freight Goods');
    expect(result.unit.store.toNumber()).toBe(6);
  });

  it('MassPerMassDistance * MassDistance => Mass(snum)', () => {
    const result = root(
      massPerMassDistance('CO2e', 'Freight Goods', 2),
    ).multiply(root(massDistance('Freight Goods', 3)));
    expect(result.unit.__unitType).toBe('Mass');
    expect(result.unit.substance).toBe('CO2e');
    expect(result.unit.store.toNumber()).toBe(6);
  });

  it('MassPerHeadPerDay * VolumePerMass => VolumePerHeadPerDay, tagged with the LEFT substance', () => {
    const result = root(massPerHeadPerDay('Volatile Solids', 2)).multiply(
      root(volumePerMass('CH4', 'Volatile Solids', 3)),
    );
    expect(result.unit.__unitType).toBe('VolumePerHeadPerDay');
    expect(result.unit.substance).toBe('CH4');
    expect(result.unit.store.toNumber()).toBe(6);
  });

  it('falls back to the left-hand unit and logs an error for an unsupported combination', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // Head * Area is not a defined combination in the dispatcher.
    const result = bypassOverloads(root(head(2))).multiply(root(area(3)));
    expect(result.unit.__unitType).toBe('Head');
    expect(result.unit.store.toNumber()).toBe(6);
    expect(errorSpy).toHaveBeenCalledTimes(1);
    errorSpy.mockRestore();
  });

  it('sets the correct originType, type, left and right on the resulting BinaryContainer', () => {
    const left = root(mass('CO2', 2)).named('left');
    const right = num(3).named('right');
    const result = left.multiply(right);
    expect(result.originType).toBe('binary');
    expect(result.type).toBe('multiply');
    expect(result.left).toBe(left);
    expect(result.right).toBe(right);
  });
});

describe('BaseContainer.divide', () => {
  it('propagates void from either side', () => {
    const result = root(voidUnit()).divide(num(2));
    expect(isVoid(result.unit)).toBe(true);
  });

  it('Mass / Area => MassPerArea(substance)', () => {
    const result = root(mass('CO2', 10)).divide(root(area(5)));
    expect(result.unit.__unitType).toBe('MassPerArea');
    expect(result.unit.substance).toBe('CO2');
    expect(result.unit.store.toNumber()).toBe(2);
  });

  it('Mass / MassPerMass => Mass(denominator substance)', () => {
    const result = root(mass('CO2e', 10)).divide(
      root(massPerMass('CO2e', 'Refrigerant', 2)),
    );
    expect(result.unit.__unitType).toBe('Mass');
    expect(result.unit.substance).toBe('Refrigerant');
    expect(result.unit.store.toNumber()).toBe(5);
  });

  it('MassPerArea / Years => MassPerAreaPerYear(substance)', () => {
    const result = root(massPerArea('CO2', 10)).divide(root(years(5)));
    expect(result.unit.__unitType).toBe('MassPerAreaPerYear');
    expect(result.unit.substance).toBe('CO2');
    expect(result.unit.store.toNumber()).toBe(2);
  });

  it('MassPerHead / Days => MassPerHeadPerDay(substance)', () => {
    const result = root(massPerHead('CH4', 10)).divide(root(days(5)));
    expect(result.unit.__unitType).toBe('MassPerHeadPerDay');
    expect(result.unit.substance).toBe('CH4');
    expect(result.unit.store.toNumber()).toBe(2);
  });

  it('MassPerHeadPerDay / MassPerMass => MassPerHeadPerDay(denominator substance)', () => {
    const result = root(massPerHeadPerDay('CO2e', 10)).divide(
      root(massPerMass('CO2e', 'Refrigerant', 2)),
    );
    expect(result.unit.__unitType).toBe('MassPerHeadPerDay');
    expect(result.unit.substance).toBe('Refrigerant');
    expect(result.unit.store.toNumber()).toBe(5);
  });

  it('EnergyPerHeadPerDay / EnergyPerMass => MassPerHeadPerDay(substance)', () => {
    const result = root(energyPerHeadPerDay(10)).divide(
      root(energyPerMass('DryMatter', 2)),
    );
    expect(result.unit.__unitType).toBe('MassPerHeadPerDay');
    expect(result.unit.substance).toBe('DryMatter');
    expect(result.unit.store.toNumber()).toBe(5);
  });

  it('same unit type / same unit type => RealNumber', () => {
    const result = root(mass('CO2', 10)).divide(root(mass('CO2', 4)));
    expect(result.unit.__unitType).toBe('RealNumber');
    expect(result.unit.store.toNumber()).toBe(2.5);
  });

  it('falls back to the left-hand unit and logs an error for an unsupported combination', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // Head / Area is not a defined combination in the dispatcher.
    const result = bypassOverloads(root(head(10))).divide(root(area(2)));
    expect(result.unit.__unitType).toBe('Head');
    expect(result.unit.store.toNumber()).toBe(5);
    expect(errorSpy).toHaveBeenCalledTimes(1);
    errorSpy.mockRestore();
  });
});

describe('BaseContainer.minus / plus', () => {
  it('void - void => void', () => {
    const result = root(voidUnit()).minus(root(voidUnit()));
    expect(isVoid(result.unit)).toBe(true);
  });

  it('RealNumber - typed unit keeps the typed unit', () => {
    const result = num(10).minus(root(mass('CO2', 3)));
    expect(result.unit.__unitType).toBe('Mass');
    expect(result.unit.store.toNumber()).toBe(7);
  });

  it('typed unit - RealNumber keeps the typed unit', () => {
    const result = root(mass('CO2', 10)).minus(num(3));
    expect(result.unit.__unitType).toBe('Mass');
    expect(result.unit.store.toNumber()).toBe(7);
  });

  it('same __unitType keeps that unit, regardless of substance', () => {
    // NOTE: subtraction across differing substances of the same __unitType (e.g. CO2 vs CH4
    // Mass) is accepted by this branch without complaint - it does not check substance equality.
    const result = bypassOverloads(root(mass('CO2', 10))).minus(
      root(mass('CH4', 3)),
    );
    expect(result.unit.__unitType).toBe('Mass');
    expect(result.unit.store.toNumber()).toBe(7);
  });

  it('differing __unitType falls back to RealNumber', () => {
    const result = bypassOverloads(root(mass('CO2', 10))).minus(root(area(3)));
    expect(result.unit.__unitType).toBe('RealNumber');
    expect(result.unit.store.toNumber()).toBe(7);
  });

  it('plus mirrors minus type-coercion, adding values', () => {
    const result = bypassOverloads(root(mass('CO2', 10))).plus(
      root(mass('CH4', 3)),
    );
    expect(result.unit.__unitType).toBe('Mass');
    expect(result.unit.store.toNumber()).toBe(13);
  });
});

describe('BaseContainer.power / squared / min', () => {
  it('power always returns a RealNumber', () => {
    const result = root(mass('CO2', 2)).power(num(3));
    expect(result.unit.__unitType).toBe('RealNumber');
    expect(result.unit.store.toNumber()).toBe(8);
  });

  it('squared multiplies the container by itself, keeping the unit', () => {
    const result = root(mass('CO2', 4)).squared();
    expect(result.unit.__unitType).toBe('Mass');
    expect(result.unit.store.toNumber()).toBe(16);
    expect(result.type).toBe('power');
    expect(result.right.unit.store.toNumber()).toBe(2);
  });

  it('min clamps values above the limit', () => {
    const result = root(mass('CO2', 10)).min(num(5));
    expect(result.unit.store.toNumber()).toBe(5);
  });

  it('min leaves values at or below the limit unchanged', () => {
    const result = root(mass('CO2', 3)).min(num(5));
    expect(result.unit.store.toNumber()).toBe(3);
  });

  it('max clamps values below the limit', () => {
    const result = root(mass('CO2', 10)).max(num(5));
    expect(result.unit.store.toNumber()).toBe(10);
  });

  it('max leaves values at or above the limit unchanged', () => {
    const result = root(mass('CO2', 3)).max(num(5));
    expect(result.unit.store.toNumber()).toBe(5);
  });
});

describe('BaseContainer metadata: attach / named / clone', () => {
  it('named returns a new container carrying the name, without mutating the original', () => {
    const original = num(1);
    const namedContainer = original.named('one');

    expect(namedContainer).not.toBe(original);
    expect(namedContainer.core?.name).toBe('one');
    expect(original.core?.name).toBeUndefined();
  });

  it('attach merges metadata onto a clone, preserving existing fields not overridden', () => {
    const original = num(1)
      .named('one')
      .attach({ references: ['REF-A'] });
    const attached = original.attach({ quality: { Temporal: '1' } });

    expect(attached).not.toBe(original);
    expect(attached.core?.name).toBe('one');
    expect(attached.core?.references).toEqual(['REF-A']);
    expect(attached.core?.quality).toEqual({ Temporal: '1' });
    // original is untouched
    expect(original.core?.quality).toBeUndefined();
  });

  it('clone preserves the concrete class / prototype of the container', () => {
    const original = input(mass('CO2', 5), { name: 'x', modules: [] });
    const namedContainer = original.named('renamed');
    expect(namedContainer).toBeInstanceOf(
      Object.getPrototypeOf(original).constructor,
    );
    expect(namedContainer.method).toBe(original.method);
  });
});

describe('num / root / br helpers', () => {
  it('num wraps a plain number as a RealNumber RootContainer', () => {
    const container = num(new Decimal(5));
    expect(container.originType).toBe('root');
    expect(container.unit.__unitType).toBe('RealNumber');
    expect(container.unit.store.toNumber()).toBe(5);
  });

  it('br wraps an inner container as a BracketedContainer with the same unit and value', () => {
    const inner = root(mass('CO2', 7));
    const bracketed = br(inner);
    expect(bracketed.originType).toBe('bracketed');
    expect(bracketed.inner).toBe(inner);
    expect(bracketed.unit.store.toNumber()).toBe(7);
  });
});

describe('relabelMass', () => {
  it('keeps the value and source while changing the substance', () => {
    const eggs = root(mass('Eggs', 12));
    const relabelled = relabelMass(eggs, 'Liveweight');

    expect(relabelled.unit.substance).toBe('Liveweight');
    expect(relabelled.unit.store.toNumber()).toBe(12);
    expect(relabelled.from).toBe(eggs);
  });

  it('lets deliberately equivalent masses be combined', () => {
    const liveweight = root(mass('Liveweight', 30));
    const eggs = root(mass('Eggs', 10));

    // @ts-expect-error different substances cannot be added directly
    liveweight.plus(eggs);

    expect(
      liveweight.plus(relabelMass(eggs, 'Liveweight')).unit.store.toNumber(),
    ).toBe(40);
  });
});
