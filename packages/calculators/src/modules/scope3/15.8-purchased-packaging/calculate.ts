import { ExecutionContext } from '@/calculators/executionContext';
import { AllConstants } from '@/constants/types';
import {
  purchasedPackagingIsMethod1,
  PurchasedPackagingsInputTransformed,
} from './purchased-packagings.input';
import { selectConstant } from '@/tools/constants';
import { sum } from '@/tools/sum';

export const calculatePurchasedPackagings = (
  input: PurchasedPackagingsInputTransformed,
  context: ExecutionContext<AllConstants>,
) => {
  /**
   * E = SUM Qp * EFp
   */
  const { constants } = context;
  const packagingEmissions = input.purchasedPackaging.map((packaging) => {
    const emissionsFactor = purchasedPackagingIsMethod1(packaging)
      ? selectConstant(
          constants.COMMON,
          'PURCHASED_PACKAGING_FACTORS',
          packaging.type,
        )
      : packaging.customEmissionsFactor;

    return packaging.amount.multiply(emissionsFactor);
  });

  return sum(packagingEmissions);
};
