import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { BaseGrainsCropTransformed } from '@/calculators/Grains/types/base-crop.input';
import { calculateMassOfNitrogenAppliedToSoilsForFeedlot } from './4.2-feedlot-manure';
import { calculateMassOfNitrogenAppliedToSoilsForSwine } from './4.5-swine-manure';
import {
  livestockManureIsFeedlot,
  livestockManureIsSwine,
  LivestockManuresInputTransformed,
} from './livestock-manures.input';

export function calculateMassOfNitrogenAppliedToSoils(
  manureInput: LivestockManuresInputTransformed,
  crop: BaseGrainsCropTransformed,
  constants: ConstantsForGrainsCalculator,
) {
  if (livestockManureIsSwine(manureInput)) {
    return calculateMassOfNitrogenAppliedToSoilsForSwine(
      manureInput,
      crop,
      constants,
    );
  }

  if (livestockManureIsFeedlot(manureInput)) {
    return calculateMassOfNitrogenAppliedToSoilsForFeedlot(
      manureInput,
      crop,
      constants,
    );
  }

  return calculateMassOfNitrogenAppliedToSoilsForSwine(
    manureInput,
    crop,
    constants,
  );
}
