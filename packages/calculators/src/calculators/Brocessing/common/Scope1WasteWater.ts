import { selectConstant } from '@/calculators/Brocessing/types/constants';
import { multiply } from '@/calculators/Brocessing/types/multiply';
import { Origin, rootOrigin } from '@/calculators/Brocessing/types/origins';
import { sum } from '@/calculators/Brocessing/types/sum';
import { mass, Mass, realNumber } from '@/calculators/Brocessing/types/units';
import { FluidWasteInputTransformed } from '@/types/common/fluid-waste.input';
import Decimal from 'decimal.js-light';
import { ExecutionContext } from '../../executionContext';
import { subtract } from '../types/subtract';

export function calculateScope1WasteWater(
  fluidWastes: FluidWasteInputTransformed[],
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

  const amounts: Origin<Mass<'CO2e'>>[] = fluidWastes.map((fluidWaste) => {
    const {
      averageInletCOD,
      averageOutletCOD,
      flaredCombustedFraction,
      fluidWasteKl: wasteWaterGenerated,
      fluidWasteTreatmentType,
    } = fluidWaste;

    // const treatmentEF = TREATMENT_EF[fluidWasteTreatmentType];
    const treatmentEF = selectConstant(
      constants.COMMON,
      (value) => realNumber(new Decimal(value)),
      'WASTEWATER',
      'TREATMENT_EF',
      fluidWasteTreatmentType,
    );

    const sludgeFraction = selectConstant(
      constants.COMMON,
      (value) => realNumber(new Decimal(value)),
      'WASTEWATER',
      'F_SLUDGE_FRACTION',
    );

    const nonSludgeFraction = subtract(
      rootOrigin(realNumber(new Decimal(1)), {
        name: '1',
        valueType: 'variable',
      }),
      sludgeFraction,
    );

    const netInletCOD = multiply(averageInletCOD, nonSludgeFraction);

    const oxygenPerVolume = subtract(netInletCOD, averageOutletCOD);

    const emissionsPerVolume = multiply(treatmentEF, oxygenPerVolume);

    const partA = multiply(wasteWaterGenerated, emissionsPerVolume);

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

  return sum({
    items: amounts,
    unit: mass('CO2e'),
  });
}
