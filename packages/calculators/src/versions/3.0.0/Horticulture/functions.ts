import { ExecutionContext } from '../executionContext';
import { HorticultureCrop } from '../types/Horticulture/horticulture.input';

export function getAnnualLeakage(
  crop: HorticultureCrop,
  context: ExecutionContext,
): number {
  const { constants } = context;

  return crop.refrigerants.reduce(
    (acc, { refrigerant, chargeSize }) =>
      acc + (constants.REFRIGERANT_GWP[refrigerant] * chargeSize) / 1000,
    0,
  );
}

export function getUanNConstant(context: ExecutionContext) {
  const { constants } = context;

  return constants.FERTILISER_CONTENT.UAN.N;
}
