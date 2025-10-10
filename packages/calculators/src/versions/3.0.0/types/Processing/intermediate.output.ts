import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { DESCRIPTIONS, OUTPUTDESCRIPTIONS } from '../descriptions.schema';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationTotalOutputSchema } from '../sequestration.total.output';
import { ProcessingIntensitiesOutputSchema } from './intensities.output';
import { ProcessingScope1OutputSchema } from './scope1.output';
import { ProcessingScope3OutputSchema } from './scope3.output';

export const ProcessingIntermediateOutputSchema = z.object({
  id: z.string().meta({ description: DESCRIPTIONS.ACTIVITY_ID }),
  scope1: ProcessingScope1OutputSchema,
  scope2: Scope2OutputSchema,
  scope3: ProcessingScope3OutputSchema,
  carbonSequestration: SequestrationTotalOutputSchema.meta({
    description: OUTPUTDESCRIPTIONS.sequestration,
  }),
  intensities: ProcessingIntensitiesOutputSchema,
  net: NetOutputSchema,
});

export type ProcessingIntermediateOutput = z.infer<
  typeof ProcessingIntermediateOutputSchema
>;
