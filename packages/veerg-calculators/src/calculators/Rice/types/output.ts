import { EnterpriseNetOutputSchema } from '@/calculators/types/enterprise-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { emissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { RiceIntensitiesOutputSchema } from './intensities.output';
import { RiceIntermediateOutputSchema } from './intermediate.output';
import { RiceScope1OutputSchemaPlusLULUCF } from './scope1.output';
import { RiceScope3OutputSchema } from './scope3.output';

export const RiceOutputSchema = emissionsOutput('Rice', {
  scope1: RiceScope1OutputSchemaPlusLULUCF,
  scope2: Scope2OutputSchema,
  scope3: RiceScope3OutputSchema,
  intermediate: z.array(RiceIntermediateOutputSchema),
  net: EnterpriseNetOutputSchema,
  intensities: RiceIntensitiesOutputSchema,
});

export type RiceOutput = z.infer<typeof RiceOutputSchema>;
