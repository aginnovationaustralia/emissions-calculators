import { ExecutionContext } from '../executionContext';

export function calculateScope3PurchasedHay(hayPurchased: number, context: ExecutionContext) {
  // (Data_SummaryC19, Embedded_Emissions_F34)
  const hayEmissions = hayPurchased * context.constants.FEED_PURCHASED.hay.TotalGHG;
  return hayEmissions;
}
