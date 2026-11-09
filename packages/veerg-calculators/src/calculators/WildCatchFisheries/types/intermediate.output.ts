import { ActivityNetOutputSchema } from '@/calculators/types/activity-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { intermediateEmissionsOutput } from '@/types/schemas';
import { WildCatchFisheriesIntensitiesOutputSchema } from './intensities.output';
import { WildCatchFisheriesScope1OutputSchema } from './scope1.output';
import { WildCatchFisheriesScope3OutputSchema } from './scope3.output';
import { z } from 'zod';

export const WildCatchFisheriesIntermediateOutputSchema =
  intermediateEmissionsOutput('Wild Catch Fisheries', {
    scope1: WildCatchFisheriesScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: WildCatchFisheriesScope3OutputSchema,
    net: ActivityNetOutputSchema,
    intensities: WildCatchFisheriesIntensitiesOutputSchema,
  });

export type WildCatchFisheriesIntermediateOutput = z.infer<
  typeof WildCatchFisheriesIntermediateOutputSchema
>;
