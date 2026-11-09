import { EnterpriseNetOutputSchema } from '@/calculators/types/enterprise-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { emissionsOutput } from '@/types/schemas';
import { AquacultureIntensitiesOutputSchema } from './intensities.output';
import { AquacultureIntermediateOutputSchema } from './intermediate.output';
import { AquacultureScope1OutputSchema } from './scope1.output';
import { AquacultureScope3OutputSchema } from './scope3.output';
import z from 'zod';

export const AquacultureOutputSchema = emissionsOutput('Aquaculture', {
  scope1: AquacultureScope1OutputSchema,
  scope2: Scope2OutputSchema,
  scope3: AquacultureScope3OutputSchema,
  intermediate: z.array(AquacultureIntermediateOutputSchema),
  net: EnterpriseNetOutputSchema,
  intensities: AquacultureIntensitiesOutputSchema,
});

export type AquacultureOutput = z.infer<typeof AquacultureOutputSchema>;
