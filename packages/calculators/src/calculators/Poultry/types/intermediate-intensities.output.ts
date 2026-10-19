import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const PoultryIntermediateIntensitiesOutputSchema = z.object({
  liveweightProducedKg: outputValue('Liveweight produced in kg'),
  liveweightIntensity: outputValue(
    'Poultry liveweight emissions intensity for this activity, in kg-CO2e/kg liveweight',
  ),
  eggsProducedKg: outputValue('Eggs produced in kg'),
  eggsIntensity: outputValue(
    'Poultry egg emissions intensity for this activity, in kg-CO2e/kg eggs',
  ),
});

export type PoultryIntermediateIntensitiesOutput = z.infer<
  typeof PoultryIntermediateIntensitiesOutputSchema
>;
