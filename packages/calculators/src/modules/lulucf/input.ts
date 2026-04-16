import { object } from '@/types/schemas';
import { z } from 'zod';
import { LandUseChangeActivityInputSchema } from './land-user-change-activity-input';

export const LULUCFInputSchema = object({
  activities: z.array(LandUseChangeActivityInputSchema),
});

export type LULUCFInput = z.input<typeof LULUCFInputSchema>;
export type LULUCFInputTransformed = z.output<typeof LULUCFInputSchema>;
