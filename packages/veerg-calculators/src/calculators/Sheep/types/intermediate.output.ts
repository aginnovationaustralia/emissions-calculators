import { ActivityNetOutputSchema } from '@/calculators/types/activity-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { intermediateEmissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { SheepIntermediateIntensitiesOutputSchema } from './intermediate-intensities.output';
import { SheepScope1OutputSchema } from './scope1.output';
import { SheepScope3OutputSchema } from './scope3.output';

export const SheepIntermediateOutputSchema = intermediateEmissionsOutput(
  'Sheep',
  {
    scope1: SheepScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: SheepScope3OutputSchema,
    net: ActivityNetOutputSchema,
    intensities: SheepIntermediateIntensitiesOutputSchema,
  },
);

export type SheepIntermediateOutput = z.infer<
  typeof SheepIntermediateOutputSchema
>;
