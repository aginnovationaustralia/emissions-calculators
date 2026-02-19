import { NetOutputSchema } from '@/types/common/net.output.new';
import { intermediateEmissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { GrainsIntensitiesOutputSchema } from './intensities.output';
import { GrainsScope1OutputSchema } from './scope1.output';
import { GrainsScope2OutputSchema } from './scope2.output';
import { GrainsScope3OutputSchema } from './scope3.output';

export const GrainsIntermediateOutputSchema = intermediateEmissionsOutput(
  'Grains',
  {
    scope1: GrainsScope1OutputSchema,
    scope2: GrainsScope2OutputSchema,
    scope3: GrainsScope3OutputSchema,
    net: NetOutputSchema,
    intensities: GrainsIntensitiesOutputSchema,
  },
);

export type GrainsIntermediateOutput = z.infer<
  typeof GrainsIntermediateOutputSchema
>;
