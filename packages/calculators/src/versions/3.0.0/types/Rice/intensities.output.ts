import { z } from 'zod';
import { deprecated } from '../schemas';

export const RiceEmissionsIntensitiesSchema = z.object({
  riceProducedTonnes: z
    .number()
    .meta({ description: 'Rice produced in tonnes' }),
  riceExcludingSequestration: z
    .number()
    .meta({ description: 'Rice excluding sequestration, in t-CO2e/t rice' }),
  riceIncludingSequestration: z
    .number()
    .meta({ description: 'Rice including sequestration, in t-CO2e/t rice' }),
  intensity: z
    .number()
    .meta(
      deprecated(
        'Emissions intensity of rice production',
        'Use `riceIncludingSequestration` instead',
      ),
    ),
});

export type RiceEmissionsIntensities = z.infer<
  typeof RiceEmissionsIntensitiesSchema
>;
