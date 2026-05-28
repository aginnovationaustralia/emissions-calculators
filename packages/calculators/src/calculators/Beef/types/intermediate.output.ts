import { intermediateEmissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { BeefIntensitiesOutputSchema } from './intensities.output';
import { NetOutputSchema } from './net.output';
import { BeefScope1OutputSchema } from './scope1.output';
import { BeefScope2OutputSchema } from './scope2.output';
import { BeefScope3OutputSchema } from './scope3.output';

export const BeefIntermediateOutputSchema = intermediateEmissionsOutput(
  'Beef',
  {
    scope1: BeefScope1OutputSchema,
    scope2: BeefScope2OutputSchema,
    scope3: BeefScope3OutputSchema,
    net: NetOutputSchema,
    intensities: BeefIntensitiesOutputSchema,
  },
);

export type BeefIntermediateOutput = z.infer<
  typeof BeefIntermediateOutputSchema
>;
