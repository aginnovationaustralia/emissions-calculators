import { Scope1TotalsSchema } from '@/calculators/types/scope1.output';
import { LULUCFOutputSchema } from '@/modules/lulucf/output';
import { outputKey } from '@/tools/zod';
import { OUTPUTDESCRIPTIONS } from '@/types/descriptions.schema';
import { z } from 'zod';

export const ForestryScope1OutputSchema = LULUCFOutputSchema.safeExtend({
  ...Scope1TotalsSchema.shape,
  fuelTransportCO2: outputKey(OUTPUTDESCRIPTIONS.fuelTransportCO2),
  fuelTransportCH4: outputKey(OUTPUTDESCRIPTIONS.fuelTransportCH4),
  fuelTransportN2O: outputKey(OUTPUTDESCRIPTIONS.fuelTransportN2O),
  fuelStationaryCO2: outputKey(OUTPUTDESCRIPTIONS.fuelStationaryCO2),
  fuelStationaryCH4: outputKey(OUTPUTDESCRIPTIONS.fuelStationaryCH4),
  fuelStationaryN2O: outputKey(OUTPUTDESCRIPTIONS.fuelStationaryN2O),
  inorganicFertiliserN2O: outputKey(OUTPUTDESCRIPTIONS.inorganicFertiliserN2O),
  inorganicFertiliserCO2: outputKey(OUTPUTDESCRIPTIONS.inorganicFertiliserCO2),
  organicFertiliserN2O: outputKey(OUTPUTDESCRIPTIONS.organicFertiliserN2O),
  solidWasteCO2: outputKey(OUTPUTDESCRIPTIONS.solidWasteCO2),
  solidWasteCH4: outputKey(OUTPUTDESCRIPTIONS.solidWasteCH4),
  solidWasteN2O: outputKey(OUTPUTDESCRIPTIONS.solidWasteN2O),
}).meta({
  id: 'ForestryScope1Output',
  description: OUTPUTDESCRIPTIONS.scope1,
});

export type ForestryScope1Output = z.infer<typeof ForestryScope1OutputSchema>;
