import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const CroppingIntermediateIntensitiesOutputSchema = z.object({
  cropHarvestedKg: outputValue('Amount of crop harvested in kg'),
  cropIntensity: outputValue(
    'Cropping emissions intensity for this activity, in kg-CO2e/kg crop harvested',
  ),
});

export type CroppingIntermediateIntensitiesOutput = z.infer<
  typeof CroppingIntermediateIntensitiesOutputSchema
>;
