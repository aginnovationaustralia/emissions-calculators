import { ExecutionContext } from '@/calculators/executionContext';
import { HasConstants } from '@/constants/types';
import { zeroCH4, zeroN, zeroN2O } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import {
  FeedlotLotFertiliserInputTransformed,
  FeedlotLotLivestockInputTransformed,
} from '../../shared/feedlot/input';
import { ConstantsForFeedlotManure } from './constants';
import {
  calculateAtmosphericDepositionN2OEmissionsForGroup,
  calculateDirectN2OEmissionsForGroup,
  calculateManureManagementCH4ForGroup,
  calculateMassOfNitrogenAppliedToSoilsForGroup,
} from './feedlot-group';

/**
 * Calculate methane emissions *ECH4* produced by feedlot cattle manure
 * (4.1.1.1/4.1.1.2)
 */
export function calculateManureManagementCH4ForFeedlot(
  input: FeedlotLotLivestockInputTransformed,
  context: ExecutionContext<HasConstants<'FEEDLOT' | 'COMMON' | 'LIVESTOCK'>>,
) {
  const emissionsPerGroup = input.groups.map((group) =>
    calculateManureManagementCH4ForGroup(
      group,
      input.state,
      input.method2MeanAnnualTemperature,
      context.constants,
    ),
  );
  return sum(emissionsPerGroup, zeroCH4).named('ECH4');
}

/**
 * Calculate direct nitrous oxide emissions *EN2O,dir* produced by feedlot cattle
 * (4.1.1.3/4.1.1.4)
 */
export function calculateDirectN2OEmissionsForFeedlot(
  input: FeedlotLotLivestockInputTransformed,
  context: ExecutionContext<HasConstants<'FEEDLOT' | 'COMMON'>>,
) {
  const emissionsPerGroup = input.groups.map((group) =>
    calculateDirectN2OEmissionsForGroup(group, context.constants),
  );
  return sum(emissionsPerGroup, zeroN2O).named('EN2O,dir');
}

/**
 * Calculate nitrous oxide emissions from atmospheric deposition *EN2O,ad* produced by
 * feedlot cattle (4.1.1.5/4.1.1.6)
 */
export function calculateAtmosphericDepositionN2OEmissionsForFeedlot(
  input: FeedlotLotLivestockInputTransformed,
  context: ExecutionContext<
    HasConstants<'FEEDLOT' | 'COMMON' | 'LIVESTOCK' | 'CROP'>
  >,
) {
  const emissionsPerGroup = input.groups.map((group) =>
    calculateAtmosphericDepositionN2OEmissionsForGroup(
      group,
      input.grazingSystem,
      context.constants,
    ),
  );
  return sum(emissionsPerGroup, zeroN2O).named('EN2O,dir');
}

export const calculate41BeefFeedlotManureManagement = (
  lot: FeedlotLotLivestockInputTransformed,
  context: ExecutionContext<ConstantsForFeedlotManure>,
) => {
  return {
    manureManagementCH4: calculateManureManagementCH4ForFeedlot(lot, context),
    manureDirectN2O: calculateDirectN2OEmissionsForFeedlot(lot, context),
    manureAtmosphericDepositionN2O:
      calculateAtmosphericDepositionN2OEmissionsForFeedlot(lot, context),
    /**
     * Due to strict environmental controls leaching from feedlot MMS are assumed to be
     * zero. Run-off from MMS is included in the treatment stage 3 of the direct MMS
     * estimates.
     */
    manureLeachingRunoffN2O: zeroN2O,
  };
};

/**
 * Calculate mass of nitrogen applied to soil *MNSoil,scope1* produced by feedlot cattle
 * (4.1.1.9)
 */
export function calculateMassOfNitrogenAppliedToSoilsForFeedlot(
  input: FeedlotLotFertiliserInputTransformed,
  constants: HasConstants<'FEEDLOT' | 'COMMON' | 'LIVESTOCK'>,
) {
  return (
    input.groups.length === 0
      ? zeroN
      : sum(
          input.groups.map((group) =>
            calculateMassOfNitrogenAppliedToSoilsForGroup(group, constants),
          ),
          zeroN,
        ).multiply(input.fractionAppliedToSoils)
  )
    .named(`MNSoil`)
    .reference('4.1.1.9 (1)');
}
