import { outputKey, outputValue } from '@/tools/zod';
import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../../Grains/types/descriptions.schema';

export const BeefScope1OutputSchema = z
  .object({
    entericCH4: outputKey(OUTPUTDESCRIPTIONS.entericCH4),
    manureManagementCH4: outputKey(OUTPUTDESCRIPTIONS.manureManagementCH4),
    manureManagementN2O: outputKey(OUTPUTDESCRIPTIONS.manureManagementN2O),
    fertiliserUseN2O: outputKey(OUTPUTDESCRIPTIONS.fertiliserUseN2O),
    agricultureResidueManagementN2O: outputKey(
      OUTPUTDESCRIPTIONS.agricultureResidueManagementN2O,
    ),
    transportFuelCO2: outputKey(OUTPUTDESCRIPTIONS.transportFuelCO2),
    transportFuelCH4: outputKey(OUTPUTDESCRIPTIONS.transportFuelCH4),
    transportFuelN2O: outputKey(OUTPUTDESCRIPTIONS.transportFuelN2O),
    stationaryFuelCO2: outputKey(OUTPUTDESCRIPTIONS.stationaryFuelCO2),
    stationaryFuelCH4: outputKey(OUTPUTDESCRIPTIONS.stationaryFuelCH4),
    stationaryFuelN2O: outputKey(OUTPUTDESCRIPTIONS.stationaryFuelN2O),
    solidWasteTreatmentN2O: outputKey(
      OUTPUTDESCRIPTIONS.solidWasteTreatmentN2O,
    ),
    totalCO2: outputValue(OUTPUTDESCRIPTIONS.scope1TotalCO2),
    totalCH4: outputValue(OUTPUTDESCRIPTIONS.scope1TotalCH4),
    totalN2O: outputValue(OUTPUTDESCRIPTIONS.scope1TotalN2O),
    total: outputValue(OUTPUTDESCRIPTIONS.scope1Total),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.scope1 });

export type BeefScope1Output = z.infer<typeof BeefScope1OutputSchema>;
