import { ExecutionContext } from '@/calculators/executionContext';
import {
  getTotalMassInWasteTreatmentFacility,
  wasteAmountAsMass,
} from '@/modules/scope1/shared/solid-waste/calculate';
import { HasSolidWasteInputTransformed } from '@/modules/scope1/shared/solid-waste/input';
import { selectConstant } from '@/tools/constants';
import { Container } from '@/tools/containers';
import { oneMinus, zeroCO2e } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { Mass, MassPerMass, RealNumber } from '@/tools/units';

/**
 * Ewaste = SUM[f,w] (Qwf * EFwf * (1 - Rf))
 */
const wasteFromSource = (
  massOfWaste: Container<Mass<'Solid Waste'>>,
  wasteEF: Container<MassPerMass<'CO2e', 'Solid Waste'>>,
  recoveryFraction: Container<RealNumber>,
) =>
  massOfWaste
    .multiply(wasteEF)
    .multiply(oneMinus(recoveryFraction))
    .reference('15.12.1.1 (1');

/**
 * Calculate emissions from solid waste *Eg*. This calculation is the same for scope 1
 * and 3, the scope depends on whether the input describes waste managed on or off the
 * farm boundary.
 */
export const calculateScope3SolidWasteEmissions = (
  input: HasSolidWasteInputTransformed,
  context: ExecutionContext,
) => {
  const { constants } = context;
  const offsiteWaste = input?.waste?.treatedOffsite;
  if (offsiteWaste === undefined) return zeroCO2e;
  const {
    landfillWithGasRecovery,
    landfillWithoutGasRecovery,
    incineration,
    composting,
    anaerobicDigestion,
  } = offsiteWaste;

  const landfillWithGasRecoveryFraction = selectConstant(
    constants.COMMON,
    'SOLID_WASTE_TREATMENT',
    'SCOPE_3',
    'Landfill (with gas recovery)',
    'RECOVERY_FRACTION',
  ).named(`Rf (Landfill (with gas recovery))`);
  const landfillWithGasEmissions = (landfillWithGasRecovery ?? []).map(
    (waste) => {
      const massOfWaste = wasteAmountAsMass(waste, constants);
      const wasteEF = selectConstant(
        constants.COMMON,
        'SOLID_WASTE_TREATMENT',
        'SCOPE_3',
        'Landfill (with gas recovery)',
        'WASTE_TYPES',
        waste.wasteType,
      ).named(`EFwf (Landfill w/ gas; ${waste.wasteType.unit})`);

      return wasteFromSource(
        massOfWaste,
        wasteEF,
        landfillWithGasRecoveryFraction,
      );
    },
  );

  const landfillWithoutGasRecoveryFraction = selectConstant(
    constants.COMMON,
    'SOLID_WASTE_TREATMENT',
    'SCOPE_3',
    'Landfill (without gas recovery)',
    'RECOVERY_FRACTION',
  ).named(`Rf (Landfill (without gas recovery))`);
  const landfillWithoutGasEmissions = (landfillWithoutGasRecovery ?? []).map(
    (waste) => {
      const massOfWaste = wasteAmountAsMass(waste, constants);
      const wasteEF = selectConstant(
        constants.COMMON,
        'SOLID_WASTE_TREATMENT',
        'SCOPE_3',
        'Landfill (without gas recovery)',
        'WASTE_TYPES',
        waste.wasteType,
      ).named(`EFwf (Landfill w/out gas; ${waste.wasteType.unit})`);

      return wasteFromSource(
        massOfWaste,
        wasteEF,
        landfillWithoutGasRecoveryFraction,
      );
    },
  );

  const incinerationRecoveryFraction = selectConstant(
    constants.COMMON,
    'SOLID_WASTE_TREATMENT',
    'SCOPE_3',
    'Incineration',
    'RECOVERY_FRACTION',
  ).named(`Rf (Incineration)`);
  // Incineration
  const incinerationEmissions = (incineration ?? []).map((waste) => {
    const massOfWaste = wasteAmountAsMass(waste, constants);
    const wasteEF = selectConstant(
      constants.COMMON,
      'SOLID_WASTE_TREATMENT',
      'SCOPE_3',
      'Incineration',
      'WASTE_TYPES',
      waste.wasteType,
    ).named(`EFwf (Incineration; ${waste.wasteType.unit})`);

    return wasteFromSource(massOfWaste, wasteEF, incinerationRecoveryFraction);
  });

  /**
   * For each biological treatment type, there's only one EF, so we can simplify
   * by getting the total mass sent to each facility type.
   */
  // Composting
  const compostingEF = selectConstant(
    constants.COMMON,
    'SOLID_WASTE_TREATMENT',
    'SCOPE_3',
    'Composting',
    'EF',
  ).named(`EFwf (Composting)`);
  const compostingMass = getTotalMassInWasteTreatmentFacility(
    composting,
    constants,
  ).named(`Qwf (Composting)`);
  const compostingRecoveryFraction = selectConstant(
    constants.COMMON,
    'SOLID_WASTE_TREATMENT',
    'SCOPE_3',
    'Composting',
    'RECOVERY_FRACTION',
  ).named(`Rf (Composting)`);

  const compostingEmissions = wasteFromSource(
    compostingMass,
    compostingEF,
    compostingRecoveryFraction,
  );

  // Anaerobic Digestion
  const anaerobicDigestionEF = selectConstant(
    constants.COMMON,
    'SOLID_WASTE_TREATMENT',
    'SCOPE_3',
    'Anaerobic Digestion',
    'EF',
  ).named(`EFwf (Anaerobic Digestion)`);
  const anaerobicDigestionMass = getTotalMassInWasteTreatmentFacility(
    anaerobicDigestion,
    constants,
  ).named(`Qwf (Anaerobic Digestion)`);
  const anaerobicDigestionRecoveryFraction = selectConstant(
    constants.COMMON,
    'SOLID_WASTE_TREATMENT',
    'SCOPE_3',
    'Composting',
    'RECOVERY_FRACTION',
  ).named(`Rf (Anaerobic Digestion)`);

  const anaerobicDigestionEmissions = wasteFromSource(
    anaerobicDigestionMass,
    anaerobicDigestionEF,
    anaerobicDigestionRecoveryFraction,
  );

  // Because composting/anaerobic will always be a non-void unit, empty arrays don't need separate handling
  return sum([
    compostingEmissions,
    anaerobicDigestionEmissions,
    ...incinerationEmissions,
    ...landfillWithGasEmissions,
    ...landfillWithoutGasEmissions,
  ]).named(`Ewaste`);
};
