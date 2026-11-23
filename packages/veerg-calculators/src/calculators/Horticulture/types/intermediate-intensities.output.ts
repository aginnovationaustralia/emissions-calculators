import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const HorticultureIntermediateIntensitiesOutputSchema = z.object({
  totalCropKilograms: outputValue(
    'The amount of crop used for intensities, in kg. It is either the total yield or amount sold, depending on the inputs that were supplied.',
  ),
  cropIntensity: outputValue(
    'Horticulture emissions intensity for this activity, in kg-CO2e/kg crop',
  ),
});

export type HorticultureIntermediateIntensitiesOutput = z.infer<
  typeof HorticultureIntermediateIntensitiesOutputSchema
>;
