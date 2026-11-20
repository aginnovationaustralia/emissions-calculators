import { ExecutionContext } from '@/calculators/executionContext';
import { ManureNitrogenOutputContainers } from '@/calculators/types/manure.output';
import { calculateMassOfNitrogenApplicableToSoilsForPigsHerd } from '@/modules/scope1/4-manure-management/4.5-pigs-manure';
import { ConstantsForPigsManure } from '@/modules/scope1/4-manure-management/4.5-pigs-manure/constants';
import { PigsHerdLivestockInputTransformed } from '@/modules/scope1/shared/pigs/input';
import { zeroN } from '@/tools/sentinels';

/**
 * Outputs of a pig herd that are not emissions: the mass of nitrogen in its manure that can be
 * applied to soils locally, sold to another enterprise, or disposed of as waste. With no
 * pig herd (undefined), every output is 0.
 */
export const calculatePigsOutputs = (
  herd: PigsHerdLivestockInputTransformed | undefined,
  context: ExecutionContext<ConstantsForPigsManure>,
): ManureNitrogenOutputContainers => ({
  massOfNitrogenInManureApplicableToSoilsKilograms: herd
    ? calculateMassOfNitrogenApplicableToSoilsForPigsHerd(
        herd,
        context.constants,
      )
    : zeroN,
});
