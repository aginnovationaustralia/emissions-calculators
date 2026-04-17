import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { selectConstant } from '@/tools/constants';
import { one, zero } from '@/tools/sentinels';
import {
  calculateMineralisedNitrogenFromClearingToCrops,
  calculateMineralisedNitrogenFromClearingToOpen,
} from './16.2-nitrogen-soil-losses';
import { LULUCFInputTransformed } from './input';

export const calculate_16_3_1_1_NitrogenLeachingAndRunoff = (
  input: LULUCFInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  /*
    ELUC,i,j=1-3,y = Ni,j=1-3,y * FracWET * FracLEACH * EF leach * Cg,N2O
    Ni,j=1-3,y = SUM (∆Si,j=1-3,y)/R
    ∆Si,j=1-3,y = Or * ai,j=1-3,y
  */

  const { constants } = context;

  const FracWET = input.isInLeachingZone ? one : zero;
  const FracLEACH = selectConstant(
    constants.CROP,
    'FRACTION_N_LOST_THROUGH_LEACHING_AND_RUNOFF',
  );
  const EFleach = selectConstant(constants.CROP, 'EF_N2O_LEACHING_AND_RUNOFF');
  const CgN2O = selectConstant(constants.COMMON, 'GWP_FACTORSC15');

  const Nij1y = calculateMineralisedNitrogenFromClearingToCrops(input, context);
  const Nij23y = calculateMineralisedNitrogenFromClearingToOpen(input, context);

  const Nij123y = Nij1y.plus(Nij23y);

  return Nij123y.multiply(FracWET)
    .multiply(FracLEACH)
    .multiply(EFleach)
    .multiply(CgN2O)
    .named('ELUC,i,j=1-3,y');
};
