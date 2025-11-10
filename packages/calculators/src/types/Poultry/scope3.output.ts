import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export const PoultryScope3OutputSchema = z
  .object({
    purchasedFeed: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.purchasedFeed }),
    purchasedHay: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.purchasedHay }),
    purchasedLivestock: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.purchasedLivestock }),
    herbicide: z.number().meta({ description: OUTPUTDESCRIPTIONS.herbicide }),
    electricity: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.electricity }),
    fuel: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuel }),
    total: z.number().meta({ description: OUTPUTDESCRIPTIONS.scope3Total }),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.scope3 });

export type PoultryScope3Output = z.infer<typeof PoultryScope3OutputSchema>;
