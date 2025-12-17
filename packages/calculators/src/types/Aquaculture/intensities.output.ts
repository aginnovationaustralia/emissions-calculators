import { z } from 'zod';

export const AquacultureIntensitiesOutputSchema = z.object({
  totalHarvestWeightKg: z
    .number()
    .meta({ description: 'Total harvest weight in kg' }),
  aquacultureExcludingCarbonOffsets: z.number().meta({
    description:
      'Aquaculture emissions intensity excluding sequestration, in kg-CO2e/kg',
  }),
  aquacultureIncludingCarbonOffsets: z.number().meta({
    description:
      'Aquaculture emissions intensity including sequestration, in kg-CO2e/kg',
  }),
});

export type AquacultureIntensitiesOutput = z.infer<
  typeof AquacultureIntensitiesOutputSchema
>;
