import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from './descriptions.schema';

export const SequestrationOutputSchema = z
  .object({
    total: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.totalSequestration }),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.sequestration });

export type SequestrationOutput = z.infer<typeof SequestrationOutputSchema>;
