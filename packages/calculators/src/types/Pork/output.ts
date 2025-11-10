import { z } from 'zod';
import { emissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationOutputSchema } from '../sequestration.output';
import { PorkEmissionsIntensitiesSchema } from './intensities.output';
import { PorkIntermediateOutputSchema } from './intermediate.output';
import { PorkNetOutputSchema } from './net.output';
import { PorkScope1OutputSchema } from './scope1.output';
import { PorkScope3OutputSchema } from './scope3.output';

export const PorkOutputSchema = emissionsOutput('Pork', {
  scope1: PorkScope1OutputSchema,
  scope2: Scope2OutputSchema,
  scope3: PorkScope3OutputSchema,
  carbonSequestration: SequestrationOutputSchema,
  net: PorkNetOutputSchema,
  intensities: PorkEmissionsIntensitiesSchema,
  intermediate: z.array(PorkIntermediateOutputSchema),
});

export type PorkOutput = z.infer<typeof PorkOutputSchema>;
