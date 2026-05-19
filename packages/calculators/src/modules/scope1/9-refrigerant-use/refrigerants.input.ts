import { object } from '@/types/schemas';
import { z } from 'zod';
import { RefrigerantInputSchema } from './refrigerant.input';

export const RefrigerantInputsSchema = object({
  refrigerants: z.array(RefrigerantInputSchema),
});

export type RefrigerantInputs = z.input<typeof RefrigerantInputsSchema>;
export type RefrigerantInputsTransformed = z.output<
  typeof RefrigerantInputsSchema
>;
