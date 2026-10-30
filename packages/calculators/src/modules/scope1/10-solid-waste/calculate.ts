import { ExecutionContext } from '@/calculators/executionContext';
import {
  SolidWasteOrganicManagedTreatmentTypes,
  SolidWasteUnmanagedTreatmentTypes,
} from '@/constants/enums';
import { HasCommonConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { Container } from '@/tools/containers';
import { captureMethod1Or2Value } from '@/tools/multi';
import { oneMinus, zeroCH4, zeroCO2, zeroN2O } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { Mass } from '@/tools/units';
import {
  getTotalMassInWasteTreatmentFacility,
  wasteAmountAsMass,
  zeroSolidWaste,
} from '../shared/solid-waste/calculate';
import { HasSolidWasteInputTransformed } from '../shared/solid-waste/input';
import { SolidWasteMethod2InputTransformed } from './solid-waste-method2.input';
import {
  solidWasteScope1InputSchemaIsMethod1,
  SolidWasteScope1InputTransformed,
} from './solid-waste-scope1.input';

const treatmentTypeToKeyName = {
  Burial: 'unmanagedBurial',
  'Unmanaged - deep': 'unmanagedDeep',
  'Unmanaged - shallow': 'unmanagedShallow',
  Composting: 'composting',
  'Anaerobic Digestion': 'anaerobicDigestion',
  Incineration: 'incineration',
} as const;

/**
 * Calculates CH4 and N2O emissions from biological waste treatment (10.1.1 & 10.1.3)
 */
const calculateSolidWasteBiologicalTreatmentEmissions = (
  input: SolidWasteScope1InputTransformed,
  constants: HasCommonConstants,
): {
  bioSolidWasteCH4: Container<Mass<'CH4'>>;
  bioSolidWasteN2O: Container<Mass<'N2O'>>;
} => {
  /**
   * ECH4 = SUMt (Qt * EFCH4,t)
   *
   * EN2O = SUMt (Qt * EFN2O,t)
   *
   * The only difference between method 1 and method 2 is that waste types are separated,
   * in which case we need the total mass.
   */

  const bioTreatmentEmissions = SolidWasteOrganicManagedTreatmentTypes.map(
    (treatmentType) => {
      const EFCH4 = selectConstant(
        constants.COMMON,
        'SOLID_WASTE_TREATMENT',
        'SCOPE_1',
        'FACILITY_FACTORS',
        treatmentType,
        'CH4',
      ).named(`EFCH4,t (${treatmentType})`);

      const EFN2O = selectConstant(
        constants.COMMON,
        'SOLID_WASTE_TREATMENT',
        'SCOPE_1',
        'FACILITY_FACTORS',
        treatmentType,
        'N2O',
      ).named(`EFN2O,t (${treatmentType})`);

      const wasteAmount = (
        solidWasteScope1InputSchemaIsMethod1(input)
          ? (input[treatmentTypeToKeyName[treatmentType]] ??
            captureMethod1Or2Value(zeroSolidWaste, undefined))
          : getTotalMassInWasteTreatmentFacility(
              input[treatmentTypeToKeyName[treatmentType]],
              constants,
            )
      ).named(`Qt (${treatmentType})`);

      return {
        bioSolidWasteCH4: wasteAmount.multiply(EFCH4).reference('10.1.1 (1)'),
        bioSolidWasteN2O: wasteAmount.multiply(EFN2O).reference('10.1.3 (1)'),
      };
    },
  );

  const bioSolidWasteCH4 = sum(
    bioTreatmentEmissions.map(({ bioSolidWasteCH4 }) => bioSolidWasteCH4),
    zeroCH4,
  ).named(`ECH4 (t)`);

  const bioSolidWasteN2O = sum(
    bioTreatmentEmissions.map(({ bioSolidWasteN2O }) => bioSolidWasteN2O),
    zeroN2O,
  ).named(`EN2O (t)`);

  return { bioSolidWasteCH4, bioSolidWasteN2O };
};

/**
 * Calculate CO2 emissions from open burning of solid waste using method 1 (10.1.5)
 */
const calculateSolidWasteIncinerationEmissionsMethod1 = (
  input: SolidWasteScope1InputTransformed,
  constants: HasCommonConstants,
): Container<Mass<'CO2'>> => {
  // Allow method 2 inputs, for comparison.
  const incineration = (
    (solidWasteScope1InputSchemaIsMethod1(input)
      ? input.incineration
      : getTotalMassInWasteTreatmentFacility(input.incineration, constants)) ??
    zeroSolidWaste
  ).named(`Qburn`);

  const burnEF = selectConstant(
    constants.COMMON,
    'SOLID_WASTE_TREATMENT',
    'SCOPE_1',
    'FACILITY_FACTORS',
    'Incineration',
  ).named('EFburn,CO2');

  const elementalToMolecularCO2 = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_CO2',
  ).named('CCO2');

  /**
   * ECO2 = Qburn * EFburn,CO2 * CCO2
   */
  return captureMethod1Or2Value(
    incineration
      .multiply(burnEF)
      .multiply(elementalToMolecularCO2)
      .reference('10.1.5 (1)'),
    undefined,
  ).named(`ECO2`);
};

/**
 * Calculate CO2 emissions from open burning of solid waste using method 2 (10.1.6)
 */
const calculateSolidWasteIncinerationEmissionsMethod2 = (
  input: SolidWasteMethod2InputTransformed,
  constants: HasCommonConstants,
): Container<Mass<'CO2'>> => {
  const elementalToMolecularCO2 = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_CO2',
  ).named('CCO2');

  const incineration = input.incineration ?? [];
  const incinerationEmissions = incineration.map((waste) => {
    const wasteMass = wasteAmountAsMass(waste, constants);
    const { wasteType } = waste;

    const dryMatterContent = selectConstant(
      constants.COMMON,
      'SOLID_WASTE_TREATMENT',
      'SCOPE_1',
      'WASTE_FACTORS',
      wasteType,
      'DRY_MATTER_CONTENT',
    ).named(`dmw (${wasteType.unit})`);

    const carbonContent = selectConstant(
      constants.COMMON,
      'SOLID_WASTE_TREATMENT',
      'SCOPE_1',
      'WASTE_FACTORS',
      wasteType,
      'CARBON_CONTENT',
    ).named(`CCw (${wasteType.unit})`);

    const fossilCarbonContent = selectConstant(
      constants.COMMON,
      'SOLID_WASTE_TREATMENT',
      'SCOPE_1',
      'WASTE_FACTORS',
      wasteType,
      'FOSSIL_ORIGIN',
    ).named(`FCCw (${wasteType.unit})`);

    const oxidationFactor = selectConstant(
      constants.COMMON,
      'SOLID_WASTE_TREATMENT',
      'SCOPE_1',
      'WASTE_FACTORS',
      wasteType,
      'OXIDATION_FACTOR',
    ).named(`OFw (${wasteType.unit})`);

    /**
     * ECO2 = SUM[w] (Qburn,w * dmw * CCw * FCCw * OFw * CCO2)
     */
    const emissions = wasteMass
      .multiply(dryMatterContent)
      .multiply(carbonContent)
      .multiply(fossilCarbonContent)
      .multiply(oxidationFactor)
      .multiply(elementalToMolecularCO2)
      .reference('10.1.6 (1)');

    return emissions;
  });

  return captureMethod1Or2Value(
    calculateSolidWasteIncinerationEmissionsMethod1(input, constants),
    incinerationEmissions.length === 0
      ? zeroCO2
      : sum(incinerationEmissions, zeroCO2).named(`ECO2`),
  );
};

/**
 * Calculate CO2 emissions from open burning of solid waste (10.1.5 & 10.1.6)
 */
const calculateSolidWasteIncinerationEmissions = (
  input: SolidWasteScope1InputTransformed,
  constants: HasCommonConstants,
): Container<Mass<'CO2'>> =>
  solidWasteScope1InputSchemaIsMethod1(input)
    ? calculateSolidWasteIncinerationEmissionsMethod1(input, constants)
    : calculateSolidWasteIncinerationEmissionsMethod2(input, constants);

/**
 * Calculate CH4 emissions from unmanaged solid waste using method 1 (10.1.7)
 */
const calculateUnmanagedSolidWasteEmissionsMethod1 = (
  input: SolidWasteScope1InputTransformed,
  constants: HasCommonConstants,
): Container<Mass<'CH4'>> => {
  const unmanagedEmissions = SolidWasteUnmanagedTreatmentTypes.map(
    (treatmentType) => {
      // Allow method 2 inputs, for comparison.
      const wasteAmount = (
        (solidWasteScope1InputSchemaIsMethod1(input)
          ? input[treatmentTypeToKeyName[treatmentType]]
          : getTotalMassInWasteTreatmentFacility(
              input[treatmentTypeToKeyName[treatmentType]],
              constants,
            )) ?? zeroSolidWaste
      ).named(`Qu (${treatmentType})`);

      const EFCH4 = selectConstant(
        constants.COMMON,
        'SOLID_WASTE_TREATMENT',
        'SCOPE_1',
        'FACILITY_FACTORS',
        treatmentType,
        'METHANE_EF',
      ).named(`EFCH4,u (${treatmentType})`);

      return wasteAmount.multiply(EFCH4).reference('10.1.7 (1)');
    },
  );

  return captureMethod1Or2Value(
    sum(unmanagedEmissions, zeroCH4).named(`ECH4 (u)`),
    undefined,
  );
};

/**
 * Calculate CH4 emissions from unmanaged solid waste using method 2 (10.1.8)
 */
const calculateUnmanagedSolidWasteEmissionsMethod2 = (
  input: SolidWasteMethod2InputTransformed,
  constants: HasCommonConstants,
): Container<Mass<'CH4'>> => {
  const elementalToMolecularCH4 = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_CH4',
  ).named(`CCH4`);

  const methaneFraction = selectConstant(
    constants.COMMON,
    'SOLID_WASTE_TREATMENT',
    'SCOPE_1',
    'UNMANAGED_METHANE_FRACTION',
  ).named(`F`);

  const emissionsPerUnmanagedTreatmentType =
    SolidWasteUnmanagedTreatmentTypes.map((treatmentType) => {
      const methaneConversionFactor = selectConstant(
        constants.COMMON,
        'SOLID_WASTE_TREATMENT',
        'SCOPE_1',
        'FACILITY_FACTORS',
        treatmentType,
        'METHANE_CONVERSION_FACTOR',
      ).named(`MCFu (${treatmentType})`);
      const oxidationFactor = selectConstant(
        constants.COMMON,
        'SOLID_WASTE_TREATMENT',
        'SCOPE_1',
        'FACILITY_FACTORS',
        treatmentType,
        'OXIDATION_FACTOR',
      ).named(`OFu (${treatmentType})`);

      const emissionsPerWasteType = (
        input[treatmentTypeToKeyName[treatmentType]] ?? []
      ).map((wasteItem) => {
        const wasteMass = wasteAmountAsMass(wasteItem, constants).named(
          `Qu,w (${treatmentType})`,
        );
        const { wasteType } = wasteItem;

        const degradableOrganicContent = selectConstant(
          constants.COMMON,
          'SOLID_WASTE_TREATMENT',
          'SCOPE_1',
          'WASTE_FACTORS',
          wasteType,
          'DEGRADABLE_ORGANIC_CONTENT',
        ).named(`DOCw (${wasteType.unit})`);

        const fracDecomposes = selectConstant(
          constants.COMMON,
          'SOLID_WASTE_TREATMENT',
          'SCOPE_1',
          'WASTE_FACTORS',
          wasteType,
          'FRAC_DOC_DECOMPOSES',
        ).named(`DOCFw (${wasteType.unit})`);

        /**
         * ECH4 = SUM[w,u] ((Qw,u * DOCw * DOCFw * F * MCFu * 1.33) * (1 - OFu))
         */
        return wasteMass
          .multiply(degradableOrganicContent)
          .multiply(fracDecomposes)
          .multiply(methaneFraction)
          .multiply(methaneConversionFactor)
          .multiply(elementalToMolecularCH4)
          .multiply(oneMinus(oxidationFactor))
          .named(`'ECH4 (${wasteType.unit})'`)
          .reference('10.1.8 (1)');
      });

      return emissionsPerWasteType.length === 0
        ? zeroCH4
        : sum(emissionsPerWasteType, zeroCH4);
    });

  const unmanagedEmissions = sum(
    emissionsPerUnmanagedTreatmentType,
    zeroCH4,
  ).named(`ECH4 (u)`);

  return captureMethod1Or2Value(
    calculateUnmanagedSolidWasteEmissionsMethod1(input, constants),
    unmanagedEmissions,
  );
};

/**
 * Calculate CH4 emissions from disposal of unmanaged solid waste (10.1.7 & 10.1.8)
 */
const calculateUnmanagedSolidWasteEmissions = (
  input: SolidWasteScope1InputTransformed,
  constants: HasCommonConstants,
): Container<Mass<'CH4'>> =>
  solidWasteScope1InputSchemaIsMethod1(input)
    ? calculateUnmanagedSolidWasteEmissionsMethod1(input, constants)
    : calculateUnmanagedSolidWasteEmissionsMethod2(input, constants);

/**
 * Calculate all emissions from onsite solid waste management.
 */
export function calculate10SolidWasteEmissions(
  input: HasSolidWasteInputTransformed,
  context: ExecutionContext,
): {
  solidWasteCO2: Container<Mass<'CO2'>>;
  solidWasteCH4: Container<Mass<'CH4'>>;
  solidWasteN2O: Container<Mass<'N2O'>>;
} {
  const { constants } = context;
  const onsiteWaste = input?.waste?.treatedOnsite;
  if (onsiteWaste === undefined)
    return {
      solidWasteCO2: zeroCO2,
      solidWasteCH4: zeroCH4,
      solidWasteN2O: zeroN2O,
    };

  const incinerationCO2 = calculateSolidWasteIncinerationEmissions(
    onsiteWaste,
    constants,
  );
  const { bioSolidWasteCH4, bioSolidWasteN2O } =
    calculateSolidWasteBiologicalTreatmentEmissions(onsiteWaste, constants);

  const unmanagedCH4 = calculateUnmanagedSolidWasteEmissions(
    onsiteWaste,
    constants,
  );

  return {
    solidWasteCO2: incinerationCO2,
    solidWasteCH4: bioSolidWasteCH4.plus(unmanagedCH4),
    solidWasteN2O: bioSolidWasteN2O,
  };
}
