import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { intermediateEmissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationTotalOutputSchema } from '../sequestration.total.output';
import { GoatEmissionsIntensitiesSchema } from './intensities.output';
import { GoatNetOutputSchema } from './net.output';
import { GoatScope1OutputSchema } from './scope1.output';
import { GoatScope3OutputSchema } from './scope3.output';

export const GoatIntermediateOutputSchema = intermediateEmissionsOutput(
  'Goat',
  {
    id: z.string().meta({ description: DESCRIPTIONS.ACTIVITY_ID }),
    scope1: GoatScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: GoatScope3OutputSchema,
    net: GoatNetOutputSchema,
    intensities: GoatEmissionsIntensitiesSchema,
    carbonSequestration: SequestrationTotalOutputSchema,
  },
);

export type GoatIntermediateOutput = z.infer<
  typeof GoatIntermediateOutputSchema
>;
