import { EnterpriseInputSchema } from '@/calculators/types/enterprise.input';
import { z } from 'zod';
import { PoultryFlockInputSchema } from './poultry-flock.input';

export const PoultryInputSchema = EnterpriseInputSchema.safeExtend({
  flocks: z.array(PoultryFlockInputSchema),
});

export type PoultryInput = z.input<typeof PoultryInputSchema>;
export type PoultryInputTransformed = z.output<typeof PoultryInputSchema>;
