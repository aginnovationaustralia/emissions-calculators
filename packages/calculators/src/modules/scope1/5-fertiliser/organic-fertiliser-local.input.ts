import { object } from '@/types/schemas';
import { z } from 'zod';
import { SwineManureInputSchema } from '../4.5-manure-swine/swine-manure.input';

export const OrganicFertiliserLocalInputSchema = object({
  origin: z.literal('Local'),
  details: z.union([SwineManureInputSchema]), // TODO: Need to support other types of local organic fertiliser (beef etc)
});

export type OrganicFertiliserLocalInput = z.input<
  typeof OrganicFertiliserLocalInputSchema
>;
export type OrganicFertiliserLocalInputTransformed = z.output<
  typeof OrganicFertiliserLocalInputSchema
>;
