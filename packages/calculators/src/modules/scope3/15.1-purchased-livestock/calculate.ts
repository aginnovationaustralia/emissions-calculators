import { ExecutionContext } from '@/calculators/executionContext';
import {
  otherPurchasedLivestockIsMethod2,
  OtherPurchasedLivestocksInputTransformed,
} from './other-purchased-livestock';
import { AllConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { sum } from '@/tools/sum';

export const calculateOtherPurchasedLivestockEmissions = (
  purchases: OtherPurchasedLivestocksInputTransformed,
  context: ExecutionContext<AllConstants>,
) => {
  const { constants } = context;

  const purchaseEmissions = purchases.livestockPurchases.map((p) => {
    const liveweight =
      p.averageLiveweight ??
      selectConstant(
        constants.LIVESTOCK,
        'OTHER_PURCHASED_LIVESTOCK_AVERAGE_LIVEWEIGHTS',
        p.type,
      );

    const emissionsFactor = otherPurchasedLivestockIsMethod2(p)
      ? p.emissionsFactor
      : selectConstant(
          constants.LIVESTOCK,
          'OTHER_PURCHASED_LIVESTOCK_FACTORS',
          p.type,
        );

    return emissionsFactor.multiply(p.headPurchased.multiply(liveweight));
  });
  return sum(purchaseEmissions);
};
