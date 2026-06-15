import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { ExecutionContext } from '@/calculators/executionContext';
import { Container } from '@/tools/containers';
import { RealNumber } from '@/tools/units';
import {
  calculate_16_1_1_2_ChangesInWoodyCarbonStocks,
  calculate_16_1_1_4_BiomassBurningCH4,
  calculate_16_1_1_4_BiomassBurningN2O,
  calculate_16_1_1_5_SoilOrganicStockLosses,
  calculate_16_1_1_7_HarvestedWoodProducts,
} from './16.1-land-use-change-forestry';
import { calculate_16_2_1_1_NitrogenMineralisationSoilLosses } from './16.2-nitrogen-soil-losses';
import { calculate_16_3_1_1_NitrogenLeachingAndRunoff } from './16.3-nitrogen-leaching-runoff';
import {
  calculate_16_4_1_2_SavannaCarbonChange,
  calculate_16_4_1_4_SavannaBiomassBurning,
} from './16.4-burning';
import {
  calculate_16_5_1_1_RemovalsFromPerennialCrops,
  calculate_16_5_1_3_EmissionsFromPerennialCrops,
} from './16.5-perennial-crops';
import { LULUCFParentInputTransformed } from './input';

export function calculateLULUCF(
  input: LULUCFParentInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
  proportion: Container<RealNumber>,
) {
  return {
    woodyCarbonStocksCO2: calculate_16_1_1_2_ChangesInWoodyCarbonStocks(
      input,
      context,
    ).multiply(proportion),
    biomassBurningCH4: calculate_16_1_1_4_BiomassBurningCH4(
      input,
      context,
    ).multiply(proportion),
    biomassBurningN2O: calculate_16_1_1_4_BiomassBurningN2O(
      input,
      context,
    ).multiply(proportion),
    soilOrganicStockLossesCO2: calculate_16_1_1_5_SoilOrganicStockLosses(
      input,
      context,
    ).multiply(proportion),
    harvestedWoodProductsCO2: calculate_16_1_1_7_HarvestedWoodProducts(
      input,
      context,
    ).multiply(proportion),
    nitrogenMineralisationSoilLossesN2O:
      calculate_16_2_1_1_NitrogenMineralisationSoilLosses(
        input,
        context,
      ).multiply(proportion),
    leachingAndRunoffSoilLossesN2O:
      calculate_16_3_1_1_NitrogenLeachingAndRunoff(input, context).multiply(
        proportion,
      ),
    savannaFireWoodyCarbonStocksCO2e: calculate_16_4_1_2_SavannaCarbonChange(
      input,
      context,
    ).multiply(proportion),
    savannaFireBiomassBurningCO2e: calculate_16_4_1_4_SavannaBiomassBurning(
      input,
      context,
    ).multiply(proportion),
    perennialWoodyCropsRemovalsCO2:
      calculate_16_5_1_1_RemovalsFromPerennialCrops(input, context).multiply(
        proportion,
      ),
    perennialWoodyCropsEmissionsCO2:
      calculate_16_5_1_3_EmissionsFromPerennialCrops(input, context).multiply(
        proportion,
      ),
  };
}
