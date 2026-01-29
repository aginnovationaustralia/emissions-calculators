import { input } from '@/tools/inputs';
import { volume } from '@/tools/units';
import { DESCRIPTIONS } from '@/types/descriptions.schema';
import { object } from '@/types/schemas';
import Decimal from 'decimal.js-light';
import { z } from 'zod';

export const FuelInputSchema = object({
  dieselUse: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.DIESEL })
    .transform((val) => input('dieselUse', volume('Fuel', new Decimal(val)))),
  petrolUse: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.PETROL })
    .transform((val) => input('petrolUse', volume('Fuel', new Decimal(val)))),
  lpg: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.LPG })
    .transform((val) => input('lpg', volume('Fuel', new Decimal(val)))),
});

export type FuelInput = z.input<typeof FuelInputSchema>;
export type FuelInputTransformed = z.output<typeof FuelInputSchema>;
