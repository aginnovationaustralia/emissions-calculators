import { input } from '@/calculators/Brocessing/types/inputs';
import { mass } from '@/calculators/Brocessing/types/units';
import { Decimal } from 'decimal.js-light';
import { z } from 'zod';
import { DESCRIPTIONS } from './descriptions.schema';
import { Refrigerants } from './enums';
import { object } from './schemas';

export const RefrigerantInputSchema = object({
  refrigerant: z
    .enum(Refrigerants)
    .meta({ description: DESCRIPTIONS.REFRIGERANT })
    .transform((r) => input(`REFRIGERANT[${r}]`, r)),
  chargeSize: z
    .number()
    .min(0)
    .meta({
      description: 'Amount of refrigerant contained in the appliance, in kg',
    })
    .transform((c) =>
      input(`CHARGE_SIZE[${c}]`, mass('Refrigerant', new Decimal(c))),
    ),
});

export type RefrigerantInput = z.infer<typeof RefrigerantInputSchema>;
export type RefrigerantInputTransformed = z.output<
  typeof RefrigerantInputSchema
>;
