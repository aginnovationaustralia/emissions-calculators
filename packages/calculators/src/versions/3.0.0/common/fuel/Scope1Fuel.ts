/* eslint-disable no-restricted-syntax */
import { ExecutionContext } from '../../executionContext';
import { FuelInput } from '../../types/fuel.input';
import {
  State,
  StationaryFuelTypes,
  TransportFuelTypes,
} from '../../types/types';
import { swapObjectKeysAndValues } from '../tools/object';

/*
  This implementation of calculating fuel will be the new standard in the future.
  For now it is only consumed by the processing calculator.
*/

type FuelTotal = {
  co2: number;
  ch4: number;
  n2o: number;
  scope1Total: number;
  scope3Total: number;
  total: number;
};
type FuelTotalsForUse<T extends string> = Record<T, FuelTotal>;

const emptyTotal: FuelTotal = {
  co2: 0,
  ch4: 0,
  n2o: 0,
  scope1Total: 0,
  scope3Total: 0,
  total: 0,
};
const emptyTotalsStationary: FuelTotalsForUse<StationaryFuelTypes> = {
  [StationaryFuelTypes.PETROL]: { ...emptyTotal },
  [StationaryFuelTypes.DIESEL]: { ...emptyTotal },
  [StationaryFuelTypes.LPG]: { ...emptyTotal },
  [StationaryFuelTypes.ETHANOL]: { ...emptyTotal },
  [StationaryFuelTypes.BIODIESEL]: { ...emptyTotal },
  [StationaryFuelTypes.RENEWABLE_DIESEL]: { ...emptyTotal },
  [StationaryFuelTypes.OTHER_BIOFUELS]: { ...emptyTotal },
  [StationaryFuelTypes.LNG]: { ...emptyTotal },
};

const emptyTotalsTransport: FuelTotalsForUse<TransportFuelTypes> = {
  [TransportFuelTypes.PETROL]: { ...emptyTotal },
  [TransportFuelTypes.DIESEL]: { ...emptyTotal },
  [TransportFuelTypes.LPG]: { ...emptyTotal },
  [TransportFuelTypes.ETHANOL]: { ...emptyTotal },
  [TransportFuelTypes.BIODIESEL]: { ...emptyTotal },
  [TransportFuelTypes.RENEWABLE_DIESEL]: { ...emptyTotal },
  [TransportFuelTypes.OTHER_BIOFUELS]: { ...emptyTotal },
  [TransportFuelTypes.LNG]: { ...emptyTotal },
  [TransportFuelTypes.FUEL_OIL]: { ...emptyTotal },
  [TransportFuelTypes.JET_A1]: { ...emptyTotal },
  [TransportFuelTypes.JET_B]: { ...emptyTotal },
  [TransportFuelTypes.AVGAS]: { ...emptyTotal },
};

const sumFuelTotals = (previous: FuelTotal, current: FuelTotal): FuelTotal => {
  return {
    co2: previous.co2 + current.co2,
    ch4: previous.ch4 + current.ch4,
    n2o: previous.n2o + current.n2o,
    scope1Total: previous.scope1Total + current.scope1Total,
    scope3Total: previous.scope3Total + current.scope3Total,
    total: previous.total + current.total,
  };
};

// This juggling of fuel key names is mainly here to avoid changing existing constant key names,
// as this would technically be a breaking change.
const reverseStationaryFuelKeys = swapObjectKeysAndValues(StationaryFuelTypes);
const convertStationaryFuelType = (
  fuelType: StationaryFuelTypes,
): keyof typeof StationaryFuelTypes => {
  return reverseStationaryFuelKeys[fuelType];
};

const reverseTransportFuelKeys = swapObjectKeysAndValues(TransportFuelTypes);
const convertTransportFuelType = (
  fuelType: TransportFuelTypes,
): keyof typeof TransportFuelTypes => {
  return reverseTransportFuelKeys[fuelType];
};

export function calculateScope1And3Fuel(
  fuel: FuelInput,
  state: State,
  context: ExecutionContext,
) {
  const { constants } = context;
  const { FUEL_ENERGYGJ } = constants.COMMON;
  const { stationaryFuel, transportFuel, naturalGas } = fuel;

  const stationaryFuelAmountsKl = new Map<StationaryFuelTypes, number>();
  const transportFuelAmountsKl = new Map<TransportFuelTypes, number>();

  for (const transportInput of transportFuel) {
    const current = transportFuelAmountsKl.get(transportInput.type) || 0;
    transportFuelAmountsKl.set(
      transportInput.type,
      current + transportInput.amountLitres / 1000,
    );
  }

  for (const stationaryInput of stationaryFuel) {
    const current = stationaryFuelAmountsKl.get(stationaryInput.type) || 0;
    stationaryFuelAmountsKl.set(
      stationaryInput.type,
      current + stationaryInput.amountLitres / 1000,
    );
  }
  const { STATIONARY, TRANSPORT, NATURAL_GAS } = FUEL_ENERGYGJ;

  // All intermediate and final total values being computed are in tonnes CO2e
  const stationaryTotals: FuelTotalsForUse<StationaryFuelTypes> = Array.from(
    stationaryFuelAmountsKl,
  ).reduce(
    (acc, [fuelType, amount]) => {
      const fuelTypeKey = convertStationaryFuelType(fuelType);
      const fuelFactors = STATIONARY[fuelTypeKey];
      const energyContentFactor = fuelFactors.ENERGY_CONTENT_FACTOR;
      const scope1EF = fuelFactors.SCOPE1_EF;
      const scope3EF = fuelFactors.SCOPE3_EF;

      const co2 = (amount * scope1EF.CO2 * energyContentFactor) / 1000;
      const ch4 = (amount * scope1EF.CH4 * energyContentFactor) / 1000;
      const n2o = (amount * scope1EF.N2O * energyContentFactor) / 1000;
      const scope1Total = co2 + ch4 + n2o;
      const scope3 = (amount * scope3EF * energyContentFactor) / 1000;
      const total = scope1Total + scope3;

      const currentForFuelType = acc[fuelType];
      const nextForFuelType = {
        co2: currentForFuelType.co2 + co2,
        ch4: currentForFuelType.ch4 + ch4,
        n2o: currentForFuelType.n2o + n2o,
        scope1Total: currentForFuelType.scope1Total + scope1Total,
        scope3Total: currentForFuelType.scope3Total + scope3,
        total: currentForFuelType.total + total,
      };
      acc[fuelType] = nextForFuelType;
      return acc;
    },
    { ...emptyTotalsStationary },
  );

  const transportTotals: FuelTotalsForUse<TransportFuelTypes> = Array.from(
    transportFuelAmountsKl,
  ).reduce(
    (acc, [fuelType, amount]) => {
      const fuelTypeKey = convertTransportFuelType(fuelType);
      const fuelFactors = TRANSPORT[fuelTypeKey];
      const energyContentFactor = fuelFactors.ENERGY_CONTENT_FACTOR;
      const scope1EF = fuelFactors.SCOPE1_EF;
      const scope3EF = fuelFactors.SCOPE3_EF;

      const co2 = (amount * scope1EF.CO2 * energyContentFactor) / 1000;
      const ch4 = (amount * scope1EF.CH4 * energyContentFactor) / 1000;
      const n2o = (amount * scope1EF.N2O * energyContentFactor) / 1000;
      const scope1Total = co2 + ch4 + n2o;
      const scope3 = (amount * scope3EF * energyContentFactor) / 1000;
      const total = scope1Total + scope3;

      const currentForFuelType = acc[fuelType];
      const nextForFuelType = {
        co2: currentForFuelType.co2 + co2,
        ch4: currentForFuelType.ch4 + ch4,
        n2o: currentForFuelType.n2o + n2o,
        scope1Total: currentForFuelType.scope1Total + scope1Total,
        scope3Total: currentForFuelType.scope3Total + scope3,
        total: currentForFuelType.total + total,
      };
      acc[fuelType] = nextForFuelType;
      return acc;
    },
    { ...emptyTotalsTransport },
  );

  const { ENERGY_CONTENT_FACTOR, SCOPE1_EF, SCOPE3_EF } = NATURAL_GAS;
  const naturalGasGj = naturalGas / 1000;
  const naturalGases = {
    co2: (naturalGasGj * SCOPE1_EF.CO2 * ENERGY_CONTENT_FACTOR) / 1000,
    ch4: (naturalGasGj * SCOPE1_EF.CH4 * ENERGY_CONTENT_FACTOR) / 1000,
    n2o: (naturalGasGj * SCOPE1_EF.N2O * ENERGY_CONTENT_FACTOR) / 1000,
    scope3Total:
      (naturalGasGj * SCOPE3_EF[state] * ENERGY_CONTENT_FACTOR) / 1000,
  };

  const naturalGasTotal: FuelTotal = {
    ...naturalGases,
    scope1Total: naturalGases.co2 + naturalGases.ch4 + naturalGases.n2o,
    total:
      naturalGases.scope3Total +
      naturalGases.co2 +
      naturalGases.ch4 +
      naturalGases.n2o,
  };

  const stationaryTotal: FuelTotal = Object.values(stationaryTotals).reduce(
    sumFuelTotals,
    { ...emptyTotal },
  );

  const transportTotal: FuelTotal = Object.values(transportTotals).reduce(
    sumFuelTotals,
    { ...emptyTotal },
  );

  const total = [stationaryTotal, transportTotal, naturalGasTotal].reduce(
    sumFuelTotals,
    { ...emptyTotal },
  );

  return total;
}
