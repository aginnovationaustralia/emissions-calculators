import { EnterpriseNetOutputSchema } from '@/calculators/types/enterprise-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { object } from '@/types/schemas';
import { WildCatchFisheriesIntensitiesOutputSchema } from './intensities.output';
import { WildCatchFisheriesIntermediateOutputSchema } from './intermediate.output';
import { WildCatchFisheriesScope1OutputSchema } from './scope1.output';
import { WildCatchFisheriesScope3OutputSchema } from './scope3.output';
import z from 'zod';

export const WildCatchFisheriesOutputSchema = object({
  scope1: WildCatchFisheriesScope1OutputSchema,
  scope2: Scope2OutputSchema,
  scope3: WildCatchFisheriesScope3OutputSchema,
  intermediate: z.array(WildCatchFisheriesIntermediateOutputSchema),
  net: EnterpriseNetOutputSchema,
  intensities: WildCatchFisheriesIntensitiesOutputSchema,
});

export type WildCatchFisheriesOutput = z.infer<
  typeof WildCatchFisheriesOutputSchema
>;
