import { ExecutionContext } from '@/calculators/executionContext';
import { ManureNitrogenOutputContainers } from '@/calculators/types/manure.output';
import { calculateMassOfNitrogenApplicableToSoilsForDairyHerd } from '@/modules/scope1/4-manure-management/4.3-dairy-manure/calculate';
import { ConstantsForDairyManure } from '@/modules/scope1/4-manure-management/4.3-dairy-manure/constants';
import { DairyHerdLivestockInputTransformed } from '@/modules/scope1/shared/dairy/input';
import { zeroN } from '@/tools/sentinels';

/**
 * Outputs of a dairy herd that are not emissions: the mass of nitrogen in its manure that can be
 * applied to soils locally, sold to another enterprise, or disposed of as waste. With no
 * dairy herd (undefined), every output is 0.
 */
export const calculateDairyOutputs = (
  herd: DairyHerdLivestockInputTransformed | undefined,
  context: ExecutionContext<ConstantsForDairyManure>,
): ManureNitrogenOutputContainers => ({
  massOfNitrogenInManureApplicableToSoilsKilograms: herd
    ? calculateMassOfNitrogenApplicableToSoilsForDairyHerd(
        herd,
        context.constants,
      )
    : zeroN,
});
