import { EnterpriseNetOutputSchema } from '@/calculators/types/enterprise-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { emissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { PoultryIntensitiesOutputSchema } from './intensities.output';
import { PoultryIntermediateOutputSchema } from './intermediate.output';
import { PoultryScope1OutputSchemaPlusLULUCF } from './scope1.output';
import { PoultryScope3OutputSchema } from './scope3.output';

export const PoultryOutputSchema = emissionsOutput('Poultry', {
  scope1: PoultryScope1OutputSchemaPlusLULUCF,
  scope2: Scope2OutputSchema,
  scope3: PoultryScope3OutputSchema,
  intermediate: z.array(PoultryIntermediateOutputSchema),
  net: EnterpriseNetOutputSchema,
  intensities: PoultryIntensitiesOutputSchema,
});

export type PoultryOutput = z.infer<typeof PoultryOutputSchema>;
