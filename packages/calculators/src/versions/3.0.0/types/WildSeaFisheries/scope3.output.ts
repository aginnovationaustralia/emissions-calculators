import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export const WildSeaFisheriesScope3OutputSchema = z
  .object({
    electricity: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.electricity }),
    fuel: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuel }),
    bait: z.number().meta({ description: OUTPUTDESCRIPTIONS.purchasedBait }),
    total: z.number().meta({ description: OUTPUTDESCRIPTIONS.scope3Total }),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.scope3 });

export type WildSeaFisheriesScope3Output = z.infer<
  typeof WildSeaFisheriesScope3OutputSchema
>;
