import { ActivityNetOutputSchema } from '@/calculators/types/activity-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { intermediateEmissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { AquacultureIntensitiesOutputSchema } from './intensities.output';
import { AquacultureScope1OutputSchema } from './scope1.output';
import { AquacultureScope3OutputSchema } from './scope3.output';

export const AquacultureIntermediateOutputSchema = intermediateEmissionsOutput(
  'Aquaculture',
  {
    scope1: AquacultureScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: AquacultureScope3OutputSchema,
    net: ActivityNetOutputSchema,
    intensities: AquacultureIntensitiesOutputSchema,
  },
);

export type AquacultureIntermediateOutput = z.infer<
  typeof AquacultureIntermediateOutputSchema
>;
