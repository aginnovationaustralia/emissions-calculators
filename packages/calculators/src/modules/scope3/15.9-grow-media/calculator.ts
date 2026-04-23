import { ExecutionContext } from '@/calculators/executionContext';
import {
  purchasedGrowMediaIsMethod1,
  PurchasedGrowMediasInputTransformed,
} from './purchased-grow-media.input';
import { AllConstants } from '@/constants/types';
import { purchasedGrowMediaMethod1IsByMass } from './method1-purchased-grow-media.input';
import { selectConstant } from '@/tools/constants';
import { sum } from '@/tools/sum';
import { purchasedGrowMediaMethod2IsByMass } from './method2-purchased-grow-media.input';

export const calculatePurchasedGrowMedia = (
  input: PurchasedGrowMediasInputTransformed,
  context: ExecutionContext<AllConstants>,
) => {
  /**
   * E = SUM (Qg * EFg)
   */
  const { constants } = context;

  const growMediaEmissions = input.purchasedGrowMedia.map((growMedia) => {
    if (purchasedGrowMediaIsMethod1(growMedia)) {
      if (purchasedGrowMediaMethod1IsByMass(growMedia)) {
        return growMedia.amount.multiply(
          selectConstant(
            constants.COMMON,
            'PURCHASED_GROW_MEDIA_FACTORS',
            'byMass',
            growMedia.type,
          ),
        );
      }

      return selectConstant(
        constants.COMMON,
        'PURCHASED_GROW_MEDIA_FACTORS',
        'byVolume',
        growMedia.type,
      ).multiply(growMedia.amount);
    }

    if (purchasedGrowMediaMethod2IsByMass(growMedia)) {
      return growMedia.amount.multiply(growMedia.customEmissionsFactorByMass);
    }
    return growMedia.customEmissionsFactorByVolume.multiply(growMedia.amount);
  });
  return sum(growMediaEmissions);
};
