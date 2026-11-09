import {
  PurchasedMineralSupplementType,
  PurchasedMineralSupplementTypes,
} from '@/constants/enums';

export const checkPurchasedMineralSupplementType = (
  type: string | undefined,
): PurchasedMineralSupplementType => {
  if (
    !PurchasedMineralSupplementTypes.includes(
      type as PurchasedMineralSupplementType,
    )
  ) {
    throw new Error(`Invalid purchased mineral supplement type: ${type}`);
  }
  return type as PurchasedMineralSupplementType;
};
