import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export const RiceScope3OutputSchema = z
  .object({
    fertiliser: z.number().meta({ description: OUTPUTDESCRIPTIONS.fertiliser }),
    herbicide: z.number().meta({ description: OUTPUTDESCRIPTIONS.herbicide }),
    electricity: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.electricity }),
    fuel: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuel }),
    lime: z.number().meta({ description: OUTPUTDESCRIPTIONS.lime }),
    total: z.number().meta({ description: OUTPUTDESCRIPTIONS.scope3Total }),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.scope3 });

export type RiceScope3Output = z.infer<typeof RiceScope3OutputSchema>;
