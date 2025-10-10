import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationTotalOutputSchema } from '../sequestration.total.output';
import { DairyEmissionsIntensitiesSchema } from './intensities.output';
import { DairyNetSchema } from './net.output';
import { DairyScope1OutputSchema } from './scope1.output';
import { DairyScope3OutputSchema } from './scope3.output';

export const DairyIntermediateOutputSchema = z
  .object({
    id: z.string().meta({ description: DESCRIPTIONS.ACTIVITY_ID }),
    scope1: DairyScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: DairyScope3OutputSchema,
    net: DairyNetSchema,
    intensities: DairyEmissionsIntensitiesSchema,
    carbonSequestration: SequestrationTotalOutputSchema,
  })
  .meta({
    description:
      'Intermediate emissions calculation output for the Dairy calculator',
  });

export type DairyIntermediateOutput = z.infer<
  typeof DairyIntermediateOutputSchema
>;
