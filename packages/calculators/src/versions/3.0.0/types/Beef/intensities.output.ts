import { z } from 'zod';

export const BeefEmissionsIntensitiesSchema = z.object({
  liveweightBeefProducedKg: z
    .number()
    .meta({ description: 'Amount of beef produced in kg liveweight' }),
  beefExcludingSequestration: z.number().meta({
    description:
      'Beef emissions intensity excluding sequestration, in kg-CO2e/kg liveweight',
  }),
  beefIncludingSequestration: z.number().meta({
    description:
      'Beef emissions intensity including sequestration, in kg-CO2e/kg liveweight',
  }),
});

export type BeefEmissionsIntensities = z.infer<
  typeof BeefEmissionsIntensitiesSchema
>;
