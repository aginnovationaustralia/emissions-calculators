import { z } from 'zod';

export const PoultryEmissionsIntensitiesBroilerSchema = z.object({
  poultryMeatIncludingSequestration: z.number().meta({
    description:
      'Poultry meat emissions intensity including carbon sequestration, in kg-CO2e/kg liveweight',
  }),
  poultryMeatExcludingSequestration: z.number().meta({
    description:
      'Poultry meat emissions intensity excluding carbon sequestration, in kg-CO2e/kg liveweight',
  }),
  meatProducedKg: z
    .number()
    .meta({ description: 'Poultry meat produced in kg liveweight' }),
});

export type PoultryEmissionsIntensitiesBroiler = z.infer<
  typeof PoultryEmissionsIntensitiesBroilerSchema
>;
