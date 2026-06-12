import { object } from '@/types/schemas';
import { z } from 'zod';
import {
  SwineBoarsInputSchema,
  SwineGiltsInputSchema,
  SwineOtherInputSchema,
  SwineSowsInputSchema,
} from './swine-class.input';

export const SwineHerdInputSchema = object({
  boars: SwineBoarsInputSchema.optional(),
  sows: SwineSowsInputSchema.optional(),
  gilts: SwineGiltsInputSchema.optional(),
  others: SwineOtherInputSchema.optional(),
});

export type SwineHerdInput = z.input<typeof SwineHerdInputSchema>;
export type SwineHerdInputTransformed = z.output<typeof SwineHerdInputSchema>;
