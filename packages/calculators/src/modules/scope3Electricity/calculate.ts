import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { RootContainer } from '@/tools/origins';
import { mass } from '@/tools/units';
import { GrainsCropTransformed } from '@/types/Grains/crop.input';
import { GrainsInputTransformed } from '@/types/Grains/input';
import Decimal from 'decimal.js-light';

export const calculateElectricityScope3 = (
  crop: GrainsCropTransformed,
  input: GrainsInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const zeroCO2 = new RootContainer(mass('CO2e', new Decimal(0)), {
    name: 'zero',
    valueType: 'constant',
  });
  const scope3 = zeroCO2;
  return scope3;
};
