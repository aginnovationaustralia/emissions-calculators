import {
  FuelStationarySolidType,
  FuelStationarySolidTypes,
  FuelTransportVehicleType,
  FuelTransportVehicleTypes,
} from '@/constants/enums';

export const checkVehicleType = (
  type: string | undefined,
): FuelTransportVehicleType => {
  if (!FuelTransportVehicleTypes.includes(type as FuelTransportVehicleType)) {
    throw new Error(`Invalid vehicle type: ${type}`);
  }
  return type as FuelTransportVehicleType;
};

export const checkFuelStationarySolidType = (
  type: string | undefined,
): FuelStationarySolidType => {
  if (!FuelStationarySolidTypes.includes(type as FuelStationarySolidType)) {
    throw new Error(`Invalid fuel stationary solid type: ${type}`);
  }
  return type as FuelStationarySolidType;
};
