import { Scope3TotalsSchema } from '@/calculators/types/scope3.output';
import { outputKey } from '@/tools/zod';
import { OUTPUTDESCRIPTIONS } from '@/types/descriptions.schema';
import { z } from 'zod';

export const SheepScope3OutputSchema = Scope3TotalsSchema.safeExtend({
  purchasedLivestock: outputKey(OUTPUTDESCRIPTIONS.purchasedLivestock),
  purchasedFeed: outputKey(OUTPUTDESCRIPTIONS.purchasedFeed),
  purchasedMineralSupplements: outputKey(
    OUTPUTDESCRIPTIONS.purchasedMineralSupplements,
  ),
  fertiliser: outputKey(OUTPUTDESCRIPTIONS.purchasedFertiliser),
  agrichemicals: outputKey(OUTPUTDESCRIPTIONS.purchasedAgrichemicals),
  soilAmeliorants: outputKey(OUTPUTDESCRIPTIONS.purchasedSoilAmeliorants),
  services: outputKey(OUTPUTDESCRIPTIONS.purchasedServices),
  solidWaste: outputKey(OUTPUTDESCRIPTIONS.solidWaste),
  fuel: outputKey(OUTPUTDESCRIPTIONS.upstreamFuel),
  electricity: outputKey(OUTPUTDESCRIPTIONS.upstreamElectricity),
  otherPurchasedGoodsAndServices: outputKey(
    OUTPUTDESCRIPTIONS.otherPurchasedGoodsAndServices,
  ),
}).meta({ description: OUTPUTDESCRIPTIONS.scope3 });

export type SheepScope3Output = z.infer<typeof SheepScope3OutputSchema>;
