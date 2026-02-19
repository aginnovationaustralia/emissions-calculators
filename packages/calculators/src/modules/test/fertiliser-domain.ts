import {
  BasicCropProductionSystem,
  BasicCropProductionSystems,
  ExtendedCropProductionSystem,
  ExtendedCropProductionSystems,
  InorganicFertiliserType,
  InorganicFertiliserTypes,
} from '@/calculators/Grains/constants/enums';

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
