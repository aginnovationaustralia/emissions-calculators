import { z } from 'zod';

export const WildSeaFisheriesIntensitiesOutputSchema = z.object({
  intensityExcludingCarbonOffset: z.number().meta({
    description:
      'Wild sea fisheries emissions intensity excluding carbon offsets, in kg-CO2e/kg',
  }),
  intensityIncludingCarbonOffset: z.number().meta({
    description:
      'Wild sea fisheries emissions intensity including carbon offsets, in kg-CO2e/kg',
  }),
  totalHarvestWeightTonnes: z
    .number()
    .meta({ description: 'Total harvest weight in tonnes' }),
});

export type WildSeaFisheriesIntensitiesOutput = z.infer<
  typeof WildSeaFisheriesIntensitiesOutputSchema
>;
