import { z } from 'zod';
import { FeedlotStaySchema } from './stay.input';
import { object } from '../schemas';

export const FeedlotGroupSchema = object({
  stays: z.array(FeedlotStaySchema),
});

export type FeedlotGroup = z.infer<typeof FeedlotGroupSchema>;
