import {
  PurchasedPackagingType,
  PurchasedPackagingTypes,
} from '@/constants/enums';

export const checkPurchasedPackagingType = (
  type: string | undefined,
): PurchasedPackagingType => {
  if (!PurchasedPackagingTypes.includes(type as PurchasedPackagingType)) {
    throw new Error(`Invalid purchased packaging type: ${type}`);
  }
  return type as PurchasedPackagingType;
};
