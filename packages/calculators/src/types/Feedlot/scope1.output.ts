import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export const FeedlotScope1OutputSchema = z
  .object({
    fuelCO2: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuelCO2 }),
    fuelCH4: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuelCH4 }),
    fuelN2O: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuelN2O }),
    transportCO2: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.transportCO2 }),
    transportCH4: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.transportCH4 }),
    transportN2O: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.transportN2O }),
    ureaCO2: z.number().meta({ description: OUTPUTDESCRIPTIONS.ureaCO2 }),
    limeCO2: z.number().meta({ description: OUTPUTDESCRIPTIONS.limeCO2 }),
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
    totalCO2: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.scope1TotalCO2 }),
    totalCH4: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.scope1TotalCH4 }),
    totalN2O: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.scope1TotalN2O }),
    total: z.number().meta({ description: OUTPUTDESCRIPTIONS.scope1Total }),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.scope1 });

export type FeedlotScope1Output = z.infer<typeof FeedlotScope1OutputSchema>;
