import { Scope3TotalsSchema } from '@/calculators/types/scope3.output';
import { outputKey } from '@/tools/zod';
import { OUTPUTDESCRIPTIONS } from '@/types/descriptions.schema';
import { z } from 'zod';

export const PigsScope3OutputSchema = Scope3TotalsSchema.safeExtend({
  purchasedLivestock: outputKey(OUTPUTDESCRIPTIONS.purchasedLivestock),
  purchasedFeed: outputKey(OUTPUTDESCRIPTIONS.purchasedFeed),
  services: outputKey(OUTPUTDESCRIPTIONS.purchasedServices),
  solidWaste: outputKey(OUTPUTDESCRIPTIONS.solidWaste),
  fuel: outputKey(OUTPUTDESCRIPTIONS.upstreamFuel),
  electricity: outputKey(OUTPUTDESCRIPTIONS.upstreamElectricity),
  otherPurchasedGoodsAndServices: outputKey(
    OUTPUTDESCRIPTIONS.otherPurchasedGoodsAndServices,
  ),
}).meta({ description: OUTPUTDESCRIPTIONS.scope3 });

export type PigsScope3Output = z.infer<typeof PigsScope3OutputSchema>;
