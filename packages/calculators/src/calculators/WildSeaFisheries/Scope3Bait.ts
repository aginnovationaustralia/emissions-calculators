import { WildSeaFisheriesBaitPurchase } from '@/types/WildSeaFisheries/baitpurchase.input';
import { WildSeaFisheriesCustomBaitPurchase } from '@/types/WildSeaFisheries/custombaitpurchase.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForWildSeaFisheriesCalculator } from './constants';

export function calculateScope3Bait(
  baits: WildSeaFisheriesBaitPurchase[],
  custombait: WildSeaFisheriesCustomBaitPurchase[],
  context: ExecutionContext<ConstantsForWildSeaFisheriesCalculator>,
) {
  const baitTotal = baits.reduce((acc, bait) => {
    const additional = bait.purchased * bait.additionalIngredient;
    const additionalEmissions = additional * bait.emissionsIntensity;

    const ef = context.constants.FISHERIES.BAIT_EF[bait.type];
    const emissions = (bait.purchased - additional) * ef;

    return acc + emissions + additionalEmissions;
  }, 0);

  const customBaitTotal = custombait.reduce((acc, bait) => {
    const emissions = bait.purchased * bait.emissionsIntensity;

    return acc + emissions;
  }, 0);

  return baitTotal + customBaitTotal;
}
