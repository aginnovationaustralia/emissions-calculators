import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const ViticultureIntermediateIntensitiesOutputSchema = z.object({
  totalGrapesKilograms: outputValue(
    'The amount of grapes used for intensities, in kg. It is either the total yield or amount sold, depending on the inputs that were supplied.',
  ),
  grapesIntensity: outputValue(
    'Grapes emissions intensity for this activity, in kg-CO2e/kg grapes.',
  ),
});

export type ViticultureIntermediateIntensitiesOutput = z.infer<
  typeof ViticultureIntermediateIntensitiesOutputSchema
>;
