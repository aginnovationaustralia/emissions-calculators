import { ActivityNetOutputSchema } from '@/calculators/types/activity-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { intermediateEmissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { HorticultureIntermediateIntensitiesOutputSchema } from './intermediate-intensities.output';
import { HorticultureScope1OutputSchema } from './scope1.output';
import { HorticultureScope3OutputSchema } from './scope3.output';

export const HorticultureIntermediateOutputSchema = intermediateEmissionsOutput(
  'Horticulture',
  {
    scope1: HorticultureScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: HorticultureScope3OutputSchema,
    net: ActivityNetOutputSchema,
    intensities: HorticultureIntermediateIntensitiesOutputSchema,
  },
);

export type HorticultureIntermediateOutput = z.infer<
  typeof HorticultureIntermediateOutputSchema
>;
