import { Scope3TotalsSchema } from '@/calculators/types/scope3.output';
import { outputKey } from '@/tools/zod';
import { OUTPUTDESCRIPTIONS } from '@/types/descriptions.schema';
import { z } from 'zod';

export const CroppingScope3OutputSchema = Scope3TotalsSchema.safeExtend({
  fertiliser: outputKey(OUTPUTDESCRIPTIONS.fertiliser),
  agrichemicals: outputKey(OUTPUTDESCRIPTIONS.agrichemicals),
  electricity: outputKey(OUTPUTDESCRIPTIONS.electricity),
  fuel: outputKey(OUTPUTDESCRIPTIONS.fuel),
  soilAmeliorants: outputKey(OUTPUTDESCRIPTIONS.purchasedSoilAmeliorants),
  services: outputKey(OUTPUTDESCRIPTIONS.services),
  solidWaste: outputKey(OUTPUTDESCRIPTIONS.solidWaste),
  otherPurchasedGoodsAndServices: outputKey(
    OUTPUTDESCRIPTIONS.otherPurchasedGoodsAndServices,
  ),
}).meta({ id: 'CroppingScope3Output', description: OUTPUTDESCRIPTIONS.scope3 });

export type CroppingScope3Output = z.infer<typeof CroppingScope3OutputSchema>;
