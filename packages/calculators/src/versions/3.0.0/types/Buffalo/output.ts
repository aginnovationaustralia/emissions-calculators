import { z } from 'zod';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationOutputSchema } from '../sequestration.output';
import { BuffaloEmissionsIntensitiesSchema } from './intensities.output';
import { BuffaloIntermediateOutputSchema } from './intermediate.output';
import { BuffaloNetOutputSchema } from './net.output';
import { BuffaloScope1OutputSchema } from './scope1.output';
import { BuffaloScope3OutputSchema } from './scope3.output';

export const BuffaloOutputSchema = z
  .object({
    scope1: BuffaloScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: BuffaloScope3OutputSchema,
    carbonSequestration: SequestrationOutputSchema,
    net: BuffaloNetOutputSchema,
    intensities: BuffaloEmissionsIntensitiesSchema,
    intermediate: z.array(BuffaloIntermediateOutputSchema),
  })
  .meta({
    description: 'Emissions calculation output for the `Buffalo` calculator',
  });

export type BuffaloOutput = z.infer<typeof BuffaloOutputSchema>;
