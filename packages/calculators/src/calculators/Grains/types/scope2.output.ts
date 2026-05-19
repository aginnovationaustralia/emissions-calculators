import { outputKey, outputValue } from '@/tools/zod';
import { OUTPUTDESCRIPTIONS } from '@/types/descriptions.schema';
import { z } from 'zod';

export const GrainsScope2OutputSchema = z
  .object({
    electricity: outputKey(OUTPUTDESCRIPTIONS.electricity),
    total: outputValue(OUTPUTDESCRIPTIONS.scope2Total),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.scope2 });

export type GrainsScope2Output = z.infer<typeof GrainsScope2OutputSchema>;
