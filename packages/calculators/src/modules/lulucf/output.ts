import { outputKey, outputValue } from '@/tools/zod';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const LULUCFOutputSchema = object({
  woodyCarbonStocksCO2: outputKey('Woody Carbon Stocks CO2 (16.1.1.12)'),
  biomassBurningCH4: outputKey('Biomass Burning CH4 (16.1.1.4)'),
  biomassBurningN2O: outputKey('Biomass Burning N2O (16.1.1.4)'),
  soilOrganicStockLossesCO2: outputKey(
    'Soil Organic Stock Losses CO2 (16.1.1.5)',
  ),
  harvestedWoodProductsCO2: outputKey('Harvested Wood Products CO2 (16.1.1.7)'),
  nitrogenMineralisationSoilLossesN2O: outputKey(
    'Nitrogen Mineralisation Soil Losses N2O (16.2.1.1)',
  ),
  leachingAndRunoffSoilLossesN2O: outputKey(
    'Leaching and Runoff Soil Losses N2O (16.3.1.1)',
  ),
  savannaFireWoodyCarbonStocksCO2e: outputKey(
    'Savanna Fire Woody Carbon Stocks CO2e (16.4.1.2)',
  ),
  savannaFireBiomassBurningCO2e: outputKey(
    'Savanna Fire Biomass Burning CO2e (16.4.1.4)',
  ),
  perennialWoodyCropsRemovalsCO2: outputKey(
    'Perennial Woody Crops Removals CO2 (16.5.1.1)',
  ),
  perennialWoodyCropsEmissionsCO2: outputKey(
    'Perennial Woody Crops Emissions CO2 (16.5.1.3)',
  ),
  total: outputValue('Net changes from LULUCF activities, in tonnes-CO2e'),
});

export type LULUCFOutput = z.infer<typeof LULUCFOutputSchema>;
