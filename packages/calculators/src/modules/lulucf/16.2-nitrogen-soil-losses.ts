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

  const EFcrop = selectConstant(constants.LULUCF, 'EF_CROP');
  const EFpasture = selectConstant(constants.LULUCF, 'EF_PASTURE');
  const CgN2O = selectConstant(constants.COMMON, 'GWP_FACTORSC15');

  const mineralisedNitrogenFromCropClearing = activities
    .filter(isLandClearingForestToCropland)
    .map((activity) => {
      const { region, activityArea } = activity;

      const Or = selectConstant(
        constants.LULUCF,
        'ORGANIC_STOCK_LOSS_FACTORS',
        region,
      );

      const organicCarbonChange = Or.multiply(activityArea).named('∆Si,j=1,y');

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

      const organicCarbonChange =
        Or.multiply(activityArea).named('∆Si,j=2-3,y');

      return organicCarbonChange.divide(R);
    });

  const Nij1y = sum(mineralisedNitrogenFromCropClearing).named('Nij1y');
  const Nij23y = sum(mineralisedNitrogenFromPastureClearing).named('Nij23y');

  return br(Nij1y.multiply(EFcrop).plus(Nij23y.multiply(EFpasture)))
    .multiply(CgN2O)
    .named('ELUC,i,j=1-3,y');
};
