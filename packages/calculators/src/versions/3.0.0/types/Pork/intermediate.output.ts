import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';
import { intermediateEmissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { PorkEmissionsIntensitiesSchema } from './intensities.output';
import { PorkNetOutputSchema } from './net.output';
import { PorkScope1OutputSchema } from './scope1.output';
import { PorkScope3OutputSchema } from './scope3.output';

export const PorkIntermediateOutputSchema = intermediateEmissionsOutput(
  'Pork',
  {
    id: z.string(),
    scope1: PorkScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: PorkScope3OutputSchema,
    carbonSequestration: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.sequestration }),
    net: PorkNetOutputSchema,
    intensities: PorkEmissionsIntensitiesSchema,
  },
);

export type PorkIntermediateOutput = z.infer<
  typeof PorkIntermediateOutputSchema
>;
