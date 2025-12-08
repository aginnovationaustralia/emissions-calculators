import { LivestockPurchase } from '@/types/livestockPurchase.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForPoultryCalculator } from './constants';

export function calculateScope3PurchasedLivestock(
  purchases: LivestockPurchase[],
  purchasedFreeRange: number,
  context: ExecutionContext<ConstantsForPoultryCalculator>,
) {
  const { constants } = context;

  const totalLiveweight = purchases.reduce((acc, purchase) => {
    return acc + purchase.head * purchase.purchaseWeight;
  }, 0);

  const conventionalLiveweight = (1.0 - purchasedFreeRange) * totalLiveweight;

  const conventionalEmissions =
    conventionalLiveweight *
    constants.LIVESTOCK.PURCHASED_LIVESTOCK_EF.POULTRY_CONVENTIONAL;

  const conventionalTonnes = conventionalEmissions / 1000;

  const freeRangeLiveweight = purchasedFreeRange * totalLiveweight;

  const freeRangeEmissions =
    freeRangeLiveweight *
    constants.LIVESTOCK.PURCHASED_LIVESTOCK_EF.POULTRY_FREE_RANGE;

  const freeRangeTonnes = freeRangeEmissions / 1000;

  const purchasedEmissionsTonnes = conventionalTonnes + freeRangeTonnes;
  return purchasedEmissionsTonnes;
}
