import {
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
