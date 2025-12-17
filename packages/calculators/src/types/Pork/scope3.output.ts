import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export const PorkScope3OutputSchema = z
  .object({
    fertiliser: z.number().meta({ description: OUTPUTDESCRIPTIONS.fertiliser }),
    purchasedFeed: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.purchasedFeed }),
    herbicide: z.number().meta({ description: OUTPUTDESCRIPTIONS.herbicide }),
    electricity: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.electricity }),
    fuel: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuel }),
    lime: z.number().meta({ description: OUTPUTDESCRIPTIONS.lime }),
    purchasedLivestock: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.purchasedPigs }),
    bedding: z.number().meta({ description: OUTPUTDESCRIPTIONS.porkBedding }),
    total: z.number().meta({ description: OUTPUTDESCRIPTIONS.scope3Total }),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.scope3 });

export type PorkScope3Output = z.infer<typeof PorkScope3OutputSchema>;
