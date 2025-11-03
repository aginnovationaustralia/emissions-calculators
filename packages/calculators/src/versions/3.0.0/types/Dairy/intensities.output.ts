import { z } from 'zod';

export const DairyEmissionsIntensitiesSchema = z.object({
  milkSolidsProducedTonnes: z
    .number()
    .meta({ description: 'Milk solids produced in tonnes' }),
  intensity: z.number().meta({
    description:
      'Dairy emissions intensity including sequestration, in tonnes-CO2e/tonne milk solids',
  }),
});

export type DairyEmissionsIntensities = z.infer<
  typeof DairyEmissionsIntensitiesSchema
>;
