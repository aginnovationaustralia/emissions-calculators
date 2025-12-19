import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { intermediateEmissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { ProcessingIntensitiesOutputSchema } from './intensities.output';
import { ProcessingScope1OutputSchema } from './scope1.output';
import { ProcessingScope3OutputSchema } from './scope3.output';

export const ProcessingIntermediateOutputSchema = intermediateEmissionsOutput(
  'Processing',
  {
    scope1: ProcessingScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: ProcessingScope3OutputSchema,
    intensities: ProcessingIntensitiesOutputSchema,
    net: NetOutputSchema,
  },
);

export type ProcessingIntermediateOutput = z.infer<
  typeof ProcessingIntermediateOutputSchema
>;
