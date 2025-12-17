import { z } from 'zod';

export const DeerEmissionsIntensitiesSchema = z.object({
  liveweightProducedKg: z
    .number()
    .meta({ description: 'Deer meat produced in kg liveweight' }),
  deerMeatExcludingSequestration: z.number().meta({
    description:
      'Deer meat (breeding herd) emissions intensity excluding sequestration, in kg-CO2e/kg liveweight',
  }),
  deerMeatIncludingSequestration: z.number().meta({
    description:
      'Deer meat (breeding herd) emissions intensity including sequestration, in kg-CO2e/kg liveweight',
  }),
});

export type DeerEmissionsIntensities = z.infer<
  typeof DeerEmissionsIntensitiesSchema
>;
