import { Scope3TotalsSchema } from '@/calculators/types/scope3.output';
import { outputKey } from '@/tools/zod';
import { OUTPUTDESCRIPTIONS } from '@/types/descriptions.schema';
import { z } from 'zod';

export const WildCatchFisheriesScope3OutputSchema =
  Scope3TotalsSchema.safeExtend({
    electricity: outputKey(OUTPUTDESCRIPTIONS.electricity),
    fuel: outputKey(OUTPUTDESCRIPTIONS.fuel),
    solidWaste: outputKey(OUTPUTDESCRIPTIONS.solidWaste),
    otherPurchasedGoodsAndServices: outputKey(
      OUTPUTDESCRIPTIONS.otherPurchasedGoodsAndServices,
    ),
    purchasedFeed: outputKey(OUTPUTDESCRIPTIONS.purchasedFeed),
  }).meta({ description: OUTPUTDESCRIPTIONS.scope3 });

export type WildCatchFisheriesScope3Output = z.infer<
  typeof WildCatchFisheriesScope3OutputSchema
>;
