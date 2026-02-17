import { outputKey, outputValue } from '@/tools/zod';
import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from './descriptions.schema';

export const GrainsScope3OutputSchema = z
  .object({
    fertiliser: outputKey(OUTPUTDESCRIPTIONS.fertiliser),
    agrichemicals: outputKey(OUTPUTDESCRIPTIONS.agrichemicals),
    electricity: outputKey(OUTPUTDESCRIPTIONS.electricity),
    fuel: outputKey(OUTPUTDESCRIPTIONS.fuel),
    lime: outputKey(OUTPUTDESCRIPTIONS.lime),
    services: outputKey(OUTPUTDESCRIPTIONS.services),
    offsiteManure: outputKey(OUTPUTDESCRIPTIONS.offsiteManure),
    solidWaste: outputKey(OUTPUTDESCRIPTIONS.solidWaste),
    total: outputValue(OUTPUTDESCRIPTIONS.scope3Total),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.scope3 });

export type GrainsScope3Output = z.infer<typeof GrainsScope3OutputSchema>;
