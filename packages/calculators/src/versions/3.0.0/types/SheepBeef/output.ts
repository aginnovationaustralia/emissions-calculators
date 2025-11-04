import { z } from 'zod';
import { BeefIntermediateOutputSchema } from '../Beef/intermediate.output';
import { emissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationOutputSchema } from '../sequestration.output';
import { SheepIntermediateOutputSchema } from '../Sheep/intermediate.output';
import { SheepBeefEmissionsIntensitiesSchema } from './intensities.output';
import { SheepBeefIntermediateOutputSchema } from './intermediate.output';
import { SheepBeefNetSchema } from './net.output';
import { SheepBeefScope1OutputSchema } from './scope1.output';
import { SheepBeefScope3OutputSchema } from './scope3.output';

export const SheepBeefOutputSchema = emissionsOutput('SheepBeef', {
  scope1: SheepBeefScope1OutputSchema,
  scope2: Scope2OutputSchema,
  scope3: SheepBeefScope3OutputSchema,
  carbonSequestration: SequestrationOutputSchema,
  intermediate: SheepBeefIntermediateOutputSchema,
  intermediateBeef: z.array(BeefIntermediateOutputSchema),
  intermediateSheep: z.array(SheepIntermediateOutputSchema),
  net: SheepBeefNetSchema,
  intensities: SheepBeefEmissionsIntensitiesSchema,
});

export type SheepBeefOutput = z.infer<typeof SheepBeefOutputSchema>;
