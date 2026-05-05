import { FreightType, FreightTypes } from '@/constants/enums';

export const checkFreightType = (type: string | undefined): FreightType => {
  if (!FreightTypes.includes(type as FreightType)) {
    throw new Error(`Invalid freight type: ${type}`);
  }
  return type as FreightType;
};
