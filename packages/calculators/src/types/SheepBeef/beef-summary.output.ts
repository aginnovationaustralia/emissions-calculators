import { z } from 'zod';
import { BeefEmissionsIntensitiesSchema } from '../Beef/intensities.output';
import { NetOutputSchema } from '../common/net.output';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationTotalOutputSchema } from '../sequestration.total.output';
import { SheepBeefScope1OutputSchema } from './scope1.output';
import { SheepBeefScope3OutputSchema } from './scope3.output';

export const BeefSummaryOutputSchema = z.object({
  scope1: SheepBeefScope1OutputSchema,
  scope2: Scope2OutputSchema,
  scope3: SheepBeefScope3OutputSchema,
  carbonSequestration: SequestrationTotalOutputSchema,
  net: NetOutputSchema,
  intensities: BeefEmissionsIntensitiesSchema,
});

export type BeefSummaryOutput = z.infer<typeof BeefSummaryOutputSchema>;
