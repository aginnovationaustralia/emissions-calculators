import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export const RiceScope1OutputSchema = z
  .object({
    fuelCO2: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuelCO2 }),
    limeCO2: z.number().meta({ description: OUTPUTDESCRIPTIONS.limeCO2 }),
    ureaCO2: z.number().meta({ description: OUTPUTDESCRIPTIONS.ureaCO2 }),
    fieldBurningCH4: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.fieldBurningCH4 }),
    riceCultivationCH4: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.riceCultivationCH4 }),
    fuelCH4: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuelCH4 }),
    fertiliserN2O: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.fertiliserN2O }),
    atmosphericDepositionN2O: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.atmosphericN2O }),
    fieldBurningN2O: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.fieldBurningN2O }),
    cropResidueN2O: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.cropResidueN2O }),
    leachingAndRunoffN2O: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.leechingN2O }),
    fuelN2O: z.number().meta({ description: OUTPUTDESCRIPTIONS.fuelN2O }),
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

export type RiceScope1Output = z.infer<typeof RiceScope1OutputSchema>;
