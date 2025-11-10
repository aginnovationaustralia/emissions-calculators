import { AquacultureCustomBaitPurchase } from '@/types/Aquaculture/custombaitpurchase.input';
import { WildCatchFisheryBaitPurchase } from '@/types/WildCatchFishery/baitpurchase.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForWildCatchFisheryCalculator } from './constants';

export function calculatePurchasedBait(
  bait: WildCatchFisheryBaitPurchase[],
  context: ExecutionContext<ConstantsForWildCatchFisheryCalculator>,
) {
  const { constants } = context;

  const baitCO2 = bait.reduce(
    (
      acc,
      { type, purchasedTonnes, additionalIngredients, emissionsIntensity },
    ) => {
      const baitEF = constants.FISHERIES.BAIT_EF[type];
      const mainEmissions =
        purchasedTonnes * (1 - additionalIngredients) * baitEF;
      const additionalEmissions =
        purchasedTonnes * additionalIngredients * emissionsIntensity;

      return acc.concat([[mainEmissions, additionalEmissions]]);
    },
    [] as [number, number][],
  );

  return baitCO2.reduce(
    (acc, [mainEmissions, additionalEmissions]) =>
      acc + mainEmissions + additionalEmissions,
    0,
  );
}

export function calculateCustomBait(bait: AquacultureCustomBaitPurchase[]) {
  const results = bait.reduce(
    (acc, { purchasedTonnes, emissionsIntensity }) => {
      return acc.concat([purchasedTonnes * emissionsIntensity]);
    },
    [] as number[],
  );

  return results.reduce((acc, emissions) => acc + emissions, 0);
}
