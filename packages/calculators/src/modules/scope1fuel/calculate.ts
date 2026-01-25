import { selectConstant } from '@/calculators/Brocessing/types/constants';
import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { multiply } from '@/tools/multiply';
import { SummedOrigin, TypedOrigin } from '@/tools/origins';
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
) => {
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

  const gasEmissionsFromFuel = multiply(efForFuel, energyFromFuel);

  return gasEmissionsFromFuel;
};

// 6.1 Transport fuel
// 6.2 Stationary combustion fuel
//   fuelCO2, fuelCH4, fuelN2O
export const calculateScope1Fuel = (
  crop: GrainsCropTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;

  //   const zeroCO2 = rootOrigin(mass('CO2', new Decimal(0)), {
  //     name: 'zero',
  //     valueType: 'constant',
  //   });
  //   const zeroCH4 = rootOrigin(mass('CH4', new Decimal(0)), {
  //     name: 'zero',
  //     valueType: 'constant',
  //   });
  //   const zeroN2O = rootOrigin(mass('N2O', new Decimal(0)), {
  //     name: 'zero',
  //     valueType: 'constant',
  //   });

  const dieselCO2 = emissionsOfGasForFuel(
    crop.dieselUse,
    constants,
    'DIESEL',
    'CO2',
  );
  const dieselCH4 = emissionsOfGasForFuel(
    crop.dieselUse,
    constants,
    'DIESEL',
    'CH4',
  );
  const dieselN2O = emissionsOfGasForFuel(
    crop.dieselUse,
    constants,
    'DIESEL',
    'N2O',
  );
  const petrolCO2 = emissionsOfGasForFuel(
    crop.petrolUse,
    constants,
    'PETROL',
    'CO2',
  );
  const petrolCH4 = emissionsOfGasForFuel(
    crop.petrolUse,
    constants,
    'PETROL',
    'CH4',
  );
  const petrolN2O = emissionsOfGasForFuel(
    crop.petrolUse,
    constants,
    'PETROL',
    'N2O',
  );
  const lpgCO2 = emissionsOfGasForFuel(crop.lpg, constants, 'LPG', 'CO2');
  const lpgCH4 = emissionsOfGasForFuel(crop.lpg, constants, 'LPG', 'CH4');
  const lpgN2O = emissionsOfGasForFuel(crop.lpg, constants, 'LPG', 'N2O');

  // 6.1.1
  // Line 55
  const fuelCO2: SummedOrigin<Mass<'CO2'>> = sum(
    {
      items: [dieselCO2, petrolCO2, lpgCO2],
      unit: mass('CO2'),
    },
    { name: 'EtransGHGCO2', valueType: 'variable', unit: mass('CO2') },
  );

  const fuelCH4: SummedOrigin<Mass<'CH4'>> = sum(
    {
      items: [dieselCH4, petrolCH4, lpgCH4],
      unit: mass('CH4'),
    },
    { name: 'EtransGHGCH4', valueType: 'variable', unit: mass('CH4') },
  );

  const fuelN2O: SummedOrigin<Mass<'N2O'>> = sum(
    {
      items: [dieselN2O, petrolN2O, lpgN2O],
      unit: mass('N2O'),
    },
    { name: 'EtransGHGN2O', valueType: 'variable', unit: mass('N2O') },
  );
  return {
    fuelCO2,
    fuelCH4,
    fuelN2O,
  };
};
