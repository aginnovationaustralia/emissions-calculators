import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export const PoultryScope1OutputSchema = z
  .object({
    fuelCO2: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuelCO2 }),
    fuelCH4: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuelCH4 }),
    fuelN2O: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuelN2O }),
    manureManagementCH4: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.manureCH4 }),
    manureManagementN2O: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.manureN2O }),
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

export type PoultryScope1Output = z.infer<typeof PoultryScope1OutputSchema>;
