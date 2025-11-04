import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';
import { intermediateEmissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { VineyardIntensitiesOutputSchema } from './intensities.output';
import { VineyardScope1OutputSchema } from './scope1.output';
import { VineyardScope3OutputSchema } from './scope3.output';

export const VineyardIntermediateOutputSchema = intermediateEmissionsOutput(
  'Vineyard',
  {
    scope1: VineyardScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: VineyardScope3OutputSchema,
    carbonSequestration: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.sequestration }),
    intensities: VineyardIntensitiesOutputSchema,
    net: NetOutputSchema,
  },
);

export type VineyardIntermediateOutput = z.infer<
  typeof VineyardIntermediateOutputSchema
>;
