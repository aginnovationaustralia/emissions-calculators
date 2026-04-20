import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { selectConstant } from '@/tools/constants';
import { Container, root } from '@/tools/containers';
import { zeroCO2e } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { years, Years } from '@/tools/units';
import { LULUCFInputTransformed } from './input';
import { PerennialCropPlantingInputTransformed } from './perennial-crop-planting-input';
import {
  isPerennialCropInputFull,
  PerennialCropFullInputTransformed,
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
const getBiomassAccumulationRateBARc = (
  crop: PerennialCropFullInputTransformed,
  constants: ConstantsForGrainsCalculator,
) => {
  const { cropType, method2ActualStemDensity, method2BiomassAtMaturity } = crop;

  const defaultStemDensity = selectConstant(
    constants.LULUCF,
    'WOODY_PERENNIAL_CROPS_FULL',
    cropType,
    'STEM_DENSITY',
  );
  const BARc = selectConstant(
    constants.LULUCF,
    'WOODY_PERENNIAL_CROPS_FULL',
    crop.cropType,
    'BARc',
  );
  const Mc = selectConstant(
    constants.LULUCF,
    'WOODY_PERENNIAL_CROPS_FULL',
    cropType,
    'Mc',
  );

  if (method2ActualStemDensity !== undefined) {
    return BARc.multiply(
      method2ActualStemDensity.divide(defaultStemDensity),
    ).named('BARc');
  }

  if (method2BiomassAtMaturity !== undefined) {
    return method2BiomassAtMaturity.divide(Mc).named('BARc');
  }

  return BARc;
};

export const calculate_16_5_1_1_RemovalsFromPerennialCrops = (
  input: LULUCFInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  /*
    RLU,c = Cg,CO2 * BARc * SUM(Ac,t)
    */

  const CgCO2 = selectConstant(constants.COMMON, 'CG_CO2');

  const { perennialCrops } = input;

  if (perennialCrops === undefined) {
    return zeroCO2e.named('RLU,c');
  }

  const annualCropRemovals = perennialCrops.map((crop) => {
    if (isPerennialCropInputFull(crop)) {
      const Mc = selectConstant(
        constants.LULUCF,
        'WOODY_PERENNIAL_CROPS_FULL',
        crop.cropType,
        'Mc',
      );
      const BARc = getBiomassAccumulationRateBARc(crop, constants);

      const plantingsToInclude = getPlantingsLessThanYears(
        crop.plantings,
        Mc,
      ).map((planting) => planting.areaPlanted);

      return BARc.multiply(sum(plantingsToInclude))
        .multiply(CgCO2)
        .named(`RLU,c (${crop.cropType})`);
    }

    const Mc = selectConstant(
      constants.LULUCF,
      'WOODY_PERENNIAL_CROPS_PARTIAL',
      crop.cropType,
      'Mc',
    );

    const BARc = selectConstant(
      constants.LULUCF,
      'WOODY_PERENNIAL_CROPS_PARTIAL',
      crop.cropType,
      'BARc',
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
