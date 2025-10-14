import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { States } from '../types';
import { FeedlotCompleteSchema } from './feedlot.input';
import { FeedlotVegetationSchema } from './vegetation.input';

export const FeedlotInputSchema = z
  .object({
    state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
    feedlots: z.array(FeedlotCompleteSchema),
    vegetation: z.array(FeedlotVegetationSchema),
  })
  .meta({ description: 'Input data required for the `feedlot` calculator' });

export type FeedlotInput = z.infer<typeof FeedlotInputSchema>;
