import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { DESCRIPTIONS, OUTPUTDESCRIPTIONS } from '../descriptions.schema';
import { Scope2OutputSchema } from '../scope2.output';
import { BeefEmissionsIntensitiesSchema } from './intensities.output';
import { BeefScope1OutputSchema } from './scope1.output';
import { BeefScope3OutputSchema } from './scope3.output';

export const BeefIntermediateOutputSchema = z
  .object({
    id: z.string().meta({ description: DESCRIPTIONS.ACTIVITY_ID }),
    scope1: BeefScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: BeefScope3OutputSchema,
    carbonSequestration: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.sequestration }),
    intensities: BeefEmissionsIntensitiesSchema,
    net: NetOutputSchema,
  })
  .meta({
    description:
      'Intermediate emissions calculation output for the Beef calculator',
  });

export type BeefIntermediateOutput = z.infer<
  typeof BeefIntermediateOutputSchema
>;
