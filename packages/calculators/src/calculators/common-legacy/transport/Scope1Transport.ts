import { TruckType } from '@/types/enums';
import { ExecutionContext } from '../../executionContext';

export function calculateScope1TransportBase(
  typeOfTruck: TruckType,
  distanceCattleTransported: number,
  type: 'CO2' | 'CH4' | 'N2O',
  context: ExecutionContext,
) {
  const { constants } = context;

  const truckFuelUsage = constants.COMMON.TRANSPORT_FUEL_USAGE[typeOfTruck];

  const dieselFuelkL = (truckFuelUsage * distanceCattleTransported) / 1000;

  const energyContentFactor = 38.6;

  const emissions =
    (dieselFuelkL *
      energyContentFactor *
      constants.COMMON.TRANSPORT_ECF[type]) /
    1000;

  return emissions;
}

export function calculateScope1TransportCO2(
  typeOfTruck: TruckType,
  distanceCattleTransported: number,
  context: ExecutionContext,
) {
  return calculateScope1TransportBase(
    typeOfTruck,
    distanceCattleTransported,
    'CO2',
    context,
  );
}

export function calculateScope1TransportCH4(
  typeOfTruck: TruckType,
  distanceCattleTransported: number,
  context: ExecutionContext,
) {
  return calculateScope1TransportBase(
    typeOfTruck,
    distanceCattleTransported,
    'CH4',
    context,
  );
}

export function calculateScope1TransportN2O(
  typeOfTruck: TruckType,
  distanceCattleTransported: number,
  context: ExecutionContext,
) {
  return calculateScope1TransportBase(
    typeOfTruck,
    distanceCattleTransported,
    'N2O',
    context,
  );
}
