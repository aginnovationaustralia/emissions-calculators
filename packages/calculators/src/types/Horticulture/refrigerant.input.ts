import { Refrigerants } from '@/types/enums';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';

export const HorticultureRefrigerantSchema = z.object({
  refrigerant: z
    .enum(Refrigerants)
    .meta({ description: DESCRIPTIONS.REFRIGERANT }),
  chargeSize: z.number().min(0).meta({
    description: 'Amount of refrigerant contained in the appliance, in kg',
  }),
});

export type HorticultureRefrigerant = z.infer<
  typeof HorticultureRefrigerantSchema
>;
