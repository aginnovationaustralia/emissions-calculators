import { z } from 'zod';
import { DESCRIPTIONS } from './descriptions.schema';
import { Refrigerants } from './enums';

export const RefrigerantInputSchema = z.object({
  refrigerant: z
    .enum(Refrigerants)
    .meta({ description: DESCRIPTIONS.REFRIGERANT }),
  chargeSize: z.number().meta({
    description: 'Amount of refrigerant contained in the appliance, in kg',
  }),
});

export type RefrigerantInput = z.infer<typeof RefrigerantInputSchema>;
