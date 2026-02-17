import { z } from 'zod';
import { RefrigerantInputSchema } from './refrigerant.input';
import { object } from './schemas';

export const RefrigerantInputsSchema = object({
  refrigerants: z.array(RefrigerantInputSchema),
});

export type RefrigerantInputs = z.input<typeof RefrigerantInputsSchema>;
export type RefrigerantInputsTransformed = z.output<
  typeof RefrigerantInputsSchema
>;
