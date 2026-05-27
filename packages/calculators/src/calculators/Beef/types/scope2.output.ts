import { outputKey, outputValue } from '@/tools/zod';
import { OUTPUTDESCRIPTIONS } from '@/types/descriptions.schema';
import { z } from 'zod';

export const BeefScope2OutputSchema = z
  .object({
    electricity: outputKey(OUTPUTDESCRIPTIONS.electricity),
    total: outputValue(OUTPUTDESCRIPTIONS.scope2Total),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.scope2 });

export type BeefScope2Output = z.infer<typeof BeefScope2OutputSchema>;
