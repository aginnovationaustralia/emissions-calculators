import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const SugarIntensitiesOutputSchema = z.object({
  totalSugarCaneKilograms: outputValue(
    'The amount of sugarcane used for intensities, in kg. It is either the total yield or amount sold, depending on the inputs that were supplied.',
  ),
  sugarCaneExcludingLULUCF: outputValue(
    'Sugar emissions intensity excluding LULUCF, in kg-CO2e/kg sugarcane',
  ),
  sugarCaneIncludingLULUCF: outputValue(
    'Sugar emissions intensity including LULUCF, in kg-CO2e/kg sugarcane',
  ),
});

export type SugarIntensitiesOutput = z.infer<
  typeof SugarIntensitiesOutputSchema
>;
