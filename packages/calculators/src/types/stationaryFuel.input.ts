import { input } from '@/calculators/Brocessing/types/inputs';
import { mass } from '@/calculators/Brocessing/types/overloads';
import { Decimal } from 'decimal.js-light';
import { z } from 'zod';
import { DESCRIPTIONS } from './descriptions.schema';
import { StationaryFuelTypes } from './enums';
import { object } from './schemas';

export const StationaryFuelInputSchema = object({
  type: z
    .enum(StationaryFuelTypes)
    .meta({ description: DESCRIPTIONS.FUEL_TYPE })
    .transform((t) => input(`STATIONARY_FUEL[${t}]`, t)),
  amountLitres: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.FUEL_CONSUMPTION })
    .transform((a) =>
      input(`AMOUNT_LITRES[${a}]`, mass('Fuel', new Decimal(a))),
    ),
});

export type StationaryFuelInput = z.infer<typeof StationaryFuelInputSchema>;
