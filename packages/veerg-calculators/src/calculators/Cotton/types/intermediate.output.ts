import { ActivityNetOutputSchema } from '@/calculators/types/activity-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { intermediateEmissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { CottonIntermediateIntensitiesOutputSchema } from './intermediate-intensities.output';
import { CottonScope1OutputSchema } from './scope1.output';
import { CottonScope3OutputSchema } from './scope3.output';

export const CottonIntermediateOutputSchema = intermediateEmissionsOutput(
  'Cotton',
  {
    scope1: CottonScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: CottonScope3OutputSchema,
    net: ActivityNetOutputSchema,
    intensities: CottonIntermediateIntensitiesOutputSchema,
  },
);

export type CottonIntermediateOutput = z.infer<
  typeof CottonIntermediateOutputSchema
>;
