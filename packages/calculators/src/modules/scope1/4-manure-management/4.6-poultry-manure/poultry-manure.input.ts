import { PoultryFlockFertiliserInputSchema } from '@/modules/scope1/shared/poultry/input';
import { object } from '@/types/schemas';
import z from 'zod';

export const PoultryManureInputSchema = object({
  type: z.literal('poultry'),
  flocks: z.array(PoultryFlockFertiliserInputSchema),
}).meta({ title: 'Poultry manure' });
export type PoultryManureInput = z.input<typeof PoultryManureInputSchema>;
export type PoultryManureInputTransformed = z.output<
  typeof PoultryManureInputSchema
>;
