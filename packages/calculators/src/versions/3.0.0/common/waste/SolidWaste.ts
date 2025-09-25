import { ExecutionContext } from '../../executionContext';
import { SolidWasteInput } from '../../types/common/solid-waste.input';
import { CommonConstants } from '../constants';

export function calculateSolidWaste(
  { onsiteCompostingTonnes, sentOffsiteTonnes }: SolidWasteInput,
  { constants }: ExecutionContext<CommonConstants>,
) {
  const { COMPOSTING_EF, MUNICIPAL_SOLID_WASTE_EF } = constants.COMMON;

  // Waste (inc. Wastewater) B32
  const solidWasteSentOffsite = sentOffsiteTonnes * MUNICIPAL_SOLID_WASTE_EF;
  // Waste (inc. Wastewater) B39
  const compostedSolidWasteCO2 = onsiteCompostingTonnes * COMPOSTING_EF;

  // results are in tonnes CO2e
  return { compostedSolidWasteCO2, solidWasteSentOffsite };
}
