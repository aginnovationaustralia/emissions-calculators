import { GoatClasses } from '@/types/Goat/goatclasses.input';
import { GoatClassesAPI } from '@/types/types';
import { ExecutionContext } from '../executionContext';
import { ConstantsForGoatCalculator } from './constants';

// breedingSource dataInputD114

export function calculateScope3PurchaseLivestock(
  classes: GoatClasses,
  context: ExecutionContext<ConstantsForGoatCalculator>,
) {
  const { constants } = context;

  const totalKg = GoatClassesAPI.reduce((acc, cur) => {
    const cls = classes[cur];
    const purchases =
      cls?.purchases && cls.purchases.length > 0
        ? cls.purchases
        : [
            {
              head: cls?.headPurchased ?? 0,
              purchaseWeight: cls?.purchasedWeight ?? 0,
            },
          ];

    const totalPurchaseKg = purchases.reduce((accP, curP) => {
      return accP + curP.head * curP.purchaseWeight;
    }, 0);

    return acc + totalPurchaseKg;
  }, 0);

  const cwt = totalKg * 0.45;

  const scope3 = constants.LIVESTOCK.PURCHASED_LIVESTOCK_EF.GOAT * cwt;

  const scope3Tonnes = scope3 / 1000;

  return scope3Tonnes;
}
