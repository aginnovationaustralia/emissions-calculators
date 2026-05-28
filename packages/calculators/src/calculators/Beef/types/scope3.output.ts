import { outputKey, outputValue } from '@/tools/zod';
import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../../Grains/types/descriptions.schema';

export const BeefScope3OutputSchema = z
  .object({
    livestock: outputKey(OUTPUTDESCRIPTIONS.purchasedLivestock),
    feed: outputKey(OUTPUTDESCRIPTIONS.purchasedFeed),
    mineralSupplements: outputKey(
      OUTPUTDESCRIPTIONS.purchasedMineralSupplements,
    ),
    fertiliser: outputKey(OUTPUTDESCRIPTIONS.purchasedFertiliser),
    agrichemicals: outputKey(OUTPUTDESCRIPTIONS.purchasedAgrichemicals),
    lime: outputKey(OUTPUTDESCRIPTIONS.purchasedLime),
    services: outputKey(OUTPUTDESCRIPTIONS.purchasedServices),
    offsiteManure: outputKey(OUTPUTDESCRIPTIONS.offsiteManure),
    solidWaste: outputKey(OUTPUTDESCRIPTIONS.solidWaste),
    fuel: outputKey(OUTPUTDESCRIPTIONS.upstreamFuel),
    electricity: outputKey(OUTPUTDESCRIPTIONS.upstreamElectricity),
    waste: outputKey(OUTPUTDESCRIPTIONS.managementOfWaste),
    total: outputValue(OUTPUTDESCRIPTIONS.scope3Total),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.scope3 });

export type BeefScope3Output = z.infer<typeof BeefScope3OutputSchema>;
