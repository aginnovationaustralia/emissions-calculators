import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const ViticultureIntermediateIntensitiesOutputSchema = z.object({
  grapesHarvestedKg: outputValue('Grapes harvested in kg.'),
  grapesIntensity: outputValue(
    'Grapes emissions intensity for this activity, in kg-CO2e/kg grapes.',
  ),
});

export type ViticultureIntermediateIntensitiesOutput = z.infer<
  typeof ViticultureIntermediateIntensitiesOutputSchema
>;
