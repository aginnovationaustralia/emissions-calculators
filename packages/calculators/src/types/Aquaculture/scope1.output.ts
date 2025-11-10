import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export const AquacultureScope1OutputSchema = z
  .object({
    fuelCO2: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuelCO2 }),
    fuelCH4: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuelCH4 }),
    fuelN2O: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuelN2O }),
    hfcsRefrigerantLeakage: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.hfcsRefrigerant }),
    wasteWaterCO2: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.wastewaterCO2 }),
    compostedSolidWasteCO2: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.compostedSolidWasteCO2 }),
    totalCO2: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.scope1TotalCO2 }),
    totalCH4: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.scope1TotalCH4 }),
    totalN2O: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.scope1TotalN2O }),
    totalHFCs: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.scope1TotalHFCs }),
    total: z.number().meta({ description: OUTPUTDESCRIPTIONS.scope1Total }),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.scope1 });

export type AquacultureScope1Output = z.infer<
  typeof AquacultureScope1OutputSchema
>;
