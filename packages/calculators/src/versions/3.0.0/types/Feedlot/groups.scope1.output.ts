import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export const GroupScope1OutputSchema = z
  .object({
    atmosphericDepositionN2O: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.atmosphericN2O }),
    manureDirectN2O: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.manureDirectN2O }),
    manureIndirectN2O: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.manureIndirectN2O }),
    manureManagementCH4: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.manureCH4 }),
    manureAppliedToSoilN2O: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.manureAppliedToSoilN2O }),
    entericCH4: z.number().meta({ description: OUTPUTDESCRIPTIONS.entericCH4 }),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.scope1 });

export type GroupScope1Output = z.infer<typeof GroupScope1OutputSchema>;
