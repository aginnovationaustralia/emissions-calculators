import { z } from 'zod';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationOutputSchema } from '../sequestration.output';
import { CottonIntensitiesOutputSchema } from './intensities.output';
import { CottonIntermediateOutputSchema } from './intermediate.output';
import { CottonNetOutputSchema } from './net.output';
import { CottonScope1OutputSchema } from './scope1.output';
import { CottonScope3OutputSchema } from './scope3.output';

export const CottonOutputSchema = z
  .object({
    scope1: CottonScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: CottonScope3OutputSchema,
    carbonSequestration: SequestrationOutputSchema,
    intermediate: z.array(CottonIntermediateOutputSchema),
    net: CottonNetOutputSchema,
    intensities: z
      .array(CottonIntensitiesOutputSchema)
      .meta({ description: 'Emissions intensity for each crop (in order)' }),
  })
  .meta({
    description: 'Emissions calculation output for the `cotton` calculator',
  });

export type CottonOutput = z.infer<typeof CottonOutputSchema>;
