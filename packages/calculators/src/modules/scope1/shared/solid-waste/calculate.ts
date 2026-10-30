import { HasCommonConstants } from '@/constants/types';
import { SolidWasteSpecificScope3InputTransformed } from '@/modules/scope3/15.12-waste/solid-waste-scope3.input';
import { selectConstant } from '@/tools/constants';
import { Container } from '@/tools/containers';
import { zeroMassSolidWaste } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { Mass } from '@/tools/units';
import { SolidWasteSpecificScope1Method2InputTransformed } from '../../10-solid-waste/solid-waste-method2.input';
import { isMassBasedAmount } from '../../10-solid-waste/solid-waste-units.input';

/**
 * Helper for getting total mass of some specific waste input
 */
export const wasteAmountAsMass = (
  waste:
    | SolidWasteSpecificScope1Method2InputTransformed
    | SolidWasteSpecificScope3InputTransformed,
  constants: HasCommonConstants,
): Container<Mass<'Solid Waste'>> => {
  if (isMassBasedAmount(waste)) {
    return waste.massWasteTonnes;
  }
  const { wasteType, volumeWasteCubicMetres } = waste;
  const volumeToMassConversionFactor = selectConstant(
    constants.COMMON,
    'SOLID_WASTE_TREATMENT',
    'WASTE_TYPES_VOLUME_TO_MASS',
    wasteType,
  ).named(`VTMw (${wasteType.unit})`);
  /**
   * Qwt = Vwt * VTMw
   */
  return volumeToMassConversionFactor
    .multiply(volumeWasteCubicMetres)
    .reference('10.1.6 (2)');
};

/**
 * Resolve an array of specific solid waste inputs into a single total mass.
 */
export const getTotalMassInWasteTreatmentFacility = (
  wasteItems:
    | (
        | SolidWasteSpecificScope1Method2InputTransformed
        | SolidWasteSpecificScope3InputTransformed
      )[]
    | undefined,
  constants: HasCommonConstants,
): Container<Mass<'Solid Waste'>> => {
  const massPerItem = (wasteItems ?? []).map((waste) =>
    wasteAmountAsMass(waste, constants).named(`Q (${waste.facilityType.unit})`),
  );
  return sum(massPerItem, zeroMassSolidWaste);
};
