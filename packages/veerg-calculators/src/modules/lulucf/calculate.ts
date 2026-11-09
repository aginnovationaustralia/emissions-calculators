import { ExecutionContext } from '@/calculators/executionContext';
import { IntermediateScope1 } from '@/tools/calculators';
import {
  calculate_16_2_1_2_ChangesInWoodyCarbonStocks,
  calculate_16_2_1_4_BiomassBurningCH4,
  calculate_16_2_1_4_BiomassBurningN2O,
  calculate_16_2_1_5_SoilOrganicStockLosses,
  calculate_16_2_1_7_HarvestedWoodProducts,
} from './16.2-land-use-change-forestry';
import { calculate_16_3_1_1_NitrogenMineralisationSoilLosses } from './16.3-nitrogen-soil-losses';
import { calculate_16_4_1_1_NitrogenLeachingAndRunoff } from './16.4-nitrogen-leaching-runoff';
import {
  calculate_16_5_1_2_SavannaCarbonChange,
  calculate_16_5_1_4_SavannaBiomassBurning,
} from './16.5-burning';
import {
  calculate_16_6_1_1_RemovalsFromPerennialCrops,
  calculate_16_6_1_3_EmissionsFromPerennialCrops,
} from './16.6-perennial-crops';
import { ConstantsForLULUCF } from './constants';
import { LULUCFParentInputTransformed } from './input';
import { LULUCFOutput } from './output';

export function calculateLULUCF(
  input: LULUCFParentInputTransformed,
  context: ExecutionContext<ConstantsForLULUCF>,
): IntermediateScope1<LULUCFOutput> {
  const woodyCarbonStocksCO2 = calculate_16_2_1_2_ChangesInWoodyCarbonStocks(
    input,
    context,
  );
  const biomassBurningCH4 = calculate_16_2_1_4_BiomassBurningCH4(
    input,
    context,
  );
  const biomassBurningN2O = calculate_16_2_1_4_BiomassBurningN2O(
    input,
    context,
  );
  const soilOrganicStockLossesCO2 = calculate_16_2_1_5_SoilOrganicStockLosses(
    input,
    context,
  );
  const harvestedWoodProductsCO2 = calculate_16_2_1_7_HarvestedWoodProducts(
    input,
    context,
  );
  const nitrogenMineralisationSoilLossesN2O =
    calculate_16_3_1_1_NitrogenMineralisationSoilLosses(input, context);
  const leachingAndRunoffSoilLossesN2O =
    calculate_16_4_1_1_NitrogenLeachingAndRunoff(input, context);
  const savannaFireWoodyCarbonStocksCO2e =
    calculate_16_5_1_2_SavannaCarbonChange(input, context);
  const savannaFireBiomassBurningCO2e =
    calculate_16_5_1_4_SavannaBiomassBurning(input, context);
  const perennialWoodyCropsRemovalsCO2 =
    calculate_16_6_1_1_RemovalsFromPerennialCrops(input, context);
  const perennialWoodyCropsEmissionsCO2 =
    calculate_16_6_1_3_EmissionsFromPerennialCrops(input, context);

  return {
    woodyCarbonStocksCO2,
    biomassBurningCH4,
    biomassBurningN2O,
    soilOrganicStockLossesCO2,
    harvestedWoodProductsCO2,
    nitrogenMineralisationSoilLossesN2O,
    leachingAndRunoffSoilLossesN2O,
    savannaFireWoodyCarbonStocksCO2e,
    savannaFireBiomassBurningCO2e,
    perennialWoodyCropsRemovalsCO2,
    perennialWoodyCropsEmissionsCO2,
  };
}
