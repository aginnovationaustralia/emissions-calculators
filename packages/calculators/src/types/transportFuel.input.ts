import { z } from 'zod';
import { DESCRIPTIONS } from './descriptions.schema';
import { TransportFuelTypes } from './enums';

export const TransportFuelInputSchema = z.object({
  type: z
    .enum(TransportFuelTypes)
    .meta({ description: DESCRIPTIONS.FUEL_TYPE }),
  amountLitres: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.FUEL_CONSUMPTION }),
});

export type TransportFuelInput = z.infer<typeof TransportFuelInputSchema>;
