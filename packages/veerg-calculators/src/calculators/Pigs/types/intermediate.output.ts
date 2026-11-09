import { ActivityNetOutputSchema } from '@/calculators/types/activity-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { intermediateEmissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { PigsIntermediateIntensitiesOutputSchema } from './intermediate-intensities.output';
import { PigsScope1OutputSchema } from './scope1.output';
import { PigsScope3OutputSchema } from './scope3.output';

export const PigsIntermediateOutputSchema = intermediateEmissionsOutput(
  'Pigs',
  {
    scope1: PigsScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: PigsScope3OutputSchema,
    net: ActivityNetOutputSchema,
    intensities: PigsIntermediateIntensitiesOutputSchema,
  },
);

export type PigsIntermediateOutput = z.infer<
  typeof PigsIntermediateOutputSchema
>;
