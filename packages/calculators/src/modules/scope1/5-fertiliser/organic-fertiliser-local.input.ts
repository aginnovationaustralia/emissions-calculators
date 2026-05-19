import { object } from '@/types/schemas';
import { z } from 'zod';
import { LivestockManuresInputSchema } from '../4-manure-management/livestock-manures.input';

export const OrganicFertiliserLocalInputSchema = object({
  origin: z.literal('Local'),
  details: LivestockManuresInputSchema,
});

export type OrganicFertiliserLocalInput = z.input<
  typeof OrganicFertiliserLocalInputSchema
>;
export type OrganicFertiliserLocalInputTransformed = z.output<
  typeof OrganicFertiliserLocalInputSchema
>;
