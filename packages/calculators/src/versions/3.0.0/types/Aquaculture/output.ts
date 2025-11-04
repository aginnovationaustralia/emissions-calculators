import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { PurchasedOffsetsOutputSchema } from '../purchasedOffsets.output';
import { emissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationOutputSchema } from '../sequestration.output';
import { AquacultureIntensitiesOutputSchema } from './intensities.output';
import { AquacultureIntermediateOutputSchema } from './intermediate.output';
import { AquacultureScope1OutputSchema } from './scope1.output';
import { AquacultureScope3OutputSchema } from './scope3.output';

export const AquacultureOutputSchema = emissionsOutput('Aquaculture', {
  scope1: AquacultureScope1OutputSchema,
  scope2: Scope2OutputSchema,
  scope3: AquacultureScope3OutputSchema,
  purchasedOffsets: PurchasedOffsetsOutputSchema,
  net: NetOutputSchema,
  intensities: AquacultureIntensitiesOutputSchema,
  carbonSequestration: SequestrationOutputSchema,
  intermediate: z.array(AquacultureIntermediateOutputSchema),
});

export type AquacultureOutput = z.infer<typeof AquacultureOutputSchema>;
