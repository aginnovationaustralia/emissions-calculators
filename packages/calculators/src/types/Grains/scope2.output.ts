import { outputKey } from '@/tools/zod';
import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export const GrainsScope2OutputSchema = z
  .object({
    electricity: outputKey(OUTPUTDESCRIPTIONS.electricity),
    total: outputKey(OUTPUTDESCRIPTIONS.scope2Total),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.scope2 });

export type Scope2Output = z.infer<typeof GrainsScope2OutputSchema>;
