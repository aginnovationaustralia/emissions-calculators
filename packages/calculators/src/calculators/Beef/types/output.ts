import { EnterpriseNetOutputSchema } from '@/calculators/types/enterprise-net.output';
import { emissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { Scope2OutputSchema } from '../../types/scope2.output';
import { BeefIntensitiesOutputSchema } from './intensities.output';
import { BeefIntermediateOutputSchema } from './intermediate.output';
import { BeefScope1OutputSchemaPlusLULUCF } from './scope1.output';
import { BeefScope3OutputSchema } from './scope3.output';

export const BeefOutputSchema = emissionsOutput('Beef', {
  scope1: BeefScope1OutputSchemaPlusLULUCF,
  scope2: Scope2OutputSchema,
  scope3: BeefScope3OutputSchema,
  intermediate: z.array(BeefIntermediateOutputSchema),
  net: EnterpriseNetOutputSchema,
  intensities: BeefIntensitiesOutputSchema,
});

export type BeefOutput = z.infer<typeof BeefOutputSchema>;
