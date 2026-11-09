import { EnterpriseNetOutputSchema } from '@/calculators/types/enterprise-net.output';
import { emissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { Scope2OutputSchema } from '../../types/scope2.output';
import { PigsIntensitiesOutputSchema } from './intensities.output';
import { PigsIntermediateOutputSchema } from './intermediate.output';
import { PigsScope1OutputSchemaPlusLULUCF } from './scope1.output';
import { PigsScope3OutputSchema } from './scope3.output';

export const PigsOutputSchema = emissionsOutput('Pigs', {
  scope1: PigsScope1OutputSchemaPlusLULUCF,
  scope2: Scope2OutputSchema,
  scope3: PigsScope3OutputSchema,
  intermediate: z.array(PigsIntermediateOutputSchema),
  net: EnterpriseNetOutputSchema,
  intensities: PigsIntensitiesOutputSchema,
});

export type PigsOutput = z.infer<typeof PigsOutputSchema>;
