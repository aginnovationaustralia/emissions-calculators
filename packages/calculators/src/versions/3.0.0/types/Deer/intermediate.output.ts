import { z } from 'zod';
import { intermediateEmissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationTotalOutputSchema } from '../sequestration.total.output';
import { DeerEmissionsIntensitiesSchema } from './intensities.output';
import { DeerNetOutputSchema } from './net.output';
import { DeerScope1OutputSchema } from './scope1.output';
import { DeerScope3OutputSchema } from './scope3.output';

export const DeerIntermediateOutputSchema = intermediateEmissionsOutput(
  'Deer',
  {
    scope1: DeerScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: DeerScope3OutputSchema,
    net: DeerNetOutputSchema,
    intensities: DeerEmissionsIntensitiesSchema,
    carbonSequestration: SequestrationTotalOutputSchema,
  },
);

export type DeerIntermediateOutput = z.infer<
  typeof DeerIntermediateOutputSchema
>;
