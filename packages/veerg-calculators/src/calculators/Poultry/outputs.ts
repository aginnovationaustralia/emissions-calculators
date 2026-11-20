import { ExecutionContext } from '@/calculators/executionContext';
import { ManureNitrogenOutputContainers } from '@/calculators/types/manure.output';
import { calculateMassOfNitrogenApplicableToSoilsForPoultryFlock } from '@/modules/scope1/4-manure-management/4.6-poultry-manure';
import { ConstantsForPoultryManure } from '@/modules/scope1/4-manure-management/4.6-poultry-manure/constants';
import { PoultryFlockLivestockInputTransformed } from '@/modules/scope1/shared/poultry/input';
import { zeroN } from '@/tools/sentinels';

/**
 * Outputs of a poultry flock that are not emissions: the mass of nitrogen in its manure that can be
 * applied to soils locally, sold to another enterprise, or disposed of as waste. With no
 * poultry flock (undefined), every output is 0.
 */
export const calculatePoultryOutputs = (
  flock: PoultryFlockLivestockInputTransformed | undefined,
  context: ExecutionContext<ConstantsForPoultryManure>,
): ManureNitrogenOutputContainers => ({
  massOfNitrogenInManureApplicableToSoilsKilograms: flock
    ? calculateMassOfNitrogenApplicableToSoilsForPoultryFlock(
        flock,
        context.constants,
      )
    : zeroN,
});
