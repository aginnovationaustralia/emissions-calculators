import { z } from 'zod';
import { BeefSummaryOutputSchema } from './beef-summary.output';
import { SheepSummaryOutputSchema } from './sheep-summary.output';

export const SheepBeefIntermediateOutputSchema = z
  .object({
    beef: BeefSummaryOutputSchema.meta({
      description: 'Emission output breakdown just for beef livestock',
    }),
    sheep: SheepSummaryOutputSchema.meta({
      description: 'Emission output breakdown just for sheep livestock',
    }),
  })
  .meta({
    description:
      'Intermediate emission output breakdown just for sheep and beef livestock. These combine to make up the total emission output for each scope',
  });

export type SheepBeefIntermediateOutput = z.infer<
  typeof SheepBeefIntermediateOutputSchema
>;
