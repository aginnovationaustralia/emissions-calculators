import { EnterpriseNetOutputSchema } from '@/calculators/types/enterprise-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { emissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { CroppingIntensitiesOutputSchema } from './intensities.output';
import { CroppingIntermediateOutputSchema } from './intermediate.output';
import { CroppingScope1OutputSchemaPlusLULUCF } from './scope1.output';
import { CroppingScope3OutputSchema } from './scope3.output';

export const CroppingOutputSchema = emissionsOutput('Cropping', {
  scope1: CroppingScope1OutputSchemaPlusLULUCF,
  scope2: Scope2OutputSchema,
  scope3: CroppingScope3OutputSchema,
  intermediate: z.array(CroppingIntermediateOutputSchema),
  net: EnterpriseNetOutputSchema,
  intensities: CroppingIntensitiesOutputSchema,
});

export type CroppingOutput = z.infer<typeof CroppingOutputSchema>;
