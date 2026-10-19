import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const HorticultureIntensitiesOutputSchema = z.object({
  cropHarvestedKg: outputValue('Crop harvested in kg'),
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
