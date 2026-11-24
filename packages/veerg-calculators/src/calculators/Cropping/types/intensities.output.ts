import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const CroppingIntensitiesOutputSchema = z.object({
  totalCropKilograms: outputValue(
    'The amount of crop used for intensities, in kg. It is either the total yield or amount sold, depending on the inputs that were supplied.',
  ),
  cropIntensityExcludingLULUCF: outputValue(
    'Cropping emissions intensity excluding LULUCF, in kg-CO2e/kg crop',
  ),
  cropIntensityIncludingLULUCF: outputValue(
    'Cropping emissions intensity including LULUCF, in kg-CO2e/kg crop',
  ),
});

export type CroppingIntensitiesOutput = z.infer<
  typeof CroppingIntensitiesOutputSchema
>;
