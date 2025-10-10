import { z } from 'zod';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationOutputSchema } from '../sequestration.output';
import { DairyEmissionsIntensitiesSchema } from './intensities.output';
import { DairyIntermediateOutputSchema } from './intermediate.output';
import { DairyNetSchema } from './net.output';
import { DairyScope1OutputSchema } from './scope1.output';
import { DairyScope3OutputSchema } from './scope3.output';

export const DairyOutputSchema = z
  .object({
    scope1: DairyScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: DairyScope3OutputSchema,
    carbonSequestration: SequestrationOutputSchema,
    net: DairyNetSchema,
    intensities: DairyEmissionsIntensitiesSchema,
    intermediate: z.array(DairyIntermediateOutputSchema),
  })
  .meta({
    description: 'Emissions calculation output for the `dairy` calculator',
  });

export type DairyOutput = z.infer<typeof DairyOutputSchema>;
