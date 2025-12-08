import { ExecutionContext } from '../executionContext';
import { ConstantsForPoultryCalculator } from './constants';

export function calculateScope3PurchasedHay(
  hayPurchased: number,
  context: ExecutionContext<ConstantsForPoultryCalculator>,
) {
  const hayEmissions =
    hayPurchased * context.constants.COMMON.FEED_PURCHASED.hay.TotalGHG;
  return hayEmissions;
}
