import { z } from 'zod';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationOutputSchema } from '../sequestration.output';
import { RiceEmissionsIntensitiesSchema } from './intensities.output';
import { RiceIntermediateOutputSchema } from './intermediate.output';
import { RiceNetOutputSchema } from './net.output';
import { RiceScope1OutputSchema } from './scope1.output';
import { RiceScope3OutputSchema } from './scope3.output';

export const RiceOutputSchema = z
  .object({
    scope1: RiceScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: RiceScope3OutputSchema,
    carbonSequestration: SequestrationOutputSchema,
    intermediate: z.array(RiceIntermediateOutputSchema),
    net: RiceNetOutputSchema,
    intensities: RiceEmissionsIntensitiesSchema.meta({
      description: 'Emissions intensities for the crop',
    }),
  })
  .meta({
    description: 'Emissions calculation output for the `rice` calculator',
  });

export type RiceOutput = z.infer<typeof RiceOutputSchema>;
