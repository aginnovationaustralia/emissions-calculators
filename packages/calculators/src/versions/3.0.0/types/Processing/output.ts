import { z } from 'zod';
import { PurchasedOffsetsOutputSchema } from '../purchasedOffsets.output';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationOutputSchema } from '../sequestration.output';
import { ProcessingIntensitiesOutputSchema } from './intensities.output';
import { ProcessingIntermediateOutputSchema } from './intermediate.output';
import { ProcessingNetOutputSchema } from './net.output';
import { ProcessingScope1OutputSchema } from './scope1.output';
import { ProcessingScope3OutputSchema } from './scope3.output';

export const ProcessingOutputSchema = z
  .object({
    scope1: ProcessingScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: ProcessingScope3OutputSchema,
    purchasedOffsets: PurchasedOffsetsOutputSchema,
    net: ProcessingNetOutputSchema,
    intensities: z.array(ProcessingIntensitiesOutputSchema),
    carbonSequestration: SequestrationOutputSchema,
    intermediate: z.array(ProcessingIntermediateOutputSchema),
  })
  .meta({
    description: 'Emissions calculation output for the `processing` calculator',
  });

export type ProcessingOutput = z.infer<typeof ProcessingOutputSchema>;
