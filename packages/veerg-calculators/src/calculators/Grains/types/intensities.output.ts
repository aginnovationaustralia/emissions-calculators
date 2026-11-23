import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const GrainsIntensitiesOutputSchema = z.object({
  totalGrainKilograms: outputValue(
    'The amount of grain used for intensities, in kg. It is either the total yield or amount sold, depending on the inputs that were supplied.',
  ),
  grainsExcludingLULUCF: outputValue(
    'Grains emissions intensity excluding LULUCF, in kg-CO2e/kg grain',
  ),
  grainsIncludingLULUCF: outputValue(
    'Grains emissions intensity including LULUCF, in kg-CO2e/kg grain',
  ),
});

export type GrainsIntensitiesOutput = z.infer<
  typeof GrainsIntensitiesOutputSchema
>;
