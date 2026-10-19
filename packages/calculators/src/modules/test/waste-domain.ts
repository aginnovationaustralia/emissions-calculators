import {
  SolidWasteLandfilTreatmentType,
  SolidWasteLandfilTreatmentTypes,
  SolidWasteManagedTreatmentType,
  SolidWasteManagedTreatmentTypes,
  SolidWasteNonStreamType,
  SolidWasteNonStreamTypes,
  SolidWasteOrganicType,
  SolidWasteOrganicTypes,
  SolidWasteScope3IncinerationType,
  SolidWasteScope3IncinerationTypes,
  SolidWasteScope3LandfillType,
  SolidWasteScope3LandfillTypes,
  SolidWasteUnmanagedTreatmentType,
  SolidWasteUnmanagedTreatmentTypes,
} from '@/constants/enums';

export const checkSolidWasteNonStreamType = (
  type: string | undefined,
): SolidWasteNonStreamType => {
  if (!SolidWasteNonStreamTypes.includes(type as SolidWasteNonStreamType)) {
    throw new Error(`Invalid scope 1 method 2 solid waste type: ${type}`);
  }
  return type as SolidWasteNonStreamType;
};

export const checkSolidWasteLandfillType = (
  type: string | undefined,
): SolidWasteScope3LandfillType => {
  if (
    !SolidWasteScope3LandfillTypes.includes(
      type as SolidWasteScope3LandfillType,
    )
  ) {
    throw new Error(`Invalid solid waste landfill type: ${type}`);
  }
  return type as SolidWasteScope3LandfillType;
};

export const checkSolidWasteIncinerationType = (
  type: string | undefined,
): SolidWasteScope3IncinerationType => {
  if (
    !SolidWasteScope3IncinerationTypes.includes(
      type as SolidWasteScope3IncinerationType,
    )
  ) {
    throw new Error(`Invalid solid waste incineration type: ${type}`);
  }
  return type as SolidWasteScope3IncinerationType;
};

export const checkOrganicWasteType = (
  type: string | undefined,
): SolidWasteOrganicType => {
  if (!SolidWasteOrganicTypes.includes(type as SolidWasteOrganicType)) {
    throw new Error(`Invalid organic waste type: ${type}`);
  }
  return type as SolidWasteOrganicType;
};

export const checkScope1WasteTreatmentType = (
  type: string | undefined,
):
  | Exclude<SolidWasteManagedTreatmentType, SolidWasteLandfilTreatmentType>
  | SolidWasteUnmanagedTreatmentType => {
  if (
    (!SolidWasteManagedTreatmentTypes.includes(
      type as SolidWasteManagedTreatmentType,
    ) &&
      !SolidWasteUnmanagedTreatmentTypes.includes(
        type as SolidWasteUnmanagedTreatmentType,
      )) ||
    SolidWasteLandfilTreatmentTypes.includes(
      type as SolidWasteLandfilTreatmentType,
    )
  ) {
    throw new Error(`Invalid scope 1 waste treatment type: ${type}`);
  }
  return type as
    | Exclude<SolidWasteManagedTreatmentType, SolidWasteLandfilTreatmentType>
    | SolidWasteUnmanagedTreatmentType;
};

export const checkManagedWasteTreatmentType = (
  type: string | undefined,
): SolidWasteManagedTreatmentType => {
  if (
    !SolidWasteManagedTreatmentTypes.includes(
      type as SolidWasteManagedTreatmentType,
    )
  ) {
    throw new Error(`Invalid waste treatment type: ${type}`);
  }
  return type as SolidWasteManagedTreatmentType;
};
