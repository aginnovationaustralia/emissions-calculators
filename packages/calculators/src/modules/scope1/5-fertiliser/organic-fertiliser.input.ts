import { object } from '@/types/schemas';
import { z } from 'zod';
import { OrganicFertiliserTracedInputSchema } from './organic-fertiliser-traced.input';
import { OrganicFertiliserUntracedInputSchema } from './organic-fertiliser-untraced.input';

export const OrganicFertiliserInputSchema = object({
  origin: z.discriminatedUnion('origin', [
    OrganicFertiliserTracedInputSchema,
    OrganicFertiliserUntracedInputSchema,
  ]),
}).meta({ id: 'OrganicFertiliserInput' });

export type OrganicFertiliserInput = z.input<
  typeof OrganicFertiliserInputSchema
>;
export type OrganicFertiliserInputTransformed = z.output<
  typeof OrganicFertiliserInputSchema
>;
