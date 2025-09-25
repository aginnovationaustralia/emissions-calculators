import { ExecutionContext } from '../executionContext';
import { LivestockPurchase } from '../types/livestockPurchase.input';
import { ConstantsForPoultryCalculator } from './constants';

export function calculateScope3PurchasedLivestock(
  purchases: LivestockPurchase[],
  purchasedFreeRange: number,
  context: ExecutionContext<ConstantsForPoultryCalculator>,
) {
  const { constants } = context;

  // (Data_Input_BroilersG132)
  const totalLiveweight = purchases.reduce((acc, purchase) => {
    return acc + purchase.head * purchase.purchaseWeight;
  }, 0);

  // (Purchased_Poultry_EmissionsD3)
  const conventionalLiveweight = (1.0 - purchasedFreeRange) * totalLiveweight;

  // (Purchased_Poultry_EmissionsF3)
  const conventionalEmissions =
    conventionalLiveweight *
    constants.COMMON.PURCHASED_LIVESTOCK_EF.POULTRY_CONVENTIONAL;

  // (Purchased_Poultry_EmissionsG3)
  const conventionalTonnes = conventionalEmissions / 1000;

  // (Purchased_Poultry_EmissionsD4)
  const freeRangeLiveweight = purchasedFreeRange * totalLiveweight;

  // (Purchased_Poultry_EmissionsF4)
  const freeRangeEmissions =
    freeRangeLiveweight *
    constants.COMMON.PURCHASED_LIVESTOCK_EF.POULTRY_FREE_RANGE;

  // (Purchased_Poultry_EmissionsG4)
  const freeRangeTonnes = freeRangeEmissions / 1000;

  // (Data_SummaryC23, Purchased_Poultry_EmissionsG5)
  const purchasedEmissionsTonnes = conventionalTonnes + freeRangeTonnes;
  return purchasedEmissionsTonnes;
}
