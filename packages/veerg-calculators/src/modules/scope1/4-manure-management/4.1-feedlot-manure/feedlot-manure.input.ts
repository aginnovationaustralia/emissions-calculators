import { FeedlotLotFertiliserInputSchema } from '@/modules/scope1/shared/feedlot/input';
import z from 'zod';

export const FeedlotManureInputSchema = FeedlotLotFertiliserInputSchema.extend({
  type: z.literal('feedlot'),
}).meta({ title: 'Feedlot manure' });
export type FeedlotManureInput = z.input<typeof FeedlotManureInputSchema>;
export type FeedlotManureInputTransformed = z.output<
  typeof FeedlotManureInputSchema
>;
