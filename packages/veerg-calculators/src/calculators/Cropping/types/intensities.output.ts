import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const CroppingIntensitiesOutputSchema = z.object({
  cropHarvestedKilograms: outputValue('Amount of crop harvested in kg'),
  cropSoldKilograms: outputValue('Amount of crop sold in kg'),
  cropIntensityExcludingLULUCF: outputValue(
    'Cropping emissions intensity excluding LULUCF, in kg-CO2e/kg crop sold',
  ),
  cropIntensityIncludingLULUCF: outputValue(
    'Cropping emissions intensity including LULUCF, in kg-CO2e/kg crop sold',
  ),
});

export type CroppingIntensitiesOutput = z.infer<
  typeof CroppingIntensitiesOutputSchema
>;
