import { ActivityNetOutputSchema } from '@/calculators/types/activity-net.output';
import { Scope2OutputSchema } from '@/calculators/types/scope2.output';
import { intermediateEmissionsOutput } from '@/types/schemas';
import { z } from 'zod';
import { ForestryScope1OutputSchema } from './scope1.output';
import { ForestryScope3OutputSchema } from './scope3.output';

export const ForestryIntermediateOutputSchema = intermediateEmissionsOutput(
  'Forestry',
  {
    scope1: ForestryScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: ForestryScope3OutputSchema,
    net: ActivityNetOutputSchema,
  },
);

export type ForestryIntermediateOutput = z.infer<
  typeof ForestryIntermediateOutputSchema
>;
