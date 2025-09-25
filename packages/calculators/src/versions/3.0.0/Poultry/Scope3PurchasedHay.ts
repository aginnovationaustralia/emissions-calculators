import { ExecutionContext } from '../executionContext';
import { ConstantsForPoultryCalculator } from './constants';

export function calculateScope3PurchasedHay(
  hayPurchased: number,
  context: ExecutionContext<ConstantsForPoultryCalculator>,
) {
  // (Data_SummaryC19, Embedded_Emissions_F34)
  const hayEmissions =
    hayPurchased * context.constants.COMMON.FEED_PURCHASED.hay.TotalGHG;
  return hayEmissions;
}
