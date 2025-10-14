import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export const SheepScope3OutputSchema = z
  .object({
    fertiliser: z.number().meta({ description: OUTPUTDESCRIPTIONS.fertiliser }),
    purchasedMineralSupplementation: z
      .number()
      .meta({
        description: OUTPUTDESCRIPTIONS.purchasedMineralSupplementation,
      }),
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
      .meta({ description: OUTPUTDESCRIPTIONS.purchasedLivestock }),
    total: z.number().meta({ description: OUTPUTDESCRIPTIONS.scope3Total }),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.scope3 });

export type SheepScope3Output = z.infer<typeof SheepScope3OutputSchema>;
