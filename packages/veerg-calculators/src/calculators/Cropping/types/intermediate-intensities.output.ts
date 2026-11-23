import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const CroppingIntermediateIntensitiesOutputSchema = z.object({
  cropHarvestedKilograms: outputValue('Amount of crop harvested in kg'),
  cropSoldKilograms: outputValue('Amount of crop sold in kg'),
  cropIntensity: outputValue(
    'Cropping emissions intensity for this activity, in kg-CO2e/kg crop sold',
  ),
});

export type CroppingIntermediateIntensitiesOutput = z.infer<
  typeof CroppingIntermediateIntensitiesOutputSchema
>;
