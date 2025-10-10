import { z } from 'zod';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationOutputSchema } from '../sequestration.output';
import { VineyardIntensitiesOutputSchema } from './intensities.output';
import { VineyardIntermediateOutputSchema } from './intermediate.output';
import { VineyardNetOutputSchema } from './net.output';
import { VineyardScope1OutputSchema } from './scope1.output';
import { VineyardScope3OutputSchema } from './scope3.output';

export const VineyardOutputSchema = z
  .object({
    scope1: VineyardScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: VineyardScope3OutputSchema,
    carbonSequestration: SequestrationOutputSchema,
    intermediate: z.array(VineyardIntermediateOutputSchema),
    net: VineyardNetOutputSchema,
    intensities: z.array(VineyardIntensitiesOutputSchema).meta({
      description:
        'Emissions intensity for each vineyard (in order), in t-CO2e/t yield',
    }),
  })
  .meta({
    description: 'Emissions calculation output for the `vineyard` calculator',
  });

export type VineyardOutput = z.infer<typeof VineyardOutputSchema>;
