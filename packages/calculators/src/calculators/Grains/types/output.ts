import { emissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { GrainsIntensitiesOutputSchema } from './intensities.output';
import { GrainsIntermediateOutputSchema } from './intermediate.output';
import { NetOutputSchema } from './net.output';
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
  intensities: GrainsIntensitiesOutputSchema,
});

export type GrainsOutput = z.infer<typeof GrainsOutputSchema>;
