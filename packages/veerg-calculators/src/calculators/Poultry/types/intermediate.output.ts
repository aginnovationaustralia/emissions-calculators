import { ActivityNetOutputSchema } from '@/calculators/types/activity-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { intermediateEmissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { PoultryIntermediateIntensitiesOutputSchema } from './intermediate-intensities.output';
import { PoultryScope1OutputSchema } from './scope1.output';
import { PoultryScope3OutputSchema } from './scope3.output';

export const PoultryIntermediateOutputSchema = intermediateEmissionsOutput(
  'Poultry',
  {
    scope1: PoultryScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: PoultryScope3OutputSchema,
    net: ActivityNetOutputSchema,
    intensities: PoultryIntermediateIntensitiesOutputSchema,
  },
);

export type PoultryIntermediateOutput = z.infer<
  typeof PoultryIntermediateOutputSchema
>;
