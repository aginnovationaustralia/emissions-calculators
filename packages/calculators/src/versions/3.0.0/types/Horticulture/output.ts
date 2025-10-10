import { z } from 'zod';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationOutputSchema } from '../sequestration.output';
import { HorticultureIntensitiesOutputSchema } from './intensities.output';
import { HorticultureIntermediateOutputSchema } from './intermediate.output';
import { HorticultureNetOutputSchema } from './net.output';
import { HorticultureScope1OutputSchema } from './scope1.output';
import { HorticultureScope3OutputSchema } from './scope3.output';

export const HorticultureOutputSchema = z
  .object({
    scope1: HorticultureScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: HorticultureScope3OutputSchema,
    carbonSequestration: SequestrationOutputSchema,
    intermediate: z.array(HorticultureIntermediateOutputSchema),
    net: HorticultureNetOutputSchema,
    intensities: z.array(HorticultureIntensitiesOutputSchema).meta({
      description: 'Emissions intensity for each crop (in order)',
    }),
  })
  .meta({
    description:
      'Emissions calculation output for the `horticulture` calculator',
  });

export type HorticultureOutput = z.infer<typeof HorticultureOutputSchema>;
