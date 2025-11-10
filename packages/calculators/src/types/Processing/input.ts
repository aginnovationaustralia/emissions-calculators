import { States } from '@/types/enums';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { calculatorInput } from '../schemas';
import { ProductProcessingInputSchema } from './processing.input';

export const ProcessingInputSchema = calculatorInput('Processing', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  products: z.array(ProductProcessingInputSchema),
});

export type ProcessingInput = z.infer<typeof ProcessingInputSchema>;
