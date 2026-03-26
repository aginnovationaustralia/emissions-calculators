import {
  RefrigerantType,
  RefrigerantTypes,
  RefrigerationType,
  RefrigerationTypes,
} from '@/constants/enums';

export const checkRefrigerantType = (
  type: string | undefined,
): RefrigerantType => {
  if (!RefrigerantTypes.includes(type as RefrigerantType)) {
    throw new Error(`Invalid refrigerant type: ${type}`);
  }
  return type as RefrigerantType;
};

export const checkRefrigerationType = (
  type: string | undefined,
): RefrigerationType => {
  if (!RefrigerationTypes.includes(type as RefrigerationType)) {
    throw new Error(`Invalid fuel stationary solid type: ${type}`);
  }
  return type as RefrigerationType;
};
