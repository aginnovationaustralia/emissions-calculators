import { nv } from '@/tools/inputs';
import { massInTonnes } from '@/tools/unit-conversion';
import {
  calculateOtherPurchasedGoodsAndServicesEmissions,
  OtherPurchasedGoodsAndServicesInput,
  OtherPurchasedGoodsAndServicesSchema,
} from '../scope3/15.9-other-purchases';
import { collectInputs } from '@/tools/collect';

// This is just testing multiplying two given numbers, so we can keep this simple.
describe('15.9 Other Purchased Goods and Services', () => {
  it('handles undefined', () => {
    const result = calculateOtherPurchasedGoodsAndServicesEmissions(
      OtherPurchasedGoodsAndServicesSchema.parse({}),
    );
    expect(massInTonnes(result).toNumber()).toEqual(0);
  });
  it('handles empty array and preserves unit', () => {
    const result = calculateOtherPurchasedGoodsAndServicesEmissions(
      OtherPurchasedGoodsAndServicesSchema.parse({
        otherPurchasedGoodsAndServices: [],
      }),
    );
    expect(massInTonnes(result).toNumber()).toEqual(0);
    expect(result.unit.substance).toEqual('CO2e');
  });
  it('calculates correct result', () => {
    const input: OtherPurchasedGoodsAndServicesInput = {
      otherPurchasedGoodsAndServices: [
        {
          quantity: nv(1),
          emissionsFactor: nv(2),
        },
        {
          quantity: nv(100),
          emissionsFactor: nv(0.2),
        },
      ],
    };
    const result = calculateOtherPurchasedGoodsAndServicesEmissions(
      OtherPurchasedGoodsAndServicesSchema.parse(input),
    );
    expect(massInTonnes(result).toNumber()).toEqual(22);

    const collectedInputs = collectInputs(result);

    expect(collectedInputs).toEqual(
      expect.arrayOf(
        expect.objectContaining({
          modules: expect.arrayContaining(['15.9']),
        }),
      ),
    );
  });
});
