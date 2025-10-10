import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationTotalOutputSchema } from '../sequestration.total.output';
import { DeerEmissionsIntensitiesSchema } from './intensities.output';
import { DeerNetOutputSchema } from './net.output';
import { DeerScope1OutputSchema } from './scope1.output';
import { DeerScope3OutputSchema } from './scope3.output';

export const DeerIntermediateOutputSchema = z
  .object({
    id: z.string().meta({ description: DESCRIPTIONS.ACTIVITY_ID }),
    scope1: DeerScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: DeerScope3OutputSchema,
    net: DeerNetOutputSchema,
    intensities: DeerEmissionsIntensitiesSchema,
    carbonSequestration: SequestrationTotalOutputSchema,
  })
  .meta({
    description:
      'Intermediate emissions calculation output for the Deer calculator',
  });

export type DeerIntermediateOutput = z.infer<
  typeof DeerIntermediateOutputSchema
>;
