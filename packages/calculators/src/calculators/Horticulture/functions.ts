import { HorticultureCrop } from '@/types/Horticulture/horticulture.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForHorticultureCalculator } from './constants';

export function getAnnualLeakage(
  crop: HorticultureCrop,
  context: ExecutionContext<ConstantsForHorticultureCalculator>,
): number {
  const { constants } = context;

  return crop.refrigerants.reduce(
    (acc, { refrigerant, chargeSize }) =>
      acc + (constants.COMMON.REFRIGERANT_GWP[refrigerant] * chargeSize) / 1000,
    0,
  );
}

export function getUanNConstant(
  context: ExecutionContext<ConstantsForHorticultureCalculator>,
) {
  const { constants } = context;

  return constants.COMMON.FERTILISER_CONTENT.UAN.N;
}
