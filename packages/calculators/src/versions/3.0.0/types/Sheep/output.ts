import { z } from 'zod';
import { emissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationOutputSchema } from '../sequestration.output';
import { SheepEmissionsIntensitiesSchema } from './intensities.output';
import { SheepIntermediateOutputSchema } from './intermediate.output';
import { SheepNetSchema } from './net.output';
import { SheepScope1OutputSchema } from './scope1.output';
import { SheepScope3OutputSchema } from './scope3.output';

export const SheepOutputSchema = emissionsOutput('Sheep', {
  scope1: SheepScope1OutputSchema,
  scope2: Scope2OutputSchema,
  scope3: SheepScope3OutputSchema,
  carbonSequestration: SequestrationOutputSchema,
  intermediate: z.array(SheepIntermediateOutputSchema),
  net: SheepNetSchema,
  intensities: SheepEmissionsIntensitiesSchema,
});

export type SheepOutput = z.infer<typeof SheepOutputSchema>;
