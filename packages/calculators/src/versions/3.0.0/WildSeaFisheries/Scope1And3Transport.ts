import { ExecutionContext } from '../executionContext';
import { WildSeaFisheriesCommercialFlight } from '../types/WildSeaFisheries/commercialflight.input';
import { WildSeaFisheriesTransport } from '../types/WildSeaFisheries/transport.input';
import { ConstantsForWildSeaFisheriesCalculator } from './constants';

export function calculateScope1And3Transport(
  transports: WildSeaFisheriesTransport[],
  flights: WildSeaFisheriesCommercialFlight[],
  context: ExecutionContext<ConstantsForWildSeaFisheriesCalculator>,
) {
  const { constants } = context;

  const segmentTotal = transports.reduce(
    (acc, segment) => {
      // (TransportD41)
      const fuelUsedLitres =
        segment.distance *
        constants.FISHERIES.TRANSPORT_FUEL_USAGE[segment.type];

      // (TransportE41)
      const fuelUsedKL = fuelUsedLitres / 1000;

      // (TransportD119)
      const {
        CO2: CO2EF,
        N2O: N2OEF,
        CH4: CH4EF,
        SCOPE3,
      } = constants.FISHERIES.TRANSPORT_FUEL_EF[segment.fuel];

      // (TransportF41)
      const scope1CO2 = fuelUsedKL * CO2EF;
      const scope1N2O = fuelUsedKL * N2OEF;
      const scope1CH4 = fuelUsedKL * CH4EF;
      const scope3 = fuelUsedKL * SCOPE3;

      return {
        CO2: acc.CO2 + scope1CO2,
        N2O: acc.N2O + scope1N2O,
        CH4: acc.CH4 + scope1CH4,
        scope3: acc.scope3 + scope3,
      };
    },
    { CO2: 0, N2O: 0, CH4: 0, scope3: 0 },
  );

  const flightsTotal = flights.reduce((acc, flight) => {
    const scope3Flight =
      (flight.commercialFlightPassengers *
        flight.totalFlightDistance *
        constants.COMMON.COMMERCIALFLIGHT_EF) /
      1000;

    return acc + scope3Flight;
  }, 0);

  const total = {
    ...segmentTotal,
    scope3: segmentTotal.scope3 + flightsTotal,
  };

  return total;
}
