import { z } from 'zod';

export const SugarIntensitiesOutputSchema = z.object({
  sugarExcludingSequestration: z.number().meta({
    description:
      'Sugar emissions intensity excluding sequestration, in kg-CO2e/kg sugar',
  }),
  sugarIncludingSequestration: z.number().meta({
    description:
      'Sugar emissions intensity including sequestration, in kg-CO2e/kg sugar',
  }),
  sugarProducedKg: z.number().meta({ description: 'Sugar produced in kg' }),
});

export type SugarIntensitiesOutput = z.infer<
  typeof SugarIntensitiesOutputSchema
>;
