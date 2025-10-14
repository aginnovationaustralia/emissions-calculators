import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationTotalOutputSchema } from '../sequestration.total.output';
import { FeedlotEmissionIntensitiesSchema } from './intensities.output';
import { FeedlotNetOutputSchema } from './net.output';
import { FeedlotScope1OutputSchema } from './scope1.output';
import { FeedlotScope3OutputSchema } from './scope3.output';

export const FeedlotIntermediateOutputSchema = z.object({
  id: z.string().meta({ description: DESCRIPTIONS.ACTIVITY_ID }),
  scope1: FeedlotScope1OutputSchema,
  scope2: Scope2OutputSchema,
  scope3: FeedlotScope3OutputSchema,
  carbonSequestration: SequestrationTotalOutputSchema,
  net: FeedlotNetOutputSchema,
  intensities: FeedlotEmissionIntensitiesSchema,
});

export type FeedlotIntermediateOutput = z.infer<
  typeof FeedlotIntermediateOutputSchema
>;
