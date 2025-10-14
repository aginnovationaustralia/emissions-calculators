import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationTotalOutputSchema } from '../sequestration.total.output';
import { BuffaloEmissionsIntensitiesSchema } from './intensities.output';
import { BuffaloNetOutputSchema } from './net.output';
import { BuffaloScope1OutputSchema } from './scope1.output';
import { BuffaloScope3OutputSchema } from './scope3.output';

export const BuffaloIntermediateOutputSchema = z
  .object({
    id: z.string().meta({ description: DESCRIPTIONS.ACTIVITY_ID }),
    scope1: BuffaloScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: BuffaloScope3OutputSchema,
    net: BuffaloNetOutputSchema,
    intensities: BuffaloEmissionsIntensitiesSchema,
    carbonSequestration: SequestrationTotalOutputSchema,
  })
  .meta({
    description:
      'Intermediate emissions calculation output for the Buffalo calculator',
  });

export type BuffaloIntermediateOutput = z.infer<
  typeof BuffaloIntermediateOutputSchema
>;
