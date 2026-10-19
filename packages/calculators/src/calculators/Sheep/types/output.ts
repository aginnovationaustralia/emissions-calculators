import { EnterpriseNetOutputSchema } from '@/calculators/types/enterprise-net.output';
import { emissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { Scope2OutputSchema } from '../../types/scope2.output';
import { SheepIntensitiesOutputSchema } from './intensities.output';
import { SheepIntermediateOutputSchema } from './intermediate.output';
import { SheepScope1OutputSchemaPlusLULUCF } from './scope1.output';
import { SheepScope3OutputSchema } from './scope3.output';

export const SheepOutputSchema = emissionsOutput('Sheep', {
  scope1: SheepScope1OutputSchemaPlusLULUCF,
  scope2: Scope2OutputSchema,
  scope3: SheepScope3OutputSchema,
  intermediate: z.array(SheepIntermediateOutputSchema),
  net: EnterpriseNetOutputSchema,
  intensities: SheepIntensitiesOutputSchema,
});

export type SheepOutput = z.infer<typeof SheepOutputSchema>;
