import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const FeedlotIntensitiesOutputSchema = z.object({
  liveweightProducedKg: outputValue('Liveweight produced in kg'),
  liveweightIntensityExcludingLULUCF: outputValue(
    'Feedlot liveweight emissions intensity excluding LULUCF, in kg-CO2e/kg liveweight',
  ),
  liveweightIntensityIncludingLULUCF: outputValue(
    'Feedlot liveweight emissions intensity including LULUCF, in kg-CO2e/kg liveweight',
  ),
});

export type FeedlotIntensitiesOutput = z.infer<
  typeof FeedlotIntensitiesOutputSchema
>;
