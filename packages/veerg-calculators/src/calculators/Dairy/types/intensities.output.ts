import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const DairyIntensitiesOutputSchema = z.object({
  liveweightProducedKilograms: outputValue('Liveweight produced in kg'),
  liveweightIntensityExcludingLULUCF: outputValue(
    'Dairy liveweight emissions intensity excluding LULUCF, using energy based allocation, in kg-CO2e/kg liveweight',
  ),
  liveweightIntensityIncludingLULUCF: outputValue(
    'Dairy liveweight emissions intensity including LULUCF, using energy based allocation, in kg-CO2e/kg liveweight',
  ),
  liveweightIntensityMassAllocationExcludingLULUCF: outputValue(
    'Dairy liveweight emissions intensity excluding LULUCF, using mass based allocation, in kg-CO2e/kg liveweight',
  ),
  liveweightIntensityMassAllocationIncludingLULUCF: outputValue(
    'Dairy liveweight emissions intensity including LULUCF, using mass based allocation, in kg-CO2e/kg liveweight',
  ),
  milkProducedKilograms: outputValue('Milk produced in kg'),
  milkIntensityExcludingLULUCF: outputValue(
    'Dairy milk emissions intensity excluding LULUCF, using energy based allocation, in kg-CO2e/kg milk',
  ),
  milkIntensityIncludingLULUCF: outputValue(
    'Dairy milk emissions intensity including LULUCF, using energy based allocation, in kg-CO2e/kg milk',
  ),
  milkIntensityMassAllocationExcludingLULUCF: outputValue(
    'Dairy milk emissions intensity excluding LULUCF, using mass based allocation, in kg-CO2e/kg milk',
  ),
  milkIntensityMassAllocationIncludingLULUCF: outputValue(
    'Dairy milk emissions intensity including LULUCF, using mass based allocation, in kg-CO2e/kg milk',
  ),
});

export type DairyIntensitiesOutput = z.infer<
  typeof DairyIntensitiesOutputSchema
>;
