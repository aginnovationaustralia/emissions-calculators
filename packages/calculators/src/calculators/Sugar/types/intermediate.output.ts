import { ActivityNetOutputSchema } from '@/calculators/types/activity-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { intermediateEmissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { SugarIntermediateIntensitiesOutputSchema } from './intermediate-intensities.output';
import { SugarScope1OutputSchema } from './scope1.output';
import { SugarScope3OutputSchema } from './scope3.output';

export const SugarIntermediateOutputSchema = intermediateEmissionsOutput(
  'Sugar',
  {
    scope1: SugarScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: SugarScope3OutputSchema,
    net: ActivityNetOutputSchema,
    intensities: SugarIntermediateIntensitiesOutputSchema,
  },
);

export type SugarIntermediateOutput = z.infer<
  typeof SugarIntermediateOutputSchema
>;
