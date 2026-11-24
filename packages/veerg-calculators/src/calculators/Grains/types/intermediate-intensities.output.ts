import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const GrainsIntermediateIntensitiesOutputSchema = z.object({
  totalGrainKilograms: outputValue(
    'The amount of grain used for intensities, in kg. It is either the total yield or amount sold, depending on the inputs that were supplied.',
  ),
  grainsIntensity: outputValue(
    'Grains emissions intensity for this activity, in kg-CO2e/kg grain',
  ),
});

export type GrainsIntermediateIntensitiesOutput = z.infer<
  typeof GrainsIntermediateIntensitiesOutputSchema
>;
