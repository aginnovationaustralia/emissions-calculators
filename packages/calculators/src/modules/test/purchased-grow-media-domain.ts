import {
  PurchasedGrowMediaByMassType,
  PurchasedGrowMediaByMassTypes,
  PurchasedGrowMediaByVolumeType,
  PurchasedGrowMediaByVolumeTypes,
} from '@/constants/enums';

export const checkGrowMediaType = (
  growMedia: string | undefined,
): PurchasedGrowMediaByMassType | PurchasedGrowMediaByVolumeType => {
  if (
    !PurchasedGrowMediaByMassTypes.includes(
      growMedia as PurchasedGrowMediaByMassType,
    ) &&
    !PurchasedGrowMediaByVolumeTypes.includes(
      growMedia as PurchasedGrowMediaByVolumeType,
    )
  ) {
    throw new Error(`Invalid grow media type: ${growMedia}`);
  }
  return growMedia as
    | PurchasedGrowMediaByMassType
    | PurchasedGrowMediaByVolumeType;
};
