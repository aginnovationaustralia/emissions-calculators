import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const GrainsIntensitiesOutputSchema = z.object({
  grainHarvestedKg: outputValue('Grain harvested in kg'),
  grainsExcludingLULUCF: outputValue(
    'Grains emissions intensity excluding LULUCF, in kg-CO2e/kg grain',
  ),
  grainsIncludingLULUCF: outputValue(
    'Grains emissions intensity including LULUCF, in kg-CO2e/kg grain',
  ),
});

export type GrainsIntensitiesOutput = z.infer<
  typeof GrainsIntensitiesOutputSchema
>;
