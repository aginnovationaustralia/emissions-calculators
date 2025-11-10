import { States } from '@/types/enums';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { singleEnterpriseInput } from '../schemas';
import { FeedlotCompleteSchema } from './feedlot.input';
import { FeedlotVegetationSchema } from './vegetation.input';

export const FeedlotInputSchema = singleEnterpriseInput('Feedlot', {
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  feedlots: z.array(FeedlotCompleteSchema),
  vegetation: z.array(FeedlotVegetationSchema),
});

export type FeedlotInput = z.infer<typeof FeedlotInputSchema>;
