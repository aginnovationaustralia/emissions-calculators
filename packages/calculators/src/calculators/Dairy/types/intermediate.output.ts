import { ActivityNetOutputSchema } from '@/calculators/types/activity-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { intermediateEmissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { DairyIntermediateIntensitiesOutputSchema } from './intermediate-intensities.output';
import { DairyScope1OutputSchema } from './scope1.output';
import { DairyScope3OutputSchema } from './scope3.output';

export const DairyIntermediateOutputSchema = intermediateEmissionsOutput(
  'Dairy',
  {
    scope1: DairyScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: DairyScope3OutputSchema,
    net: ActivityNetOutputSchema,
    intensities: DairyIntermediateIntensitiesOutputSchema,
  },
);

export type DairyIntermediateOutput = z.infer<
  typeof DairyIntermediateOutputSchema
>;
