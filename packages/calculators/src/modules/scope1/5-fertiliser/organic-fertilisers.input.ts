import { object } from '@/types/schemas';
import { z } from 'zod';
import { OrganicFertiliserInputSchema } from './organic-fertiliser.input';

export const OrganicFertilisersInputSchema = object({
  applications: z.array(OrganicFertiliserInputSchema).meta({
    description: 'Organic fertiliser applications',
  }),
});

export type OrganicFertilisersInput = z.input<
  typeof OrganicFertilisersInputSchema
>;
export type OrganicFertilisersInputTransformed = z.output<
  typeof OrganicFertilisersInputSchema
>;
