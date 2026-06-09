import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { isPerennialWoodyCropFull } from '@/constants/enums';
import { selectConstant } from '@/tools/constants';
import { Container, root } from '@/tools/containers';
import { sum } from '@/tools/sum';
import { mass, years, Years } from '@/tools/units';
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
    planting.yearsSincePlanting.unit.value.lte(yearsLimit.unit.value),
  );
};

/* Calculates the biomass accumulation rate (BARc) for a perennial crop. This is only necessary for the crop types with a known stem density,
simpler crop types can only use their default BARc value
*/
const getBiomassAccumulationRateBARcForRemovals = (
  crop: PerennialCropInputTransformed,
  constants: ConstantsForGrainsCalculator,
) => {
  const BARcDefault = isPerennialWoodyCropFull(crop.cropType)
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
  if (isPerennialCropCalculationMethod1(crop)) {
    return BARcDefault;
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
    ).named('BARc');
  }

  const { cropType, method2BiomassAtMaturity } = crop;

  const Mc = selectConstant(
    constants.LULUCF,
    'WOODY_PERENNIAL_CROPS_FULL',
    cropType,
    'Mc',
  );

  return method2BiomassAtMaturity.divide(Mc).named('BARc');
};

export const calculate_16_5_1_1_RemovalsFromPerennialCrops = (
  input: LULUCFParentInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  /*
    RLU,c = Cg,CO2 * BARc * SUM(Ac,t)
    */

  const CgCO2 = selectConstant(constants.COMMON, 'CG_CO2');

  const perennialCrops = input.landUse?.perennialCrops;

  if (perennialCrops === undefined) {
    return root(mass('CO2', 0)).named('RLU,c');
  }

  const annualCropRemovals = perennialCrops.map((crop) => {
    const BARc = getBiomassAccumulationRateBARcForRemovals(crop, constants);

    const Mc = isPerennialWoodyCropFull(crop.cropType)
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

    return BARc.multiply(sum(plantingsToInclude))
      .multiply(CgCO2)
      .named(`RLU,c (${crop.cropType})`);
  });

  /* NOTE: The equation calculates the sum of areas removing carbon per year. For a final result,
  we want to take a year of all removals */
  return sum(annualCropRemovals)
    .multiply(root(years(1)))
    .named('RLU,c (all)');
};

export const calculate_16_5_1_3_EmissionsFromPerennialCrops = (
  input: LULUCFParentInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  /*
  ELU,c = Cg,CO2 * BAMc * ACc
  */
  const { constants } = context;

  const perennialCrops = input.landUse?.perennialCrops;

  if (perennialCrops === undefined) {
    return root(mass('CO2', 0)).named('ELU,c (all)');
  }

  const CgCO2 = selectConstant(constants.COMMON, 'CG_CO2');

  const clearingsForCropRecords = perennialCrops.flatMap((crop) => {
    const { cropType } = crop;
    const BAMcDefault = isPerennialWoodyCropFull(cropType)
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

    if (isPerennialCropCalculationMethod1(crop)) {
      return crop.clearings.map((clearing) =>
        BAMcDefault.multiply(clearing.areaCleared).named('BAMc'),
      );
    }
    if (isPerennialCropCalculationMethod2StemDensity(crop)) {
      return crop.clearings.map((clearing) => {
        const BARc = getBiomassAccumulationRateBARcForRemovals(crop, constants);
        return BARc.multiply(clearing.areaCleared).multiply(
          clearing.method2AgeAtClearing,
        );
      });
    }
    return crop.clearings.map((clearing) =>
      crop.method2BiomassAtMaturity.multiply(clearing.areaCleared),
    );
  });

  return sum(clearingsForCropRecords).multiply(CgCO2).named('ELU,c (all)');
};
