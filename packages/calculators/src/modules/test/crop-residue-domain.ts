import {
  CropType,
  CropTypes,
  PastureType,
  PastureTypes,
  States,
} from '@/calculators/Grains/constants/enums';
import { State } from '@/types/enums';

export const checkCropType = (type: string | undefined): CropType => {
  if (!CropTypes.includes(type as CropType)) {
    throw new Error(`Invalid crop type: ${type}`);
  }
  return type as CropType;
};

export const checkPastureType = (type: string | undefined): PastureType => {
  if (!PastureTypes.includes(type as PastureType)) {
    throw new Error(`Invalid pasture type: ${type}`);
  }
  return type as PastureType;
};

export const checkState = (state: string | undefined): State => {
  const lowerState = state?.toLowerCase();
  const mappedState = lowerState === 'wa' ? 'wa_nw' : lowerState;
  if (!States.includes(mappedState as State)) {
    throw new Error(`Invalid state: ${state}`);
  }
  return mappedState as State;
};
