import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from './descriptions.schema';

export const SequestrationTotalOutputSchema = z
  .object({
    total: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.totalSequestration }),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.sequestration });

export type SequestrationTotalOutput = z.infer<
  typeof SequestrationTotalOutputSchema
>;
