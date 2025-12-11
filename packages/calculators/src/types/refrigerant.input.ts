import { z } from 'zod';
import { DESCRIPTIONS } from './descriptions.schema';
import { Refrigerants } from './enums';
import { object } from './schemas';

export const RefrigerantInputSchema = object({
  refrigerant: z
    .enum(Refrigerants)
    .meta({ description: DESCRIPTIONS.REFRIGERANT }),
  chargeSize: z.number().min(0).meta({
    description: 'Amount of refrigerant contained in the appliance, in kg',
  }),
});

export type RefrigerantInput = z.infer<typeof RefrigerantInputSchema>;
