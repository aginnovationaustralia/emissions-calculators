import { BeefInputTransformed } from '@/calculators/Beef/types/input';
import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { calculateManureManagementCH4 } from './4.1-beef-pasture-manure-methane';
import { calculateManureManagementN2O } from './4.1-beef-pasture-manure-n2o';

export const calculate41BeefPastureManure = (
  input: BeefInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  return {
    manureManagementCH4: calculateManureManagementCH4(input, context),
    manureManagementN2O: calculateManureManagementN2O(input, context),
  };
};
