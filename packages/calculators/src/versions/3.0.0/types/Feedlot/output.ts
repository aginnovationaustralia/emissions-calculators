import { z } from 'zod';
import { emissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationOutputSchema } from '../sequestration.output';
import { FeedlotEmissionIntensitiesSchema } from './intensities.output';
import { FeedlotIntermediateOutputSchema } from './intermediate.output';
import { FeedlotNetOutputSchema } from './net.output';
import { FeedlotScope1OutputSchema } from './scope1.output';
import { FeedlotScope3OutputSchema } from './scope3.output';

export const FeedlotOutputSchema = emissionsOutput('Feedlot', {
  scope1: FeedlotScope1OutputSchema,
  scope2: Scope2OutputSchema,
  scope3: FeedlotScope3OutputSchema,
  carbonSequestration: SequestrationOutputSchema,
  intermediate: z.array(FeedlotIntermediateOutputSchema),
  net: FeedlotNetOutputSchema,
  intensities: FeedlotEmissionIntensitiesSchema,
});

export type FeedlotOutput = z.infer<typeof FeedlotOutputSchema>;
