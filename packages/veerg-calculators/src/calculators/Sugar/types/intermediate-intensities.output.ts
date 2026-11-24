import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const SugarIntermediateIntensitiesOutputSchema = z.object({
  totalSugarCaneKilograms: outputValue(
    'The amount of sugarcane used for intensities, in kg. It is either the total yield or amount sold, depending on the inputs that were supplied.',
  ),
  sugarCaneIntensity: outputValue(
    'Sugar emissions intensity for this activity, in kg-CO2e/kg sugarcane',
  ),
});

export type SugarIntermediateIntensitiesOutput = z.infer<
  typeof SugarIntermediateIntensitiesOutputSchema
>;
