import { Scope1TotalsSchema } from '@/calculators/types/scope1.output';
import { LULUCFOutputSchema } from '@/modules/lulucf/output';
import { outputKey } from '@/tools/zod';
import { OUTPUTDESCRIPTIONS } from '@/types/descriptions.schema';
import { z } from 'zod';

export const GrainsScope1OutputSchemaWithoutRefrigerants =
  Scope1TotalsSchema.safeExtend({
    fuelTransportCO2: outputKey(OUTPUTDESCRIPTIONS.fuelTransportCO2),
    fuelTransportCH4: outputKey(OUTPUTDESCRIPTIONS.fuelTransportCH4),
    fuelTransportN2O: outputKey(OUTPUTDESCRIPTIONS.fuelTransportN2O),
    fuelStationaryCO2: outputKey(OUTPUTDESCRIPTIONS.fuelStationaryCO2),
    fuelStationaryCH4: outputKey(OUTPUTDESCRIPTIONS.fuelStationaryCH4),
    fuelStationaryN2O: outputKey(OUTPUTDESCRIPTIONS.fuelStationaryN2O),
    limeCO2: outputKey(OUTPUTDESCRIPTIONS.limeCO2),
    inorganicFertiliserN2O: outputKey(
      OUTPUTDESCRIPTIONS.inorganicFertiliserN2O,
    ),
    inorganicFertiliserCO2: outputKey(
      OUTPUTDESCRIPTIONS.inorganicFertiliserCO2,
    ),
    organicFertiliserN2O: outputKey(OUTPUTDESCRIPTIONS.organicFertiliserN2O),
    inorganicFertiliserAtmosphericDepositionN2O: outputKey(
      OUTPUTDESCRIPTIONS.atmosphericN2O,
    ),
    organicFertiliserAtmosphericDepositionN2O: outputKey(
      OUTPUTDESCRIPTIONS.atmosphericN2O,
    ),
    fertiliserLeachingAndRunoffN2O: outputKey(OUTPUTDESCRIPTIONS.leechingN2O),
    residueLeachingAndRunoffN2O: outputKey(OUTPUTDESCRIPTIONS.leechingN2O),
    cropResidueN2O: outputKey(OUTPUTDESCRIPTIONS.cropResidueN2O),
    fieldBurningN2O: outputKey(OUTPUTDESCRIPTIONS.fieldBurningN2O),
    fieldBurningCH4: outputKey(OUTPUTDESCRIPTIONS.fieldBurningCH4),
    solidWasteCO2: outputKey(OUTPUTDESCRIPTIONS.solidWasteCO2),
    solidWasteCH4: outputKey(OUTPUTDESCRIPTIONS.solidWasteCH4),
    solidWasteN2O: outputKey(OUTPUTDESCRIPTIONS.solidWasteN2O),
  });

export const GrainsScope1OutputSchema =
  GrainsScope1OutputSchemaWithoutRefrigerants.safeExtend({
    refrigerantHFCs: outputKey(OUTPUTDESCRIPTIONS.hfcsRefrigerant),
  }).meta({ id: 'GrainsScope1Output', description: OUTPUTDESCRIPTIONS.scope1 });

export type GrainsScope1Output = z.infer<typeof GrainsScope1OutputSchema>;

export const GrainsScope1OutputSchemaPlusLULUCF =
  GrainsScope1OutputSchema.extend(LULUCFOutputSchema.shape).meta({
    id: 'GrainsScope1OutputPlusLULUCF',
    description: OUTPUTDESCRIPTIONS.scope1,
  });

export type GrainsScope1OutputPlusLULUCF = z.infer<
  typeof GrainsScope1OutputSchemaPlusLULUCF
>;
