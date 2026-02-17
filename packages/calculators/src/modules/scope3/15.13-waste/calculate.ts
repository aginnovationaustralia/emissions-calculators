import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { ExecutionContext } from '@/calculators/Grains/constants/executionContext';
import { GrainsCropTransformed } from '@/calculators/Grains/types/crop.input';
import { calculateScope3WasteOffsiteManure } from './15.13.1-manure';
import { calculateScope3WasteSolidWaste } from './15.13.2-solid-waste';

export const calculateScope3Waste = (
  crop: GrainsCropTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const offsiteManure = calculateScope3WasteOffsiteManure(crop, context);
  const solidWaste = calculateScope3WasteSolidWaste(crop, context);
  return {
    offsiteManure,
    solidWaste,
  };
};
