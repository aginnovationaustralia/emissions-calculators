import { Scope3TotalsSchema } from '@/calculators/types/scope3.output';
import { outputKey } from '@/tools/zod';
import { OUTPUTDESCRIPTIONS } from '@/types/descriptions.schema';
import { z } from 'zod';

export const AllModulesScope3OutputSchema = Scope3TotalsSchema.safeExtend({
  electricity: outputKey(OUTPUTDESCRIPTIONS.upstreamElectricity),
  freight: outputKey(OUTPUTDESCRIPTIONS.outboundFreight),
  fuel: outputKey(OUTPUTDESCRIPTIONS.upstreamFuel),
  purchasedLivestock: outputKey(OUTPUTDESCRIPTIONS.purchasedLivestock),
  purchasedFeed: outputKey(OUTPUTDESCRIPTIONS.purchasedFeed),
  purchasedMineralSupplements: outputKey(
    OUTPUTDESCRIPTIONS.purchasedMineralSupplements,
  ),
  services: outputKey(OUTPUTDESCRIPTIONS.purchasedServices),
  solidWaste: outputKey(OUTPUTDESCRIPTIONS.solidWaste),
  fertiliser: outputKey(OUTPUTDESCRIPTIONS.purchasedFertiliser),
  agrichemicals: outputKey(OUTPUTDESCRIPTIONS.purchasedAgrichemicals),
  soilAmeliorants: outputKey(OUTPUTDESCRIPTIONS.purchasedSoilAmeliorants),
  otherPurchasedGoodsAndServices: outputKey(
    OUTPUTDESCRIPTIONS.otherPurchasedGoodsAndServices,
  ),
  purchasedPackaging: outputKey(OUTPUTDESCRIPTIONS.purchasedPackaging),
});

export type AllModulesScope3Output = z.infer<
  typeof AllModulesScope3OutputSchema
>;
