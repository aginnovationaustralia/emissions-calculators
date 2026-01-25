import { selectConstant } from '@/calculators/Brocessing/types/constants';
import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { multiply } from '@/tools/multiply';
import { rootOrigin, SummedOrigin } from '@/tools/origins';
import { scope1Output, Scope1Output } from '@/tools/outputs';
import { sum } from '@/tools/sum';
import { energyPerVolume, Mass, mass, massPerEnergy } from '@/tools/units';
import { GrainsCropTransformed } from '@/types/Grains/crop.input';
import Decimal from 'decimal.js-light';

// 6.1 Transport fuel
// 6.2 Stationary combustion fuel
//   fuelCO2, fuelCH4, fuelN2O
export const calculateScope1Fuel = (
  crop: GrainsCropTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;

  const zeroCO2 = rootOrigin(mass('CO2', new Decimal(0)), {
    name: 'zero',
    valueType: 'constant',
  });
  const zeroCH4 = rootOrigin(mass('CH4', new Decimal(0)), {
    name: 'zero',
    valueType: 'constant',
  });
  const zeroN2O = rootOrigin(mass('N2O', new Decimal(0)), {
    name: 'zero',
    valueType: 'constant',
  });

  const dieselEF = selectConstant(
    constants.COMMON,
    (value) => massPerEnergy('CO2', new Decimal(value)),
    'FUEL_ENERGYGJ',
    'TRANSPORT',
    'DIESEL',
    'SCOPE1_EF',
    'CO2',
  );
  const dieselEnergyContentFactor = selectConstant(
    constants.COMMON,
    (value) => energyPerVolume('Fuel', new Decimal(value)),
    'FUEL_ENERGYGJ',
    'TRANSPORT',
    'DIESEL',
    'ENERGY_CONTENT_FACTOR',
  );
  const energyFromDiesel = multiply(dieselEnergyContentFactor, crop.dieselUse);

  const transportFuelsCO2 = multiply(dieselEF, energyFromDiesel);

  const fuelCO2: SummedOrigin<Mass<'CO2'>> = sum({
    items: [transportFuelsCO2],
    unit: mass('CO2'),
  });
  const fuelCH4: Scope1Output<'CH4'> = scope1Output('fuelCH4', zeroCH4);
  const fuelN2O: Scope1Output<'N2O'> = scope1Output('fuelN2O', zeroN2O);
  return {
    fuelCO2,
    fuelCH4,
    fuelN2O,
  };
};
