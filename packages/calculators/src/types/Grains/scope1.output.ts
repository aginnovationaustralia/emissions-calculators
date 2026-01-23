import { outputKey, outputValue } from '@/tools/zod';
import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export const GrainsScope1OutputSchema = z
  .object({
    fuelCO2: outputKey(OUTPUTDESCRIPTIONS.fuelCO2),
    fuelCH4: outputKey(OUTPUTDESCRIPTIONS.fuelCH4),
    fuelN2O: outputKey(OUTPUTDESCRIPTIONS.fuelN2O),
    ureaCO2: outputKey(OUTPUTDESCRIPTIONS.ureaCO2),
    limeCO2: outputKey(OUTPUTDESCRIPTIONS.limeCO2),
    fertiliserN2O: outputKey(OUTPUTDESCRIPTIONS.fertiliserN2O),
    atmosphericDepositionN2O: outputKey(OUTPUTDESCRIPTIONS.atmosphericN2O),
    leachingAndRunoffN2O: outputKey(OUTPUTDESCRIPTIONS.leechingN2O),
    cropResidueN2O: outputKey(OUTPUTDESCRIPTIONS.cropResidueN2O),
    fieldBurningN2O: outputKey(OUTPUTDESCRIPTIONS.fieldBurningN2O),
    fieldBurningCH4: outputKey(OUTPUTDESCRIPTIONS.fieldBurningCH4),
    totalCO2: outputValue(OUTPUTDESCRIPTIONS.scope1TotalCO2),
    totalCH4: outputValue(OUTPUTDESCRIPTIONS.scope1TotalCH4),
    totalN2O: outputValue(OUTPUTDESCRIPTIONS.scope1TotalN2O),
    total: outputValue(OUTPUTDESCRIPTIONS.scope1Total),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.scope1 });

export type GrainsScope1Output = z.infer<typeof GrainsScope1OutputSchema>;
