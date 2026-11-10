import { zeroCO2e } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { OtherPurchasedGoodsAndServicesInputTransformed } from './input';

export function calculateOtherPurchasedGoodsAndServicesEmissions(
  input: OtherPurchasedGoodsAndServicesInputTransformed,
) {
  const emissions = (input.otherPurchasedGoodsAndServices ?? []).map((item) =>
    item.quantity.multiply(item.emissionFactor),
  );
  return sum(emissions, zeroCO2e);
}
