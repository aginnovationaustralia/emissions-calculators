import { z } from 'zod';
import { emissionsOutput } from '../schemas';
import { GrainsIntermediateOutputSchema } from './intermediate.output';

export const GrainsOutputSchema = emissionsOutput('Grains', {
  // scope1: GrainsScope1OutputSchema,
  // scope2: Scope2OutputSchema,
  // scope3: GrainsScope3OutputSchema,
  // carbonSequestration: SequestrationOutputSchema,
  intermediate: z.array(GrainsIntermediateOutputSchema),
  // net: GrainsNetOutputSchema,
  // intensitiesWithSequestration: z.array(GrainsIntensitiesOutputSchema).meta({
  //   description:
  //     'Emissions intensity for each crop (in order), in t-CO2e/t crop',
  // }),
  // intensities: z.array(z.number()).meta({
  //   description:
  //     'Emissions intensity for each crop (in order), in t-CO2e/t crop',
  // }),
});

export type GrainsOutput = z.infer<typeof GrainsOutputSchema>;
