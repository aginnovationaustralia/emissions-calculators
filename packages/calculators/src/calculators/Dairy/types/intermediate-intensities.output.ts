import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const DairyIntermediateIntensitiesOutputSchema = z.object({
  liveweightProducedKg: outputValue('Liveweight produced in kg'),
  liveweightIntensity: outputValue(
    'Dairy liveweight emissions intensity for this activity, in kg-CO2e/kg liveweight',
  ),
  milkProducedKg: outputValue('Milk produced in kg'),
  milkIntensity: outputValue(
    'Dairy milk emissions intensity for this activity, in kg-CO2e/kg milk',
  ),
});

export type DairyIntermediateIntensitiesOutput = z.infer<
  typeof DairyIntermediateIntensitiesOutputSchema
>;
