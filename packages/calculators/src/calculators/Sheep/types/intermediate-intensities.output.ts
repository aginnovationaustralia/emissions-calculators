import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const SheepIntermediateIntensitiesOutputSchema = z.object({
  liveweightProducedKilograms: outputValue('Liveweight produced in kg'),
  liveweightIntensity: outputValue(
    'Sheep liveweight emissions intensity for this activity, in kg-CO2e/kg liveweight',
  ),
  woolProducedKilograms: outputValue('Clean wool produced in kg'),
  woolIntensity: outputValue(
    'Sheep wool emissions intensity for this activity, in kg-CO2e/kg clean wool',
  ),
});

export type SheepIntermediateIntensitiesOutput = z.infer<
  typeof SheepIntermediateIntensitiesOutputSchema
>;
