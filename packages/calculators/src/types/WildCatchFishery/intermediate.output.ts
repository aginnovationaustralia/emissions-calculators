import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { intermediateEmissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { WildCatchFisheryIntensitiesOutputSchema } from './intensities.output';
import { WildCatchFisheryScope1OutputSchema } from './scope1.output';
import { WildCatchFisheryScope3OutputSchema } from './scope3.output';

export const WildCatchFisheryIntermediateOutputSchema =
  intermediateEmissionsOutput('WildCatchFishery', {
    scope1: WildCatchFisheryScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: WildCatchFisheryScope3OutputSchema,
    intensities: WildCatchFisheryIntensitiesOutputSchema,
    net: NetOutputSchema,
  });

export type WildCatchFisheryIntermediateOutput = z.infer<
  typeof WildCatchFisheryIntermediateOutputSchema
>;
