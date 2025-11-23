import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { intermediateEmissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { GrainsIntensitiesOutputSchema } from './intensities.output';
import { GrainsScope1OutputSchema } from './scope1.output';
import { GrainsScope3OutputSchema } from './scope3.output';

export const GrainsIntermediateOutputSchema = intermediateEmissionsOutput(
  'Grains',
  {
    scope1: GrainsScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: GrainsScope3OutputSchema,
    intensitiesWithSequestration: GrainsIntensitiesOutputSchema,
    net: NetOutputSchema,
  },
);

export type GrainsIntermediateOutput = z.infer<
  typeof GrainsIntermediateOutputSchema
>;
