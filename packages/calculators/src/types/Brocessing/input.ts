import { States } from '@/types/enums';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { calculatorInput } from '../schemas';
import { ProductProcessingInputSchema } from './processing.input';

export const BrocessingInputSchema = calculatorInput('Brocessing', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  products: z.array(ProductProcessingInputSchema),
});

export type BrocessingInput = z.infer<typeof BrocessingInputSchema>;
