import {
  PurchasedFeedAquacultureType,
  PurchasedFeedAquacultureTypes,
  PurchasedFeedLivestockRegionalType,
  PurchasedFeedLivestockRegionlessType,
  PurchasedFeedLivestockRegionlessTypes,
  PurchasedFeedLivestockType,
  PurchasedFeedLivestockTypesPerRegion,
  PurchasedFeedRegion,
  PurchasedFeedRegions,
} from '@/constants/enums';

export const checkPurchasedFeedRegion = (
  region: string | undefined,
): PurchasedFeedRegion | undefined => {
  if (
    region !== undefined &&
    !PurchasedFeedRegions.includes(region as PurchasedFeedRegion)
  ) {
    throw new Error(`Invalid purchased feed region: "${region}"`);
  }
  return region as PurchasedFeedRegion;
};

export const checkPurchasedFeedTypeInRegion = (
  type: string | undefined,
  region?: PurchasedFeedRegion,
): PurchasedFeedAquacultureType | PurchasedFeedLivestockType => {
  if (region === undefined) {
    if (
      PurchasedFeedAquacultureTypes.includes(
        type as PurchasedFeedAquacultureType,
      ) ||
      PurchasedFeedLivestockRegionlessTypes.includes(
        type as PurchasedFeedLivestockRegionlessType,
      )
    ) {
      return type as
        | PurchasedFeedAquacultureType
        | PurchasedFeedLivestockRegionlessType;
    }
  } else if (
    (
      PurchasedFeedLivestockTypesPerRegion[
        region
      ] as readonly PurchasedFeedLivestockRegionalType[]
    ).includes(type as PurchasedFeedLivestockRegionalType)
  ) {
    return type as PurchasedFeedLivestockRegionalType;
  }
  throw new Error(`Invalid purchased feed type: "${type}"`);
};
