import { z } from 'zod';
import { DESCRIPTIONS } from './descriptions.schema';
import { StationaryFuelTypes } from './enums';

export const StationaryFuelInputSchema = z.object({
  type: z
    .enum(StationaryFuelTypes)
    .meta({ description: DESCRIPTIONS.FUEL_TYPE }),
  amountLitres: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.FUEL_CONSUMPTION }),
});

export type StationaryFuelInput = z.infer<typeof StationaryFuelInputSchema>;
