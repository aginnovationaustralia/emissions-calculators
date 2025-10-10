import { z } from 'zod';

export const FeedlotEmissionIntensitiesSchema = z.object({
  liveweightProducedKg: z
    .number()
    .meta({ description: 'Amount of meat produced in kg liveweight' }),
  beefIncludingSequestration: z.number().meta({
    description:
      'Beef including carbon sequestration, in kg-CO2e/kg liveweight',
  }),
  beefExcludingSequestration: z.number().meta({
    description:
      'Beef excluding carbon sequestration, in kg-CO2e/kg liveweight',
  }),
});

export type FeedlotEmissionIntensities = z.infer<
  typeof FeedlotEmissionIntensitiesSchema
>;
