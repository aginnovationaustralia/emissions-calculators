import { DeerClasses } from '@/types/Deer/deerclasses.input';
import { DeerClassesAPI } from '@/types/types';
import { ExecutionContext } from '../executionContext';
import { ConstantsForDeerCalculator } from './constants';

export function calculateScope3PurchaseLivestock(
  classes: DeerClasses,
  context: ExecutionContext<ConstantsForDeerCalculator>,
) {
  const totalKg = DeerClassesAPI.reduce((acc, cur) => {
    const cls = classes[cur];

    const totalPurchaseKg = (cls?.purchases ?? []).reduce((accP, curP) => {
      return accP + curP.head * curP.purchaseWeight;
    }, 0);

    return acc + totalPurchaseKg;
  }, 0);

  const scope3 =
    context.constants.LIVESTOCK.PURCHASED_LIVESTOCK_EF.DEER * totalKg;
  const scope3Tonnes = scope3 / 1000;

  return scope3Tonnes;
}
