import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { selectConstant } from '@/tools/constants';
import { BinaryContainer, TypedContainer } from '@/tools/origins';
import { sum } from '@/tools/sum';
import { energyPerVolume, Mass, massPerEnergy, Volume } from '@/tools/units';
import Decimal from 'decimal.js-light';
import { FuelInputTransformed } from './fuel.input';

const emissionsOfGasForFuel = <GasType extends 'CO2' | 'CH4' | 'N2O'>(
  amountOfFuel: TypedContainer<Volume<'Fuel'>>,
  constants: ConstantsForGrainsCalculator,
  fuelType: 'DIESEL' | 'PETROL' | 'LPG',
  gasType: GasType,
): BinaryContainer<Mass<GasType>> => {
  const efForFuel = selectConstant(
    constants.COMMON,
    (value) => massPerEnergy(gasType, new Decimal(value)),
    'FUEL_ENERGYGJ',
    'TRANSPORT',
    fuelType,
    'SCOPE1_EF',
    gasType,
  );
  const energyContentFactorForFuel = selectConstant(
    constants.COMMON,
    (value) => energyPerVolume('Fuel', new Decimal(value)),
    'FUEL_ENERGYGJ',
    'TRANSPORT',
    fuelType,
    'ENERGY_CONTENT_FACTOR',
  );
  const energyFromFuel = energyContentFactorForFuel.multiply(amountOfFuel);

  return efForFuel.multiply(energyFromFuel);
};

const transportEmissionsForGas = <GasType extends 'CO2' | 'CH4' | 'N2O'>(
  input: FuelInputTransformed,
  constants: ConstantsForGrainsCalculator,
  gasType: GasType,
) => {
  const dieselEmissions = emissionsOfGasForFuel(
    input.dieselUse,
    constants,
    'DIESEL',
    gasType,
  );
  const petrolEmissions = emissionsOfGasForFuel(
    input.petrolUse,
    constants,
    'PETROL',
    gasType,
  );
  const lpgEmissions = emissionsOfGasForFuel(
    input.lpg,
    constants,
    'LPG',
    gasType,
  );
  return sum([dieselEmissions, petrolEmissions, lpgEmissions], {
    name: `EtransGHG${gasType}`,
    valueType: 'variable',
    references: [`6.1.1 (55)`],
  });
};

// 6.1 Transport fuel
// 6.2 Stationary combustion fuel
//   fuelCO2, fuelCH4, fuelN2O
export const calculateScope1Fuel = (
  input: FuelInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;

  // 6.1.1
  // Line 55
  const transportFuelCO2 = transportEmissionsForGas(input, constants, 'CO2');
  const transportFuelCH4 = transportEmissionsForGas(input, constants, 'CH4');
  const transportFuelN2O = transportEmissionsForGas(input, constants, 'N2O');

  // TODO: Stationary fuel emissions
  return {
    fuelCO2: sum([transportFuelCO2]),
    fuelCH4: sum([transportFuelCH4]),
    fuelN2O: sum([transportFuelN2O]),
  };
};
