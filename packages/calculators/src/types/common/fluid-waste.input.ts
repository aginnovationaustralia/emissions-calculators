import { FluidWasteTreatmentType } from '@/types/enums';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { object, proportion } from '../schemas';

export const FluidWasteInputSchema = object({
  fluidWasteKl: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.FLUID_WASTE }),
  // .transform((value) =>
  //   input('fluidWasteKl', mass('FluidWaste', new Decimal(value))),
  // ),
  fluidWasteTreatmentType: z
    .enum(FluidWasteTreatmentType)
    .meta({ description: DESCRIPTIONS.FLUID_WASTE_TREATMENT_TYPE }),
  averageInletCOD: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.AVERAGE_INLET_COD }),
  // .transform((value) =>
  //   input(
  //     'averageInletCOD',
  //     massPerVolume('Oxygen', 'FluidWaste', new Decimal(value)),
  //   ),
  // ),
  averageOutletCOD: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.AVERAGE_OUTLET_COD }),
  // .transform((value) =>
  //   input(
  //     'averageOutletCOD',
  //     massPerVolume('Oxygen', 'FluidWaste', new Decimal(value)),
  //   ),
  // ),
  flaredCombustedFraction: proportion(
    DESCRIPTIONS.FLARED_COMBUSTED_FRACTION,
    // ).transform((value) =>
    //   input('flaredCombustedFraction', realNumber(new Decimal(value))),
  ),
});

export type FluidWasteInput = z.input<typeof FluidWasteInputSchema>;

export type FluidWasteInputTransformed = z.infer<typeof FluidWasteInputSchema>;
