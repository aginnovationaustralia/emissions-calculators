import { swapObjectKeysAndValues } from '@/calculators/common/tools/object';
import { State, StationaryFuelTypes, TransportFuelTypes } from '@/types/enums';
import { FuelInputTransformed } from '@/types/fuel.input';
import Decimal from 'decimal.js-light';
import { ExecutionContext } from '../../executionContext';
import { selectValue } from '../types/constants';
import { multiply } from '../types/multiply';
import { rootOrigin } from '../types/origins';
import { output, Output, scope1Output } from '../types/output';
import { energyPerVolume, mass, massPerEnergy } from '../types/overloads';

type FuelTotal = {
  co2: Output<1, 'CO2'>;
  ch4: Output<1, 'CH4'>;
  n2o: Output<1, 'N2O'>;
  scope3Total: Output<3, 'CO2e'>;
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

/*
 * Algorithm
 * 1 - Merge all stationary and transport fuel amounts by type
 * 2 - Grab COMMON.FUEL_ENERGYGJ constants
 * For stationary fuels:
 *  - Convert fuel type to key in constants STATIONARY
 *  - Select FuelFactors keys from constants STATIONARY using stationary fuel
 *      - Gives you energy content factor and scope 1 and 3 emission factors
 *  - Calculate CO2, CH4, and N2O scope 1 emissions for each fuel type using amount * FuelFactors.SCOPE1_EF.<Gas type> * FuelFactors.ENERGY_CONTENT_FACTOR
 *  - Calculate CO2e scope 3 emissions for each fuel type using amount * FuelFactors.SCOPE3_EF * FuelFactors.ENERGY_CONTENT_FACTOR
 *  - Sum all fuel types to get total emissions for Scope 1 CO2, CH4, and N2O, and Scope 3 CO2e
 * For transport fuels:
 *  - Convert fuel type to key in constants TRANSPORT
 *  - Select FuelFactors keys from constants TRANSPORT using transport fuel
 *      - Gives you energy content factor and scope 1 and 3 emission factors
 *  - Calculate CO2, CH4, and N2O scope 1 emissions for each fuel type using amount * FuelFactors.SCOPE1_EF.<Gas type> * FuelFactors.ENERGY_CONTENT_FACTOR
 *  - Calculate CO2e scope 3 emissions for each fuel type using amount * FuelFactors.SCOPE3_EF * FuelFactors.ENERGY_CONTENT_FACTOR
 *  - Sum all fuel types to get total emissions for Scope 1 CO2, CH4, and N2O, and Scope 3 CO2e
 * For natural gas:
 * - Select ENERGY_CONTENT_FACTOR, SCOPE1_EF, SCOPE3_EF from constants NATURAL_GAS
 * - Calculate CO2, CH4, and N2O scope 1 emissions using amount * ENERGY_CONTENT_FACTOR * SCOPE1_EF.<Gas type>
 * - Calculate CO2e scope 3 emissions using amount * ENERGY_CONTENT_FACTOR * SCOPE3_EF[state]
 * - Sum all fuel types to get total emissions for Scope 1 CO2, CH4, and N2O, and Scope 3 CO2e
 *
 * Final step:
 * Sum from the 3 sources to get distinct total emissions outputs for Scope 1 CO2, CH4, and N2O, and Scope 3 CO2e
 */

export function calculateScope1And3Fuel(
  fuel: FuelInputTransformed,
  state: State,
  context: ExecutionContext,
) {
  const { constants } = context;
  // const { FUEL_ENERGYGJ } = constants.COMMON;
  // const { STATIONARY, TRANSPORT, NATURAL_GAS } = FUEL_ENERGYGJ;
  // Stationary
  const stationaryAmounts = fuel.stationaryFuel.map(
    ({ type, amountLitres }) => {
      // REVISIT: The generics on transform are super noisy right now
      // const fuelTypeKey = transform<
      //   StringUnit<keyof typeof StationaryFuelTypes>,
      //   keyof typeof StationaryFuelTypes,
      //   StationaryFuelTypes
      // >(
      //   stringUnit(convertStationaryFuelType(type.unit)),
      //   convertStationaryFuelType,
      //   type,
      // );

      // const fuelFactors = constants.COMMON.FUEL_ENERGYGJ.STATIONARY[fuelTypeKey.unit].;

      const scope1EFCo2 = selectValue(
        constants.COMMON,
        (value) => massPerEnergy('CO2', new Decimal(value)),
        'FUEL_ENERGYGJ',
        'STATIONARY',
        type,
        'SCOPE1_EF',
        'CO2',
      );

      const energyContentFactor = selectValue(
        constants.COMMON,
        (value) => energyPerVolume('Fuel', new Decimal(value)),
        'FUEL_ENERGYGJ',
        'STATIONARY',
        type,
        'ENERGY_CONTENT_FACTOR',
      );

      const totalEnergy = multiply(energyContentFactor, amountLitres);

      const co2Scope1 = multiply(scope1EFCo2, totalEnergy);
    },
  );

  // const stationaryScope3 =

  // Transport

  // Natural Gas

  // Final sums

  const total = {
    fuelCO2: scope1Output('fuelCO2', rootOrigin(mass('CO2'))),
    fuelCH4: scope1Output('fuelCH4', rootOrigin(mass('CH4'))),
    fuelN2O: scope1Output('fuelN2O', rootOrigin(mass('N2O'))),
    fuel: output('fuel', 3, rootOrigin(mass('CO2e'))),
  };

  return total;
}
