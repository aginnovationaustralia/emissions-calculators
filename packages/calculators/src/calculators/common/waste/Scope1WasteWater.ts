import { FluidWasteInput } from '@/types/common/fluid-waste.input';
import { ExecutionContext } from '../../executionContext';

export function calculateScope1WasteWater(
  fluidWastes: FluidWasteInput[],
  { constants }: ExecutionContext,
) {
  const { WASTEWATER } = constants.COMMON;
  const {
    TREATMENT_EF,
    EF_COD,
    METHANE_PRODUCTION,
    FLARE_EF,
    F_SLUDGE_FRACTION,
  } = WASTEWATER;

  const total = fluidWastes.reduce((acc, fluidWaste) => {
    const {
      averageInletCOD,
      averageOutletCOD,
      flaredCombustedFraction,
      fluidWasteKl: wasteWaterGenerated,
      fluidWasteTreatmentType,
    } = fluidWaste;

    const treatmentEF = TREATMENT_EF[fluidWasteTreatmentType];

    // resulting units is tonnes CO2e
    const subTotal =
      ((wasteWaterGenerated *
        (averageInletCOD * (1 - F_SLUDGE_FRACTION) - averageOutletCOD) *
        treatmentEF) /
        1000000) *
      (flaredCombustedFraction * METHANE_PRODUCTION * FLARE_EF +
        (1 - flaredCombustedFraction) * EF_COD);

    return acc + subTotal;
  }, 0);

  return total;
}
