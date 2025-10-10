import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from './descriptions.schema';

export const SequestrationIntermediateOutputSchema = z
  .object({
    total: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.totalSequestration }),
    average: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.totalSequestration }),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.sequestration });

export type SequestrationIntermediateOutput = z.infer<
  typeof SequestrationIntermediateOutputSchema
>;
