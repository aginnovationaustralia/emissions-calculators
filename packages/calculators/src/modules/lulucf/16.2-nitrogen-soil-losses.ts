import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { selectConstant } from '@/tools/constants';
import { br } from '@/tools/containers';
import { sum } from '@/tools/sum';
import { LULUCFInputTransformed } from './input';
import {
  isLandClearingForestToCropland,
  isLandClearingToGrasslandOrSettlements,
} from './land-user-change-activity-input';

export const calculate_16_2_1_1_NitrogenMineralisationSoilLosses = (
  input: LULUCFInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  /*
    ELUC,i,j=1-3,y = (Ni,j=1,y * EF crop + Ni,j=2-3,y * EF pasture) * Cg,N2O
    Ni,j=1-3,y = SUM (∆Si,j=1-3,y)/R
  */

  const { constants } = context;

  const R = selectConstant(constants.LULUCF, 'CARBON_TO_NITROGEN_RATIO');

  const { activities } = input;

  const mineralisedNitrogenFromCropClearing = activities
    .filter(isLandClearingForestToCropland)
    .map((activity) => {
      const { region, activityArea } = activity;

      const Or = selectConstant(
        constants.LULUCF,
        'ORGANIC_STOCK_LOSS_FACTORS',
        region,
      );

      const organicCarbonChange = Or.multiply(activityArea);

      return organicCarbonChange.divide(R);
    });

  const mineralisedNitrogenFromPastureClearing = activities
    .filter(isLandClearingToGrasslandOrSettlements)
    .map((activity) => {
      const { region, activityArea } = activity;

      const Or = selectConstant(
        constants.LULUCF,
        'ORGANIC_STOCK_LOSS_FACTORS',
        region,
      );

      const organicCarbonChange = Or.multiply(activityArea);

      return organicCarbonChange.divide(R);
    });

  return br(
    sum(mineralisedNitrogenFromCropClearing)
      .multiply(EFcrop)
      .plus(sum(mineralisedNitrogenFromPastureClearing).multiply(EFpasture))
      .multiply(CgN2O),
  );
};
