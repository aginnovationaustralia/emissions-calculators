import { PorkClasses } from '@/types/Pork/porkclasses.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForPorkCalculator } from './constants';

export function calculateScope3PurchasedLivestock(
  classes: PorkClasses,
  context: ExecutionContext<ConstantsForPorkCalculator>,
) {
  const { constants } = context;

  const totalLiveweightPurchased = Object.keys(classes).reduce((acc, key) => {
    const porkClassKey = key as keyof PorkClasses;

    const cls = classes[porkClassKey];

    if (!cls) {
      return acc;
    }

    const purchases =
      cls.purchases && cls.purchases.length > 0 ? cls.purchases : [];

    const totalPurchaseKg = purchases.reduce((accP, curP) => {
      return accP + curP.head * curP.purchaseWeight;
    }, 0);

    return acc + totalPurchaseKg;
  }, 0);

  const scope3Kg =
    totalLiveweightPurchased * constants.LIVESTOCK.PURCHASED_LIVESTOCK_EF.PORK;

  return scope3Kg / 1000;
}
