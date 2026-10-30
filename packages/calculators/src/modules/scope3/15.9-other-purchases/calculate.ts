import { zeroCO2e } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { OtherPurchasedGoodsAndServicesInputTransformed } from './input';

export function calculateOtherPurchasedGoodsAndServicesEmissions(
  input: OtherPurchasedGoodsAndServicesInputTransformed,
) {
  if (
    input.otherPurchasedGoodsAndServices === undefined ||
    input.otherPurchasedGoodsAndServices.length === 0
  ) {
    return zeroCO2e;
  }
  const emissions = input.otherPurchasedGoodsAndServices.map((item) =>
    item.quantity.multiply(item.emissionsFactor),
  );
  // Guarantees preservation of the unit (i.e. no 'void' unit)
  return sum(emissions, zeroCO2e);
}
