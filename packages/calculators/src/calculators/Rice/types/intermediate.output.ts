import { ActivityNetOutputSchema } from '@/calculators/types/activity-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { intermediateEmissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { RiceIntermediateIntensitiesOutputSchema } from './intermediate-intensities.output';
import { RiceScope1OutputSchema } from './scope1.output';
import { RiceScope3OutputSchema } from './scope3.output';

export const RiceIntermediateOutputSchema = intermediateEmissionsOutput(
  'Rice',
  {
    scope1: RiceScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: RiceScope3OutputSchema,
    net: ActivityNetOutputSchema,
    intensities: RiceIntermediateIntensitiesOutputSchema,
  },
);

export type RiceIntermediateOutput = z.infer<
  typeof RiceIntermediateOutputSchema
>;
