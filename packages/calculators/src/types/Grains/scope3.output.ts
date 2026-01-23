import { outputKey } from '@/tools/zod';
import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export const GrainsScope3OutputSchema = z
  .object({
    fertiliser: outputKey(OUTPUTDESCRIPTIONS.fertiliser),
    herbicide: outputKey(OUTPUTDESCRIPTIONS.herbicide),
    electricity: outputKey(OUTPUTDESCRIPTIONS.electricity),
    fuel: outputKey(OUTPUTDESCRIPTIONS.fuel),
    lime: outputKey(OUTPUTDESCRIPTIONS.lime),
    total: outputKey(OUTPUTDESCRIPTIONS.scope3Total),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.scope3 });

export type GrainsScope3Output = z.infer<typeof GrainsScope3OutputSchema>;
