import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { RootContainer } from '@/tools/origins';
import { mass } from '@/tools/units';
import { GrainsInputTransformed } from '@/types/Grains/input';
import Decimal from 'decimal.js-light';

export const calculateElectricityScope2And3 = (
  input: GrainsInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const zeroCO2 = new RootContainer(mass('CO2e', new Decimal(0)), {
    name: 'zero',
    valueType: 'constant',
  });
  const scope2 = zeroCO2;
  const scope3 = zeroCO2;
  return {
    scope2,
    scope3,
  };
};
