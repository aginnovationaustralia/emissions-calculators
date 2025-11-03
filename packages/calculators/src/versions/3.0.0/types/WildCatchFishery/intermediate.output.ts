import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { DESCRIPTIONS } from '../descriptions.schema';
import { intermediateEmissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationTotalOutputSchema } from '../sequestration.total.output';
import { WildCatchFisheryIntensitiesOutputSchema } from './intensities.output';
import { WildCatchFisheryScope1OutputSchema } from './scope1.output';
import { WildCatchFisheryScope3OutputSchema } from './scope3.output';

export const WildCatchFisheryIntermediateOutputSchema =
  intermediateEmissionsOutput('WildCatchFishery', {
    id: z.string().meta({ description: DESCRIPTIONS.ACTIVITY_ID }),
    scope1: WildCatchFisheryScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: WildCatchFisheryScope3OutputSchema,
    intensities: WildCatchFisheryIntensitiesOutputSchema,
    net: NetOutputSchema,
    carbonSequestration: SequestrationTotalOutputSchema,
  });

export type WildCatchFisheryIntermediateOutput = z.infer<
  typeof WildCatchFisheryIntermediateOutputSchema
>;
