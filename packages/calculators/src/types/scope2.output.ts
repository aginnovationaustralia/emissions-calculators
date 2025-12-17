import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from './descriptions.schema';

export const Scope2OutputSchema = z
  .object({
    electricity: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.electricity }),
    total: z.number().meta({ description: OUTPUTDESCRIPTIONS.scope2Total }),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.scope2 });

export type Scope2Output = z.infer<typeof Scope2OutputSchema>;
