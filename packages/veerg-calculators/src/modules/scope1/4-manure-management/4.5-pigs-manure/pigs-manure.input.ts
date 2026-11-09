import { PigsHerdFertiliserInputSchema } from '@/modules/scope1/shared/pigs/input';
import { object } from '@/types/schemas';
import z from 'zod';

export const PigsManureInputSchema = object({
  type: z.literal(['pigs']),
  herds: z.array(PigsHerdFertiliserInputSchema),
}).meta({ title: 'Pigs manure' });

export type PigsManureInput = z.input<typeof PigsManureInputSchema>;
export type PigsManureInputTransformed = z.output<typeof PigsManureInputSchema>;
