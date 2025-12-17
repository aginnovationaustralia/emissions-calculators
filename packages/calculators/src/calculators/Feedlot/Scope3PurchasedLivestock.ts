import {
  BEEF_CLASSES_BREEDING_API,
  BEEF_CLASSES_TRADING_API,
} from '@/constants/constants';
import { FeedlotPurchases } from '@/types/Feedlot/purchases.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForFeedlotCalculator } from './constants';

export function calculateScope3PurchaseLivestock(
  purchases: FeedlotPurchases,
  context: ExecutionContext<ConstantsForFeedlotCalculator>,
) {
  const { constants } = context;

  const breedingTotalEmissionsKg = BEEF_CLASSES_BREEDING_API.reduce(
    (acc, cur) => {
      const totalPurchaseEmissions = (purchases[cur] ?? []).reduce(
        (accP, curP) => {
          const breedingSourceEF =
            constants.FEEDLOT.PURCHASELIVESTOCK_EF[curP.purchaseSource];
          return accP + curP.head * curP.purchaseWeight * breedingSourceEF;
        },
        0,
      );

      return acc + totalPurchaseEmissions;
    },
    0,
  );

  const tradeTotalEmissionsKg = BEEF_CLASSES_TRADING_API.reduce((acc, cur) => {
    const totalPurchaseEmissions = (purchases[cur] ?? []).reduce(
      (accP, curP) => {
        const breedingSourceEF =
          constants.FEEDLOT.PURCHASELIVESTOCK_EF[curP.purchaseSource];
        return accP + curP.head * curP.purchaseWeight * breedingSourceEF;
      },
      0,
    );

    return acc + totalPurchaseEmissions;
  }, 0);

  const breedingTonnes = breedingTotalEmissionsKg / 1000;
  const tradingTonnes = tradeTotalEmissionsKg / 1000;

  return {
    breeding: breedingTonnes,
    trading: tradingTonnes,
    total: breedingTonnes + tradingTonnes,
  };
}
