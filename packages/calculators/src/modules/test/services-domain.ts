import {
  ServiceByAreaType,
  ServiceByAreaTypes,
  ServiceByHourType,
  ServiceByHourTypes,
} from '@/calculators/Grains/constants/enums';

export const checkServiceByAreaType = (
  type: string | undefined,
): ServiceByAreaType => {
  if (!ServiceByAreaTypes.includes(type as ServiceByAreaType)) {
    throw new Error(`Invalid service by area type: ${type}`);
  }
  return type as ServiceByAreaType;
};

export const checkServiceByHourType = (
  type: string | undefined,
): ServiceByHourType => {
  if (!ServiceByHourTypes.includes(type as ServiceByHourType)) {
    throw new Error(`Invalid service by hour type: ${type}`);
  }
  return type as ServiceByHourType;
};
