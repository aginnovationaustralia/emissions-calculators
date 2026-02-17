import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { StationaryFuelType } from '@/calculators/Grains/constants/enums';
import { ExecutionContext } from '@/calculators/Grains/constants/executionContext';
import { selectConstant } from '@/tools/constants';
import { BinaryContainer, TypedContainer } from '@/tools/origins';
import { sum } from '@/tools/sum';
import { energyPerVolume, Mass, massPerEnergy, Volume } from '@/tools/units';
import Decimal from 'decimal.js-light';
import { FuelInputTransformed } from './fuel.input';

const emissionsOfGasForFuel = <GasType extends 'CO2' | 'CH4' | 'N2O'>(
  amountOfFuel: TypedContainer<Volume<'Fuel'>>,
  constants: ConstantsForGrainsCalculator,
  fuelType: StationaryFuelType,
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

  const qSCq = amountOfFuel;
  const efSC1qg = selectConstant(
    constants.COMMON,
    (value) => massPerEnergy(gasType, new Decimal(value)),
    'FUEL_ENERGYGJ',
    'STATIONARY',
    fuelType,
    'SCOPE1_EF',
    gasType,
  );
  const ecSCq = selectConstant(
    constants.COMMON,
    (value) => energyPerVolume('Fuel', new Decimal(value)),
    'FUEL_ENERGYGJ',
    'STATIONARY',
    fuelType,
    'ENERGY_CONTENT_FACTOR',
  );

  // REVISIT: Ordering is unexpected due to limitations of TypeScript overload resolution. Units and results are still correct though
  const a = ecSCq.multiply(qSCq);
  const b = efSC1qg.multiply(a);

  return b;
};

const stationaryEmissionsForGas = <GasType extends 'CO2' | 'CH4' | 'N2O'>(
  input: FuelInputTransformed,
  constants: ConstantsForGrainsCalculator,
  gasType: GasType,
) => {
  const stationaryEmissions = input.stationaryFuel.map((fuel) => {
    return emissionsOfGasForFuel(
      fuel.amountLitres,
      constants,
      fuel.type,
      gasType,
    );
  });
  return sum(stationaryEmissions, {
    name: `EtransGHG${gasType}`,
    valueType: 'variable',
    references: [`6.1.1 (55)`],
  });
};

// 8.2 Stationary combustion fuel
//   fuelCO2, fuelCH4, fuelN2O
export const calculate82StationaryFuel = (
  input: FuelInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;

  const fuelStationaryCO2 = stationaryEmissionsForGas(input, constants, 'CO2');
  const fuelStationaryCH4 = stationaryEmissionsForGas(input, constants, 'CH4');
  const fuelStationaryN2O = stationaryEmissionsForGas(input, constants, 'N2O');

  return {
    fuelStationaryCO2,
    fuelStationaryCH4,
    fuelStationaryN2O,
  };
};
