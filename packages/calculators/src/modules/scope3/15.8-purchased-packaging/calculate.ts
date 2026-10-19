import { ExecutionContext } from '@/calculators/executionContext';
import { HasCommonConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { captureMethod1Or2Value } from '@/tools/multi';
import { sum } from '@/tools/sum';
import { voidUnit } from '@/tools/units';
import { isPurchasedPackagingByUnits } from './base-purchased-packaging.input';
import {
  PurchasedPackagingByMassMethod1InputTransformed,
  PurchasedPackagingByUnitsMethod1InputTransformed,
} from './method1-purchased-packaging.input';
import {
  PurchasedPackagingByMassMethod2InputTransformed,
  PurchasedPackagingByUnitsMethod2InputTransformed,
} from './method2-purchased-packaging.input';
import {
  purchasedPackagingIsMethod1,
  PurchasedPackagingsInputTransformed,
} from './purchased-packagings.input';

const getEmissionsFactorByUnits = (
  packaging:
    | PurchasedPackagingByUnitsMethod1InputTransformed
    | PurchasedPackagingByUnitsMethod2InputTransformed,
  constants: HasCommonConstants,
) => {
  if (purchasedPackagingIsMethod1(packaging)) {
    return captureMethod1Or2Value(
      selectConstant(
        constants.COMMON,
        'PURCHASED_PACKAGING_FACTORS_BY_UNITS',
        packaging.type,
      ),
      undefined,
    );
  }
  return captureMethod1Or2Value(voidUnit(), packaging.customEmissionsFactor);
};

const getEmissionsFactorByMass = (
  packaging:
    | PurchasedPackagingByMassMethod1InputTransformed
    | PurchasedPackagingByMassMethod2InputTransformed,
  constants: HasCommonConstants,
) => {
  if (purchasedPackagingIsMethod1(packaging)) {
    return captureMethod1Or2Value(
      selectConstant(
        constants.COMMON,
        'PURCHASED_PACKAGING_FACTORS_BY_MASS',
        packaging.type,
      ),
      undefined,
    );
  }
  return captureMethod1Or2Value(voidUnit(), packaging.customEmissionsFactor);
};

const getEmissionsByUnits = (
  packaging:
    | PurchasedPackagingByUnitsMethod1InputTransformed
    | PurchasedPackagingByUnitsMethod2InputTransformed,
  constants: HasCommonConstants,
) => {
  const emissionsFactor = getEmissionsFactorByUnits(packaging, constants).named(
    'EFp',
  );
  return emissionsFactor
    .multiply(packaging.amountUnits)
    .reference('15.8.1.1 (1)');
};

const getEmissionsByMass = (
  packaging:
    | PurchasedPackagingByMassMethod1InputTransformed
    | PurchasedPackagingByMassMethod2InputTransformed,
  constants: HasCommonConstants,
) => {
  const emissionsFactor = getEmissionsFactorByMass(packaging, constants).named(
    'EFp',
  );
  return emissionsFactor
    .multiply(packaging.amountMass)
    .reference('15.8.1.1 (1)');
};

export const calculatePurchasedPackaging = (
  input: PurchasedPackagingsInputTransformed,
  context: ExecutionContext,
) => {
  /**
   * E = SUM Qp * EFp
   */
  const { constants } = context;
  const packagingEmissions = input.purchasedPackaging.map((packaging) => {
    return isPurchasedPackagingByUnits(packaging)
      ? getEmissionsByUnits(packaging, constants)
      : getEmissionsByMass(packaging, constants);
  });

  return sum(packagingEmissions);
};
