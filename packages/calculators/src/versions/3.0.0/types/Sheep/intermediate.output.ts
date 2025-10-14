import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { DESCRIPTIONS, OUTPUTDESCRIPTIONS } from '../descriptions.schema';
import { Scope2OutputSchema } from '../scope2.output';
import { SheepEmissionsIntensitiesSchema } from './intensities.output';
import { SheepScope1OutputSchema } from './scope1.output';
import { SheepScope3OutputSchema } from './scope3.output';

export const SheepIntermediateOutputSchema = z.object({
  id: z.string().meta({ description: DESCRIPTIONS.ACTIVITY_ID }),
  scope1: SheepScope1OutputSchema,
  scope2: Scope2OutputSchema,
  scope3: SheepScope3OutputSchema,
  carbonSequestration: z
    .number()
    .meta({ description: OUTPUTDESCRIPTIONS.sequestration }),
  intensities: SheepEmissionsIntensitiesSchema,
  net: NetOutputSchema,
});

export type SheepIntermediateOutput = z.infer<
  typeof SheepIntermediateOutputSchema
>;
