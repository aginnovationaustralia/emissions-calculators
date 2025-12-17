import { z } from 'zod';
import { emissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationOutputSchema } from '../sequestration.output';
import { PoultryEmissionsIntensitiesSchema } from './intensities.output';
import { PoultryIntermediateBroilersOutputSchema } from './intermediate-broilers.output';
import { PoultryIntermediateLayersOutputSchema } from './intermediate-layers.output';
import { PoultryNetSchema } from './net.output';
import { PoultryScope1OutputSchema } from './scope1.output';
import { PoultryScope3OutputSchema } from './scope3.output';

export const PoultryOutputSchema = emissionsOutput('Poultry', {
  scope1: PoultryScope1OutputSchema,
  scope2: Scope2OutputSchema,
  scope3: PoultryScope3OutputSchema,
  carbonSequestration: SequestrationOutputSchema,
  intermediateBroilers: z.array(PoultryIntermediateBroilersOutputSchema),
  intermediateLayers: z.array(PoultryIntermediateLayersOutputSchema),
  net: PoultryNetSchema,
  intensities: PoultryEmissionsIntensitiesSchema,
});

export type PoultryOutput = z.infer<typeof PoultryOutputSchema>;
