import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const RiceIntensitiesOutputSchema = z.object({
  riceHarvestedKg: outputValue('Rice harvested in kg'),
  riceExcludingLULUCF: outputValue(
    'Rice emissions intensity excluding LULUCF, in kg-CO2e/kg rice',
  ),
  riceIncludingLULUCF: outputValue(
    'Rice emissions intensity including LULUCF, in kg-CO2e/kg rice',
  ),
});

export type RiceIntensitiesOutput = z.infer<typeof RiceIntensitiesOutputSchema>;
