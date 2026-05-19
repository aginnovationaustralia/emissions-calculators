import { AgrochemicalType, AgrochemicalTypes } from '@/constants/enums';

export const checkAgrichemicalType = (
  type: string | undefined,
): AgrochemicalType => {
  if (!AgrochemicalTypes.includes(type as AgrochemicalType)) {
    throw new Error(`Invalid agrichemical type: ${type}`);
  }
  return type as AgrochemicalType;
};
