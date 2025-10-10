import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { DESCRIPTIONS } from '../descriptions.schema';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationTotalOutputSchema } from '../sequestration.total.output';
import { GrainsIntensitiesOutputSchema } from './intensities.output';
import { GrainsScope1OutputSchema } from './scope1.output';
import { GrainsScope3OutputSchema } from './scope3.output';

export const GrainsIntermediateOutputSchema = z
  .object({
    id: z.string().meta({ description: DESCRIPTIONS.ACTIVITY_ID }),
    scope1: GrainsScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: GrainsScope3OutputSchema,
    intensitiesWithSequestration: GrainsIntensitiesOutputSchema,
    net: NetOutputSchema,
    carbonSequestration: SequestrationTotalOutputSchema,
  })
  .meta({
    description:
      'Intermediate emissions calculation output for the Grains calculator',
  });

export type GrainsIntermediateOutput = z.infer<
  typeof GrainsIntermediateOutputSchema
>;
