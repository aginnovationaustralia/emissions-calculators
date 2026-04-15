import { ElectricityInputsSchema } from '@/modules/scope2/14-electricity/electricity.input';
import { singleEnterpriseInput } from '@/types/schemas';
import { z } from 'zod';
import { FeedlotGroupInputSchema } from './feedlot-group.input';

export const FeedlotInputSchema = singleEnterpriseInput('Feedlot', {
  groups: z.array(FeedlotGroupInputSchema),
  electricity: ElectricityInputsSchema,
});

export type FeedlotInput = z.input<typeof FeedlotInputSchema>;
export type FeedlotInputTransformed = z.output<typeof FeedlotInputSchema>;
