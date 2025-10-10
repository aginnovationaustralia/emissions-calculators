import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export const WildCatchFisheryScope3OutputSchema = z
  .object({
    purchasedBait: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.purchasedBait }),
    electricity: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.electricity }),
    fuel: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuel }),
    commercialFlights: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.commercialFlights }),
    inboundFreight: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.inboundFreight }),
    outboundFreight: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.outboundFreight }),
    solidWasteSentOffsite: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.solidWasteSentOffsite }),
    total: z.number().meta({ description: OUTPUTDESCRIPTIONS.scope3Total }),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.scope3 });

export type WildCatchFisheryScope3Output = z.infer<
  typeof WildCatchFisheryScope3OutputSchema
>;
