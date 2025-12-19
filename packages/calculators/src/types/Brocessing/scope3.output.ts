import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export const ProcessingScope3OutputSchema = z
  .object({
    electricity: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.electricity }),
    fuel: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuel }),
    solidWasteSentOffsite: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.solidWasteSentOffsite }),
    total: z.number().meta({ description: OUTPUTDESCRIPTIONS.scope3Total }),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.scope3 });

export type ProcessingScope3Output = z.infer<
  typeof ProcessingScope3OutputSchema
>;
