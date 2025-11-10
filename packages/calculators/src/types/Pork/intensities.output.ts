import { z } from 'zod';

export const PorkEmissionsIntensitiesSchema = z.object({
  porkMeatIncludingSequestration: z.number().meta({
    description:
      'Pork meat emissions intensity including carbon sequestration, in kg-CO2e/kg liveweight',
  }),
  porkMeatExcludingSequestration: z.number().meta({
    description:
      'Pork meat emissions intensity excluding carbon sequestration, in kg-CO2e/kg liveweight',
  }),
  liveweightProducedKg: z
    .number()
    .meta({ description: 'Pork meat produced in kg liveweight' }),
});

export type PorkEmissionsIntensities = z.infer<
  typeof PorkEmissionsIntensitiesSchema
>;
