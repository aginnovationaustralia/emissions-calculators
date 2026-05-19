import { object } from '@/types/schemas';
import { z } from 'zod';
import { DairyHerdInputSchema } from './herd.input';

export const DairyInputSchema = object({
  herds: z.array(DairyHerdInputSchema),
});

export type DairyInput = z.input<typeof DairyInputSchema>;
export type DairyInputTransformed = z.output<typeof DairyInputSchema>;
