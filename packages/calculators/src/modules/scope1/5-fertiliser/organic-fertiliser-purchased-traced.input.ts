import { object } from '@/types/schemas';
import { z } from 'zod';
import { LivestockManuresInputSchema } from '../4-manure-management/livestock-manures.input';

export const OrganicFertiliserPurchasedTracedInputSchema = object({
  origin: z.literal('Purchased_Traced'),
  details: LivestockManuresInputSchema,
});

export type OrganicFertiliserPurchasedTracedInput = z.input<
  typeof OrganicFertiliserPurchasedTracedInputSchema
>;
export type OrganicFertiliserPurchasedTracedInputTransformed = z.output<
  typeof OrganicFertiliserPurchasedTracedInputSchema
>;
