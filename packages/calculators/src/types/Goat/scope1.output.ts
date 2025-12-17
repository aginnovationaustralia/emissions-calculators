import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export const GoatScope1OutputSchema = z
  .object({
    fuelCO2: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuelCO2 }),
    fuelCH4: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuelCH4 }),
    fuelN2O: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuelN2O }),
    ureaCO2: z.number().meta({ description: OUTPUTDESCRIPTIONS.ureaCO2 }),
    limeCO2: z.number().meta({ description: OUTPUTDESCRIPTIONS.limeCO2 }),
    fertiliserN2O: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.fertiliserN2O }),
    entericCH4: z.number().meta({ description: OUTPUTDESCRIPTIONS.entericCH4 }),
    manureManagementCH4: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.manureCH4 }),
    urineAndDungN2O: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.urineDungN2O }),
    atmosphericDepositionN2O: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.atmosphericN2O }),
    leachingAndRunoffN2O: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.leechingN2O }),
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

export type GoatScope1Output = z.infer<typeof GoatScope1OutputSchema>;
