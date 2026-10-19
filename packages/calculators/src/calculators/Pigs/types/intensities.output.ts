import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const PigsIntensitiesOutputSchema = z.object({
  liveweightProducedKg: outputValue('Liveweight produced in kg'),
  liveweightIntensityExcludingLULUCF: outputValue(
    'Pigs liveweight emissions intensity excluding LULUCF, in kg-CO2e/kg liveweight',
  ),
  liveweightIntensityIncludingLULUCF: outputValue(
    'Pigs liveweight emissions intensity including LULUCF, in kg-CO2e/kg liveweight',
  ),
});

export type PigsIntensitiesOutput = z.infer<typeof PigsIntensitiesOutputSchema>;
