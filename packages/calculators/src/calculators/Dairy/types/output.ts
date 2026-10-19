import { EnterpriseNetOutputSchema } from '@/calculators/types/enterprise-net.output';
import { emissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { Scope2OutputSchema } from '../../types/scope2.output';
import { DairyIntensitiesOutputSchema } from './intensities.output';
import { DairyIntermediateOutputSchema } from './intermediate.output';
import { DairyScope1OutputSchemaPlusLULUCF } from './scope1.output';
import { DairyScope3OutputSchema } from './scope3.output';

export const DairyOutputSchema = emissionsOutput('Dairy', {
  scope1: DairyScope1OutputSchemaPlusLULUCF,
  scope2: Scope2OutputSchema,
  scope3: DairyScope3OutputSchema,
  intermediate: z.array(DairyIntermediateOutputSchema),
  net: EnterpriseNetOutputSchema,
  intensities: DairyIntensitiesOutputSchema,
});

export type DairyOutput = z.infer<typeof DairyOutputSchema>;
