import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const PigsIntermediateIntensitiesOutputSchema = z.object({
  liveweightProducedKg: outputValue('Liveweight produced in kg'),
  liveweightIntensity: outputValue(
    'Pigs liveweight emissions intensity for this activity, in kg-CO2e/kg liveweight',
  ),
});

export type PigsIntermediateIntensitiesOutput = z.infer<
  typeof PigsIntermediateIntensitiesOutputSchema
>;
