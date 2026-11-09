import { Scope1TotalsSchema } from '@/calculators/types/scope1.output';
import { LULUCFOutputSchema } from '@/modules/lulucf/output';
import { outputKey } from '@/tools/zod';
import { OUTPUTDESCRIPTIONS } from '@/types/descriptions.schema';
import { z } from 'zod';

export const PoultryScope1OutputSchema = Scope1TotalsSchema.safeExtend({
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
}).meta({ id: 'PoultryScope1Output', description: OUTPUTDESCRIPTIONS.scope1 });

export type PoultryScope1Output = z.infer<typeof PoultryScope1OutputSchema>;

export const PoultryScope1OutputSchemaPlusLULUCF =
  PoultryScope1OutputSchema.extend(LULUCFOutputSchema.shape).meta({
    id: 'PoultryScope1OutputPlusLULUCF',
    description: OUTPUTDESCRIPTIONS.scope1,
  });

export type PoultryScope1OutputPlusLULUCF = z.infer<
  typeof PoultryScope1OutputSchemaPlusLULUCF
>;
