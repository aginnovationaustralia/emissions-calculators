import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { selectConstant } from '@/tools/constants';
import { multiply } from '@/tools/multiply';
import { BinaryOrigin, SummedOrigin, TypedOrigin } from '@/tools/origins';
import { sum } from '@/tools/sum';
import {
  energyPerVolume,
  Mass,
  mass,
  massPerEnergy,
  Volume,
} from '@/tools/units';
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
  dieselUse: TypedOrigin<Volume<'Fuel'>>,
  petrolUse: TypedOrigin<Volume<'Fuel'>>,
  lpgUse: TypedOrigin<Volume<'Fuel'>>,
  constants: ConstantsForGrainsCalculator,
  gasType: GasType,
) => {
  const dieselEmissions = emissionsOfGasForFuel(
    dieselUse,
    constants,
    'DIESEL',
    gasType,
  );
  const petrolEmissions = emissionsOfGasForFuel(
    petrolUse,
    constants,
    'PETROL',
    gasType,
  );
  const lpgEmissions = emissionsOfGasForFuel(lpgUse, constants, 'LPG', gasType);
  return sum([dieselEmissions, petrolEmissions, lpgEmissions], {
    name: `EtransGHG${gasType}`,
    valueType: 'variable',
    unit: mass(gasType),
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
  const fuelCO2: SummedOrigin<Mass<'CO2'>> = transportEmissionsForGas(
    crop.dieselUse,
    crop.petrolUse,
    crop.lpg,
    constants,
    'CO2',
  );

  const fuelCH4: SummedOrigin<Mass<'CH4'>> = transportEmissionsForGas(
    crop.dieselUse,
    crop.petrolUse,
    crop.lpg,
    constants,
    'CH4',
  );

  const fuelN2O: SummedOrigin<Mass<'N2O'>> = transportEmissionsForGas(
    crop.dieselUse,
    crop.petrolUse,
    crop.lpg,
    constants,
    'N2O',
  );
  return {
    fuelCO2,
    fuelCH4,
    fuelN2O,
  };
};
