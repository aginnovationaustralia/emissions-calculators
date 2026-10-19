import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const OtherLivestockIntensitiesOutputSchema = z.object({
  liveweightProducedKg: outputValue('Liveweight produced in kg'),
  liveweightIntensityExcludingLULUCF: outputValue(
    'Other livestock liveweight emissions intensity excluding LULUCF, in kg-CO2e/kg liveweight',
  ),
  liveweightIntensityIncludingLULUCF: outputValue(
    'Other livestock liveweight emissions intensity including LULUCF, in kg-CO2e/kg liveweight',
  ),
});

export type OtherLivestockIntensitiesOutput = z.infer<
  typeof OtherLivestockIntensitiesOutputSchema
>;
