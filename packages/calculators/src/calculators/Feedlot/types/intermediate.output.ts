import { ActivityNetOutputSchema } from '@/calculators/types/activity-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { intermediateEmissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { FeedlotIntermediateIntensitiesOutputSchema } from './intermediate-intensities.output';
import { FeedlotScope1OutputSchema } from './scope1.output';
import { FeedlotScope3OutputSchema } from './scope3.output';

export const FeedlotIntermediateOutputSchema = intermediateEmissionsOutput(
  'Feedlot',
  {
    scope1: FeedlotScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: FeedlotScope3OutputSchema,
    net: ActivityNetOutputSchema,
    intensities: FeedlotIntermediateIntensitiesOutputSchema,
  },
);

export type FeedlotIntermediateOutput = z.infer<
  typeof FeedlotIntermediateOutputSchema
>;
