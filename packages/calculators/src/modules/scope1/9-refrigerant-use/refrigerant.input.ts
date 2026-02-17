import {
  RefrigerantTypes,
  RefrigerationTypes,
} from '@/calculators/Grains/constants/enums';
import { input } from '@/tools/inputs';
import { mass } from '@/tools/units';
import { DESCRIPTIONS } from '@/types/descriptions.schema';
import { object } from '@/types/schemas';
import Decimal from 'decimal.js-light';
import { z } from 'zod';

export const RefrigerantInputSchema = object({
  refrigerant: z
    .enum(RefrigerantTypes)
    .meta({ description: DESCRIPTIONS.REFRIGERANT }),
  // .transform((r) => input(`REFRIGERANT[${r}]`, r)),
  chargeSize: z
    .number()
    .min(0)
    .meta({
      description: 'Amount of refrigerant contained in the appliance, in kg',
    })
    .transform((c) => input('chargeSize', mass('Refrigerant', new Decimal(c)))),
  refrigerationType: z.enum(RefrigerationTypes).meta({
    description: 'Type of refrigeration',
  }),
  // .transform((c) =>
  //   input(`CHARGE_SIZE[${c}]`, mass('Refrigerant', new Decimal(c))),
  // ),
});

export type RefrigerantInput = z.input<typeof RefrigerantInputSchema>;
export type RefrigerantInputTransformed = z.output<
  typeof RefrigerantInputSchema
>;
