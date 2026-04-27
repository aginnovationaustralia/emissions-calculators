import { object } from '@/types/schemas';
import { z } from 'zod';
import { OtherLivestockClassInputSchema } from './class.input';

export const OtherLivestockHerdInputSchema = object({
  classes: z.array(OtherLivestockClassInputSchema),
});
