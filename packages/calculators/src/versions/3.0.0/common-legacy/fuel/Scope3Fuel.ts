import { CommonConstants } from '../../common/constants';
import { ExecutionContext } from '../../executionContext';

function getScope3FuelConstants(context: ExecutionContext<CommonConstants>) {
  const { constants } = context;
  const { STATIONARY, TRANSPORT } = constants.COMMON.FUEL_ENERGYGJ;

  /**
   * NOTE
   * When averaging was introduced in the GAF, it was introduced for
   * petrol and diesel as well. However, their energy content factors
   * don't vary, unlike LPG.
   */
  const tonnesDieselStationaryScope3EF =
    (STATIONARY.DIESEL.ENERGY_CONTENT_FACTOR * STATIONARY.DIESEL.SCOPE3_EF) /
    1000;
  const tonnesDieselTransportScope3EF =
    (TRANSPORT.DIESEL.ENERGY_CONTENT_FACTOR * TRANSPORT.DIESEL.SCOPE3_EF) /
    1000;
  const tonnesPetrolStationaryScope3EF =
    (STATIONARY.PETROL.ENERGY_CONTENT_FACTOR * STATIONARY.PETROL.SCOPE3_EF) /
    1000;
  const tonnesPetrolTransportScope3EF =
    (TRANSPORT.PETROL.ENERGY_CONTENT_FACTOR * TRANSPORT.PETROL.SCOPE3_EF) /
    1000;
  return {
    DIESEL_SCOPE3_EF_TONNES:
      (tonnesDieselStationaryScope3EF + tonnesDieselTransportScope3EF) / 2,
    PETROL_SCOPE3_EF_TONNES:
      (tonnesPetrolStationaryScope3EF + tonnesPetrolTransportScope3EF) / 2,
    LPG_SCOPE3_EF_TONNES:
      (TRANSPORT.LPG.SCOPE3_EF * TRANSPORT.LPG.ENERGY_CONTENT_FACTOR) / 1000,
    LPG_SCOPE3_EF_TONNES_STATIONARY:
      (STATIONARY.LPG.SCOPE3_EF * STATIONARY.LPG.ENERGY_CONTENT_FACTOR) / 1000,
  };
}

/**
 *
 * @param diesel Diesel usage for  Litres/year (dataInputBeefD95)
 * @param petrol Petrol usage for  Litres/year(dataInputBeefD96)
 * @returns
 */
export function calculateScope3FuelWithLPG(
  diesel: number,
  petrol: number,
  lpg: number,
  context: ExecutionContext<CommonConstants>,
) {
  const {
    DIESEL_SCOPE3_EF_TONNES,
    PETROL_SCOPE3_EF_TONNES,
    LPG_SCOPE3_EF_TONNES,
  } = getScope3FuelConstants(context);

  // (fuel_C4)
  const dieselkL = diesel / 1000;

  // (fuel_H4)
  const dieselScope3Tonnes = dieselkL * DIESEL_SCOPE3_EF_TONNES;

  // (fuel_C5)
  const petrolkL = petrol / 1000;

  // (fuel_H5)
  const petrolScope3Tonnes = petrolkL * PETROL_SCOPE3_EF_TONNES;

  // (fuel_C5)
  const lpgkL = lpg / 1000;

  // WARNING: Pork FuelH6 refers to M18 but should be M19
  const lpgScope3Tonnes = lpgkL * LPG_SCOPE3_EF_TONNES;

  // (fuel_H6)
  const totalScope3Tonnes =
    dieselScope3Tonnes + petrolScope3Tonnes + lpgScope3Tonnes;

  return totalScope3Tonnes;
}

export function calculateScope3FuelWithLPGStationary(
  diesel: number,
  petrol: number,
  lpg: number,
  context: ExecutionContext<CommonConstants>,
) {
  const {
    DIESEL_SCOPE3_EF_TONNES,
    PETROL_SCOPE3_EF_TONNES,
    LPG_SCOPE3_EF_TONNES_STATIONARY,
  } = getScope3FuelConstants(context);

  // (fuel_C4)
  const dieselkL = diesel / 1000;

  // (fuel_H4)
  const dieselScope3Tonnes = dieselkL * DIESEL_SCOPE3_EF_TONNES;

  // (fuel_C5)
  const petrolkL = petrol / 1000;

  // (fuel_H5)
  const petrolScope3Tonnes = petrolkL * PETROL_SCOPE3_EF_TONNES;

  // (fuel_C5)
  const lpgkL = lpg / 1000;

  // WARNING: Pork FuelH6 refers to M18 but should be M19
  const lpgScope3Tonnes = lpgkL * LPG_SCOPE3_EF_TONNES_STATIONARY;

  // (fuel_H6)
  const totalScope3Tonnes =
    dieselScope3Tonnes + petrolScope3Tonnes + lpgScope3Tonnes;

  return totalScope3Tonnes;
}

export function calculateScope3FuelWithLPGAverage(
  diesel: number,
  petrol: number,
  lpg: number,
  context: ExecutionContext<CommonConstants>,
) {
  const {
    DIESEL_SCOPE3_EF_TONNES,
    PETROL_SCOPE3_EF_TONNES,
    LPG_SCOPE3_EF_TONNES_STATIONARY,
    LPG_SCOPE3_EF_TONNES: LPG_SCOPE3_EF_TONNES_TRANSPORT,
  } = getScope3FuelConstants(context);

  // (fuel_C4)
  const dieselkL = diesel / 1000;

  // (fuel_H4)
  const dieselScope3Tonnes = dieselkL * DIESEL_SCOPE3_EF_TONNES;

  // (fuel_C5)
  const petrolkL = petrol / 1000;

  // (fuel_H5)
  const petrolScope3Tonnes = petrolkL * PETROL_SCOPE3_EF_TONNES;

  // (fuel_C5)
  const lpgkL = lpg / 1000;

  // introduced in dairy due to averaging of different LPG factors
  const lpgAverageScope3EF =
    (LPG_SCOPE3_EF_TONNES_STATIONARY + LPG_SCOPE3_EF_TONNES_TRANSPORT) / 2;

  const lpgScope3Tonnes = lpgkL * lpgAverageScope3EF;

  // (fuel_H6)
  const totalScope3Tonnes =
    dieselScope3Tonnes + petrolScope3Tonnes + lpgScope3Tonnes;

  return totalScope3Tonnes;
}
