import { outputKey, outputTonnesCO2e } from '@/tools/zod';
import { OUTPUTDESCRIPTIONS } from '@/types/descriptions.schema';
import { z } from 'zod';

export const Scope2OutputSchema = z
  .object({
    electricity: outputKey(OUTPUTDESCRIPTIONS.electricity),
    total: outputTonnesCO2e(OUTPUTDESCRIPTIONS.scope2Total),
  })
  .meta({ id: 'Scope2Output', description: OUTPUTDESCRIPTIONS.scope2 });

export type Scope2Output = z.infer<typeof Scope2OutputSchema>;
