import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const CroppingIntensitiesOutputSchema = z.object({
  cropHarvestedKg: outputValue('Amount of crop harvested in kg'),
  cropIntensityExcludingLULUCF: outputValue(
    'Cropping emissions intensity excluding LULUCF, in kg-CO2e/kg crop harvested',
  ),
  cropIntensityIncludingLULUCF: outputValue(
    'Cropping emissions intensity including LULUCF, in kg-CO2e/kg crop harvested',
  ),
});

export type CroppingIntensitiesOutput = z.infer<
  typeof CroppingIntensitiesOutputSchema
>;
