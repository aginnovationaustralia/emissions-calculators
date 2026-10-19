import { Scope1TotalsSchema } from '@/calculators/types/scope1.output';
import { LULUCFOutputSchema } from '@/modules/lulucf/output';
import { outputKey } from '@/tools/zod';
import { OUTPUTDESCRIPTIONS } from '@/types/descriptions.schema';
import { z } from 'zod';

export const AllModulesScope1OutputSchema = LULUCFOutputSchema.safeExtend({
  ...Scope1TotalsSchema.shape,
  entericBeefCH4: outputKey(OUTPUTDESCRIPTIONS.entericCH4),
  manureManagementBeefCH4: outputKey(OUTPUTDESCRIPTIONS.manureCH4),
  manureAtmosphericDepositionBeefN2O: outputKey(OUTPUTDESCRIPTIONS.manureN2O),
  manureLeachingRunoffBeefN2O: outputKey(OUTPUTDESCRIPTIONS.manureN2O),
  manureSoilDirectBeefN2O: outputKey(OUTPUTDESCRIPTIONS.manureN2O),
  entericFeedlotCH4: outputKey(OUTPUTDESCRIPTIONS.entericCH4),
  manureManagementFeedlotCH4: outputKey(OUTPUTDESCRIPTIONS.manureManagementCH4),
  manureDirectFeedlotN2O: outputKey(OUTPUTDESCRIPTIONS.manureDirectN2O),
  manureAtmosphericDepositionFeedlotN2O: outputKey(
    OUTPUTDESCRIPTIONS.manureAtmosphericDepositionN2O,
  ),
  manureLeachingRunoffFeedlotN2O: outputKey(
    OUTPUTDESCRIPTIONS.manureLeachingRunoffN2O,
  ),
  entericDairyCH4: outputKey(OUTPUTDESCRIPTIONS.entericCH4),
  manureManagementDairyCH4: outputKey(OUTPUTDESCRIPTIONS.manureManagementCH4),
  manureDirectDairyN2O: outputKey(OUTPUTDESCRIPTIONS.manureDirectN2O),
  manureAtmosphericDepositionDairyN2O: outputKey(
    OUTPUTDESCRIPTIONS.manureAtmosphericDepositionN2O,
  ),
  manureLeachingRunoffDairyN2O: outputKey(
    OUTPUTDESCRIPTIONS.manureLeachingRunoffN2O,
  ),
  entericSheepCH4: outputKey(OUTPUTDESCRIPTIONS.entericCH4),
  manureManagementSheepCH4: outputKey(OUTPUTDESCRIPTIONS.manureManagementCH4),
  manureDirectSheepN2O: outputKey(OUTPUTDESCRIPTIONS.manureDirectN2O),
  manureAtmosphericDepositionSheepN2O: outputKey(
    OUTPUTDESCRIPTIONS.manureAtmosphericDepositionN2O,
  ),
  manureLeachingRunoffSheepN2O: outputKey(
    OUTPUTDESCRIPTIONS.manureLeachingRunoffN2O,
  ),
  entericPigsCH4: outputKey(OUTPUTDESCRIPTIONS.entericCH4),
  manureManagementPigsCH4: outputKey(OUTPUTDESCRIPTIONS.manureManagementCH4),
  manureDirectPigsN2O: outputKey(OUTPUTDESCRIPTIONS.manureDirectN2O),
  manureAtmosphericDepositionPigsN2O: outputKey(
    OUTPUTDESCRIPTIONS.manureAtmosphericDepositionN2O,
  ),
  manureLeachingRunoffPigsN2O: outputKey(
    OUTPUTDESCRIPTIONS.manureLeachingRunoffN2O,
  ),
  manureManagementPoultryCH4: outputKey(OUTPUTDESCRIPTIONS.manureManagementCH4),
  manureDirectPoultryN2O: outputKey(OUTPUTDESCRIPTIONS.manureDirectN2O),
  manureAtmosphericDepositionPoultryN2O: outputKey(
    OUTPUTDESCRIPTIONS.manureAtmosphericDepositionN2O,
  ),
  manureLeachingRunoffPoultryN2O: outputKey(
    OUTPUTDESCRIPTIONS.manureLeachingRunoffN2O,
  ),
  entericOtherLivestockCH4: outputKey(OUTPUTDESCRIPTIONS.entericCH4),
  manureManagementOtherLivestockCH4: outputKey(
    OUTPUTDESCRIPTIONS.manureManagementCH4,
  ),
  manureDirectOtherLivestockN2O: outputKey(OUTPUTDESCRIPTIONS.manureDirectN2O),
  manureAtmosphericDepositionOtherLivestockN2O: outputKey(
    OUTPUTDESCRIPTIONS.manureAtmosphericDepositionN2O,
  ),
  manureLeachingRunoffOtherLivestockN2O: outputKey(
    OUTPUTDESCRIPTIONS.manureLeachingRunoffN2O,
  ),
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
  cropResidueN2O: outputKey(OUTPUTDESCRIPTIONS.cropResidueN2O),
  riceCultivationCH4: outputKey(OUTPUTDESCRIPTIONS.riceCultivationCH4),
  fieldBurningN2O: outputKey(OUTPUTDESCRIPTIONS.fieldBurningN2O),
  fieldBurningCH4: outputKey(OUTPUTDESCRIPTIONS.fieldBurningCH4),
  fuelTransportCO2: outputKey(OUTPUTDESCRIPTIONS.transportFuelCO2),
  fuelTransportCH4: outputKey(OUTPUTDESCRIPTIONS.transportFuelCH4),
  fuelTransportN2O: outputKey(OUTPUTDESCRIPTIONS.transportFuelN2O),
  fuelStationaryCO2: outputKey(OUTPUTDESCRIPTIONS.stationaryFuelCO2),
  fuelStationaryCH4: outputKey(OUTPUTDESCRIPTIONS.stationaryFuelCH4),
  fuelStationaryN2O: outputKey(OUTPUTDESCRIPTIONS.stationaryFuelN2O),
  refrigerantHFCs: outputKey(OUTPUTDESCRIPTIONS.hfcsRefrigerant),
  solidWasteCO2: outputKey(OUTPUTDESCRIPTIONS.solidWasteCO2),
  solidWasteCH4: outputKey(OUTPUTDESCRIPTIONS.solidWasteCH4),
  solidWasteN2O: outputKey(OUTPUTDESCRIPTIONS.solidWasteN2O),
  wastewaterCH4: outputKey(OUTPUTDESCRIPTIONS.wastewaterCH4),
  wastewaterN2O: outputKey(OUTPUTDESCRIPTIONS.wastewaterN2O),
  supplementaryCO2: outputKey(OUTPUTDESCRIPTIONS.supplementaryCO2),
  aquaticN2O: outputKey(OUTPUTDESCRIPTIONS.aquaticN2O),
});

export type AllModulesScope1Output = z.infer<
  typeof AllModulesScope1OutputSchema
>;
