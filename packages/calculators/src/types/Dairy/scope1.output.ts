import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export const DairyScope1OutputSchema = z
  .object({
    fuelCO2: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuelCO2 }),
    fuelCH4: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuelCH4 }),
    fuelN2O: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuelN2O }),
    ureaCO2: z.number().meta({ description: OUTPUTDESCRIPTIONS.ureaCO2 }),
    limeCO2: z.number().meta({ description: OUTPUTDESCRIPTIONS.limeCO2 }),
    entericCH4: z.number().meta({ description: OUTPUTDESCRIPTIONS.entericCH4 }),
    manureManagementCH4: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.manureCH4 }),
    manureManagementN2O: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.manureN2O }),
    animalWasteN2O: z
      .number()
      .meta({ description: 'N2O emissions from animal waste, in tonnes-CO2e' }),
    fertiliserN2O: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.fertiliserN2O }),
    urineAndDungN2O: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.urineDungN2O }),
    atmosphericDepositionN2O: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.atmosphericN2O }),
    leachingAndRunoffN2O: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.leechingN2O }),
    transportN2O: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.transportN2O }),
    transportCH4: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.transportCH4 }),
    transportCO2: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.transportCO2 }),
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

export type DairyScope1Output = z.infer<typeof DairyScope1OutputSchema>;
