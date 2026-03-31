import {
  PurchasedFeedAquacultureType,
  PurchasedFeedAquacultureTypes,
  PurchasedFeedLivestockType,
  PurchasedFeedLivestockTypes,
} from '@/constants/enums';

export const checkPurchasedFeedType = (
  type: string | undefined,
): PurchasedFeedAquacultureType | PurchasedFeedLivestockType => {
  if (
    !(
      PurchasedFeedAquacultureTypes.includes(
        type as PurchasedFeedAquacultureType,
      ) ||
      PurchasedFeedLivestockTypes.includes(type as PurchasedFeedLivestockType)
    )
  ) {
    throw new Error(`Invalid purchased feed type: "${type}"`);
  }
  return type as PurchasedFeedAquacultureType | PurchasedFeedLivestockType;
};
