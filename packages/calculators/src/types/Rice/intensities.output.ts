import { z } from 'zod';

export const RiceEmissionsIntensitiesSchema = z.object({
  riceProducedTonnes: z
    .number()
    .meta({ description: 'Rice produced in tonnes' }),
  riceExcludingSequestration: z.number().meta({
    description:
      'Rice emissions intensity excluding sequestration, in t-CO2e/t rice',
  }),
  riceIncludingSequestration: z.number().meta({
    description:
      'Rice emissions intensity including sequestration, in t-CO2e/t rice',
  }),
});

export type RiceEmissionsIntensities = z.infer<
  typeof RiceEmissionsIntensitiesSchema
>;
