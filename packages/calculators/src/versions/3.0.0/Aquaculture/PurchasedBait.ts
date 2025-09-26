import { ExecutionContext } from '../executionContext';
import { AquacultureBaitPurchase } from '../types/Aquaculture/baitpurchase.input';
import { AquacultureCustomBaitPurchase } from '../types/Aquaculture/custombaitpurchase.input';
import { ConstantsForAquacultureCalculator } from './constants';

export function calculatePurchasedBait(
  bait: AquacultureBaitPurchase[],
  context: ExecutionContext<ConstantsForAquacultureCalculator>,
) {
  const { constants } = context;

  const baitCO2 = bait.reduce(
    (
      acc,
      { type, purchasedTonnes, additionalIngredients, emissionsIntensity },
    ) => {
      const baitEF = constants.AQUACULTURE.AQUACULTURE_BAIT_EF[type];
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
