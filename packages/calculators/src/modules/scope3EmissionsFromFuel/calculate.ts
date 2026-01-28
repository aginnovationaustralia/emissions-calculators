import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { RootContainer } from '@/tools/origins';
import { mass } from '@/tools/units';
import { GrainsCropTransformed } from '@/types/Grains/crop.input';
import Decimal from 'decimal.js-light';

export const calculateScope3EmissionsFromFuel = (
  crop: GrainsCropTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const zeroCO2 = new RootContainer(mass('CO2e', new Decimal(0)), {
    name: 'zero',
    valueType: 'constant',
  });
  const fuel = zeroCO2;
  return {
    fuel,
  };
};
