import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const DairyIntensitiesOutputSchema = z.object({
  liveweightProducedKg: outputValue('Liveweight produced in kg'),
  liveweightIntensityExcludingLULUCF: outputValue(
    'Dairy liveweight emissions intensity excluding LULUCF, in kg-CO2e/kg liveweight',
  ),
  liveweightIntensityIncludingLULUCF: outputValue(
    'Dairy liveweight emissions intensity including LULUCF, in kg-CO2e/kg liveweight',
  ),
  milkProducedKg: outputValue('Milk produced in kg'),
  milkIntensityExcludingLULUCF: outputValue(
    'Dairy milk emissions intensity excluding LULUCF, in kg-CO2e/kg milk',
  ),
  milkIntensityIncludingLULUCF: outputValue(
    'Dairy milk emissions intensity including LULUCF, in kg-CO2e/kg milk',
  ),
});

export type DairyIntensitiesOutput = z.infer<
  typeof DairyIntensitiesOutputSchema
>;
