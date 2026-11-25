import { ExecutionContext } from '@/calculators/executionContext';
import { ManureNitrogenOutputContainers } from '@/calculators/types/manure.output';
import { HasConstants } from '@/constants/types';
import { calculateMassOfNitrogenApplicableToSoilsForFeedlot } from '@/modules/scope1/4-manure-management/4.1-feedlot-manure';
import { FeedlotLotLivestockInputTransformed } from '@/modules/scope1/shared/feedlot/input';
import { zeroN } from '@/tools/sentinels';

/**
 * Outputs of a feedlot lot that are not emissions: the mass of nitrogen in its manure that can be
 * applied to soils locally, sold to another enterprise, or disposed of as waste. With no
 * feedlot lot (undefined), every output is 0.
 */
export const calculateFeedlotOutputs = (
  lot: FeedlotLotLivestockInputTransformed | undefined,
  context: ExecutionContext<HasConstants<'FEEDLOT' | 'COMMON' | 'LIVESTOCK'>>,
): ManureNitrogenOutputContainers => ({
  massOfNitrogenInManureApplicableToSoilsKilograms: lot
    ? calculateMassOfNitrogenApplicableToSoilsForFeedlot(lot, context.constants)
    : zeroN,
});
