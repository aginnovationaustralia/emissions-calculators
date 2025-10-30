import { ExecutionContext } from '../../executionContext';
import { TruckType } from '../../types/types';

// typeOfTruck (dataInputD103, transportC10, transportC15)
// distanceCattleTransported (transportD101, transportC5)

export function calculateScope1TransportBase(
  typeOfTruck: TruckType,
  distanceCattleTransported: number,
  type: 'CO2' | 'CH4' | 'N2O',
  context: ExecutionContext,
) {
  const { constants } = context;

  // (transportD15)
  const truckFuelUsage = constants.COMMON.TRANSPORT_FUEL_USAGE[typeOfTruck];

  // (transportD17)
  const dieselFuelkL = (truckFuelUsage * distanceCattleTransported) / 1000;

  // (transportD18)
  const energyContentFactor = 38.6;

  // (transportD31, dataSummaryC9)
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
