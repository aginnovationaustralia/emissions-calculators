import { Scope1TotalsSchema } from '@/calculators/types/scope1.output';
import { LULUCFOutputSchema } from '@/modules/lulucf/output';
import { outputKey } from '@/tools/zod';
import { OUTPUTDESCRIPTIONS } from '@/types/descriptions.schema';
import { z } from 'zod';

export const FeedlotScope1OutputSchema = Scope1TotalsSchema.safeExtend({
  entericCH4: outputKey(OUTPUTDESCRIPTIONS.entericCH4),
  manureManagementCH4: outputKey(OUTPUTDESCRIPTIONS.manureManagementCH4),
  manureDirectN2O: outputKey(OUTPUTDESCRIPTIONS.manureDirectN2O),
  manureAtmosphericDepositionN2O: outputKey(
    OUTPUTDESCRIPTIONS.manureAtmosphericDepositionN2O,
  ),
  manureLeachingRunoffN2O: outputKey(
    OUTPUTDESCRIPTIONS.manureLeachingRunoffN2O,
  ),
  fuelTransportCO2: outputKey(OUTPUTDESCRIPTIONS.transportFuelCO2),
  fuelTransportCH4: outputKey(OUTPUTDESCRIPTIONS.transportFuelCH4),
  fuelTransportN2O: outputKey(OUTPUTDESCRIPTIONS.transportFuelN2O),
  fuelStationaryCO2: outputKey(OUTPUTDESCRIPTIONS.stationaryFuelCO2),
  fuelStationaryCH4: outputKey(OUTPUTDESCRIPTIONS.stationaryFuelCH4),
  fuelStationaryN2O: outputKey(OUTPUTDESCRIPTIONS.stationaryFuelN2O),
  solidWasteCO2: outputKey(OUTPUTDESCRIPTIONS.solidWasteCO2),
  solidWasteCH4: outputKey(OUTPUTDESCRIPTIONS.solidWasteCH4),
  solidWasteN2O: outputKey(OUTPUTDESCRIPTIONS.solidWasteN2O),
}).meta({ description: OUTPUTDESCRIPTIONS.scope1 });

export type FeedlotScope1Output = z.infer<typeof FeedlotScope1OutputSchema>;

export const FeedlotScope1OutputSchemaPlusLULUCF =
  FeedlotScope1OutputSchema.extend(LULUCFOutputSchema.shape).meta({
    description: OUTPUTDESCRIPTIONS.scope1,
  });

export type FeedlotScope1OutputPlusLULUCF = z.infer<
  typeof FeedlotScope1OutputSchemaPlusLULUCF
>;
