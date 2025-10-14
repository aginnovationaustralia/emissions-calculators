import { z } from 'zod';

export const PoultryEmissionsIntensitiesLayerSchema = z.object({
  poultryEggsIncludingSequestration: z.number().meta({
    description:
      'Poultry eggs including carbon sequestration, in kg-CO2e/kg eggs',
  }),
  poultryEggsExcludingSequestration: z.number().meta({
    description:
      'Poultry eggs excluding carbon sequestration, in kg-CO2e/kg eggs',
  }),
  eggsProducedKg: z
    .number()
    .meta({ description: 'Poultry eggs produced in kg' }),
});

export type PoultryEmissionsIntensitiesLayer = z.infer<
  typeof PoultryEmissionsIntensitiesLayerSchema
>;
