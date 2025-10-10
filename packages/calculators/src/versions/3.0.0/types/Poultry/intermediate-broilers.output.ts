import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationTotalOutputSchema } from '../sequestration.total.output';
import { PoultryEmissionsIntensitiesBroilerSchema } from './intensities-broiler.output';
import { PoultryScope1OutputSchema } from './scope1.output';
import { PoultryScope3OutputSchema } from './scope3.output';

export const PoultryIntermediateBroilersOutputSchema = z.object({
  id: z.string(),
  scope1: PoultryScope1OutputSchema,
  scope2: Scope2OutputSchema,
  scope3: PoultryScope3OutputSchema,
  carbonSequestration: SequestrationTotalOutputSchema,
  intensities: PoultryEmissionsIntensitiesBroilerSchema,
  net: NetOutputSchema,
});

export type PoultryIntermediateBroilersOutput = z.infer<
  typeof PoultryIntermediateBroilersOutputSchema
>;
