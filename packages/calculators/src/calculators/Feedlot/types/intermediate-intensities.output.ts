import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const FeedlotIntermediateIntensitiesOutputSchema = z.object({
  liveweightProducedKg: outputValue('Liveweight produced in kg'),
  liveweightIntensity: outputValue(
    'Feedlot liveweight emissions intensity for this activity, in kg-CO2e/kg liveweight',
  ),
});

export type FeedlotIntermediateIntensitiesOutput = z.infer<
  typeof FeedlotIntermediateIntensitiesOutputSchema
>;
