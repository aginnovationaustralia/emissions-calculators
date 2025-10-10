import { z } from 'zod';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationOutputSchema } from '../sequestration.output';
import { DeerEmissionsIntensitiesSchema } from './intensities.output';
import { DeerIntermediateOutputSchema } from './intermediate.output';
import { DeerNetOutputSchema } from './net.output';
import { DeerScope1OutputSchema } from './scope1.output';
import { DeerScope3OutputSchema } from './scope3.output';

export const DeerOutputSchema = z
  .object({
    scope1: DeerScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: DeerScope3OutputSchema,
    carbonSequestration: SequestrationOutputSchema,
    net: DeerNetOutputSchema,
    intensities: DeerEmissionsIntensitiesSchema,
    intermediate: z.array(DeerIntermediateOutputSchema),
  })
  .meta({
    description: 'Emissions calculation output for the `deer` calculator',
  });

export type DeerOutput = z.infer<typeof DeerOutputSchema>;
