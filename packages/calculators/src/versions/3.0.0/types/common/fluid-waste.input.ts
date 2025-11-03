import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { proportion } from '../schemas';
import { FluidWasteTreatmentType } from '../types';

export const FluidWasteInputSchema = z.object({
  fluidWasteKl: z.number().meta({ description: DESCRIPTIONS.FLUID_WASTE }),
  fluidWasteTreatmentType: z
    .enum(FluidWasteTreatmentType)
    .meta({ description: DESCRIPTIONS.FLUID_WASTE_TREATMENT_TYPE }),
  averageInletCOD: z
    .number()
    .meta({ description: DESCRIPTIONS.AVERAGE_INLET_COD }),
  averageOutletCOD: z
    .number()
    .meta({ description: DESCRIPTIONS.AVERAGE_OUTLET_COD }),
  flaredCombustedFraction: proportion(DESCRIPTIONS.FLARED_COMBUSTED_FRACTION),
});

export type FluidWasteInput = z.infer<typeof FluidWasteInputSchema>;
