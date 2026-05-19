import { object } from '@/types/schemas';
import { z } from 'zod';
import {
  SwineBoarsInputSchema,
  SwineGiltsInputSchema,
  SwineSlaughterPigsInputSchema,
  SwineSowsInputSchema,
} from './swine-class.input';

export const SwineHerdInputSchema = object({
  boars: SwineBoarsInputSchema.optional(),
  sows: SwineSowsInputSchema.optional(),
  gilts: SwineGiltsInputSchema.optional(),
  slaughterPigs: SwineSlaughterPigsInputSchema.optional(),
});

export type SwineHerdInput = z.input<typeof SwineHerdInputSchema>;
export type SwineHerdInputTransformed = z.output<typeof SwineHerdInputSchema>;
