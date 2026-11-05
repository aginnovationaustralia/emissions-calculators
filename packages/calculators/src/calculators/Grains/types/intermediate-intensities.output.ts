import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const GrainsIntermediateIntensitiesOutputSchema = z.object({
  grainHarvestedKilograms: outputValue('Grain harvested in kg'),
  grainsIntensity: outputValue(
    'Grains emissions intensity for this activity, in kg-CO2e/kg grain',
  ),
});

export type GrainsIntermediateIntensitiesOutput = z.infer<
  typeof GrainsIntermediateIntensitiesOutputSchema
>;
