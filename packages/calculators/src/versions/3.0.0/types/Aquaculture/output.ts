import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { PurchasedOffsetsOutputSchema } from '../purchasedOffsets.output';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationOutputSchema } from '../sequestration.output';
import { AquacultureIntensitiesOutputSchema } from './intensities.output';
import { AquacultureIntermediateOutputSchema } from './intermediate.output';
import { AquacultureScope1OutputSchema } from './scope1.output';
import { AquacultureScope3OutputSchema } from './scope3.output';

export const AquacultureOutputSchema = z
  .object({
    scope1: AquacultureScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: AquacultureScope3OutputSchema,
    purchasedOffsets: PurchasedOffsetsOutputSchema,
    net: NetOutputSchema,
    intensities: AquacultureIntensitiesOutputSchema,
    carbonSequestration: SequestrationOutputSchema,
    intermediate: z.array(AquacultureIntermediateOutputSchema),
  })
  .meta({
    description:
      'Emissions calculation output for the `aquaculture` calculator',
  });

export type AquacultureOutput = z.infer<typeof AquacultureOutputSchema>;
