import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { TransportFuelType } from '@/calculators/Grains/constants/enums';
import { ExecutionContext } from '@/calculators/Grains/constants/executionContext';
import { selectConstant } from '@/tools/constants';
import { BinaryContainer, TypedContainer } from '@/tools/containers';
import { sum } from '@/tools/sum';
import { energyPerVolume, Mass, massPerEnergy, Volume } from '@/tools/units';
import Decimal from 'decimal.js-light';
import { FuelInputTransformed } from './fuel.input';

const emissionsOfGasForFuel = <GasType extends 'CO2' | 'CH4' | 'N2O'>(
  amountOfFuel: TypedContainer<Volume<'Fuel'>>,
  constants: ConstantsForGrainsCalculator,
  fuelType: TransportFuelType,
  gasType: GasType,
): BinaryContainer<Mass<GasType>> => {
  /*
  8.1.1.1 Method 1 - Fuel use transport
(1) Emissions for each GHG from the combustion of fuels for transport purposes, Eg (t
CO2e), is estimated by:
Eg = SUMt SUMq QTrans,tq * ECTrans,q * EFTrans,1,tqg * 10^-3

Where QTrans,tq = amount of fuel type q combusted in each transport type t (kL or m3)
ECTrans,q = energy content factor of fuel (GJ/kL or GJ/m3)
EFTrans,1,tqg = Scope 1 emission factor for each fuel type and transport type
for each greenhouse gas (kg CO2e/GJ)
  */
  const qTransTQ = amountOfFuel;
  const ecTransQ = selectConstant(
    constants.COMMON,
    (value) => energyPerVolume('Fuel', new Decimal(value)),
    'FUEL_ENERGYGJ',
    'TRANSPORT',
    fuelType,
    'ENERGY_CONTENT_FACTOR',
  );
  const efTrans1tqg = selectConstant(
    constants.COMMON,
    (value) => massPerEnergy(gasType, new Decimal(value)),
    'FUEL_ENERGYGJ',
    'TRANSPORT',
    fuelType,
    'SCOPE1_EF',
    gasType,
  );
  const energyFromFuel = ecTransQ.multiply(qTransTQ);

  return efTrans1tqg.multiply(energyFromFuel);
};

const transportEmissionsForGas = <GasType extends 'CO2' | 'CH4' | 'N2O'>(
  input: FuelInputTransformed,
  constants: ConstantsForGrainsCalculator,
  gasType: GasType,
) => {
  const transportFuelEmissions = input.transportFuel.map((fuel) => {
    return emissionsOfGasForFuel(
      fuel.amountLitres,
      constants,
      fuel.type,
      gasType,
    );
  });

  return sum(transportFuelEmissions, {
    name: `EtransGHG${gasType}`,
    valueType: 'variable',
    references: [`8.1.1.1 (62)`],
  });
};

export const calculate81TransportFuel = (
  input: FuelInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;

  const fuelTransportCO2 = transportEmissionsForGas(input, constants, 'CO2');
  const fuelTransportCH4 = transportEmissionsForGas(input, constants, 'CH4');
  const fuelTransportN2O = transportEmissionsForGas(input, constants, 'N2O');

  return {
    fuelTransportCO2,
    fuelTransportCH4,
    fuelTransportN2O,
  };
};
