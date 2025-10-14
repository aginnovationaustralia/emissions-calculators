import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { States } from '../types';
import { ProductProcessingInputSchema } from './processing.input';

export const ProcessingInputSchema = z
  .object({
    state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
    products: z.array(ProductProcessingInputSchema),
  })
  .meta({ description: 'Input data required for the `processing` calculator' });

export type ProcessingInput = z.infer<typeof ProcessingInputSchema>;
