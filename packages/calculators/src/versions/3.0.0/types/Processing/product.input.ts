import { z } from 'zod';

export enum ProductUnit {
  LITRE = 'litre',
  TONNE = 'tonne',
  UNIT = 'unit',
  BOTTLE = 'bottle',
  DOZEN = 'dozen',
}

export const ProcessingProductSchema = z.object({
  unit: z.nativeEnum(ProductUnit),
  amountMadePerYear: z.number(),
});

export type ProcessingProduct = z.infer<typeof ProcessingProductSchema>;
