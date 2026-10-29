import { root } from './containers';
import { AnyNumberUnit, GenericNumberUnit } from './generic';
import { energyPerVolume, mass, NumberUnit, volume } from './units';

type TestSubstance = 'Liquid fuel' | 'Gaseous fuel';
type TestNumberUnit = GenericNumberUnit<TestSubstance>;

describe('GenericNumberUnit', () => {
  it('accepts units from its own substance vocabulary', () => {
    const unit: TestNumberUnit = volume('Liquid fuel', 1);
    expect(unit.__unitType).toBe('Volume');
  });

  it('rejects units from outside its substance vocabulary', () => {
    // @ts-expect-error 'Milk' is not a TestSubstance
    const unit: TestNumberUnit = volume('Milk', 1);
    expect(unit.__unitType).toBe('Volume');
  });

  it('keeps the VEERG NumberUnit restricted to VEERG substances', () => {
    // @ts-expect-error 'Liquid fuel' is not a VEERG Substance
    const unit: NumberUnit = mass('Liquid fuel', 1);
    const anyUnit: AnyNumberUnit = unit;
    expect(anyUnit.__unitType).toBe('Mass');
  });

  it('lets containers combine units from a custom vocabulary', () => {
    const ec = root(energyPerVolume('Liquid fuel', 2));
    const quantity = root(volume('Liquid fuel', 3));
    expect(ec.multiply(quantity).unit.store.toNumber()).toBe(6);

    // @ts-expect-error substances must still match within a custom vocabulary
    ec.multiply(root(volume('Gaseous fuel', 3)));
  });
});
