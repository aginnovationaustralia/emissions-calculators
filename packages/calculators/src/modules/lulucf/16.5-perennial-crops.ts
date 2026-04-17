import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { selectConstant } from '@/tools/constants';
import { Container } from '@/tools/containers';
import { zeroCO2e } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { Years } from '@/tools/units';
import { LULUCFInputTransformed } from './input';
import { PerennialCropPlantingInputTransformed } from './perennial-crop-planting-input';
import { isPerennialCropFull } from './perennial-crops-input';

const getPlantingsLessThanYears = (
  plantings: PerennialCropPlantingInputTransformed[],
  yearsLimit: Container<Years>,
) => {
  return plantings.filter((planting) =>
    planting.yearsSincePlanting.unit.value.lte(yearsLimit.unit.value),
  );
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
    if (isPerennialCropFull(crop)) {
      const Mc = selectConstant(
        constants.LULUCF,
        'WOODY_PERENNIAL_CROPS_FULL',
        crop.cropType,
        'Mc',
      );
      const BARc = selectConstant(
        constants.LULUCF,
        'WOODY_PERENNIAL_CROPS_FULL',
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

  return sum(annualCropRemovals).named('RLU,c (all)');
};
