import { z } from 'zod';
import { DESCRIPTIONS } from './descriptions.schema';
import { TransportFuelTypes } from './enums';
import { object } from './schemas';

export const TransportFuelInputSchema = object({
  type: z
    .enum(TransportFuelTypes)
    .meta({ description: DESCRIPTIONS.FUEL_TYPE }),
  amountLitres: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.FUEL_CONSUMPTION }),
});

export type TransportFuelInput = z.infer<typeof TransportFuelInputSchema>;
