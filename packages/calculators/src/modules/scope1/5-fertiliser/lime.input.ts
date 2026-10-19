import { object } from '@/types/schemas';
import { z } from 'zod';
import { LimeApplicationInputSchema } from './lime-application.input';

export const LimeInputSchema = object({
  applications: z.array(LimeApplicationInputSchema),
});

export type LimeInput = z.input<typeof LimeInputSchema>;
export type LimeInputTransformed = z.output<typeof LimeInputSchema>;

export const HasLimeInputSchema = object({
  lime: LimeInputSchema,
});

export type HasLimeInput = z.input<typeof HasLimeInputSchema>;
export type HasLimeInputTransformed = z.output<typeof HasLimeInputSchema>;
