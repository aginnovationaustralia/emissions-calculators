import { NetOutputSchema } from '@/types/common/net.output.new';
import { emissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { GrainsIntermediateOutputSchema } from './intermediate.output';
import { GrainsScope1OutputSchema } from './scope1.output';
import { GrainsScope2OutputSchema } from './scope2.output';
import { GrainsScope3OutputSchema } from './scope3.output';

export const GrainsOutputSchema = emissionsOutput('Grains', {
  scope1: GrainsScope1OutputSchema,
  scope2: GrainsScope2OutputSchema,
  scope3: GrainsScope3OutputSchema,
  // carbonSequestration: SequestrationOutputSchema,
  intermediate: z.array(GrainsIntermediateOutputSchema),
  net: NetOutputSchema,
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
