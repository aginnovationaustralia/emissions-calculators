import { EnterpriseNetOutputSchema } from '@/calculators/types/enterprise-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { emissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { GrainsIntensitiesOutputSchema } from './intensities.output';
import { GrainsIntermediateOutputSchema } from './intermediate.output';
import { GrainsScope1OutputSchemaPlusLULUCF } from './scope1.output';
import { GrainsScope3OutputSchema } from './scope3.output';

export const GrainsOutputSchema = emissionsOutput('Grains', {
  scope1: GrainsScope1OutputSchemaPlusLULUCF,
  scope2: Scope2OutputSchema,
  scope3: GrainsScope3OutputSchema,
  intermediate: z.array(GrainsIntermediateOutputSchema),
  net: EnterpriseNetOutputSchema,
  intensities: GrainsIntensitiesOutputSchema,
});

export type GrainsOutput = z.infer<typeof GrainsOutputSchema>;
