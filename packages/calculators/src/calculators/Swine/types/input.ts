import { object } from '@/types/schemas';
import { z } from 'zod';
import { SwineHerdInputSchema } from './swine-herd.input';

export const SwineInputSchema = object({
  herds: z.array(SwineHerdInputSchema),
});

export type SwineInput = z.input<typeof SwineInputSchema>;
export type SwineInputTransformed = z.output<typeof SwineInputSchema>;
