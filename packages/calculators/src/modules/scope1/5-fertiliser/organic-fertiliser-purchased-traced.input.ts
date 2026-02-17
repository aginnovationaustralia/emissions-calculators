import { object } from '@/types/schemas';
import { z } from 'zod';
import { SwineManureInputSchema } from '../4.5-manure-swine/swine-manure.input';

export const OrganicFertiliserPurchasedTracedInputSchema = object({
  origin: z.literal('Purchased_Traced'),
  details: z.union([SwineManureInputSchema]),
});

export type OrganicFertiliserPurchasedTracedInput = z.input<
  typeof OrganicFertiliserPurchasedTracedInputSchema
>;
export type OrganicFertiliserPurchasedTracedInputTransformed = z.output<
  typeof OrganicFertiliserPurchasedTracedInputSchema
>;
