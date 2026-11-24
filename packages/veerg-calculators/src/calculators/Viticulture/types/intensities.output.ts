import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const ViticultureIntensitiesOutputSchema = z.object({
  totalGrapesKilograms: outputValue(
    'The amount of grapes used for intensities, in kg. It is either the total yield or amount sold, depending on the inputs that were supplied.',
  ),
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
