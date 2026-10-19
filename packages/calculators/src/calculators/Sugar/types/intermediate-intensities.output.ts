import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const SugarIntermediateIntensitiesOutputSchema = z.object({
  sugarCaneHarvestedKg: outputValue('Sugarcane harvested in kg'),
  sugarCaneIntensity: outputValue(
    'Sugar emissions intensity for this activity, in kg-CO2e/kg sugarcane',
  ),
});

export type SugarIntermediateIntensitiesOutput = z.infer<
  typeof SugarIntermediateIntensitiesOutputSchema
>;
