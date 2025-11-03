import { z } from 'zod';

export const PoultryEmissionsIntensitiesSchema = z.object({
  poultryMeatIncludingSequestration: z.number().meta({
    description:
      'Poultry meat emissions intensity including carbon sequestration, in kg-CO2e/kg liveweight',
  }),
  poultryMeatExcludingSequestration: z.number().meta({
    description:
      'Poultry meat emissions intensity excluding carbon sequestration, in kg-CO2e/kg liveweight',
  }),
  poultryEggsIncludingSequestration: z.number().meta({
    description:
      'Poultry eggs emissions intensity including carbon sequestration, in kg-CO2e/kg liveweight',
  }),
  poultryEggsExcludingSequestration: z.number().meta({
    description:
      'Poultry eggs emissions intensity excluding carbon sequestration, in kg-CO2e/kg liveweight',
  }),
  meatProducedKg: z
    .number()
    .meta({ description: 'Poultry meat produced in kg' }),
  eggsProducedKg: z
    .number()
    .meta({ description: 'Amount of eggs produced, in kg' }),
});

export type PoultryEmissionsIntensities = z.infer<
  typeof PoultryEmissionsIntensitiesSchema
>;
