import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { intermediateEmissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { BeefEmissionsIntensitiesSchema } from './intensities.output';
import { BeefScope1OutputSchema } from './scope1.output';
import { BeefScope3OutputSchema } from './scope3.output';

export const BeefIntermediateOutputSchema = intermediateEmissionsOutput(
  'Beef',
  {
    scope1: BeefScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: BeefScope3OutputSchema,
    intensities: BeefEmissionsIntensitiesSchema,
    net: NetOutputSchema,
  },
);

export type BeefIntermediateOutput = z.infer<
  typeof BeefIntermediateOutputSchema
>;
