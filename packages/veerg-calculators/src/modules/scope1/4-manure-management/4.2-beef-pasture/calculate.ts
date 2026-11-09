import { BeefHerdInputTransformed } from '@/calculators/Beef/types/beef-herd.input';
import { ExecutionContext } from '@/calculators/executionContext';
import { HasIsFebruaryInLeapYearInputTransformed } from '@/calculators/types/has-is-february-in-leap-year.input';
import { calculateManureManagementSoilAtmosphericDepositionN2OForHerd } from './4.2-beef-pasture-manure-atmospheric-deposition-n2o';
import { calculateManureManagementSoilLeachingRunoffN2OForHerd } from './4.2-beef-pasture-manure-leaching-runoff-n2o';
import { calculate42BeefPastureManureCH4ForHerd } from './4.2-beef-pasture-manure-methane';
import { calculateManureManagementSoilDirectN2OForHerd } from './4.2-beef-pasture-manure-n2o';
import { ConstantsForBeefManure } from './constants';

export const calculate42BeefPastureManure = (
  herd: BeefHerdInputTransformed & HasIsFebruaryInLeapYearInputTransformed,
  context: ExecutionContext<ConstantsForBeefManure>,
) => {
  return {
    manureManagementCH4: calculate42BeefPastureManureCH4ForHerd(herd, context),
    manureAtmosphericDepositionN2O:
      calculateManureManagementSoilAtmosphericDepositionN2OForHerd(
        herd,
        context,
      ),
    manureLeachingRunoffN2O:
      calculateManureManagementSoilLeachingRunoffN2OForHerd(herd, context),
    manureSoilDirectN2O: calculateManureManagementSoilDirectN2OForHerd(
      herd,
      context,
    ),
  };
};
