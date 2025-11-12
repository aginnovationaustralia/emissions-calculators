import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { intermediateEmissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { HorticultureIntensitiesOutputSchema } from './intensities.output';
import { HorticultureScope1OutputSchema } from './scope1.output';
import { HorticultureScope3OutputSchema } from './scope3.output';

export const HorticultureIntermediateOutputSchema = intermediateEmissionsOutput(
  'Horticulture',
  {
    scope1: HorticultureScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: HorticultureScope3OutputSchema,
    intensitiesWithSequestration: HorticultureIntensitiesOutputSchema,
    net: NetOutputSchema,
  },
);

export type HorticultureIntermediateOutput = z.infer<
  typeof HorticultureIntermediateOutputSchema
>;
