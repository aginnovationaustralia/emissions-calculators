import { ActivityNetOutputSchema } from '@/calculators/types/activity-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { intermediateEmissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { ViticultureIntermediateIntensitiesOutputSchema } from './intermediate-intensities.output';
import { ViticultureScope1OutputSchema } from './scope1.output';
import { ViticultureScope3OutputSchema } from './scope3.output';

export const ViticultureIntermediateOutputSchema = intermediateEmissionsOutput(
  'Viticulture',
  {
    scope1: ViticultureScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: ViticultureScope3OutputSchema,
    net: ActivityNetOutputSchema,
    intensities: ViticultureIntermediateIntensitiesOutputSchema,
  },
);

export type ViticultureIntermediateOutput = z.infer<
  typeof ViticultureIntermediateOutputSchema
>;
