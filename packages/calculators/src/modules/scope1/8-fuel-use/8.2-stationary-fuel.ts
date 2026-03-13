import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { ExecutionContext } from '@/calculators/Grains/constants/executionContext';
import { selectConstant } from '@/tools/constants';
import { BinaryContainer } from '@/tools/containers';
import { sum } from '@/tools/sum';
import { Mass } from '@/tools/units';
import { FuelInputTransformed } from './fuel.input';
import {
  isStationaryLiquidFuelMassBased,
  StationaryFuelLiquidInputTransformed,
} from './stationaryFuel-liquid.input';
import { StationaryFuelNaturalGasInputTransformed } from './stationaryFuel-naturalGas.input';
import { StationaryFuelSolidInputTransformed } from './stationaryFuel-solid.input';
import {
  isStationaryFuelLiquid,
  isStationaryFuelSolid,
  StationaryFuelInputTransformed,
} from './stationaryFuel.input';

const emissionsOfGasForSolidFuel = <GasType extends 'CO2' | 'CH4' | 'N2O'>(
  fuel: StationaryFuelSolidInputTransformed,
  constants: ConstantsForGrainsCalculator,
  gasType: GasType,
): BinaryContainer<Mass<GasType>> => {
  const qSCq = fuel.amountTonnes;
  const efSC1qg = selectConstant(
    constants.COMMON,
    'STATIONARY_FUEL_FACTORS_BY_MASS',
    'Solid fuels',
    fuel.fuelType,
    'SCOPE1_EF',
    gasType,
  );
  const ecSCq = selectConstant(
    constants.COMMON,
    'STATIONARY_FUEL_FACTORS_BY_MASS',
    'Solid fuels',
    fuel.fuelType,
    'ENERGY_CONTENT_FACTOR',
  );
  const energyFromFuel = ecSCq.multiply(qSCq);
  return efSC1qg.multiply(energyFromFuel);
};

const emissionsOfGasForLiquidFuel = <GasType extends 'CO2' | 'CH4' | 'N2O'>(
  fuel: StationaryFuelLiquidInputTransformed,
  constants: ConstantsForGrainsCalculator,
  gasType: GasType,
): BinaryContainer<Mass<GasType>> => {
  if (isStationaryLiquidFuelMassBased(fuel)) {
    const qSCq = fuel.amountTonnes;
    const efSC1qg = selectConstant(
      constants.COMMON,
      'STATIONARY_FUEL_FACTORS_BY_MASS',
      fuel.fuelClass,
      fuel.fuelType,
      'SCOPE1_EF',
      gasType,
    );
    const ecSCq = selectConstant(
      constants.COMMON,
      'STATIONARY_FUEL_FACTORS_BY_MASS',
      'Liquid fuels',
      fuel.fuelType,
      'ENERGY_CONTENT_FACTOR',
    );
    const energyFromFuel = ecSCq.multiply(qSCq);
    return efSC1qg.multiply(energyFromFuel);
  }

  const qSCq = fuel.amountLitres;
  const efSC1qg = selectConstant(
    constants.COMMON,
    'STATIONARY_FUEL_FACTORS_BY_VOLUME',
    'Liquid fuels',
    fuel.fuelType,
    'SCOPE1_EF',
    gasType,
  );
  const ecSCq = selectConstant(
    constants.COMMON,
    'STATIONARY_FUEL_FACTORS_BY_VOLUME',
    'Liquid fuels',
    fuel.fuelType,
    'ENERGY_CONTENT_FACTOR',
  );
  const energyFromFuel = ecSCq.multiply(qSCq);
  return efSC1qg.multiply(energyFromFuel);
};

const emissionsOfGasForNaturalGas = <GasType extends 'CO2' | 'CH4' | 'N2O'>(
  fuel: StationaryFuelNaturalGasInputTransformed,
  constants: ConstantsForGrainsCalculator,
  gasType: GasType,
): BinaryContainer<Mass<GasType>> => {
  const qSCq = fuel.amountLitres;
  const efSC1qg = selectConstant(
    constants.COMMON,
    'NATURAL_GAS_FACTORS',
    'SCOPE1_EF',
    gasType,
  );
  const ecSCq = selectConstant(
    constants.COMMON,
    'NATURAL_GAS_FACTORS',
    'ENERGY_CONTENT_FACTOR',
  );
  const energyFromFuel = ecSCq.multiply(qSCq);
  return efSC1qg.multiply(energyFromFuel);
};

const emissionsOfGasForFuel = <GasType extends 'CO2' | 'CH4' | 'N2O'>(
  fuel: StationaryFuelInputTransformed,
  constants: ConstantsForGrainsCalculator,
  gasType: GasType,
): BinaryContainer<Mass<GasType>> => {
  /*
  8.2.1.1 Method 1 - Fuel use stationary combustion
  (1) Emissions for each GHG from the stationary combustion of fuels, Eg (t CO2e), is
  estimated as:
  Eg = SUMq QSC,q * ECSC,q * EF SC,1,qg * 10^-3

  Where QSC,q = amount of fuel type q used for stationary combustion operations (kL,m3 or t)
  ECSC,q = energy content factor for stationary combustion operations (GJ/kL,m3 or t)
  EF SC,1,qg = Scope 1 emission factor for stationary combustion for each greenhouse gas g (kg CO2e /GJ)
  */

  if (isStationaryFuelSolid(fuel)) {
    return emissionsOfGasForSolidFuel(fuel, constants, gasType);
  } else if (isStationaryFuelLiquid(fuel)) {
    return emissionsOfGasForLiquidFuel(fuel, constants, gasType);
  }
  return emissionsOfGasForNaturalGas(fuel, constants, gasType);
};

const stationaryEmissionsForGas = <GasType extends 'CO2' | 'CH4' | 'N2O'>(
  input: FuelInputTransformed,
  constants: ConstantsForGrainsCalculator,
  gasType: GasType,
) => {
  const stationaryEmissions = input.stationaryFuel.map((fuel) => {
    return emissionsOfGasForFuel(fuel, constants, gasType);
  });
  return sum(stationaryEmissions, {
    name: `EtransGHG${gasType}`,
    references: [`6.1.1 (55)`],
  });
};

export const stationaryEmissionsForCO2 = (
  input: FuelInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  return stationaryEmissionsForGas(input, constants, 'CO2');
};

export const stationaryEmissionsForCH4 = (
  input: FuelInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  return stationaryEmissionsForGas(input, constants, 'CH4');
};

export const stationaryEmissionsForN2O = (
  input: FuelInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  return stationaryEmissionsForGas(input, constants, 'N2O');
};

// 8.2 Stationary combustion fuel
//   fuelCO2, fuelCH4, fuelN2O
export const calculate82StationaryFuel = (
  input: FuelInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const fuelStationaryCO2 = stationaryEmissionsForCO2(input, context);
  const fuelStationaryCH4 = stationaryEmissionsForCH4(input, context);
  const fuelStationaryN2O = stationaryEmissionsForN2O(input, context);

  return {
    fuelStationaryCO2,
    fuelStationaryCH4,
    fuelStationaryN2O,
  };
};
