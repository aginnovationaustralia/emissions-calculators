import { EnterpriseNetOutputSchema } from '@/calculators/types/enterprise-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { emissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { SugarIntensitiesOutputSchema } from './intensities.output';
import { SugarIntermediateOutputSchema } from './intermediate.output';
import { SugarScope1OutputSchemaPlusLULUCF } from './scope1.output';
import { SugarScope3OutputSchema } from './scope3.output';

export const SugarOutputSchema = emissionsOutput('Sugar', {
  scope1: SugarScope1OutputSchemaPlusLULUCF,
  scope2: Scope2OutputSchema,
  scope3: SugarScope3OutputSchema,
  intermediate: z.array(SugarIntermediateOutputSchema),
  net: EnterpriseNetOutputSchema,
  intensities: SugarIntensitiesOutputSchema,
});

export type SugarOutput = z.infer<typeof SugarOutputSchema>;
