import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { intermediateEmissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { SequestrationTotalOutputSchema } from '../sequestration.total.output';
import { CottonIntensitiesOutputSchema } from './intensities.output';
import { CottonScope1OutputSchema } from './scope1.output';
import { CottonScope3OutputSchema } from './scope3.output';

export const CottonIntermediateOutputSchema = intermediateEmissionsOutput(
  'Cotton',
  {
    scope1: CottonScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: CottonScope3OutputSchema,
    intensities: CottonIntensitiesOutputSchema,
    net: NetOutputSchema,
    carbonSequestration: SequestrationTotalOutputSchema,
  },
);

export type CottonIntermediateOutput = z.infer<
  typeof CottonIntermediateOutputSchema
>;
