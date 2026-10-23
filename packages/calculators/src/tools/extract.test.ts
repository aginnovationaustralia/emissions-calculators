import { num, root } from './containers';
import { extractMassAsNumber, extractRealNumberAsNumber } from './extract';
import { head, mass, massPerHead } from './units';

describe('extractMassAsNumber', () => {
  it('returns the stored mass in kg', () => {
    expect(extractMassAsNumber(root(mass('Clean Wool', 431)))).toBe(431);
  });

  it('returns the mass produced by multiplying a mass per head by a head count', () => {
    const woolPerHead = root(massPerHead('Clean Wool', 3));
    const sheep = root(head(10));

    expect(extractMassAsNumber(sheep.multiply(woolPerHead))).toBe(30);
  });

  it('rejects containers of other units at compile time', () => {
    // @ts-expect-error a mass per head is not a mass
    extractMassAsNumber(root(massPerHead('Clean Wool', 3)));
    // @ts-expect-error a real number is not a mass
    extractMassAsNumber(num(0.5));
  });
});

describe('extractRealNumberAsNumber', () => {
  it('returns the stored value', () => {
    expect(extractRealNumberAsNumber(num(0.25))).toBe(0.25);
  });

  it('rejects containers of other units at compile time', () => {
    // @ts-expect-error a mass is not a real number
    extractRealNumberAsNumber(root(mass('CO2e', 1)));
  });
});
