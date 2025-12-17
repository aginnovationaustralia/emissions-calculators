import { z } from 'zod';

export const HorticultureIntensitiesOutputSchema = z
  .object({
    cropProducedTonnes: z
      .number()
      .meta({ description: 'Horticultural crop produced in tonnes' }),
    tonnesCropExcludingSequestration: z.number().meta({
      description:
        'Emissions intensity excluding sequestration, in t-CO2e/t crop',
    }),
    tonnesCropIncludingSequestration: z.number().meta({
      description:
        'Emissions intensity including sequestration, in t-CO2e/t crop',
    }),
  })
  .meta({ description: 'Horticulture intensities output' });

export type HorticultureIntensitiesOutput = z.infer<
  typeof HorticultureIntensitiesOutputSchema
>;
