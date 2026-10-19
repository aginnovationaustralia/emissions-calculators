import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const HorticultureIntermediateIntensitiesOutputSchema = z.object({
  cropHarvestedKg: outputValue('Crop harvested in kg'),
  cropIntensity: outputValue(
    'Horticulture emissions intensity for this activity, in kg-CO2e/kg crop',
  ),
});

export type HorticultureIntermediateIntensitiesOutput = z.infer<
  typeof HorticultureIntermediateIntensitiesOutputSchema
>;
