import { ExecutionContext } from '@/calculators/executionContext';
import { isInLeachingZoneToFracWET } from '@/constants/translations';
import { selectConstant } from '@/tools/constants';
import { zeroN, zeroN2O } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import {
  calculateMineralisedNitrogenFromClearingToCrops,
  calculateMineralisedNitrogenFromClearingToOpen,
} from './16.3-nitrogen-soil-losses';
import { ConstantsForLULUCF } from './constants';
import { LULUCFInputTransformed, LULUCFParentInputTransformed } from './input';
import {
  isLandClearingActivity,
  isLandClearingForestToCropland,
} from './land-use-change-activity-input';

const calculateAvailableMineralisedNitrogenFromClearing = (
  input: LULUCFInputTransformed,
  context: ExecutionContext<ConstantsForLULUCF>,
) => {
  const activities = input.activities?.filter(isLandClearingActivity);

  if (!activities || activities.length === 0) {
    return zeroN;
  }

  const activityRecords = activities.map((activity) => {
    const { isInLeachingZone } = activity;

    const FracWET = isInLeachingZoneToFracWET(isInLeachingZone);

    const mineralisedNitrogen = isLandClearingForestToCropland(activity)
      ? calculateMineralisedNitrogenFromClearingToCrops(activity, context)
      : calculateMineralisedNitrogenFromClearingToOpen(activity, context);

    return mineralisedNitrogen.multiply(FracWET);
  });

  return sum(activityRecords, zeroN);
};

export const calculate_16_4_1_1_NitrogenLeachingAndRunoff = (
  input: LULUCFParentInputTransformed,
  context: ExecutionContext<ConstantsForLULUCF>,
) => {
  const { landUse } = input;

  if (!landUse) {
    return zeroN2O.named('ELUC,i,j=1-3,y');
  }

  /*
    ELUC,i,j=1-3,y = Ni,j=1-3,y * FracWET * FracLEACH * EF leach * Cg,N2O
    Ni,j=1-3,y = SUM (∆Si,j=1-3,y)/R
    ∆Si,j=1-3,y = Or * ai,j=1-3,y
  */

  const { constants } = context;

  const FracLEACH = selectConstant(
    constants.CROP,
    'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF',
  );
  const EFleach = selectConstant(constants.CROP, 'EF_N2O_LEACHING_AND_RUNOFF');
  const CgN2O = selectConstant(constants.COMMON, 'ELEMENTAL_TO_MOLECULAR_N2O');

  const availableMineralisedN =
    calculateAvailableMineralisedNitrogenFromClearing(landUse, context);

  // NOTE: FracWET has been applied on a per clearing activity basis
  return availableMineralisedN
    .multiply(FracLEACH)
    .multiply(EFleach)
    .multiply(CgN2O)
    .named('ELUC,i,j=1-3,y')
    .reference('16.4.1.1 (1)');
};
