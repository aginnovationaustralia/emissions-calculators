import { HorticultureCrop } from '@/types/Horticulture/horticulture.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForHorticultureCalculator } from './constants';
import { getAnnualLeakage } from './functions';

export function calculateScope1Refrigerant(
  crop: HorticultureCrop,
  context: ExecutionContext<ConstantsForHorticultureCalculator>,
): number {
  return getAnnualLeakage(crop, context);
}
