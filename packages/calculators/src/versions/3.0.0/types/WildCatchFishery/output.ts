import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { PurchasedOffsetsOutputSchema } from '../purchasedOffsets.output';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationOutputSchema } from '../sequestration.output';
import { WildCatchFisheryIntensitiesOutputSchema } from './intensities.output';
import { WildCatchFisheryIntermediateOutputSchema } from './intermediate.output';
import { WildCatchFisheryScope1OutputSchema } from './scope1.output';
import { WildCatchFisheryScope3OutputSchema } from './scope3.output';

export const WildCatchFisheryOutputSchema = z
  .object({
    scope1: WildCatchFisheryScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: WildCatchFisheryScope3OutputSchema,
    purchasedOffsets: PurchasedOffsetsOutputSchema,
    net: NetOutputSchema,
    intensities: WildCatchFisheryIntensitiesOutputSchema,
    carbonSequestration: SequestrationOutputSchema,
    intermediate: z.array(WildCatchFisheryIntermediateOutputSchema),
  })
  .meta({
    description:
      'Emissions calculation output for the `wildcatchfishery` calculator',
  });

export type WildCatchFisheryOutput = z.infer<
  typeof WildCatchFisheryOutputSchema
>;
