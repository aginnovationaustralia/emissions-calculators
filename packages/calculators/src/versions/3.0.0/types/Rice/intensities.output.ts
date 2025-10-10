import { z } from 'zod';

export const RiceEmissionsIntensitiesSchema = z.object({
  riceProducedTonnes: z
    .number()
    .meta({ description: 'Rice produced in tonnes' }),
  riceExcludingSequestration: z
    .number()
    .meta({ description: 'Rice excluding sequestration, in t-CO2e/t rice' }),
  riceIncludingSequestration: z
    .number()
    .meta({ description: 'Rice including sequestration, in t-CO2e/t rice' }),
  intensity: z.number().meta({
    description:
      'Use `riceIncludingSequestration` instead. Deprecated note: Use `riceIncludingSequestration` instead',
  }),
});

export type RiceEmissionsIntensities = z.infer<
  typeof RiceEmissionsIntensitiesSchema
>;
