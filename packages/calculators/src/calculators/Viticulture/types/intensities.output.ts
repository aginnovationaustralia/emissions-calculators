import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const ViticultureIntensitiesOutputSchema = z.object({
  grapesHarvestedKg: outputValue('Grapes harvested in kg.'),
  grapesExcludingLULUCF: outputValue(
    'Grapes emissions intensity excluding LULUCF, in kg-CO2e/kg grapes.',
  ),
  grapesIncludingLULUCF: outputValue(
    'Grapes emissions intensity including LULUCF, in kg-CO2e/kg grapes.',
  ),
});

export type ViticultureIntensitiesOutput = z.infer<
  typeof ViticultureIntensitiesOutputSchema
>;
