import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export const FeedlotScope3OutputSchema = z
  .object({
    fertiliser: z.number().meta({ description: OUTPUTDESCRIPTIONS.fertiliser }),
    herbicide: z.number().meta({ description: OUTPUTDESCRIPTIONS.herbicide }),
    electricity: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.electricity }),
    fuel: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuel }),
    lime: z.number().meta({ description: OUTPUTDESCRIPTIONS.lime }),
    feed: z.number().meta({ description: OUTPUTDESCRIPTIONS.feed }),
    purchaseLivestock: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.purchasedLivestock }),
    total: z.number().meta({ description: OUTPUTDESCRIPTIONS.scope3Total }),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.scope3 });

export type FeedlotScope3Output = z.infer<typeof FeedlotScope3OutputSchema>;
