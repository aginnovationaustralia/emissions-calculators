import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { DESCRIPTIONS } from '../descriptions.schema';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationTotalOutputSchema } from '../sequestration.total.output';
import { HorticultureIntensitiesOutputSchema } from './intensities.output';
import { HorticultureScope1OutputSchema } from './scope1.output';
import { HorticultureScope3OutputSchema } from './scope3.output';

export const HorticultureIntermediateOutputSchema = z
  .object({
    id: z.string().meta({ description: DESCRIPTIONS.ACTIVITY_ID }),
    scope1: HorticultureScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: HorticultureScope3OutputSchema,
    intensitiesWithSequestration: HorticultureIntensitiesOutputSchema,
    net: NetOutputSchema,
    carbonSequestration: SequestrationTotalOutputSchema,
  })
  .meta({
    description:
      'Intermediate emissions calculation output for the Horticulture calculator',
  });

export type HorticultureIntermediateOutput = z.infer<
  typeof HorticultureIntermediateOutputSchema
>;
