import { object } from '@/types/schemas';
import { z } from 'zod';
import { LivestockManuresInputSchema } from '../4-manure-management/livestock-manures.input';

export const OrganicFertiliserTracedInputSchema = object({
  origin: z.literal('Traced'),
  details: LivestockManuresInputSchema,
}).meta({ title: 'Traced manure' });

export type OrganicFertiliserTracedInput = z.input<
  typeof OrganicFertiliserTracedInputSchema
>;
export type OrganicFertiliserTracedInputTransformed = z.output<
  typeof OrganicFertiliserTracedInputSchema
>;
