import {
  BasicCropProductionSystem,
  BasicCropProductionSystems,
  ClimateZoneType,
  ClimateZoneTypes,
  ExtendedCropProductionSystem,
  ExtendedCropProductionSystems,
  InorganicFertiliserType,
  InorganicFertiliserTypes,
  OrganicFertiliserType,
  OrganicFertiliserTypes,
} from '@/constants/enums';

export const checkInorganicFertiliserType = (
  type: string | undefined,
): InorganicFertiliserType => {
  if (!InorganicFertiliserTypes.includes(type as InorganicFertiliserType)) {
    throw new Error(`Invalid inorganic fertiliser type: ${type}`);
  }
  return type as InorganicFertiliserType;
};

export const checkBasicCropProductionSystem = (
  system: string | undefined,
): BasicCropProductionSystem => {
  if (
    !BasicCropProductionSystems.includes(system as BasicCropProductionSystem)
  ) {
    throw new Error(`Invalid basic crop production system: ${system}`);
  }
  return system as BasicCropProductionSystem;
};

export const checkExtendedCropProductionSystem = (
  system: string | undefined,
): ExtendedCropProductionSystem => {
  if (
    !ExtendedCropProductionSystems.includes(
      system as ExtendedCropProductionSystem,
    )
  ) {
    throw new Error(`Invalid extended crop production system: ${system}`);
  }
  return system as ExtendedCropProductionSystem;
};

export const checkLivestockManureType = (
  type: string | undefined,
): OrganicFertiliserType => {
  if (!OrganicFertiliserTypes.includes(type as OrganicFertiliserType)) {
    throw new Error(`Invalid livestock manure type: ${type}`);
  }
  return type as OrganicFertiliserType;
};

export const checkClimate = (climate: string | undefined): ClimateZoneType => {
  if (!ClimateZoneTypes.includes(climate as ClimateZoneType)) {
    throw new Error(`Invalid climate: ${climate}`);
  }
  return climate as ClimateZoneType;
};
