import { object } from '@/types/schemas';
import { z } from 'zod';
import { AgrichemicalInputSchema } from './agrichemical.input';

export const AgrichemicalsInputSchema = object({
  chemicals: z.array(AgrichemicalInputSchema),
});

export type AgrichemicalsInput = z.input<typeof AgrichemicalsInputSchema>;
export type AgrichemicalsInputTransformed = z.output<
  typeof AgrichemicalsInputSchema
>;
