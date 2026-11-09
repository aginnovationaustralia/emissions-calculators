import { ActivityNetOutputSchema } from '@/calculators/types/activity-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { intermediateEmissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { CroppingIntermediateIntensitiesOutputSchema } from './intermediate-intensities.output';
import { CroppingScope1OutputSchema } from './scope1.output';
import { CroppingScope3OutputSchema } from './scope3.output';

export const CroppingIntermediateOutputSchema = intermediateEmissionsOutput(
  'Cropping',
  {
    scope1: CroppingScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: CroppingScope3OutputSchema,
    net: ActivityNetOutputSchema,
    intensities: CroppingIntermediateIntensitiesOutputSchema,
  },
);

export type CroppingIntermediateOutput = z.infer<
  typeof CroppingIntermediateOutputSchema
>;
