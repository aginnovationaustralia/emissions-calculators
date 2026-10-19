import { DairyHerdFertiliserInputSchema } from '@/modules/scope1/shared/dairy/input';
import { object } from '@/types/schemas';
import { z } from 'zod';

// Full scope of inputs needed to perform a dairy manure trace calculation
export const DairyManureInputSchema = object({
  type: z.literal('dairy'),
  herds: z.array(DairyHerdFertiliserInputSchema),
}).meta({ title: 'Dairy manure' });

export type DairyManureInput = z.input<typeof DairyManureInputSchema>;
export type DairyManureInputTransformed = z.output<
  typeof DairyManureInputSchema
>;
