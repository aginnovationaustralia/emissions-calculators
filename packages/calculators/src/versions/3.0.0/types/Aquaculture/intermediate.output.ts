import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { intermediateEmissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationTotalOutputSchema } from '../sequestration.total.output';
import { AquacultureIntensitiesOutputSchema } from './intensities.output';
import { AquacultureScope1OutputSchema } from './scope1.output';
import { AquacultureScope3OutputSchema } from './scope3.output';

export const AquacultureIntermediateOutputSchema = intermediateEmissionsOutput(
  'Aquaculture',
  {
    scope1: AquacultureScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: AquacultureScope3OutputSchema,
    intensities: AquacultureIntensitiesOutputSchema,
    net: NetOutputSchema,
    carbonSequestration: SequestrationTotalOutputSchema,
  },
);

export type AquacultureIntermediateOutput = z.infer<
  typeof AquacultureIntermediateOutputSchema
>;
