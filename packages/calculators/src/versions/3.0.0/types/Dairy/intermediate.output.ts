import { z } from 'zod';
import { intermediateEmissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationTotalOutputSchema } from '../sequestration.total.output';
import { DairyEmissionsIntensitiesSchema } from './intensities.output';
import { DairyNetSchema } from './net.output';
import { DairyScope1OutputSchema } from './scope1.output';
import { DairyScope3OutputSchema } from './scope3.output';

export const DairyIntermediateOutputSchema = intermediateEmissionsOutput(
  'Dairy',
  {
    scope1: DairyScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: DairyScope3OutputSchema,
    net: DairyNetSchema,
    intensities: DairyEmissionsIntensitiesSchema,
    carbonSequestration: SequestrationTotalOutputSchema,
  },
);

export type DairyIntermediateOutput = z.infer<
  typeof DairyIntermediateOutputSchema
>;
