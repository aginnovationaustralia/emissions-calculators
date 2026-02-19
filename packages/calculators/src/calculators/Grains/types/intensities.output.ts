import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const GrainsIntensitiesOutputSchema = z.object({
  grainProducedTonnes: outputValue('Grain produced in tonnes'),
  grainsExcludingSequestration: outputValue(
    'Grains emissions intensity excluding sequestration, in t-CO2e/t grain',
  ),
  grainsIncludingSequestration: outputValue(
    'Grains emissions intensity including sequestration, in t-CO2e/t grain',
  ),
});

export type GrainsIntensitiesOutput = z.infer<
  typeof GrainsIntensitiesOutputSchema
>;
