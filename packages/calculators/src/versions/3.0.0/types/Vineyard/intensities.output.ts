import { z } from 'zod';

export const VineyardIntensitiesOutputSchema = z.object({
  vineyardsExcludingSequestration: z.number().meta({
    description:
      'Vineyard emissions intensity excluding sequestration, in kg-CO2e/kg crop',
  }),
  vineyardsIncludingSequestration: z.number().meta({
    description:
      'Vineyard emissions intensity including sequestration, in kg-CO2e/kg crop',
  }),
  cropProducedKg: z
    .number()
    .meta({ description: 'Vineyard crop produced in kg' }),
});

export type VineyardIntensitiesOutput = z.infer<
  typeof VineyardIntensitiesOutputSchema
>;
