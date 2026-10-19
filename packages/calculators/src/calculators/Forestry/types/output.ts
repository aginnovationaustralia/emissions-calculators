import { EnterpriseNetOutputSchema } from '@/calculators/types/enterprise-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { emissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { ForestryIntermediateOutputSchema } from './intermediate.output';
import { ForestryScope1OutputSchema } from './scope1.output';
import { ForestryScope3OutputSchema } from './scope3.output';

export const ForestryOutputSchema = emissionsOutput('Forestry', {
  scope1: ForestryScope1OutputSchema,
  scope2: Scope2OutputSchema,
  scope3: ForestryScope3OutputSchema,
  intermediate: z.array(ForestryIntermediateOutputSchema),
  net: EnterpriseNetOutputSchema,
});

export type ForestryOutput = z.infer<typeof ForestryOutputSchema>;
