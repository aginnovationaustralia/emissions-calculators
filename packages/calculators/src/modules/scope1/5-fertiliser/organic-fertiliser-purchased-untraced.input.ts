import { OrganicFertiliserTypes } from '@/calculators/Grains/constants/enums';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const OrganicFertiliserPurchasedUntracedInputSchema = object({
  origin: z.literal('Purchased_Untraced'),
  organicFertiliserType: z.enum(OrganicFertiliserTypes).meta({
    description: 'Type of organic fertiliser',
  }),
});

export type OrganicFertiliserPurchasedUntracedInput = z.input<
  typeof OrganicFertiliserPurchasedUntracedInputSchema
>;
export type OrganicFertiliserPurchasedUntracedInputTransformed = z.output<
  typeof OrganicFertiliserPurchasedUntracedInputSchema
>;
