import { z } from 'zod';
import { BeefIntermediateOutputSchema } from '../Beef/intermediate.output';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationOutputSchema } from '../sequestration.output';
import { SheepIntermediateOutputSchema } from '../Sheep/intermediate.output';
import { SheepBeefEmissionsIntensitiesSchema } from './intensities.output';
import { SheepBeefIntermediateOutputSchema } from './intermediate.output';
import { SheepBeefNetSchema } from './net.output';
import { SheepBeefScope1OutputSchema } from './scope1.output';
import { SheepBeefScope3OutputSchema } from './scope3.output';

export const SheepBeefOutputSchema = z
  .object({
    scope1: SheepBeefScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: SheepBeefScope3OutputSchema,
    carbonSequestration: SequestrationOutputSchema,
    intermediate: SheepBeefIntermediateOutputSchema,
    intermediateBeef: z.array(BeefIntermediateOutputSchema),
    intermediateSheep: z.array(SheepIntermediateOutputSchema),
    net: SheepBeefNetSchema,
    intensities: SheepBeefEmissionsIntensitiesSchema,
  })
  .meta({
    description: 'Emissions calculation output for the `sheepbeef` calculator',
  });

export type SheepBeefOutput = z.infer<typeof SheepBeefOutputSchema>;
