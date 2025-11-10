import { DairyComplete } from '@/types/Dairy/dairy.input';
import { DairyEmissionsIntensities } from '@/types/Dairy/intensities.output';
import { divideBySafeFromZero } from '../common/tools';

export function getManureSumpDispersalFractionMilking(complete: DairyComplete) {
  return complete.manureManagementMilkingCows.sumpAndDispersal / 100;
}

export function getManureSumpDispersalFractionOther(complete: DairyComplete) {
  return complete.manureManagementOtherDairyCows.sumpAndDispersal / 100;
}

export function getEmissionsIntensities(
  totalEmissions: number,
  milkSolidsProducedTonnes: number,
): DairyEmissionsIntensities {
  return {
    milkSolidsProducedTonnes,
    intensity: divideBySafeFromZero(totalEmissions, milkSolidsProducedTonnes),
  };
}
