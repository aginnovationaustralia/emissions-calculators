import { EnterpriseInputSchema } from '@/calculators/types/enterprise.input';
import { z } from 'zod';
import { FeedlotLotInputSchema } from './feedlot-lot.input';

export const FeedlotInputSchema = EnterpriseInputSchema.safeExtend({
  lots: z.array(FeedlotLotInputSchema),
});

export type FeedlotInput = z.input<typeof FeedlotInputSchema>;
export type FeedlotInputTransformed = z.output<typeof FeedlotInputSchema>;
