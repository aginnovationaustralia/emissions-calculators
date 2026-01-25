import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { selectConstant } from '@/tools/constants';
import { multiply } from '@/tools/multiply';
import { BinaryOrigin, TypedOrigin } from '@/tools/origins';
import { sum } from '@/tools/sum';
import { energyPerVolume, Mass, massPerEnergy, Volume } from '@/tools/units';
import { GrainsCropTransformed } from '@/types/Grains/crop.input';
import Decimal from 'decimal.js-light';

const emissionsOfGasForFuel = <GasType extends 'CO2' | 'CH4' | 'N2O'>(
  amountOfFuel: TypedOrigin<Volume<'Fuel'>>,
  constants: ConstantsForGrainsCalculator,
  fuelType: 'DIESEL' | 'PETROL' | 'LPG',
  gasType: GasType,
): BinaryOrigin<Mass<GasType>> => {
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
  const energyFromFuel = multiply(energyContentFactorForFuel, amountOfFuel);

  return multiply(efForFuel, energyFromFuel);
};

const transportEmissionsForGas = <GasType extends 'CO2' | 'CH4' | 'N2O'>(
  input: {
    dieselUse: TypedOrigin<Volume<'Fuel'>>;
    petrolUse: TypedOrigin<Volume<'Fuel'>>;
    lpg: TypedOrigin<Volume<'Fuel'>>;
  },
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
  // console.log(gasType, dieselEmissions.unit.value.toNumber());
  // console.log(petrolEmissions.unit.value.toNumber());
  // console.log(lpgEmissions.unit.value.toNumber());
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
  crop: GrainsCropTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;

  // 6.1.1
  // Line 55
  const transportFuelCO2 = transportEmissionsForGas(crop, constants, 'CO2');
  const transportFuelCH4 = transportEmissionsForGas(crop, constants, 'CH4');
  const transportFuelN2O = transportEmissionsForGas(crop, constants, 'N2O');

  // console.log('tfc', transportFuelCO2.unit.value.toNumber());
  // console.log(transportFuelCH4.unit.value.toNumber());
  // console.log(transportFuelN2O.unit.value.toNumber());

  // TODO: Stationary fuel emissions
  return {
    fuelCO2: sum([transportFuelCO2]),
    fuelCH4: sum([transportFuelCH4]),
    fuelN2O: sum([transportFuelN2O]),
  };
};
