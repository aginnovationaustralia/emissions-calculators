import { ExecutionContext } from '@/calculators/executionContext';
import { AllConstants } from '@/constants/types';
import {
  purchasedMineralSupplementIsMethod1,
  PurchasedMineralSupplementsInputTransformed,
} from './purchased-mineral-supplements.input';
import { selectConstant } from '@/tools/constants';
import { sum } from '@/tools/sum';

export const calculatePurchasedMineralSupplements = (
  input: PurchasedMineralSupplementsInputTransformed,
  context: ExecutionContext<AllConstants>,
) => {
  /**
   * E = SUM Qm * EFm
   */
  const { constants } = context;
  const mineralEmissions = input.purchasedMineralSupplements.map((mineral) => {
    const emissionsFactor = purchasedMineralSupplementIsMethod1(mineral)
      ? selectConstant(
          constants.LIVESTOCK,
          'PURCHASED_MINERAL_SUPPLEMENT_FACTORS',
          mineral.type,
        )
      : mineral.customEmissionsFactor;

    return mineral.amount.multiply(emissionsFactor);
  });

  return sum(mineralEmissions);
};
