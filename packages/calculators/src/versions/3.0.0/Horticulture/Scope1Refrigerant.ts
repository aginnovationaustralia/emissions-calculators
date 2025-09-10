import { ExecutionContext } from '../executionContext';
import { HorticultureCrop } from '../types/Horticulture/horticulture.input';
import { getAnnualLeakage } from './functions';

export function calculateScope1Refrigerant(
  crop: HorticultureCrop,
  context: ExecutionContext,
): number {
  return getAnnualLeakage(crop, context);
}
