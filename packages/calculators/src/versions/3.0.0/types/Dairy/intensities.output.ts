import { z } from 'zod';

export const DairyEmissionsIntensitiesSchema = z.object({
  milkSolidsProducedTonnes: z
    .number()
    .meta({ description: 'Milk solids produced in tonnes' }),
  intensity: z.number().meta({
    description:
      'Dairy intensities including carbon sequestration, in tonnes-CO2e',
  }),
});

export type DairyEmissionsIntensities = z.infer<
  typeof DairyEmissionsIntensitiesSchema
>;
