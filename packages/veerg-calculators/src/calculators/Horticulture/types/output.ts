import { EnterpriseNetOutputSchema } from '@/calculators/types/enterprise-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { emissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { HorticultureIntensitiesOutputSchema } from './intensities.output';
import { HorticultureIntermediateOutputSchema } from './intermediate.output';
import { HorticultureScope1OutputSchemaPlusLULUCF } from './scope1.output';
import { HorticultureScope3OutputSchema } from './scope3.output';

export const HorticultureOutputSchema = emissionsOutput('Horticulture', {
  scope1: HorticultureScope1OutputSchemaPlusLULUCF,
  scope2: Scope2OutputSchema,
  scope3: HorticultureScope3OutputSchema,
  intermediate: z.array(HorticultureIntermediateOutputSchema),
  net: EnterpriseNetOutputSchema,
  intensities: HorticultureIntensitiesOutputSchema,
});

export type HorticultureOutput = z.infer<typeof HorticultureOutputSchema>;
