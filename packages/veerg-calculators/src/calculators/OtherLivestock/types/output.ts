import { EnterpriseNetOutputSchema } from '@/calculators/types/enterprise-net.output';
import { emissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { Scope2OutputSchema } from '../../types/scope2.output';
import { OtherLivestockIntensitiesOutputSchema } from './intensities.output';
import { OtherLivestockIntermediateOutputSchema } from './intermediate.output';
import { OtherLivestockScope1OutputSchemaPlusLULUCF } from './scope1.output';
import { OtherLivestockScope3OutputSchema } from './scope3.output';

export const OtherLivestockOutputSchema = emissionsOutput('Other Livestock', {
  scope1: OtherLivestockScope1OutputSchemaPlusLULUCF,
  scope2: Scope2OutputSchema,
  scope3: OtherLivestockScope3OutputSchema,
  intermediate: z.array(OtherLivestockIntermediateOutputSchema),
  net: EnterpriseNetOutputSchema,
  intensities: OtherLivestockIntensitiesOutputSchema,
});

export type OtherLivestockOutput = z.infer<typeof OtherLivestockOutputSchema>;
