import { z } from 'zod';
import { intermediateEmissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { BuffaloEmissionsIntensitiesSchema } from './intensities.output';
import { BuffaloNetOutputSchema } from './net.output';
import { BuffaloScope1OutputSchema } from './scope1.output';
import { BuffaloScope3OutputSchema } from './scope3.output';

export const BuffaloIntermediateOutputSchema = intermediateEmissionsOutput(
  'Buffalo',
  {
    scope1: BuffaloScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: BuffaloScope3OutputSchema,
    net: BuffaloNetOutputSchema,
    intensities: BuffaloEmissionsIntensitiesSchema,
  },
);

export type BuffaloIntermediateOutput = z.infer<
  typeof BuffaloIntermediateOutputSchema
>;
