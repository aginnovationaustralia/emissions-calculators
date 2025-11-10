import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';
import { intermediateEmissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { RiceEmissionsIntensitiesSchema } from './intensities.output';
import { RiceScope1OutputSchema } from './scope1.output';
import { RiceScope3OutputSchema } from './scope3.output';

export const RiceIntermediateOutputSchema = intermediateEmissionsOutput(
  'Rice',
  {
    scope1: RiceScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: RiceScope3OutputSchema,
    carbonSequestration: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.sequestration }),
    intensities: RiceEmissionsIntensitiesSchema,
    net: NetOutputSchema,
  },
);

export type RiceIntermediateOutput = z.infer<
  typeof RiceIntermediateOutputSchema
>;
