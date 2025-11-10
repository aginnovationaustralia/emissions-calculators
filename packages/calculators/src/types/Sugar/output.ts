import { z } from 'zod';
import { emissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationOutputSchema } from '../sequestration.output';
import { SugarIntensitiesOutputSchema } from './intensities.output';
import { SugarIntermediateOutputSchema } from './intermediate.output';
import { SugarNetOutputSchema } from './net.output';
import { SugarScope1OutputSchema } from './scope1.output';
import { SugarScope3OutputSchema } from './scope3.output';

export const SugarOutputSchema = emissionsOutput('Sugar', {
  scope1: SugarScope1OutputSchema,
  scope2: Scope2OutputSchema,
  scope3: SugarScope3OutputSchema,
  carbonSequestration: SequestrationOutputSchema,
  intermediate: z.array(SugarIntermediateOutputSchema),
  net: SugarNetOutputSchema,
  intensities: z.array(SugarIntensitiesOutputSchema).meta({
    description:
      'Emissions intensity for each crop (in order), in t-CO2e/t crop',
  }),
});

export type SugarOutput = z.infer<typeof SugarOutputSchema>;
