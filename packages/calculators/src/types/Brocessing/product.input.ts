import { z } from 'zod';
import { object } from '../schemas';

export enum ProductUnit {
  LITRE = 'litre',
  TONNE = 'tonne',
  UNIT = 'unit',
  BOTTLE = 'bottle',
  DOZEN = 'dozen',
}

export const ProcessingProductSchema = object({
  unit: z.enum(ProductUnit),
  amountMadePerYear: z.number().min(0),
});

export type ProcessingProduct = z.infer<typeof ProcessingProductSchema>;
