import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { DESCRIPTIONS, OUTPUTDESCRIPTIONS } from '../descriptions.schema';
import { Scope2OutputSchema } from '../scope2.output';
import { SugarIntensitiesOutputSchema } from './intensities.output';
import { SugarScope1OutputSchema } from './scope1.output';
import { SugarScope3OutputSchema } from './scope3.output';

export const SugarIntermediateOutputSchema = z
  .object({
    id: z.string().meta({ description: DESCRIPTIONS.ACTIVITY_ID }),
    scope1: SugarScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: SugarScope3OutputSchema,
    carbonSequestration: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.sequestration }),
    intensities: SugarIntensitiesOutputSchema,
    net: NetOutputSchema,
  })
  .meta({
    description:
      'Intermediate emissions calculation output for the Sugar calculator',
  });

export type SugarIntermediateOutput = z.infer<
  typeof SugarIntermediateOutputSchema
>;
