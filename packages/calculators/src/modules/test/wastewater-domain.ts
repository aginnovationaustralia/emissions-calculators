import {
  WastewaterCommodities,
  WastewaterCommodity,
  WastewaterFacilityType,
  WastewaterFacilityTypes,
} from '@/constants/enums';

export const checkWastewaterTreatmentFacilityType = (
  type: string | undefined,
): WastewaterFacilityType => {
  if (!WastewaterFacilityTypes.includes(type as WastewaterFacilityType)) {
    throw new Error(`Invalid organic waste type: ${type}`);
  }
  return type as WastewaterFacilityType;
};

export const checkWastewaterCommodityType = (
  type: string | undefined,
): WastewaterCommodity => {
  if (!WastewaterCommodities.includes(type as WastewaterCommodity)) {
    throw new Error(`Invalid organic waste type: ${type}`);
  }
  return type as WastewaterCommodity;
};
