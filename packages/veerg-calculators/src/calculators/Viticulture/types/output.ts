import { EnterpriseNetOutputSchema } from '@/calculators/types/enterprise-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { emissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { ViticultureIntensitiesOutputSchema } from './intensities.output';
import { ViticultureIntermediateOutputSchema } from './intermediate.output';
import { ViticultureScope1OutputSchemaPlusLULUCF } from './scope1.output';
import { ViticultureScope3OutputSchema } from './scope3.output';

export const ViticultureOutputSchema = emissionsOutput('Viticulture', {
  scope1: ViticultureScope1OutputSchemaPlusLULUCF,
  scope2: Scope2OutputSchema,
  scope3: ViticultureScope3OutputSchema,
  intermediate: z.array(ViticultureIntermediateOutputSchema),
  net: EnterpriseNetOutputSchema,
  intensities: ViticultureIntensitiesOutputSchema,
});

export type ViticultureOutput = z.infer<typeof ViticultureOutputSchema>;
