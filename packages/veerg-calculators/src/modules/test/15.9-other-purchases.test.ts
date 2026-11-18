import { testContext } from '@/test/Grains/context';
import { collectInputs } from '@/tools/collect';
import { nv } from '@/tools/inputs';
import { massInTonnes } from '@/tools/unit-conversion';
import {
  calculateOtherPurchasedGoodsAndServicesEmissions,
  OtherPurchasedGoodsAndServicesInput,
  OtherPurchasedGoodsAndServicesSchema,
} from '../scope3/15.9-other-purchases';

const context = testContext();

const calculate = (input: OtherPurchasedGoodsAndServicesInput) =>
  calculateOtherPurchasedGoodsAndServicesEmissions(
    OtherPurchasedGoodsAndServicesSchema.parse(input),
    context,
  );

const tonnes = (input: OtherPurchasedGoodsAndServicesInput) =>
  massInTonnes(calculate(input)).toNumber();

describe('15.9 Other Purchased Goods and Services', () => {
  it('handles undefined', () => {
    expect(tonnes({})).toEqual(0);
  });

  it('handles empty array and preserves unit', () => {
    const result = calculate({ otherPurchasedGoodsAndServices: [] });
    expect(massInTonnes(result).toNumber()).toEqual(0);
    expect(result.unit.substance).toEqual('CO2e');
  });

  it('calculates custom emissions factor items', () => {
    const result = calculate({
      otherPurchasedGoodsAndServices: [
        { quantity: nv(1), emissionFactor: nv(2) },
        { quantity: nv(100), emissionFactor: nv(0.2) },
      ],
    });
    expect(massInTonnes(result).toNumber()).toEqual(22);

    expect(collectInputs(result)).toEqual(
      expect.arrayOf(
        expect.objectContaining({
          modules: expect.arrayContaining(['15.9']),
        }),
      ),
    );
  });

  it('calculates seed by mass', () => {
    // 1000 kg * 0.239 kg CO2e/kg
    expect(
      tonnes({
        otherPurchasedGoodsAndServices: [
          { seedType: 'Barley grain (for seed)', quantityKilograms: nv(1000) },
        ],
      }),
    ).toBeCloseTo(0.239, 10);
  });

  it('calculates miscellaneous items per unit', () => {
    // 100 tags * 0.0424 + 10 kg * 9.81
    expect(
      tonnes({
        otherPurchasedGoodsAndServices: [
          { miscellaneousType: 'Animal ear tags (large)', quantity: nv(100) },
          { miscellaneousType: 'Nylon netting', quantity: nv(10) },
        ],
      }),
    ).toBeCloseTo((4.24 + 98.1) / 1000, 10);
  });

  it('calculates cleaning chemicals by mass', () => {
    // 50 kg * 0.804
    expect(
      tonnes({
        otherPurchasedGoodsAndServices: [
          { cleaningChemicalType: 'Bleach', quantityKilograms: nv(50) },
        ],
      }),
    ).toBeCloseTo(40.2 / 1000, 10);
  });

  it('calculates pharmacy chemicals per head treated', () => {
    // 200 head * 0.0142
    expect(
      tonnes({
        otherPurchasedGoodsAndServices: [
          {
            pharmacyChemicalType: 'Parasite control for cattle (internal)',
            headTreated: nv(200),
          },
        ],
      }),
    ).toBeCloseTo(2.84 / 1000, 10);
  });

  it('sums a mix of known goods and custom items', () => {
    expect(
      tonnes({
        otherPurchasedGoodsAndServices: [
          { seedType: 'Wheat grain (for seed)', quantityKilograms: nv(1000) },
          { quantity: nv(1), emissionFactor: nv(2) },
        ],
      }),
    ).toBeCloseTo(0.268 + 2, 10);
  });

  it('rejects an item mixing a known type with a custom emissions factor', () => {
    expect(() =>
      OtherPurchasedGoodsAndServicesSchema.parse({
        otherPurchasedGoodsAndServices: [
          {
            seedType: 'Wheat grain (for seed)',
            quantityKilograms: nv(1000),
            emissionFactor: nv(2),
          },
        ],
      }),
    ).toThrow();
  });
});
