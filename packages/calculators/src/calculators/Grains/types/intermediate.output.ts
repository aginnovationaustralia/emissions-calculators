import { ActivityNetOutputSchema } from '@/calculators/types/activity-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { intermediateEmissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { GrainsIntermediateIntensitiesOutputSchema } from './intermediate-intensities.output';
import { GrainsScope1OutputSchema } from './scope1.output';
import { GrainsScope3OutputSchema } from './scope3.output';

export const GrainsIntermediateOutputSchema = intermediateEmissionsOutput(
  'Grains',
  {
    scope1: GrainsScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: GrainsScope3OutputSchema,
    net: ActivityNetOutputSchema,
    intensities: GrainsIntermediateIntensitiesOutputSchema,
  },
);

export type GrainsIntermediateOutput = z.infer<
  typeof GrainsIntermediateOutputSchema
>;
