import { EnterpriseNetOutputSchema } from '@/calculators/types/enterprise-net.output';
import { emissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { Scope2OutputSchema } from '../../types/scope2.output';
import { FeedlotIntensitiesOutputSchema } from './intensities.output';
import { FeedlotIntermediateOutputSchema } from './intermediate.output';
import { FeedlotScope1OutputSchemaPlusLULUCF } from './scope1.output';
import { FeedlotScope3OutputSchema } from './scope3.output';

export const FeedlotOutputSchema = emissionsOutput('Feedlot', {
  scope1: FeedlotScope1OutputSchemaPlusLULUCF,
  scope2: Scope2OutputSchema,
  scope3: FeedlotScope3OutputSchema,
  intermediate: z.array(FeedlotIntermediateOutputSchema),
  net: EnterpriseNetOutputSchema,
  intensities: FeedlotIntensitiesOutputSchema,
});

export type FeedlotOutput = z.infer<typeof FeedlotOutputSchema>;
