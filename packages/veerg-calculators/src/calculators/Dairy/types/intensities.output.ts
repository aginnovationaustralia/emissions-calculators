import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const DairyIntensitiesOutputSchema = z.object({
  liveweightProducedKilograms: outputValue('Liveweight produced in kg'),
  liveweightIntensityEnergyAllocationExcludingLULUCF: outputValue(
    'Dairy liveweight emissions intensity excluding LULUCF, using energy based allocation, in kg-CO2e/kg liveweight',
  ),
  liveweightIntensityEnergyAllocationIncludingLULUCF: outputValue(
    'Dairy liveweight emissions intensity including LULUCF, using energy based allocation, in kg-CO2e/kg liveweight',
  ),
  liveweightIntensityMassAllocationExcludingLULUCF: outputValue(
    'Dairy liveweight emissions intensity excluding LULUCF, using mass based allocation, in kg-CO2e/kg liveweight',
  ),
  liveweightIntensityMassAllocationIncludingLULUCF: outputValue(
    'Dairy liveweight emissions intensity including LULUCF, using mass based allocation, in kg-CO2e/kg liveweight',
  ),
  milkProducedKilograms: outputValue('Milk produced in kg'),
  milkIntensityEnergyAllocationExcludingLULUCF: outputValue(
    'Dairy milk emissions intensity excluding LULUCF, using energy based allocation, in kg-CO2e/kg milk (fat and protein corrected)',
  ),
  milkIntensityEnergyAllocationIncludingLULUCF: outputValue(
    'Dairy milk emissions intensity including LULUCF, using energy based allocation, in kg-CO2e/kg milk (fat and protein corrected)',
  ),
  milkIntensityMassAllocationExcludingLULUCF: outputValue(
    'Dairy milk emissions intensity excluding LULUCF, using mass based allocation, in kg-CO2e/kg milk (fat and protein corrected)',
  ),
  milkIntensityMassAllocationIncludingLULUCF: outputValue(
    'Dairy milk emissions intensity including LULUCF, using mass based allocation, in kg-CO2e/kg milk (fat and protein corrected)',
  ),
});

export type DairyIntensitiesOutput = z.infer<
  typeof DairyIntensitiesOutputSchema
>;
