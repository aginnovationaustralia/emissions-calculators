import { object } from '@/types/schemas';
import { z } from 'zod';
import { InorganicFertilisersInputSchema } from './inorganic-fertilisers.input';
import { OrganicFertilisersInputSchema } from './organic-fertilisers.input';

export const FertiliserInputSchema = object({
  inorganicFertilisers: InorganicFertilisersInputSchema,
  organicFertilisers: OrganicFertilisersInputSchema,
});

export type FertiliserInput = z.input<typeof FertiliserInputSchema>;
export type FertiliserInputTransformed = z.output<typeof FertiliserInputSchema>;
