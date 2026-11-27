import { realNumber, voidUnit } from '../units.js';
import { values, ValueStore } from '../value-store.js';
import {
  area,
  formatUnit,
  isKnownPackageUnit,
  KnownPackageUnit,
  mass,
  massPerMass,
  massPerVolume,
} from './index.js';

describe('formatUnit', () => {
  it('formats string and boolean units', () => {
    expect(formatUnit('A')).toBe('string: (A)');
    expect(formatUnit(true)).toBe('boolean');
  });

  it('formats the core number units', () => {
    expect(formatUnit(realNumber(1))).toBe('real number');
    expect(formatUnit(voidUnit())).toBe('Void');
  });

  it('formats library units, naming their substances', () => {
    expect(formatUnit(area(1))).toBe('m^2');
    expect(formatUnit(mass('CO2', 1))).toBe('kg CO2');
    expect(formatUnit(massPerMass('CO2', 'Fuel'))).toBe('kg CO2/kg Fuel');
    expect(formatUnit(massPerVolume('CO2', 'Fuel'))).toBe('kg CO2/L Fuel');
  });

  it('names substances with substanceName when given', () => {
    expect(formatUnit(mass('N', 1), { substanceName: (s) => `<${s}>` })).toBe(
      'kg <N>',
    );
  });
});

describe('isKnownPackageUnit', () => {
  it('accepts core and library units', () => {
    expect(isKnownPackageUnit('A')).toBe(true);
    expect(isKnownPackageUnit(false)).toBe(true);
    expect(isKnownPackageUnit(voidUnit())).toBe(true);
    expect(isKnownPackageUnit(mass('CO2', 1))).toBe(true);
  });

  it('rejects number units it does not know', () => {
    expect(isKnownPackageUnit({ __unitType: 'Widget', store: values(1) })).toBe(
      false,
    );
  });

  it('does not treat object prototype keys as known units', () => {
    expect(
      isKnownPackageUnit({ __unitType: 'toString', store: values(1) }),
    ).toBe(false);
  });

  it('narrows a union of package and local units to the local units', () => {
    type Widget = { __unitType: 'Widget'; store: ValueStore; colour: string };
    const format = (unit: KnownPackageUnit | Widget): string =>
      isKnownPackageUnit(unit) ? formatUnit(unit) : `${unit.colour} widgets`;
    expect(format(mass('CO2', 1))).toBe('kg CO2');
    expect(
      format({ __unitType: 'Widget', store: values(1), colour: 'red' }),
    ).toBe('red widgets');
  });
});
