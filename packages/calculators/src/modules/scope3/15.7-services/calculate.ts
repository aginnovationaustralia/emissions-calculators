import { ExecutionContext } from '@/calculators/executionContext';
import { HasStateInputTransformed } from '@/calculators/types/has-state.input';
import { HasCommonConstants } from '@/constants/types';
import {
  HasFuelInputTransformed,
  isTransportFuelCNGBased,
  selectTransportFuelConstants,
  stationaryEmissionsForCombined,
} from '@/modules/scope1/8-fuel-use';
import { calculateScope3EmissionsFromFuelStationary } from '@/modules/scope3/15.10-fuel';
import { br } from '@/tools/containers';
import { zeroCO2e } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { ServicesInputTransformed } from './services.input';

type ServicesFuelActivity = HasFuelInputTransformed & HasStateInputTransformed;

const calculateScope3ServicesTransportFuel = (
  activity: ServicesFuelActivity,
  context: ExecutionContext<HasCommonConstants>,
) => {
  const { constants } = context;
  // SUM{QTPTransq * ECTransq * (EFTrans1tqg + EFTrans3tqg}
  const emissionsRecords = activity.fuel.transport.map((fuel) => {
    const qTransTQ = isTransportFuelCNGBased(fuel)
      ? fuel.amountCubicMetres
      : fuel.amountKilolitres;

    const { ecTransQ, efTrans1tqg, efTrans3Q } = selectTransportFuelConstants(
      fuel,
      constants,
      'CO2e',
    );

    const energyFromFuel = ecTransQ.multiply(qTransTQ);

    return br(efTrans1tqg.plus(efTrans3Q)).multiply(energyFromFuel);
  });

  return sum(emissionsRecords, zeroCO2e);
};

const calculateScope3ServicesStationaryFuel = (
  activity: ServicesFuelActivity,
  context: ExecutionContext<HasCommonConstants>,
) => {
  /*
   * SUM{Qtpscq * ECscq * (EFsc1qg + EFsc3qg)}
   *
   * NOTE: This implementation has lent on existing functions for scope 1 and scope 3, and simply sums them together.
   * This is to avoid reproducing the complexity of solid vs liquid vs natural gas, at the expense of not matching the
   * exact format of the reference equation, although the result is identical
   * */
  const scope1StationaryEmissions = stationaryEmissionsForCombined(
    activity,
    context,
  );
  const scope3StationaryEmissions = calculateScope3EmissionsFromFuelStationary(
    activity,
    context,
  );

  return scope1StationaryEmissions.plus(scope3StationaryEmissions);
};

export const calculateScope3Services = (
  activity: ServicesFuelActivity,
  context: ExecutionContext<HasCommonConstants>,
) => {
  /*
  15.7.1.1 Method 1 -- Purchased Services and Contractors
  E = SUM{QTPTransq * ECTransq * (EFTrans1tqg + EFTrans3tqg} * 10^-3 +
      SUM{Qtpscq * ECscq * (EFsc1qg + EFsc3qg)} * 10^-3
  */

  const transportEmissions = calculateScope3ServicesTransportFuel(
    activity,
    context,
  );
  const stationaryEmissions = calculateScope3ServicesStationaryFuel(
    activity,
    context,
  );

  return transportEmissions
    .plus(stationaryEmissions)
    .named('E')
    .reference('15.7.1.1 (1)');
};

/**
 * Purchased services for an industry calculator activity (crop, herd, flock, lot or
 * plantation). Those activities carry both their own fuel (`fuel`, used by 8.1, 8.2 and
 * 15.10) and the fuel burnt by contractors on their behalf (`services.fuel`). 15.7 must
 * only use the latter, with the activity's own `state` for the stationary factors.
 */
export const calculateScope3ServicesForActivity = (
  activity: ServicesInputTransformed & HasStateInputTransformed,
  context: ExecutionContext<HasCommonConstants>,
) =>
  calculateScope3Services(
    { state: activity.state, fuel: activity.services.fuel },
    context,
  );
