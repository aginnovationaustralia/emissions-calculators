import { z } from 'zod';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationOutputSchema } from '../sequestration.output';
import { SheepEmissionsIntensitiesSchema } from './intensities.output';
import { SheepIntermediateOutputSchema } from './intermediate.output';
import { SheepNetSchema } from './net.output';
import { SheepScope1OutputSchema } from './scope1.output';
import { SheepScope3OutputSchema } from './scope3.output';

export const SheepOutputSchema = z
  .object({
    scope1: SheepScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: SheepScope3OutputSchema,
    carbonSequestration: SequestrationOutputSchema,
    intermediate: z.array(SheepIntermediateOutputSchema),
    net: SheepNetSchema,
    intensities: SheepEmissionsIntensitiesSchema,
  })
  .meta({
    description: 'Emissions calculation output for the `sheep` calculator',
  });

export type SheepOutput = z.infer<typeof SheepOutputSchema>;
