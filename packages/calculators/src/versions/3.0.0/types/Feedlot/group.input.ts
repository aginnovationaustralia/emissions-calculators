import { z } from 'zod';
import { FeedlotStaySchema } from './stay.input';

export const FeedlotGroupSchema = z.object({
  stays: z.array(FeedlotStaySchema),
});

export type FeedlotGroup = z.infer<typeof FeedlotGroupSchema>;
