import { ActivityNetOutputSchema } from '@/calculators/types/activity-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { intermediateEmissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { OtherLivestockIntermediateIntensitiesOutputSchema } from './intermediate-intensities.output';
import { OtherLivestockScope1OutputSchema } from './scope1.output';
import { OtherLivestockScope3OutputSchema } from './scope3.output';

export const OtherLivestockIntermediateOutputSchema =
  intermediateEmissionsOutput('OtherLivestock', {
    scope1: OtherLivestockScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: OtherLivestockScope3OutputSchema,
    net: ActivityNetOutputSchema,
    intensities: OtherLivestockIntermediateIntensitiesOutputSchema,
  });

export type OtherLivestockIntermediateOutput = z.infer<
  typeof OtherLivestockIntermediateOutputSchema
>;
