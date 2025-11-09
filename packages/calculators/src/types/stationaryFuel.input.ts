import { z } from 'zod';
import { DESCRIPTIONS } from './descriptions.schema';
import { StationaryFuelTypes } from './types';

export const StationaryFuelInputSchema = z.object({
  type: z
    .enum(StationaryFuelTypes)
    .meta({ description: DESCRIPTIONS.FUEL_TYPE }),
  amountLitres: z.number().meta({ description: DESCRIPTIONS.FUEL_CONSUMPTION }),
});

export type StationaryFuelInput = z.infer<typeof StationaryFuelInputSchema>;
