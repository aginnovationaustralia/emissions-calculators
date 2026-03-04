import {
  OrganicWasteType,
  OrganicWasteTypes,
  SolidWasteIncinerationType,
  SolidWasteIncinerationTypes,
  SolidWasteLandfillType,
  SolidWasteLandfillTypes,
} from '@/calculators/Grains/constants/enums';

export const checkSolidWasteLandfillType = (
  type: string | undefined,
): SolidWasteLandfillType => {
  if (!SolidWasteLandfillTypes.includes(type as SolidWasteLandfillType)) {
    throw new Error(`Invalid solid waste landfill type: ${type}`);
  }
  return type as SolidWasteLandfillType;
};

export const checkSolidWasteIncinerationType = (
  type: string | undefined,
): SolidWasteIncinerationType => {
  if (
    !SolidWasteIncinerationTypes.includes(type as SolidWasteIncinerationType)
  ) {
    throw new Error(`Invalid solid waste incineration type: ${type}`);
  }
  return type as SolidWasteIncinerationType;
};

export const checkOrganicWasteType = (
  type: string | undefined,
): OrganicWasteType => {
  if (!OrganicWasteTypes.includes(type as OrganicWasteType)) {
    throw new Error(`Invalid organic waste type: ${type}`);
  }
  return type as OrganicWasteType;
};
