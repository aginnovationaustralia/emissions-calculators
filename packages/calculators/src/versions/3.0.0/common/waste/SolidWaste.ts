import { ExecutionContext } from '../../executionContext';
import { SolidWasteInput } from '../../types/common/solid-waste.input';

export function calculateSolidWaste(
  { onsiteCompostingTonnes, sentOffsiteTonnes }: SolidWasteInput,
  { constants }: ExecutionContext,
) {
  const { COMPOSTING_EF, MUNICIPAL_SOLID_WASTE_EF } = constants.COMMON;

  const solidWasteSentOffsite = sentOffsiteTonnes * MUNICIPAL_SOLID_WASTE_EF;
  const compostedSolidWasteCO2 = onsiteCompostingTonnes * COMPOSTING_EF;

  // results are in tonnes CO2e
  return { compostedSolidWasteCO2, solidWasteSentOffsite };
}
