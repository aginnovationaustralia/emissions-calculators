import { object } from '@/types/schemas';
import { z } from 'zod';
import { RefrigerantInputSchema } from './refrigerant.input';

export const RefrigerantsInputSchema = object({
  refrigerants: z.array(RefrigerantInputSchema),
});

export type RefrigerantsInput = z.input<typeof RefrigerantsInputSchema>;
export type RefrigerantsInputTransformed = z.output<
  typeof RefrigerantsInputSchema
>;
