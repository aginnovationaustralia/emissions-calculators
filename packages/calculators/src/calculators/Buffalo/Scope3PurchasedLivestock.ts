import { BuffaloClasses } from '@/types/Buffalo/buffaloclasses.input';
import { BuffaloClassesAPI } from '@/types/enums';
import { ExecutionContext } from '../executionContext';
import { ConstantsForBuffaloCalculator } from './constants';

export function calculateScope3PurchaseLivestock(
  classes: BuffaloClasses,
  context: ExecutionContext<ConstantsForBuffaloCalculator>,
) {
  const totalKg = BuffaloClassesAPI.reduce((acc, cur) => {
    const cls = classes[cur];

    const totalPurchaseKg = (cls?.purchases ?? []).reduce((accP, curP) => {
      return accP + curP.head * curP.purchaseWeight;
    }, 0);

    return acc + totalPurchaseKg;
  }, 0);

  const scope3 =
    context.constants.LIVESTOCK.PURCHASED_LIVESTOCK_EF.BUFFALO * totalKg;

  const scope3Tonnes = scope3 / 1000;

  return scope3Tonnes;
}
