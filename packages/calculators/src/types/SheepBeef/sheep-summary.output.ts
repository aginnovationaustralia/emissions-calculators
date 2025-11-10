import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';
import { Scope2OutputSchema } from '../scope2.output';
import { SheepEmissionsIntensitiesSchema } from '../Sheep/intensities.output';
import { SheepBeefScope1OutputSchema } from './scope1.output';
import { SheepBeefScope3OutputSchema } from './scope3.output';

export const SheepSummaryOutputSchema = z.object({
  scope1: SheepBeefScope1OutputSchema,
  scope2: Scope2OutputSchema,
  scope3: SheepBeefScope3OutputSchema,
  carbonSequestration: z
    .number()
    .meta({ description: OUTPUTDESCRIPTIONS.sequestration }),
  net: NetOutputSchema,
  intensities: SheepEmissionsIntensitiesSchema,
});

export type SheepSummaryOutput = z.infer<typeof SheepSummaryOutputSchema>;
