import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const BeefIntensitiesOutputSchema = z.object({
  grainProducedTonnes: outputValue('Grain produced in tonnes'),
  beefLiveweightExcludingSequestration: outputValue(
    'Beef liveweight emissions intensity excluding sequestration, in t-CO2e/t grain',
  ),
  beefLiveweightIncludingSequestration: outputValue(
    'Beef liveweight emissions intensity including sequestration, in t-CO2e/t grain',
  ),
});

export type BeefIntensitiesOutput = z.infer<typeof BeefIntensitiesOutputSchema>;
