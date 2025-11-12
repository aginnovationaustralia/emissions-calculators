import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { intermediateEmissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { SheepEmissionsIntensitiesSchema } from './intensities.output';
import { SheepScope1OutputSchema } from './scope1.output';
import { SheepScope3OutputSchema } from './scope3.output';

export const SheepIntermediateOutputSchema = intermediateEmissionsOutput(
  'Sheep',
  {
    scope1: SheepScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: SheepScope3OutputSchema,
    intensities: SheepEmissionsIntensitiesSchema,
    net: NetOutputSchema,
  },
);

export type SheepIntermediateOutput = z.infer<
  typeof SheepIntermediateOutputSchema
>;
