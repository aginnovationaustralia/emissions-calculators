import {
  RiceCultivationOrganicAmendmentType,
  RiceCultivationOrganicAmendmentTypes,
  RiceCultivationPreSeasonWaterRegimeType,
  RiceCultivationPreSeasonWaterRegimeTypes,
  RiceCultivationSeasonWaterRegimeType,
  RiceCultivationSeasonWaterRegimeTypes,
} from '@/constants/enums';

export const checkWaterRegimeType = (
  regime: string | undefined,
): RiceCultivationSeasonWaterRegimeType => {
  if (
    !RiceCultivationSeasonWaterRegimeTypes.includes(
      regime as RiceCultivationSeasonWaterRegimeType,
    )
  ) {
    throw new Error(`Invalid water regime type: ${regime}`);
  }
  return regime as RiceCultivationSeasonWaterRegimeType;
};

export const checkPreSeasonWaterRegimeType = (
  regime: string | undefined,
): RiceCultivationPreSeasonWaterRegimeType => {
  if (
    !RiceCultivationPreSeasonWaterRegimeTypes.includes(
      regime as RiceCultivationPreSeasonWaterRegimeType,
    )
  ) {
    throw new Error(`Invalid pre-season water regime type: ${regime}`);
  }
  return regime as RiceCultivationPreSeasonWaterRegimeType;
};

export const checkOrganicAmendmentType = (
  amendment: string | undefined,
): RiceCultivationOrganicAmendmentType => {
  if (
    !RiceCultivationOrganicAmendmentTypes.includes(
      amendment as RiceCultivationOrganicAmendmentType,
    )
  ) {
    throw new Error(`Invalid organic amendment type: ${amendment}`);
  }
  return amendment as RiceCultivationOrganicAmendmentType;
};
