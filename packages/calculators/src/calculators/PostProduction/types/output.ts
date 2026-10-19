import { EnterpriseNetOutputSchema } from '@/calculators/types/enterprise-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { emissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { PostProductionIntensitiesOutputSchema } from './intensities.output';
import { PostProductionScope1OutputSchema } from './scope1.output';
import { PostProductionScope3OutputSchema } from './scope3.output';

export const PostProductionOutputSchema = emissionsOutput('PostProduction', {
  scope1: PostProductionScope1OutputSchema,
  scope2: Scope2OutputSchema,
  scope3: PostProductionScope3OutputSchema,
  net: EnterpriseNetOutputSchema,
  intensities: PostProductionIntensitiesOutputSchema,
});

export type PostProductionOutput = z.infer<typeof PostProductionOutputSchema>;
