import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const HorticultureIntensitiesOutputSchema = z.object({
  totalCropKilograms: outputValue(
    'The amount of crop used for intensities, in kg. It is either the total yield or amount sold, depending on the inputs that were supplied.',
  ),
  cropExcludingLULUCF: outputValue(
    'Horticulture emissions intensity excluding LULUCF, in kg-CO2e/kg crop',
  ),
  cropIncludingLULUCF: outputValue(
    'Horticulture emissions intensity including LULUCF, in kg-CO2e/kg crop',
  ),
});

export type HorticultureIntensitiesOutput = z.infer<
  typeof HorticultureIntensitiesOutputSchema
>;
