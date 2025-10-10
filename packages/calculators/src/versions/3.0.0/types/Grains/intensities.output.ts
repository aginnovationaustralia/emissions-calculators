import { z } from 'zod';

export const GrainsIntensitiesOutputSchema = z.object({
  grainProducedTonnes: z
    .number()
    .meta({ description: 'Grain produced in tonnes' }),
  grainsExcludingSequestration: z
    .number()
    .meta({ description: 'Grains excluding sequestration, in t-CO2e/t grain' }),
  grainsIncludingSequestration: z
    .number()
    .meta({ description: 'Grains including sequestration, in t-CO2e/t grain' }),
});

export type GrainsIntensitiesOutput = z.infer<
  typeof GrainsIntensitiesOutputSchema
>;
