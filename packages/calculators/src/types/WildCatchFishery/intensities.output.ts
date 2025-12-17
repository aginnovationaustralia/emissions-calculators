import { z } from 'zod';

export const WildCatchFisheryIntensitiesOutputSchema = z.object({
  totalHarvestWeightKg: z
    .number()
    .meta({ description: 'Total harvest weight in kg' }),
  wildCatchFisheryExcludingCarbonOffsets: z.number().meta({
    description:
      'Wild catch fishery emissions intensity excluding sequestration, in kg-CO2e/kg harvest weight',
  }),
  wildCatchFisheryIncludingCarbonOffsets: z.number().meta({
    description:
      'Wild catch fishery emissions intensity including sequestration, in kg-CO2e/kg harvest weight',
  }),
});

export type WildCatchFisheryIntensitiesOutput = z.infer<
  typeof WildCatchFisheryIntensitiesOutputSchema
>;
