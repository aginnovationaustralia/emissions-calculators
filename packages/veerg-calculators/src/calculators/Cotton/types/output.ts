import { EnterpriseNetOutputSchema } from '@/calculators/types/enterprise-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { emissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { CottonIntensitiesOutputSchema } from './intensities.output';
import { CottonIntermediateOutputSchema } from './intermediate.output';
import { CottonScope1OutputSchemaPlusLULUCF } from './scope1.output';
import { CottonScope3OutputSchema } from './scope3.output';

export const CottonOutputSchema = emissionsOutput('Cotton', {
  scope1: CottonScope1OutputSchemaPlusLULUCF,
  scope2: Scope2OutputSchema,
  scope3: CottonScope3OutputSchema,
  intermediate: z.array(CottonIntermediateOutputSchema),
  net: EnterpriseNetOutputSchema,
  intensities: CottonIntensitiesOutputSchema,
});

export type CottonOutput = z.infer<typeof CottonOutputSchema>;
