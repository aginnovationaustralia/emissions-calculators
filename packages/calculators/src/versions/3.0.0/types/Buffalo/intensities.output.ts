import { z } from 'zod';

export const BuffaloEmissionsIntensitiesSchema = z.object({
  liveweightProducedKg: z
    .number()
    .meta({ description: 'Amount of buffalo meat produced in kg liveweight' }),
  buffaloMeatExcludingSequestration: z.number().meta({
    description:
      'Buffalo meat (breeding herd) excluding sequestration, in kg-CO2e/kg liveweight',
  }),
  buffaloMeatIncludingSequestration: z.number().meta({
    description:
      'Buffalo meat (breeding herd) including sequestration, in kg-CO2e/kg liveweight',
  }),
});

export type BuffaloEmissionsIntensities = z.infer<
  typeof BuffaloEmissionsIntensitiesSchema
>;
