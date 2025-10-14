import { z } from 'zod';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationOutputSchema } from '../sequestration.output';
import { BeefEmissionsIntensitiesSchema } from './intensities.output';
import { BeefIntermediateOutputSchema } from './intermediate.output';
import { BeefNetSchema } from './net.output';
import { BeefScope1OutputSchema } from './scope1.output';
import { BeefScope3OutputSchema } from './scope3.output';

export const BeefOutputSchema = z
  .object({
    scope1: BeefScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: BeefScope3OutputSchema,
    carbonSequestration: SequestrationOutputSchema,
    intermediate: z.array(BeefIntermediateOutputSchema),
    net: BeefNetSchema,
    intensities: BeefEmissionsIntensitiesSchema,
  })
  .meta({
    description: 'Emissions calculation output for the `beef` calculator',
  });

export type BeefOutput = z.infer<typeof BeefOutputSchema>;
