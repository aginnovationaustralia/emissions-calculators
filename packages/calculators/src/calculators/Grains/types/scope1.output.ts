import { outputKey, outputValue } from '@/tools/zod';
import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from './descriptions.schema';

export const GrainsScope1OutputSchema = z
  .object({
    fuelTransportCO2: outputKey(OUTPUTDESCRIPTIONS.fuelTransportCO2),
    fuelTransportCH4: outputKey(OUTPUTDESCRIPTIONS.fuelTransportCH4),
    fuelTransportN2O: outputKey(OUTPUTDESCRIPTIONS.fuelTransportN2O),
    fuelStationaryCO2: outputKey(OUTPUTDESCRIPTIONS.fuelStationaryCO2),
    fuelStationaryCH4: outputKey(OUTPUTDESCRIPTIONS.fuelStationaryCH4),
    fuelStationaryN2O: outputKey(OUTPUTDESCRIPTIONS.fuelStationaryN2O),
    limeCO2: outputKey(OUTPUTDESCRIPTIONS.limeCO2),
    inorganicFertiliserN2O: outputKey(OUTPUTDESCRIPTIONS.fertiliserN2O),
    organicFertiliserN2O: outputKey(OUTPUTDESCRIPTIONS.fertiliserN2O),
    inorganicFertiliserAtmosphericDepositionN2O: outputKey(
      OUTPUTDESCRIPTIONS.atmosphericN2O,
    ),
    organicFertiliserAtmosphericDepositionN2O: outputKey(
      OUTPUTDESCRIPTIONS.atmosphericN2O,
    ),
    fertiliserLeachingAndRunoffN2O: outputKey(OUTPUTDESCRIPTIONS.leechingN2O),
    residueLeachingAndRunoffN2O: outputKey(OUTPUTDESCRIPTIONS.leechingN2O),
    cropResidueN2O: outputKey(OUTPUTDESCRIPTIONS.cropResidueN2O),
    pastureResidueN2O: outputKey(OUTPUTDESCRIPTIONS.pastureResidueN2O),
    fieldBurningN2O: outputKey(OUTPUTDESCRIPTIONS.fieldBurningN2O),
    fieldBurningCH4: outputKey(OUTPUTDESCRIPTIONS.fieldBurningCH4),
    refrigerantHFCs: outputKey(OUTPUTDESCRIPTIONS.hfcsRefrigerant),
    totalCO2: outputValue(OUTPUTDESCRIPTIONS.scope1TotalCO2),
    totalCH4: outputValue(OUTPUTDESCRIPTIONS.scope1TotalCH4),
    totalN2O: outputValue(OUTPUTDESCRIPTIONS.scope1TotalN2O),
    total: outputValue(OUTPUTDESCRIPTIONS.scope1Total),
  })
  .meta({ description: OUTPUTDESCRIPTIONS.scope1 });

export type GrainsScope1Output = z.infer<typeof GrainsScope1OutputSchema>;
