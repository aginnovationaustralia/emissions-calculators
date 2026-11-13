import {
  A,
  B,
  createUnitSystem,
  division,
  multiplication,
  placeholder,
  UnitError,
  values,
  ValueStore,
} from './index.js';
import { Equal, expectType } from './test-helpers.js';
import {
  Electricity,
  electricity,
  energy,
  Energy,
  mass,
  Mass,
  massPerMass,
  volume,
  Volume,
  volumePerMass,
} from './units/index.js';

type EnergyPerElectricity = {
  __unitType: 'EnergyPerElectricity';
  store: ValueStore;
};
const energyPerElectricity = (value?: number): EnergyPerElectricity => ({
  __unitType: 'EnergyPerElectricity',
  store: values(value),
});

const units = createUnitSystem({
  multiply: [
    // VolumePerMass<A, B> * Mass<B> = Volume<A>
    multiplication(volumePerMass(A, B), mass(B), volume(A)),
    // Mass<B> * MassPerMass<A, B> = Mass<A>: A is only on the right
    multiplication(mass(B), massPerMass(A, B), mass(A)),
    // Units without substances
    multiplication(electricity(), energyPerElectricity(), energy()),
  ],
  divide: [
    // Volume<A> / Mass<B> = VolumePerMass<A, B>
    division(volume(A), mass(B), volumePerMass(A, B)),
  ],
});

describe('pattern rules', () => {
  test('match substances from the left unit', () => {
    const rate = units.root(volumePerMass('Milk', 'DryMatter', 2));
    const milk = rate.multiply(units.root(mass('DryMatter', 3)));
    expectType<Equal<(typeof milk)['unit']['substance'], 'Milk'>>(true);
    const typed: Volume<'Milk'> = milk.unit;
    expect(typed).toMatchObject({ __unitType: 'Volume', substance: 'Milk' });
    expect(milk.unit.store.toNumber()).toBe(6);
  });

  test('reject a substance the pattern does not allow, at compile time and runtime', () => {
    const rate = units.root(volumePerMass('Milk', 'DryMatter', 2));
    // @ts-expect-error the mass must be DryMatter, B in the pattern
    expect(() => rate.multiply(units.root(mass('CO2', 3)))).toThrow(UnitError);
  });

  test('bind placeholders that only the right unit has', () => {
    const ch4 = units.root(mass('CH4', 2));
    const co2e = ch4.multiply(units.root(massPerMass('CO2e', 'CH4', 28)));
    const typed: Mass<'CO2e'> = co2e.unit;
    expect(typed.substance).toBe('CO2e');
    expect(co2e.unit.store.toNumber()).toBe(56);
    const n2oGwp = units.root(massPerMass('CO2e', 'N2O', 1));
    // @ts-expect-error the GWP of N2O can't convert CH4
    expect(() => ch4.multiply(n2oGwp)).toThrow(UnitError);
  });

  test('work for units without substances', () => {
    const consumed = units
      .root(electricity(2))
      .multiply(units.root(energyPerElectricity(3.6e6)));
    const typed: Energy = consumed.unit;
    expect(typed.__unitType).toBe('Energy');
    expect(consumed.unit.store.toNumber()).toBe(7.2e6);
    const kwh: Electricity = electricity(1);
    expect(kwh.__unitType).toBe('Electricity');
  });

  test('make division rules too', () => {
    const rate = units
      .root(volume('Milk', 6))
      .divide(units.root(mass('DryMatter', 3)));
    expect(rate.unit).toMatchObject({
      __unitType: 'VolumePerMass',
      volume: 'Milk',
      mass: 'DryMatter',
    });
    expect(rate.unit.store.toNumber()).toBe(2);
  });

  test('reject a result with a placeholder neither side has', () => {
    const C2 = placeholder('C2');
    expect(() => multiplication(mass(A), massPerMass(A, A), mass(C2))).toThrow(
      'uses placeholders that neither side has: C2',
    );
  });
});
