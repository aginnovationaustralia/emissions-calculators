import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from './descriptions.schema';

export const PurchasedOffsetsOutputSchema = z
  .object({
    total: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.totalSequestration }),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.purchasedOffsets });

export type PurchasedOffsetsOutput = z.infer<
  typeof PurchasedOffsetsOutputSchema
>;
