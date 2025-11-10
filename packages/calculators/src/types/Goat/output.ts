import { z } from 'zod';
import { emissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationOutputSchema } from '../sequestration.output';
import { GoatEmissionsIntensitiesSchema } from './intensities.output';
import { GoatIntermediateOutputSchema } from './intermediate.output';
import { GoatNetOutputSchema } from './net.output';
import { GoatScope1OutputSchema } from './scope1.output';
import { GoatScope3OutputSchema } from './scope3.output';

export const GoatOutputSchema = emissionsOutput('Goat', {
  scope1: GoatScope1OutputSchema,
  scope2: Scope2OutputSchema,
  scope3: GoatScope3OutputSchema,
  carbonSequestration: SequestrationOutputSchema,
  net: GoatNetOutputSchema,
  intensities: GoatEmissionsIntensitiesSchema,
  intermediate: z.array(GoatIntermediateOutputSchema),
});

export type GoatOutput = z.infer<typeof GoatOutputSchema>;
