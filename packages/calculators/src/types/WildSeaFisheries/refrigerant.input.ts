import { Refrigerants } from '@/types/enums';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { object } from '../schemas';

export const WildSeaFisheriesRefrigerantSchema = object({
  refrigerant: z
    .enum(Refrigerants)
    .meta({ description: DESCRIPTIONS.REFRIGERANT }),
  annualRecharge: z.number().min(0).meta({
    description: 'Amount of refrigerant annually recharged, kg product/year',
  }),
});

export type WildSeaFisheriesRefrigerant = z.infer<
  typeof WildSeaFisheriesRefrigerantSchema
>;
