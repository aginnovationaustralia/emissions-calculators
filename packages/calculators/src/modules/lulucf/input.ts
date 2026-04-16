import { object } from '@/types/schemas';
import { z } from 'zod';
import { LandUserChangeActivityInputSchema } from './land-user-change-activity-input';

export const LULUCFInputSchema = object({
  activities: z.array(LandUserChangeActivityInputSchema),
});

export type LULUCFInput = z.input<typeof LULUCFInputSchema>;
export type LULUCFInputTransformed = z.output<typeof LULUCFInputSchema>;
