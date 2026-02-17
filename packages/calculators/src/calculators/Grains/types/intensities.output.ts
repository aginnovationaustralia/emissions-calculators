import { z } from 'zod';

export const GrainsIntensitiesOutputSchema = z.object({
  grainProducedTonnes: z
    .number()
    .meta({ description: 'Grain produced in tonnes' }),
  grainsExcludingSequestration: z
    .number()
    .meta({
      description:
        'Grains emissions intensity excluding sequestration, in t-CO2e/t grain',
    }),
  grainsIncludingSequestration: z
    .number()
    .meta({
      description:
        'Grains emissions intensity including sequestration, in t-CO2e/t grain',
    }),
});

export type GrainsIntensitiesOutput = z.infer<
  typeof GrainsIntensitiesOutputSchema
>;
