import { Scope1TotalsSchema } from '@/calculators/types/scope1.output';
import { LULUCFOutputSchema } from '@/modules/lulucf/output';
import { outputKey } from '@/tools/zod';
import { OUTPUTDESCRIPTIONS } from '@/types/descriptions.schema';
import { z } from 'zod';

export const BeefScope1OutputSchema = Scope1TotalsSchema.safeExtend({
  entericCH4: outputKey(OUTPUTDESCRIPTIONS.entericCH4),
  manureManagementCH4: outputKey(OUTPUTDESCRIPTIONS.manureManagementCH4),
  manureAtmosphericDepositionN2O: outputKey(
    OUTPUTDESCRIPTIONS.manureAtmosphericDepositionN2O,
  ),
  manureLeachingRunoffN2O: outputKey(
    OUTPUTDESCRIPTIONS.manureLeachingRunoffN2O,
  ),
  manureSoilDirectN2O: outputKey(OUTPUTDESCRIPTIONS.manureSoilDirectN2O),
  fuelTransportCO2: outputKey(OUTPUTDESCRIPTIONS.transportFuelCO2),
  fuelTransportCH4: outputKey(OUTPUTDESCRIPTIONS.transportFuelCH4),
  fuelTransportN2O: outputKey(OUTPUTDESCRIPTIONS.transportFuelN2O),
  fuelStationaryCO2: outputKey(OUTPUTDESCRIPTIONS.stationaryFuelCO2),
  fuelStationaryCH4: outputKey(OUTPUTDESCRIPTIONS.stationaryFuelCH4),
  fuelStationaryN2O: outputKey(OUTPUTDESCRIPTIONS.stationaryFuelN2O),
  limeCO2: outputKey(OUTPUTDESCRIPTIONS.limeCO2),
  inorganicFertiliserN2O: outputKey(OUTPUTDESCRIPTIONS.inorganicFertiliserN2O),
  inorganicFertiliserCO2: outputKey(OUTPUTDESCRIPTIONS.inorganicFertiliserCO2),
  organicFertiliserN2O: outputKey(OUTPUTDESCRIPTIONS.organicFertiliserN2O),
  inorganicFertiliserAtmosphericDepositionN2O: outputKey(
    OUTPUTDESCRIPTIONS.inorganicFertiliserAtmosphericDepositionN2O,
  ),
  organicFertiliserAtmosphericDepositionN2O: outputKey(
    OUTPUTDESCRIPTIONS.organicFertiliserAtmosphericDepositionN2O,
  ),
  fertiliserLeachingAndRunoffN2O: outputKey(
    OUTPUTDESCRIPTIONS.fertiliserLeachingAndRunoffN2O,
  ),
  residueLeachingAndRunoffN2O: outputKey(
    OUTPUTDESCRIPTIONS.residueLeachingAndRunoffN2O,
  ),
  pastureResidueN2O: outputKey(OUTPUTDESCRIPTIONS.pastureResidueN2O),
  solidWasteCO2: outputKey(OUTPUTDESCRIPTIONS.solidWasteCO2),
  solidWasteCH4: outputKey(OUTPUTDESCRIPTIONS.solidWasteCH4),
  solidWasteN2O: outputKey(OUTPUTDESCRIPTIONS.solidWasteN2O),
}).meta({ id: 'BeefScope1Output', description: OUTPUTDESCRIPTIONS.scope1 });

export type BeefScope1Output = z.infer<typeof BeefScope1OutputSchema>;

export const BeefScope1OutputSchemaPlusLULUCF = BeefScope1OutputSchema.extend(
  LULUCFOutputSchema.shape,
).meta({
  id: 'BeefScope1OutputPlusLULUCF',
  description: OUTPUTDESCRIPTIONS.scope1,
});

export type BeefScope1OutputPlusLULUCF = z.infer<
  typeof BeefScope1OutputSchemaPlusLULUCF
>;
