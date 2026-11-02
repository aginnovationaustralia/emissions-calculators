import { ExecutionContext } from '@/calculators/executionContext';
import { isPerennialWoodyCropContainerFull } from '@/constants/enums';
import { selectConstant } from '@/tools/constants';
import { Container } from '@/tools/containers';
import { captureMethod1Or2Value } from '@/tools/multi';
import {
  oneYear,
  zeroArea,
  zeroCO2,
  zeroMassCarbon,
  zeroMassPerYearCO2,
} from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { MassPerAreaPerYear, Years } from '@/tools/units';
import { ConstantsForLULUCF } from './constants';
import { LULUCFParentInputTransformed } from './input';
import { PerennialCropPlantingInputTransformed } from './perennial-crop-planting-input';
import {
  isPerennialCropCalculationMethod1,
  isPerennialCropCalculationMethod2StemDensity,
  PerennialCropInputTransformed,
} from './perennial-crops-input';

const getPlantingsLessThanYears = (
  plantings: PerennialCropPlantingInputTransformed[],
  yearsLimit: Container<Years>,
) => {
  return plantings.filter((planting) =>
    planting.yearsSincePlanting.unit.store.value.lte(
      yearsLimit.unit.store.value,
    ),
  );
};

const getBiomassAccumulationRateBARcMethod2 = (
  crop: PerennialCropInputTransformed,
  BARcDefault: Container<MassPerAreaPerYear<'Carbon'>>,
  constants: ConstantsForLULUCF,
) => {
  if (isPerennialCropCalculationMethod1(crop)) {
    return undefined;
  }

  if (isPerennialCropCalculationMethod2StemDensity(crop)) {
    const defaultStemDensity = selectConstant(
      constants.LULUCF,
      'WOODY_PERENNIAL_CROPS_FULL',
      crop.cropType,
      'STEM_DENSITY',
    );
    return BARcDefault.multiply(
      crop.method2ActualStemDensity.divide(defaultStemDensity),
    )
      .named('BARc')
      .reference('16.6.1.2 (1)');
  }

  const { cropType, method2BiomassAtMaturity } = crop;

  const Mc = selectConstant(
    constants.LULUCF,
    'WOODY_PERENNIAL_CROPS_FULL',
    cropType,
    'Mc',
  );

  return method2BiomassAtMaturity
    .divide(Mc)
    .named('BARc')
    .reference('16.6.1.2 (2)');
};

/* Calculates the biomass accumulation rate (BARc) for a perennial crop. This is only necessary for the crop types with a known stem density,
simpler crop types can only use their default BARc value
*/
const getBiomassAccumulationRateBARcForRemovals = (
  crop: PerennialCropInputTransformed,
  constants: ConstantsForLULUCF,
) => {
  const BARcDefault = isPerennialWoodyCropContainerFull(crop.cropType)
    ? selectConstant(
        constants.LULUCF,
        'WOODY_PERENNIAL_CROPS_FULL',
        crop.cropType,
        'BARc',
      )
    : selectConstant(
        constants.LULUCF,
        'WOODY_PERENNIAL_CROPS_PARTIAL',
        crop.cropType,
        'BARc',
      );

  return captureMethod1Or2Value(
    BARcDefault,
    getBiomassAccumulationRateBARcMethod2(crop, BARcDefault, constants),
  );
};

export const calculate_16_6_1_1_RemovalsFromPerennialCrops = (
  input: LULUCFParentInputTransformed,
  context: ExecutionContext<ConstantsForLULUCF>,
) => {
  const { constants } = context;
  /*
    RLU,c = Cg,CO2 * BARc * SUM(Ac,t)
    */

  const CgCO2 = selectConstant(constants.COMMON, 'ELEMENTAL_TO_MOLECULAR_CO2');

  const perennialCrops = input.landUse?.perennialCrops;

  if (perennialCrops === undefined) {
    return zeroCO2.named('RLU,c');
  }

  const annualCropRemovals = perennialCrops.map((crop) => {
    const BARc = getBiomassAccumulationRateBARcForRemovals(crop, constants);

    const Mc = isPerennialWoodyCropContainerFull(crop.cropType)
      ? selectConstant(
          constants.LULUCF,
          'WOODY_PERENNIAL_CROPS_FULL',
          crop.cropType,
          'Mc',
        )
      : selectConstant(
          constants.LULUCF,
          'WOODY_PERENNIAL_CROPS_PARTIAL',
          crop.cropType,
          'Mc',
        );

    const plantingsToInclude = getPlantingsLessThanYears(
      crop.plantings,
      Mc,
    ).map((planting) => planting.areaPlanted);

    return BARc.multiply(sum(plantingsToInclude, zeroArea))
      .multiply(CgCO2)
      .named(`RLU,c (${crop.cropType.unit})`)
      .reference('16.6.1.1 (1)');
  });

  /* NOTE: The equation calculates the sum of areas removing carbon per year. For a final result,
  we want to take a year of all removals */
  return sum(annualCropRemovals, zeroMassPerYearCO2)
    .multiply(oneYear)
    .named('RLU,c (all)');
};

const calculateCarbonFromClearingsMethod2 = (
  crop: PerennialCropInputTransformed,
  constants: ConstantsForLULUCF,
) => {
  if (isPerennialCropCalculationMethod1(crop)) {
    return undefined;
  }

  if (isPerennialCropCalculationMethod2StemDensity(crop)) {
    return crop.clearings.map((clearing) => {
      const BARc = getBiomassAccumulationRateBARcForRemovals(crop, constants);
      return BARc.multiply(clearing.areaCleared)
        .multiply(clearing.method2AgeAtClearing)
        .reference('16.6.1.4 (1)');
    });
  }
  return crop.clearings.map((clearing) =>
    crop.method2BiomassAtMaturity.multiply(clearing.areaCleared),
  );
};

export const calculate_16_6_1_3_EmissionsFromPerennialCrops = (
  input: LULUCFParentInputTransformed,
  context: ExecutionContext<ConstantsForLULUCF>,
) => {
  /*
  ELU,c = Cg,CO2 * BAMc * ACc
  */
  const { constants } = context;

  const perennialCrops = input.landUse?.perennialCrops;

  if (perennialCrops === undefined) {
    return zeroCO2.named('ELU,c (all)');
  }

  const CgCO2 = selectConstant(constants.COMMON, 'ELEMENTAL_TO_MOLECULAR_CO2');

  const clearingsForCropRecords = perennialCrops.flatMap((crop) => {
    const { cropType } = crop;
    const BAMcDefault = isPerennialWoodyCropContainerFull(cropType)
      ? selectConstant(
          constants.LULUCF,
          'WOODY_PERENNIAL_CROPS_FULL',
          cropType,
          'BAMc',
        )
      : selectConstant(
          constants.LULUCF,
          'WOODY_PERENNIAL_CROPS_PARTIAL',
          cropType,
          'BAMc',
        );

    const carbonFromClearingsMethod1 = sum(
      crop.clearings.map((clearing) =>
        BAMcDefault.multiply(clearing.areaCleared).named('BAMc'),
      ),
      zeroMassCarbon,
    );

    const carbonRecordsMethod2 = calculateCarbonFromClearingsMethod2(
      crop,
      constants,
    );

    return captureMethod1Or2Value(
      carbonFromClearingsMethod1,
      carbonRecordsMethod2
        ? sum(carbonRecordsMethod2, zeroMassCarbon)
        : undefined,
    ).named('ELU,c (crop)');
  });

  return sum(clearingsForCropRecords, zeroMassCarbon)
    .multiply(CgCO2)
    .named('ELU,c (all)')
    .reference('16.6.1.3 (1)');
};
