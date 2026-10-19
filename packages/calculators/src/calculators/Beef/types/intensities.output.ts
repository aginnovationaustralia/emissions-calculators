import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const BeefIntensitiesOutputSchema = z.object({
  liveweightProducedKg: outputValue('Liveweight produced in kg'),
  liveweightIntensityExcludingLULUCF: outputValue(
    'Beef liveweight emissions intensity excluding LULUCF, in kg CO2e/kg liveweight',
  ),
  liveweightIntensityIncludingLULUCF: outputValue(
    'Beef liveweight emissions intensity including LULUCF, in kg CO2e/kg liveweight',
  ),
});
