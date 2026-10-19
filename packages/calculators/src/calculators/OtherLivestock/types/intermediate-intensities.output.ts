import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const OtherLivestockIntermediateIntensitiesOutputSchema = z.object({
  liveweightProducedKg: outputValue('Liveweight produced in kg'),
  liveweightIntensity: outputValue(
    'Other livestock liveweight emissions intensity for this activity, in kg-CO2e/kg liveweight',
  ),
});

export type OtherLivestockIntermediateIntensitiesOutput = z.infer<
  typeof OtherLivestockIntermediateIntensitiesOutputSchema
>;
