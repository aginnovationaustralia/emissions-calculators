import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { DESCRIPTIONS, OUTPUTDESCRIPTIONS } from '../descriptions.schema';
import { intermediateEmissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { SugarIntensitiesOutputSchema } from './intensities.output';
import { SugarScope1OutputSchema } from './scope1.output';
import { SugarScope3OutputSchema } from './scope3.output';

export const SugarIntermediateOutputSchema = intermediateEmissionsOutput(
  'Sugar',
  {
    id: z.string().meta({ description: DESCRIPTIONS.ACTIVITY_ID }),
    scope1: SugarScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: SugarScope3OutputSchema,
    carbonSequestration: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.sequestration }),
    intensities: SugarIntensitiesOutputSchema,
    net: NetOutputSchema,
  },
);

export type SugarIntermediateOutput = z.infer<
  typeof SugarIntermediateOutputSchema
>;
