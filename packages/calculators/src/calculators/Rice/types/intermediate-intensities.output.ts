import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const RiceIntermediateIntensitiesOutputSchema = z.object({
  riceHarvestedKg: outputValue('Rice harvested in kg'),
  riceIntensity: outputValue(
    'Rice emissions intensity for this activity, in kg-CO2e/kg rice',
  ),
});

export type RiceIntermediateIntensitiesOutput = z.infer<
  typeof RiceIntermediateIntensitiesOutputSchema
>;
