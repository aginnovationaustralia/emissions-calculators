import { Scope1TotalsSchema } from '@/calculators/types/scope1.output';
import { outputKey } from '@/tools/zod';
import { OUTPUTDESCRIPTIONS } from '@/types/descriptions.schema';
import { z } from 'zod';

export const PostProductionScope1OutputSchema = Scope1TotalsSchema.safeExtend({
  fuelTransportCO2: outputKey(OUTPUTDESCRIPTIONS.fuelTransportCO2),
  fuelTransportCH4: outputKey(OUTPUTDESCRIPTIONS.fuelTransportCH4),
  fuelTransportN2O: outputKey(OUTPUTDESCRIPTIONS.fuelTransportN2O),
  fuelStationaryCO2: outputKey(OUTPUTDESCRIPTIONS.fuelStationaryCO2),
  fuelStationaryCH4: outputKey(OUTPUTDESCRIPTIONS.fuelStationaryCH4),
  fuelStationaryN2O: outputKey(OUTPUTDESCRIPTIONS.fuelStationaryN2O),
  refrigerantHFCs: outputKey(OUTPUTDESCRIPTIONS.hfcsRefrigerant),
  solidWasteCO2: outputKey(OUTPUTDESCRIPTIONS.solidWasteCO2),
  solidWasteCH4: outputKey(OUTPUTDESCRIPTIONS.solidWasteCH4),
  solidWasteN2O: outputKey(OUTPUTDESCRIPTIONS.solidWasteN2O),
  wastewaterCH4: outputKey(OUTPUTDESCRIPTIONS.wastewaterCH4),
  wastewaterN2O: outputKey(OUTPUTDESCRIPTIONS.wastewaterN2O),
  supplementaryCO2: outputKey(OUTPUTDESCRIPTIONS.supplementaryCO2),
});

export type PostProductionScope1Output = z.infer<
  typeof PostProductionScope1OutputSchema
>;
