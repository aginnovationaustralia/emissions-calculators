import { Scope3TotalsSchema } from '@/calculators/types/scope3.output';
import { outputKey } from '@/tools/zod';
import { OUTPUTDESCRIPTIONS } from '@/types/descriptions.schema';
import { z } from 'zod';

export const PostProductionScope3OutputSchema = Scope3TotalsSchema.safeExtend({
  electricity: outputKey(OUTPUTDESCRIPTIONS.upstreamElectricity),
  freight: outputKey(OUTPUTDESCRIPTIONS.outboundFreight),
  fuel: outputKey(OUTPUTDESCRIPTIONS.upstreamFuel),
  solidWaste: outputKey(OUTPUTDESCRIPTIONS.solidWaste),
  otherPurchasedGoodsAndServices: outputKey(
    OUTPUTDESCRIPTIONS.otherPurchasedGoodsAndServices,
  ),
  purchasedPackaging: outputKey(OUTPUTDESCRIPTIONS.purchasedPackaging),
});

export type PostProductionScope3Output = z.infer<
  typeof PostProductionScope3OutputSchema
>;
