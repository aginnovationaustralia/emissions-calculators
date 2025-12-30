import { State } from '@/types/enums';
import { FuelInputTransformed } from '@/types/fuel.input';
import Decimal from 'decimal.js-light';
import { ExecutionContext } from '../../executionContext';
import { selectConstant } from '../types/constants';
import { input } from '../types/inputs';
import { multiply } from '../types/multiply';
import { Origin } from '../types/origins';
import { output, scope1Output } from '../types/output';
import { sum } from '../types/sum';
import {
  energyPerVolume,
  Mass,
  mass,
  massPerEnergy,
  stringUnit,
} from '../types/units';

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
  // Stationary
  const stationaryAmounts = fuel.stationaryFuel.map(
    ({ type, amountLitres }) => {
      const scope1EFCo2 = selectConstant(
        constants.COMMON,
        (value) => massPerEnergy('CO2', new Decimal(value)),
        'FUEL_ENERGYGJ',
        'STATIONARY',
        type,
        'SCOPE1_EF',
        'CO2',
      );

      const scope1EFCh4 = selectConstant(
        constants.COMMON,
        (value) => massPerEnergy('CH4', new Decimal(value)),
        'FUEL_ENERGYGJ',
        'STATIONARY',
        type,
        'SCOPE1_EF',
        'CH4',
      );

      const scope1EFn2o = selectConstant(
        constants.COMMON,
        (value) => massPerEnergy('N2O', new Decimal(value)),
        'FUEL_ENERGYGJ',
        'STATIONARY',
        type,
        'SCOPE1_EF',
        'N2O',
      );

      const scope3EF = selectConstant(
        constants.COMMON,
        (value) => massPerEnergy('CO2e', new Decimal(value)),
        'FUEL_ENERGYGJ',
        'STATIONARY',
        type,
        'SCOPE3_EF',
      );

      const energyContentFactor = selectConstant(
        constants.COMMON,
        (value) => energyPerVolume('Fuel', new Decimal(value)),
        'FUEL_ENERGYGJ',
        'STATIONARY',
        type,
        'ENERGY_CONTENT_FACTOR',
      );

      const totalEnergy = multiply(energyContentFactor, amountLitres);

      // TODO: multiply is not passing through the detail of the mass substance generics
      const co2Scope1: Origin<Mass<'CO2'>> = multiply(scope1EFCo2, totalEnergy);
      const ch4Scope1: Origin<Mass<'CH4'>> = multiply(scope1EFCh4, totalEnergy);
      const n2oScope1: Origin<Mass<'N2O'>> = multiply(scope1EFn2o, totalEnergy);
      const scope3: Origin<Mass<'CO2e'>> = multiply(scope3EF, totalEnergy);

      return {
        co2Scope1,
        ch4Scope1,
        n2oScope1,
        scope3,
      };
    },
  );

  // Transport

  const transportAmounts = fuel.transportFuel.map(({ type, amountLitres }) => {
    const scope1EFCo2 = selectConstant(
      constants.COMMON,
      (value) => massPerEnergy('CO2', new Decimal(value)),
      'FUEL_ENERGYGJ',
      'TRANSPORT',
      type,
      'SCOPE1_EF',
      'CO2',
    );

    const scope1EFCh4 = selectConstant(
      constants.COMMON,
      (value) => massPerEnergy('CH4', new Decimal(value)),
      'FUEL_ENERGYGJ',
      'TRANSPORT',
      type,
      'SCOPE1_EF',
      'CH4',
    );

    const scope1EFn2o = selectConstant(
      constants.COMMON,
      (value) => massPerEnergy('N2O', new Decimal(value)),
      'FUEL_ENERGYGJ',
      'TRANSPORT',
      type,
      'SCOPE1_EF',
      'N2O',
    );

    const scope3EF = selectConstant(
      constants.COMMON,
      (value) => massPerEnergy('CO2e', new Decimal(value)),
      'FUEL_ENERGYGJ',
      'TRANSPORT',
      type,
      'SCOPE3_EF',
    );

    const energyContentFactor = selectConstant(
      constants.COMMON,
      (value) => energyPerVolume('Fuel', new Decimal(value)),
      'FUEL_ENERGYGJ',
      'TRANSPORT',
      type,
      'ENERGY_CONTENT_FACTOR',
    );

    const totalEnergy = multiply(energyContentFactor, amountLitres);

    const co2Scope1: Origin<Mass<'CO2'>> = multiply(scope1EFCo2, totalEnergy);
    const ch4Scope1: Origin<Mass<'CH4'>> = multiply(scope1EFCh4, totalEnergy);
    const n2oScope1: Origin<Mass<'N2O'>> = multiply(scope1EFn2o, totalEnergy);
    const scope3: Origin<Mass<'CO2e'>> = multiply(scope3EF, totalEnergy);

    return {
      co2Scope1,
      ch4Scope1,
      n2oScope1,
      scope3,
    };
  });

  // Natural Gas

  const naturalGasScope1EFCo2 = selectConstant(
    constants.COMMON,
    (value) => massPerEnergy('CO2', new Decimal(value)),
    'FUEL_ENERGYGJ',
    'NATURAL_GAS',
    'SCOPE1_EF',
    'CO2',
  );

  const naturalGasScope1EFCh4 = selectConstant(
    constants.COMMON,
    (value) => massPerEnergy('CH4', new Decimal(value)),
    'FUEL_ENERGYGJ',
    'NATURAL_GAS',
    'SCOPE1_EF',
    'CH4',
  );

  const naturalGasScope1EFn2o = selectConstant(
    constants.COMMON,
    (value) => massPerEnergy('N2O', new Decimal(value)),
    'FUEL_ENERGYGJ',
    'NATURAL_GAS',
    'SCOPE1_EF',
    'N2O',
  );

  const naturalGasScope3EF = selectConstant(
    constants.COMMON,
    (value) => massPerEnergy('CO2e', new Decimal(value)),
    'FUEL_ENERGYGJ',
    'NATURAL_GAS',
    'SCOPE3_EF',
    input('STATE', stringUnit(state)),
  );

  const naturalGasCo2Scope1: Origin<Mass<'CO2'>> = multiply(
    naturalGasScope1EFCo2,
    fuel.naturalGas,
  );
  const naturalGasCh4Scope1: Origin<Mass<'CH4'>> = multiply(
    naturalGasScope1EFCh4,
    fuel.naturalGas,
  );
  const naturalGasN2oScope1: Origin<Mass<'N2O'>> = multiply(
    naturalGasScope1EFn2o,
    fuel.naturalGas,
  );
  const naturalGasScope3: Origin<Mass<'CO2e'>> = multiply(
    naturalGasScope3EF,
    fuel.naturalGas,
  );

  const scope1Co2Total: Origin<Mass<'CO2'>> = sum({
    items: stationaryAmounts
      .map(({ co2Scope1 }) => co2Scope1)
      .concat(transportAmounts.map(({ co2Scope1 }) => co2Scope1))
      .concat(naturalGasCo2Scope1),
    unit: mass('CO2'),
  });
  const scope1Ch4Total = sum({
    items: stationaryAmounts
      .map(({ ch4Scope1 }) => ch4Scope1)
      .concat(transportAmounts.map(({ ch4Scope1 }) => ch4Scope1))
      .concat(naturalGasCh4Scope1),
    unit: mass('CH4'),
  });
  const scope1N2oTotal = sum({
    items: stationaryAmounts
      .map(({ n2oScope1 }) => n2oScope1)
      .concat(transportAmounts.map(({ n2oScope1 }) => n2oScope1))
      .concat(naturalGasN2oScope1),
    unit: mass('N2O'),
  });
  const scope3Total = sum({
    items: stationaryAmounts
      .map(({ scope3 }) => scope3)
      .concat(transportAmounts.map(({ scope3 }) => scope3))
      .concat(naturalGasScope3),
    unit: mass('CO2e'),
  });

  // Final sums

  const total = {
    fuelCO2: scope1Output('fuelCO2', scope1Co2Total),
    fuelCH4: scope1Output('fuelCH4', scope1Ch4Total),
    fuelN2O: scope1Output('fuelN2O', scope1N2oTotal),
    fuel: output('fuel', 3, scope3Total),
  };

  return total;
}
