import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const BeefIntermediateIntensitiesOutputSchema = z.object({
  liveweightProducedKg: outputValue('Liveweight produced in kg'),
  liveweightIntensity: outputValue(
    'Beef liveweight emissions intensity for this activity, in kg CO2e/kg liveweight',
  ),
});
