import { Container } from '@/tools/containers';
import { Mass } from '@/tools/units';
import { calculateMassOfNitrogenAppliedToSoilsForFeedlot } from './4.1-feedlot-manure';
import { calculateMassOfNitrogenAppliedToSoilsForDairy } from './4.3-dairy-manure';
import { calculateMassOfNitrogenAppliedToSoilsForPigs } from './4.5-pigs-manure';
import { calculateMassOfNitrogenAppliedToSoilsForPoultry } from './4.6-poultry-manure';
import { ConstantsForManureManagement } from './constants';
import {
  livestockManureIsDairy,
  livestockManureIsFeedlot,
  livestockManureIsPigs,
  livestockManureIsPoultry,
  LivestockManuresInputTransformed,
} from './livestock-manures.input';

export function calculateMassOfNitrogenAppliedToSoils(
  manureInput: LivestockManuresInputTransformed,
  constants: ConstantsForManureManagement,
): Container<Mass<'N'>> {
  if (livestockManureIsPigs(manureInput)) {
    return calculateMassOfNitrogenAppliedToSoilsForPigs(manureInput, constants);
  }

  if (livestockManureIsFeedlot(manureInput)) {
    return calculateMassOfNitrogenAppliedToSoilsForFeedlot(
      manureInput,
      constants,
    );
  }

  if (livestockManureIsPoultry(manureInput)) {
    return calculateMassOfNitrogenAppliedToSoilsForPoultry(
      manureInput,
      constants,
    );
  }

  if (livestockManureIsDairy(manureInput)) {
    return calculateMassOfNitrogenAppliedToSoilsForDairy(
      manureInput,
      constants,
    );
  }

  throw new Error(`Unsupported livestock manure type`);
}
