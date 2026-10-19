import { ExecutionContext } from '@/calculators/executionContext';
import { FuelEmissionsGasType } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { BinaryContainer, Container } from '@/tools/containers';
import { massCO2eToMassGHGGas } from '@/tools/gwp';
import { sum } from '@/tools/sum';
import { Mass } from '@/tools/units';
import { ConstantsForFuel } from './constants';
import { FuelInputTransformed, HasFuelInputTransformed } from './fuel.input';
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

const emissionsOfGasForSolidFuel = (
  fuel: StationaryFuelSolidInputTransformed,
  constants: ConstantsForFuel,
  gasType: FuelEmissionsGasType,
): BinaryContainer<Mass<'CO2e'>> => {
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

const emissionsOfGasForLiquidFuel = (
  fuel: StationaryFuelLiquidInputTransformed,
  constants: ConstantsForFuel,
  gasType: FuelEmissionsGasType,
): BinaryContainer<Mass<'CO2e'>> => {
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

  const qSCq = fuel.amountKilolitres;
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

const emissionsOfGasForNaturalGas = (
  fuel: StationaryFuelNaturalGasInputTransformed,
  constants: ConstantsForFuel,
  gasType: FuelEmissionsGasType,
): BinaryContainer<Mass<'CO2e'>> => {
  const qSCq = fuel.amountKilolitres;
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

const emissionsOfGasForFuel = <G extends FuelEmissionsGasType>(
  fuel: StationaryFuelInputTransformed,
  constants: ConstantsForFuel,
  gasType: G,
): Container<Mass<G>> => {
  /*
  8.2.1.1 Method 1 - Fuel use stationary combustion
  (1) Emissions for each GHG from the stationary combustion of fuels, Eg (t CO2e), is
  estimated as:
  Eg = SUMq QSC,q * ECSC,q * EF SC,1,qg * 10^-3

  Where QSC,q = amount of fuel type q used for stationary combustion operations (kL,m3 or t)
  ECSC,q = energy content factor for stationary combustion operations (GJ/kL,m3 or t)
  EF SC,1,qg = Scope 1 emission factor for stationary combustion for each greenhouse gas g (kg CO2e /GJ)
  */

  const emissionsCO2e = isStationaryFuelSolid(fuel)
    ? emissionsOfGasForSolidFuel(fuel, constants, gasType)
    : isStationaryFuelLiquid(fuel)
      ? emissionsOfGasForLiquidFuel(fuel, constants, gasType)
      : emissionsOfGasForNaturalGas(fuel, constants, gasType);

  return massCO2eToMassGHGGas(emissionsCO2e, gasType);
};

const stationaryEmissionsForGas = <G extends FuelEmissionsGasType>(
  fuel: FuelInputTransformed,
  constants: ConstantsForFuel,
  gasType: G,
) => {
  const stationaryEmissions = fuel.stationary.map((fuel) => {
    return emissionsOfGasForFuel(fuel, constants, gasType);
  });
  return sum(stationaryEmissions, {
    name: `EtransGHG${gasType}`,
    references: [`8.2.1.1 (1)`],
  });
};

export const stationaryEmissionsForCO2 = (
  input: HasFuelInputTransformed,
  context: ExecutionContext,
) => {
  const { constants } = context;
  return stationaryEmissionsForGas(input.fuel, constants, 'CO2');
};

export const stationaryEmissionsForCH4 = (
  input: HasFuelInputTransformed,
  context: ExecutionContext,
) => {
  const { constants } = context;
  return stationaryEmissionsForGas(input.fuel, constants, 'CH4');
};

export const stationaryEmissionsForN2O = (
  input: HasFuelInputTransformed,
  context: ExecutionContext,
) => {
  const { constants } = context;
  return stationaryEmissionsForGas(input.fuel, constants, 'N2O');
};

export const stationaryEmissionsForCombined = (
  input: HasFuelInputTransformed,
  context: ExecutionContext,
) => {
  const { constants } = context;
  return stationaryEmissionsForGas(input.fuel, constants, 'CO2e');
};

// 8.2 Stationary combustion fuel
//   fuelCO2, fuelCH4, fuelN2O
export const calculate82StationaryFuel = (
  input: HasFuelInputTransformed,
  context: ExecutionContext,
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
