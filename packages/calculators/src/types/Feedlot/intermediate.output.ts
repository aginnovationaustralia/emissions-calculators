import { z } from 'zod';
import { intermediateEmissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { FeedlotEmissionIntensitiesSchema } from './intensities.output';
import { FeedlotNetOutputSchema } from './net.output';
import { FeedlotScope1OutputSchema } from './scope1.output';
import { FeedlotScope3OutputSchema } from './scope3.output';

export const FeedlotIntermediateOutputSchema = intermediateEmissionsOutput(
  'Feedlot',
  {
    scope1: FeedlotScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: FeedlotScope3OutputSchema,
    net: FeedlotNetOutputSchema,
    intensities: FeedlotEmissionIntensitiesSchema,
  },
);

export type FeedlotIntermediateOutput = z.infer<
  typeof FeedlotIntermediateOutputSchema
>;
