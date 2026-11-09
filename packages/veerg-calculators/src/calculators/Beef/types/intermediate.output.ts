import { ActivityNetOutputSchema } from '@/calculators/types/activity-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { intermediateEmissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { BeefIntermediateIntensitiesOutputSchema } from './intermediate-intensities.output';
import { BeefScope1OutputSchema } from './scope1.output';
import { BeefScope3OutputSchema } from './scope3.output';

export const BeefIntermediateOutputSchema = intermediateEmissionsOutput(
  'Beef',
  {
    scope1: BeefScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: BeefScope3OutputSchema,
    net: ActivityNetOutputSchema,
    intensities: BeefIntermediateIntensitiesOutputSchema,
  },
);

export type BeefIntermediateOutput = z.infer<
  typeof BeefIntermediateOutputSchema
>;
