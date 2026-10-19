import { loadConstants } from '@/calculators/executionContext';
import { applyConstantOverrides, ConstantOverrides } from './overrides';

describe('applyConstantOverrides', () => {
  it('replaces the value of a nested unit with the override number', () => {
    const base = loadConstants();
    const original = base.CROP.INORGANIC_FERTILISER_FRACTIONS.Urea.N;

    const { constants, warnings } = applyConstantOverrides(base, {
      CROP: { INORGANIC_FERTILISER_FRACTIONS: { Urea: { N: 0.123 } } },
    });

    expect(warnings).toEqual([]);
    const overridden = constants.CROP.INORGANIC_FERTILISER_FRACTIONS.Urea.N;
    expect(overridden.store.value.toNumber()).toBe(0.123);
    expect(overridden.__unitType).toBe(original.__unitType);
    expect(overridden.snum).toBe(original.snum);
    expect(overridden.sdenom).toBe(original.sdenom);
  });

  it('does not modify the original constants', () => {
    const base = loadConstants();
    const original = base.CROP.INORGANIC_FERTILISER_FRACTIONS.Urea.N;
    const originalValue = original.store.value.toNumber();

    applyConstantOverrides(base, {
      CROP: { INORGANIC_FERTILISER_FRACTIONS: { Urea: { N: 0.123 } } },
    });

    expect(base.CROP.INORGANIC_FERTILISER_FRACTIONS.Urea.N).toBe(original);
    expect(
      loadConstants().CROP.INORGANIC_FERTILISER_FRACTIONS.Urea.N.store.value.toNumber(),
    ).toBe(originalValue);
  });

  it('keeps untouched branches by reference', () => {
    const base = loadConstants();

    const { constants } = applyConstantOverrides(base, {
      CROP: { INORGANIC_FERTILISER_FRACTIONS: { Urea: { N: 0.123 } } },
    });

    expect(constants.COMMON).toBe(base.COMMON);
    expect(constants.CROP.CROPRESIDUE).toBe(base.CROP.CROPRESIDUE);
    expect(constants.CROP).not.toBe(base.CROP);
  });

  it('returns the constants unchanged when there are no overrides', () => {
    const base = loadConstants();

    const { constants, warnings } = applyConstantOverrides(base, undefined);

    expect(constants).toBe(base);
    expect(warnings).toEqual([]);
  });

  it('warns about overrides that do not match a constant', () => {
    const base = loadConstants();

    const { constants, warnings } = applyConstantOverrides(base, {
      CROP: { NOT_A_CONSTANT: 1 },
    } as ConstantOverrides);

    expect(warnings).toEqual([
      "Override for 'CROP.NOT_A_CONSTANT' does not match any constant",
    ]);
    expect(constants).toBe(base);
  });

  it('warns about overrides with the wrong shape', () => {
    const base = loadConstants();

    const { constants, warnings } = applyConstantOverrides(base, {
      CROP: {
        BURNING_N2O_EF: { nested: 1 },
        CROPRESIDUE: 5,
      },
    } as unknown as ConstantOverrides);

    expect(warnings).toEqual([
      "Override for 'CROP.BURNING_N2O_EF' must be a number, received object",
      "Override for 'CROP.CROPRESIDUE' must be an object, received number",
    ]);
    expect(constants).toBe(base);
  });
});
