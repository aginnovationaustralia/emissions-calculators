import { FluidWasteTreatmentType } from '@/types/enums';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { object, proportion } from '../schemas';

export const FluidWasteInputSchema = object({
  fluidWasteKl: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.FLUID_WASTE }),
  fluidWasteTreatmentType: z
    .enum(FluidWasteTreatmentType)
    .meta({ description: DESCRIPTIONS.FLUID_WASTE_TREATMENT_TYPE }),
  averageInletCOD: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.AVERAGE_INLET_COD }),
  averageOutletCOD: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.AVERAGE_OUTLET_COD }),
  flaredCombustedFraction: proportion(DESCRIPTIONS.FLARED_COMBUSTED_FRACTION),
});

export type FluidWasteInput = z.infer<typeof FluidWasteInputSchema>;
